/*
LOGICA DE PAGINAS:
	1. login
		1.1 si pulsas register -> register
		1.2 si pulsas login -> chat
	2. register
		2.1 si pulsas login -> login
		2.2 si pulsas register -> select avatar
	3. select avatar
		3.1 si pulsas el avatar -> chat
	3 chat
		3.1 si pulsas _____ -> configuration
	4. configuration
		4.1 si pulsas change name / pass -> configuration
		4.2 su pulsas change avatar -> select avatar
		4.3 si pulsas back -> chat
*/
var connection = new WebSocket ("wss://ecv-etic.upf.edu/node/9027/ws/");

var clients = [];
var me = new Client (null, null, null, '', '');

var updating_func = setInterval(updatePlaza, 50);

function updatePlaza () {
	update(clients);
}

//Faltaría alguna forma de guardar el muñeco de cada usuario (NO SE COMO)
function Client (username, actualPosition_x, actualPosition_y, lastMessage) {
	this.username = username;
	this.actualPosition_x = actualPosition_x; //grid
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
	this.showLastMessage = false;
	this.avatar = '';
}
//Message types
function Msg (client, text) {
	this.type = 'msg';
	this.client = client;
	this.text = text;
}
function Login (username, password) {
	this.type = 'login';
	this.username = username;
	this.password = password
}
function Register (client, password) {
	this.type = 'register';
	this.username = client;
	this.password = password;
}
function Move (client, x, y) {
	this.type = 'move';
	this.client = client;
	this.x = x;
	this.y = y;
}
function NewPass (newPass, username) {
    this.type = "newPass"
    this.username = username;
    this.newPass = newPass;
}
function NewUsername (newUsername, username){
	this.type =  "newUsername";
	this.username = username;
	this.newUsername = newUsername;
}
function NewAvatar (username, avatar) {
	this.type = "newAvatar";
	this.username = username;
	this.avatar = avatar;
}

connection.onopen = event => {
	console.log('connection is open');
}

connection.onclose = (event) => {
    console.log("WebSocket is closed");
};

connection.onerror = (event) => {
    console.error("WebSocket error observed:", event);
};

connection.onmessage = (event) => {
	var data = JSON.parse(event.data); 
	console.log('recived message: ', data.type);

	if (data.type === 'msg') {

		// append received message from the server to the DOM element
		var messageContainer = document.createElement('div');
		var senderName = document.createElement('div');
		var message = document.createElement('div');
		var parent = document.querySelector('div.chatMessageContainer');

		senderName.innerText = data.client;
		message.innerText = data.text;

		messageContainer.appendChild(senderName);
		messageContainer.appendChild(message);
		messageContainer.style['backgroundColor'] = 'red';

		parent.appendChild(messageContainer);

		//Actualize client last message
		var senderIndex = clients.findIndex(client => client.username === data.client);
		clients[senderIndex].lastMessage = data.text;
		clients[senderIndex].showLastMessage = true;

		setTimeout(function(){clients[senderIndex].showLastMessage = false;}, 2000);

		//change the senders avatars top message

		show_msg(data.client, data.text);
	}
	else if (data.type === 'login' || data.type === 'register') {
		
		//create new client
		var client = new Client(data.username, data.x, data.y, data.lastMessage, data.avatar);
		clients.push(client);
		console.log(client)
		if (client.username == me.username) {
			me = client;
		}

		//render the new clients avatar

		create_pj(data.x,data.y, client.username);
		
	}
	else if(data.type === 'alreadyLoged') {
		var client = new Client(data.username, data.x, data.y, data.lastMessage, data.avatar);
		clients.push(client);
		create_pj(data.x,data.y, data.username);
	}
	else if (data.type === 'move') {

		//actualize senders position
		var senderIndex = clients.findIndex(client => client.username === data.client);
		clients[senderIndex].actualPosition_x = data.x;
		clients[senderIndex].actualPosition_y = data.y;
		console.log('move: ', data.x, data.y, data.client);

		//render the avatar of sender in correct position

		move_pj(data.x, data.y, data.client);
	}
	else if (data.type === 'disconnection') {
		var sender = clients.find(client => client.username === data.name);
		clients.delete(sender)
		console.log(clients, sender)
		

		//Delete clients avatar from the scene

		//ToDo
		
	}
	else if(data.type == 'loginResponse') {

		if (data.data === 'OK'){

			document.querySelector('div.chatBody').style['display'] = 'grid';
			document.querySelector('div.loginBody').style['display'] = 'none';
			document.querySelector('div.registerBody').style['display'] = 'none';	

		} else {

			alert ('Username or password not correct');

		}

	} 
	else if(data.type == 'registerResponse') {

		if (data.data === 'OK'){

			console.log('hola')

			document.querySelector('div.chatBody').style['display'] = 'none';
			document.querySelector('div.loginBody').style['display'] = 'none';	
			document.querySelector('div.registerBody').style['display'] = 'none';
			document.querySelector('div.profileSelectorBody').style['display'] = 'block';

		} else {

			alert ('Username exists already');

		}

	} 
	else if(data.type === 'newUsername') {

		myIndex = clients.findIndex(client => client.username === data.username);
		clients[myIndex].username = data.newUsername;
		
	}
	else if (data.type === 'newAvatar') {

		console.log('new avatar: ', data)
		myIndex = clients.findIndex(client => client.username === data.username);
		clients[myIndex].avatar = data.avatar;
		document.querySelector('div.chatBody').style['display'] = 'grid';
		document.querySelector('div.profileSelectorBody').style['display'] = 'none';

	}
	
};

//chat
var msgButton = document.querySelector("button.send");
msgButton.addEventListener("click", send_message);

var msgInput = document.querySelector('input.message');
msgInput.addEventListener('keydown', on_key_press_send_msg);

function send_message(){
	var message = new Msg(me.username, msgInput.value);
	console.log('sending message: ', message);
	connection.send(JSON.stringify(message));
}

function on_key_press_send_msg(event) {
	if (event.code === 'Enter') {
		send_message();
	}
}


//login
var loginBotButton = document.querySelector("button#loginBotBtn");
loginBotButton.addEventListener('click', send_login);

var loginNameInput = document.querySelector("input#logUsername");
loginNameInput.addEventListener('keydown', on_key_press_send_login);

var loginPassInput = document.querySelector("input#logPassword");
loginPassInput.addEventListener('keydown', on_key_press_send_login);

var registerTopBtn = document.querySelector('a#registerTopBtn');
registerTopBtn.addEventListener('click', go_to_register_page);

function send_login () {

    if(loginNameInput.value !== '' && loginPassInput.value !== '') {
        me.username = loginNameInput.value;
        var login = new Login(loginNameInput.value, loginPassInput.value);
        login.isMe = true;
		connection.send(JSON.stringify(login));
		//loginNameInput.value = '';
		//loginPassInput.value = '';
    } else {
        alert('You need to enter an username and a password to login');
    }
}
function on_key_press_send_login() {
	if (event.code === 'Enter') {
		send_login();
	}
}

function go_to_register_page () {
	console.log('hey')
	document.querySelector('div.registerBody').style['display'] = 'grid';
	document.querySelector('div.loginBody').style['display'] = 'none';	
}

//register
var loginTopBtn = document.querySelector('a#loginTopBtn');
loginTopBtn.addEventListener('click', go_to_login_page);

var regNameInput = document.querySelector("input#regUsername");
regNameInput.addEventListener('keydown', on_key_press_send_register);

var regPassInput = document.querySelector("input#regPassword");
regPassInput.addEventListener('keydown', on_key_press_send_register);

var registerBotButton = document.querySelector("button#registerBotBtn");
registerBotButton.addEventListener('click', send_register);

function go_to_login_page () {
	document.querySelector('div.loginBody').style['display'] = 'grid';
	document.querySelector('div.registerBody').style['display'] = 'none';	
}

function send_register () {
	if(regNameInput.value !== '' && regPassInput.value !== '') {
        me.actualPosition_x = 100;
        me.actualPosition_y = 100;
        me.username = regNameInput.value;
		var register = new Register(regNameInput.value, regPassInput.value);
		register.isMe = true;
		regNameInput.value = '';
		regPassInput.value = '';
		connection.send(JSON.stringify(register));
	} else {
		alert('You need to enter an username and a password to login');
	}
		
}
function on_key_press_send_register() {
	if (event.code === 'Enter') {
		send_register();
	}
}

// move

document.querySelector('canvas#canvas').addEventListener('click', onPlazaClick);

var cnt = 0;

function onPlazaClick (event) {
	var rect = cvs.getBoundingClientRect();
	me.actualPosition_x = event.clientX - rect.left;
	me.actualPosition_y = event.clientY - rect.top;

	var myIndex = clients.findIndex(client => client.username === me.username);
	clients[myIndex].actualPosition_x = Math.floor(event.clientX / TILESIZE);
	clients[myIndex].actualPosition_y = Math.floor(event.clientY / TILESIZE);

	move_pj(me.actualPosition_x, me.actualPosition_y, me.username);

	var move = new Move(me.username, me.actualPosition_x, me.actualPosition_y);
	console.log(me.actualPosition_x, me.actualPosition_y);
	connection.send(JSON.stringify(move));
}


var avatars = document.querySelectorAll('img#clip');
avatars.forEach(avatar=> avatar.addEventListener('click', selectAvatar));

function selectAvatar () {

	var avatarName = this.src.split('/')[6].split('-')[0];

	var avatar = new NewAvatar(me.username, avatarName);
	
	connection.send(JSON.stringify(avatar));
	
}

var changeName = document.querySelector('input#newName');
changeName.addEventListener('keydown', onKeyDownChangeName);

var changePass = document.querySelector('input#newPass');
changePass.addEventListener('keydown', onKeyDownChangePass);

var changeNameBtn =  document.querySelector('button#changeName');
changeNameBtn.addEventListener('click', onChangeName);

var changePassBtn =  document.querySelector('button#changePass');
changePassBtn.addEventListener('click', onChangePass);

function onChangeName () {
    myIndex = clients.findIndex(client => client.username === me.username);
	
	newUsername = new NewUsername(changeName.value, clients[myIndex].username);
	clients[myIndex].username = changeName.nodeValue;
	changeName.value = '';
	connection.send(JSON.stringify(newUsername));
}
function onKeyDownChangeName (event) {
    if (event.code === "Enter") {
        onChangeName();
    }
}

function onChangePass () {

    passForm = new NewPass(changePass.value, me.username);
    connection.send(JSON.stringify(passForm))
}
function onKeyDownChangePass (event) {
    if (event.code === "Enter") {
        onChangePass();
    }
}



//UTILS

Array.prototype.delete = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
