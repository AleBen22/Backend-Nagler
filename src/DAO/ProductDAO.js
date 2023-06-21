import { json } from "express";
import { productModel } from "./models/product.model.js";

class ProdManager {
    constructor(){
        this.model = productModel;
    }

async getAllProducts(page, limit){
    let productos;
    try {
        productos = await this.model.paginate({}, { page, limit: limit, lean:true })
    } catch (error) {
        throw error
        console.log(error)
    }
    return productos;
}

async getProductById(ids) {
    let product;
    try {
        product = await this.model.findOne({ _id: ids })
    } catch (error) {
        throw error
        console.log(error)
    }
    return product;
}

async addProduct(title, description, code, price, stock, category, status) {
    let product    
    try {
        product = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
            status
        });
    } catch (error) {
        throw error
        console.log(error)
    }
    return product
}

async updateProduct(pid, fields) {
    let product;
    try {
        product = await productModel.updateOne({ _id: pid }, fields)
    } catch (error) {
        throw error
        console.log(error)
    }
    return product;
}

async deleteProduct(id) {
    let product
    try {
        product = await productModel.deleteOne({ _id: id })
    } catch (error) {
        throw error
        console.log(error)
    }
    return product;
}

}

export default ProdManager;