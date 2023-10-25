import { ProductManager } from "../DAOs/factory.js";
import config from "../config/config.js";
const manager = new ProductManager();

export const getAllProductsService = async (page, limit, sort) => {
    let products = await manager.getAllProducts(page, limit, sort)
    let data = {
        payload: products.docs,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        prevPage: products.prevPage,
        page: products.page,
        limit: products.limit,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevLink: products.hasPrevPage?`${config.URL_PATH}/?limit=${limit}&page=${products.prevPage}`:'',
        nextLink: products.hasNextPage?`${config.URL_PATH}/?limit=${limit}&page=${products.nextPage}`:'',
    }
    return data
}

export const getProductByIdService = async (pid) => {
    let product = await manager.getProductById(pid)
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

export const deleteProductService = async (pid) => {
    let result = await manager.deleteProduct(pid)
    return result
}