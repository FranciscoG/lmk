var request = require('superagent');
var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.slackConfig;


function sendToSlack(msg){
  request
    .post(config.URL)
    .set('Content-Type', 'application/json')
    .send({
        "username": "LMK alert bot", 
        "text": msg || "testing, please ignore", 
        "icon_emoji": ":rotating_light:"
    })
    .end(function(err, res){
      if (err) {
        console.log(err);
      }
    });

}

module.exports = sendToSlack;