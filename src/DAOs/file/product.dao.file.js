import fs from 'fs';

class ProductManager{
    
    constructor() {
        this.path = './datos/productos.json';
    }

    async getJSON() {
        let products;
        try {
            let exist = fs.existsSync(this.path)
            if (!exist) {
                await fs.promises.writeFile(this.path, JSON.stringify([]))
            }
            let contenido = await fs.promises.readFile(this.path)
            products = JSON.parse(contenido)
        } catch (error) {
            throw error
        }
        return products
    }

    async getAllProducts() {
        let products
        try {
            products = await this.getJSON()
        } catch (error) {
            throw error
        }
        return products
    }

    async getProductById(ids) {
        let product;
        try {
            let products = await this.getJSON()
            product = products.find(({ id }) => id == ids); 
        } catch (error) {
            throw error
        }
        return product;
    }

    async addProduct(title, description, code, price, stock, category, status, owner) {
        let product = {title, description, code, price, stock, category, status, owner}
        let id = Date.now();
        try {
            let products = await this.getJSON()
            product.id = id;
            product.status = true;             
            products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } catch (error) {
            throw error
        }
        return product
    }

    async updateProduct(pid, fields) {
        let product;
        try {
            let products = await this.getJSON()
            let indice = products.findIndex(prod => prod.id == pid)
            if (indice == -1) {
                return product;
            }
            fields.title ? products[indice].title = fields.title : "";
            fields.description ? products[indice].description = fields.description : "";
            fields.code ? products[indice].code = fields.code : "";
            fields.price ? products[indice].price = fields.price : "";
            fields.status ? products[indice].status = fields.status : "";
            fields.stock ? products[indice].stock = fields.stock : "";
            fields.category ? products[indice].category = fields.category : "";
            product = products[indice]
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } catch (error) {
            throw error
        }
        return product;
    }

    async deleteProduct(id) {
        let product
        try {
            let products = await this.getJSON()
            let indice = products.findIndex(prod => prod.id == id)
            if (indice !== -1) {
                products.splice(indice, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                product = await this.getJSON()
                return product
            }
        } catch (error) {
            throw error
        }
        return product;
    }

}

export default ProductManager;