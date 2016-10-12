## LMK
"let me know"

The purpose of this project is that at certain intervals it will takes screenshots (using phantomjs) and compares them (using image-diff) to see if there are differences.  If there are differences it will send a notification. 

Notification types:
email
sms (via twilio)
slack

### Installation

**1** - Install [ImageMagick](http://www.imagemagick.org/script/index.php). I'm using Uber's [image-diff](https://github.com/uber/image-diff) library which requires it.

**2** - edit your config,  see example


