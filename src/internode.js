/**
  * internode.js
  *
  * A class representing the Internode usage api.
  *
  */

var Constants = require( 'constants' );
var Misc      = require( 'misc' );
var ajax      = require( 'ajax' );
var Settings  = require( 'settings' );

var Internode = {};  // data model

Internode.serviceId = null;

Internode.getUsage = function( auth, controller )
{
  console.log( "usage data requested" );
  
  
  // check cached usage data
  
  var usage = Settings.data( Constants.INTERNODE_USAGE_CACHE ) || null;  
  if( usage !== null )
  {        
    console.log( "current usage cache data: " + Settings.data( Constants.INTERNODE_USAGE_CACHE ) );
    usage = JSON.parse( Settings.data( Constants.INTERNODE_USAGE_CACHE ) ); 
    
    
    // check if usage checked recently
    
    var lastUpdate = new Date( usage.lastUpdate );
    var now = new Date();
    var secsDiff = (now.getTime() - lastUpdate.getTime()) / 1000;  // secs
    if( secsDiff < Constants.INTERNODE_REFRESH_SECS )
    {    
      // return cached data, recalculating days left until quota rollover
      
      usage.daysLeft = Misc.DaysDiff( now, new Date( usage.rolloverYear, usage.rolloverMonth-1, usage.rolloverDay ) );
      Settings.data( Constants.INTERNODE_USAGE_CACHE, JSON.stringify( usage ) );
      
      console.log( "returning cached usage data" );
      controller.usageCallback();
      return;
    }
    
    console.log( "cache out of date" );
  }
  
  
  // request usage data
  
  if( Internode.serviceId === null )  
    Internode._getUsageNoServiceId( auth, controller );
  else  
   Internode._getUsage( auth, Internode.serviceId, controller );
};

Internode._getUsageNoServiceId = function( auth, controller )
{
  console.log( "getting service details via: " + Constants.INTERNODE_API );
  ajax(
    {
      url: Constants.INTERNODE_API,
      headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': Constants.INTERNODE_USERAGENT },      
      cache: false
    },
    function( data )
    {
      console.log( data );
      
      /// TODO: handle data.notmatch
      var serviceId = data.match( />(\d+)</ )[1];  // parse service id
      if( serviceId === null )
      {
        var errorMsg = "Failed to parse SERVICE_ID from: " + data;
        console.log( errorMsg );
        controller.error( errorMsg );
      }
      else
      {
        console.log( 'SERVICE_ID: ' + serviceId );       
        Internode.serviceId = serviceId;  // store for future use      
        Internode._getUsage( auth, Internode.serviceId, controller );
      }
    },
    function( error )
    {
      var errorMsg = 'The ajax request failed: ' + error;
      console.log( errorMsg );
      controller.error( errorMsg );
    }
  );
};

Internode._getUsage = function( auth, serviceId, controller )
{ 
  var usageUrl = Constants.INTERNODE_API + serviceId + "/usage";   
  console.log( "getting current usage via: " + usageUrl );
  ajax(
    {
      url: usageUrl,
      headers: { 'Authorization': 'Basic ' + auth, 'User-Agent': Constants.INTERNODE_USERAGENT },
      cache: false
    },
    function( data )
    {
      console.log( data );
      
      // TODO: handle data.notmatch
      // <traffic name="total" rollover="2014-11-03" plan-interval="Monthly" quota="100000000000" unit="bytes">41668182779</traffic>
      var matches = data.match( /<traffic name="total" rollover="(\d\d\d\d)-(\d\d)-(\d\d)" plan-interval="(\w+)" quota="(\d+)" unit="bytes">(\d+)<\/traffic>/ );        
      if( matches.length != 7 )
      {
        var errorMsg = "Expected 7 matches in traffic (total) xml, got " + matches.length;
        console.log( errorMsg );
        controller.error( errorMsg );
      }
      else
      {
        // store usage data in local storage
        
        var usage =
        {
          lastUpdate    : new Date(),
          rolloverYear  : matches[1],
          rolloverMonth : matches[2],
          rolloverDay   : matches[3],
          planInterval  : matches[4],
          quota         : matches[5],
          currentQuota  : matches[6],
          daysLeft      : Misc.DaysDiff( new Date(),
                                         new Date( matches[1], matches[2]-1, matches[3] ) )
        };        
        Settings.data( Constants.INTERNODE_USAGE_CACHE, JSON.stringify( usage ) );        
        console.log( "stored usage cache data: " + Settings.data( Constants.INTERNODE_USAGE_CACHE ) );
        
        controller.usageCallback();
      }
    },
    function( error )
    {
      var errorMsg = 'The ajax request failed: ' + error ; 
      console.log( errorMsg );
      controller.error( errorMsg );
    }
  );
};

module.exports = Internode;