import PaymentService from "../services/payments.js";
import { getTicketService } from "../services/ticket.js";



export const paymentController = async (req, res) => {
    let { tid } = req.body
    const ticketReq = await getTicketService(tid)
    if(!ticketReq) return res.render('/error', { msg: 'Ticket not found'})
    const paymentIntentInfo = {
        amount: ticketReq.amount,
        currency: 'usd',
        payment_method_types: ["card"],
    }
    const service = new PaymentService()
    const result = await service.createPaymentIntent(paymentIntentInfo)
    res.render('checkout', { tid: tid, clientSecret: result.client_secret, style: 'checkout.css' });
}