/*
 * spa.shell.js
 * shell module of SPA
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,      maxerr : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true,     vars : false,
  white  : true
*/
/*global $, spa: true */

spa.shell = (function() {
  //-----------------start modulescope variables---------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-chat"></div>'
        + '<div class="spa-shell-modal"></div>'
    },
    stateMap = { $container : null },
    jqueryMap = {},

    setJqueryMap, initModule
  // ------------------end module scope variables-------------
  // start utility methods
  // end utility methods
  // start DOM methods
  // start DOM method/setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container
    jqueryMap = { $container : $container }
  }
  // end DOM method/setJqueryMap/
  // end DOM methods

  // start event handlers
  // end event handlers
  // start public methods
  // start public method/initModule/
  initModule = function($container) {
    stateMap.$container = $container
    $container.html( configMap.main_html )
    setJqueryMap()
  }
  // end public method/initModule
  return { initModule: initModule }
  // end public methods
}())
