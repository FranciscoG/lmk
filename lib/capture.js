'use strict';
/* global phantom */
var system = require('system');
var page = require('webpage').create();


var config = JSON.parse(system.args[1]);
/********************************************************************
 * Handle PhantonJS errors
 */

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      var f = t.function;
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (f ? ' (in function ' + f +')' : '')); 
    });
  }
  console.error(msgStack.join('\n'));
};

/*********************************************************
  set viewPort size here
*/

page.viewportSize = { 
  width: config.width, 
  height: config.height 
};


page.open(config.url, function(status) {
  
  page.clipRect = {};
  if (config.clip !== void(0)) {
    page.clipRect = config.clip;
  }

  /*********************************************************
   render to a file
  */
  
  setTimeout(function(){
      var finalPath = (config.outputPath || './') + (config.filename || 'screenshot') + ".png";
      page.render(finalPath, {format: 'png', quality: '100'});
      page.close();
      phantom.exit();
    }, config.loadTime);

});


