var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');
var expressWs = require('express-ws');

var wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
	ws.id = wss.getUniqueID();
	ws.on('message', data => {
		webSocketServer.broadcast(data, ws);
	});
});

wss.broadcast = function(data, sender) {
	wss.clients.forEach((client) => {
	  if (client !== sender) {
		client.send(data)
	  }
	})
  }

server.listen(9027, function() {
	console.log('app listening on port 9027');
})
app.use(express.static(__dirname + '/src'));
