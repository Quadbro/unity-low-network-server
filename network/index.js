var tcp = require('./tcpServer.js');
var udp = require('./udpServer.js');

var network = {

    connections: [],

    getConnections: function() {
        return network.connections;
    },

    start: function(port) {
        console.log("[log] Starting network at port:", port);

        udp.start( port );
        tcp.start( port );
    }
};

module.exports = network;

// NEW

// module.exports = {

//     server: function() {

//     },

//     listen: function(port, cb) {
//          cb(err);
//     }

// };

// var Server = function() {
//     this._data = {};
// }

// Server.prototype.set = function(name, value) {
//     this._data[name] = value;
// };

// Server.prototype.get = function(name) {
//     if (this._data.co)
// };

// server.prototype.listen()