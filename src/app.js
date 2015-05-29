/**
  * app.js
  *
  * Entry point for NodeUsage.
  *
  */

var Config     = require( 'config' );
var Controller = require( 'controller' );


// init

Config.init();
Controller.init();


// get usage

if( !Config.getCredentials() )
  Controller.error( "Please set credentials in the Pebble app." );
else
  Controller.displayUsage();
