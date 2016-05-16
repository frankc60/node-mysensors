//*********************************************

var parser = new require('xml2json');
var fs = require('fs');
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var serialport = require("serialport"); 

//********************************************************
//WEB SERVER WITH express, http
//Static folder, images, js, etc

app.use("/bower", express.static(__dirname + '/bower_components'));  
app.use("/public", express.static(__dirname + "/public"));


//process requests
app.get('/', function(req, res,next) {  
	console.log("Got a GET request for the homepage");
    res.sendFile(__dirname + '/index.html');
});

app.get('/dashboard', function(req, res,next) {  
	console.log("Got a GET request for the dashboard!!!!");
   res.sendFile(__dirname + '/index2.html');
});



//set up server to listen on port 8000
var srv = server.listen(8000, function () {

  console.log("Server up and running!");

});  
//********************************************************


//-------------------------------------------------------------------
// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
	console.log("io.socket connected!");

	
	socket.on('messageFromClient', function (data) { 
		socket.emit("notification", "received messge from client: " + data);
	});
	
	socket.on('disconnect', function () { 
		//WILL BE IGNORED, AS USER HAS GONE!
		socket.emit("notification", "socket has disconnected!");
	});
});
//-------------------------------------------------------------------



//===============================================================
//SERIAL PORT
var serialConnect = (function() {




var SerialPort = serialport.SerialPort; 

var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 115200,
  parser: serialport.parsers.readline("\n")
});

serialPort.on('open', showPortOpen);
serialPort.on('data', sendSerialData);
serialPort.on('close', showPortClose);
serialPort.on('error', showError);


function showPortOpen() {
   console.log('--port open. Data rate: ' + serialPort.options.baudRate);
}
 
function sendSerialData(data) {
   	console.log("raw data: " + data);

	rePattern = new RegExp(/read\:\s+(\d+)-(\d+)-(\d+)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)/);

	//read\:\s+(\d+)-(\d+)-(\d+)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)

	arrMatches = data.match(rePattern);

	/*
	{
		"1": 43,
		"2": 43,
		"3": 0,
		"s": 1,
		"c": 1,
		"t": 16,
		"pt": 0,
		"l": 1,
		"sg": 0,
		"data": 1222
	}
	*/
	jsonData = "";
	if(arrMatches) {
		jsonData = '{ "a1": ' + 
		arrMatches[1] + ',"a2": ' + 
		arrMatches[2] + ',"a3": ' + 
		arrMatches[3] + ',"s": ' + 
		arrMatches[4] + ',"c": ' + 
		arrMatches[5] + ',"t": ' + 
		arrMatches[6] + ',"pt": ' + 
		arrMatches[7] + ',"l": ' + 
		arrMatches[8] + ',"sg": ' + 
		arrMatches[9] + ',"data": "' + 
		arrMatches[10] + '" }';

		//jsonData = JSON.parse(data);

		console.log("converted to json: %j", jsonData);

		io.emit('update', jsonData);			
	
	} else {

		//data2 = " [ignored]";
		console.log("data not correct format, nothing sent to client!");
	}
	
}

 
function showPortClose() {
   console.log('--port closed.');
   console.log("attempting to reconnect...");
   serialConnect();

}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

});

serialConnect();
//===============================================================
/*
s = sensor id
c = command
t = message type
pt = payload type
l = length of packet
sg = signed yes or no

0;0;3;0;9;read: 42-42-0 s=0,c=1,t=1,pt=7,l=5,sg=0:79.2
0;0;3;0;9;read: 42-42-0 s=1,c=1,t=0,pt=7,l=5,sg=0:17.0

node-id;child-sensor-id;message-type;ack;sub-type;payload\n

42;0;1;0;1;79.2
42;1;1;0;0;17.0

*/

// Create the hashmap
//var animal = {};
// Add keys to the hashmap
//animal["node-id"] = { sound: ‘meow’, age:8 };
//animal["child-sensor-id"] = { sound: ‘bark’, age:10 };
//animal["message-type"] = { sound: ‘tweet’, age:2 };
//animal["ack"] = { sound: ‘moo’, age:5 };
//animal["sub-type"] = { sound: ‘moo’, age:5 };
//animal["payload"] = { sound: ‘moo’, age:5 };