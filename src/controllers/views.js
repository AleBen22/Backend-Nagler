import {
    getAllProductsService
} from "../services/product.js";

export const getAllProductsController = async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
    let data
    try {
        data = await getAllProductsService(page, limit)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    if(!req.user) return res.render('login-error', {})
    req.session.user = req.user.email
    req.session.admin = req.user.admin
    res.render('index', {data, user: req.session.user, rol: req.session.admin ? "admin" : "usuario", style:'index.css'})
}