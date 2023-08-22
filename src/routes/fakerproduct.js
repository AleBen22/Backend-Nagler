import { Router } from 'express';
import {
    getFakerProduct
} from '../controllers/product.js';

const fakerRouter = Router();

fakerRouter.get('/:cant', getFakerProduct)

export default fakerRouter;