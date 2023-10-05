import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import config from "./config.js";
import { createUser, getAll, getByEmail, updateUserPassword, getById } from '../DAOs/mongo/user.dao.mongo.js';
import { createCartService } from "../services/cart.js";
import { updateUserConnectionService } from "../services/users.js";
import { createHash, isValidPassword } from "../utils/index.js";

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const JWT_PRIVATE_KEY = config.JWT_PRIVATE_KEY

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies){
        token = req.cookies['authToken']
    }
    return token
}

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: config.PASSPORT_CLIENT_ID,
        clientSecret: config.PASSPORT_CLIENT_SECRET,
        callbackURL: config.PASSPORT_CALLBACK_URL,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let userEmail = profile.emails[0].value;
            let user = await getByEmail(userEmail);
            if(!user){
                let newCart = await createCartService()
                let newUser = {
                    first_name: profile._json.login,
                    last_name: profile._json.name,
                    email: userEmail,
                    cart: newCart,
                    password: "",
                    age: 23
                }
                let result = await createUser(newUser)
                done(null, result)
            }else{
                done(null, user)
            }
            updateUserConnectionService(userEmail)
        } catch (error) {
            done(error)
        }
    }))

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            try {
                let user = req.body;
                let userFound = await getByEmail(user.email);
                if(userFound){
                    return done(null, false)
                }
                user.password = createHash(user.password);
                let result = await createUser(user)
                return done(null, result)
            } catch (error) {
                return done('Error al registrar usuario:' + error)
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        let result = await getByEmail(username)
        if(!result || !isValidPassword(result, password)) {
            return done(null, false)
        }
        delete result.password                
        return done(null, result)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await getById(id);
        done(null, user);
    })

    passport.use('current', new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_PRIVATE_KEY,
    }, async(jwt_payload, done) => {
        try{
            return done(null,jwt_payload)
        }
        catch (error){
            return done(error)
        }
    }
    ))

}

export default initializePassport