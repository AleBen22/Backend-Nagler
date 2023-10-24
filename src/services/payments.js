import Stripe from "stripe";
const key = 'sk_test_51O2KQoHT7IAQenOo4ica3qS938LXOnknXOV6ZpK5YMSHp2JszHTsynYQaL1CuYuM6mx9KJjgFv8J76jnISwngXbr00Q8yJRij0'

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(key)
    }

    createPaymentIntent = async(data) => { 
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}