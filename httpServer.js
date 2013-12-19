var db = require('riak-js').getClient({
    debug: true,
    host: "127.0.0.1",
    port: "8098"
});
var httpPort = 8888;
var http = require('http');
var getNumberPath = 'number';
var server = http.createServer(function (req, res) {	  	
	getNumber(req, res);

  }).listen(httpPort);

var getNumber = function(req, res){
	//TODO: Parse more robuslty, accomadating query string or rather, stripping them out. 
	var path = require('url').parse(req.url).pathname;
	var test = path.substring(1,getNumberPath.length+1)
	console.log('This is the request: '+test);
	if (path.substring(1,getNumberPath.length+1)==getNumberPath){
		lastSlashPosition = path.lastIndexOf('/');
		var number = path.slice(lastSlashPosition+1,path.length);
		if(!validateNumber(number)){
			  res.writeHead(400, {'Content-Type': 'text/plain'});
  			res.end('Number is invalid. \n');
  			return;
		}
		saveNumber(req, res, number);

	} 
	

}

var saveNumber = function (req, res, number) {
    db.save('numbers', number, {
        value: parseInt(number)
    }, function (err, data, meta) {
        if (err) {
           	res.writeHead(400, {'Content-Type': 'text/plain'});
  			res.end('Number is invalid. \n');
            throw err;
        } else {
        	retrieveNumber(data, meta, req, res);
    	  	
        }
    });
}

function validateNumber(number){
 return /^\d+$/.test(number);}

var retrieveNumber = function (data, meta, req, res) {
    db.get('numbers', meta.key, function (err, number, meta) {
        if (err) {
        	  res.writeHead(501, err.toString());
            res.end("Unable to retrieve number");
            throw err;
        } else {
        	res.writeHead(302,  {'Content-Type': 'text/plain'});
        	res.end("Here is the number: "+number.value+"\n");
        	//server.close();
    	  	//process.exit(0);
            modifyNumber(number, meta);  
        }
    });

}

var modifyNumber = function (number, meta) {
    number.value += 1;
    console.log("Modifying number to: " + number.value);
    db.save('numbers', meta.key, number, function (err, data, meta) {
        if (err) {
            throw err;
        }else{
            console.log('Final number: '+number.value);
        }
    });
    // uncomment while developing. 
    //server.close();
    //process.exit(0);
}

console.log('Server running on port'+httpPort);