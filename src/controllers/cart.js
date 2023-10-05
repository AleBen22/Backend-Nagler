import {
    getAllCartsService,
    getCartByIdService,
    createCartService,
    addProductToCartService,
    deleteCartService,
    deleteProductFromCartService
} from "../services/cart.js"
import {
    getProductByIdService,
    updateQuantityProductService
} from "../services/product.js"
import {
    getCartIdByUserService
} from "../services/users.js"
import {
    createTicketService
} from "../services/ticket.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { 
    generateQuantityErrorInfo,
    generatePIDErrorInfo,
    generateCIDErrorInfo,
    generateOwnerError
} from "../services/errors/info.js";
import { validateNumber } from '../utils/index.js';

export const getAllCartsController = async (req, res) => {
    try {
        let carts
        carts = await getAllCartsService()
        res.send({ status: "success", payload: carts })
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
}

export const getCartByIdController = async (req, res) => {
    let id = req.params.cid;
    let cart
    try {
        cart = await getCartByIdService(id)
        if(!cart){
            CustomError.createError({
                name: 'Error de ID',
                cause: generatePIDErrorInfo(id),
                message: 'El ID ingresado no corresponde a un Cart existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        res.send({ status: "success", payload: cart })
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
}

export const createCartController = async (req, res) => {
    let cart
    try {
        cart = await createCartService()
        res.send({ status: "success", payload: cart })    
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `Hubo un error al generar el carrito` });
    }
}

export const addProductToCartController = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let user = req.session.user;
    let { quantity } = req.body;
    let addToCart
    let result
    try {
        result = await getProductByIdService(pid)
        if(!result){
            CustomError.createError({
                name: 'Error de ID',
                cause: generatePIDErrorInfo(pid),
                message: 'El ID ingresado no corresponde a un Product existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        } else if(!validateNumber(quantity)) {
            CustomError.createError({
                name: 'Error de parametro',
                cause: generateQuantityErrorInfo(quantity),
                message: 'El parametro ingresado no es valido',
                code: EErrors.INVALID_TYPES_ERROR
            })
        } else if(result.owner === user) {
            CustomError.createError({
                name: 'Error de usuario',
                cause: generateOwnerError(user),
                message: 'El producto ingresado no puede ser ingresado',
                code: EErrors.INVALID_TYPES_ERROR
            })
        } else {    
            addToCart = await addProductToCartService(cid, pid, quantity)
            res.send({ status: 'success', payload: addToCart})
        }
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
}

export const deleteCartController = async (req, res) => {
    let cid = req.params.cid
    let deleteCart
    try {
        deleteCart = await deleteCartService(cid)
        res.send({ status: 'success', payload: deleteCart})
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El cart id ${cid} no corresponde a un carrito existente` });
    }
}

export const deleteProductFromCartController = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let deleteFromCart
    try {
        let result = await getProductByIdService(pid)
        if(!result){
            CustomError.createError({
                name: 'Error de ID',
                cause: generatePIDErrorInfo(pid),
                message: 'El ID ingresado no corresponde a un Product existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        } 
        deleteFromCart = await deleteProductFromCartService(cid, pid)
        res.send({ status: 'success', payload: deleteFromCart})
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
}

export const createTicketFromCartController = async (req, res) => {
    let cid = req.params.cid
    let cart
    let amount = 0
    let purchaser
    let result
    try {
        cart = await getCartByIdService(cid)
        if(!cart){
            CustomError.createError({
                name: 'Error de ID',
                cause: generateCIDErrorInfo(cid),
                message: 'El ID ingresado no corresponde a un Cart existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        for(var i = 0; i < cart.products.length;i++){
            let pid = cart.products[i].id._id        
            let product
            let deleteFromCart
            product = await getProductByIdService(pid)
            if(!product){
                CustomError.createError({
                    name: 'Error de ID',
                    cause: generatePIDErrorInfo(pid),
                    message: 'El ID ingresado no corresponde a un Product existente',
                    code: EErrors.INVALID_PARAM_ERROR
                })
            } 
            if(product.stock>cart.products[i].quantity){
                await updateQuantityProductService(cart.products[i].id._id, (product.stock-cart.products[i].quantity))
                amount = amount + (cart.products[i].id.price * cart.products[i].quantity)
                try {
                    deleteFromCart = await deleteProductFromCartService(cid, pid)
                } catch (error) {
                    res.status(400).send({ status: 'error', msg: error})
                }
            }else{
                req.logger.info("no hay stock")
            }
        }
        if(amount === 0){
            req.logger.info("No hay productos para generar un ticket")
        } else {
        try {
            purchaser = await getCartIdByUserService(cid)
        } catch (error) {
            res.status(400).send({ status: 'error', msg: `El cart no corresponde a un usuario registrado ${cid}` });
        }
        let code = Date.now() + Math.floor(Math.random()*10000+1)
        let ticket = {
            purchaser: purchaser.email,
            amount: amount,
            code: code
        }
        result = await createTicketService(ticket)
    }
    res.send({ status: "success", payload: result })
    
    } catch (error) {
        res.status(400).send({ status: 'error', msg: error})
    }
}