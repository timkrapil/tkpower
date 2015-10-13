var config = require('./config.js');


var serialport = require('serialport');// include the library
   SerialPort = serialport.SerialPort; // make a local instance of it
   // get port name from the command line:
   portName = process.argv[2];

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\n")
 });

 RedisSMQ = require("rsmq");
 rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );



myPort.on('open', showPortOpen);
myPort.on('data', recieveSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function recieveSerialData(data) {
   console.log(data);
   var now = new Date();
   var jsonDate = now.toJSON();
   data = data.substring(0, data.length - 1);
   data = jsonDate + " " + data;
   rsmq.sendMessage({qname:"tkserial", message:(data)}, function (err, resp) {
    if (err) {
        console.log(err);
    }
  });

}

function showPortClose() {
   console.log('port closed.');
}

function showError(error) {
   console.log('Serial port error: ' + error);
}
