import fs from 'fs';

class CartsManager{
    constructor() {
        this.path = './datos/carrito.json';
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
            throw error
        }
        return carts
    }

    async createCart() {
        let newCart = {
            id: Date.now(),
            products: []
            }
        try {
            let carts = await this.getJSON();
            carts.push(newCart)
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
        } catch (error) {
            throw error
        }
        return newCart
    }

    async getCarts() {
        let carts
        try {
            carts = await this.getJSON()
        } catch (error) {
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
            throw error
        }
        return cart;
    }

    async addProductToCart(cid, pid, quantity) {
        let cart;
        let product = {
            id: pid,
            quantity: quantity
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
                    carts[iCart].products[iProduct].quantity = carts[iCart].products[iProduct].quantity
                }
                cart = carts[iCart]
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
        } catch (error) {
            throw error
        }
        return cart
    }

    async deleteCart(cid) {
        let cart
        try {
            let carts = await this.getJSON()
            let indice = carts.findIndex(cart => cart.id == cid)
            if (indice !== -1) {
                carts.splice(indice, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
                carts = await this.getJSON()
                return cart
            }
        } catch (error) {
            throw error
        }
        return cart;
    }

}

export default CartsManager;