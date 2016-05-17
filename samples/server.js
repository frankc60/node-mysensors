'use strict';
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;

var port = new SerialPort('/dev/ttyACM0', {
  baudrate: 115200,
  parser: parsers.readline('\n')
});

port.on('open', function() {
  console.log('Port open');
});

port.on('data', function(data) {
  console.log(data);
});



//LIST ALL PORTS
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

/* DATA EXAMPLES


0;0;3;0;9;gateway started, id=0, parent=0, distance=0
0;0;3;0;14;Gateway startup complete.
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:1
43;1;1;0;16;1
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 42-42-0 s=0,c=1,t=1,pt=7,l=5,sg=0:99.0
42;0;1;0;1;99.0
0;0;3;0;9;read: 42-42-0 s=2,c=1,t=23,pt=2,l=2,sg=0:87
42;2;1;0;23;87
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 42-42-0 s=0,c=1,t=1,pt=7,l=5,sg=0:99.2
42;0;1;0;1;99.2
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 43-43-0 s=1,c=1,t=16,pt=0,l=1,sg=0:0
43;1;1;0;16;0
0;0;3;0;9;read: 42-42-0 s=1,c=1,t=0,pt=7,l=5,sg=0:19.3
42;1;1;0;0;19.3
0;0;3;0;9;read: 42-42-0 s=0,c=1,t=1,pt=7,l=5,sg=0:98.9
42;0;1;0;1;98.9
0;0;3;0;9;read: 42-42-0 s=2,c=1,t=23,pt=2,l=2,sg=0:86
42;2;1;0;23;86





---------------------
>>> bits = "Hello awesome, world!".split(/[\s,]+/)
["Hello", "awesome", "world!"]
>>> bit = bits[bits.length - 1]
"world!"
... and if the pattern doesn't match:

>>> bits = "Hello awesome, world!".split(/foo/)
["Hello awesome, world!"]
>>> bits[bits.length - 1]
"Hello awesome, world!"

*/