import fs from 'fs';

export class ProductManager{
    
    constructor() {
        this.path = './src/productos.json';
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
            console.log(error)
        }
        return products
    }

    async getProducts() {
        let products
        try {
            products = await this.getJSON()
        } catch (error) {
            console.log(error)
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
            console.log(error)
            throw error
        }
        return product;
    }

    async addProduct(producto) {
        let msg;
        let id = Date.now();
        try {
            let products = await this.getJSON()
            producto.id = id;
            producto.status = true;             
            products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            msg = { msg: 'El producto fue agregado' }
        } catch (error) {
            console.log(error)
            throw error
        }
        return msg
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
            console.log(error)
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
            console.log(error)
            throw error
        }
        return product;
    }

}

// const manager = new ProductManager();

// let get = await manager.getProducts()
// console.log(get)

// let add = await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// console.log(add)

// get = await manager.getProducts()
// console.log(get)

// let getId = await manager.getProductById(3)
// console.log(getId)

// let newProduct = {
//     id: 1,
//     title: "nuevo",
//     description: "Este producto fue actualizado",
//     price: 300,
//     thumbnail: "Sin Imagen",
//     code: "abc130",
//     stock: 29
// }

// let update = await manager.updateProduct(newProduct.id, newProduct)
// console.log(update)

// get = await manager.getProducts()
// console.log(get)

// let del = await manager.deleteProduct(1)
// console.log(del)

// get = await manager.getProducts()
// console.log(get)