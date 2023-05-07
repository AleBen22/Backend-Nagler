import fs from 'fs';

export class ProductManager{
    
    constructor() {
        this.path = 'products.json';
    }
    
    static idGlobal = 0

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
        }
        return products
    }
    
    async addProduct(title, description, price, thumbnail, code, stock) {
        let msg;
        try {
            let codProd = code
            let products = await this.getJSON()
            ProductManager.idGlobal++;

            let product = {
                id: ProductManager.idGlobal,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }

            if (products.find(({ code }) => code === codProd)) {
                msg = { msg: "El código ya existe" }
            } else {
                if(!title || !description || !price || !thumbnail || !code || !stock) {
                    msg = { msg: "Hay campos sin completar!!!" }
                } else {
                    products.push(product)
                    await fs.promises.writeFile(this.path, JSON.stringify(products))
                    msg = { msg: "El producto fue agregado" }
                }
            }
        } catch (error) {
            console.log(error)
        }
        return msg
    }

    async getProductById(ids) {
        let product;
        try {
            let products = await this.getJSON()
            let findProduct = products.find(({ id }) => id == ids); 
            product = findProduct ? findProduct : { msg: "Product Not Found" };
        } catch (error) {
            console.log(error)
        }
        return product;
    }

    async updateProduct(id, product) {
        let msg = { msg: "Producto no encontrado" }
        try {
            let products = await this.getJSON()
            let indice = products.findIndex(prod => prod.id === id)
            if (indice !== -1) {
                if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                    msg = { msg: "Hay campos sin completar, no se pudo actualizar!!!" }
                } else {
                products[indice] = product;
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                msg = { msg: "Producto actualizado" }
                }
            }        
        } catch (error) {
            console.log(error)
        }
        return msg;
    }

    async deleteProduct(id) {
        let msg = "Producto no encontrado"
        try {
            let products = await this.getJSON()
            let indice = products.findIndex(prod => prod.id === id)
            if (indice !== -1) {
                products.splice(indice, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                msg = "Producto eliminado"
            }
        } catch (error) {
            console.log(error)
        }
        return msg;
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