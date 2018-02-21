var mqtt = require('mqtt');
var config = require('./mqtt_config')
var fs = require('fs');
var dns = require('dns')

var options = {
  clientId : config.mqtt.clientId,
  host : config.mqtt.server,
  port: config.mqtt.port,
  rejectUnauthorized: true,
  protocol : 'mqtts',
  username : config.mqtt.username,
  password : config.mqtt.password
}

var ip;
var client = mqtt.connect(options);
var currentDate = new Date();
var payload = {"temperature - farenheit" : 80, "timestamp" : currentDate};
var topic = config.mqtt.topicprefix + config.mqtt.clientId + '/name/' + 'test';

dns.lookup(config.mqtt.server, function(err, result) {
  ip = result;
})

client.on('connect', function () {
  console.log('connected to ' + ip + ':' + config.mqtt.port);
  client.subscribe(topic);
  client.publish(topic, JSON.stringify(payload), { qos: 0 });
});

client.on('message', function (topic, message) {
  console.log('received a message!')
  console.log('Topic : ', topic);
  console.log('Message : ', message.toString());
  client.end();
});