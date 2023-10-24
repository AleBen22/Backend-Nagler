import config from '../config/config.js';
import mongoose from 'mongoose';

export let CartsManager
export let ProductManager

switch (config.PERSISTENCE) {
    case 'MONGO':

        mongoose.connect(config.MONGO_CONNECTION_STRING)
            .then(() => console.log('Database connected'))
            .catch(error => console.log(error))

        const { default: CartsManagerMongo } = await import('./mongo/cart.dao.mongo.js')
        CartsManager = CartsManagerMongo

        const { default: ProductManagerMongo } = await import('./mongo/product.dao.mongo.js')
        ProductManager = ProductManagerMongo
        break

    case 'FILE':
        const { default: CartsManagerFile } = await import('./file/cart.dao.file.js')
        CartsManager = CartsManagerFile

        const { default: ProductManagerFile } = await import('./file/product.dao.file.js')
        ProductManager = ProductManagerFile
        break

    default:
        throw 'Persistence is undefined'       
}