var io = require('socket.io-client');
var mysocket = io();

function send_message(){
	console.lo("message sent");
	mysocket.emit('message',"HOASKDJAS");
}