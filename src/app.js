import express from 'express';
import { ProductManager } from './ProductManager.js';
const app = express();

app.use(express.urlencoded({extended: true}));

const manager = new ProductManager();

app.get('/products', async (req, res) => {
    let products = await manager.getProducts()
    let limit = req.query.limit
    let limitfilter
    if (limit > products.length) {
        limitfilter = { msg: "No enough products" }
    } else {
        limitfilter = products.filter((filt) => filt.id <= limit)
    }
    res.send(limit ? limitfilter : products)
})

app.get('/products/:pid', async (req, res) => {
    let id = req.params.pid;
    let product = await manager.getProductById(id)
    res.send(product)
})

const server = app.listen(8080, () => console.log('Server is running on port: 8080'))