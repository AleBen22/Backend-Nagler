import {
    getAllProductsService,
    getProductByIdService,
    addproductService,
    updateProductService,
    deleteProductService
} from '../services/product.js';
import { validateProduct } from '../utils/index.js';

export const getAllProductsController = async (req, res) => {
    let page = req.params.page || 1;
    let limit = req.params.limit || 10;
    //let sort = req.params.sort;
    //let filter = req.query.filter;
    let data
    try {
        data = await getAllProductsService(page, limit)
    } catch (error) {
        res.status(400).send({ status: "error", error })
    }
    res.send({ status: "success", data })
}

export const getProductByIdController = async (req, res) => {
    let id = req.params.pid;
    let product
    try {
        product = await getProductByIdService(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto` });
    }
        res.send({ status: "success", product }) 
}

export const addProductController = async (req, res) => {
    let { title, description, code, price, stock, category, status } = req.body;
    let producto = req.body;
    let result
    if(!validateProduct(producto)) {
        res.status(400).send({ status: 'error', msg: 'Falta información'})
    }
    try {
        result = await addproductService(title, description, code, price, stock, category, status)
    } catch (error) {
        res.status(400).send({ status: 'error', error });
    }
        res.send({ status: "success", payload: result })
}

export const updateProductController = async (req, res) => {
    let id = req.params.pid;
    let { title, description, code, price, stock, category, status } = req.body;
    let fields = req.body;
    if(!validateProduct(fields)) {
        res.status(400).send({ status: 'error', msg: 'Falta información'})
    }
    let updateProd
    try {
        updateProd = await updateProductService(title, description, code, price, stock, category, status)
    } catch (error) {
        res.status(400).send({ status: 'error', error})
    }
        res.send({ status: 'success', payload: updateProd})
}

export const deleteProductController = async (req, res) => {
    let id = req.params.pid;
    let deleteProd
    try {
        deleteProd = await deleteProductService(id)
    } catch (error) {
        res.status(400).send({ status: 'error', msg: `El id ${id} no corresponde a un producto`})
    }
        res.send({ status: 'success', msg: `El id ${id} fue eliminado`})
}