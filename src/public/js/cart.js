const socket = io();


let botones = Array.from(document.getElementById('listado').children);
botones.forEach(button => {
    button.addEventListener('click', ({target}) => {
    const pid = target.value
    const cid = document.getElementById('cartId').innerText
    if (pid) {
        if (pid !== "Modificar cantidad") {
            socket.emit('deleteproductcart', {pid, cid})
    }}
})})

socket.on('respondCart', data => {
    const cartList = document.querySelector( '.listado' );
    cartList.innerHTML = '';
    data.products.forEach( ( docs ) => {
        cartList.innerHTML += `
            <form class="product" action="/api/carts/${data._id}/product/${docs.id._id}" method="post" role="form">
                <h2>${docs.id.title}</h2>
                <p>Descripción: ${docs.id.description}</p>
                <input type="hidden" name="cart" value="true">
                <input type="number" class="quantity" name="quantity" id="quantity" placeholder="${docs.quantity}" required>
                <input type="submit" class="buttoncart" value="Modificar cantidad">
                <button id="delete" class="buttoncart" value="${docs.id._id}">Quitar del carrito</button>
            </form>   
        `;
    });
    let botones = Array.from(document.getElementById('listado').children);
    botones.forEach(button => {
        button.addEventListener('click', ({target}) => {
        const pid = target.value
        const cid = document.getElementById('cartId').innerText
        if (pid) {
            if (pid !== "Modificar cantidad") {
                socket.emit('deleteproductcart', {pid, cid})
        }}
    })})
})