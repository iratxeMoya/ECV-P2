var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');

var wss = new WebSocket.Server({port: 9027});

wss.on('connection', (ws) => {

	ws.on('message', data => {

		wss.clients.forEach(client => {
			if(client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	});
});

/*app.use(express.static(__dirname + '/src'));

app.get('/',(req,res)=>{
	console.log('in get');
	res.send('index.html');
})

server.listen(9027,function(){
	console.log("listening to port 9027");
})

io.on('connection', () => {
	console.log('user connected');
});

io.on('message', function(message) {
	console.log(message);
}); */



