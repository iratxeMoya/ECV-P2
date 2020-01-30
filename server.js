var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');
var expressWs = require('express-ws');

var wss = new WebSocket.Server({server});
	wss.on('connection', (ws) => {
	
		//console.log('connected: ', wss.clients);
		ws.on('message', data => {
			//console.log('data: ', data);
			wss.clients.forEach(client => {
				if(client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		});
	});

server.listen(9027, function() {
	console.log('app listening on port 9027');
})
app.use(express.static(__dirname + '/src'));
