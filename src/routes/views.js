import { authMiddleware, adminMiddleware, userMiddleware } from "../middlewares/auth.js";
import { Router } from 'express';
import {
    getDataController,
    modUserRoleController,
} from '../controllers/views.js';
import {
    authToken
} from "../config/jwt.js";

const viewsRouter = Router();

//Obtengo datos para generar la vista index
viewsRouter.get('/', authToken, authMiddleware, getDataController)
//Ruta para cambio de role de usuarios
viewsRouter.get('/role/:uid', modUserRoleController)

export default viewsRouter