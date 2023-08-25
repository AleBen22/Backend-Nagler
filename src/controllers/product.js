import {
    getAllProductsService,
    getProductByIdService,
    addproductService,
    updateProductService,
    deleteProductService
} from '../services/product.js';
import { generarProductos } from '../mocks/product.js'
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo, generatePIDErrorInfo, generateConexionError } from "../services/errors/info.js";
import { validateProduct } from '../utils/index.js';

export const getAllProductsController = async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
    let data
    try {
        data = await getAllProductsService(page, limit)
        res.send({ status: "success", data })
    } catch (error) {
        res.status(400).send({ status: "error", error })
    }
}

export const getProductByIdController = async (req, res) => {
    let id = req.params.pid;
    let product
    try {
        product = await getProductByIdService(id)
        res.send({ status: "success", product }) 
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto` });
    }
}

export const addProductController = async (req, res) => {
    try {
    let { title, description, code, price, stock, category, status } = req.body;
    let producto = req.body;
    if(!validateProduct(producto)) {
        CustomError.createError({
            name: 'Error al registrar producto',
            cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
            message: 'Error al intentar crear el producto',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    let result = await addproductService(title, description, code, price, stock, category, status)
    res.send({ status: "success", payload: result })
    } catch (error) {
        res.status(400).send({ status: "error", error });
    }
}

export const updateProductController = async (req, res) => {
    try {
        let id = req.params.pid;
        let { title, description, code, price, stock, category, status } = req.body;
        let fields = req.body;
        if(!validateProduct(fields)) {
            CustomError.createError({
                name: 'Error al actualizar producto',
                cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
                message: 'Error al intentar actualizar el producto',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        let updateProd = await updateProductService(title, description, code, price, stock, category, status)
        res.send({ status: 'success', payload: updateProd})
    } catch (error) {
        res.status(400).send({ status: 'error', error})
    }
}

export const deleteProductController = async (req, res) => {
    let id = req.params.pid;
    let deleteProd
    try {
        deleteProd = await deleteProductService(id)
        res.send({ status: 'success', msg: `El id ${id} fue eliminado`})
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto`})
    }
}

export const getFakerProduct = async (req, res) => {
    let cant = req.params.cant
    let product = generarProductos(cant)
    res.send(product)
}