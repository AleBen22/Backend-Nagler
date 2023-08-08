import ProdManager from '../dao/ProductDAO.js';

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
        prevLink: products.hasPrevPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.prevPage}`:'',
        nextLink: products.hasNextPage?`http://localhost:8080/realtimeproducts/limit/${limit}/page/${products.nextPage}`:'',
    }
    return data
}

export const getProductByIdService = async (id) => {
    let product = await manager.getProductById(id)
    return product
}

export const addproductService = async (title, description, code, price, stock, category, status) => {
    let result = await manager.addProduct(title, description, code, price, stock, category, status)
    return result
}

export const updateProductService = async (title, description, code, price, stock, category, status) => {
    let updateProd = await manager.updateProduct(id, { title, description, code, price, stock, category, status })
    return updateProd
}

export const deleteProductService = async (id) => {
    let deleteProd = await manager.deleteProduct(id)
    return deleteProd
}