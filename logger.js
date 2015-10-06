//*******CONFIGS***********

var config = require('./config.json');


var jsonFilePath = config.jsonFilePath;
var logFilePath = config.logFilePath;

//******************************



var fs = require('fs');

var RSMQWorker = require( "rsmq-worker" );
var worker = new RSMQWorker( "tkserial" );

var  RedisSMQ = require("rsmq");
var  rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
    hosts: [
      'http://10.0.1.49:9200',
      'http://10.0.1.43:9200'
      ]
});

  worker.on( "message", function( msg, next ){

	//console.log(msg);
  if (config.boolPlotwatt) {plotwattQueue(msg)};
  objData = parseData(msg);
  writeFile(objData, msg);
  if (config.boolElasticsearch) {writeElasticSearch(objData)};

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

  function writeElasticSearch(objData){
    var ts = Date.parse(objData.date);
    esclient.index({
      index: 'tkpowerv3',
      type: 'powermeterV3',
      body: {
        ts: (objData.date),
        watts1: (objData.watts1),
        amps1: (objData.amps1),
        watts0: (objData.watts0),
        amps0: (objData.amps0),
        totalwatts:(objData.sumwatts),
        totalamps:(objData.sumamps)
      }
    }, function (error, response) {
    //console.log("Elastic search");
    });

  }

  function writeFile(objData, msg){
    //console.log(objData);

    var fileData = {
      ts: (objData.date),
      watts1: (objData.watts1),
      amps1: (objData.amps1),
      watts0: (objData.watts0),
      amps0: (objData.amps0),
      totalwatts:(objData.sumwatts),
      totalamps:(objData.sumamps)
    };

  //  console.log(fileData);

  fs.appendFile(logFilePath, msg + "\n", function (err) {
    //eat the error
    //if (err) throw err;
    //console.log("log file");
  });
    if (config.booljsonFile){
      fs.appendFile(jsonFilePath, JSON.stringify(fileData) + "\n", function (err) {
        //eat the error
        //if (err) throw err;
        //console.log("json file");
      });
    }

  }

  function parseData(data){
    var objData = [];
    var split = data.split(" ");

    objData.date = split[0];
    objData.pin1 = split[1];
    objData.watts1 = parseFloat(split[2]);
    objData.amps1 = parseFloat(split[3]);
    objData.pin0 = split[4];
    objData.watts0 = parseFloat(split[5]);
    objData.amps0 = parseFloat(split[6]);
    objData.sumwatts = parseFloat(split[7]);
    objData.sumamps = parseFloat(split[8]);


    return objData;
  }

  function plotwattQueue(msg){
    rsmq.sendMessage({qname:"plotwatt", message:(msg)}, function (err, resp) {
     if (err) {
         console.log(err);
     }
     //console.log("plotwatt queue");
   });


  }





  worker.start();
