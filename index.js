#!/usr/bin/env node
'use strict';
var spawn = require('child_process').spawn;
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var imageDiff = require('image-diff');

var config = {
  width: 1000,
  height: 900,
  outputPath : './output/',
  filename : 'test',
  loadTime : 5000,
  url : '',
  clip : {
    left: 0,
    top: 0,
    width: 646,
    height: 900
  }
};

var captureArgs = [];

// add our phantomJS init script to the beginning of the arguments
captureArgs.push(process.cwd() + '/lib/capture.js');
captureArgs.push(JSON.stringify(config));

// launch PhantomJS with the modified arguments
var screenshots = spawn(binPath, captureArgs);

screenshots.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

screenshots.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

screenshots.on('exit', function (code) {
  console.log('child process exited with code ' + code);

  imageDiff({
    actualImage: './output/test.png',
    expectedImage: './output/screenshot.png',
    diffImage: './output/difference.png',
  }, function (err, imagesAreSame) {
    // error will be any errors that occurred
    // imagesAreSame is a boolean whether the images were the same or not
    // diffImage will have an image which highlights differences
    console.log(err, imagesAreSame);
  });
});

