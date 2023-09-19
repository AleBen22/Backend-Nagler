import { authMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getAllProductsController
} from '../controllers/views.js';

const viewsRouter = Router();

viewsRouter.get('/', authMiddleware, getAllProductsController)
viewsRouter.get('/current', authMiddleware, getAllProductsController)

export default viewsRouter