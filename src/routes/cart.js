import { Router } from 'express';
import {
    getAllCartsController,
    getCartByIdController,
    createCartController,
    addProductToCartController,
    deleteCartController,
    deleteProductFromCartController
} from '../controllers/cart.js';

const cartRouter = Router();

cartRouter.get('/', getAllCartsController)
cartRouter.get('/:cid', getCartByIdController)
cartRouter.post('/', createCartController)
cartRouter.put('/:cid/product/:pid', addProductToCartController)
cartRouter.delete('/:cid', deleteCartController)
cartRouter.delete('/:cid/product/:pid', deleteProductFromCartController)

export default cartRouter;