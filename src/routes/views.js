import {Router} from 'express';
import { authMiddleware } from "../middlewares/auth.js";
import ProdManager from '../DAO/ProductDAO.js';
const viewsRouter = Router();

const prodmanager = new ProdManager();

viewsRouter.get('/', authMiddleware, async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
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

viewsRouter.get('/limit/:limit?', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
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
    res.render('index', {data, style:'index.css'})
})

viewsRouter.get('/page/:page?', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
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
    res.render('index', {data, style:'index.css'})
})

viewsRouter.get('/limit/:limit?/page/:page?', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
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
    res.render('index', {data, style:'index.css'})
})

export default viewsRouter