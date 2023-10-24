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
    createTicketService,
    getTicketService,
    getTicketsByPurchaserService,
    updateTicketPaymentStatusService
} from "../services/ticket.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { 
    generateQuantityErrorInfo,
    generatePIDErrorInfo,
    generateCIDErrorInfo,
    generateOwnerError
} from "../services/errors/info.js";
import { validateNumber } from '../utils.js';


export const addProductToCartController = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid;
    let user = req.user;
    let { quantity, cart } = req.body;
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
            await addProductToCartService(cid, pid, quantity)
            if(!cart){
                res.redirect('/')
            } else {
                res.redirect(`/cart/${cid}`)
            }
//            addToCart = await addProductToCartService(cid, pid, quantity)
//            res.send({ status: 'success', payload: addToCart})
        }
    } catch (error) {
        res.render('error', { msg: error })
//        res.status(400).send({ status: 'error', msg: error})
    }
}

export const getCartByIdController = async (req, res) => {
    let id = req.params.cid;
    let cart
    let user = req.user
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
        cart = JSON.parse(JSON.stringify(cart))
        res.render('cart', { cart, user, style: 'index.css' })
//        res.send({ status: "success", payload: cart })
    } catch (error) {
        res.render('error', { msg: error })
//        res.status(400).send({status: "error", error})
    }
}

export const createTicketFromCartController = async (req, res) => {
    let cid = req.params.cid
    let cart
    let amount = 0
    let purchaser
    let result
    let code
    let productsSinStock = []
    try {
        cart = await getCartByIdService(cid)
        if (!cart) {
            CustomError.createError({
                name: 'Error de ID',
                cause: generateCIDErrorInfo(cid),
                message: 'El ID ingresado no corresponde a un Cart existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        } else if (cart.products.length === 0) {
            req.logger.info("No hay productos para generar un ticket")
        } else {
            for (var i = 0; i < cart.products.length;i++) {
                let pid = cart.products[i].id._id        
                let product = await getProductByIdService(pid)
                if (!product) {
                    CustomError.createError({
                        name: 'Error de ID',
                        cause: generatePIDErrorInfo(pid),
                        message: 'El ID ingresado no corresponde a un Product existente',
                        code: EErrors.INVALID_PARAM_ERROR
                    })
                } else if (product.stock>=cart.products[i].quantity) {
                    await updateQuantityProductService(cart.products[i].id._id, (product.stock-cart.products[i].quantity))
                    amount = amount + (cart.products[i].id.price * cart.products[i].quantity)
                    await deleteProductFromCartService(cid, pid)
                } else {
                    let productSinStock = {
                        id: pid,
                        quantity: cart.products[i].quantity
                    }
                    productsSinStock.push(productSinStock)
                    req.logger.info(`no hay stock del producto ${pid}`)
                }
            }
            purchaser = await getCartIdByUserService(cid)
//            let code = Date.now() + Math.floor(Math.random()*10000+1)
            let ticket = {
                purchaser: purchaser.email,
                amount: amount,
                code: 'pending'
            }
            result = await createTicketService(ticket)
            ticket = JSON.parse(JSON.stringify(result))
            res.render('ticket', {ticket, productsSinStock, style: 'index.css'})
        }
    } catch (error) {
        res.render('error', { msg: error })
//        res.status(400).send({ status: 'error', msg: error})
    }
}

export const getTicketsByPurchaserController = async (req, res) => {
    try {
        let purchaser = req.params.uid
        let tickets = await getTicketsByPurchaserService(purchaser)
        let data = JSON.parse(JSON.stringify(tickets))
        res.render('purchaser-tickets', {purchaser, data, style: 'index.css'})
    } catch (error) {
        res.render('error', { msg: error })
//        res.status(400).send({status: "error", error})
    }
}

export const getTicketById = async (req, res) => {
    let tid = req.params.tid
    let ticket = await getTicketService(tid)
    if (!ticket) {
        CustomError.createError({
            name: 'Error de ID',
            cause: generateCIDErrorInfo(tid),
            message: 'El ID ingresado no corresponde a un Ticket existente',
            code: EErrors.INVALID_PARAM_ERROR
        })
    }
    let code = Date.now() + Math.floor(Math.random()*10000+1)
    await updateTicketPaymentStatusService(tid, code)
    res.redirect('/')
}


//Sin Vistas
export const getAllCartsController = async (req, res) => {
    try {
        let carts
        carts = await getAllCartsService()
        res.send({ status: "success", payload: carts })
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