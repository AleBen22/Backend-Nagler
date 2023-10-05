//import ProdManager from '../DAOs/mongo/product.dao.mongo.js';
import { ProductManager } from "../DAOs/factory.js";

const manager = new ProductManager();

export const getAllProductsService = async (page, limit, sort) => {
    let products = await manager.getAllProducts(page, limit, sort)
    let data = {
        payload: products.docs,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        prevPage: products.prevPage,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevLink: products.hasPrevPage?`http://localhost:8080/api/products/?limit=${limit}&page=${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/api/products/?limit=${limit}&page=${products.nextPage}`:'',
    }
    console.log(data)
    return data
}

export const getProductByIdService = async (id) => {
    let product = await manager.getProductById(id)
    return product
}

export const addproductService = async (title, description, code, price, stock, category, status, owner) => {
    let result = await manager.addProduct(title, description, code, price, stock, category, status, owner)
    return result
}

export const updateProductService = async (id, title, description, code, price, stock, category, status) => {
    let updateProd = await manager.updateProduct(id, { title, description, code, price, stock, category, status })
    return updateProd
}

export const updateQuantityProductService = async (pid, quantity) => {
    let updateProd = await manager.updateQuantityProduct(pid, quantity )
    return updateProd
}

export const deleteProductService = async (id) => {
    let deleteProd = await manager.deleteProduct(id)
    return deleteProd
}