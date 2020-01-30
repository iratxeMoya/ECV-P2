
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');

var wss = new WebSocket.Server({server});

var clients = [];
var messages = [];

function Message (client, text, sentPosition_x, sentPosition_y) {
	this.client = client;
	this.text = text;
	this.sentPosition_x = sentPosition_x;
	this.sentPosition_y = sentPosition_y;
}
//Faltaría alguna forma de guardar el muñeco de cada usuario (NO SE COMO)
function Client (username, actualPosition_x, actualPosition_y, lastMessage, connection) {
	this.username = username;
	this.actualPosition_x = actualPosition_x;
	this.actualPosition_y = actualPosition_y;
	this.lastMessage = lastMessage;
	this.connection = connection;
}

wss.on('connection', function(ws) {

	ws.on('message', function(data){

		var jsonData = JSON.parse(data);

		if(jsonData.type === 'login') {
			data.x = 100;
			data.y = 100;
			clients.push(new Client(jsonData.username, 100, 100, '', ws));
			if ()
			broadcastMsg(data, false);
		}
		else if (jsonData.type === 'msg') {

			var sender = clients.find(client => client.name === jsonData.client);
			var senderIndex = clients.findIndex(client => client.name === jsonData.client);
			clients[senderIndex].lastMessage = jsonData.text;
			var message = new Message(jsonData.client, jsonData.text, sender.actualPosition_x, sender.actualPosition_y);
			messages.push(message);
			broadcastMsg(data, true, sender.actualPosition_x, sender.actualPosition_y);

		}else if (jsonData.type === 'move') {

			var senderIndex = clients.findIndex(client => client.name === jsonData.client);
			clients[senderIndex].actualPosition_x = jsonData.x;
			clients[senderIndex].actualPosition_y = jsonData.y;
			broadcastMsg(data, false);

		}
	});
});

// falyta un filtro para no pasartelo a ti msimo
function broadcastMsg(data, onlyNear, x, y) {

	clients.forEach(client => {
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
})
app.use(express.static(__dirname + '/src'));

