import fs from 'fs';

export class CartManager{
    
    constructor() {
        this.path = './src/carrito.json';
    }

    async getJSON() {
        let carts;
        try {
            let exist = fs.existsSync(this.path)
            if (!exist) {
                await fs.promises.writeFile(this.path, JSON.stringify([]))
            }
                let contenido = await fs.promises.readFile(this.path)
                carts = JSON.parse(contenido)
        } catch (error) {
            console.log(error)
            throw error
        }
        return carts
    }

    async createCart() {
        let newCart = {
            id: Date.now(),
            products: []
        }
        let carts = await this.getJSON();
        carts.push(newCart)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
        } catch (error) {
            console.log(error)
            throw error
        }
        return newCart
    }

    async getCarts() {
        let carts
        try {
            carts = await this.getJSON()
        } catch (error) {
            console.log(error)
            throw error
        }
        return carts
    }

    async getCartById(ids) {
        let cart;
        try {
            let carts = await this.getJSON()
            cart = carts.find(({ id }) => id == ids); 
        } catch (error) {
            console.log(error)
            throw error
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        let cart;
        let product = {
            id: pid,
            quantity: 1
        };
        try {
            let carts = await this.getJSON()
            let iCart = carts.findIndex(cart => cart.id == cid)
            if (iCart == -1) {
                return cart;
            }     
                let iProduct = carts[iCart].products.findIndex(prod => prod.id == pid)
                if (iProduct == -1) {
                    carts[iCart].products.push(product)
                } else {           
                    carts[iCart].products[iProduct].quantity = carts[iCart].products[iProduct].quantity + 1
                }
                cart = carts[iCart]
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
        } catch (error) {
            console.log(error)
            throw error
        }
        return cart
    }

}