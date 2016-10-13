## LMK
"let me know"

A DIY way of checking a website for visual changes and notifying you via Slack and SMS when changes occur.


### Installation

**1** - Install [ImageMagick](http://www.imagemagick.org/script/index.php). I'm using Uber's [image-diff](https://github.com/uber/image-diff) library which requires it.

**2** - Setup your `config.js` file by getting the following (see example-config.js):

* Get your [Slack Incoming webhook](https://api.slack.com/incoming-webhooks) url
* [Register an app with Imgur](https://api.imgur.com/) and get a client ID
* Put in the url of the site you'd like to screenshot
* setup a Twilio account and get accountSid, authToken, and your Twilio number.  
  * `phone` is the number you will be texting when there is a change detected 


if you want to do automatic deployments via heroku or something, all the variables in the config are also available as environment variables as well.  In fact, it checks to see if the env vars exist first and uses `config.js` as a backup.  Note that the names slightly differ (TODO: make them match _I guess_)

```javascript
  process.env.PINGURL
  process.env.IMGUR_CLIENTID
  process.env.SLACKHOOK
  process.env.TWILIO_ACCTSID
  process.env.TWILIO_TOKEN
  process.env.TWILIO_PHONE
  process.env.SMS_TARGET 
```

### Troubleshooting

I had some issues getting `phantomjs-prebuilt` to install (via npm) on my server (CentOS 7). You need to install some prerequisites:

```bash
yum install fontconfig freetype freetype-devel fontconfig-devel libstdc++ bzip2
```

helpful links:

[https://www.bonusbits.com/wiki/HowTo:Install_PhantomJS_on_CentOS](https://www.bonusbits.com/wiki/HowTo:Install_PhantomJS_on_CentOS)

[https://github.com/Medium/phantomjs/issues/630](https://github.com/Medium/phantomjs/issues/630)




