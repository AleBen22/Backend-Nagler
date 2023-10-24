import TicketsManager from "../DAOs/mongo/ticket.dao.mongo.js";

const manager = new TicketsManager();

export const createTicketService = async (ticket) => {
    let tickete = await manager.createTicket(ticket)
    if(!tickete){
        return null
    }
    return tickete
}

export const getTicketService = async (tid) => {
    let tickete = await manager.getTicketById(tid)
    if(!tickete){
        return null
    }
    return tickete
}

export const updateTicketPaymentStatusService = async (tid, code) => {
    let updateTicket = await manager.updateTicketPaymentStatus(tid, code )
    return updateTicket
}

export const getTicketsByPurchaserService = async (purchaser) => {
    let tickete = await manager.getTicketByPurchaser(purchaser)
    if(!tickete){
        return null
    }
    return tickete
}