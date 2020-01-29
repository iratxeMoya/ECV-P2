
var connection = new WebSocket("ws://ecv-etic.upf.edu/node/9027/");

connection.onopen = event => {
	console.log('connection is open');
}

connection.onclose = (event) => {
    console.log("WebSocket is closed");
};

connection.onerror = (event) => {
    console.error("WebSocket error observed:", event);
};

connection.onmessage = (event) => {
	// append received message from the server to the DOM element 
	console.log('message recived: ', event.data);
};

var button = document.querySelector("button.send");
button.addEventListener("click", send_message);

function send_message(){
	console.log("message sent");
	connection.send('hey there!');
}
