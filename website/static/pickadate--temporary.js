(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.pickadate = factory());
}(this, function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".pickadate--element {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  box-sizing: border-box;\n}\n.pickadate--element:focus {\n  z-index: 1;\n}\ninput.pickadate--element,\nbutton.pickadate--element {\n  font: inherit;\n  color: inherit;\n}\n.pickadate--element[hidden] {\n  display: none;\n}\n\n.pickadate--root {\n  font-size: 16px;\n  font-weight: 300;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n\n  max-width: 23em;\n  min-width: 20em;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  background-color: #fff;\n}\n.pickadate--header,\n.pickadate--body,\n.pickadate--footer {\n  align-self: stretch;\n}\n.pickadate--header {\n  flex-direction: row;\n  align-items: center;\n  padding: 0.5em 0.5em 0;\n}\n.pickadate--body {\n  flex-grow: 1;\n  padding: 0 0.125em;\n}\n.pickadate--footer {\n  margin-top: 0.325em;\n}\n\n.pickadate--monthAndYear {\n  flex-grow: 1;\n  flex-direction: row;\n  font-size: 1.125em;\n}\n.pickadate--monthAndYear_month {\n  margin-left: 0.5em;\n  margin-right: 0.325em;\n  font-weight: 500;\n}\n.pickadate--monthAndYear_year {\n  color: #999;\n}\n\n.pickadate--button {\n  border: 0;\n  padding: 0;\n  justify-content: center;\n  align-items: center;\n}\n.pickadate--button__previous,\n.pickadate--button__today,\n.pickadate--button__next {\n  height: 2.5em;\n  width: 2.5em;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n.pickadate--button__previous svg,\n.pickadate--button__today svg,\n.pickadate--button__next svg {\n  height: 1.5em;\n}\n.pickadate--button__previous:hover svg,\n.pickadate--button__today:hover svg,\n.pickadate--button__next:hover svg,\n.pickadate--button__previous:active svg,\n.pickadate--button__today:active svg,\n.pickadate--button__next:active svg {\n  fill: #0089ec;\n}\n.pickadate--button__previous:focus,\n.pickadate--button__today:focus,\n.pickadate--button__next:focus {\n  outline: none;\n  border-color: #0089ec;\n}\n.pickadate--button__meridiem {\n  width: 3em;\n  border-radius: 4px;\n  border: 1px solid transparent;\n}\n.pickadate--button__meridiem:hover,\n.pickadate--button__meridiem:active {\n  background: #e5e5e5;\n}\n.pickadate--button__meridiem:focus {\n  border-color: #0089ec;\n  outline: none;\n}\n\n.pickadate--grid {\n  padding: 0;\n  margin: 0;\n  border: 1px solid transparent;\n  flex-grow: 1;\n  align-self: stretch;\n  align-items: stretch;\n}\n.pickadate--grid:focus {\n  outline: none;\n}\n.pickadate--grid_row {\n  flex-direction: row;\n  flex-grow: 1;\n  min-height: 2.25em;\n}\n.pickadate--grid_row__label {\n  flex-grow: 0;\n  min-height: 1.325em;\n}\n.pickadate--grid_label,\n.pickadate--grid_cell {\n  justify-content: center;\n  align-items: center;\n  align-self: stretch;\n  flex-grow: 1;\n  min-width: 2.25em;\n}\n.pickadate--grid_label {\n  align-self: flex-start;\n  font-size: 0.75em;\n  color: #999;\n  font-weight: 700;\n}\n.pickadate--grid_cell {\n  font-size: 1.125em;\n  font-weight: 400;\n}\n.pickadate--grid_cell div {\n  justify-content: center;\n  align-items: center;\n  width: 2.25em;\n  height: 2.25em;\n  border-radius: 50%;\n}\n.pickadate--grid_cell:hover div,\n.pickadate--grid:focus:not(:active)\n  .pickadate--grid_cell__highlighted:not(.pickadate--grid_cell__selected)\n  div,\n.pickadate--grid__focused:not(:active)\n  .pickadate--grid_cell__highlighted:not(.pickadate--grid_cell__selected)\n  div {\n  background: #b1dcfb;\n}\n.pickadate--grid_cell__today div {\n  border: 1px solid #e5e5e5;\n}\n.pickadate--grid_cell__today:hover:not(.pickadate--grid_cell__disabled) div,\n.pickadate--grid:focus\n  .pickadate--grid_cell__today.pickadate--grid_cell__highlighted:not(.pickadate--grid_cell__selected)\n  div,\n.pickadate--grid__focused\n  .pickadate--grid_cell__today.pickadate--grid_cell__highlighted:not(.pickadate--grid_cell__selected)\n  div,\n.pickadate--grid_cell__today.pickadate--grid_cell__selected div {\n  border-color: #0089ec;\n}\n.pickadate--grid_cell__today.pickadate--grid_cell__selected div:after {\n  content: ' ';\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  border: 1px solid #fff;\n  border-radius: 50%;\n}\n.pickadate--grid_cell__selected div,\n.pickadate--grid_cell__selected:hover div {\n  background: #0089ec;\n  color: #fff;\n  font-weight: 600;\n}\n.pickadate--grid_cell__disabled,\n.pickadate--grid_cell__outOfView {\n  opacity: 0.25;\n  transform: scale(0.8);\n}\n.pickadate--grid_cell__disabled div,\n.pickadate--grid_cell__disabled:hover div {\n  background: #b2b2b2;\n}\n\n.pickadate--time {\n  flex-direction: row;\n  align-items: stretch;\n  align-self: stretch;\n  justify-content: center;\n\n  border-top: 1px solid #e5e5e5;\n  margin: 0 17.5% 0.325em;\n  padding-top: 0.25em;\n\n  font-weight: 500;\n}\n.pickadate--time_unit {\n}\n.pickadate--time_unit__hours {\n  margin-right: 0.5em;\n}\n.pickadate--time_unit__minutes {\n  margin-right: 0.25em;\n}\n.pickadate--time_separator {\n  margin-right: 0.25em;\n  justify-content: center;\n  font-weight: bold;\n}\n.pickadate--time_counter {\n  position: absolute;\n  left: 2px;\n  opacity: 0;\n\n  border: 0;\n  border-radius: 4px;\n  padding: 0 4px;\n  height: calc(50% - 3px);\n  justify-content: center;\n}\n.pickadate--time_counter:hover {\n  background: #e5e5e5;\n}\n.pickadate--time_unit:hover .pickadate--time_counter {\n  opacity: 1;\n}\n.pickadate--time_counter__up {\n  top: 2px;\n}\n.pickadate--time_counter__down {\n  bottom: 2px;\n}\n.pickadate--time_counter svg {\n  height: 0.4375em;\n}\n.pickadate--time_input {\n  width: 4em;\n  height: 2.25em;\n  padding: 0 0.25em 0 1.5em;\n  border: 1px solid transparent;\n  border-radius: 6px;\n}\n.pickadate--time_input:focus {\n  border-color: #0089ec;\n  outline: none;\n}\n.pickadate--time_input:focus ~ .pickadate--time_counter {\n  z-index: 2;\n  opacity: 1;\n}\n\n/**\n * INPUT PICKER\n */\n\n.pickadate--input-root {\n  position: absolute;\n  z-index: 1;\n}\n.pickadate--input-root .pickadate--root {\n  max-height: 0;\n  overflow: hidden;\n  opacity: 0;\n  pointer-events: none;\n}\n.pickadate--input-root .pickadate--root__active {\n  max-height: none;\n  opacity: 1;\n  pointer-events: auto;\n}\n";
  styleInject(css);

  /////////////
  // STRINGS //
  /////////////
  var caseDash = function caseDash(string) {
    return string.split(/(?=[A-Z])/g).map(function (chunk) {
      return chunk.toLowerCase();
    }).join('-');
  }; /////////////
  // NUMBERS //
  /////////////

  var padZero = function padZero(number, digitsCount) {
    number = "".concat(number);
    var numberDigitsCount = number.length;
    var differenceInDigitsCount = digitsCount - numberDigitsCount;
    return differenceInDigitsCount > 0 ? '0'.repeat(differenceInDigitsCount) + number : number;
  }; /////////////
  // OBJECTS //
  /////////////

  var mergeUpdates = function mergeUpdates(defaults, updates) {
    var mergedObject = {};
    Object.keys(defaults).forEach(function (key) {
      var defaultValue = defaults[key];
      var updateValue = updates[key]; // If the values are the same, do nothing

      if (defaultValue === updateValue) {
        return;
      } // If both values are objects, recursively merge them


      if (defaultValue && updateValue && defaultValue.constructor === Object && updateValue.constructor === Object) {
        mergedObject[key] = mergeUpdates(defaultValue, updateValue);
        return;
      }

      mergedObject[key] = updates.hasOwnProperty(key) ? updateValue : defaultValue;
    });
    return mergedObject;
  };
  var copyDefinedValues = function copyDefinedValues(object) {
    return Object.keys(object).reduce(function (accumulator, key) {
      var value = object[key];

      if (value !== undefined) {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});
  }; ////////////
  // ARRAYS //
  ////////////

  var createRange = function createRange(fromIndex, toIndex) {
    var range = [];

    for (var index = fromIndex; index <= toIndex; index++) {
      range.push(index);
    }

    return range;
  };

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser = true;
  var env = {};
  var argv = [];
  var version = ''; // empty string to avoid regexp issues
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance$1 = global$1.performance || {};
  var performanceNow =
    performance$1.now        ||
    performance$1.mozNow     ||
    performance$1.msNow      ||
    performance$1.oNow       ||
    performance$1.webkitNow  ||
    function(){ return (new Date()).getTime() };

  // generate timestamp or delta
  // see http://nodejs.org/api/process.html#process_process_hrtime
  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance$1)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  // CHECKERS //
  //////////////

  var isSameDate = function isSameDate(one, two) {
    return one instanceof Date && two instanceof Date && isSameMonth(one, two) && one.getDate() === two.getDate();
  };
  var isSameMonth = function isSameMonth(one, two) {
    return one instanceof Date && two instanceof Date && isSameYear(one, two) && one.getMonth() === two.getMonth();
  };
  var isSameYear = function isSameYear(one, two) {
    return one instanceof Date && two instanceof Date && one.getFullYear() === two.getFullYear();
  };
  var isBeforeDate = function isBeforeDate(one, two) {
    return one instanceof Date && two instanceof Date && (one.getFullYear() < two.getFullYear() || isSameYear(one, two) && one.getMonth() < two.getMonth() || isSameMonth(one, two) && one.getDate() < two.getDate());
  };
  var isSameOrBeforeDate = function isSameOrBeforeDate(one, two) {
    return isSameDate(one, two) || isBeforeDate(one, two);
  }; ////////////
  // FORMAT //
  ////////////

  /**
   * A mapping of template hooks to formatters.
   */

  var HOOK_FORMATTER = {
    D: function D(dateObject) {
      return "".concat(dateObject.getDate());
    },
    DD: function DD(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.D(dateObject), 2));
    },
    DDD: function DDD(dateObject, words) {
      return words[dateObject.getDay()];
    },
    DDDD: function DDDD(dateObject, words) {
      return words[dateObject.getDay()];
    },
    M: function M(dateObject) {
      return "".concat(dateObject.getMonth() + 1);
    },
    MM: function MM(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.M(dateObject), 2));
    },
    MMM: function MMM(dateObject, words) {
      return words[dateObject.getMonth()];
    },
    MMMM: function MMMM(dateObject, words) {
      return words[dateObject.getMonth()];
    },
    YYYY: function YYYY(dateObject) {
      return "".concat(dateObject.getFullYear());
    },
    H: function H(dateObject) {
      return "".concat(dateObject.getHours());
    },
    HH: function HH(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.H(dateObject), 2));
    },
    h: function h(dateObject) {
      return "".concat(dateObject.getHours() % 12 || 12);
    },
    hh: function hh(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.h(dateObject), 2));
    },
    m: function m(dateObject) {
      return "".concat(dateObject.getMinutes());
    },
    mm: function mm(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.m(dateObject), 2));
    },
    a: function a(dateObject) {
      return dateObject.getHours() < 12 ? 'a.m.' : 'p.m.';
    },
    A: function A(dateObject) {
      return dateObject.getHours() < 12 ? 'AM' : 'PM';
    },
    s: function s(dateObject) {
      return "".concat(dateObject.getSeconds());
    },
    ss: function ss(dateObject) {
      return "".concat(padZero(HOOK_FORMATTER.s(dateObject), 2));
    },
    x: function x(dateObject) {
      return "".concat(dateObject.getTime());
    }
  };

  var getStartingDigits = function getStartingDigits(string) {
    return string.replace(/(^\d*)(.*)/, '$1');
  };

  var getStartingWord = function getStartingWord(string) {
    return string.replace(/(^\w*)(.*)/, '$1');
  };

  var getStartingLowerCaseMeridiem = function getStartingLowerCaseMeridiem(string) {
    return string.replace(/(^[ap]\.m\.)?(.*)/, '$1');
  };

  var getStartingUpperCaseMeridiem = function getStartingUpperCaseMeridiem(string) {
    return string.replace(/(^[AP]M)?(.*)/, '$1');
  };
  /**
   * A mapping of template hooks to parsers.
   */


  var HOOK_PARSER = {
    D: getStartingDigits,
    DD: getStartingDigits,
    DDD: getStartingWord,
    DDDD: getStartingWord,
    M: getStartingDigits,
    MM: getStartingDigits,
    MMM: getStartingWord,
    MMMM: getStartingWord,
    YYYY: getStartingDigits,
    H: getStartingDigits,
    HH: getStartingDigits,
    h: getStartingDigits,
    hh: getStartingDigits,
    m: getStartingDigits,
    mm: getStartingDigits,
    a: getStartingLowerCaseMeridiem,
    A: getStartingUpperCaseMeridiem,
    s: getStartingDigits,
    ss: getStartingDigits,
    x: getStartingDigits
  };

  if (process.env.NODE_ENV !== 'production') {
    var extraFormatterKeys = Object.keys(HOOK_FORMATTER).filter(function (key) {
      return !HOOK_PARSER[key];
    });
    console.assert(!extraFormatterKeys.length, 'Missing keys to parse with', extraFormatterKeys);
    var extraParserKeys = Object.keys(HOOK_PARSER).filter(function (key) {
      return !HOOK_FORMATTER[key];
    });
    console.assert(!extraParserKeys.length, 'Missing keys to format with', extraParserKeys);
  }
  /**
   * A collection of the template hooks.
   */


  var HOOKS = Object.keys(HOOK_FORMATTER);
  /**
   * A regular expression that matches all segments of a template string.
   */

  var HOOKS_REGEXP = new RegExp([// Match any characters escaped with square brackets
  '(\\[.*?\\])', // Match any template hooks
  "(?:\\b(".concat(HOOKS.join('|'), ")\\b)"), // Match all other characters
  '(.)'].join('|'), 'g');
  var format = function format(dateObject, template, templateHookWords) {
    return (// Match hooks within the template
      matchHooks(template) // Map through the matches while formatting template hooks
      // and removing the hooks of escaped characters
      .map(function (match) {
        if (match.index === 2) {
          var formatter = HOOK_FORMATTER[match.chunk];
          return formatter(dateObject, templateHookWords[match.chunk]);
        }

        if (match.index === 1) {
          return match.chunk.replace(/^\[(.*)]$/, '$1');
        }

        return match.chunk;
      }) // Join the chunks together into a string
      .join('')
    );
  };

  var matchHooks = function matchHooks(template) {
    return template // Split the template using the regular expression
    .split(HOOKS_REGEXP) // Map the chunks to keep a reference of their match group index
    .map(function (chunk, index) {
      return {
        chunk: chunk,
        index: index % 4
      };
    }) // Filter out false-y chunks
    .filter(function (match) {
      return !!match.chunk;
    });
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var DAYS_IN_WEEK = 7;
  /**
   * Gets the weekday labels.
   */

  var getWeekdayLabels = function getWeekdayLabels(weekdays, firstDayOfWeek) {
    return weekdays.map(function (_, dayIndex) {
      return weekdays[(dayIndex + firstDayOfWeek) % DAYS_IN_WEEK];
    });
  };
  /**
   * Gets the dates in weeks.
   */

  var getDatesInWeeks = function getDatesInWeeks(originDateObject, firstDayOfWeek) {
    var year = originDateObject.getFullYear();
    var month = originDateObject.getMonth();
    var monthOfLastDayInFirstWeek = getMonthOfLastDayInFirstWeek(year, month);
    var shift = monthOfLastDayInFirstWeek === month ? 0 : 1;
    var start = 0 + shift;
    var end = 5 + shift;
    return createRange(start, end).map(function (weekIndex) {
      return getDatesInWeek(year, month, weekIndex, firstDayOfWeek);
    });
  };
  /**
   * Gets the dates in a week.
   */

  var getDatesInWeek = function getDatesInWeek(year, month, weekIndex, firstDayOfWeek) {
    var startDayOfMonth = getStartDayOfMonth(year, month);
    var startDayOfWeek = weekIndex * DAYS_IN_WEEK;
    var start = 1;
    var end = 7;
    return createRange(start, end).map(function (date) {
      return new Date(year, month, date + startDayOfWeek - startDayOfMonth + firstDayOfWeek);
    });
  };
  /**
   * Gets the month of the last day in the first week of a month.
   */

  var getMonthOfLastDayInFirstWeek = function getMonthOfLastDayInFirstWeek(year, month) {
    var startDayOfMonth = getStartDayOfMonth(year, month);
    return new Date(year, month, DAYS_IN_WEEK - startDayOfMonth).getMonth();
  };
  /**
   * Gets the start day of a month.
   */

  var getStartDayOfMonth = function getStartDayOfMonth(year, month) {
    var startDateOfMonth = new Date(year, month, 1);
    return startDateOfMonth.getDay();
  };
  /**
   * Gets the start date of a month, give a date.
   */

  var getStartDateOfMonth = function getStartDateOfMonth(dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth();
    return new Date(year, month, 1);
  };

  var isDateDisabled = function isDateDisabled(dateState, dateObject) {
    var minimum = dateState.minimum,
        maximum = dateState.maximum,
        disabled = dateState.disabled;
    return isBeforeDate(dateObject, minimum) || isBeforeDate(maximum, dateObject) || disabled.some(function (value) {
      if (typeof value === 'number') {
        return dateObject.getDay() === value;
      }

      if (value instanceof Date) {
        return isSameDate(dateObject, value);
      }

      if (Array.isArray(value)) {
        var _value = _slicedToArray(value, 2),
            fromDate = _value[0],
            toDate = _value[1];

        return isSameOrBeforeDate(fromDate, dateObject) && isSameOrBeforeDate(dateObject, toDate);
      }
    });
  };

  var KEY_CODE = {
    BACKSPACE: 8,
    ENTER: 13,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };
  var ARROW_KEY_CODES = Object.values(KEY_CODE);

  var createOnKeyDownCalendar = function createOnKeyDownCalendar(dateStore) {
    return function onKeyDownCalendar(event) {
      if (event.keyCode === KEY_CODE.BACKSPACE) {
        event.preventDefault();
        dateStore.clear();
      } else if (event.keyCode === KEY_CODE.ENTER || event.keyCode === KEY_CODE.SPACE) {
        event.preventDefault();
        dateStore.setSelected({
          value: dateStore.getState().highlighted
        });
      } else if (ARROW_KEY_CODES.includes(event.keyCode)) {
        event.preventDefault();
        dateStore.setHighlighted({
          keyCode: event.keyCode
        });
      }
    };
  };

  var EVENT_NAME = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CHANGE: 'change',
    GRID: {
      REMOTE_ACTIVE: 'grid.remote-active',
      REMOTE_INACTIVE: 'grid.remote-inactive'
    }
  };

  var chevronRight = "<svg viewBox=\"0 0 32 54\"><path d=\"M7 51.02l24.04-24.01L7 3 2 7.989 21.04 27.01 2 46.03z\"/></svg>";

  var chevronLeft = "<svg viewBox=\"0 0 32 54\"><path d=\"M25.04 3L1 27.01l24.04 24.01 5-4.989L11 27.01 30.04 7.99z\"/></svg>";

  var chevronUp = "<svg viewBox=\"0 0 54 32\"><path d=\"M50.53 25.53L26.52 1.49 2.51 25.53l4.989 5L26.52 11.49l19.02 19.04z\"/></svg>";

  var chevronDown = "<svg viewBox=\"0 0 54 32\"><path d=\"M2.51 7.49l24.01 24.04L50.53 7.49l-4.989-5L26.52 21.53 7.5 2.49z\"/></svg>";

  var bullsEye = "<svg viewBox=\"0 0 54 54\"><path d=\"M27 46C16.51 46 8 37.49 8 27S16.51 8 27 8s19 8.51 19 19-8.51 19-19 19m0-45C12.64 1 1 12.64 1 27s11.64 26 26 26 26-11.64 26-26S41.36 1 27 1\"/><path d=\"M31 27c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4\"/></svg>";

  // LAYOUTS //
  /////////////

  var createLayout = function createLayout(createElement) {
    return function (initialize) {
      return function () {
        for (var _len = arguments.length, childLayouts = new Array(_len), _key = 0; _key < _len; _key++) {
          childLayouts[_key] = arguments[_key];
        }

        return function (picker, inputElement) {
          var element = createElement(picker);
          initialize(element, picker, inputElement);
          var children = childLayouts.map(function (layout) {
            return layout(picker, inputElement);
          });
          appendChildren(element, children);
          return element;
        };
      };
    };
  };

  var createBoxLayout = createLayout(function () {
    return createDocumentElement({
      tagName: 'div'
    });
  });
  var createButtonLayout = createLayout(function (picker) {
    var buttonElement = createDocumentElement({
      tagName: 'button'
    });
    picker.addEventListener(EVENT_NAME.ACTIVE, function () {
      buttonElement.disabled = false;
    });
    picker.addEventListener(EVENT_NAME.INACTIVE, function () {
      buttonElement.disabled = true;
    });
    return buttonElement;
  }); ////////////////
  // COMPONENTS //
  ////////////////

  var createInputRootBox = createBoxLayout(function (element, picker, inputElement) {
    if (!(inputElement instanceof HTMLInputElement)) {
      throw new Error('Cannot initialize an input root without the input element');
    }

    initializeInput(inputElement, picker);
    element.className = picker.getConfig().className.inputRoot;
    element.addEventListener('focusin', function (event) {
      return event.stopPropagation();
    });
    element.addEventListener('click', function (event) {
      return event.stopPropagation();
    });
    element.addEventListener('mousedown', function (event) {
      var target = event.target;

      if (target instanceof HTMLInputElement || target instanceof HTMLButtonElement) {
        return;
      }

      event.preventDefault();
    });
  });
  var createRootBox = createBoxLayout(function (element, picker) {
    picker.addEventListener(EVENT_NAME.ACTIVE, function () {
      element.classList.add(picker.getConfig().className.root__active);
    });
    picker.addEventListener(EVENT_NAME.INACTIVE, function () {
      element.classList.remove(picker.getConfig().className.root__active);
    });
    addAttributes(element, {
      className: picker.getConfig().className.root
    });
  });
  var createHeaderBox = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.header
    });
  });
  var createBodyBox = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.body
    });
  });
  var createFooterBox = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.footer
    });
  });
  var createTimeBox = createBoxLayout(function (element, picker) {
    // $FlowFixMe
    var state = picker.store.getState();
    addAttributes(element, {
      className: picker.getConfig().className.time,
      hidden: !state.selected
    });
    picker.store.subscribe(function () {
      var state = picker.store.getState();
      element.hidden = !state.selected;
    });
  });
  var createMonthAndYearBox = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.monthAndYear
    });

    var render = function render() {
      var state = picker.store.getState();
      element.innerHTML = '';
      appendChildren(element, [createDocumentElement({
        children: picker.getConfig().templateHookWords.MMMM[state.view.getMonth()],
        className: picker.getConfig().className.monthAndYear_month
      }), createDocumentElement({
        children: state.view.getFullYear(),
        className: picker.getConfig().className.monthAndYear_year
      })]);
    };

    render();
    picker.store.subscribe(render);
  });
  var createPreviousButton = createButtonLayout(function (element, picker) {
    var onMouseDown = function onMouseDown(event) {
      return event.preventDefault();
    };

    var onClick = function onClick() {
      return picker.store.viewPrevious();
    };

    addAttributes(element, {
      className: picker.getConfig().className.button_previous,
      onMouseDown: onMouseDown,
      onClick: onClick
    });
    element.innerHTML = chevronLeft;
  });
  var createTodayButton = createButtonLayout(function (element, picker) {
    var onMouseDown = function onMouseDown(event) {
      return event.preventDefault();
    };

    var onClick = function onClick() {
      return picker.store.viewToday();
    };

    addAttributes(element, {
      className: picker.getConfig().className.button_today,
      onMouseDown: onMouseDown,
      onClick: onClick
    });
    element.innerHTML = bullsEye;
  });
  var createNextButton = createButtonLayout(function (element, picker) {
    var onMouseDown = function onMouseDown(event) {
      return event.preventDefault();
    };

    var onClick = function onClick() {
      return picker.store.viewNext();
    };

    addAttributes(element, {
      className: picker.getConfig().className.button_next,
      onMouseDown: onMouseDown,
      onClick: onClick
    });
    element.innerHTML = chevronRight;
  });
  var createGridButton = createButtonLayout(function (element, picker) {
    picker.addEventListener(EVENT_NAME.GRID.REMOTE_ACTIVE, function () {
      element.classList.add(picker.getConfig().className.grid__focused);
    });
    picker.addEventListener(EVENT_NAME.GRID.REMOTE_INACTIVE, function () {
      element.classList.remove(picker.getConfig().className.grid__focused);
    });

    var onClick = function onClick(event) {
      var value = getValueFromMouseEvent(event);

      if (!value) {
        return;
      }

      picker.store.setSelected({
        value: value
      });
    };

    addAttributes(element, {
      className: picker.getConfig().className.grid,
      onClick: onClick,
      onMouseUp: onClick,
      onKeyDown: createOnKeyDownCalendar(picker.store)
    });

    var render = function render() {
      element.innerHTML = '';
      appendChildren(element, createGridCellElements(picker.getConfig(), picker.store.getState()));
    };

    render();
    picker.store.subscribe(render);
  });
  var createMeridiemButton = createButtonLayout(function (element, picker) {
    var onMouseDown = function onMouseDown(event) {
      return event.preventDefault();
    };

    var onClick = function onClick() {
      return picker.store.cycleMeridiem();
    };

    addAttributes(element, {
      className: picker.getConfig().className.button_meridiem,
      onMouseDown: onMouseDown,
      onClick: onClick
    });

    var updateButton = function updateButton() {
      var _picker$store$getStat = picker.store.getState(),
          selected = _picker$store$getStat.selected;

      element.innerHTML = '';
      appendChildren(element, selected ? selected.getHours() < 12 ? 'AM' : 'PM' : 'AM');
      element.tabIndex = selected ? 0 : -1;
    };

    updateButton();
    picker.store.subscribe(updateButton);
  });
  var createHourInput = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.time_hours
    });

    var cycleUp = function cycleUp() {
      return picker.store.cycleHourUp();
    };

    var cycleDown = function cycleDown() {
      return picker.store.cycleHourDown();
    };

    var hourInput = createTimeInputElement(picker.getConfig(), {
      className: picker.getConfig().className.time_input__hours,
      onKeyCodeUp: cycleUp,
      onKeyCodeDown: cycleDown
    });

    var updateHourInput = function updateHourInput() {
      var state = picker.store.getState();
      var hours = state.selected ? padZero(state.selected.getHours() % 12 || 12, 2) : '';
      hourInput.value = hours;
      hourInput.tabIndex = state.selected ? 0 : -1;
    };

    updateHourInput();
    picker.store.subscribe(updateHourInput);
    appendChildren(element, [hourInput].concat(_toConsumableArray(createTimeCounterElements(picker.getConfig(), {
      onClickUp: cycleUp,
      onClickDown: cycleDown
    }))));
  });
  var createMinuteInput = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.time_minutes
    });

    var cycleUp = function cycleUp() {
      return picker.store.cycleMinuteUp();
    };

    var cycleDown = function cycleDown() {
      return picker.store.cycleMinuteDown();
    };

    var minuteInput = createTimeInputElement(picker.getConfig(), {
      className: picker.getConfig().className.time_input__minutes,
      onKeyCodeUp: cycleUp,
      onKeyCodeDown: cycleDown
    });

    var updateMinuteInput = function updateMinuteInput() {
      var state = picker.store.getState();
      var minutes = state.selected ? padZero(state.selected.getMinutes(), 2) : '';
      minuteInput.value = minutes;
      minuteInput.tabIndex = state.selected ? 0 : -1;
    };

    updateMinuteInput();
    picker.store.subscribe(updateMinuteInput);
    appendChildren(element, [minuteInput].concat(_toConsumableArray(createTimeCounterElements(picker.getConfig(), {
      onClickUp: cycleUp,
      onClickDown: cycleDown
    }))));
  });
  var createTimeSeparator = createBoxLayout(function (element, picker) {
    addAttributes(element, {
      className: picker.getConfig().className.time_separator
    });
    element.innerHTML = ':';
  }); //////////////
  // ELEMENTS //
  //////////////

  var createGridCellElements = function createGridCellElements(config, dateState) {
    var datesInWeeks = getDatesInWeeks(dateState.view, dateState.firstDayOfWeek);
    var elements = datesInWeeks.map(function (datesInWeek) {
      return createDocumentElement({
        className: config.className.grid_row,
        children: datesInWeek.map(function (dateObject) {
          return createGridCellElement(config, dateState, dateObject);
        })
      });
    });
    elements.unshift(createDocumentElement({
      className: flattenClassNames([config.className.grid_row, config.className.grid_row__label]),
      children: getWeekdayLabels(config.weekdays, dateState.firstDayOfWeek).map(function (weekday) {
        return createDocumentElement({
          className: config.className.grid_label,
          children: weekday
        });
      })
    }));
    return elements;
  };

  var createGridCellElement = function createGridCellElement(config, dateState, dateObject) {
    var _ref;

    var isToday = isSameDate(new Date(), dateObject);
    var isSelected = isSameDate(dateState.selected, dateObject);
    var isHighlighted = isSameDate(dateState.highlighted, dateObject);
    var isSameMonth$$1 = isSameMonth(dateState.view, dateObject);
    var isDisabled = isDateDisabled(dateState, dateObject);
    return createDocumentElement({
      className: flattenClassNames([config.className.grid_cell, (_ref = {}, _defineProperty(_ref, config.className.grid_cell__today, isToday), _defineProperty(_ref, config.className.grid_cell__highlighted, isHighlighted), _defineProperty(_ref, config.className.grid_cell__selected, isSelected), _defineProperty(_ref, config.className.grid_cell__outOfView, !isSameMonth$$1), _defineProperty(_ref, config.className.grid_cell__disabled, isDisabled), _ref)]),
      attributes: {
        dataset: isDisabled ? undefined : {
          value: dateObject.getTime()
        }
      },
      children: createDocumentElement({
        children: dateObject.getDate()
      })
    });
  };

  var createTimeInputElement = function createTimeInputElement(config, _ref2) {
    var className = _ref2.className,
        onKeyCodeUp = _ref2.onKeyCodeUp,
        onKeyCodeDown = _ref2.onKeyCodeDown;

    var onKeyDown = function onKeyDown(event) {
      if (event.keyCode === KEY_CODE.UP) {
        event.preventDefault();
        onKeyCodeUp();
      } else if (event.keyCode === KEY_CODE.DOWN) {
        event.preventDefault();
        onKeyCodeDown();
      }
    };

    var onFocus = function onFocus() {
      return inputElement.setSelectionRange(0, 0);
    };

    var inputElement = createDocumentElement({
      tagName: 'input',
      className: [config.className.time_input, className],
      attributes: {
        onKeyDown: onKeyDown,
        onFocus: onFocus,
        readOnly: true
      }
    });
    return inputElement;
  };

  var createTimeCounterElements = function createTimeCounterElements(config, _ref3) {
    var onClickUp = _ref3.onClickUp,
        onClickDown = _ref3.onClickDown;

    var onMouseDown = function onMouseDown(event) {
      return event.preventDefault();
    };

    var upElement = createDocumentElement({
      tagName: 'button',
      className: [config.className.time_counter, config.className.time_counter__up],
      attributes: {
        tabIndex: -1,
        onMouseDown: onMouseDown,
        onClick: onClickUp
      }
    });
    upElement.innerHTML = chevronUp;
    var downElement = createDocumentElement({
      tagName: 'button',
      className: [config.className.time_counter, config.className.time_counter__down],
      attributes: {
        tabIndex: -1,
        onMouseDown: onMouseDown,
        onClick: onClickDown
      }
    });
    downElement.innerHTML = chevronDown;
    return [upElement, downElement];
  }; //////////////////
  // INITIALIZERS //
  //////////////////


  var initializeInput = function initializeInput(inputElement, picker) {
    inputElement.readOnly = true;
    inputElement.addEventListener('focus', function () {
      picker.triggerEvent(EVENT_NAME.ACTIVE);
      picker.triggerEvent(EVENT_NAME.GRID.REMOTE_ACTIVE);
    });
    inputElement.addEventListener('blur', function () {
      picker.triggerEvent(EVENT_NAME.GRID.REMOTE_INACTIVE);
    });
    inputElement.addEventListener('keydown', createOnKeyDownCalendar(picker.store));

    var onDocumentEvent = function onDocumentEvent(event) {
      if (event.target !== inputElement && // $FlowFixMe: In Chrome 62+, password auto-fill simulates focusin
      !event.isSimulated && // In Firefox, a click on an `option` element bubbles up directly
      // to the document.
      event.target !== document && // In Firefox stopPropagation() doesn’t prevent right-click events
      // from bubbling. So make sure the event wasn’t a right-click.
      // $FlowFixMe
      event.which !== 3) {
        picker.triggerEvent(EVENT_NAME.INACTIVE);
      }
    };

    document.addEventListener('focusin', onDocumentEvent);
    document.addEventListener('click', onDocumentEvent);
    picker.triggerEvent(EVENT_NAME.INACTIVE);
    picker.subscribeToValue(function (formattedValue) {
      if (formattedValue === inputElement.value) {
        return;
      }

      inputElement.value = formattedValue;
      var event = new CustomEvent('change');
      inputElement.dispatchEvent(event);
    });
  }; /////////////
  // HELPERS //
  /////////////


  var createDocumentElement = function createDocumentElement(_ref4) {
    var _ref4$tagName = _ref4.tagName,
        tagName = _ref4$tagName === void 0 ? 'div' : _ref4$tagName,
        className = _ref4.className,
        attributes = _ref4.attributes,
        children = _ref4.children;
    var element = document.createElement(tagName);
    addAttributes(element, _objectSpread({}, attributes, {
      className: flattenClassNames(['pickadate--element', className])
    }));
    appendChildren(element, children);
    return element;
  };

  var appendChildren = function appendChildren(element, children) {
    if (children == null) {
      return;
    }

    children = Array.isArray(children) ? children : [children];
    children.forEach(function (child) {
      if (!(child instanceof Node)) {
        child = typeof child !== 'string' ? child.toString() : child;
        child = document.createTextNode(child);
      }

      element.appendChild(child);
    });
  };

  var addAttributes = function addAttributes(element, attributes) {
    if (!attributes) {
      return;
    }

    Object.keys(attributes).forEach(function (attributeName) {
      // $FlowFixMe
      var attributeValue = attributes[attributeName];

      if (attributeValue == null) {
        return;
      }

      if (typeof attributeValue === 'function') {
        element.addEventListener(attributeName.replace(/^on/, '').toLowerCase(), attributeValue);
        return;
      }

      if (attributeName === 'className') {
        addClassName(element, attributeValue);
        return;
      }

      if (attributeName === 'dataset') {
        // $FlowFixMe
        Object.keys(attributeValue).forEach(function (datasetName) {
          var fullDatasetName = "data-".concat(caseDash(datasetName));
          element.setAttribute(fullDatasetName, attributeValue[datasetName]);
        });
        return;
      } // $FlowFixMe


      element[attributeName] = attributeValue;
    });
  };

  var addClassName = function addClassName(element, className) {
    if (!className) {
      return;
    }

    var list = Array.isArray(className) ? className : [className];
    list.forEach(function (item) {
      if (!item) {
        return;
      }

      if (typeof item === 'string') {
        item = _defineProperty({}, item, true);
      }

      if (Array.isArray(item)) {
        item.forEach(function (className) {
          if (className && typeof className === 'string') {
            element.classList.add(className);
          }
        });
        return;
      }

      Object.keys(item).forEach(function (className) {
        // $FlowFixMe
        if (className && typeof className === 'string' && item[className]) {
          element.classList.add(className);
        }
      });
    });
  };

  var flattenClassNames = function flattenClassNames(classNames) {
    return classNames.reduce(function (accumulator, className) {
      if (!className) {
        return accumulator;
      }

      if (Array.isArray(className)) {
        className.forEach(function (className) {
          if (typeof className === 'string') {
            accumulator[className] = true;
          }
        });
      } else if (typeof className === 'string') {
        accumulator[className] = true;
      } else if (className.constructor === Object) {
        accumulator = _objectSpread({}, accumulator, className);
      }

      return accumulator;
    }, {});
  }; ///////////////////
  // EVENT HELPERS //
  ///////////////////


  var getValueFromMouseEvent = function getValueFromMouseEvent(event) {
    var eventPath = getEventPath(event);
    var value = getValueFromMouseEventPath(eventPath, event.currentTarget);

    if (value == null) {
      return;
    }

    value = parseInt(value, 10);

    if (!Number.isFinite(value)) {
      console.error('Unable to get value from mouse event %o', event);
      return;
    }

    return value;
  };

  var getValueFromMouseEventPath = function getValueFromMouseEventPath(path, rootNode) {
    for (var i = 0; i < path.length; i += 1) {
      var node = path[i];

      if (node === rootNode) {
        return;
      } // $FlowFixMe


      var value = node.dataset.value;

      if (value != null) {
        return value;
      }
    }
  };

  var getEventPath = function getEventPath(event) {
    // $FlowFixMe
    if (event.path) {
      return event.path;
    }

    var path = [];
    var target = event.target; // $FlowFixMe

    while (target.parentNode) {
      path.push(target); // $FlowFixMe

      target = target.parentNode;
    }

    path.push(document, window);
    return path;
  };

  var TEMPLATE_HOOK_WORDS = {
    MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    MMMM: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    DDD: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    DDDD: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };
  var DATE_PICKER_CONFIG = {
    template: 'DDD, MMMM DD, YYYY @ h:mm a',
    templateHookWords: TEMPLATE_HOOK_WORDS,
    weekdays: TEMPLATE_HOOK_WORDS.DDD,
    className: {
      inputRoot: 'pickadate--input-root',
      root: 'pickadate--root',
      root__active: 'pickadate--root__active',
      header: 'pickadate--header',
      body: 'pickadate--body',
      footer: 'pickadate--footer',
      monthAndYear: 'pickadate--monthAndYear',
      monthAndYear_month: 'pickadate--monthAndYear_month',
      monthAndYear_year: 'pickadate--monthAndYear_year',
      grid: 'pickadate--grid',
      grid__focused: 'pickadate--grid__focused',
      grid_row: 'pickadate--grid_row',
      grid_row__label: 'pickadate--grid_row__label',
      grid_label: 'pickadate--grid_label',
      grid_cell: 'pickadate--grid_cell',
      grid_cell__today: 'pickadate--grid_cell__today',
      grid_cell__highlighted: 'pickadate--grid_cell__highlighted',
      grid_cell__selected: 'pickadate--grid_cell__selected',
      grid_cell__outOfView: 'pickadate--grid_cell__outOfView',
      grid_cell__disabled: 'pickadate--grid_cell__disabled',
      button_previous: ['pickadate--button', 'pickadate--button__previous'],
      button_today: ['pickadate--button', 'pickadate--button__today'],
      button_next: ['pickadate--button', 'pickadate--button__next'],
      button_clear: ['pickadate--button', 'pickadate--button__clear'],
      button_meridiem: ['pickadate--button', 'pickadate--button__meridiem'],
      time: 'pickadate--time',
      time_hours: ['pickadate--time_unit', 'pickadate--time_unit__hours'],
      time_minutes: ['pickadate--time_unit', 'pickadate--time_unit__minutes'],
      time_separator: 'pickadate--time_separator',
      time_input: 'pickadate--time_input',
      time_input__hours: 'pickadate--time_input__hours',
      time_input__minutes: 'pickadate--time_input__minutes',
      time_counter: 'pickadate--time_counter',
      time_counter__up: 'pickadate--time_counter__up',
      time_counter__down: 'pickadate--time_counter__down'
    }
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var performanceNow$1 = createCommonjsModule(function (module) {
  // Generated by CoffeeScript 1.12.2
  (function() {
    var getNanoSeconds, hrtime$$1, loadTime, moduleLoadTime, nodeLoadTime, upTime;

    if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
      module.exports = function() {
        return performance.now();
      };
    } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
      module.exports = function() {
        return (getNanoSeconds() - nodeLoadTime) / 1e6;
      };
      hrtime$$1 = process.hrtime;
      getNanoSeconds = function() {
        var hr;
        hr = hrtime$$1();
        return hr[0] * 1e9 + hr[1];
      };
      moduleLoadTime = getNanoSeconds();
      upTime = process.uptime() * 1e9;
      nodeLoadTime = moduleLoadTime - upTime;
    } else if (Date.now) {
      module.exports = function() {
        return Date.now() - loadTime;
      };
      loadTime = Date.now();
    } else {
      module.exports = function() {
        return new Date().getTime() - loadTime;
      };
      loadTime = new Date().getTime();
    }

  }).call(commonjsGlobal);


  });

  var root = typeof window === 'undefined' ? commonjsGlobal : window
    , vendors = ['moz', 'webkit']
    , suffix = 'AnimationFrame'
    , raf = root['request' + suffix]
    , caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

  for(var i = 0; !raf && i < vendors.length; i++) {
    raf = root[vendors[i] + 'Request' + suffix];
    caf = root[vendors[i] + 'Cancel' + suffix]
        || root[vendors[i] + 'CancelRequest' + suffix];
  }

  // Some versions of FF have rAF but not cAF
  if(!raf || !caf) {
    var last = 0
      , id$1 = 0
      , queue$1 = []
      , frameDuration = 1000 / 60;

    raf = function(callback) {
      if(queue$1.length === 0) {
        var _now = performanceNow$1()
          , next = Math.max(0, frameDuration - (_now - last));
        last = next + _now;
        setTimeout(function() {
          var cp = queue$1.slice(0);
          // Clear queue here to prevent
          // callbacks from appending listeners
          // to the current frame's queue
          queue$1.length = 0;
          for(var i = 0; i < cp.length; i++) {
            if(!cp[i].cancelled) {
              try{
                cp[i].callback(last);
              } catch(e) {
                setTimeout(function() { throw e }, 0);
              }
            }
          }
        }, Math.round(next));
      }
      queue$1.push({
        handle: ++id$1,
        callback: callback,
        cancelled: false
      });
      return id$1
    };

    caf = function(handle) {
      for(var i = 0; i < queue$1.length; i++) {
        if(queue$1[i].handle === handle) {
          queue$1[i].cancelled = true;
        }
      }
    };
  }

  var raf_1 = function(fn) {
    // Wrap in a new function to prevent
    // `cancel` potentially being assigned
    // to the native rAF function
    return raf.call(root, fn)
  };
  var cancel = function() {
    caf.apply(root, arguments);
  };
  var polyfill = function(object) {
    if (!object) {
      object = root;
    }
    object.requestAnimationFrame = raf;
    object.cancelAnimationFrame = caf;
  };
  raf_1.cancel = cancel;
  raf_1.polyfill = polyfill;

  function createStore(initialState) {
    var state = initialState;

    var addActor = function addActor(actor) {
      return function (payload) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Updating state using %o and payload %o', actor.name, payload);
        }

        var nextPartialState = actor(state, payload);
        var nextState = nextPartialState ? _objectSpread({}, state, copyDefinedValues(nextPartialState)) : state;
        notify(nextState);
      };
    };

    var animationFrameId = null;
    var listeners = [];

    var notify = function notify(nextState) {
      state = nextState;

      if (animationFrameId) {
        raf_1.cancel(animationFrameId);
      }

      animationFrameId = raf_1(function () {
        return listeners.forEach(function (listener) {
          return listener();
        });
      });
    };

    var subscribe = function subscribe(listener) {
      listeners.push(listener);
      return function () {
        var indexOfListener = listeners.indexOf(listener);

        if (indexOfListener > -1) {
          listeners.splice(indexOfListener, 1);
        }
      };
    };

    return {
      addActor: addActor,
      subscribe: subscribe,
      getState: function getState() {
        return state;
      }
    };
  }

  var getFromDate = function getFromDate(dateObject) {
    return {
      hours: dateObject.getHours(),
      minutes: dateObject.getMinutes()
    };
  };

  var getHighlighted = function getHighlighted(selected, view) {
    if (selected && isSameMonth(selected, view)) {
      return new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    }

    return new Date(view.getFullYear(), view.getMonth(), 1);
  };

  var setSelectedActor = function setSelectedActor(state, payload) {
    var selected = getNextSelected(state, payload);

    if (!selected) {
      return;
    }

    if (state.selected) {
      var time = getFromDate(state.selected);
      selected.setHours(time.hours, time.minutes);
    }

    var view = getNextView(state, payload, selected);
    return {
      selected: selected,
      highlighted: getNextHighlighted(state, payload, selected, view),
      view: view
    };
  };

  var getNextSelected = function getNextSelected(state, payload) {
    if (payload.value instanceof Date) {
      return new Date(payload.value);
    }

    if (Number.isInteger(payload.value)) {
      return new Date(payload.value);
    }
  };

  var getNextView = function getNextView(state, payload, nextSelected) {
    if (payload.isUpdatingView === false || isSameMonth(state.view, nextSelected)) {
      return;
    }

    return getStartDateOfMonth(nextSelected);
  };

  var getNextHighlighted = function getNextHighlighted(state, payload, nextSelected, nextView) {
    if (payload.isUpdatingView === false) {
      return;
    }

    return getHighlighted(nextSelected, nextView || state.view);
  };

  var _KEY_CODE_TO_DAY_DELT;
  var KEY_CODE_TO_DAY_DELTA = (_KEY_CODE_TO_DAY_DELT = {}, _defineProperty(_KEY_CODE_TO_DAY_DELT, KEY_CODE.DOWN, 7), _defineProperty(_KEY_CODE_TO_DAY_DELT, KEY_CODE.UP, -7), _defineProperty(_KEY_CODE_TO_DAY_DELT, KEY_CODE.LEFT, -1), _defineProperty(_KEY_CODE_TO_DAY_DELT, KEY_CODE.RIGHT, 1), _KEY_CODE_TO_DAY_DELT);

  var setHighlightedActor = function setHighlightedActor(state, payload) {
    var dayDelta = KEY_CODE_TO_DAY_DELTA[payload.keyCode];

    if (!dayDelta) {
      return;
    }

    var highlighted = new Date(state.highlighted);
    highlighted.setDate(highlighted.getDate() + dayDelta);
    var view = isSameMonth(state.view, highlighted) ? undefined : getStartDateOfMonth(highlighted);
    return {
      highlighted: highlighted,
      view: view
    };
  };

  var setMinimumActor = function setMinimumActor(state, payload) {
    if (payload.value instanceof Date) {
      return {
        minimum: payload.value
      };
    }
  };

  var setMaximumActor = function setMaximumActor(state, payload) {
    if (payload.value instanceof Date) {
      return {
        minimum: payload.value
      };
    }
  };

  var setTimeActor = function setTimeActor(state, payload) {
    var selected = state.selected;

    if (!selected) {
      throw new Error('Cannot set the time without a selected date');
    }

    if (payload.hours != null && payload.hours !== selected.getHours()) {
      selected = new Date(selected);
      selected.setHours(payload.hours);
    }

    if (payload.minutes != null && payload.minutes !== selected.getMinutes()) {
      selected = new Date(selected);
      selected.setMinutes(payload.minutes);
    }

    if (selected !== state.selected) {
      return {
        selected: selected
      };
    }
  };

  var setFirstDayOfWeekActor = function setFirstDayOfWeekActor(state, payload) {
    if (typeof payload.value === 'number' && payload.value >= 0 && payload.value <= 6) {
      return {
        firstDayOfWeek: payload.value
      };
    }
  };

  var clearActor = function clearActor(state, payload) {
    return {
      selected: null
    };
  };

  var viewPreviousActor = function viewPreviousActor(state, payload) {
    var view = state.view;
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    return {
      highlighted: getHighlighted(state.selected, view),
      view: view
    };
  };

  var viewNextActor = function viewNextActor(state, payload) {
    var view = state.view;
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    return {
      highlighted: getHighlighted(state.selected, view),
      view: view
    };
  };

  var viewTodayActor = function viewTodayActor(state, payload) {
    var view = getStartDateOfMonth(new Date());
    return {
      highlighted: getHighlighted(state.selected, view),
      view: view
    };
  };

  var createCycleHourActor = function createCycleHourActor(getNextHours) {
    return function cycleHourActor(state) {
      var selected = state.selected;

      if (!selected) {
        throw new Error('Cannot cycle the hour without a selected date');
      }

      var hoursInMeridiem = getNextHours(selected.getHours() % 12);
      var isPostMeridiem = selected.getHours() > 11;

      if (isPostMeridiem) {
        hoursInMeridiem += 12;
      }

      selected = new Date(selected);
      selected.setHours(hoursInMeridiem);
      return {
        selected: selected
      };
    };
  };

  var cycleHourUpActor = createCycleHourActor(function (hoursInMeridiem) {
    return hoursInMeridiem === 11 ? 0 : hoursInMeridiem + 1;
  });

  var cycleHourDownActor = createCycleHourActor(function (hoursInMeridiem) {
    return hoursInMeridiem === 0 ? 11 : hoursInMeridiem - 1;
  });

  var createCycleMinuteActor = function createCycleMinuteActor(getNextMinutes) {
    return function cycleMinuteActor(state) {
      var selected = state.selected;

      if (!selected) {
        throw new Error('Cannot cycle the minute without a selected date');
      }

      var minutes = getNextMinutes(selected.getMinutes(), 15);
      selected = new Date(selected);
      selected.setMinutes(minutes);
      return {
        selected: selected
      };
    };
  };

  var cycleMinuteUpActor = createCycleMinuteActor(function (minutes, interval) {
    return minutes + interval >= 60 ? 0 : minutes + interval;
  });

  var cycleMinuteDownActor = createCycleMinuteActor(function (minutes, interval) {
    return minutes - interval < 0 ? 60 - interval : minutes - interval;
  });

  var cycleMeridiemActor = function cycleMeridiemActor(state) {
    var selected = state.selected;

    if (!selected) {
      throw new Error('Cannot cycle the meridiem without a selected date');
    }

    var hours = selected.getHours();
    hours += hours <= 11 ? 12 : -12;
    selected = new Date(selected);
    selected.setHours(hours);
    return {
      selected: selected
    };
  };

  function createDateStore() {
    var partialInitialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var view = getStartDateOfMonth(new Date());

    var initialState = _objectSpread({
      firstDayOfWeek: 0,
      selected: null,
      highlighted: view,
      view: view,
      minimum: null,
      maximum: null,
      disabled: []
    }, copyDefinedValues(partialInitialState));

    var store = createStore(initialState);
    return _objectSpread({}, store, {
      setFirstDayOfWeek: store.addActor(setFirstDayOfWeekActor),
      setSelected: store.addActor(setSelectedActor),
      setHighlighted: store.addActor(setHighlightedActor),
      setMinimum: store.addActor(setMinimumActor),
      setMaximum: store.addActor(setMaximumActor),
      setTime: store.addActor(setTimeActor),
      clear: store.addActor(clearActor),
      viewPrevious: store.addActor(viewPreviousActor),
      viewNext: store.addActor(viewNextActor),
      viewToday: store.addActor(viewTodayActor),
      cycleHourUp: store.addActor(cycleHourUpActor),
      cycleHourDown: store.addActor(cycleHourDownActor),
      cycleMinuteUp: store.addActor(cycleMinuteUpActor),
      cycleMinuteDown: store.addActor(cycleMinuteDownActor),
      cycleMeridiem: store.addActor(cycleMeridiemActor)
    });
  }

  var renderInputRootContainer = createInputRootBox();
  var renderContainer = createRootBox(createHeaderBox(createMonthAndYearBox(), createPreviousButton(), createTodayButton(), createNextButton()), createBodyBox(createGridButton()), createFooterBox(createTimeBox(createHourInput(), createTimeSeparator(), createMinuteInput(), createMeridiemButton()) // renderer.createClearButton()
  ));

  var create = function create() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        config = _ref.config,
        initialState = _ref.initialState;

    var dateStore = createDateStore(initialState);
    config = config ? mergeUpdates(DATE_PICKER_CONFIG, config) : DATE_PICKER_CONFIG;

    var getValue = function getValue() {
      var _dateStore$getState = dateStore.getState(),
          selected = _dateStore$getState.selected;

      return selected ? format(selected, config.template, config.templateHookWords) : '';
    };

    var subscribeToValue = function subscribeToValue(callback) {
      var onUpdate = function onUpdate() {
        var formattedValue = getValue();
        callback(formattedValue);
      };

      onUpdate();
      dateStore.subscribe(onUpdate);
    };

    var listenersMap = {};

    var addEventListener = function addEventListener(eventName, listener) {
      listenersMap[eventName] = listenersMap[eventName] || [];
      listenersMap[eventName].push(listener);
      return function () {
        var listeners = listenersMap[eventName] || [];
        var indexOfListener = listeners.indexOf(listener);

        if (indexOfListener > -1) {
          listeners.splice(indexOfListener, 1);
        }
      };
    };

    var triggerEvent = function triggerEvent(eventName) {
      var listeners = listenersMap[eventName] || [];
      listeners.forEach(function (listener) {
        return listener();
      });
    };

    dateStore.subscribe(function () {
      return triggerEvent(EVENT_NAME.CHANGE);
    });
    var picker = {
      store: dateStore,
      getConfig: function getConfig() {
        return config;
      },
      getValue: getValue,
      subscribeToValue: subscribeToValue,
      addEventListener: addEventListener,
      triggerEvent: triggerEvent,
      render: function render(element) {
        var containerElement = renderContainer(picker);

        if (!(element instanceof HTMLInputElement)) {
          element.appendChild(containerElement);
          return;
        }

        var rootElement = renderInputRootContainer(picker, element);
        rootElement.appendChild(containerElement);
        element.insertAdjacentElement('afterend', rootElement);
      }
    };
    return picker;
  };

  var api = {
    create: create
  };

  return api;

}));
