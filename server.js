var db = require('riak-js').getClient({ debug:true, host: "127.0.0.1", port: "8098"});
//db.get('airlines', 'KLM')
//db.save('airlines', 'Lsadasdssa', {country: 'DE'})
var net = require('net');
var connections = 0;

var saveNumber = function(number, socket){
  console.log("Number to save "+number);
	db.save('sockets', socket.remotePort,{value:number},function(err, data, meta){
    console.log(err);
    if(err){
      socket.write(err.toString());
      throw err;
    }else{
      retrieveNumber(data, meta, socket);
    }
  });	
}

var retrieveNumber = function(data, meta, socket){
  console.log("Retrieving number from socket "+socket.remotePort);
  db.get('sockets',meta.key, function(err,number, meta){
    if(err){
      socket.write(err.toString());
      throw err;
    }
    else{
      console.log("This is the retrieved value "+number.value);
      socket.write(''+number.value);
      modifyNumber(number,socket, meta);
      
        
    }
  });
  
}

var modifyNumber= function (number, socket, meta){
  number.value  += 1;
  socket.iter +=1;
   if(socket.iter >3){
        stopServer();
        process.exit(0);
      }
  console.log("Modifying number "+number.value+" "+socket.iter);
  db.save('sockets', socket.remotePort,number,function(err, data, meta){
    if(err){
      socket.write(err.toString());
      throw err;
    }else{
      retrieveNumber(data, meta, socket);
    }
  }); 
}




var server = net.createServer(function (socket) {
  socket.name = socket.remoteAddress + ":" + socket.remotePort
  socket.iter = 0;
  console.log("This is a new socket "+socket.name);
  socket.on('data', function(data){
  	console.log("server got data from at clientID: "+socket.remotePort);
	  saveNumber(parseInt(data), socket);
  });
});


function startServer() {
	server.on('connection', function (stream) {
  		console.log('someone connected!');
	});
  	server.listen(32323, function () {
    	console.log('server started');
  	});
  	
}

function stopServer() {
  server.close(function () {
    console.log('server stopped');
  });
  //setTimeout(process.exit(0),10000);
}
startServer();

var socket = net.createConnection(32323, function () {
    socket.write(''+1);
  });
  socket.on('error', function (e) {
    console.log(e.message);
  });
  socket.on('data', function(data){
  	console.log("From server: "+data);
  })

