var connection = new WebSocket ("wss://ecv-etic.upf.edu/node/9027/ws/");

function Login (username, password) {
	this.type = 'login';
    this.username = username;
    this.password = password;
}

connection.onmessage = (event) => {
	var data = JSON.parse(event.data);
	console.log('new message in client of type: ', data.type);

	
};

var loginButton = document.querySelector("button.loginBtn");
loginButton.addEventListener('click', send_login);

var loginNameInput = document.querySelector("input#username");
loginNameInput.addEventListener('keydown', on_key_press_send_login);

var loginPassInput = document.querySelector("input#password");
loginPassInput.addEventListener('keydown', on_key_press_send_login);

var registerBtn = document.querySelector('button.registerBtn');
//registerBtn.addEventListener('click', go_to_register_page);

function send_login () {

    if(loginNameInput.value !== '' && loginPassInput.value !== '') {
//        me.actualPosition_x = 100;
//        me.actualPosition_y = 100;
//        me.username = loginNameInput.value;
        var login = new Login(loginNameInput.value, loginPassInput.value);
        login.isMe = true;
        connection.send(JSON.stringify(login));
    } else {
        alert('You need to enter an username and a password to login');
    }
}
function on_key_press_send_login() {
	if (event.code === 'Enter') {
		send_login();
	}
}
