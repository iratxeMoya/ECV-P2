
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');
var router = express.Router();
var path = require('path');
var passwordHash = require('password-hash');

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
		console.log('new message in server: ', jsonData);

		if(jsonData.type === 'login') {
			var foundClient = registeredClients.find(client => client.username === jsonData.client);
			if (foundClient && passwordHash.verify(jsonData.password, foundClient.hashedPassword)) {
				client.connection = ws;

				connectedClients.forEach(client => {
					var alreadyConnected = {};
					alreadyConnected.type = 'alreadyLoged';
					alreadyConnected.username = client.username;
					alreadyConnected.x = client.actualPosition_x;
					alreadyConnected.y = client.actualPosition_y;
					alreadyConnected.lastMessage = client.lastMessage;

					foundClient.connection.send(JSON.stringify(alreadyConnected), false);
				});

				connectedClients.push(foundClient);
				jsonData.x = foundClient.actualPosition_x;
				jsonData.y = foundClient.actualPosition_y;
				jsonData.lastMessage = foundClient.lastMessage
				var dataForClients = JSON.stringify(jsonData);
				broadcastMsg(dataForClients, false);

				var okLoginResponse = {type: 'loginResponse', data: 'OK'};
				ws.send(JSON.stringify(okLoginResponse));
			}
			else {
				console.log('Loging error, password error or no registered');
				var okLoginResponse = {type: 'loginResponse', data: 'notOK'};
				ws.send(JSON.stringify(okLoginResponse));
			}
		}
		else if (jsonData.type === 'register') {
			var foundClient =  registeredClients.find(client => client.username === jsonData.client);
			if(!foundClient){
				jsonData.x = 100;
				jsonData.y = 100;
				jsonData.lastMessage = '';
				var newClient = new Client(jsonData.client, 100, 100, '', ws, passwordHash.generate(jsonData.password));
				connectedClients.forEach(client => {
					var alreadyConnected = {};
					alreadyConnected.type = 'alreadyLoged';
					alreadyConnected.username = client.username;
					alreadyConnected.x = client.actualPosition_x;
					alreadyConnected.y = client.actualPosition_y;
					alreadyConnected.lastMessage = client.lastMessage;

					newClient.connection.send(JSON.stringify(alreadyConnected), false);
				});
				console.log('messages: ', messages);
				registeredClients.push(newClient);
				connectedClients.push(newClient);
				jsonData.password = '';
				var dataForClients = JSON.stringify(jsonData);
				broadcastMsg(dataForClients, false);

				var okLoginResponse = {type: 'registerResponse', data: 'OK'};
				ws.send(JSON.stringify(okLoginResponse));
			}
			else {
				var okLoginResponse = {type: 'registerResponse', data: 'notOK'};
				ws.send(JSON.stringify(okLoginResponse));	
			}
		}
		else if (jsonData.type === 'msg') {

			var sender = connectedClients.find(client => client.username === jsonData.client);
			var senderIndex = connectedClients.findIndex(client => client.username === jsonData.client);
			connectedClients[senderIndex].lastMessage = jsonData.text;
			var message = new Message(jsonData.client, jsonData.text, sender.actualPosition_x, sender.actualPosition_y);
			messages.push(message);

			senderIndex = registeredClients.findIndex(client => client.username === jsonData.client);
			registeredClients[senderIndex].lastMessage = jsonData.text;

			broadcastMsg(data, true, sender.actualPosition_x, sender.actualPosition_y);

		}else if (jsonData.type === 'move') {

			var senderIndex = connectedClients.findIndex(client => client.username === jsonData.client);
			connectedClients[senderIndex].actualPosition_x = jsonData.x;
			connectedClients[senderIndex].actualPosition_y = jsonData.y;

			senderIndex = registeredClients.findIndex(client => client.username === jsonData.client);
			registeredClients[senderIndex].actualPosition_x = jsonData.x;
			registeredClients[senderIndex].actualPosition_y = jsonData.y;
			broadcastMsg(data, false);

		}
	});
	ws.on('close', function (event) {
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
				client.connection.send(data);
			}
		} else {
			client.connection.send(data);
		}
				
	});
}

server.listen(9027, function() {
	console.log('app listening on port 9027');
});

//all html files in src folder
app.use(express.static(__dirname + '/src'));

//utils

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
