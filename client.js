var PORT = 44445;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer('asdasd|123123|zxczxcx');

var client = dgram.createSocket('udp4');

client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});