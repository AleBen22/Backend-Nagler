import express from "express";
import config from "./config/config.js";
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import initializePassport from "./config/passport.config.js";
import session from "express-session";
import passport from "passport";
import { addLogger } from './utils/logger.js'
import errorHandler from './middlewares/errors/index.js'
import { Server } from 'socket.io';
import { __dirname } from "./utils.js";

import viewsRouter from './routes/views.js';
import authRouter from './routes/users.js';
import productRouter from './routes/product.js'
import cartRouter from './routes/cart.js';
import { deleteProductService, getAllProductsService, getProductByIdService } from "./services/product.js";
import { deleteUserService, getUsersService } from "./services/users.js";
import { deleteProductFromCartService, getCartByIdService } from "./services/cart.js";
import { sendMail, createOptionsProductDeleted } from "./services/mailing.js";

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))
initializePassport();
app.use(session({
    secret: 'secretCoder',
    saveUninitialized: false,
    resave: false
}))
app.use(passport.initialize())
app.use(addLogger)
app.use(errorHandler)


app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('views', __dirname+'/views');
app.set('view engine', '.hbs')

app.use('/api/users', authRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)

const PORT = config.PORT;
const httpServer = app.listen(PORT, () => console.log(`Server is running on port: ${httpServer.address().port}`))

httpServer.on('error', error => console.log(error))

const io = new Server(httpServer);

let mensajes = []

io.on('connection', socket => {
    console.log('nuevo socket conectado')

    socket.emit('messages', mensajes)

    socket.on('deleteproduct', async data => {
        let product = await getProductByIdService(data.pid)
        await deleteProductService(data.pid, data.user, data.role)
        if(product.owner !== 'admin'){
            const info = {
                to: product.owner,
                product: product.title,
                user: data.user,
            }
            let options = createOptionsProductDeleted(info)
            sendMail(options)
        }
        let products = await getAllProductsService(data.page, data.limit)
        io.emit('respondProducts', products)
    })

    socket.on('deleteuser', async data => {
        await deleteUserService(data)
        let users = await getUsersService()
        io.emit('respondUsers', users)
    })

    socket.on('deleteproductcart', async data => {
        await deleteProductFromCartService(data.cid, data.pid)
        let cart = await getCartByIdService(data.cid)
        io.emit('respondCart', cart)
    })

    socket.on('message', data => {
        mensajes.push(data);
        io.emit('messages', mensajes)
    })

})