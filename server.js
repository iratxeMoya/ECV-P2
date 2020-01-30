/*var http = require('http');
var url = require('url');

var server = http.createServer(function(request,response){
	var url_info=url.parse(request.url,true);
	var pathname = url_info.pathname;
	var params = url_info.query;
	response.end("OK!");
});

server.listen(9027,function(){
	console.log("CONECTED");
});

var WebSocketServer = require('websocket').server;
var wss=new WebSocketServer({
httpServer:server
});

wss.on('request',function(request){
var connection = request.accept(null,request.origin);
	console.log(";OASD");
	connection.on('message',function(message){
        if (message.type === 'utf8') {
	console.log( "NEW MSG: " + message.utf8Data ); // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
	console.log("USER IS GONE");// close user connection
    });
});

wss.on('/',function(){
	console.log("HOLAAAAAAAAAAAAAAAAAAA");	
});*/


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocket = require('ws');

var wss = new WebSocket.Server({server});

var clients = [];
console.log(wss.clients)
wss.on('connection', function(ws) {
	//var connection = request.accept(null, request.origin);
	//clients.push(connection;
	ws.on('message', function(data){
		console.log('message arrived to server');
		//broadcastMsg(data);
		wss.clients.forEach(client => {
			console.log('sending message ', data, '...');
			client.send(data);
		});
	});
});

var broadcastMsg = function (data) {

	wss.clients.forEach(client => {
		client.send(data);		
	});
}

server.listen(9027, function() {
	console.log('app listening on port 9027');
})
app.use(express.static(__dirname + '/src'));

