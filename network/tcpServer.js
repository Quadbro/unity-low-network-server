var net = require('net');
var Connection = require('./connection');

module.exports = {
    start: function(port) {

        net.createServer(function(socket) {
            var network = require('./index');
            
            network.connections.push( 
                new Connection(socket)
            );
        }).listen(port);

        console.log('[log] TCP server listening on port: '+ port);
    }
};