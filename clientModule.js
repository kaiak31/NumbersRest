var net = require('net');


var Client = function(port,number){
	var socket = net.createConnection(port, function () {
    	this.write('' + number);
	});
	this.socket = socket;
	this.socket.on('error', function (e) {
    console.log("Client " + this.localPort + ":" + e.message);
});
	this.socket.on('data', function (data) {
    console.log("Client " + this.localPort + ":" + " Server Response: " + data);
    console.log('');
});
	this.socket.once('end', function (data) {
    console.log("Client " + this.localPort + ":" + " Server Disconnection: " + data);
});
}

module.exports = Client;
