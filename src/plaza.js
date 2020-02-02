/* 
FALTA:
	> Las funciones para moverse (con el click o con las flechas)
	> Las funciones para pintar el avatar
	> Alguna forma de guardar el avatar de cada cliente
	> Detectar cuando un nuevo usuario se connecta (podría hacrese con el onmessage type: login)
	> Todo el HTML y el CSS
	> Cuando se conecte un nuevo cliente (ya sea por login o por register) hay que hashear su
		password de alguna forma (no se si en el cliente o en el servidor)
	NOTA:
		> HASTA QUE NO ESTÉ MINIMAMENTE EL HTML CON TODAS LAS FUNCIONALIDADES (AUNQUE SEA SIN CSS) NO
			SE PUEDE COMPROBAR QUE EL SERVER Y ESTE JS FUNCIONEN BIEN!! -> CUANTO ANTES LO TENGAMOS
			MEJOR.
*/

var connection = new WebSocket ("wss://ecv-etic.upf.edu/node/9027/ws/");

var clients = [];
var me = new Client (null, null, null, '');

//Faltaría alguna forma de guardar el muñeco de cada usuario (NO SE COMO)
function Client (username, actualPosition_x, actualPosition_y, lastMessage) {
	this.username = username;
	this.actualPosition_x = actualPosition_x;
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
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
	this.client = client;
	this.password = password;
}
function Move (client, x, y) {
	this.type = 'move';
	this.client = client;
	this.x = x;
	this.y = y;
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
	console.log('recived message: ', data);

	if (data.type === 'msg') {

		// append received message from the server to the DOM element
		var messageContainer = document.createElement('div');
		var senderName = document.createElement('div');
		var message = document.createElement('div');
		var parent = document.querySelector('div.chatMessageContainer');

		senderName.innerHTML = data.client;
		message.innerHTML = data.text;

		messageContainer.appendChild(senderName);
		messageContainer.appendChild(message);

		parent.appendChild(messageContainer);

		//Actualize client last message
		var senderIndex = clients.findIndex(client => client.name === data.client);
		clients[senderIndex].lastMessage = data.text;

		//change the senders avatars top message

		//ToDo
	}
	else if (data.type === 'login' || data.type === 'register') {
		
		//create new client
		var client = new Client(data.client, data.x, data.y, data.lastMessage);
		clients.push(client);
		if (data.isMe) {
			console.log('is me')
			me = client;
		}

		//render the new clients avatar

		//ToDo
	}
	else if (data.type === 'move') {

		//actualize senders position
		var senderIndex = clients.findIndex(client => client.name === data.client);
		clients[senderIndex].actualPosition_x = data.x;
		clients[senderIndex].actualPosition_y = data.y;

		//render the avatar of sender in correct position

		// ToDo
	}
	else if (data.type === 'disconnection') {
		var sender = clients.find(client => client.name === data.name);
		clients.delete(sender);

		//Delete clients avatar from the scene

		//ToDo
	}
	else if(data.type == 'loginResponse') {
		if (data.data === 'OK'){
			document.querySelector('div.chatBody').style['display'] = 'block';
			document.querySelector('div.loginBody').style['display'] = 'none';
			document.querySelector('div.registerBody').style['display'] = 'none';	
		} else {
			alert ('Username or password not correct');
		}
	} else if(data.type == 'registerResponse') {
		if (data.data === 'OK'){
			document.querySelector('div.chatBody').style['display'] = 'block';
			document.querySelector('div.loginBody').style['display'] = 'none';	
		} else {
			alert ('Username exists already');
		}
	}

};

//chat
var msgButton = document.querySelector("button.send");
msgButton.addEventListener("click", send_message);

var msgInput = document.querySelector('input.message');
msgInput.addEventListener('keydown', on_key_press_send_msg);

function send_message(){
	var message = new Msg(me.client, msgInput.value);
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

var registerTopBtn = document.querySelector('button#registerTopBtn');
registerTopBtn.addEventListener('click', go_to_register_page);

function send_login () {

    if(loginNameInput.value !== '' && loginPassInput.value !== '') {
        me.username = loginNameInput.value;
        var login = new Login(loginNameInput.value, loginPassInput.value);
        login.isMe = true;
        connection.send(JSON.stringify(login));
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
	document.querySelector('div.registerBody').style['display'] = 'grid';
	document.querySelector('div.loginBody').style['display'] = 'none';	
}

//register
var loginTopBtn = document.querySelector('button#loginTopBtn');
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
        me.username = loginNameInput.value;
		var register = new Register(regNameInput.value, regPassInput.value);
		register.isMe = true;
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

