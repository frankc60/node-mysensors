var mongoose = require("mongoose");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


//****************************************************
app.use("/bower", express.static(__dirname + '/bower_components'));  
app.use("/public", express.static(__dirname + "/public"));

//process requests
app.get('/monchart', function(req, res,next) {  
	console.log((new Date()) + " - Got a GET request for the monchart");
    res.sendFile(__dirname + '/monchart.html');
});
//****************************************************
//set up server to listen on port 8000
var srv = server.listen(8000, function () {

  console.log((new Date()) + " - Server up and running!");

});  
//****************************************************



//connect to mongodb
mongoose.connect('mongodb://localhost/test', function(err) {
	if(err) throw err;
});
//****************************************************
var Schema = mongoose.Schema;
//****************************************************
//define schemas
var mysensorsSchema = new Schema({
    a1: String,
    a2: String,
    a3: String,
    s: String,
    c: String,
    t: String,
    pt: String,
    l: String,
    sg: String,
    data: String,
    timestamp: Date
});

var mysensors = mongoose.model("mysensors",mysensorsSchema);


//*****************************************************************************
io.sockets.on('connection', function(socket) {
	console.log((new Date()) + " - io.socket connected!");

	
	socket.on('messageFromClient', function (data) { 
        console.log("***MESSAGE FROM CLIENT: " + data);
        sendRequest(data);
    });
	
	socket.on('disconnect', function () { 
		//WILL BE IGNORED, AS USER HAS GONE!
        console.log((new Date()) + " - socket.disconnected")
		socket.emit("notification", "socket has disconnected!");
	});
    
   
});
//*****************************************************************************

var sendRequest = (function(data){
    mysensors.find({a1:data.nodeid, s:data.sensorid}).exec(function(err,users) {
        //    ab = text.employees;
        //	ab.push(users);
        if (err)
        {
            res.send("an error has occured: " + err);
            console.log("error " + err);
        } else {
            console.log("sending data to client: " +users);
            io.emit('update2', users);	
        }
    });
});
    

