import mongoose from "mongoose";

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
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