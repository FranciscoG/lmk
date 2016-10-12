var request = require('superagent');
var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.slackConfig;

var HOOKURL = config.URL;
if (process.env.SLACKHOOK) {
  HOOKURL = process.env.SLACKHOOK;
}


function sendToSlack(msg){
  if (!HOOKURL) {
    console.error("Missing Slack Webhook URL");
    return;
  }

  request
    .post(HOOKURL)
    .set('Content-Type', 'application/json')
    .send({
        "username": "LMK alert bot", 
        "text": msg || "testing, please ignore", 
        "icon_emoji": ":rotating_light:"
    })
    .end(function(err, res){
      if (err) {
        console.error(err);
      }
    });

}

module.exports = sendToSlack;