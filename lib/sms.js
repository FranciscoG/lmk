var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.twilioConfig;

var twilio = require('twilio');
var client = new twilio.RestClient(config.accountSid, config.authToken);

function sendSMS(msg){
  if (!msg) { 
    return; 
  }
  if (!config.phone || config.phone === '') {
    return;
  }
  if (!config.twilioNumber || config.twilioNumber === '') {
    return;
  }

  client.messages.create({
      body: msg,
      to: config.phone,  // Text this number
      from: config.twilioNumber // From a valid Twilio number
  }, function(err, message) {
    if(err) {
      console.error(err.message);
    }
  });
}


module.exports = sendSMS;