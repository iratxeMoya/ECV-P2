// variables para que no salte error ahora, que ya estan en el plaza.js

var clients = [];
function Client (username, actualPosition_x, actualPosition_y, lastMessage, avatar) {
	this.username = username;
	this.actualPosition_x = actualPosition_x; //grid
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
    this.showLastMessage = false;
    this.avatar = avatar;
}

me = new Client('', '', '', '', '');

// variables que hay que añadir en plaza

function NewPass (newPass, username) {
    this.type = "newPass"
    this.username = username;
    this.newPass = newPass;
}
var avatar = document.querySelector('img#clip');
avatar.addEventListener('click', selectAvatar);

function selectAvatar () {
    console.log('selected: ', this.src);
}

var changeName = document.querySelector('input#newName');
changeName.addEventListener('keydown', onKeyDownChangeName);
ç
var changePass = document.querySelector('input#newPass');
changePass.addEventListener('keydown', onKeyDownChangePass);

var changeNameBtn =  document.querySelector('button#changeName');
changeNameBtn.addEventListener('click', onChangeName);

var changePassBtn =  document.querySelector('button#changePass');
changePassBtn.addEventListener('click', onChangePass);

function onChangeName () {
    myIndex = clients.findIndex(client => client.username === me.username);
    clients[myIndex].username = changeName.nodeValue;
    changeName.value = '';
}
function onKeyDownChangeName (event) {
    if (event.code === "Enter") {
        onChangeName();
    }
}

function onChangePass () {
    // hay que añadirlo en el servidor tambien, y en el plaza onmessage

    passForm = new NewPass(changePass.value, me.username);
    connection.send(JSON.stringify(passForm))
}
function onKeyDownChangePass (event) {
    if (event.code === "Enter") {
        onChangePass();
    }
}
