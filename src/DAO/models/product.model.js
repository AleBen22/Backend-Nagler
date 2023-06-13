import mongoose from "mongoose";

const productCollection = 'products';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    code: {
        type: String,
        unique: true,
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

export const productModel = mongoose.model(productCollection, ProductSchema)