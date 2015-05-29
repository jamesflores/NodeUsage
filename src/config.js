/**
  * config.js
  *
  * User configuration class for NodePebble.
  *
  */

var Settings  = require( 'settings' );
var Constants = require( 'constants' );
var Base64    = require( 'webtoolkit.base64' );

var Config = {};


// set configuration page

Config.init = function()
{
  console.log( "entered Config.init()" );
  var options = {};
  Settings.config(
    { url: Constants.CONFIG_URL },
    function( e )
    {
      console.log( 'opening: ' + Constants.CONFIG_URL );
    },
    function( e )
    {
      console.log( 'closed: ' +  Constants.CONFIG_URL );
      
      
      // using primitive JSON validity and non-empty check
      
      if( e.response.charAt( 0 ) == "{" && e.response.slice( -1 ) == "}" && e.response.length > 5 )
        options = JSON.parse( decodeURIComponent( e.response ) );  
      
      if( e.failed )  // show raw response if parsing failed
        console.log( e.response );
      else
      {
        console.log( "saving credentials to local storage" );
        Config._saveCredentials( options.username, options.password ); 
      }
    }
  );
};

Config.getCredentials = function()
{
  return Settings.data( Constants.STORAGE_AUTH );
};

Config._saveCredentials = function( username, password )
{
  console.log( "entering Config._saveCredentials( username, password )" );  
  var auth = Base64.encode( username + ':' + password );
  Settings.data( Constants.STORAGE_AUTH, auth );
};


module.exports = Config;