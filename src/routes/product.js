import {Router} from 'express';
// import { ProductManager } from '../DAO/datos/ProductManager.js';
import ProdManager from '../DAO/ProductDAO.js';
import { validateProduct } from '../utils/index.js';
const productRouter = Router();

// const manager = new ProductManager();
const manager = new ProdManager();

productRouter.get('/', async (req, res) => {
    let products
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    let filter = req.query.filter;

    try {
        products = await manager.getAllProducts(page, limit)
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
        prevLink: products.hasPrevPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.nextPage}`:'',
    }
    res.send(data)
})

productRouter.get('/limit/:limit?/page/:page?', async (req, res) => {
    let products
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    let filter = req.query.filter;

    try {
        products = await manager.getAllProducts(page, limit)
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
        prevLink: products.hasPrevPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.nextPage}`:'',
    }
    res.send(data)
})

productRouter.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    let product
    try {
        product = await manager.getProductById(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto` });
    }
        res.send({ status: "success", product }) 
})

productRouter.post('/', async (req, res) => {
    let {title, description, code, price, stock, category, status } = req.body;
    let producto = req.body;
    let result
    if(!validateProduct(producto)) {
        res.status(400).send({ status: 'error', msg: 'Falta información'})
    }
    try {
        result = await manager.addProduct(title, description, code, price, stock, category, status)
    } catch (error) {
        res.status(400).send({ status: 'error', error });
    }
        res.send({ status: "success", payload: result })
})

productRouter.put('/:pid', async (req, res) => {
    let id = req.params.pid;
    let { title, description, code, price, stock, category, status } = req.body;
    let fields = req.body;
    if(!validateProduct(fields)) {
        res.status(400).send({ status: 'error', msg: 'Falta información'})
    }
    let updateProd
    try {
        updateProd = await manager.updateProduct(id, { title, description, code, price, stock, category, status })
    } catch (error) {
        res.status(400).send({ status: 'error', error})
    }
        res.send({ status: 'success', payload: updateProd})
})

productRouter.delete('/:pid', async (req, res) => {
    let id = req.params.pid;
    let deleteProd
    try {
        deleteProd = await manager.deleteProduct(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto`})
    }
        res.send({ status: 'success', msg: `El id ${id} fue eliminado`})
})

export default productRouter;