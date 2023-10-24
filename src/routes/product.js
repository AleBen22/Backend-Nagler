import { adminMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAddProductController,
    addProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    getFakerProduct
} from '../controllers/product.js';
import { authToken } from "../config/jwt.js";

const productRouter = Router();


productRouter.get('/addproduct', getAddProductController)
productRouter.post('/addproduct', authToken, adminMiddleware, addProductController)

//Sin Vistas
productRouter.get('/', getAllProductsController)                 
productRouter.get('/:pid', getProductByIdController)                            
productRouter.put('/:pid', adminMiddleware, updateProductController)            
productRouter.delete('/:pid', authToken, adminMiddleware, deleteProductController)     
productRouter.get('/fakerproducts/:cant', getFakerProduct)    

export default productRouter;