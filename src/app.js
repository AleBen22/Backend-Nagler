import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
import viewsRouter from './routes/views.js'

import realtimeproductRouter from './routes/realtimeproducts.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import ProdManager from './DAO/ProductDAO.js';

const prodmanager = new ProdManager();

const app = express();

mongoose.connect('mongodb+srv://trabajoAdmin:$coder1234@ecommerce.7vvk0h4.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => console.log('Database connected'))
    .catch(error => console.log(error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/realtimeproducts', realtimeproductRouter)

app.use(viewsRouter)
app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars')

const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Server is running on port: ${httpServer.address().port}`))
httpServer.on('error', error => console.log(error))

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log('nuevo socket conectado')
    socket.on('addproduct', async data => {
        await prodmanager.addProduct(data)
        socketServer.emit('respond', 'producto agregado')
    })
    socket.on('deleteproduct', async data => {
        await prodmanager.deleteProduct(data)
        socketServer.emit('respond', 'producto eliminado')
    })
})