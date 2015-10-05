RedisSMQ = require("rsmq");
 rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

rsmq.createQueue({qname:"plotwatt"}, function (err, resp) {
        if (resp===1) {
            console.log("queue created")
        }
});

rsmq.createQueue({qname:"tkserial"}, function (err, resp) {
        if (resp===1) {
            console.log("queue created")
        }
});
