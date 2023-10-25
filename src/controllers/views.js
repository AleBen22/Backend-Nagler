import {
    getAllProductsService,
} from "../services/product.js";
import {
    getByIdService,
    updateUserRoleService,
} from "../services/users.js"
import {
    getCartByIdService,
} from "../services/cart.js"
import {
    generatePIDErrorInfo,
} from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";


export const getDataController = async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let user = req.user
    let data
    let sort = req.query.sort || 'asc';
    try {
        data = await getAllProductsService(page, limit, sort)
        let cart = await getCartByIdService(user.cart)
        if(!cart){
            CustomError.createError({
                name: 'Error de ID',
                cause: generatePIDErrorInfo(id),
                message: 'El ID ingresado no corresponde a un Cart existente',
                code: EErrors.INVALID_PARAM_ERROR
            })
        }
        let cartProducts = 0
        for(var i = 0; i < cart.products.length;i++){
            cartProducts += cart.products[i].quantity
        }
        res.render('index', {data, user, cartProducts, style: 'index.css'})
    } catch (error) {
        res.render('error', {msg: error})
    }
}

export const modUserRoleController = async (req, res) => {
    try {
        let uid = req.params.uid;
        let user = await getByIdService(uid);
        let result
        if(!user) {
            res.render('register', {style: 'index.css'})
        }else{
            if(user.role === "admin"){
                res.status(400).send({status: "error", error: "No puede cambiar un role admin"})
            }else {
                if(user.role === "premium"){
                    result = await updateUserRoleService(uid, 'user')
                } else if(user.role === "user"){
                    result = await updateUserRoleService(uid, 'premium')
                }
                res.redirect('/api/users/userslist')
            }
        }
    } catch (error) {
        res.render('error', {msg: error})
    }
}
