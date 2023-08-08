import {
    getAllCartsService,
    getCartByIdService,
    createCartService,
    addProductToCartService,
    deleteCartService,
    deleteProductFromCartService
} from "../services/cart.js"
import {
    getProductByIdService
} from './services/product.js';

export const getAllCartsController = async (req, res) => {
    let carts
    try {
        carts = await getAllCartsService()
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    res.send({ status: "success", payload: carts })
}

export const getCartByIdController = async (req, res) => {
    let id = req.params.cid;
    let cart
    try {
        cart = await getCartByIdService(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un carrito ${error}` });
    }
    res.send({ status: "success", payload: cart })
}

export const createCartController = async (req, res) => {
    let cart
    try {
        cart = await createCartService()
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `Hubo un error al generar el carrito` });
    }
    res.send({ status: "success", payload: cart })    
}

export const addProductToCartController = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let { quantity } = req.body;
    let addToCart
    try {
        await getProductByIdService(pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El product id ${pid} no corresponde a un producto existente` });
    }
    if(quantity< 0){
        res.status(400).send({ status: 'error', msg: "La cantidad debe ser mayor a 0" });
    } else {
    try {
        addToCart = await addProductToCartService(cid, pid, quantity)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
        res.send({ status: 'success', payload: addToCart})
    }
}

export const deleteCartController = async (req, res) => {
    let cid = req.params.cid
    let deleteCart
    try {
        deleteCart = await deleteCartService(cid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El cart id ${pid} no corresponde a un carrito existente` });
    }
        res.send({ status: 'success', payload: deleteCart})
}

export const deleteProductFromCartController = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let deleteFromCart
    try {
        await getProductByIdService(pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El product id ${pid} no corresponde a un producto existente` });
    }
    try {
        deleteFromCart = await deleteProductFromCartService(cid, pid)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
        res.send(deleteFromCart)
}