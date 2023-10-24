import { ticketModel } from "./models/ticket.model.js";

class TicketsManager {
    constructor(){
        this.model = ticketModel;
    }

    async getTickets() {
        let tickets
        try {
            tickets = await ticketModel.find()
        } catch (error) {
            throw error
        }
        return tickets
    }

    async getTicketById(tid) {
        let ticket;
        try {
            ticket = await ticketModel.findOne({ _id: tid })
        } catch (error) {
            throw error
        }
        return ticket;
    }

    async getTicketByPurchaser(purchaser) {
        let tickets;
        try {
            tickets =  await ticketModel.find({ purchaser: purchaser })
        } catch (error) {
            throw error
        }
        return tickets;
    }

    async updateTicketPaymentStatus(tid, code) {
        let ticket;
        try {
            ticket = await ticketModel.updateOne({ _id: tid }, { $set: {"code": code } } )
        } catch (error) {
            throw error
        }
        return ticket;
    }

    async createTicket(ticket) {
        let newTicket
        try {
            newTicket = await ticketModel.create(ticket)
        } catch (error) {
            throw error
        }
        return newTicket
    }

}

export default TicketsManager;