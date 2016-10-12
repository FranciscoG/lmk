var request = require('superagent');
var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.slackConfig;

var HOOKURL = config.URL;
if (process.env.SLACKHOOK) {
  HOOKURL = process.env.SLACKHOOK;
}


function sendImgToSlack(imgURL){
  if (!HOOKURL) {
    console.error("Missing Slack Webhook URL");
    return;
  }

  if (!imgURL) {
    console.error("Missing image url");
    return;
  }

  request
    .post(HOOKURL)
    .set('Content-Type', 'application/json')
    .send({
        "username": "LMK alert bot", 
        "text": "here's the diff off what changed", 
        "icon_emoji": ":rotating_light:",
        "attachments": [
            {
                "fallback": "here's the diff off what changed", 
                "color": "#ff0000",
                "image_url": imgURL
            }
        ]
    })
    .end(function(err, res){
      if (err) {
        console.error(err);
      }
    });
}

function sendToSlack(msg, imgURL){
  if (!HOOKURL) {
    console.error("Missing Slack Webhook URL");
    return;
  }

  // if there's an img url then we switch to
  // the other one.  it's hack, I know, IDGAF
  if (imgURL) {
     sendImgToSlack(imgURL);
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