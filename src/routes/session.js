import { Router } from "express";
import { createUser, getAll, getByEmail } from '../DAO/SessionDAO.js'
import { authMiddleware } from "../middlewares/auth.js";
import ProdManager from '../DAO/ProductDAO.js';
const sessionRouter = Router();

const prodmanager = new ProdManager();

sessionRouter.get('/register', (req, res) => {
    res.render('register', {})
})

sessionRouter.post('/register', async (req, res) => {
    let user = req.body;
    let userFound = await getByEmail(user.email);
    if(userFound){
        res.render('register-error', {user: user.email})
    }
    let result = await createUser(user)
    res.render('login', {})
})

sessionRouter.get('/login', (req, res) => {
    res.render('login', {})
})

sessionRouter.post('/login', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    let products
    try {
        products = await prodmanager.getAllProducts(page, limit)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    let data = {
        payload: products.docs,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        prevPage: products.prevPage,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevLink: products.hasPrevPage?`http://localhost:8080/limit/${limit}/page/${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/limit/${limit}/page/${products.nextPage}`:'',
    }
    
    let user = req.body;
    if(user.email == "adminCoder@coder.com" && user.password == "adminCod3r123"){
        req.session.admin = true
        req.session.user = user.email;
        res.render('index', {data, user: req.session.user, rol: req.session.admin ? "admin" : "usuario"})    
    }else{
        let result = await getByEmail(user.email)
        if(!result){
            res.render('login-error', {})
        }else{
            if(user.password !== result.password){
                res.render('login-error', {})
            }else{
                req.session.admin = false
                req.session.user = user.email;
                res.render('index', {data, user: req.session.user, rol: req.session.admin ? "admin" : "usuario"})
            }
        }
    }
})

sessionRouter.get('/products', authMiddleware, (req, res) => {
    res.render('index', {user: req.session.user})
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        res.render('login', {})
    })
})

export default sessionRouter;