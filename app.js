import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import viewsRouter from './src/routes/views.js';
import sessionRouter from './src/routes/auth.js'
import handlebars from 'express-handlebars';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import config from './src/config/config.js';
import cookieParser from 'cookie-parser';

// import { Server } from 'socket.io';
// import ProdManager from './src/dao/ProductDAO.js';
// const prodmanager = new ProdManager();

const app = express();

const MONGO_CONNECTION_STRING = config.MONGO_CONNECTION_STRING

mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => console.log('Database connected'))
    .catch(error => console.log(error))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.engine('.hbs', handlebars.engine( { extname: '.hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', '.hbs')
app.set('views', './views');

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_CONNECTION_STRING,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 20
    }),
    secret: 'secretCoder',
    saveUninitialized: false,
    resave: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/session', sessionRouter)
app.use('/', viewsRouter)

const PORT = config.PORT;
const httpServer = app.listen(PORT, () => console.log(`Server is running on port: ${httpServer.address().port}`))

// httpServer.on('error', error => console.log(error))

// const socketServer = new Server(httpServer);

// socketServer.on('connection', socket => {
//     console.log('nuevo socket conectado')
//     socket.on('addproduct', async data => {
//         await prodmanager.addProduct(data)
//         socketServer.emit('respond', 'producto agregado')
//     })
//     socket.on('deleteproduct', async data => {
//         await prodmanager.deleteProduct(data)
//         socketServer.emit('respond', 'producto eliminado')
//     })
// })