import ProdManager from '../DAOs/ProductDAO.js';

const manager = new ProdManager();

export const getAllProductsService = async (page, limit) => {
    let products = await manager.getAllProducts(page, limit)
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
