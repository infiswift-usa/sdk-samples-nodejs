var mqtt = require('mqtt');
var config = require('./mqtt_config')
var fs = require('fs');
var dns = require('dns')

// options for passing in the mqtt connect call
var options = {
  clientId : config.mqtt.clientId,
  host : config.mqtt.server,
  port: config.mqtt.port,
  rejectUnauthorized: true,
  protocol : 'mqtt',
  username : config.mqtt.username,
  password : config.mqtt.password,
  clean : false
}

var ip;

// connect to the MQTT broker
var client = mqtt.connect(options);
var currentDate = new Date();
var payload = {"temperature - farenheit" : 80, "timestamp" : currentDate};
// var topic = config.mqtt.topicprefix + config.mqtt.clientId + '/name/' + 'test';
var topic = config.mqtt.topicprefix + '+' + '/name/' + 'qos1test';
var subscribed = false;

dns.lookup(config.mqtt.server, function(err, result) {
  ip = result;
})

//  listening for the connect event
client.on('connect', function () {
  console.log('connected to ' + ip + ':' + config.mqtt.port);
// since connect is async, need to wait for this event to actually make the subscribe and publish calls
/*if (!subscribed) {
  client.subscribe(topic, { qos: 0 });
  console.log('subscribed to ' + topic);
  subscribed = true;
} else {
  console.log('already subscribed to ' + topic);
}*/
  
  
  
  // client.publish(topic, JSON.stringify(payload), { qos: 0 });
});

// listening for the event that indicates that the subscriber has a message
client.on('message', function (topic, message) {
  // console.log('received a message!')
  console.log('Topic received : ', topic);
  console.log('Message received : ', message.toString());
  //  client.end();
});