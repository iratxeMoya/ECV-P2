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
	console.log('new message in plaza: ', data);

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
	else if(data.type == 'loginResponse') {
		if (data.data === 'OK'){
			document.querySelector('div.chatBody').style['display'] = 'block';
			document.querySelector('div.loginBody').style['display'] = 'none';	
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
	connection.send(JSON.stringify(message));
}

function on_key_press_send_msg(event) {
	if (event.code === 'Enter') {
		send_message();
	}
}

//page setup
const tilesize = 50;
const bordersize = 2;
var h=0;
var mapdim=0;
var i =0;
var j=0;
var style;

style = window.getComputedStyle(document.getElementById("main_plaza"));
console.log(document.getElementById("main_plaza").style.border);
h = style.height;
h=parseInt(h.substring(0, h.length - 2));

if(h%tilesize!=0 || w%tilesize!=0){
	h=Math.floor(h/tilesize)*tilesize;
	document.getElementById("main_plaza").style.height = h+"px";
	document.getElementById("main_plaza").style.width = h+"px";
}

mapdim = Math.floor(h/tilesize);

for (i=0;i<mapdim;i++){
	for (j=0;j<mapdim;j++){
		let e =document.createElement("span");
		e.classList.add("tile");
		e.style.top=(i*tilesize)+"px";
		e.style.left=(j*tilesize)+"px";
		e.style.zIndex =0;
		document.getElementById("main_plaza").appendChild(e);
	}
}

//movement 
var posx=bordersize;
var posy=bordersize;
var finalx=bordersize;
var finaly=bordersize;
var movingx = false;
var movingy	=false;
var gridposx=0;
var gridposy=0;
var placed_obj =false;
var obj_counter=0;
var objects=[];
var updating_func = setInterval(update, 50);
var map = Array(mapdim).fill(0).map(()=>Array(mapdim).fill(0));


document.body.addEventListener("click",function(event){
	finalx = Math.floor(event.clientX/tilesize)*tilesize+bordersize;
	if(finalx>(mapdim-1)*tilesize){
		finalx=(mapdim-1)*tilesize+bordersize;
	}
	finaly = Math.floor(event.clientY/tilesize)*tilesize+bordersize;
	if(finaly>(mapdim-1)*tilesize){
		finaly=(mapdim-1)*tilesize+bordersize;
	}
	if(!movingx){
		movingy = true;
	}
});


function rotate_vec(x,y){
	return[Math.cos(-rot)*x - Math.sin(-rot)*y,Math.sin(-rot)*x + Math.cos(-rot)*y];
}

function update(){
	let prob = Math.random()*100;
	let rx = 0;
	let ry = 0;
	let newelement;
	let i=0;
	if(prob>90 && !placed_obj){
		while (rx==gridposx && ry==gridposy){
			rx=Math.floor(Math.random()*(mapdim));
			ry=Math.floor(Math.random()*(mapdim));
			console.log(rx+" "+ry); 
		}
		newelement = document.createElement("span");
		newelement.classList.add("tile");
		newelement.id="obj";
		newelement.style.backgroundColor="yellow";
		newelement.style.top=ry*tilesize+"px";
		newelement.style.left=rx*tilesize+"px";
		document.getElementById("main_plaza").appendChild(newelement);
		objects.push([rx,ry]);
		placed_obj=true;
	}
	
	if(placed_obj){
		for(i=0;i<objects.length;i++){
			if(objects[i][0]==gridposx && objects[i][1]==gridposy){
				obj_counter++;
				console.log(document.getElementById("obj"));
				document.getElementById("main_plaza").removeChild(document.getElementById("obj"));
				objects.pop();
				placed_obj=false;
			}
		}
	}
	
	if(movingy){
		if(posy<finaly){
			posy+=10;
		}else if (posy>finaly){
			posy-=10;
		}
		if(posy==finaly && posx==finalx){
			movingy=false;
			movingx=false;
		}else if(posy==finaly){
			movingy=false;
			movingx=true;
		}
	}else if(movingx){
		if(posx<finalx){
			posx+=10;
		}else if (posx>finalx){
			posx-=10;
		}
		if(posx==finalx){
			movingy=true;
		}
	}
	
	map[gridposx][gridposy]=0;
	
	gridposx=Math.floor(posx/tilesize);
	gridposy=Math.floor(posy/tilesize);
	
	map[gridposx][gridposy]=1;

	document.getElementsByClassName("pj2")[0].style.top = (tilesize*gridposy)+"px";
	document.getElementsByClassName("pj2")[0].style.left = (tilesize*gridposx)+"px";
	
	document.getElementsByClassName("pj")[0].style.top = posy+"px";
	document.getElementsByClassName("pj")[0].style.left = posx+"px";
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
//        me.actualPosition_x = 100;
//        me.actualPosition_y = 100;
//        me.username = loginNameInput.value;
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
//        me.actualPosition_x = 100;
//        me.actualPosition_y = 100;
//        me.username = loginNameInput.value;
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

