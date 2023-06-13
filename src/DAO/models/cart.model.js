import mongoose from "mongoose";

const cartCollection = 'carts';

const CartSchema = new mongoose.Schema({
    
    products: [{
        id: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
    
})

export const cartModel = mongoose.model(cartCollection, CartSchema)