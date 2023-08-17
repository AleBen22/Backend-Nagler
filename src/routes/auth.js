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
    newRestoreController
} from "../controllers/auth.js";
import passport from "passport";
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

authRouter.get('/restore', getRestoreController)
authRouter.post('/restore', newRestoreController)

export default authRouter;