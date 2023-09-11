import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const productCollection = 'products';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    owner: { type: String, required: true, default: 'admin' }
})
ProductSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, ProductSchema)