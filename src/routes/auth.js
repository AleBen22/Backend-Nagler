import { Router } from "express";
import {
    githubLoginController,
    githubcallbackLoginController,
    getUserController,
    newUserController,
    failCreateUserController,
    getLoginController,
    newLoginController,
    failCreateLoginController,
    getLogoutController,
    getRestoreController,
    newRestoreController,
    getRecoverController,
    newRecoverController,
    modUserRoleController
} from "../controllers/auth.js";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.js";
import { authRecoverToken } from "../utils/jwt.js";
const authRouter = Router();

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubLoginController)
authRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), githubcallbackLoginController)

authRouter.get('/register', getUserController)
authRouter.post('/register', newUserController)
authRouter.get('/failregister', failCreateUserController)

authRouter.get('/login', getLoginController)
authRouter.post('/login', newLoginController)
authRouter.get('/faillogin', failCreateLoginController)

authRouter.get('/logout', getLogoutController)

authRouter.get('/restore/:token/:user', authRecoverToken, getRestoreController)
authRouter.post('/restore', newRestoreController)

authRouter.get('/recover', getRecoverController)
authRouter.post('/recover', newRecoverController)

authRouter.get('/premium/:uid', authMiddleware, modUserRoleController)

export default authRouter;