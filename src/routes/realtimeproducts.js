import {Router} from 'express';
import ProdManager from '../DAO/ProductDAO.js';
const realtimeproductRouter = Router();

const prodmanager = new ProdManager();

realtimeproductRouter.get('/', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    let filter = req.query.filter;
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
        prevLink: products.hasPrevPage?`http://localhost:8080/products/page/${products.prevPage}/limit/${limit}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/products/page/${products.nextPage}/limit/${limit}`:'',
    }
    res.render('realTimeProducts', {data, style:'index.css'})
})

realtimeproductRouter.get('/page/:page/limit/:limit', async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    let filter = req.query.filter;
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
        nextPage: products.nextPage
    }
    res.render('realTimeProducts', {data, style:'index.css'})
})

export default realtimeproductRouter
