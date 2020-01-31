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

// var connection = new WebSocket ("wss://ecv-etic.upf.edu/node/9027/ws/");

var clients = [];
var me = new Client (null, null, null, '');

var posx=0;
var posy=0;
var otherx=100;
var othery=100;
var rot =0;


var movement = [0,0,0,0];

var myVar = setInterval(update, 50);

var camera = [[0,0,0],[10,0,0],[0,1,0]];

document.body.addEventListener("keydown",function(event){
	console.log("ASD");
	if(event.keyCode == 37){
		movement[0]=1;
	}
	if(event.keyCode == 39){
		movement[1]=1;
	}
	if(event.keyCode == 38){
		movement[2]=1;
	}
	if(event.keyCode == 40){
		movement[3]=1;
	}
});

document.body.addEventListener("keyup",function(event){
	console.log("ASD");
	if(event.keyCode == 37){
		movement[0]=0;
	}
	if(event.keyCode == 39){
		movement[1]=0;
	}
	if(event.keyCode == 38){
		movement[2]=0;
	}
	if(event.keyCode == 40){
		movement[3]=0;
	}
});

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
function Login (username) {
	this.type = 'login';
	this.username = username;
}
function Move (client, x, y) {
	this.type = 'move';
	this.client = client;
	this.x = x;
	this.y = y;
}

/*
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

};

*/
var msgButton = document.querySelector("button.send");
msgButton.addEventListener("click", send_message);

var msgInput = document.querySelector('input.message');
msgInput.addEventListener('keydown', on_key_press_send_msg);

function send_message(){
	var message = new Msg(me.client, msgInput.innerHTML);
	connection.send(JSON.stringify(message));
}

function on_key_press_send_msg(event) {
	if (event.code === 'Enter') {
		send_message();
	}
}

//Aun no existen en el DOM
var loginButton = document.querySelector("button.login");
// loginButton.addEventListener('click', send_login);

var loginInput = document.querySelector("input.name");
// loginInput.addEventListener('keydown', on_key_press_send_login);

function send_login () {

	me.actualPosition_x = 100;
	me.actualPosition_y = 100;
	me.username = loginInput.innerHTML;
	var login = new Login(loginInput.innerHTML);
	//login.isMe = true;
	connection.send(JSON.stringify(login));
}
function on_key_press_send_login() {
	if (event.code === 'Enter') {
		send_login();
	}
}

function rotate_vec(x,y){
	return[Math.cos(-rot)*x - Math.sin(-rot)*y,Math.sin(-rot)*x + Math.cos(-rot)*y];
}

function update(){
	if(movement[0]>0){
		turn(true);
	}
	if(movement[1]>0){
		turn(false);
	}
	if(movement[2]>0){
		forward(false);
	}
	if(movement[3]>0){
		forward(true);
	}
	
	document.getElementsByClassName("plaza")[0].style.transform = "perspective(500px) rotateX(89deg) translate(0%,500px) rotateZ("+rot+"rad) translate("+(-posx)+"px,"+(-posy)+"px)"
	document.getElementsByClassName("pj")[0].style.transform = " perspective(550px) rotateX(89deg) translate(0%,500px) rotateZ("+rot+"rad) translate("+(otherx-posx)+"px,"+(othery-posy)+"px)  rotateX(90deg)";
	update_pj();
}

function clamp(val, lowrange,highrange){
	return (val<lowrange ? lowrange: (val>highrange ? highrange : val));
}

function forward(back = false){
	if(back){
		newpos = rotate_vec(0,10);
	}else{
		newpos = rotate_vec(0,-10);
	}
	console.log(newpos);
	console.log(posx+" "+posy);
	posx=clamp(posx+newpos[0],-500,500);
	posy=clamp(posy+newpos[1],-500,500);
	console.log(posx+" "+posy);
}

function turn(left = true){
	if (left){
		rot=(rot+Math.PI/100);
	}else{
		rot=(rot-Math.PI/100);
	}
}

function update_pj(){
	othery--;
}
