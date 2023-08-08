import CartsManager from '../dao/CartDAO.js';

const manager = new CartsManager();

export const getAllCartsService = async () => {
    let carts = await manager.getCarts()
    return carts
}

export const getCartByIdService = async (id) => {
    let cart = await manager.getCartById(id)
    return cart
}

export const createCartService = async () => {
    let cart =  await manager.createCart();
    return cart
}

export const addProductToCartService = async (cid, pid, quantity) => {
    let addToCart = await manager.addProductToCart(cid, pid, quantity)
    return addToCart
}

export const deleteCartService = async (cid) => {
    let deleteCart = await manager.deleteCart(cid)
    return deleteCart
}

export const deleteProductFromCartService = async (cid, pid) => {
    let deleteFromCart = await manager.deleteProductFromCart(cid, pid)
    return deleteFromCart
}