/**
  * controller.js
  *
  * A class to perform the NodePebble interactions.
  *
  */

var Pebble    = require( 'pebble' );
var Internode = require( 'internode' );
var Settings  = require( 'settings' );
var Constants = require( 'constants' );
var Config    = require( 'config' );

var Controller = {};

Controller.init = function()
{
  console.log( "entered Controller.init()" );  
  Pebble.init();
};

Controller.displayUsage = function()
{
  console.log( "entered Controller.displayUsage()" );  
  Internode.getUsage( Config.getCredentials(), Controller );
};

Controller.forceRefreshUsage = function()
{
  console.log( "entered Controller.forceRefreshUsage()" );
  Settings.data( Constants.INTERNODE_USAGE_CACHE, null );
  console.log( "cleared usage cache" );
  
  Pebble.showLoading();
  Controller.displayUsage();
};

Controller.usageCallback = function()
{
  console.log( "entered Controller.usageCallback()" );
  
  var usage = JSON.parse( Settings.data( Constants.INTERNODE_USAGE_CACHE ) );
  Pebble.showUsage( usage, Controller );
};

Controller.error = function( error )
{
  console.log( "entered Controller.error( error ): " + error );
  Pebble.showError( error );
};

module.exports = Controller;