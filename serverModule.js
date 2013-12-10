var db = require('riak-js').getClient({
    debug: true,
    host: "127.0.0.1",
    port: "8098"
});
var net = require('net');
var connections = 0;
var RESPONSE_STRING = 'SERVER: ';
var server = net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    console.log(RESPONSE_STRING+"New socket created " + socket.name);
    socket.on('data', function (data) {
        console.log(RESPONSE_STRING+"data from at clientID: " + socket.remotePort+":     "+data);
        var number = parseInt(data);
        if(!isNaN(number)){
            saveNumber(number, socket);
          }
        else{ 
          throw "Client did not provide a number";
        }
    });
});


/*------------------------- Functions -----------------------------------*/
var saveNumber = function (number, socket) {
    db.save('sockets', socket.remotePort, {
        value: number
    }, function (err, data, meta) {
        if (err) {
            socket.write(err.toString());
            throw err;
        } else {
            retrieveNumber(data, meta, socket);
        }
    });
}

var retrieveNumber = function (data, meta, socket) {
    db.get('sockets', meta.key, function (err, number, meta) {
        if (err) {
            socket.write(err.toString());
            throw err;
        } else {
            socket.write('' + number.value, function () {
                modifyNumber(number, socket, meta);
            });
        }
    });

}

var modifyNumber = function (number, socket, meta) {
    number.value += 1;
    console.log(RESPONSE_STRING+"Modifying number to: " + number.value);
    db.save('sockets', socket.remotePort, number, function (err, data, meta) {
        if (err) {
            socket.write(err.toString());
            throw err;
        }else{
            socket.write('Final number: '+number.value);
        }
    });
}


server.startServer=function() {
        server.on('connection', function (stream) {
            console.log(RESPONSE_STRING+'someone connected!');
        });
        server.listen(32323, function () {
            console.log(RESPONSE_STRING+'server started');
        });
    }

server.stopServer = function() {
        if (server.address) {
            server.close(function () {
                console.log(RESPONSE_STRING+'server stopped');
                process.exit(0);
            });
        }
    }

module.exports = server;
