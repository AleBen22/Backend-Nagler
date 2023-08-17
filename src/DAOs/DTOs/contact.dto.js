export default class ContactDTO {
    constructor(contact){
        this.full_name = contact.user.first_name + " " + contact.user.last_name,
        this.user = contact.user.email,
        this.cart = contact.user.cart,
        this.rol = contact.rol,
        this.admin = contact.admin
    }
}



