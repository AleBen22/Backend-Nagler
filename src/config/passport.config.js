import passport from "passport";
import GitHubStrategy from 'passport-github2';
import config from "./config.js";
import { createUser, getAll, getByEmail, updateUserPassword, getById } from '../DAOs/mongo/user.dao.mongo.js';
import { createCartService } from "../services/cart.js";
import { updateUserConnectionService } from "../services/users.js";
import ContactDTO from "../DAOs/DTOs/contact.dto.js";


const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: config.PASSPORT_CLIENT_ID,
        clientSecret: config.PASSPORT_CLIENT_SECRET,
        callbackURL: config.PASSPORT_CALLBACK_URL,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let userEmail = profile.emails[0].value;
            let foundUser = await getByEmail(userEmail);
            if(!foundUser){
                let newCart = await createCartService()
                let newUser = {
                    first_name: profile._json.login,
                    last_name: profile._json.name,
                    email: userEmail,
                    cart: newCart,
                }
                let result = await createUser(newUser)
                done(null, result)
            }else{
                let user = new ContactDTO(foundUser)
                done(null, user)
            }
            updateUserConnectionService(userEmail)
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await getById(id);
        done(null, user);
    })

}

export default initializePassport