export default class ContactDTO {
    constructor(user){
        this.full_name = user.first_name + " " + user.last_name,
        this.user = user.email,
        this.id = user._id,
        this.cart = user.cart,
        this.role = user.role,
        this.admin = user.admin
    }
}



