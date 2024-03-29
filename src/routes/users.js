import { Router } from "express";
import {
    getUsersController,
    deleteUsersController,
    githubLoginController,
    githubcallbackLoginController,
    getUserController,
    newUserController,
    getLoginController,
    newLoginController,
    failCreateLoginController,
    getLogoutController,
    getRestoreController,
    newRestoreController,
    getRecoverController,
    newRecoverController,
    modUserRoleController,
    docsController
} from "../controllers/users.js";
import passport from "passport";
import {
    authMiddleware
} from "../middlewares/auth.js";
import {
    uploadMiddleware
} from "../middlewares/uploader.js";
import {
    authRecoverToken
} from "../config/jwt.js";

const authRouter = Router();

authRouter.get('/userslist', getUsersController)

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubLoginController)
authRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), githubcallbackLoginController)

authRouter.get('/register', getUserController)
authRouter.post('/register', newUserController)

authRouter.get('/login', getLoginController)
authRouter.post('/login', newLoginController)
authRouter.get('/faillogin', failCreateLoginController)

authRouter.get('/logout', getLogoutController)

authRouter.get('/restore/:token/:user', authRecoverToken, getRestoreController)
authRouter.post('/restore', newRestoreController)

authRouter.get('/recover', getRecoverController)
authRouter.post('/recover', newRecoverController)

//Sin Vistas
authRouter.delete('/deleteoldusers', deleteUsersController)
authRouter.get('/premium/:uid', authMiddleware, modUserRoleController)
authRouter.post('/:uid/documents', uploadMiddleware, docsController)

export default authRouter;