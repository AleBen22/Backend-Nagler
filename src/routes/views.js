import {Router} from 'express';
import { ProductManager } from '../datos/ProductManager.js';
const viewsRouter = Router();

const prodmanager = new ProductManager();

viewsRouter.get('/', async (req, res) => {
    let products = await prodmanager.getProducts()

    res.render('index', {products, style:'index.css'})
})

export default viewsRouter