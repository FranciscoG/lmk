'use strict';
var spawn = require('child_process').spawn;
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var imageDiff = require('image-diff');
var fs = require('fs');

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

function rotateFiles(config, backup){
  // rename base to screenshot-timestamp
  
  if (backup) {
    fs.renameSync(
      config.outputPath + 'base.png', 
      config.outputPath + 'screenshot-'+Date.now()+'.png'
    );
  }
  
  // rename compare to be the new Base
  fs.renameSync(
      config.outputPath + 'compare.png', 
      config.outputPath + 'base.png'
  );
}

module.exports = {
  PerformDiff : PerformDiff,
  StartScreenshot : StartScreenshot,
  rotateFiles : rotateFiles
};