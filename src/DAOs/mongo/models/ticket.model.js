import mongoose from "mongoose";
import config from "../../../config/config.js";

const ticketCollection = config.TICKET_COLLECTION;

const ticketSchema = new mongoose.Schema({
    purchaser: {type: String},
    amount: {type: Number},
    code: {type: String},
    },
    {
        timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' }
    }
)

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)