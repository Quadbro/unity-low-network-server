var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var udp = {

    server: null,

    triggerClientMessage: function(data, info) {
        var network = require('./index');
        var packet = JSON.parse(data.toString().trim());
        var uid = packet.data.uid;

        for (var i = network.connections.length - 1; i >= 0; i--) {
            var client = network.connections[i];
            if (client.id === uid) {
                return client.message(data, "udp", info);
            }
        };
    },

    start: function(port) {

        server.on('listening', function () {
            console.log('[log] UDP Server listening on port: ' + port);
        });

        server.on('error', function(err) {
            console.log(err);
        });

        server.on('message', function (message, remote) {
            udp.triggerClientMessage(message, remote);
        });

        server.bind(port);

        udp.server = server;
    }
};

module.exports = udp;