var connection = new WebSocket ("wss://ecv-etic.upf.edu/node/9027/ws/");

var clients = [];
var me = new Client (null, null, null, '', '');

var updating_func = setInterval(updatePlaza, 50);

function Client (username, actualPosition_x, actualPosition_y, lastMessage, avatar = '') {
	this.username = username;
	this.actualPosition_x = actualPosition_x;
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
	this.showLastMessage = false;
	this.avatar = avatar;
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