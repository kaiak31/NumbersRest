var serverModule = require ("./serverModule");
var net = require('net');
var Client = require('./clientModule');
serverModule.startServer();
var MAX_CLIENTS = 3;
var clients = [];
var endClients = MAX_CLIENTS;

for(var i = 1; i<=MAX_CLIENTS;i++){
	clients[i] = new Client(32323,i);
}
