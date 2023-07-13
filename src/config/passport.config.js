import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { createUser, getAll, getByEmail, updateUserPassword, getById } from '../DAO/SessionDAO.js';
import { createHash, isValidPassword } from "../utils/index.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.8824ca5562a4be2a',
        clientSecret: '35e798eafb0866587e5c0acdf692935fbef1a816',
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let userEmail = profile.emails[0].value;
            let user = await getByEmail(userEmail);
            if(!user){
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    email: userEmail,
                    password: "",
                    age: 23
                }
                let result = await createUser(newUser)
                done(null, result)
            }else{
                done(null, user)
            }
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

}

export default initializePassport