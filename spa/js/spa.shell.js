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
  //-----------------BEGIN modulescope variables---------------
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
        + '<div class="spa-shell-modal"></div>',
      chat_extend_time     : 1000,
      chat_retract_time    : 300,
      chat_extend_height   : 450,
      chat_retract_height  : 15,
      chat_extended_title  : 'Click to retract',
      chat_retracted_title : 'Click to extend'
    },
    stateMap = {
      $container        : null,
      is_chat_retracted : true
    },
    jqueryMap = {},

    setJqueryMap, toggleChat, onClickChat, initModule;
  // ------------------END module scope variables-------------
  // BEGIN utility methods
  // END utility methods
  // BEGIN DOM methods
  // BEGIN DOM method/setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container : $container,
      $chat      : $container.find( '.spa-shell-chat' )
    };
  };
  // END DOM method/setJqueryMap/
  
  // BEGIN DOM method/toggleChat/
  // Purpose: retract and extend chatslider
  // Arguments:
  //   * do_extend - If true, extend slider. Otherwise, retract slider.
  //   * callback - (OPTIONAL)Functions which is invoked at the last of animation
  // Options:
  //   * chat_extend_time, chat_retract_time
  //   * chat_extend_height, chat_retract_height
  // Return: boolean
  //   * true - slider animation is started
  //   * false - slider animation is not started
  // Condition: set stateMap.is_chat_retracted
  //   * true - slider is retracted
  //   * false - slider is extended
  //
  toggleChat = function( do_extend, callback ) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = !is_open && !is_closed;

    // avoid conflict
    if ( is_sliding ){ return false; }

    // begin to extend chatslider
    if ( do_extend ) {
      jqueryMap.$chat.animate(
        { height : configMap.chat_extend_height },
        configMap.chat_extend_time,
        function() {
          jqueryMap.$chat.attr(
            'title', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if ( callback ) { callback( jqueryMap.$chat ); }
        }
      );
      return true;
    }
    // end to extend chatslider

    // begin to retract chatslider
    jqueryMap.$chat.animate(
      { height : configMap.chat_retract_height },
      configMap.chat_retract_time,
      function() {
        jqueryMap.$chat.attr(
          'title', configMap.chat_retracted_title
        );
        stateMap.is_chat_retracted = true;
        if ( callback ) { callback( jqueryMap.$chat ); }
      }
    );
    return true;
    // end to retract chatslider
  };
  // END DOM method /toggleChat/
  // END DOM methods

  // BEGIN event handlers
  onClickChat = function(event) {
    toggleChat( stateMap.is_chat_retracted );
    return false;
  };
  // END event handlers

  // BEGIN public methods
  // BEGIN public method/initModule/
  initModule = function($container) {
    // load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    // initalize chatslider and bind clickHandler to it
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr( 'title', configMap.chat_retracted_title )
      .click( onClickChat );
  };
  // END public method/initModule
  return { initModule: initModule };
  // END public methods
}());
