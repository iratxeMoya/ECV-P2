//CHAT

var msgButton = document.querySelector("button#send");
msgButton.addEventListener("click", send_message);

var msgInput = document.querySelector('input#message');
msgInput.addEventListener('keydown', on_key_press_send_msg);

document.body.addEventListener('keydown', onBodyKeydown);

document.querySelector('canvas#canvas').addEventListener('click', onPlazaClick);

//LOGIN

var loginBotButton = document.querySelector("button#loginBotBtn");
loginBotButton.addEventListener('click', send_login);

var loginNameInput = document.querySelector("input#logUsername");
loginNameInput.addEventListener('keydown', on_key_press_send_login);

var loginPassInput = document.querySelector("input#logPassword");
loginPassInput.addEventListener('keydown', on_key_press_send_login);

var registerTopBtn = document.querySelector('a#registerTopBtn');
registerTopBtn.addEventListener('click', go_to_register_page);

//REGISTER

var loginTopBtn = document.querySelector('a#loginTopBtn');
loginTopBtn.addEventListener('click', go_to_login_page);

var regNameInput = document.querySelector("input#regUsername");
regNameInput.addEventListener('keydown', on_key_press_send_register);

var regPassInput = document.querySelector("input#regPassword");
regPassInput.addEventListener('keydown', on_key_press_send_register);

var registerBotButton = document.querySelector("button#registerBotBtn");
registerBotButton.addEventListener('click', send_register);

//AVATAR SELECTION

var avatars = document.querySelectorAll('img#clip');
avatars.forEach(avatar=> avatar.addEventListener('click', selectAvatar));