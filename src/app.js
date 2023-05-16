import express from 'express';
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

const PORT = 8080
const server = app.listen(PORT, () => console.log(`Server is running on port: ${server.address().port}`))
server.on('error', error => console.log(error))