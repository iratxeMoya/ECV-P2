/*
 * Initialization
 */
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var swig    = require('swig');

/*
 * Configuration
 */
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/html');

// swig cache
swig.setDefaults({ cache: false });

/*
 * Middlewares
 */
 // static resources
app.use(express.static(__dirname + '/src'));


/*
 * Listening to server
 */
server.listen('9026', function(){
    console.log('running node server on port 9026...');
});

/*
 * Route
 */
app.get('/', function(req, res){
    res.render('index');
});

/*
 * socket.io event listener
 */
io.on('connection', function(client){
    console.log('Client connected to server...');

    client.on('message', function(message){
        var nickname = client.nickname;
        console.log(nickname + ': ' + message);
        var data = {author: nickname, text: message};
        client.broadcast.emit('message', data);
        client.emit('message', data);

        storeMessage(nickname, message);
    });

    //joined event
    client.on('joined', function(name){
        client.nickname = name;
        console.log(client.nickname + ' joined the chat.');

        //display previous messages
        //* Aqui coger los messages de la db en vez de de la variable
        messages.forEach(function(message){
            client.emit('message', message);
        });
    });
});

//store previous message here
var messages = [];

//push message

//* Si aqui lo metemos en la db en vez de en la variable estará accesible aunque la conexion se cierre y se vuelva a abrir
var storeMessage = function(name, message){
    messages.push({
        author: name,
        text: message
    });

    //* Esto yo creo que sobra
    if(messages.length > 20){
        messages.shift();
    }
};
