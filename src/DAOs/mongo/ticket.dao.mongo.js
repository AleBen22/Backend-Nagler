import { get } from "mongoose";
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
            console.log(error)
        }
        return tickets
    }

    async getTicketById(ids) {
        let ticket;
        try {
            ticket = await ticketModel.findOne({ _id: ids })
        } catch (error) {
            throw error
            console.log(error)
        }
        return ticket;
    }

    async createTicket(ticket) {
        let newTicket
        try {
            newTicket = await ticketModel.create(ticket)
        } catch (error) {
            throw error
            console.log(error)
        }
        return newTicket
    }

}

export default TicketsManager;