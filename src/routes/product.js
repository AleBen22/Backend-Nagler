import { adminMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAllProductsController,
    getProductByIdController,
    addProductController,
    updateProductController,
    deleteProductController,
} from '../controllers/product.js';

const productRouter = Router();

productRouter.get('/', getAllProductsController)
productRouter.get('/limit/:limit?/page/:page?', getAllProductsController)
productRouter.get('/:pid', getProductByIdController)
//productRouter.post('/', adminMiddleware, addProductController)
productRouter.post('/', addProductController)
//productRouter.put('/:pid', adminMiddleware, updateProductController)
productRouter.put('/:pid', updateProductController)
//productRouter.delete('/:pid', adminMiddleware, deleteProductController)
productRouter.delete('/:pid', deleteProductController)

export default productRouter;