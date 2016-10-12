'use strict';
var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.twilioConfig;

var accountSid = process.env.TWILIO_ACCTSID || config.accountSid;
var authToken = process.env.TWILIO_TOKEN || config.authToken;
var twilio_phone = process.env.TWILIO_PHONE || config.twilioNumber;
var phone = process.env.SMS_TARGET || config.phone;

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

function sendSMS(msg){
  if (!msg) { 
    console.error("missing sms msg");
    return; 
  }
  if (!phone || phone === '') {
    console.error("missing phone number");
    return;
  }
  if (!twilio_phone || twilio_phone === '') {
    console.error("missing twilio phone number");
    return;
  }

  client.messages.create({
      body: msg,
      to: phone,  // Text this number
      from: twilio_phone // From a valid Twilio number
  }, function(err, message) {
    if(err) {
      console.error(err.message);
    }
  });

}


module.exports = sendSMS;