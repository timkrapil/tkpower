var config = require('../config.js');


var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "loggly" );


var  RedisSMQ = require("rsmq");
var  rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

worker.on( "message", function( msg, next ){

postloggly(msg);


next()
});

// optional error listeners
worker.on('error', function( err, msg ){
    console.log( "ERROR", err, msg.id );
});
worker.on('exceeded', function( msg ){
    console.log( "EXCEEDED", msg.id );
});
worker.on('timeout', function( msg ){
    console.log( "TIMEOUT", msg.id, msg.rc );
});

function postloggly(msg){

  //curl -H "content-type:text/plain" -d '{ "message" : "hello" }' http://logs-01.loggly.com/inputs/1244c9f6-5535-4a5b-86ed-0895109a0b84/tag/http/

  var exec = require('child_process').exec;

      var args = "-H \"content-type:text/plain\" -d" + msg + " " + "http://logs-01.loggly.com/inputs/1244c9f6-5535-4a5b-86ed-0895109a0b84/tag/tkpowerv3/";

      console.log(args);

      exec('curl ' + args, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('stderr: ' + error);
        }
      });


}
