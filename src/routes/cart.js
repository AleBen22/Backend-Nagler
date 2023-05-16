import {Router} from 'express';
import { CartManager } from '../datos/CartManager.js';
import { ProductManager } from '../datos/ProductManager.js';
const cartRouter = Router();

const manager = new CartManager();
const prodmanager = new ProductManager();

cartRouter.get('/', async (req, res) => {
    let carts = await manager.getCarts()
    res.send(carts)
})

cartRouter.get('/:cid', async (req, res) => {
    let id = req.params.cid;
    let cart = await manager.getCartById(id)
    if (!cart) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un carrito` });
    }
        res.send(cart)
})

cartRouter.post('/', async (req, res) => {
    let cart = await manager.createCart();
    if (!cart) {
        res.status(400).send({ status: 'error', msg: `Hubo un error al generar el carrito` });
    }
        res.send({ status: "success", msg: `Cart created` })    
})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let product = await prodmanager.getProductById(pid)
    if (!product) {
        res.status(400).send({ status: 'error', msg: `El product id ${pid} no corresponde a un producto existente` });
    } else {   
    let addToCart = await manager.addProductToCart(cid, pid)
    if(!addToCart){
        res.status(400).send({ status: 'error', msg: 'Cart not found'})
    }
        res.send({ status: 'success', msg: 'Cart updated'})
    }
})

export default cartRouter;