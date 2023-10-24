import { userMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAllCartsController,
    getCartByIdController,
    createCartController,
    addProductToCartController,
    deleteCartController,
    deleteProductFromCartController,
    createTicketFromCartController,
    getTicketsByPurchaserController,
    getTicketById
} from '../controllers/cart.js';
import { authToken } from "../config/jwt.js";
import { paymentController } from "../controllers/payments.js";

const cartRouter = Router();


cartRouter.post('/:cid/product/:pid', authToken, userMiddleware, addProductToCartController)
cartRouter.get('/:cid', authToken, getCartByIdController)
cartRouter.post('/:cid/purchase', authToken, createTicketFromCartController)
cartRouter.get('/tickets/:uid', authToken, getTicketsByPurchaserController)
cartRouter.post('/create-payment-intent', paymentController)
cartRouter.get('/ticket/:tid', getTicketById)

//Sin Vistas
cartRouter.get('/', getAllCartsController)          
cartRouter.post('/', createCartController)          
cartRouter.delete('/:cid', deleteCartController)    
cartRouter.put('/:cid/product/:pid', authToken, userMiddleware, addProductToCartController)
cartRouter.delete('/:cid/product/:pid', userMiddleware, deleteProductFromCartController)

export default cartRouter;