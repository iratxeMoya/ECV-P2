
var connection = new WebSocket("wss://ecv-etic.upf.edu/node/9027/ws/");

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
	var data = JSON.parse(event.data); 
	if(data.user !== 'iratxe') { //esto ponerlo de la variable
		console.log('message recived: ', data.msg);
	}
};

var button = document.querySelector("button.send");
button.addEventListener("click", send_message);

function send_message(){
	console.log("message sent");
	var msg = {user: 'iratxe', msg: 'hey there'};
	var data = JSON.stringify(msg);
	connection.send(data);
}
