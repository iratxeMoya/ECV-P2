//Plaza

function updatePlaza () {
	update(clients);
}

var cnt = 0;

function onPlazaClick (event) {
	var rect = cvs.getBoundingClientRect();
	me.actualPosition_x = event.clientX - rect.left;
	me.actualPosition_y = event.clientY - rect.top;

	var myIndex = clients.findIndex(client => client.username === me.username);
	clients[myIndex].actualPosition_x = Math.floor(event.clientX / TILESIZE);
	clients[myIndex].actualPosition_y = Math.floor(event.clientY / TILESIZE);

	x=Math.floor((event.clientX-50)/TILESIZE)+Math.floor(printx/TILESIZE)-centerx;
	y=Math.floor((event.clientY-50)/TILESIZE)+Math.floor(printy/TILESIZE)-centery;
	
	move_pj(x,y, me.username);
	
	var move = new Move(me.username, x, y);
	connection.send(JSON.stringify(move));
}

function selectAvatar () {

	var avatarName = (this.classList[0]);
	if (avatarName === 'rand') {
		avatarName = Math.floor(Math.random()*(2-0+1)+0);
	}

	var avatar = new NewAvatar(me.username, Number(avatarName));
	
	connection.send(JSON.stringify(avatar));
	
}

//Chat

function onBodyKeydown () {
	msgInput.focus();
}

function send_message(){
	if (msgInput.value !== '') {
		
		var message = new Msg(me.username, msgInput.value);
		msgInput.value = '';
		connection.send(JSON.stringify(message));

	}
}

function on_key_press_send_msg(event) {
	if (event.code === 'Enter') {
		send_message();
	}
}

//Login and Register

function send_login () {

    if(loginNameInput.value !== '' && loginPassInput.value !== '') {
        me.username = loginNameInput.value;
        var login = new Login(loginNameInput.value, loginPassInput.value);
        login.isMe = true;
		connection.send(JSON.stringify(login));
		loginNameInput.value = '';
		loginPassInput.value = '';
    } else {
        alert('You need to enter an username and a password to login');
    }
}
function on_key_press_send_login() {
	if (event.code === 'Enter') {
		send_login();
	}
}

function go_to_register_page () {

	document.querySelector('div.registerBody').style['display'] = 'grid';
	document.querySelector('div.loginBody').style['display'] = 'none';	
}

function go_to_login_page () {
	document.querySelector('div.loginBody').style['display'] = 'grid';
	document.querySelector('div.registerBody').style['display'] = 'none';	
}

function send_register () {
	if(regNameInput.value !== '' && regPassInput.value !== '') {
        me.actualPosition_x = 100;
        me.actualPosition_y = 100;
        me.username = regNameInput.value;
		var register = new Register(regNameInput.value, regPassInput.value);
		register.isMe = true;
		regNameInput.value = '';
		regPassInput.value = '';
		connection.send(JSON.stringify(register));
	} else {
		alert('You need to enter an username and a password to login');
	}
		
}
function on_key_press_send_register() {
	if (event.code === 'Enter') {
		send_register();
	}
}

//Avatar selection

var selectionOptions = document.querySelectorAll("div.slider__contents");
selectionOptions.forEach(opt => {
	opt.style['minWidth'] = window.innerWidth + 'px';
});

window.addEventListener("resize", onWindowResize);

function onWindowResize () {
	selectionOptions.forEach(opt => {
		opt.style['minWidth'] = window.innerWidth + 'px';
	});
}






