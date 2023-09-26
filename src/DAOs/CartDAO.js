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
        }
        return resp
    }

    async getCarts() {
        let carts
        try {
            carts = await cartModel.find()
        } catch (error) {
            throw error
        }
        return carts
    }

    async getCartById(ids) {
        let cart;
        try {
            cart = await cartModel.findOne({ _id: ids })
        } catch (error) {
            return null
            //throw error
        }
        return cart;
    }

    async addProductToCart(cid, pid, quantity) {
        let cart;
        let result;
        try {
            cart = this.getCartById(cid)
        } catch (error) {
            throw error
        }
        try {
            let prodCart = await cartModel.findOne({ _id: cid, "products.id": pid},{"products.quantity": true})
            if (!prodCart){
                result = await cartModel.findOneAndUpdate({ _id: cid }, { $push: { products: { $each: [{id: pid, quantity: quantity }]} } })
            } else {
            // let prodQuantity = prodCart.products
            // let newQuantity = prodQuantity[0].quantity + 1
            result = await cartModel.updateOne({ _id: cid, "products.id": pid}, { $set: {"products.$.quantity": quantity}} )
            }
        } catch (error) {
            throw error
        }
        return result;
    }

    async deleteCart(cid) {
        let result;
        try {
            result = await cartModel.deleteOne({ _id: cid })
        } catch (error) {
            throw error
        }
        return result
    }

    async deleteProductFromCart(cid, pid) {
        let cart;
        let result;
        try {
            cart = this.getCartById(cid)
        } catch (error) {
            throw error
        }
        try {
            let prodCart = await cartModel.findOne({ _id: cid, "products.id": pid},{"products.id": true})
            if (!prodCart){
                result = { status: 'error', msg: `El product id ${pid} no se encuentra en el carrito` }
            } else {
                result = await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products:  { id: pid }} } )
                result = { status: 'success', payload: result }
            }
        } catch (error) {
            throw error
        }
        return result;
    }

}

export default CartsManager;