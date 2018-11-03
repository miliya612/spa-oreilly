/*
 * spa.chat.js
 * SPAのチャット機能モジュール
*/
/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global $, spa */

spa.chat = (function() {
  // BEGIN module scope variables
  var
    configMap = {
      main_html: String()
        + '<div style="padding: 1em; color: #fff;">'
          + 'Say hello to chat'
        + '</div>',
      settable_map: {}
    },
    stateMap = { $container: null },
    jqueryMap = {},

    setJqueryMap, configModule, initModule
    ;
  // END module scope variables

  // BEGIN utility methods
  // END utility methods

  // BEGIN DOM methods
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {$container: $container};
  };
  // END DOM methods
  
  // BEGIN event handler
  // END event handler
  
  // BEGIN public methods
  // begin public method /configModule/
  // Purpose: adjust the structure of allowed keys
  // Arguments: map of structurable key-value
  //   * color_name - utilized color
  // Option:
  //   * configMap.settable_map - declare allowed key
  // Return: true
  // Exception: N/A
  //
  configModule = function(input_map) {
    spa.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
    return true;
  };
  // end public method /configMap/
  
  // begin public method /initModule/
  // Purpose: initialize module
  // Arguments:
  //   * $container - jQuery element utilized in this func
  // Return: true
  // Exception: N/A
  //
  initModule = function($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };
  // end public method /initModule/
  //
  // return public methods
  return {
    configModule: configModule,
    initModule: initModule
  };
  // END public methods
}());

