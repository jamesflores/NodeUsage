/**
  * pebble.js
  *
  * A class to display data on the Pebble.
  *
  */

var UI   = require( 'ui' );
var Misc = require( 'misc' );
var Vibe = require( 'ui/vibe' );

var Pebble = {};  // view model


Pebble.cards = {};

Pebble.init = function()
{
  console.log( "entered Pebble.init()" );
  Pebble.cards.splash = new UI.Card
  ( {
    title: '   NodeUsage',
     body: '\n    Loading data...'
  } );
  Pebble.cards.splash.show();
};

Pebble.showUsage = function( usage, controller )
{
  console.log( "entered Pebble.showUsage( usage )" );  
  var gbRemaining = ( usage.quota - usage.currentQuota );
  var rolloverDate = usage.rolloverDay + '/' + usage.rolloverMonth + '/' + usage.rolloverYear;  
  
  Pebble.cards.usage = new UI.Menu
  ( {
    sections: [ {
      items: [ {
        title: Misc.BytesToGB( usage.currentQuota, 2 ) + " GB",
        subtitle: 'Usage'
      }, {
        title: Misc.BytesToGB( gbRemaining, 2 ) + " GB",
        subtitle: 'Remaining'
      }, {
        title: usage.daysLeft.toFixed( 1 ),
        subtitle: 'Days left'
      }, {
        title: rolloverDate,
        subtitle: 'Rollover'
      }, {
        title: Misc.BytesToGB( usage.quota, 2 ) + " GB",
        subtitle: 'Quota'
      } ]
    } ]  
  } );
  
  Pebble._hideCards();
  Pebble.cards.usage.show();
  
  Pebble.cards.usage.on( 'longSelect', function( e )
  {
    controller.forceRefreshUsage();
    Vibe.vibrate( 'short' );
  } );
};

Pebble.showLoading = function()
{
  console.log( "entered Pebble.showLoading()" );
  Pebble.cards.loading = new UI.Card( {
    title: '   NodeUsage',
     body: '\n    Loading data...'
  } );
  Pebble._hideCards();
  Pebble.cards.loading.show();
};

Pebble.showError = function( error )
{
  console.log( "entered Pebble.showError( error )" );
  Pebble.cards.error = new UI.Card
  ( {
      title: '   NodeUsage',
      body: error,
      scrollable: true
  } );
  Pebble._hideCards();
  Pebble.cards.error.show();
};

Pebble._hideCards = function()
{
  console.log( "entered Pebble._hideCards()" );
  for( var card in Pebble.cards )
  {
    if( card )
      Pebble.cards[card].hide();
  }
};

module.exports = Pebble;