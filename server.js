var db = require('riak-js').getClient({
    debug: true,
    host: "127.0.0.1",
    port: "8098"
});
var net = require('net');
var connections = 0;
var server = net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    socket.iter = 0;
    console.log("New socket created " + socket.name);
    socket.on('data', function (data) {
        console.log("server got data from at clientID: " + socket.remotePort);
        var number = parseInt(data);
        if(!isNaN(number)){
            saveNumber(number, socket);
          }
        else{
          throw err;
        }
    });
});

/*------------------------- Functions -----------------------------------*/
var saveNumber = function (number, socket) {
    console.log("Number to save " + number);
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
    console.log("Retrieving number for socket " + socket.remotePort);
    db.get('sockets', meta.key, function (err, number, meta) {
        if (err) {
            socket.write(err.toString());
            throw err;
        } else {
            console.log("This is the value from DB " + number.value);
            socket.write('' + number.value, function () {
                socket.iter += 1;
                if (socket.iter > 3) {
                    console.log("Ending server");
                    socket.end();
                    stopServer();
                } else {
                    modifyNumber(number, socket, meta);
                }
            });




        }
    });

}

var modifyNumber = function (number, socket, meta) {
    number.value += 1;
    console.log("Modifying number to: " + number.value + " Socket iteration: " + socket.iter);
    db.save('sockets', socket.remotePort, number, function (err, data, meta) {
        if (err) {
            socket.write(err.toString());
            throw err;
        } else {
            retrieveNumber(data, meta, socket);
        }
    });
}


function startServer() {
        server.on('connection', function (stream) {
            console.log('someone connected!');
        });
        server.listen(32323, function () {
            console.log('server started');
        });

    }

function stopServer() {
        if (server.address) {
            server.close(function () {
                console.log('server stopped');
                process.exit(0);
            });
        }
    }

startServer();


// created a client socket
var socket = net.createConnection(32323, function () {
    socket.write('' + 1);
});

socket.on('error', function (e) {
    console.log("Client " + socket.port + ":" + e.message);
});
socket.on('data', function (data) {
    console.log("Client " + socket.localPort + ":" + " Server Response: " + data);
    console.log('');
});