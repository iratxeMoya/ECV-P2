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
	var data = JSON.parse(event.data); 
	console.log('recived message: ', data);

	if (data.type === 'msg') {

		// append received message from the server to the DOM element
		var messageContainer = document.createElement('div');
		var senderName = document.createElement('span');
		var message = document.createElement('span');
		var parent = document.querySelector('div.messageContainer');

		senderName.innerText = data.client;
		message.innerText = data.text;

		messageContainer.appendChild(senderName);
		messageContainer.appendChild(message);
		
		senderName.classList.add('name');
		message.classList.add("messageText");
		messageContainer.classList.add('messageGroup');

		if (data.client === me.username) {

			senderName.style['justifySelf'] = 'end';
			message.style['justifySelf'] = 'end';

		} 

		parent.appendChild(messageContainer);
		parent.scrollTop = parent.scrollHeight;

		//Actualize client last message
		var senderIndex = clients.findIndex(client => client.username === data.client);
		clients[senderIndex].lastMessage = data.text;
		clients[senderIndex].showLastMessage = true;

		setTimeout(function(){clients[senderIndex].showLastMessage = false;}, 2000);


	}
	else if (data.type === 'alreadySended') {
		// append received message from the server to the DOM element
		var messageContainer = document.createElement('div');
		var senderName = document.createElement('span');
		var message = document.createElement('span');
		var parent = document.querySelector('div.messageContainer');

		senderName.innerText = data.client;
		message.innerText = data.text;

		messageContainer.appendChild(senderName);
		messageContainer.appendChild(message);
		
		senderName.classList.add('name');
		message.classList.add("messageText");
		messageContainer.classList.add('messageGroup');

		if (data.client === me.username) {

			senderName.style['justifySelf'] = 'end';
			message.style['justifySelf'] = 'end';

		} 

		
		parent.appendChild(messageContainer);
		parent.scrollTop = parent.scrollHeight;

		//Actualize client last message
		var senderIndex = clients.findIndex(client => client.username === data.client);
		if (clients[senderIndex]){
			clients[senderIndex].lastMessage = data.text;	
		}
	}
	else if (data.type === 'login' || data.type === 'register') {
		
		//create new client
		var client = new Client(data.username, data.x, data.y, data.lastMessage, data.avatar);
		clients.push(client);
		if (client.username == me.username) {
			me = client;
		}

		//render the new clients avatar
		if (data.type === 'login'){
			var popup = document.querySelector("div#popUp");
			popup.style['display'] = 'block';
			popup.style['background-color'] = 'green';
			popup.innerText = client.username + ' has been connected';
			setTimeout(function(){popup.style['display'] = 'none';}, 2000);
			if (client.username === me.username) {
				create_pj(data.x,data.y, client.username,is_me=true, client.avatar);
			}else{
				create_pj(data.x,data.y, client.username,is_me=false, client.avatar);
			}
		}
				
	}
	else if(data.type === 'alreadyLoged') {
		var client = new Client(data.username, data.x, data.y, data.lastMessage, data.avatar);
		clients.push(client);
		if (client.username === me.username) {
			create_pj(data.x,data.y, client.username,is_me=true, client.avatar);
		}else{
			create_pj(data.x,data.y, client.username, is_me=false, client.avatar);
		}	
	}
	else if (data.type === 'move') {

		//actualize senders position
		var senderIndex = clients.findIndex(client => client.username === data.client);
		clients[senderIndex].actualPosition_x = data.x;
		clients[senderIndex].actualPosition_y = data.y;
		console.log('move: ', data.x, data.y, data.client);

		//render the avatar of sender in correct position

		move_pj(data.x, data.y, data.client);
	}
	else if (data.type === 'disconnection') {
		var sender = clients.find(client => client.username === data.name);
		clients.delete(sender)
		
		var popup = document.querySelector("div#popUp");
		popup.style['display'] = 'block';
		popup.style['background-color'] = '#ff7171';
		popup.innerText = sender.username + ' has been disconnected';
		setTimeout(function(){popup.style['display'] = 'none';}, 2000);
		
		
	}
	else if(data.type == 'loginResponse') {

		if (data.data === 'OK'){

			document.querySelector('div.chatBody').style['display'] = 'block';
			document.querySelector('div.loginBody').style['display'] = 'none';
			document.querySelector('div.registerBody').style['display'] = 'none';	

		} else {

			alert ('Username or password not correct');

		}

	} 
	else if(data.type == 'registerResponse') {

		if (data.data === 'OK'){

			console.log('hola')

			document.querySelector('div.chatBody').style['display'] = 'none';
			document.querySelector('div.loginBody').style['display'] = 'none';	
			document.querySelector('div.registerBody').style['display'] = 'none';
			document.querySelector('div.profileSelectorBody').style['display'] = 'block';

		} else {

			alert ('Username exists already');

		}

	} 
	else if(data.type === 'newUsername') {

		myIndex = clients.findIndex(client => client.username === data.username);
		clients[myIndex].username = data.newUsername;
		
	}
	else if (data.type === 'newAvatar') {

		myIndex = clients.findIndex(client => client.username === data.username);
		clients[myIndex].avatar = data.avatar;

		if (clients[myIndex].username === me.username) {

			create_pj(clients[myIndex].actualPosition_x,clients[myIndex].actualPosition_y, clients[myIndex].username,is_me=true, data.avatar);

		}
		else {

			create_pj(clients[myIndex].actualPosition_x,clients[myIndex].actualPosition_y, clients[myIndex].username,is_me=false, data.avatar);
			
			var popup = document.querySelector("div#popUp");
			popup.style['display'] = 'block';
			popup.style['background-color'] = 'green';
			popup.innerText = clients[myIndex].username + ' has been connected';
			setTimeout(function(){popup.style['display'] = 'none';}, 2000);
			
		}

		document.querySelector('div.chatBody').style['display'] = 'block';
		document.querySelector('div.profileSelectorBody').style['display'] = 'none';

	}
	
};