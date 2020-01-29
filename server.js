var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');

var dbUrl = 'mongodb://ecv-etic.upf.edu:9027';

/*mongoose.connect(dbUrl, (err) => {
	console.log('mongodb connected', err);
});*/

//var Message = mongoose.model("Message", {name: String, msg: String});

app.use(express.static(__dirname + '/src'));

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save((err) => {
		if(err){
			res.sendStatus(500);
		}
		res.sendStatus(200);
		io.emmit('message', req.body);
	});
});
app.get('/',(req,res)=>{
	console.log('in get');
	res.send('index.html');
})

server.listen(9027,function(){
	console.log("listening to port 9027");
})

io.on('connection', () => {
	console.log('user connected');
});

io.on('message', function(message) {
	console.log(message);
}

