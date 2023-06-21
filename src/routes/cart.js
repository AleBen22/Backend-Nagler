import {Router} from 'express';
//import { CartManager } from '../DAO/datos/CartManager.js';
//import { ProductManager } from '../DAO/datos/ProductManager.js';
import ProdManager from '../DAO/ProductDAO.js';
import CartsManager from '../DAO/CartDAO.js';
const cartRouter = Router();

const manager = new CartsManager();
const prodmanager = new ProdManager();

cartRouter.get('/', async (req, res) => {
    let carts
    try {
        carts = await manager.getCarts()
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    res.send({ status: "success", payload: carts })
})

cartRouter.get('/:cid', async (req, res) => {
    let id = req.params.cid;
    let cart
    try {
        cart = await manager.getCartById(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un carrito ${error}` });
    }
    res.send({ status: "success", payload: cart })
})

cartRouter.post('/', async (req, res) => {
    let cart
    try {
        cart = await manager.createCart();
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `Hubo un error al generar el carrito` });
    }
    res.send({ status: "success", payload: cart })    
})

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let { quantity } = req.body;
    let addToCart
    try {
        await prodmanager.getProductById(pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El product id ${pid} no corresponde a un producto existente` });
    }
    if(quantity< 0){
        res.status(400).send({ status: 'error', msg: "La cantidad debe ser mayor a 0" });
    } else {
    try {
        addToCart = await manager.addProductToCart(cid, pid, quantity)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
        res.send({ status: 'success', payload: addToCart})
    }
})

cartRouter.delete('/:cid', async (req, res) => {
    let cid = req.params.cid
    let deleteCart
    try {
        deleteCart = await manager.deleteCart(cid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El cart id ${pid} no corresponde a un carrito existente` });
    }
        res.send({ status: 'success', payload: deleteCart})
})

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let deleteFromCart
    try {
        await prodmanager.getProductById(pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El product id ${pid} no corresponde a un producto existente` });
    }
    try {
        deleteFromCart = await manager.deleteProductFromCart(cid, pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
        res.send(deleteFromCart)
})


export default cartRouter;