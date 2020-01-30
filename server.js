var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');
var expressWs = require('express-ws');

//expressWs(app)
//console.log('server: ', server);
var wss = new WebSocket.Server({server});
//console.log('wss: ', wss);

//app.ws('/', (ws, req) => {
	//console.log('hey: ', req);
	wss.on('connection', (ws) => {
	
		console.log('connected: ', connection);
		ws.on('message', data => {
			console.log('data: ', data);
			/*connection.clients.forEach(client => {
				if(client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});*/
		});
	});
//});

//app.use(express.static('src'));
server.listen(9027, function() {
	console.log('app listening on port 9027');
})
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



