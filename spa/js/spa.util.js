/*
 * spa.util.js
 * general JavaScript utility
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * These functions have been created, compiled, updated since 1998, inspired by web
 * 
 * MIT licence
 *
 */

/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, spa */

spa.util = (function() {
  var makeError, setConfigMap;

  // begin public constructor /makeError/
  // Purpose: convinience wrapper to create error obj
  // Arguments:
  //   * name_text - error name
  //   * msg_text - full error message
  //   * data - optional data atteched with error obj
  // Return: created error obj
  // Exception: N/A
  //
  makeError = function(name_text, meg_text, data) {
    var error = new Error();
    error.name = name_text;
    error.message = msg_text;

    if (data) { error.data = data; }

    return error;
  };
  // end public constructor /makeError/
  
  // begin public method /setConfigMap/
  // Purpose: common code to make construction at function module
  // Arguments:
  //   * input_map - structured key-value map
  //   * settable_map - structurable key's map
  //   * config_map - map applied structure
  // Return: true
  // Excpetion: throw when invalid key was given
  //
  setConfigMap = function(arg_map) {
    var
      input_map = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map = arg_map.config_map,
      key_name, error;

    for (key_name in input_map) {
      if (input_map.hasOwnProperty(key_name)) {
        if (settable_map.hasOwnProperty(key_name)) {
          config_map[key_name] = input_map[key_name]
        }
        else {
          error = makeError('Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };
  // end public method /setConfigMap/
  
  return {
    makeError: makeError,
    setConfigMap: setConfigMap
  };
}());

