/**
  * misc.js
  *
  * Misc helper functions for NodePebble.
  *
  */

var Constants = require( 'constants' );
var Misc = {};


// get number of days between two dates
Misc.DaysDiff = function( date1, date2 )
{  
  var dayMs   = 1000*60*60*24;  // day in ms
  var date1Ms = date1.getTime();
  var date2Ms = date2.getTime();

  
  // calc diff
  
  var diffMs = date2Ms - date1Ms;
  
  
  // return diff in days
  
  var days = diffMs / dayMs;
  return days;  
};


// convert bytes to GB with precision
Misc.BytesToGB = function( bytes, precision )
{
  var gb = bytes / Constants.SI_KILOBYTE / Constants.SI_KILOBYTE / Constants.SI_KILOBYTE;
  return gb.toFixed( precision );
};


module.exports = Misc;