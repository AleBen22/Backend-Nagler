import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import ProdManager from '../DAO/ProductDAO.js';
import passport from "passport";

const sessionRouter = Router();

const prodmanager = new ProdManager();

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), async (req, res) =>{})

sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
})

sessionRouter.get('/register', (req, res) => {
    res.render('register', {})
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), async (req, res) => {
    res.render('login', {})
})

sessionRouter.get('/failregister', async(req, res) => {
    res.render('register-error', {})
})

sessionRouter.get('/login', (req, res) => {
    res.render('login', {style:'index.css'})
})

sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin'}), async (req, res) => {
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
    if(!req.user) return res.render('login-error', {})
    req.session.user = req.user.email
    req.session.admin = req.user.admin
    res.render('index', {data, user: req.session.user, rol: req.session.admin ? "admin" : "usuario", style:'index.css'})
})

sessionRouter.get('/faillogin', (req, res) => {
    res.render('login-error', {})
})

sessionRouter.get('/products', authMiddleware, (req, res) => {
    res.render('index', {user: req.session.user})
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        res.render('login', {})
    })
})

sessionRouter.get('/restore', (req, res) => {
    res.render('restore-password', {})
})

sessionRouter.post('/restore', async (req, res) => {
    let user = req.body;
    let userFound = await getByEmail(user.email);
    if(!userFound) {
        res.render('register', {})
    }else{
        let newPassword = createHash(user.password);
        let result = await updateUserPassword(user.email, newPassword)
    }
    res.render('login', {})
})

export default sessionRouter;