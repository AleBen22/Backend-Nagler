import { get } from "mongoose";
import { cartModel } from "./models/cart.model.js";

class CartsManager {
    constructor(){
        this.model = cartModel;
    }

    async createCart() {
        let resp
        let newCart = {
            products: []
        }
        try {
            resp = await cartModel.create( newCart )
        } catch (error) {
            throw error
            console.log(error)
        }
        return resp
    }

    async getCarts() {
        let carts
        try {
            carts = await cartModel.find()
        } catch (error) {
            throw error
            console.log(error)
        }
        return carts
    }

    async getCartById(ids) {
        let cart;
        try {
            cart = await cartModel.findOne({ _id: ids })
        } catch (error) {
            throw error
            console.log(error)
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        let cart;
        let result;
        try {
            cart = this.getCartById(cid)
        } catch (error) {
            throw error
            console.log(error)
        }
        try {
            let prodCart = await cartModel.findOne({ _id: cid, "products.id": pid})
            if (!prodCart){
                result = await cartModel.updateOne({ _id: cid }, { $push: [{"products.id": pid, "products.quantity": 1}]})
            }
            result = await cartModel.updateOne({ _id: cid, "products.id": pid}, { $set: {"products.quantity": 2}} )
        } catch (error) {
            throw error
            console.log(error)
        }
        return result;
    }

}

export default CartsManager;