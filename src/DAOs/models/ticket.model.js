import mongoose from "mongoose";

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    purchaser: String,
    amount: Number,
    code: String,
    },
    {
        timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_at' }
    }
)

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)