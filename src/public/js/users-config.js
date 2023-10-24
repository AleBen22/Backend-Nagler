const socket = io();


let botones = Array.from(document.getElementById('usersList').children);
botones.forEach(button => {
    button.addEventListener('click', ({target}) => {
    const uid = target.value
    if(uid){
        socket.emit('deleteuser', uid)
    }
})})

socket.on('respondUsers', data => {
    const userList = document.querySelector( '.usersList' );
    userList.innerHTML = '';

    data.forEach( ( docs ) => {
        userList.innerHTML += `
            <div class="user">
                <div class="bigdiv">
                <p>Nombre y Apellido: ${docs.full_name}</p>
                <p>Email: ${docs.user}</p>
                <p>Role: ${docs.role}</p>
                <p>Id: ${docs.id}</p>
                </div>
                <div class="smalldiv">
                <button onclick="location.href = '/role/${docs.id}'" class="logout">Cambiar Role</button>
                <button id="delete" class="logout" value="${docs.id}">Eliminar</button>
                </div>
            </div>
        `;
    });
    botones = Array.from(document.getElementById('usersList').children);
    botones.forEach(button => {
        button.addEventListener('click', ({target}) => {
        const uid = target.value
        if(uid){
            socket.emit('deleteuser', uid)
        }
    })})
})