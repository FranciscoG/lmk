#!/usr/bin/env node
'use strict';
var spawn = require('child_process').spawn;
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var imageDiff = require('image-diff');
var del = require('del');

/****************************************************************************
 * Merge defaults with custom config
 */

var defaults = {
  width: 1000,
  height: 900,
  outputPath : process.cwd() + '/output/',
  filename : 'compare',
  loadTime : 5000,
  interval : 600000  // in MS,  default to every 10min
};
var myconfig = require(process.cwd() + '/config.js');
var config = Object.assign({}, defaults, myconfig);

if (!config.url) {
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
 * Our functions
 */


function PerformDiff(config) {
  var successCB = null;
  var errorCB = null;

  imageDiff({
    actualImage: config.outputPath + 'base.png',
    expectedImage: config.outputPath + 'compare.png',
    diffImage: config.outputPath + 'difference.png',
  }, function (err, imagesAreSame) {
    if (err & typeof errorCB === 'function') {
      errorCB(err);
    } else {
      // error will be any errors that occurred
      // imagesAreSame is a boolean whether the images were the same or not
      // diffImage will have an image which highlights differences
      if (typeof successCB === 'function') {
        successCB(imagesAreSame);
      }
    }
  });

  var then = function(cb){
    successCB = cb;
  };

  var catchFunc = function(cb){
    errorCB = cb;
  };

  return {
    then : then,
    catch : catchFunc
  };
}


function StartScreenshot(config){
  var args = [];

  var successCB = null;
  var errorCB = null;

  // add our phantomJS init script to the beginning of the arguments
  args.push(process.cwd() + '/lib/capture.js');
  args.push(JSON.stringify(config));

  // launch PhantomJS with the modified arguments
  var screenshots = spawn(binPath, args);

  screenshots.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  screenshots.stderr.on('data', function (data) {
    if (typeof errorCB === 'function') {
      errorCB('stderr: ' + data);
    }
  });

  screenshots.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    if (typeof successCB === 'function') {
      successCB(code);
    }
    
  });

  var then = function(cb){
    successCB = cb;
  };

  var catchFunc = function(cb){
    errorCB = cb;
  };

  return {
    then : then,
    catch : catchFunc
  };
}


/****************************************************************************
 * Continual future capture
 */

function setupInterval(config){
   var doCompare = new StartScreenshot(config);

   doCompare.then(function(){
      var diff = new PerformDiff(config);
      
      diff.then(function(imagesAreSame){
        console.log('images are the same:', imagesAreSame);
        // hook into notifications here
        if (imagesAreSame) {
          // do positive notification
        } else {
          // do negative noticatiom
        }
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

var doBase = new StartScreenshot(config);
doBase.then(function(){
  console.log("base image captured");
  config.filename = saveFilename;
  setInterval(setupInterval, config.interval, config);
});
doBase.catch(function(err){
  console.log(err);
});
