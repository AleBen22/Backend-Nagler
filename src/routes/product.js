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
productRouter.post('/', adminMiddleware, addProductController)                  
productRouter.get('/limit/:limit?/page/:page?', getAllProductsController)
productRouter.get('/:pid', getProductByIdController)                            
productRouter.put('/:pid', adminMiddleware, updateProductController)            
productRouter.delete('/:pid', adminMiddleware, deleteProductController)         

export default productRouter;