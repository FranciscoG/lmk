var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.twilioConfig;

var twilio = require('twilio');
var client = new twilio.RestClient(config.accountSid, config.authToken);

function sendSMS(msg){
  if (!msg) { 
    return; 
  }
  if (!config.phone || config.phone.length === 0) {
    return;
  }
  if (!config.twilioNumber || config.twilioNumber === '') {
    return;
  }

  config.phone.forEach(function(phone){
    client.messages.create({
        body: msg,
        to: phone,  // Text this number
        from: config.twilioNumber // From a valid Twilio number
    }, function(err, message) {
      if(err) {
        console.error(err.message);
      }
    });
  });

}


module.exports = sendSMS;