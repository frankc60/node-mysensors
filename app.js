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

app.get('/test', function(req, res,next) {  
	console.log("Got a GET request for the TESTER!!!!");
    res.send("tester !");
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
	// watching the xml file
	fs.watchFile(__dirname + '/example.xml', function(curr, prev) {
		// on file change we can read the new xml
		fs.readFile(__dirname + '/example.xml', function(err, data) {
			if (err) throw err;
			// parsing the new xml data and converting them into json file
			var json = parser.toJson(data);
			// send the new data to the client
			socket.volatile.emit('notification', json);
		});
	});

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
   	console.log("data: " + data);

	rePattern = new RegExp(/read\:\s+(\d+)-(\d+)-(\d+)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)/);

	//read\:\s+(\d+)-(\d+)-(\d+)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)

	arrMatches = data.match(rePattern);

	if(arrMatches) {
		data2 = "&nbsp;&nbsp;&nbsp; (1:" + arrMatches[1] + ")(2:" +arrMatches[2] + ")(3:" +arrMatches[3] + ") s:" + arrMatches[4] + " c:" + arrMatches[5] + " t:" + arrMatches[6] + " pt:" + arrMatches[7] + " l:" + arrMatches[8] + " sg:" + arrMatches[9] + " data:" + arrMatches[10];
	} else {
		data2 = " [ignored]";
	}

	io.emit('update', data + data2);


}
 
function showPortClose() {
   console.log('--port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}
//===============================================================
