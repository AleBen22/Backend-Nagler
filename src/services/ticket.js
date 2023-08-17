import TicketsManager from "../DAOs/TicketDAO.js";

const manager = new TicketsManager();

export const createTicketService = async (ticket) => {
    let tickete = await manager.createTicket(ticket)
    if(!tickete){
        return null
    }
    return tickete
}