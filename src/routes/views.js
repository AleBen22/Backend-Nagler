import { authMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAllProductsController
} from '../controllers/views.js';

const viewsRouter = Router();

viewsRouter.get('/', authMiddleware, getAllProductsController)
viewsRouter.get('/limit/:limit?', authMiddleware, getAllProductsController)
viewsRouter.get('/page/:page?', authMiddleware, getAllProductsController)
viewsRouter.get('/limit/:limit?/page/:page?', authMiddleware, getAllProductsController)

export default viewsRouter