import mongoose from "mongoose";
import config from "../../../config/config.js";

const cartCollection = config.CART_COLLECTION;

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: config.PRODUCT_COLLECTION
                },
                quantity: { type: Number, required: true }
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function() {
    this.populate('products.id')
})

cartSchema.pre('findOne', function() {
    this.populate('products.id')
})

export const cartModel = mongoose.model(cartCollection, cartSchema)