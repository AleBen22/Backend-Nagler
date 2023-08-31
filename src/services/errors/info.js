export const generateProductErrorInfo = (product) => {
    return `Uno o mas parametros no son validos:
    - title: necesita recibir un String, recibio: ${product.title}
    - description: necesita recibir un String, recibio: ${product.description}
    - code: necesita recibir un String, recibio: ${product.code}
    - price: necesita recibir un Number, recibio: ${product.price}
    - stock: necesita recibir un Number, recibio: ${product.stock}
    - category: necesita recibir un String, recibio: ${product.category}`
}

export const generatePIDErrorInfo = pid => {
    return `El id no corresponde a un producto existente, se recibió: ${pid}`
}

export const generateCIDErrorInfo = cid => {
    return `El cart no corresponde a un usuario registrado, se recibió: ${cid}`
}

export const generateQuantityErrorInfo = pid => {
    return `El valor ingresado no corresponde a un numero mayor a 0, se recibió: ${pid}`
}

export const generateConexionError = error => {
    return `Error al correr servicio, se recibió: ${error}`
}    