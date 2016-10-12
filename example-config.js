module.exports.screenshotConfig = {
  width: 1000,
  height: 900,
  loadTime : 5000,
  interval : 30000, // in MS
  url : '', // your url
  
  // optional,  you can set region of page to clip
  clip : {
    left: 0,
    top: 0,
    width: 646,
    height: 900
  }
};

module.exports.slackConfig = {
  'URL' : '' // slack webhook POST url
};

module.exports.twilioConfig = {
  'accountSid' : '',
  'authToken' : '',
  'phone' : '',
  'twilioNumber' : ''
};