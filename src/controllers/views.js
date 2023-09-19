import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getAllProductsService
} from "../services/views.js";
import {
    getByEmailService
} from "../services/auth.js"

export const getAllProductsController = async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let user
    let data
    //let sort = req.params.sort;
    //let filter = req.query.filter;
    try {
        data = await getAllProductsService(page, limit)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    try {
        user = await getByEmailService(req.session.user)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    const rol = user.role
    const admin = req.session.admin
    let contact = new ContactDTO({user, rol, admin})
    res.render('index', {data, contact, style:'index.css'})
}
