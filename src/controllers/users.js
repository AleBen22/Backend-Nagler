import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getUsersService,
    getAllUsersService,
    getByEmailService,
    getByIdService,
    createUserService,
    deleteUserService,
    updateUserPasswordService,
    updateUserRoleService,
    updateUserConnectionService,
    updateUserDocsService
} from '../services/users.js';
import {
    createCartService
}   from '../services/cart.js'
import {
    generateToken,
    recoverToken
} from "../config/jwt.js";
import {
    createHash,
    isValidPassword
} from "../utils.js";
import {
    sendMail,
    createOptionsRecover,
    createOptionsUserDeleted
} from "../services/mailing.js";


export const getUsersController = async (req, res) => {
    let users = await getUsersService()
    res.render('user-config', {users, style: 'index.css'})
//    res.send({status: 'success', payload: contact})
} 

export const githubLoginController = async (req, res) => {}

export const githubcallbackLoginController = async (req, res) => {
    const access_token = generateToken(req.user)
    res.cookie('authToken', access_token, { httpOnly: true}).redirect('/')
}

export const getUserController =  (req, res) => {
    res.render('register', { style: 'index.css' })
}

export const newUserController = async (req, res) => {
    let user = req.body;
    if(!user.first_name || !user.last_name || !user.email || !user.password || !user.age) return res.render('error', { msg: 'Imcomplete information for user creation' })
    let userFound = await getByEmailService(user.email);
    if(userFound) return res.render('register-error', {})
    let cart = await createCartService()
    user.password = createHash(user.password);
    const newUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cart: cart,
        password: user.password,
        age: user.age,
        role: user.role
    }
    let result = await createUserService(newUser)
    res.render('login', {msg: 'User registered successfully', style: 'index.css'})
    //res.send({status: 'success', payload: result})
}

export const getLoginController = async (req, res) => {
    res.render('login', {style: 'index.css'})
//    res.send({status: 'success', payload: userFound})
}

export const newLoginController = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.render('login', {msg:'Imcomplete infomation for user login'})
    const foundUser = await getByEmailService(email);
    if(!foundUser) return res.render('login-error', {})
    if(!isValidPassword(foundUser, password)) return res.render('login', {msg:'Invalid credentials'})
    let user = new ContactDTO(foundUser)
    const access_token = generateToken(user)
        updateUserConnectionService(user.user)
    res.cookie('authToken', access_token, {httpOnly: true}).redirect('/')
    //res.cookie('authToken', access_token).send({status: 'success', payload: contact})
}

export const failCreateLoginController = (req, res) => {
    res.render('login-error', {style: 'index.css'})
}

export const getLogoutController =(req, res) => {
    updateUserConnectionService(req.user)
    req.session.destroy(error => {
        res.render('login', {style: 'index.css'})
    })
}

export const getRestoreController = (req, res) => {
    let user = req.params.user
    res.render('restore-password', { user, style: 'index.css' })
}

export const newRestoreController = async (req, res) => {
    let { email , password } = req.body;
    let userFound = await getByEmailService(email);
    if(!userFound) {
        res.render('register', {style: 'index.css'})
    }else{
        let newPassword = createHash(password);
        console.log(userFound)
        if(isValidPassword(userFound, password)){
            res.render('restore-password', { user: email, error: 'La contraseña no puede ser la misma', style: 'index.css' })
        }else{
            await updateUserPasswordService(email, newPassword)
            res.render('login', {style: 'index.css'})    
        }
    }
}

export const getRecoverController = (req, res) => {
    res.render('recover-password', {style: 'index.css'})
}

export const newRecoverController = async (req, res) => {
    let user = req.body;
    let userFound = await getByEmailService(user.email);
    if(!userFound) {
        res.render('register', {style: 'index.css'})
    }else{
        const access_token = recoverToken(user)
        const data = {
            to: userFound.email,
            link: `${process.env.RESTORE_PASS_HTML}/${access_token}/${userFound.email}`,
        }
        let options = createOptionsRecover(data)
        await sendMail(options)
        res.render('login', {msg: 'Se envió un correo de recuperación a su mail', style: 'index.css'}) 
        //        res.send({status: 'success', payload: mailResult})
    }
}

//Sin Vistas
export const deleteUsersController = async (req, res) => {
    let users = await getAllUsersService()
    console.log(users)
    let limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 2 );
    let count = 0
    for(var i = 0; i < users.length;i++){
        if(users[i].last_connection > limitDate ){
        }else{
            await deleteUserService(users[i]._id)
            const data = {
                to: users[i].email,
            }
            console.log(data)
            let options = createOptionsUserDeleted(data)
            let mailResult = await sendMail(options)
            count += 1
        }
    }
    res.send({status: 'success', payload: `Se eliminaron ${count} usuarios en desuso`})
}

export const modUserRoleController = async (req, res) => {
    try {
        let uid = req.params.uid;
        let user = await getByIdService(uid);
        let result
        if(!user) {
            res.render('register', {style: 'index.css'})
        }else{
            if(user.role === "premium"){
                result = await updateUserRoleService(uid, 'user')
            } else if(user.role === "user"){
                if(user.documents.length !== 3){
                    return res.status(400).send({status: "error", error: "No terminaste de cargar documentos, finaliza la carga para poder continuar"})                    
                } else {
                    result = await updateUserRoleService(uid, 'premium')
                }
            }
            res.send({status: 'success', payload: result})
        }
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
}

export const docsController = async (req, res) => {
    try {
        if(!req.files){res.status(400).send({status: "error", error: "No se pudo guardar el documento"})}
        let docs = Object.keys(req.files)
        const uid = req.params.uid;
        const newFile = []
        let doc
        for (let i = 0; i < docs.length; i++) {
            const info = Object.assign({},Object.assign({},req.files)[docs[i]])
            if (docs[i] === 'id' || docs[i] === 'statement' || docs[i] === 'address') {
                doc = {
                    name: info[0].fieldname,
                    reference: `/uploads/documents/${info[0].filename}`
                }
            } else  if (docs[i] === 'products') {
                doc = {
                    name: info[0].fieldname,
                    reference: `/uploads/products/${info[0].filename}`
                }
            } else  if (docs[i] === 'profiles') {
                doc = {
                    name: info[0].fieldname,
                    reference: `/uploads/profiles/${info[0].filename}`
                }
            }
                newFile.push(doc)
        }
        let result = await updateUserDocsService(uid, newFile)
        res.send({status: 'success', msg: `Se subieron los siguientes documentos: ${docs}`, payload: result})
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
}