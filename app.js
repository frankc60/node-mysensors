//*********************************************

//var parser = new require('xml2json');
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var serialport = require("serialport");


//***************************************************************
//var mongoose = require("mongoose");

var mongooseModels = require(__dirname + "/models/" + "kitten.js");

mongooseModels.mysensors.find(function(err,users) {
	console.log(users);
});

mongooseModels.updateMongoose(mongooseModels.kitten, {name: "Pete"});

//***************************************************************








//********************************************************
//WEB SERVER WITH express, http
//Static folder, images, js, etc

app.use("/bower", express.static(__dirname + '/bower_components'));  
app.use("/public", express.static(__dirname + "/public"));


//process requests
app.get('/', function(req, res,next) {  
	console.log(getFormattedDate() + " - Got a GET request for the homepage");
    res.sendFile(__dirname + '/index.html');
});

app.get('/dashboard', function(req, res,next) {  
	console.log("Got a GET request for the dashboard!!!!");
   res.sendFile(__dirname + '/index2.html');
});

app.get('/monchart', function(req, res,next) {  
	console.log("Got a GET request for the monchartjs!!!!");
   res.sendFile(__dirname + '/monchart.html');
});

//for playing around on samples
app.get('/samples/charts', function(req, res,next) {  
	console.log("Got a GET request for the samples!!!!");
   res.sendFile(__dirname + '/samples/charts.html');
});

app.get('/samples/mongooseQueries', function(req, res,next) {  
	console.log("Got a GET request for the mongooseQueries!!!!");
   res.sendFile(__dirname + '/samples/mongooseQueries.html');
});




//set up server to listen on port 8000
var srv = server.listen(8000, function () {

  console.log(getFormattedDate() + " - Server up and running!");

});  
//********************************************************


//-------------------------------------------------------------------
// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
	console.log(getFormattedDate() + " - io.socket connected!");

	
	socket.on('messageFromClient', function (data) { 
		socket.emit("notification", "received messge from client: " + data);
	});
	
	socket.on('disconnect', function () { 
		//WILL BE IGNORED, AS USER HAS GONE!
        console.log(getFormattedDate() + " - socket.disconnected")
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

    //EVENTS
    serialPort.on('open', showPortOpen);
    serialPort.on('data', sendSerialData);
    serialPort.on('close', showPortClose);
    serialPort.on('error', showError);
    
    //*******************************************************************************
    function showPortOpen() {
       console.log(getFormattedDate() + ' - port open. Data rate: ' + serialPort.options.baudRate);
    }
    //*******************************************************************************
    function sendSerialData(data) {
        console.log("raw data: " + data);

        //break up data into an array
        rePattern = new RegExp(/read\:\s+(\d+)-(\d+)-(\d+)+\ss\=(\d+),c\=(\d+),t\=(\d+),pt\=(\d+),l\=(\d+),sg\=(\d+)\:(.+)/);

        arrMatches = data.match(rePattern);
        //===========================
        
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
        //put array into a string resembling an object
            data = '{ "a1": ' + 
            arrMatches[1] + ',"a2": ' + 
            arrMatches[2] + ',"a3": ' + 
            arrMatches[3] + ',"s": ' + 
            arrMatches[4] + ',"c": ' + 
            arrMatches[5] + ',"t": ' + 
            arrMatches[6] + ',"pt": ' + 
            arrMatches[7] + ',"l": ' + 
            arrMatches[8] + ',"sg": ' + 
            arrMatches[9] + ',"data": "' + 
            arrMatches[10] + '","timestamp": "' + 
            new Date() + '" }';

            //convert data into JSON
            //data2 = JSON.parse(data);

            //console.log(getFormattedDate() + " - converted to json: %j", data2);

            //**********put data into mongoose ***********
            //add a timestamp property (already defined in mongoose model - mysensors)
            
            //data.timestamp = new Date();
            data = JSON.parse(data);
            
            mongooseModels.updateMongoose(mongooseModels.mysensors, data);
            //********************************************
            
			console.log(getFormattedDate() + " - converted to json: %j", data);

            //send/emit update with json object to client
            //io.emit('update', jsonData);			
            io.emit('update', data);			
            
        } else {

            //data2 = " [ignored]";
            console.log(getFormattedDate() + " - data not correct format, nothing sent to client!");
        }

    }
    //*******************************************************************************
    function showPortClose() {
       console.log(getFormattedDate() + ' - port closed.');
       console.log(getFormattedDate() + " - attempting to reconnect...");
       serialConnect();

    }
    //*******************************************************************************
    function showError(error) {
       console.log(getFormattedDate() + ' - Serial port error: ' + error);
       console.log("TIMEOUT FOR 10 SECONDS THEN TRY TO RECONNECT!");
       setTimeout(serialConnect, 10000);
    }
    //*******************************************************************************
});
//*******************************************************************************
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

//-------------------------------------------------------

/*
mongoose.model("Kitten").find(function(err,users) {
	console.log(users);
});
*/
//*******************************************************************************
function getFormattedDate(date) {
	if (date === undefined) {
		date = new Date(); 
	}
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;

	var hh = date.getHours();
	hh = hh > 9 ? hh : '0' + hh;
	var mm = date.getMinutes();
	mm = mm > 9 ? mm : '0' + mm;
	var ss = date.getSeconds();
	ss = ss > 9 ? ss : '0' + ss;

return (day + '/' + month + '/' + year + " " + hh + ":" + mm + ":" + ss);
}
//*******************************************************************************