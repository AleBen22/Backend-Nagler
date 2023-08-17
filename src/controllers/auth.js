import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getByEmailService,
    createUserService,
    updateUserPasswordService
} from '../services/auth.js';
import {
    getAllProductsService,
} from '../services/product.js';
import {
    createCartService
}   from '../services/cart.js'

import { generateToken, authToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/index.js";

export const githubLoginController = async (req, res) => {}

export const githubcallbackLoginController = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
}

export const getUserController =  (req, res) => {
    res.render('register', {})
}

export const newUserController = async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;
    if(!first_name || !last_name || !email || !password || !age) return res.send({status: 'error', error: 'Imcomplete infomation for user creation'})
    let userFound = await getByEmailService(email);
    let cart = await createCartService()
    if(userFound) return res.status(400).send({status: 'error', error: 'User already exists'})
    password = createHash(password);
    const newUser = {
        first_name,
        last_name,
        email,
        cart,
        password,
        age
    }
    createUserService(newUser)
    res.render('login', {msg: 'User registered successfully'})
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
    res.cookie('authToken', access_token).render('index', {data, contact, style:'index.css'})
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
    res.render('restore-password', {})
}

export const newRestoreController = async (req, res) => {
    let user = req.body;
    let userFound = await getByEmailService(user.email);
    if(!userFound) {
        res.render('register', {})
    }else{
        let newPassword = createHash(user.password);
        await updateUserPasswordService(user.email, newPassword)
    }
    res.render('login', {})
}