export const generateProductErrorInfo = (product) => {
    return `Uno o mas parametros no son validos:
    - title: necesita recibir un String, recibio: ${product.title}
    - description: necesita recibir un String, recibio: ${product.description}
    - code: necesita recibir un String, recibio: ${product.code}
    - price: necesita recibir un Number, recibio: ${product.price}
    - stock: necesita recibir un Number, recibio: ${product.stock}
    - category: necesita recibir un String, recibio: ${product.category}`
}