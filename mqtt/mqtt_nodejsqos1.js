var mqtt = require('mqtt');
var config = require('./mqtt_config')
var fs = require('fs');
var dns = require('dns')
const readline = require('readline');

// options for passing in the mqtt connect call
var options = {
  clientId : config.mqtt.clientId,
  host : config.mqtt.server,
  port: config.mqtt.port,
  rejectUnauthorized: true,
  protocol : 'mqtt',
  username : config.mqtt.username,
  password : config.mqtt.password,
  clean : false,
  reconnect : false
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



var ip;

// connect to the MQTT broker
var client = mqtt.connect(options);
var currentDate = new Date();
var payload = {"temperature - farenheit" : 80, "timestamp" : currentDate};
var topic = config.mqtt.topicprefix + '+' + '/name/' + 'qos1failoverdemo';
var subscribed = false;

dns.lookup(config.mqtt.server, function(err, result) {
  ip = result;
})

function receiveMessage (topic, message) {
  console.log('Topic received : ', topic);
  console.log('Message received : ', message.toString());
}

// listening for the event that indicates that the subscriber has a message
client.on('message', function (topic, message) {
  console.log('Topic received : ', topic);
  console.log('Message received : ', message.toString());
  rl.question('Press any key for disconnecting the subscriber', (answer) => {
  client.end();
  console.log('subscriber disconnected');  
  rl.close();
  
  const rl1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  });
  rl1.question('Press any key for reconnecting the subscriber', (answer) => {
      var client2 = mqtt.connect(options);
      client2.on('connect', function () {
        console.log('reconnected to ' + ip + ':' + config.mqtt.port);
      });
      client2.on('message', receiveMessage);
      rl1.close();
    }) 
  });
});


//  listening for the connect event
client.on('connect', function () {
  console.log('connected to ' + ip + ':' + config.mqtt.port);
// since connect is async, need to wait for this event to actually make the subscribe and publish calls
if (!subscribed) {
  client.subscribe(topic, { qos: 1 });
  console.log('subscribed to ' + topic);
  subscribed = true;
} else {
  console.log('already subscribed to ' + topic);
}
});


