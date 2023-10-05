import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getByEmailService,
    getByIdService,
    createUserService,
    updateUserPasswordService,
    updateUserRoleService,
    updateUserConnectionService,
    updateUserDocsService
} from '../services/users.js';
import {
    getAllProductsService,
} from '../services/product.js';
import {
    createCartService
}   from '../services/cart.js'
import { generateToken, authToken, recoverToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/index.js";
import { sendMail, createOptions } from "../services/mailing.js";

export const githubLoginController = async (req, res) => {}

export const githubcallbackLoginController = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
}

export const getUserController =  (req, res) => {
    res.render('register', {})
}

export const newUserController = async (req, res) => {
    let user = req.body;
    if(!user.first_name || !user.last_name || !user.email || !user.password || !user.age) return res.status(400).send({status: 'error', error: 'Imcomplete infomation for user creation'})
    let userFound = await getByEmailService(user.email);
    let cart = await createCartService()
    if(userFound) return res.status(400).send({status: 'error', error: 'User already exists'})
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
    //res.render('login', {msg: 'User registered successfully'})
    res.send({status: 'success', payload: result})
}

export const failCreateUserController =  async(req, res) => {
    res.render('register-error', {})
    }

export const getLoginController = async (req, res) => {
//    res.render('login', {style:'index.css'})
    res.send({status: 'success', payload: userFound})
}

export const newLoginController = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).send({status: 'error', error: 'Imcomplete infomation for user login'})
    const user = await getByEmailService(email);
    if(!user) return res.status(400).send({status: 'error', error: 'User not found'});
    if(!isValidPassword(user, password)) return res.status(400).send({status: 'error', error: 'Invalid credentials'})
    const access_token = generateToken(user)
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    let data
        try {
            data = await getAllProductsService(page, limit)
        } catch (error) {
            res.status(400).send({status: "error", error})
        }
        if(!user) return res.render('login-error', {})
        req.session.user = user.email
        req.session.role = user.role
        const rol = user.role
        const admin = req.session.admin
        let contact = new ContactDTO({user, rol, admin})
        updateUserConnectionService(req.session.user)
    //res.cookie('authToken', access_token).render('index', {data, contact, style:'index.css'})
    res.cookie('authToken', access_token).send({status: 'success', payload: contact})
}

export const failCreateLoginController = (req, res) => {
    res.render('login-error', {})
}

export const getLogoutController =(req, res) => {
    updateUserConnectionService(req.session.user)
    req.session.destroy(error => {
        res.render('login', {})
    })
}

export const getRestoreController = (req, res) => {
    let user = req.params.user
    res.render('restore-password', { user })
}

export const newRestoreController = async (req, res) => {
    let { email , password } = req.body;
    let userFound = await getByEmailService(email);
    if(!userFound) {
        res.render('register', {})
    }else{
        let newPassword = createHash(password);
        if(isValidPassword(userFound, password)){
            res.render('restore-password', { user: email, error: 'La contraseña no puede ser la misma' })
        }else{
            await updateUserPasswordService(email, newPassword)
            res.render('login', {})    
        }
    }
}

export const getRecoverController = (req, res) => {
    res.render('recover-password', {})
}

export const newRecoverController = async (req, res) => {
    let user = req.body;
    let userFound = await getByEmailService(user.email);
    if(!userFound) {
        res.render('register', {})
    }else{
        const access_token = recoverToken(user)
        const data = {
            to: userFound.email,
            link: `${process.env.RESTORE_PASS_HTML}/${access_token}/${userFound.email}`,
        }
        let options = createOptions(data)

        let mailResult = await sendMail(options)
        res.send({status: 'success', payload: mailResult})
    }
}

export const modUserRoleController = async (req, res) => {
    try {
        let uid = req.params.uid;
        let user = await getByIdService(uid);
        let result
        if(!user) {
            res.render('register', {})
        }else{
            if(user.role === "premium"){
                result = await updateUserRoleService(uid, 'user')
                res.send({status: 'success', payload: result})
            } else if(user.role === "user"){
                if(user.documents.length !== 3){
                    res.status(400).send({status: "error", error: "No terminaste de cargar documentos, finaliza la carga para poder continuar"})                    
                } else {
                    result = await updateUserRoleService(uid, 'premium')
                    res.send({status: 'success', payload: result})
                }
            }
//            res.redirect('/')
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