var config = require('./config.json');


var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "plotwatt" );
  var apikey = config.plotwattAPIkey;
  var meter = config.plotwattMeterID;

var msgs = [];

var  RedisSMQ = require("rsmq");
var  rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

function parsePlotWatt(objmsgs){
  var times = [];
  var watts = [];
  var msg = "";
  //console.log(objmsgs);


  for (var i = 0, len = objmsgs.length; i < len; i++) {
    msg = (objmsgs[i]);

    var split = msg.split(" ");
    tmpdate = new Date(Date.parse(split[0]));
    tmpwatts = parseFloat(split[7]);
    tmpdate = Math.floor(tmpdate.getTime() / 1000);
    tmpdate = parseInt(tmpdate);
    tmpwatts = (tmpwatts/1000);

    times.push(tmpdate);
    watts.push(tmpwatts);

  }
  //console.log(watts);
  postPlotWatt(watts, times);

}



worker.on( "message", function( msg, next ){
  if (msgs.length < 50){
    msgs.push(msg);
    //console.log("< 50")

  }
  if (msgs.length == 50){
    //use the 50 results
    parsePlotWatt(msgs);
    //empty the array
    msgs.length = 0;
    //put the first msg in the new array
    msgs.push(msg);
  }

  next();

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
worker.start();
//worker.stop();









function postPlotWatt(watts, times){


  //console.log(times.length);
  postData = "";
  for (var i = 0, len = times.length; i < len; i++) {


      postData += (meter + "," + watts[i] + "," + times[i] + ",");

  }
    postData = postData.substring(0, postData.length - 1);
    //console.log(postData);


    var exec = require('child_process').exec;

        var args = "-X POST -d \"" + postData + "\" http://" + apikey + ":@plotwatt.com/api/v2/push_readings";

        //console.log(args);

        exec('curl ' + args, function (error, stdout, stderr) {
          //console.log('stdout: ' + stdout);
          //console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
        });

}
