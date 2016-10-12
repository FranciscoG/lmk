'use strict';
var myconfig = require(process.cwd() + '/config.js');
var config = myconfig.imgurConfig;

var imgur = require('imgur');
var clientID = process.env.IMGUR_CLIENTID || config.clientID;

imgur.setClientId(clientID);

function upload(file){
  if (!file) {
    console.error("imgur needs a file");
    return;
  }
  return imgur.uploadFile(file);
}

module.exports = {
  upload : upload 
};
