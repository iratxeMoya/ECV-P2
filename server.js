
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');
var router = express.Router();
var path = require('path');

var wss = new WebSocket.Server({server});

var registeredClients = [];
var connectedClients = [];
var messages = [];

function Message (client, text, sentPosition_x, sentPosition_y) {
	this.client = client;
	this.text = text;
	this.sentPosition_x = sentPosition_x;
	this.sentPosition_y = sentPosition_y;
}
//Faltaría alguna forma de guardar el muñeco de cada usuario (NO SE COMO)
function Client (username, actualPosition_x, actualPosition_y, lastMessage, connection, hashedPassword) {
	this.username = username;
	this.actualPosition_x = actualPosition_x;
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
	this.connection = connection;
	this.hashedPassword = hashedPassword;
}

const checkUsername = ( name, obj ) => obj.name === name;

wss.on('connection', function(ws) {

	ws.on('message', function(data){

		var jsonData = JSON.parse(data);
		console.log('new message in server of type: ', jsonData.type);

		if(jsonData.type === 'login') {
			var client = registeredClients.find(client => client.name === jsonData.client);
			if (/*client && jsonData.hashedPassword === client.hashedPassword*/ true) {
			//	client.connection = ws;
			//	connectedClients.push(client);
			//	jsonData.x = client.actualPosition_x;
			//	jsonData.y = client.actualPosition_y;
			//	jsonData.lastMessage = client.lastMessage
			//	var dataForClients = JSON.stringify(jsonData);
			//	broadcastMsg(dataForClients, false);
				console.log('in if');
				var okLoginResponse = {type: 'loginResponse', data: 'OK'};
				ws.send(JSON.stringify(okLoginResponse));
			}
			else {
				console.log('Loging error, password error or no registered')
			}
		}
		else if (jsonData.type === 'register') {
			if(registeredClients.some(checkUsername(jsonData.client))){
				jsonData.x = 100;
				jsonData.y = 100;
				jsonData.lastMessage = '';
				var dataForClients = JSON.stringify(jsonData);
				var newClient = new Client(jsonData.username, 100, 100, '', ws);
				registeredClients.push(newClient);
				connectedClients.push(newClient);
				broadcastMsg(dataForClients, false);
			}
			else {
				//somehow return a error or something	
			}
		}
		else if (jsonData.type === 'msg') {

			var sender = connectedClients.find(client => client.name === jsonData.client);
			var senderIndex = connectedClients.findIndex(client => client.name === jsonData.client);
			connectedClients[senderIndex].lastMessage = jsonData.text;
			var message = new Message(jsonData.client, jsonData.text, sender.actualPosition_x, sender.actualPosition_y);
			messages.push(message);

			senderIndex = registeredClients.findIndex(client => client.name === jsonData.client);
			registeredClients[senderIndex].lastMessage = jsonData.text;

			broadcastMsg(data, true, sender.actualPosition_x, sender.actualPosition_y);

		}else if (jsonData.type === 'move') {

			var senderIndex = connectedClients.findIndex(client => client.name === jsonData.client);
			connectedClients[senderIndex].actualPosition_x = jsonData.x;
			connectedClients[senderIndex].actualPosition_y = jsonData.y;

			senderIndex = registeredClients.findIndex(client => client.name === jsonData.client);
			registeredClients[senderIndex].actualPosition_x = jsonData.x;
			registeredClients[senderIndex].actualPosition_y = jsonData.y;
			broadcastMsg(data, false);

		}
	});
	ws.on('close', function (event) {
		console.log('in close: ', event);
		var client = connectedClients.find(client => client.connection === ws);
		if (client) {
			connectedClients.delete(client);
			var disconnectedClient = {type: 'disconnection', name: client.name}
			broadcastMsg(JSON.stringify(disconnectedClient), false);
		}
		
	})
});

// falyta un filtro para no pasartelo a ti msimo
function broadcastMsg(data, onlyNear, x, y) {

	connectedClients.forEach(client => {
		if (onlyNear) {
			if (client.actualPosition_x - x <= 20 && client.actualPosition_y - y <= 20) {
				client.send(data);
			}
		} else {
			client.send(data);
		}
				
	});
}

server.listen(9027, function() {
	console.log('app listening on port 9027');
});
/*app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/index.html'));
});*/

//all html files in src folder
app.use(express.static(__dirname + '/src'))
//app.use('/', router);
