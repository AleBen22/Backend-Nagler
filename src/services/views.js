import ProdManager from '../DAOs/mongo/product.dao.mongo.js';

const manager = new ProdManager();

export const getAllProductsService = async (page, limit, sort) => {
    let products = await manager.getAllProducts(page, limit, sort)
    let data = {
        payload: products.docs,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        prevPage: products.prevPage,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevLink: products.hasPrevPage?`http://localhost:8080/?limit=${limit}&page=${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/?limit=${limit}&page=${products.nextPage}`:'',
    }
    return data
}
