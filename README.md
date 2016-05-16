Make sure your mysensors gateway is connected to your computer via serial (USB) connection.
	connection currently hard coded to "/dev/ttyACM0" in app.js

run > node app.js

(debug to monitor serial and socket: from cmdline: DEBUG=socket.io* node app.js )

then from your browser go to:
http://localhost:8000

