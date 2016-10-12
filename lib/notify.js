'use strict';
var myconfig = require(process.cwd() + '/config.js');

var slack = require('./slack.js');
var sms = require('./sms.js');

var all = function(msg){
  slack(msg);
  sms(msg);
};


module.exports = {
  slack : slack,
  sms : sms,
  all : all
};