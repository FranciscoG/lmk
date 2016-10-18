#!/usr/bin/env node
'use strict';
var del = require('del');
var notify = require(process.cwd() + '/lib/notify.js');
var imgur = require(process.cwd() + '/lib/imgur.js');
var myconfig = require(process.cwd() + '/config.js');
var main = require(process.cwd() + '/lib/main.js');

/****************************************************************************
 * Merge defaults with custom config
 */

var defaults = {
  width: 1000,
  height: 900,
  outputPath : process.cwd() + '/output/',
  filename : 'compare',
  loadTime : 10000,
  interval : 600000,  // in MS,  default to every 10min
  clip : {
    left: 0,
    top: 231,
    width: 626,
    height: 910
  }
};

// get the url
var config = defaults;
config.url  = process.env.PINGURL || myconfig.screenshotConfig.url;

if (!config.url || config.url === '') {
  console.error('Missing url');
  process.exit(1);
}

// add a trailing slash if it doesn't exst already
if (!/\/$/.test(config.outputPath)) {
  config.outputPath += '/';
}

/****************************************************************************
 * Whe program first loads, delete everything in output folder
 */

// delete delete delete
del([config.outputPath + '*.png']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});

/****************************************************************************
 * eventually do more with errors
 */

function disconnect(err){
  if(err) {
    console.log('error', 'BOT', err.stack);
  }
  process.exit(err ? 1 : 0);
}
//Properly disconnect from room and close db connection when program stops
process.on('exit', disconnect); //automatic close
process.on('SIGINT', disconnect); //ctrl+c close
process.on('uncaughtException', disconnect);


/****************************************************************************
 * Continual future capture
 */

function setupInterval(config){
   var doCompare = new main.StartScreenshot(config);
   const diffImg = config.outputPath + '/difference.png';

   doCompare.then(function(){
      var diff = new main.PerformDiff(config);
      
      diff.then(function(imagesAreSame){
        console.log('images are the same?', imagesAreSame);

        /*************************************************************************
         *  This is where you would hook up your notifications
         */

        if (imagesAreSame){
          // notify.slack("no changes detected on: "  + config.url, null);
          main.rotateFiles(config);
          return;
        }

        // if there is a change, we post to slack, upload to imgur as well
        notify.all("Changes detected on " + config.url, null);

        // I don't want imgur blocking the the first notification so we separate the calls
        imgur.upload(diffImg)
          .then(function (json) {
            console.log(json.data.link);
            notify.all(json.data.link, json.data.link);
          })
          .catch(function (err) {
              console.error(err.message);
          });

        /*
         * End notification area block
         ************************************************************************/

        // save backups of base only when there's a change
        main.rotateFiles(config, true);
      });

      diff.catch(function(err){
        console.log(err);
      });
   });
}


/****************************************************************************
 * INIT
 * start off by taking the base screenshot
 * then starting the interval upon success
 */

var saveFilename = config.filename;
config.filename = "base";

var doBase = new main.StartScreenshot(config);
doBase.then(function(){
  console.log("base image captured");
  config.filename = saveFilename;
  setInterval(setupInterval, config.interval, config);
});
doBase.catch(function(err){
  console.log(err);
});
