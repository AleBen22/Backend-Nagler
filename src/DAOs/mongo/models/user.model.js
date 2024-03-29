import mongoose from "mongoose";
import config from "../../../config/config.js";

const userCollection = config.USER_COLLECTION;

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    age: Number,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.CART_COLLECTION
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date, //o ver timestamp
});

export const userModel = mongoose.model(userCollection, userSchema)