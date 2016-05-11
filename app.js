var   parser = new require('xml2json');
var  fs = require('fs');


//*********************************************
// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

//Static folder, images, js, etc
app.use("/bower", express.static(__dirname + '/bower_components'));  
app.use("/public", express.static(__dirname + "/public"));

app.get('/', function(req, res,next) {  
	console.log("Got a GET request for the homepage");
    res.sendFile(__dirname + '/index.html');
});

var srv = server.listen(8000, function () {

  console.log("Connected");

});  





/*
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   //res.send('Hello GET');



	fs.readFile(__dirname + '/index.html', function(err, data) {
	    if (err) {
	      console.log(err);
	      res.writeHead(500);
	      return res.end('Error loading index.html');
	    }
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.end(data);
	  });

})
*/




	    
   






// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
  console.log(__dirname);
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



});




var serialport = require("serialport"); 
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

rePattern = new RegExp(/read\:.+((\d)|-)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)/);

arrMatches = data.match(rePattern);

//((\d);)+read:\s((\d)|-)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.*)

if(arrMatches) {

	data2 = " AA:" + arrMatches[3] + " BB:" + arrMatches[4] + " CC:" + arrMatches[5] + " DD:" + arrMatches[6] + " EE:" + arrMatches[7] + " FF:" + arrMatches[8] + " GG:" + arrMatches[9];
} else {
	data2 = "<blank>";
}

	io.sockets.emit('update', data + data2);
}
 
function showPortClose() {
   console.log('--port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}