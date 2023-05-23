import {Router} from 'express';
import { ProductManager } from '../datos/ProductManager.js';
const realtimeproductRouter = Router();

const prodmanager = new ProductManager();

realtimeproductRouter.get('/', async (req, res) => {
    let products = await prodmanager.getProducts()
    res.render('realTimeProducts', {products, style:'index.css'})
})

export default realtimeproductRouter
