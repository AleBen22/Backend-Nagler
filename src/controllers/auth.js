import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getByEmailService,
    getByIdService,
    createUserService,
    updateUserPasswordService,
    updateUserRoleService
} from '../services/auth.js';
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
    if(!user.first_name || !user.last_name || !user.email || !user.password || !user.age) return res.send({status: 'error', error: 'Imcomplete infomation for user creation'})
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
        age: user.age
    }
    let result = createUserService(newUser)
    //res.render('login', {msg: 'User registered successfully'})
    res.send({status: 'success', payload: result})
}

export const failCreateUserController =  async(req, res) => {
    res.render('register-error', {})
}

export const getLoginController = (req, res) => {
    res.render('login', {style:'index.css'})
}

export const newLoginController = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.send({status: 'error', error: 'Imcomplete infomation for user login'})
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
    //res.cookie('authToken', access_token).render('index', {data, contact, style:'index.css'})
    res.cookie('authToken', access_token).send({status: 'success', payload: contact})
}

export const failCreateLoginController = (req, res) => {
    res.render('login-error', {})
}

export const getLogoutController =(req, res) => {
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
        if(!user) {
            res.render('register', {})
        }else{
            if(user.role === "premium"){
                await updateUserRoleService(uid, 'user')
            } else if(user.role === "user"){
                await updateUserRoleService(uid, 'premium')
            }
            res.redirect('/')
        }
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
}