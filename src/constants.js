/**
  * constants.js
  *
  * Constans for NodePebble.
  *
  */

var Constants = {};


// SI decimal values

Constants.SI_KILOBYTE = 1000;


// keys for localStorage

Constants.STORAGE_AUTH = "Internode.Auth";  // http basic auth, Base64
Constants.STORAGE_USAGE_CACHE = "Internode.UsageCache";  // json


// Internode

Constants.INTERNODE_API = "https://customer-webtools-api.internode.on.net/api/v1.5/";
Constants.INTERNODE_SERVICE_TYPE = "Personal_ADSL";
Constants.INTERNODE_REFRESH_SECS = 60*60;  // 1 hr
Constants.INTERNODE_USERAGENT = "NodeUsage/1.3 (james@jamesflores.net/Pebble Smartwatch)";


// Config url

Constants.CONFIG_URL = "http://users.on.net/~jflores/NodeUsage/config.html";


module.exports = Constants;