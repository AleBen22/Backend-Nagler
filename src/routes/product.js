import {Router} from 'express';
import { ProductManager } from '../datos/ProductManager.js';
import { validateProduct } from '../utils/index.js';
const productRouter = Router();

const manager = new ProductManager();

productRouter.get('/', async (req, res) => {
    let products = await manager.getProducts()
    let limit = req.query.limit
    let limitfilter
    if (limit > products.length) {
        limitfilter = products
    } else {
        limitfilter = products.filter((filt) => filt.id <= limit)
    }
    res.send(limit ? limitfilter : products)
})

productRouter.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    let product = await manager.getProductById(id)
    if (!product) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto` });
    }
        res.send(product) 
})

productRouter.post('/', async (req, res) => {
    let producto = req.body;
    if(!validateProduct(producto)) {
        res.status(400).send({ status: 'error', msg: 'Falta información'})
    }
    let result = await manager.addProduct(producto)
    res.send(result)
})

productRouter.put('/:pid', async (req, res) => {
    let id = req.params.pid;
    let fields = req.body;
    let updateProd = await manager.updateProduct(id, fields)
    if(!updateProd){
        res.status(400).send({ status: 'error', msg: 'Product not found'})
    }
        res.send({ status: 'success', msg: 'Product updated'})
})

productRouter.delete('/:pid', async (req, res) => {
    let id = req.params.pid;
    let deleteProd = await manager.deleteProduct(id)
    if(!deleteProd){
        res.status(400).send({ status: 'error', msg: 'Product not found'})
    }
        res.send({ status: 'success', msg: 'Product deleted'})
})

export default productRouter;