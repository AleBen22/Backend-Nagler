import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import viewsRouter from './src/routes/views.js';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/product.js'
import cartRouter from './src/routes/cart.js';
import fakerRouter from './src/routes/fakerproduct.js';
import handlebars from 'express-handlebars';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import config from './src/config/config.js';
import cookieParser from 'cookie-parser';
import errorHandler from './src/middlewares/errors/index.js'
import { Server } from 'socket.io';
import { addproductService, deleteProductService } from './src/services/product.js';
import { addProductToCartService } from './src/services/cart.js'
import { addLogger } from './src/utils/logger.js'
import { cpus } from 'os'


//console.log(cpus().length)

const app = express();

const MONGO_CONNECTION_STRING = config.MONGO_CONNECTION_STRING

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(errorHandler)
app.use(addLogger)

mongoose.connect(MONGO_CONNECTION_STRING)
    .then(() => console.log('Database connected'))
    .catch(error => console.log(error))

app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs')
app.set('views', './views');

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_CONNECTION_STRING,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 360
    }),
    secret: 'secretCoder',
    saveUninitialized: false,
    resave: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/session', authRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)
app.use('/mockingproducts', fakerRouter)

app.get('/loggerTest', (req, res) => {
    req.logger.fatal('log fatal')
    req.logger.error('log error')
    req.logger.warning('log warning')
    req.logger.info('log info')
    req.logger.http('log http')
    req.logger.debug('log debug')
    res.send("ok")
})


const PORT = config.PORT;
const httpServer = app.listen(PORT, () => console.log(`Server is running on port: ${httpServer.address().port}`))

httpServer.on('error', error => console.log(error))

const socketServer = new Server(httpServer);

const mensajes = []

socketServer.on('connection', socket => {
    console.log('nuevo socket conectado')

    socket.emit('messages', mensajes)

    socket.on('newproduct', async (product) => {
        addproductService(product.title, product.description, product.code, product.price, product.stock, product.category, product.status)
        socketServer.emit('respond', 'producto agregado')
    })

    socket.on('deleteproduct', async data => {
        deleteProductService(data)
        socketServer.emit('respond', 'producto eliminado')
    })

    socket.on('addproducttocart', async (data) => {
        console.log(data)
        addProductToCartService(data.cid, data.pid, data.quantity)
        socketServer.emit('respond', 'producto agregado al carrito')
    })

    socket.on('message', data => {
        mensajes.push(data);
        socketServer.emit("messages", mensajes)
    })

})