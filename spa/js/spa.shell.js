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
      anchor_scheme_map : {
        chat : { open : true, closed : true }
      },
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
      anchor_map        : {},
      is_chat_retracted : true
    },
    jqueryMap = {},

    copyAnchorMap, setJqueryMap, toggleChat,
    changeAnchorPart, onHashChange,
    onClickChat, initModule;
  // ------------------END module scope variables-------------
  // BEGIN utility methods
  // return copy of the stored anchor_map. minimize the overhead.
  copyAnchorMap = function() {
    return $.extend( true, {}, stateMap.anchor_map );
  };
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

  // BEGIN DOM method /changeAnchorPart/
  // Purpose: change the portion of URI anchor element
  // Argmuents:
  //   * arg_map - a map represents the portion of URI anchor to be changed
  // Return: boolean
  //   * true - URI anchor is successfully updated
  //   * false - failed to update URI anchor
  // Details:
  //   store current anchor to stateMap.anchor_map
  //   the detail of encoding is refered in uriAnchor
  //   In this method,
  //     * create a copy of child map with copyAnchorMap()
  //     * fix keyValue with arg_map
  //     * manage the destinction of the dependent value and independent value of encoding
  //     * make modification of URI with uriAnchor
  //     * If it is success, return true. Otherwise, return false
  //
  changeAnchorPart = function( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep;

    // begin to integrate the modification to anchorMap
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {
        // skip dependent keys in roop
        if ( key_name.indexOf('_') === 0 ) { continue KEYVAL; }

        // update independent keys
        anchor_map_revise[key_name] = arg_map[key_name];

        // update matched independent keys
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
      // end to integrate changes to anchorMap
      
    // begin to update URI. If it is failed, back to origin
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // replace URI with previous state
      $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
      bool_return = false;
    }
    // end to update URI

    return bool_return;
  };
  // end DOM method /changeAnchorPart/
  // END DOM methods

  // BEGIN event handlers
  // BEGIN event handler /onHashChange/
  // Purpose: handle hashchange event
  // Arguments:
  //   * event - jQuery event object
  // Options: none
  // Returns: false
  // Details:
  //   * parse URI anchor elements
  //   * compare the provided application state with current state
  //   * If provided one doesn't match with current one,
  //     handle application
  //
  onHashChange = function( event ) {
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_chat_previous, _s_chat_proposed,
      s_chat_proposed;

    // try to parse anchor
    try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // utility variables
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // begin to handle chat components when anchor is changed
    if ( !anchor_map_previous
      || _s_chat_previous !== _s_chat_proposed
    ) {
      s_chat_proposed = anchor_map_proposed.chat;
      switch ( s_chat_proposed ) {
        case 'open' :
          toggleChat( true );
          break;
        case 'closed' :
          toggleChat( false );
          break;
        default :
          toggleChat( false );
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // end to handle chat components when anchor is changed

    return false;
  };
  // end event handler /onHashChange/

  // begin event handler /onClickChat/
  onClickChat = function(event) {
    changeAnchorPart({
      chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
    });
    return false;
  };
  // end event handler /onClickChat
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
    // set uriAnchor to use our scheme
    $.uriAnchor.configModule({
      schema_map : configMap.anchor_scheme_map
    });

    // construct and initilize functional module
    spa.chat.configModule({});
    spa.chat.initModule(jqueryMap.$chat);

    // handle URI anchor change event
    // This will be executed when all function modules have been set and initialized
    // Otherwise, it isn't ready to handle trigger event
    // trigger events guarantee that anchor is loaded
    //
    $(window)
      .bind( 'hashchange', onHashChange )
      .trigger( 'hashchange' );
  };
  // END public method/initModule
  return { initModule: initModule };
  // END public methods
}());
