var tmpData = "";

//gsheets
var GoogleSpreadsheet = require("google-spreadsheet");
 var creds = require('/home/pi/gsheets.json');
// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');




var PythonShell = require('python-shell');


var fs = require('fs')

var serialport = require('serialport');// include the library
   SerialPort = serialport.SerialPort; // make a local instance of it
   // get port name from the command line:
   portName = process.argv[2];

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\n")
 });

var elasticsearch = require('elasticsearch');
var connectionString = 'http://XXXXXXXXXXXXXXXX:9200';
var esclient = new elasticsearch.Client({
    hosts: [
      'http://XXX.XXX.XXX.XXX:9200',
      'http://XXX.XXX.XXX.XXX:9200'
      ]
});

var loggly = require('loggly');

  var logglyClient = loggly.createClient({
    token: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    subdomain: "krapil",
    auth: {
      username: "XXXXXXXXXXXXXXXXX",
      password: "XXXXXXXXXXXXXXXXXX"
    },
    //
    // Optional: Tag to send with EVERY log message
    //
    tags: ['tkpower'],
    json: true
  });

//var plotly = require('plotly')('timkrapil','48bsvsd45q');



myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function sendSerialData(data) {
   //console.log(data);

   v2Logger(data);
//   logElasticsearch(data);
}

function showPortClose() {
   console.log('port closed.');
}

function showError(error) {
   console.log('Serial port error: ' + error);
}


function v2Logger(data) {

  var now = new Date();
  data = data.substring(0, data.length - 1);
  var split = data.split(" ");
  if(tmpData.length > 0){

    data = data + " " + tmpData;

    v2ES(data);

    tmpData = "";

  }
  else if (tmpData.length <= 0) {
    tmpData = data + " ";
  }



}

function v2ES(data){


    var now = new Date();
//    data = data.substring(0, data.length - 1);
      var split = data.split(" ");
    // console.log(data);
    //   console.log(split[0]);
    //   console.log(split[1]);
    //   console.log(split[2]);
    //   console.log(split[3]);
    //   console.log(split[4]);
    //   console.log(split[5]);
    var pin1 = split[0];
    var watts1 = parseFloat(split[1]);
    var amps1 = parseFloat(split[2]);

    var pin0 = split[3];
    var watts0 = parseFloat(split[4]);
    var amps0 = parseFloat(split[5]);


    esclient.index({
      index: 'tkpowerv2',
      type: 'powermeter',
      body: {
        ts: (now),
        watts1: (watts1),
        amps1: (amps1),
        watts0: (watts0),
        amps0: (amps0),
        totalwatts:(watts1 + watts0),
        totalamps:(amps0 + amps1)

      }
    }, function (error, response) {
    console.log('elasticsearch');

    });

    var fileData = {
      ts: (now),
      watts1: (watts1),
      amps1: (amps1),
      watts0: (watts0),
      amps0: (amps0),
      totalwatts:(watts1 + watts0),
      totalamps:(amps0 + amps1)
    };

  //  console.log(fileData);


    fs.appendFile('/home/pi/tkpower/logs/v2tkpower.log', JSON.stringify(fileData) + "\n", function (err) {
      if (err) throw err;
      console.log('file write');
    });

//plotwatt
var meter = "11779878";


var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '/home/pi/plotwatt-api',
  args: [meter, ((watts1 + watts0)/1000), Math.floor((new Date).getTime()/1000)]
};

PythonShell.run('plotwatt.py', options, function (err, results) {
  //if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('plotwatt');
});

my_sheet.useServiceAccountAuth(creds, function(err){

    //my_sheet.addRow( 2, { colname: 'col value'} );

      my_sheet.addRow( 1, {
          ts: (now),
          watts1: (watts1),
          amps1: (amps1),
          watts0: (watts0),
          amps0: (amps0)
        });
    });

    console.log('google sheet');



}
