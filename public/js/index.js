const socket = io();
let chatBox = document.getElementById('chatBox');

const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
document.getElementById('new').addEventListener('click', () => {
    const product = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        stock: stock.value,
        category: category.value,
        status: true
    }
    socket.emit('newproduct', (product))
})

const id = document.getElementById("productid");
document.getElementById('delete').addEventListener('click', () => {
    socket.emit('deleteproduct', id.value)
})

const pid = document.getElementById("prueba");
const cid = document.getElementById("cart");
const quantity = document.getElementById("quantity");
document.getElementById('agregar').addEventListener('click', () => {
    const product = {
        pid: pid.value,
        cid: cid.value,
        quantity: quantity.value,
    }
    console.log(pid)
    socket.emit('addproducttocart', (product))
})

socket.on('respond', data => {
    document.querySelector('p').innerText = data;
})

chatBox.addEventListener('keyup', evento => {
    if(evento.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            let user = document.getElementById('user');
            socket.emit('message', { user: user.value, message: chatBox.value });
            chatBox.value = "";
        }
    }
})

socket.on('messages', data => {
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(msg => {
        messages = messages + `${msg.user} dice: ${msg.message}</br>`
    });
    console.log(messages)
    log.innerHTML = messages;
})