const socket = io();

const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
document.getElementById('agree').addEventListener('click', () => {
    const product = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: true,
        stock: stock.value,
        category: category.value
    }
    socket.emit('addproduct', product)
})

const id = document.getElementById("productid");
document.getElementById('delete').addEventListener('click', () => {
    socket.emit('deleteproduct', id.value)
})

socket.on('respond', data => {
    document.querySelector('p').innerText = data;
})