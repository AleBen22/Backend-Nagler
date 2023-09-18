import { userMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAllCartsController,
    getCartByIdController,
    createCartController,
    addProductToCartController,
    deleteCartController,
    deleteProductFromCartController,
    createTicketFromCartController
} from '../controllers/cart.js';

const cartRouter = Router();

cartRouter.get('/', getAllCartsController)          
cartRouter.post('/', createCartController)          
cartRouter.get('/:cid', getCartByIdController)      
cartRouter.delete('/:cid', deleteCartController)    
cartRouter.put('/:cid/product/:pid', userMiddleware, addProductToCartController)
cartRouter.delete('/:cid/product/:pid', userMiddleware, deleteProductFromCartController)
cartRouter.post('/:cid/purchase', createTicketFromCartController)

export default cartRouter;