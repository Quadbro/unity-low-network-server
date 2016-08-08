var shortid = require('shortid');

var Connection = function( socket ) {
    this.id = shortid.generate();
    this.createdAt = Date.now();
    this.socket = socket;

    this.ip = null;
    this.port = null;

    this.udpinfo = null;
    this.lastping = 0;

    this.register();
};

Connection.prototype.register = function() {
    var self = this;

    console.log('[log] Connected user: ', this.socket.remoteAddress, ':', this.socket.remotePort);
    
    this.ip = this.socket.remoteAddress;
    this.port = this.socket.remotePort;

    this.socket.on('data', function(data) {
        self.message(data, "tcp");
    });
    
    this.socket.on('close', function(data) {
        self.close();
    });

    this.send({
        id: 1, 
        data: { uid: this.id } 
    });

    // Ping, every 1000ms
    this.pinger = setInterval(function() {
        self.send({
            id: 2, 
            data: { 
                timestamp: Date.now(),
                ping: self.lastping
            } 
        });
    }, 1000);
};

Connection.prototype.message = function(data, protocol, info) {
    var self = this;

    if (info) {
        this.udpinfo = info;
    }

    packet = this.decodeData(data);

    if (packet.id === 502) {
        this.lastping = Date.now() - packet.data.timestamp;
        return;
    }

    if (packet.id === 503) {
        this.send({
            id: 3,
            data: {
                msg: "ok"
            }
        }, "udp");
    }

    console.log(
        '[log] Client packet', packet.id, 
        'with data:', JSON.stringify(packet.data)+
        ', protocol:', protocol
    );


    
    // if (data.toString().indexOf("PING") !== -1) {
    //     this.send( new Buffer("PONG\n") );
    // } else {
};

Connection.prototype.close = function() {
    clearInterval( this.pinger );
    console.log('[log] User %s disconnected.', this.id);
};

Connection.prototype.encodeData = function(data) {
    return JSON.stringify(data) + "\n";
};

Connection.prototype.decodeData = function(data) {
    return JSON.parse(
        data.toString().trim()
    );
};

Connection.prototype.send = function(data, protocol) {
    data = this.encodeData(data);

    if (!protocol || protocol === "tcp") {
        this.socket.write(data);
    } else if (protocol === "udp") {
        var server = require('./udpServer').server;
        server.send( data, 0, data.length, this.udpinfo.port, this.udpinfo.address );
    }
    // console.log("[log] Send message to client:", data.toString());
};

module.exports = Connection;