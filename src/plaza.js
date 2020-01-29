
import io from 'socket.io';
var mysocket = io();
console.log(document.querySelector("div"));
var button = document.querySelector("button.send");
button.addEventListener("click", send_message);

function send_message(){
	console.log("message sent");
	mysocket.emit('message',"HOASKDJAS");
}
