import { faker } from "@faker-js/faker"

export const generarProducto = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric({casing: 'upper', length: 6}),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int( {max: 1000} ),
        category: faker.commerce.department() 
    }
}

export const generarProductos = cant => {
    let products = []
    for (let i = 0; i < cant; i++) {
        products.push(generarProducto())
    }
    return products
}