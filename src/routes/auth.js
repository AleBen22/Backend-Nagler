import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.js";
import ProdManager from '../DAO/ProductDAO.js';
import { getByEmail, createUser } from "../DAO/UserDAO.js";
import passport from "passport";
import { generateToken, authToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/index.js";

const authRouter = Router();

const prodmanager = new ProdManager();

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), async (req, res) =>{})

authRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
})

authRouter.get('/register', (req, res) => {
    res.render('register', {})
})

authRouter.post('/register', async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;
    if(!first_name || !last_name || !email || !password || !age) return res.send({status: 'error', error: 'Imcomplete infomation for user creation'})
    let userFound = await getByEmail(email);
    if(userFound) return res.status(400).send({status: 'error', error: 'User already exists'})
    password = createHash(password);
    const newUser = {
        first_name,
        last_name,
        email,
        password,
        age
    }
    await createUser(newUser)
    res.render('login', {msg: 'User registered successfully'})
    //res.send({status: 'success', msg: 'User registered successfully'})
})
// authRouter.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), async (req, res) => {
//     res.render('login', {})
// })

authRouter.get('/failregister', async(req, res) => {
    res.render('register-error', {})
})

authRouter.get('/login', (req, res) => {
    res.render('login', {style:'index.css'})
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.send({status: 'error', error: 'Imcomplete infomation for user login'})
    const user = await getByEmail(email);
    if(!user) return res.status(400).send({status: 'error', error: 'User not found'});
    if(!isValidPassword(user, password)) return res.status(400).send({status: 'error', error: 'Invalid credentials'})
    const access_token = generateToken(user)

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
        if(!user) return res.render('login-error', {})
        req.user = user.email
        req.admin = user.admin

    res.cookie('authToken', access_token).render('index', {data, user: req.user, rol: req.admin ? "admin" : "usuario", style:'index.css'})
})
// authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin'}), async (req, res) => {
//     let page = req.params.page || 1;
//     let limit = req.params.limit || 10;
//     let products
//     try {
//         products = await prodmanager.getAllProducts(page, limit)
//     } catch (error) {
//         res.status(400).send({status: "error", error})
//     }
//     let data = {
//         payload: products.docs,
//         totalPages: products.totalPages,
//         hasPrevPage: products.hasPrevPage,
//         prevPage: products.prevPage,
//         hasNextPage: products.hasNextPage,
//         nextPage: products.nextPage,
//         prevLink: products.hasPrevPage?`http://localhost:8080/limit/${limit}/page/${products.prevPage}`:'',
//         nextLink: products.hasNextPage?`http://localhost:8080/limit/${limit}/page/${products.nextPage}`:'',
//     }
//     if(!req.user) return res.render('login-error', {})
//     req.session.user = req.user.email
//     req.session.admin = req.user.admin
//     res.render('index', {data, user: req.session.user, rol: req.session.admin ? "admin" : "usuario", style:'index.css'})
// })

authRouter.get('/faillogin', (req, res) => {
    res.render('login-error', {})
})


authRouter.get('/current', passport.authenticate('current', { session:false}), (req, res) => {
    let user = req.user
    user = user["user"]
    //res.send(req.user)
    res.render('index', {user: user.email, rol: user.role, style:'index.css'})
})

// authRouter.get('/products', authMiddleware, (req, res) => {
//     res.render('index', {user: req.session.user})
// })

authRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        res.render('login', {})
    })
})

authRouter.get('/restore', (req, res) => {
    res.render('restore-password', {})
})

authRouter.post('/restore', async (req, res) => {
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

export default authRouter;