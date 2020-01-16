

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var mongoose = require('mongoose');
//var http = require('http').Server(app);
var http = require('http')
//var io = require('socket.io')(http);
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname+'/views' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{ 
    name : String, 
    message : String
})

var dbUrl = 'mongodb://amkurian:amkurian1@ds257981.mlab.com:57981/simple-chat'

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

io.on('connection', () =>{
    console.log('a user is connected')
})

mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
})

/*var server = app.listen(4443, () => {
    console.log('server is running on port', server.address().port);
});*/
server.listen(4443, () => {
    console.log('Running server on port %s',server.address().port);
});




