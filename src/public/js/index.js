const socket = io();


const role = document.getElementById("role").innerText
const user = document.getElementById('user').innerText


if(role === "admin") {
    
    const page = document. getElementById("page").innerText;
    const limit = document. getElementById("limit").value;
    let botones = Array.from(document.getElementById('productsList').children);
    botones.forEach(button => {
        button.addEventListener('click', ({target}) => {
        const pid = target.value
        if (pid) {
            socket.emit('deleteproduct', {pid, user, role, page, limit})
        }
    })})

    socket.on('respondProducts', data => {
        const productList = document.querySelector( '.productsList' );
        productList.innerHTML = '';
        data.payload.forEach( ( docs ) => {
            productList.innerHTML += `
                <div class="product">
                    <div class="bigdiv">
                        <p>${docs.title}</p>
                        <p id="productid">${docs._id}</p>
                        <p style="width: 100%">Descripcion: ${docs.description}</p>
                        <br>
                        <br>
                        <p>Disponibles: ${docs.stock}</p>
                        <p>Precio: ${docs.price}</p>
                    </div>
                    <div class="smalldiv">
                        <button id="delete" class="logout" value="${docs._id}">Eliminar</button>
                    </div>
                </div>
            `;
        });
        botones = Array.from(document.getElementById('productsList').children);
        botones.forEach(button => {
            button.addEventListener('click', ({target}) => {
            const pid = target.value
            if (pid) {
                socket.emit('deleteproduct', {pid, user, role, page, limit})
            }        
        })})
    })

} else {

    let chatBox = document.getElementById('chatBox');
    chatBox.addEventListener('keyup', evento => {
        if(evento.key === 'Enter'){
            if(chatBox.value.trim().length > 0){
                socket.emit('message', { user: user, message: chatBox.value });
                chatBox.value = "";
            }
        }
    })

    socket.on('messages', data => {
        let log = document.getElementById('messageLogs');
        let messages = "";
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message}</br>`
        });
        log.innerHTML = messages;
    })

}