webpackHotUpdatedatamed_custom_components("main",{

/***/ "./node_modules/eve/eve.js":
/*!*********************************!*\
  !*** ./node_modules/eve/eve.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ┌────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.5.4 - JavaScript Events Library                      │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
// └────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.5.4",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
        firstDefined = function () {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        lastDefined = function () {
            var i = this.length;
            while (--i) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        objtos = Object.prototype.toString,
        Str = String,
        isArray = Array.isArray || function (ar) {
            return ar instanceof Array || objtos.call(ar) == "[object Array]";
        },
    /*\
     * eve
     [ method ]

     * Fires event with given `name`, given scope and other parameters.

     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers

     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
        eve = function (name, scope) {
            var oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event;
            out.firstDefined = firstDefined;
            out.lastDefined = lastDefined;
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out;
        };
    // Undocumented. Debug only.
    eve._events = events;
    /*\
     * eve.listeners
     [ method ]

     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

     - name (string) name of the event, dot (`.`) or slash (`/`) separated

     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = isArray(name) ? name : name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.separator
     [ method ]

     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.

     - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
    eve.separator = function (sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else {
            separator = /[\.\/]/;
        }
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        if (typeof f != "function") {
            return function () {};
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = isArray(name) ? name : Str(name).split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                    exist = true;
                    break;
                }
                !exist && e.f.push(f);
            }(names[i]));
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        }
        return cur;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = {n: {}};
            return;
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events],
            inodes = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                        inodes.unshift({
                            n: e,
                            name: names[i]
                        });
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                        inodes.unshift({
                            n: e,
                            name: key
                        });
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
            e = inodes[i];
            for (key in e.n[e.name].f) {
                // not empty (has listeners)
                continue prune;
            }
            for (key in e.n[e.name].n) {
                // not empty (has children)
                continue prune;
            }
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function () {
            eve.off(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    glob.eve = eve;
     true && module.exports ? module.exports = eve :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () { return eve; }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
})(typeof window != "undefined" ? window : this);


/***/ }),

/***/ "./node_modules/react-burger-menu/lib/BurgerMenu.js":
/*!**********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/BurgerMenu.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  slide: __webpack_require__(/*! ./menus/slide */ "./node_modules/react-burger-menu/lib/menus/slide.js"),
  stack: __webpack_require__(/*! ./menus/stack */ "./node_modules/react-burger-menu/lib/menus/stack.js"),
  elastic: __webpack_require__(/*! ./menus/elastic */ "./node_modules/react-burger-menu/lib/menus/elastic.js"),
  bubble: __webpack_require__(/*! ./menus/bubble */ "./node_modules/react-burger-menu/lib/menus/bubble.js"),
  push: __webpack_require__(/*! ./menus/push */ "./node_modules/react-burger-menu/lib/menus/push.js"),
  pushRotate: __webpack_require__(/*! ./menus/pushRotate */ "./node_modules/react-burger-menu/lib/menus/pushRotate.js"),
  scaleDown: __webpack_require__(/*! ./menus/scaleDown */ "./node_modules/react-burger-menu/lib/menus/scaleDown.js"),
  scaleRotate: __webpack_require__(/*! ./menus/scaleRotate */ "./node_modules/react-burger-menu/lib/menus/scaleRotate.js"),
  fallDown: __webpack_require__(/*! ./menus/fallDown */ "./node_modules/react-burger-menu/lib/menus/fallDown.js"),
  reveal: __webpack_require__(/*! ./menus/reveal */ "./node_modules/react-burger-menu/lib/menus/reveal.js")
};
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/components/BurgerIcon.js":
/*!*********************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/components/BurgerIcon.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var BurgerIcon = (function (_Component) {
  _inherits(BurgerIcon, _Component);

  function BurgerIcon(props) {
    _classCallCheck(this, BurgerIcon);

    _get(Object.getPrototypeOf(BurgerIcon.prototype), 'constructor', this).call(this, props);
    this.state = {
      hover: false
    };
  }

  _createClass(BurgerIcon, [{
    key: 'getLineStyle',
    value: function getLineStyle(index) {
      return _extends({
        position: 'absolute',
        height: '20%',
        left: 0,
        right: 0,
        top: 20 * (index * 2) + '%',
        opacity: this.state.hover ? 0.6 : 1
      }, this.state.hover && this.props.styles.bmBurgerBarsHover);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var icon = undefined;
      var buttonStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        fontSize: 0,
        background: 'transparent',
        cursor: 'pointer'
      };

      if (this.props.customIcon) {
        var extraProps = {
          className: ('bm-icon ' + (this.props.customIcon.props.className || '')).trim(),
          style: _extends({ width: '100%', height: '100%' }, this.props.styles.bmIcon)
        };
        icon = _react2['default'].cloneElement(this.props.customIcon, extraProps);
      } else {
        icon = _react2['default'].createElement(
          'span',
          null,
          [0, 1, 2].map(function (bar) {
            return _react2['default'].createElement('span', {
              key: bar,
              className: ('bm-burger-bars ' + _this.props.barClassName + ' ' + (_this.state.hover ? 'bm-burger-bars-hover' : '')).trim(),
              style: _extends({}, _this.getLineStyle(bar), _this.props.styles.bmBurgerBars)
            });
          })
        );
      }

      return _react2['default'].createElement(
        'div',
        {
          className: ('bm-burger-button ' + this.props.className).trim(),
          style: _extends({ zIndex: 1000 }, this.props.styles.bmBurgerButton)
        },
        _react2['default'].createElement(
          'button',
          {
            id: 'react-burger-menu-btn',
            onClick: this.props.onClick,
            onMouseOver: function () {
              _this.setState({ hover: true });
              if (_this.props.onIconHoverChange) {
                _this.props.onIconHoverChange({ isMouseIn: true });
              }
            },
            onMouseOut: function () {
              _this.setState({ hover: false });
              if (_this.props.onIconHoverChange) {
                _this.props.onIconHoverChange({ isMouseIn: false });
              }
            },
            style: buttonStyle
          },
          'Open Menu'
        ),
        icon
      );
    }
  }]);

  return BurgerIcon;
})(_react.Component);

exports['default'] = BurgerIcon;

BurgerIcon.propTypes = {
  barClassName: _propTypes2['default'].string,
  customIcon: _propTypes2['default'].element,
  styles: _propTypes2['default'].object
};

BurgerIcon.defaultProps = {
  barClassName: '',
  className: '',
  styles: {}
};
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/components/CrossIcon.js":
/*!********************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/components/CrossIcon.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var CrossIcon = (function (_Component) {
  _inherits(CrossIcon, _Component);

  function CrossIcon() {
    _classCallCheck(this, CrossIcon);

    _get(Object.getPrototypeOf(CrossIcon.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CrossIcon, [{
    key: 'getCrossStyle',
    value: function getCrossStyle(type) {
      return {
        position: 'absolute',
        width: 3,
        height: 14,
        transform: type === 'before' ? 'rotate(45deg)' : 'rotate(-45deg)'
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var icon;
      var buttonWrapperStyle = {
        position: 'absolute',
        width: 24,
        height: 24,
        right: 8,
        top: 8
      };
      var buttonStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        fontSize: 0,
        background: 'transparent',
        cursor: 'pointer'
      };

      if (this.props.customIcon) {
        var extraProps = {
          className: ('bm-cross ' + (this.props.customIcon.props.className || '')).trim(),
          style: _extends({ width: '100%', height: '100%' }, this.props.styles.bmCross)
        };
        icon = _react2['default'].cloneElement(this.props.customIcon, extraProps);
      } else {
        icon = _react2['default'].createElement(
          'span',
          { style: { position: 'absolute', top: '6px', right: '14px' } },
          ['before', 'after'].map(function (type, i) {
            return _react2['default'].createElement('span', {
              key: i,
              className: ('bm-cross ' + _this.props.crossClassName).trim(),
              style: _extends({}, _this.getCrossStyle(type), _this.props.styles.bmCross)
            });
          })
        );
      }

      return _react2['default'].createElement(
        'div',
        {
          className: ('bm-cross-button ' + this.props.className).trim(),
          style: _extends({}, buttonWrapperStyle, this.props.styles.bmCrossButton)
        },
        _react2['default'].createElement(
          'button',
          {
            id: 'react-burger-cross-btn',
            onClick: this.props.onClick,
            style: buttonStyle,
            tabIndex: this.props.isOpen ? 0 : -1
          },
          'Close Menu'
        ),
        icon
      );
    }
  }]);

  return CrossIcon;
})(_react.Component);

exports['default'] = CrossIcon;

CrossIcon.propTypes = {
  crossClassName: _propTypes2['default'].string,
  customIcon: _propTypes2['default'].element,
  isOpen: _propTypes2['default'].bool,
  styles: _propTypes2['default'].object
};

CrossIcon.defaultProps = {
  crossClassName: '',
  className: '',
  styles: {},
  isOpen: false
};
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/helpers/baseStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/helpers/baseStyles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});
var styles = {
  overlay: function overlay(isOpen) {
    return {
      position: 'fixed',
      zIndex: 1000,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      opacity: isOpen ? 1 : 0,
      MozTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
      MsTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
      OTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
      WebkitTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
      transform: isOpen ? '' : 'translate3d(100%, 0, 0)',
      transition: isOpen ? 'opacity 0.3s' : 'opacity 0.3s, transform 0s 0.3s'
    };
  },

  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      position: 'fixed',
      right: right ? 0 : 'inherit',
      zIndex: 1100,
      width: width,
      height: '100%',
      MozTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transition: 'all 0.5s'
    };
  },

  menu: function menu() {
    return {
      height: '100%',
      boxSizing: 'border-box',
      overflow: 'auto'
    };
  },

  itemList: function itemList() {
    return {
      height: '100%'
    };
  },

  item: function item() {
    return {
      display: 'block'
    };
  }
};

exports['default'] = styles;
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/helpers/dom.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/helpers/dom.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.focusOnFirstMenuItem = focusOnFirstMenuItem;
exports.focusOnLastMenuItem = focusOnLastMenuItem;
exports.focusOnCrossButton = focusOnCrossButton;
exports.focusOnMenuButton = focusOnMenuButton;
exports.focusOnMenuItem = focusOnMenuItem;
exports.focusOnNextMenuItem = focusOnNextMenuItem;
exports.focusOnPreviousMenuItem = focusOnPreviousMenuItem;

function focusOnFirstMenuItem() {
  var firstItem = Array.from(document.getElementsByClassName('bm-item')).shift();
  if (firstItem) {
    firstItem.focus();
  }
}

function focusOnLastMenuItem() {
  var lastItem = Array.from(document.getElementsByClassName('bm-item')).pop();
  if (lastItem) {
    lastItem.focus();
  }
}

function focusOnCrossButton() {
  var crossButton = document.getElementById('react-burger-cross-btn');
  if (crossButton) {
    crossButton.focus();
  }
}

function focusOnMenuButton() {
  var menuButton = document.getElementById('react-burger-menu-btn');
  if (menuButton) {
    menuButton.focus();
  }
}

function focusOnMenuItem(siblingType) {
  if (document.activeElement.className.includes('bm-item')) {
    var sibling = document.activeElement[siblingType];
    if (sibling) {
      sibling.focus();
    } else {
      focusOnCrossButton();
    }
  } else {
    if (siblingType === 'previousElementSibling') {
      focusOnLastMenuItem();
    } else {
      focusOnFirstMenuItem();
    }
  }
}

function focusOnNextMenuItem() {
  focusOnMenuItem('nextElementSibling');
}

function focusOnPreviousMenuItem() {
  focusOnMenuItem('previousElementSibling');
}

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/helpers/snapsvgImporter.js":
/*!***********************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/helpers/snapsvgImporter.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function () {
  var Snap = undefined;
  try {
    Snap = __webpack_require__(/*! snapsvg-cjs */ "./node_modules/snapsvg-cjs/dist/snap.svg-cjs.js");
  } finally {
    return Snap;
  }
};

module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/helpers/utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/helpers/utils.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var pxToNum = function pxToNum(val) {
  return parseInt(val.slice(0, -2), 10);
};
exports.pxToNum = pxToNum;

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menuFactory.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menuFactory.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helpersBaseStyles = __webpack_require__(/*! ./helpers/baseStyles */ "./node_modules/react-burger-menu/lib/helpers/baseStyles.js");

var _helpersBaseStyles2 = _interopRequireDefault(_helpersBaseStyles);

var _helpersDom = __webpack_require__(/*! ./helpers/dom */ "./node_modules/react-burger-menu/lib/helpers/dom.js");

var _componentsBurgerIcon = __webpack_require__(/*! ./components/BurgerIcon */ "./node_modules/react-burger-menu/lib/components/BurgerIcon.js");

var _componentsBurgerIcon2 = _interopRequireDefault(_componentsBurgerIcon);

var _componentsCrossIcon = __webpack_require__(/*! ./components/CrossIcon */ "./node_modules/react-burger-menu/lib/components/CrossIcon.js");

var _componentsCrossIcon2 = _interopRequireDefault(_componentsCrossIcon);

exports['default'] = function (styles) {
  if (!styles) {
    throw new Error('No styles supplied');
  }

  var ARROW_DOWN = 'ArrowDown';
  var ARROW_UP = 'ArrowUp';
  var ESCAPE = 'Escape';
  var SPACE = ' ';
  var HOME = 'Home';
  var END = 'End';

  function usePrevious(value) {
    var ref = _react2['default'].useRef(value);
    _react2['default'].useEffect(function () {
      ref.current = value;
    });
    return ref.current;
  }

  var Menu = function Menu(props) {
    var _React$useState = _react2['default'].useState(false);

    var _React$useState2 = _slicedToArray(_React$useState, 2);

    var isOpen = _React$useState2[0];
    var setIsOpen = _React$useState2[1];

    var timeoutId = _react2['default'].useRef();
    var toggleOptions = _react2['default'].useRef({});
    var prevIsOpenProp = usePrevious(props.isOpen);

    _react2['default'].useEffect(function () {
      if (props.isOpen) {
        toggleMenu({ isOpen: true, noStateChange: true });
      }

      return function cleanup() {
        applyWrapperStyles(false);
        clearCurrentTimeout();
      };
    }, []);

    _react2['default'].useEffect(function () {
      var wasToggled = typeof props.isOpen !== 'undefined' && props.isOpen !== isOpen && props.isOpen !== prevIsOpenProp;

      if (wasToggled) {
        toggleMenu();
        // Toggling changes SVG animation requirements, so defer these until next update
        return;
      }

      if (styles.svg) {
        (function () {
          var morphShape = document.getElementById('bm-morph-shape');
          var path = styles.svg.lib(morphShape).select('path');

          if (isOpen) {
            // Animate SVG path
            styles.svg.animate(path);
          } else {
            // Reset path (timeout ensures animation happens off screen)
            setTimeout(function () {
              path.attr('d', styles.svg.pathInitial);
            }, 300);
          }
        })();
      }
    });

    _react2['default'].useEffect(function () {
      var _toggleOptions$current = toggleOptions.current;
      var noStateChange = _toggleOptions$current.noStateChange;
      var focusOnLastItem = _toggleOptions$current.focusOnLastItem;

      if (!noStateChange) {
        props.onStateChange({ isOpen: isOpen });
      }

      if (!props.disableAutoFocus) {
        // For accessibility reasons, ensures that when we toggle open,
        // we focus the first or last menu item according to given parameter
        if (isOpen) {
          focusOnLastItem ? (0, _helpersDom.focusOnLastMenuItem)() : (0, _helpersDom.focusOnFirstMenuItem)();
        } else {
          if (document.activeElement) {
            document.activeElement.blur();
          } else {
            document.body.blur(); // Needed for IE
          }
        }
      }

      // Timeout ensures wrappers are cleared after animation finishes
      clearCurrentTimeout();
      timeoutId.current = setTimeout(function () {
        timeoutId.current = null;
        if (!isOpen) {
          applyWrapperStyles(false);
        }
      }, 500);

      // Bind keydown handlers (or custom function if supplied)
      var defaultOnKeyDown = isOpen ? onKeyDownOpen : onKeyDownClosed;
      var onKeyDown = props.customOnKeyDown || defaultOnKeyDown;
      window.addEventListener('keydown', onKeyDown);

      return function cleanup() {
        window.removeEventListener('keydown', onKeyDown);
      };
    }, [isOpen]);

    function toggleMenu() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      toggleOptions.current = options;

      applyWrapperStyles();

      // Ensures wrapper styles are applied before the menu is toggled
      setTimeout(function () {
        setIsOpen(function (open) {
          return typeof options.isOpen !== 'undefined' ? options.isOpen : !open;
        });
      });
    }

    function open() {
      if (typeof props.onOpen === 'function') {
        props.onOpen();
      } else {
        toggleMenu();
      }
    }

    function close() {
      if (typeof props.onClose === 'function') {
        props.onClose();
      } else {
        toggleMenu();
      }
    }

    function getStyle(style, index) {
      var width = props.width;
      var right = props.right;

      var formattedWidth = typeof width !== 'string' ? width + 'px' : width;
      return style(isOpen, formattedWidth, right, index);
    }

    // Builds styles incrementally for a given element
    function getStyles(el, index, inline) {
      var propName = 'bm' + el.replace(el.charAt(0), el.charAt(0).toUpperCase());

      // Set base styles
      var output = _helpersBaseStyles2['default'][el] ? getStyle(_helpersBaseStyles2['default'][el]) : {};

      // Add animation-specific styles
      if (styles[el]) {
        output = _extends({}, output, getStyle(styles[el], index + 1));
      }

      // Add custom styles
      if (props.styles[propName]) {
        output = _extends({}, output, props.styles[propName]);
      }

      // Add element inline styles
      if (inline) {
        output = _extends({}, output, inline);
      }

      // Remove transition if required
      // (useful if rendering open initially)
      if (props.noTransition) {
        delete output.transition;
      }

      return output;
    }

    // Sets or unsets styles on DOM elements outside the menu component
    // This is necessary for correct page interaction with some of the menus
    // Throws and returns if the required external elements don't exist,
    // which means any external page animations won't be applied
    function handleExternalWrapper(id, wrapperStyles, set) {
      var wrapper = document.getElementById(id);

      if (!wrapper) {
        console.error("Element with ID '" + id + "' not found");
        return;
      }

      var builtStyles = getStyle(wrapperStyles);

      for (var prop in builtStyles) {
        if (builtStyles.hasOwnProperty(prop)) {
          wrapper.style[prop] = set ? builtStyles[prop] : '';
        }
      }

      // Prevent any horizontal scroll
      // Only set overflow-x as an inline style if htmlClassName or
      // bodyClassName is not passed in. Otherwise, it is up to the caller to
      // decide if they want to set the overflow style in CSS using the custom
      // class names
      var applyOverflow = function applyOverflow(el) {
        return el.style['overflow-x'] = set ? 'hidden' : '';
      };
      if (!props.htmlClassName) {
        applyOverflow(document.querySelector('html'));
      }
      if (!props.bodyClassName) {
        applyOverflow(document.querySelector('body'));
      }
    }

    // Applies component-specific styles to external wrapper elements
    function applyWrapperStyles() {
      var set = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var applyClass = function applyClass(el, className) {
        return el.classList[set ? 'add' : 'remove'](className);
      };

      if (props.htmlClassName) {
        applyClass(document.querySelector('html'), props.htmlClassName);
      }
      if (props.bodyClassName) {
        applyClass(document.querySelector('body'), props.bodyClassName);
      }

      if (styles.pageWrap && props.pageWrapId) {
        handleExternalWrapper(props.pageWrapId, styles.pageWrap, set);
      }

      if (styles.outerContainer && props.outerContainerId) {
        handleExternalWrapper(props.outerContainerId, styles.outerContainer, set);
      }

      var menuWrap = document.querySelector('.bm-menu-wrap');
      if (menuWrap) {
        if (set) {
          menuWrap.removeAttribute('hidden');
        } else {
          menuWrap.setAttribute('hidden', true);
        }
      }
    }

    // Avoids potentially attempting to update an unmounted component
    function clearCurrentTimeout() {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    }

    function onKeyDownOpen(e) {
      e = e || window.event;
      switch (e.key) {
        case ESCAPE:
          // Close on ESC, unless disabled
          if (!props.disableCloseOnEsc) {
            close();
            (0, _helpersDom.focusOnMenuButton)();
          }
          break;
        case ARROW_DOWN:
          (0, _helpersDom.focusOnNextMenuItem)();
          break;
        case ARROW_UP:
          (0, _helpersDom.focusOnPreviousMenuItem)();
          break;
        case HOME:
          (0, _helpersDom.focusOnFirstMenuItem)();
          break;
        case END:
          (0, _helpersDom.focusOnLastMenuItem)();
          break;
      }
    }

    function onKeyDownClosed(e) {
      e = e || window.event;
      // Key downs came from menu button
      if (e.target === document.getElementById('react-burger-menu-btn')) {
        switch (e.key) {
          case ARROW_DOWN:
          case SPACE:
            // If down arrow, space or enter, open menu and focus on first menuitem
            toggleMenu();
            break;
          case ARROW_UP:
            // If arrow up, open menu and focus on last menuitem
            toggleMenu({ focusOnLastItem: true });
            break;
        }
      }
    }

    function handleOverlayClick() {
      if (props.disableOverlayClick === true || typeof props.disableOverlayClick === 'function' && props.disableOverlayClick()) {
        return;
      } else {
        close();
      }
    }

    return _react2['default'].createElement(
      'div',
      null,
      !props.noOverlay && _react2['default'].createElement('div', {
        className: ('bm-overlay ' + props.overlayClassName).trim(),
        onClick: handleOverlayClick,
        style: getStyles('overlay')
      }),
      props.customBurgerIcon !== false && _react2['default'].createElement(
        'div',
        { style: getStyles('burgerIcon') },
        _react2['default'].createElement(_componentsBurgerIcon2['default'], {
          onClick: open,
          styles: props.styles,
          customIcon: props.customBurgerIcon,
          className: props.burgerButtonClassName,
          barClassName: props.burgerBarClassName,
          onIconStateChange: props.onIconStateChange
        })
      ),
      _react2['default'].createElement(
        'div',
        {
          id: props.id,
          className: ('bm-menu-wrap ' + props.className).trim(),
          style: getStyles('menuWrap'),
          'aria-hidden': !isOpen
        },
        styles.svg && _react2['default'].createElement(
          'div',
          {
            id: 'bm-morph-shape',
            className: ('bm-morph-shape ' + props.morphShapeClassName).trim(),
            style: getStyles('morphShape')
          },
          _react2['default'].createElement(
            'svg',
            {
              width: '100%',
              height: '100%',
              viewBox: '0 0 100 800',
              preserveAspectRatio: 'none'
            },
            _react2['default'].createElement('path', { d: styles.svg.pathInitial })
          )
        ),
        _react2['default'].createElement(
          'div',
          {
            className: ('bm-menu ' + props.menuClassName).trim(),
            style: getStyles('menu')
          },
          _react2['default'].createElement(props.itemListElement, {
            className: ('bm-item-list ' + props.itemListClassName).trim(),
            style: getStyles('itemList')
          }, _react2['default'].Children.map(props.children, function (item, index) {
            if (item) {
              var classList = ['bm-item', props.itemClassName, item.props.className].filter(function (className) {
                return !!className;
              }).join(' ');
              var extraProps = {
                key: index,
                className: classList,
                style: getStyles('item', index, item.props.style),
                tabIndex: isOpen ? 0 : -1
              };
              return _react2['default'].cloneElement(item, extraProps);
            }
          }))
        ),
        props.customCrossIcon !== false && _react2['default'].createElement(
          'div',
          { style: getStyles('closeButton') },
          _react2['default'].createElement(_componentsCrossIcon2['default'], {
            onClick: close,
            styles: props.styles,
            customIcon: props.customCrossIcon,
            className: props.crossButtonClassName,
            crossClassName: props.crossClassName,
            isOpen: isOpen
          })
        )
      )
    );
  };

  Menu.propTypes = {
    bodyClassName: _propTypes2['default'].string,
    burgerBarClassName: _propTypes2['default'].string,
    burgerButtonClassName: _propTypes2['default'].string,
    className: _propTypes2['default'].string,
    crossButtonClassName: _propTypes2['default'].string,
    crossClassName: _propTypes2['default'].string,
    customBurgerIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].element, _propTypes2['default'].oneOf([false])]),
    customCrossIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].element, _propTypes2['default'].oneOf([false])]),
    customOnKeyDown: _propTypes2['default'].func,
    disableAutoFocus: _propTypes2['default'].bool,
    disableCloseOnEsc: _propTypes2['default'].bool,
    disableOverlayClick: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].func]),
    htmlClassName: _propTypes2['default'].string,
    id: _propTypes2['default'].string,
    isOpen: _propTypes2['default'].bool,
    itemClassName: _propTypes2['default'].string,
    itemListClassName: _propTypes2['default'].string,
    itemListElement: _propTypes2['default'].oneOf(['div', 'nav']),
    menuClassName: _propTypes2['default'].string,
    morphShapeClassName: _propTypes2['default'].string,
    noOverlay: _propTypes2['default'].bool,
    noTransition: _propTypes2['default'].bool,
    onClose: _propTypes2['default'].func,
    onIconHoverChange: _propTypes2['default'].func,
    onOpen: _propTypes2['default'].func,
    onStateChange: _propTypes2['default'].func,
    outerContainerId: styles && styles.outerContainer ? _propTypes2['default'].string.isRequired : _propTypes2['default'].string,
    overlayClassName: _propTypes2['default'].string,
    pageWrapId: styles && styles.pageWrap ? _propTypes2['default'].string.isRequired : _propTypes2['default'].string,
    right: _propTypes2['default'].bool,
    styles: _propTypes2['default'].object,
    width: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string])
  };

  Menu.defaultProps = {
    bodyClassName: '',
    burgerBarClassName: '',
    burgerButtonClassName: '',
    className: '',
    crossButtonClassName: '',
    crossClassName: '',
    disableAutoFocus: false,
    disableCloseOnEsc: false,
    htmlClassName: '',
    id: '',
    itemClassName: '',
    itemListClassName: '',
    menuClassName: '',
    morphShapeClassName: '',
    noOverlay: false,
    noTransition: false,
    onStateChange: function onStateChange() {},
    outerContainerId: '',
    overlayClassName: '',
    pageWrapId: '',
    styles: {},
    width: 300,
    onIconHoverChange: function onIconHoverChange() {},
    itemListElement: 'nav'
  };

  return Menu;
};

module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/bubble.js":
/*!************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/bubble.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersSnapsvgImporter = __webpack_require__(/*! ../helpers/snapsvgImporter */ "./node_modules/react-burger-menu/lib/helpers/snapsvgImporter.js");

var _helpersSnapsvgImporter2 = _interopRequireDefault(_helpersSnapsvgImporter);

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var _helpersUtils = __webpack_require__(/*! ../helpers/utils */ "./node_modules/react-burger-menu/lib/helpers/utils.js");

var BUBBLE_WIDTH = 140;

var styles = {
  svg: {
    lib: _helpersSnapsvgImporter2['default'],
    pathInitial: 'M-7.312,0H0c0,0,0,113.839,0,400c0,264.506,0,400,0,400h-7.312V0z',
    pathOpen: 'M-7.312,0H15c0,0,66,113.339,66,399.5C81,664.006,15,800,15,800H-7.312V0z;M-7.312,0H100c0,0,0,113.839,0,400c0,264.506,0,400,0,400H-7.312V0z',
    animate: function animate(path) {
      var pos = 0;
      var steps = this.pathOpen.split(';');
      var stepsTotal = steps.length;
      var mina = window.mina;

      var nextStep = function nextStep() {
        if (pos > stepsTotal - 1) return;

        path.animate({ path: steps[pos] }, pos === 0 ? 400 : 500, pos === 0 ? mina.easein : mina.elastic, function () {
          nextStep();
        });

        pos++;
      };

      nextStep();
    }
  },

  morphShape: function morphShape(isOpen, width, right) {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      right: right ? 'inherit' : 0,
      left: right ? 0 : 'inherit',
      MozTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
      MsTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
      OTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
      WebkitTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
      transform: right ? 'rotateY(180deg)' : 'rotateY(0deg)'
    };
  },

  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transition: isOpen ? 'transform 0.4s 0s' : 'transform 0.4s'
    };
  },

  menu: function menu(isOpen, width, right) {
    var finalWidth = (0, _helpersUtils.pxToNum)(width) - BUBBLE_WIDTH;
    return {
      position: 'fixed',
      MozTransform: isOpen ? '' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transition: isOpen ? 'opacity 0.1s 0.4s cubic-bezier(.17, .67, .1, 1.27), transform 0.1s 0.4s cubic-bezier(.17, .67, .1, 1.27)' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
      opacity: isOpen ? 1 : 0
    };
  },

  item: function item(isOpen, width, right, nthChild) {
    var finalWidth = (0, _helpersUtils.pxToNum)(width) - BUBBLE_WIDTH;
    return {
      MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transition: isOpen ? 'opacity 0.3s 0.4s, transform 0.3s 0.4s' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
      opacity: isOpen ? 1 : 0
    };
  },

  closeButton: function closeButton(isOpen, width, right) {
    var finalWidth = (0, _helpersUtils.pxToNum)(width) - BUBBLE_WIDTH;
    return {
      MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + finalWidth + ', 0, 0)' : 'translate3d(-' + finalWidth + ', 0, 0)',
      transition: isOpen ? 'opacity 0.3s 0.4s cubic-bezier(.17, .67, .1, 1.27), transform 0.3s 0.4s cubic-bezier(.17, .67, .1, 1.27)' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
      opacity: isOpen ? 1 : 0
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/elastic.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/elastic.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersSnapsvgImporter = __webpack_require__(/*! ../helpers/snapsvgImporter */ "./node_modules/react-burger-menu/lib/helpers/snapsvgImporter.js");

var _helpersSnapsvgImporter2 = _interopRequireDefault(_helpersSnapsvgImporter);

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var _helpersUtils = __webpack_require__(/*! ../helpers/utils */ "./node_modules/react-burger-menu/lib/helpers/utils.js");

var MORPH_SHAPE_WIDTH = 120;

var styles = {
  svg: {
    lib: _helpersSnapsvgImporter2['default'],
    pathInitial: 'M-1,0h101c0,0-97.833,153.603-97.833,396.167C2.167,627.579,100,800,100,800H-1V0z',
    pathOpen: 'M-1,0h101c0,0,0-1,0,395c0,404,0,405,0,405H-1V0z',
    animate: function animate(path) {
      path.animate({ path: this.pathOpen }, 400, window.mina.easeinout);
    }
  },

  morphShape: function morphShape(isOpen, width, right) {
    return {
      position: 'absolute',
      width: MORPH_SHAPE_WIDTH,
      height: '100%',
      right: right ? 'inherit' : 0,
      left: right ? 0 : 'inherit',
      MozTransform: right ? 'rotateY(180deg)' : '',
      MsTransform: right ? 'rotateY(180deg)' : '',
      OTransform: right ? 'rotateY(180deg)' : '',
      WebkitTransform: right ? 'rotateY(180deg)' : '',
      transform: right ? 'rotateY(180deg)' : ''
    };
  },

  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
      transition: 'all 0.3s'
    };
  },

  menu: function menu(isOpen, width, right) {
    return {
      position: 'fixed',
      right: right ? 0 : 'inherit',
      width: (0, _helpersUtils.pxToNum)(width) - MORPH_SHAPE_WIDTH,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      overflow: 'visible'
    };
  },

  itemList: function itemList(isOpen, width, right) {
    if (right) {
      return {
        position: 'relative',
        left: '-110px',
        width: '170%',
        overflow: 'auto'
      };
    }
  },

  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
      transition: isOpen ? 'all 0.3s' : 'all 0.3s 0.1s'
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/fallDown.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/fallDown.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  menuWrap: function menuWrap(isOpen) {
    return {
      MozTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
      MsTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
      OTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
      WebkitTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
      transform: isOpen ? '' : 'translate3d(0, -100%, 0)',
      transition: 'all 0.5s ease-in-out'
    };
  },

  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transition: 'all 0.5s'
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      perspective: '1500px',
      perspectiveOrigin: '0% 50%',
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/push.js":
/*!**********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/push.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transition: 'all 0.5s'
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/pushRotate.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/pushRotate.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
      OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
      transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
      transformOrigin: right ? '100% 50%' : '0% 50%',
      transformStyle: 'preserve-3d',
      transition: 'all 0.5s'
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      perspective: '1500px',
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/reveal.js":
/*!************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/reveal.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      MozTransform: 'translate3d(0, 0, 0)',
      MsTransform: 'translate3d(0, 0, 0)',
      OTransform: 'translate3d(0, 0, 0)',
      WebkitTransform: 'translate3d(0, 0, 0)',
      transform: 'translate3d(0, 0, 0)',
      zIndex: isOpen ? 1000 : -1
    };
  },

  overlay: function overlay(isOpen, width, right) {
    return {
      zIndex: 1400,
      MozTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      MsTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      OTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      WebkitTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      transform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      transition: 'all 0.5s',
      visibility: isOpen ? 'visible' : 'hidden'
    };
  },

  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
      transition: 'all 0.5s',
      zIndex: 1200,
      position: 'relative'
    };
  },

  burgerIcon: function burgerIcon(isOpen, width, right) {
    return {
      MozTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      MsTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      OTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      WebkitTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      transform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
      transition: 'all 0.1s',
      position: 'relative',
      zIndex: 1300
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/scaleDown.js":
/*!***************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/scaleDown.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  pageWrap: function pageWrap(isOpen, width) {
    return {
      MozTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      MsTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      OTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      WebkitTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      transform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      transformOrigin: '100%',
      transformStyle: 'preserve-3d',
      transition: 'all 0.5s'
    };
  },

  outerContainer: function outerContainer() {
    return {
      perspective: '1500px'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/scaleRotate.js":
/*!*****************************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/scaleRotate.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  pageWrap: function pageWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
      MsTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
      OTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
      transform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
      transformStyle: 'preserve-3d',
      transition: 'all 0.5s',
      overflow: isOpen ? '' : 'hidden'
    };
  },

  outerContainer: function outerContainer(isOpen) {
    return {
      perspective: '1500px',
      overflow: isOpen ? '' : 'hidden'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/slide.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/slide.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/react-burger-menu/lib/menus/stack.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-burger-menu/lib/menus/stack.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _menuFactory = __webpack_require__(/*! ../menuFactory */ "./node_modules/react-burger-menu/lib/menuFactory.js");

var _menuFactory2 = _interopRequireDefault(_menuFactory);

var styles = {
  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      MozTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
      MsTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
      OTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
      WebkitTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
      transform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
      transition: isOpen ? 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)' : 'transform 0.4s cubic-bezier(0.7, 0, 0.3, 1)'
    };
  },

  item: function item(isOpen, width, right, nthChild) {
    return {
      MozTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
      MsTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
      OTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
      WebkitTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
      transform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
      transition: isOpen ? 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)' : 'transform 0s 0.2s cubic-bezier(0.7, 0, 0.3, 1)'
    };
  }
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];

/***/ }),

/***/ "./node_modules/snapsvg-cjs/dist/snap.svg-cjs.js":
/*!*******************************************************!*\
  !*** ./node_modules/snapsvg-cjs/dist/snap.svg-cjs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

window.eve = __webpack_require__(/*! eve */ "./node_modules/eve/eve.js")

// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var mina = (function (eve) {
    var animations = {},
    requestAnimFrame = window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.oRequestAnimationFrame      ||
                       window.msRequestAnimationFrame     ||
                       function (callback) {
                           setTimeout(callback, 16, new Date().getTime());
                           return true;
                       },
    requestID,
    isArray = Array.isArray || function (a) {
        return a instanceof Array ||
            Object.prototype.toString.call(a) == "[object Array]";
    },
    idgen = 0,
    idprefix = "M" + (+new Date).toString(36),
    ID = function () {
        return idprefix + (idgen++).toString(36);
    },
    diff = function (a, b, A, B) {
        if (isArray(a)) {
            res = [];
            for (var i = 0, ii = a.length; i < ii; i++) {
                res[i] = diff(a[i], b, A[i], B);
            }
            return res;
        }
        var dif = (A - a) / (B - b);
        return function (bb) {
            return a + dif * (bb - b);
        };
    },
    timer = Date.now || function () {
        return +new Date;
    },
    sta = function (val) {
        var a = this;
        if (val == null) {
            return a.s;
        }
        var ds = a.s - val;
        a.b += a.dur * ds;
        a.B += a.dur * ds;
        a.s = val;
    },
    speed = function (val) {
        var a = this;
        if (val == null) {
            return a.spd;
        }
        a.spd = val;
    },
    duration = function (val) {
        var a = this;
        if (val == null) {
            return a.dur;
        }
        a.s = a.s * val / a.dur;
        a.dur = val;
    },
    stopit = function () {
        var a = this;
        delete animations[a.id];
        a.update();
        eve("mina.stop." + a.id, a);
    },
    pause = function () {
        var a = this;
        if (a.pdif) {
            return;
        }
        delete animations[a.id];
        a.update();
        a.pdif = a.get() - a.b;
    },
    resume = function () {
        var a = this;
        if (!a.pdif) {
            return;
        }
        a.b = a.get() - a.pdif;
        delete a.pdif;
        animations[a.id] = a;
        frame();
    },
    update = function () {
        var a = this,
            res;
        if (isArray(a.start)) {
            res = [];
            for (var j = 0, jj = a.start.length; j < jj; j++) {
                res[j] = +a.start[j] +
                    (a.end[j] - a.start[j]) * a.easing(a.s);
            }
        } else {
            res = +a.start + (a.end - a.start) * a.easing(a.s);
        }
        a.set(res);
    },
    frame = function (timeStamp) {
        // Manual invokation?
        if (!timeStamp) {
            // Frame loop stopped?
            if (!requestID) {
                // Start frame loop...
                requestID = requestAnimFrame(frame);
            }
            return;
        }
        var len = 0;
        for (var i in animations) if (animations.hasOwnProperty(i)) {
            var a = animations[i],
                b = a.get(),
                res;
            len++;
            a.s = (b - a.b) / (a.dur / a.spd);
            if (a.s >= 1) {
                delete animations[i];
                a.s = 1;
                len--;
                (function (a) {
                    setTimeout(function () {
                        eve("mina.finish." + a.id, a);
                    });
                }(a));
            }
            a.update();
        }
        requestID = len ? requestAnimFrame(frame) : false;
    },
    /*\
     * mina
     [ method ]
     **
     * Generic animation of numbers
     **
     - a (number) start _slave_ number
     - A (number) end _slave_ number
     - b (number) start _master_ number (start time in general case)
     - B (number) end _master_ number (end time in general case)
     - get (function) getter of _master_ number (see @mina.time)
     - set (function) setter of _slave_ number
     - easing (function) #optional easing function, default is @mina.linear
     = (object) animation descriptor
     o {
     o         id (string) animation id,
     o         start (number) start _slave_ number,
     o         end (number) end _slave_ number,
     o         b (number) start _master_ number,
     o         s (number) animation status (0..1),
     o         dur (number) animation duration,
     o         spd (number) animation speed,
     o         get (function) getter of _master_ number (see @mina.time),
     o         set (function) setter of _slave_ number,
     o         easing (function) easing function, default is @mina.linear,
     o         status (function) status getter/setter,
     o         speed (function) speed getter/setter,
     o         duration (function) duration getter/setter,
     o         stop (function) animation stopper
     o         pause (function) pauses the animation
     o         resume (function) resumes the animation
     o         update (function) calles setter with the right value of the animation
     o }
    \*/
    mina = function (a, A, b, B, get, set, easing) {
        var anim = {
            id: ID(),
            start: a,
            end: A,
            b: b,
            s: 0,
            dur: B - b,
            spd: 1,
            get: get,
            set: set,
            easing: easing || mina.linear,
            status: sta,
            speed: speed,
            duration: duration,
            stop: stopit,
            pause: pause,
            resume: resume,
            update: update
        };
        animations[anim.id] = anim;
        var len = 0, i;
        for (i in animations) if (animations.hasOwnProperty(i)) {
            len++;
            if (len == 2) {
                break;
            }
        }
        len == 1 && frame();
        return anim;
    };
    /*\
     * mina.time
     [ method ]
     **
     * Returns the current time. Equivalent to:
     | function () {
     |     return (new Date).getTime();
     | }
    \*/
    mina.time = timer;
    /*\
     * mina.getById
     [ method ]
     **
     * Returns an animation by its id
     - id (string) animation's id
     = (object) See @mina
    \*/
    mina.getById = function (id) {
        return animations[id] || null;
    };

    /*\
     * mina.linear
     [ method ]
     **
     * Default linear easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.linear = function (n) {
        return n;
    };
    /*\
     * mina.easeout
     [ method ]
     **
     * Easeout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeout = function (n) {
        return Math.pow(n, 1.7);
    };
    /*\
     * mina.easein
     [ method ]
     **
     * Easein easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easein = function (n) {
        return Math.pow(n, .48);
    };
    /*\
     * mina.easeinout
     [ method ]
     **
     * Easeinout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeinout = function (n) {
        if (n == 1) {
            return 1;
        }
        if (n == 0) {
            return 0;
        }
        var q = .48 - n / 1.04,
            Q = Math.sqrt(.1734 + q * q),
            x = Q - q,
            X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
            y = -Q - q,
            Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
            t = X + Y + .5;
        return (1 - t) * 3 * t * t + t * t * t;
    };
    /*\
     * mina.backin
     [ method ]
     **
     * Backin easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backin = function (n) {
        if (n == 1) {
            return 1;
        }
        var s = 1.70158;
        return n * n * ((s + 1) * n - s);
    };
    /*\
     * mina.backout
     [ method ]
     **
     * Backout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backout = function (n) {
        if (n == 0) {
            return 0;
        }
        n = n - 1;
        var s = 1.70158;
        return n * n * ((s + 1) * n + s) + 1;
    };
    /*\
     * mina.elastic
     [ method ]
     **
     * Elastic easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.elastic = function (n) {
        if (n == !!n) {
            return n;
        }
        return Math.pow(2, -10 * n) * Math.sin((n - .075) *
            (2 * Math.PI) / .3) + 1;
    };
    /*\
     * mina.bounce
     [ method ]
     **
     * Bounce easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.bounce = function (n) {
        var s = 7.5625,
            p = 2.75,
            l;
        if (n < 1 / p) {
            l = s * n * n;
        } else {
            if (n < 2 / p) {
                n -= 1.5 / p;
                l = s * n * n + .75;
            } else {
                if (n < 2.5 / p) {
                    n -= 2.25 / p;
                    l = s * n * n + .9375;
                } else {
                    n -= 2.625 / p;
                    l = s * n * n + .984375;
                }
            }
        }
        return l;
    };
    window.mina = mina;
    return mina;
})(typeof eve == "undefined" ? function () {} : eve);

// Copyright (c) 2013 - 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var Snap = (function(root) {
Snap.version = "0.5.1";
/*\
 * Snap
 [ method ]
 **
 * Creates a drawing surface or wraps existing SVG element.
 **
 - width (number|string) width of surface
 - height (number|string) height of surface
 * or
 - DOM (SVGElement) element to be wrapped into Snap structure
 * or
 - array (array) array of elements (will return set of elements)
 * or
 - query (string) CSS query selector
 = (object) @Element
\*/
function Snap(w, h) {
    if (w) {
        if (w.nodeType) {
            return wrap(w);
        }
        if (is(w, "array") && Snap.set) {
            return Snap.set.apply(Snap, w);
        }
        if (w instanceof Element) {
            return w;
        }
        if (h == null) {
            try {
                w = glob.doc.querySelector(String(w));
                return wrap(w);
            } catch (e) {
                return null;
            }
        }
    }
    w = w == null ? "100%" : w;
    h = h == null ? "100%" : h;
    return new Paper(w, h);
}
Snap.toString = function () {
    return "Snap v" + this.version;
};
Snap._ = {};
var glob = {
    win: root.window,
    doc: root.window.document
};
Snap._.glob = glob;
var has = "hasOwnProperty",
    Str = String,
    toFloat = parseFloat,
    toInt = parseInt,
    math = Math,
    mmax = math.max,
    mmin = math.min,
    abs = math.abs,
    pow = math.pow,
    PI = math.PI,
    round = math.round,
    E = "",
    S = " ",
    objectToString = Object.prototype.toString,
    ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
    bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
    separator = Snap._.separator = /[,\s]+/,
    whitespace = /[\s]/g,
    commaSpaces = /[\s]*,[\s]*/,
    hsrg = {hs: 1, rg: 1},
    pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/ig,
    idgen = 0,
    idprefix = "S" + (+new Date).toString(36),
    ID = function (el) {
        return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
    },
    xlink = "http://www.w3.org/1999/xlink",
    xmlns = "http://www.w3.org/2000/svg",
    hub = {},
    /*\
     * Snap.url
     [ method ]
     **
     * Wraps path into `"url('<path>')"`.
     - value (string) path
     = (string) wrapped path
    \*/
    URL = Snap.url = function (url) {
        return "url('#" + url + "')";
    };

function $(el, attr) {
    if (attr) {
        if (el == "#text") {
            el = glob.doc.createTextNode(attr.text || attr["#text"] || "");
        }
        if (el == "#comment") {
            el = glob.doc.createComment(attr.text || attr["#text"] || "");
        }
        if (typeof el == "string") {
            el = $(el);
        }
        if (typeof attr == "string") {
            if (el.nodeType == 1) {
                if (attr.substring(0, 6) == "xlink:") {
                    return el.getAttributeNS(xlink, attr.substring(6));
                }
                if (attr.substring(0, 4) == "xml:") {
                    return el.getAttributeNS(xmlns, attr.substring(4));
                }
                return el.getAttribute(attr);
            } else if (attr == "text") {
                return el.nodeValue;
            } else {
                return null;
            }
        }
        if (el.nodeType == 1) {
            for (var key in attr) if (attr[has](key)) {
                var val = Str(attr[key]);
                if (val) {
                    if (key.substring(0, 6) == "xlink:") {
                        el.setAttributeNS(xlink, key.substring(6), val);
                    } else if (key.substring(0, 4) == "xml:") {
                        el.setAttributeNS(xmlns, key.substring(4), val);
                    } else {
                        el.setAttribute(key, val);
                    }
                } else {
                    el.removeAttribute(key);
                }
            }
        } else if ("text" in attr) {
            el.nodeValue = attr.text;
        }
    } else {
        el = glob.doc.createElementNS(xmlns, el);
    }
    return el;
}
Snap._.$ = $;
Snap._.id = ID;
function getAttrs(el) {
    var attrs = el.attributes,
        name,
        out = {};
    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].namespaceURI == xlink) {
            name = "xlink:";
        } else {
            name = "";
        }
        name += attrs[i].name;
        out[name] = attrs[i].textContent;
    }
    return out;
}
function is(o, type) {
    type = Str.prototype.toLowerCase.call(type);
    if (type == "finite") {
        return isFinite(o);
    }
    if (type == "array" &&
        (o instanceof Array || Array.isArray && Array.isArray(o))) {
        return true;
    }
    return  type == "null" && o === null ||
            type == typeof o && o !== null ||
            type == "object" && o === Object(o) ||
            objectToString.call(o).slice(8, -1).toLowerCase() == type;
}
/*\
 * Snap.format
 [ method ]
 **
 * Replaces construction of type `{<name>}` to the corresponding argument
 **
 - token (string) string to format
 - json (object) object which properties are used as a replacement
 = (string) formatted string
 > Usage
 | // this draws a rectangular shape equivalent to "M10,20h40v50h-40z"
 | paper.path(Snap.format("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
 |     x: 10,
 |     y: 20,
 |     dim: {
 |         width: 40,
 |         height: 50,
 |         "negative width": -40
 |     }
 | }));
\*/
Snap.format = (function () {
    var tokenRegex = /\{([^\}]+)\}/g,
        objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
        replacer = function (all, key, obj) {
            var res = obj;
            key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                name = name || quotedName;
                if (res) {
                    if (name in res) {
                        res = res[name];
                    }
                    typeof res == "function" && isFunc && (res = res());
                }
            });
            res = (res == null || res == obj ? all : res) + "";
            return res;
        };
    return function (str, obj) {
        return Str(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
})();
function clone(obj) {
    if (typeof obj == "function" || Object(obj) !== obj) {
        return obj;
    }
    var res = new obj.constructor;
    for (var key in obj) if (obj[has](key)) {
        res[key] = clone(obj[key]);
    }
    return res;
}
Snap._.clone = clone;
function repush(array, item) {
    for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
        return array.push(array.splice(i, 1)[0]);
    }
}
function cacher(f, scope, postprocessor) {
    function newf() {
        var arg = Array.prototype.slice.call(arguments, 0),
            args = arg.join("\u2400"),
            cache = newf.cache = newf.cache || {},
            count = newf.count = newf.count || [];
        if (cache[has](args)) {
            repush(count, args);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        count.length >= 1e3 && delete cache[count.shift()];
        count.push(args);
        cache[args] = f.apply(scope, arg);
        return postprocessor ? postprocessor(cache[args]) : cache[args];
    }
    return newf;
}
Snap._.cacher = cacher;
function angle(x1, y1, x2, y2, x3, y3) {
    if (x3 == null) {
        var x = x1 - x2,
            y = y1 - y2;
        if (!x && !y) {
            return 0;
        }
        return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
    } else {
        return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
    }
}
function rad(deg) {
    return deg % 360 * PI / 180;
}
function deg(rad) {
    return rad * 180 / PI % 360;
}
function x_y() {
    return this.x + S + this.y;
}
function x_y_w_h() {
    return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
}

/*\
 * Snap.rad
 [ method ]
 **
 * Transform angle to radians
 - deg (number) angle in degrees
 = (number) angle in radians
\*/
Snap.rad = rad;
/*\
 * Snap.deg
 [ method ]
 **
 * Transform angle to degrees
 - rad (number) angle in radians
 = (number) angle in degrees
\*/
Snap.deg = deg;
/*\
 * Snap.sin
 [ method ]
 **
 * Equivalent to `Math.sin()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) sin
\*/
Snap.sin = function (angle) {
    return math.sin(Snap.rad(angle));
};
/*\
 * Snap.tan
 [ method ]
 **
 * Equivalent to `Math.tan()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) tan
\*/
Snap.tan = function (angle) {
    return math.tan(Snap.rad(angle));
};
/*\
 * Snap.cos
 [ method ]
 **
 * Equivalent to `Math.cos()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) cos
\*/
Snap.cos = function (angle) {
    return math.cos(Snap.rad(angle));
};
/*\
 * Snap.asin
 [ method ]
 **
 * Equivalent to `Math.asin()` only works with degrees, not radians.
 - num (number) value
 = (number) asin in degrees
\*/
Snap.asin = function (num) {
    return Snap.deg(math.asin(num));
};
/*\
 * Snap.acos
 [ method ]
 **
 * Equivalent to `Math.acos()` only works with degrees, not radians.
 - num (number) value
 = (number) acos in degrees
\*/
Snap.acos = function (num) {
    return Snap.deg(math.acos(num));
};
/*\
 * Snap.atan
 [ method ]
 **
 * Equivalent to `Math.atan()` only works with degrees, not radians.
 - num (number) value
 = (number) atan in degrees
\*/
Snap.atan = function (num) {
    return Snap.deg(math.atan(num));
};
/*\
 * Snap.atan2
 [ method ]
 **
 * Equivalent to `Math.atan2()` only works with degrees, not radians.
 - num (number) value
 = (number) atan2 in degrees
\*/
Snap.atan2 = function (num) {
    return Snap.deg(math.atan2(num));
};
/*\
 * Snap.angle
 [ method ]
 **
 * Returns an angle between two or three points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 - x3 (number) #optional x coord of third point
 - y3 (number) #optional y coord of third point
 = (number) angle in degrees
\*/
Snap.angle = angle;
/*\
 * Snap.len
 [ method ]
 **
 * Returns distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len = function (x1, y1, x2, y2) {
    return Math.sqrt(Snap.len2(x1, y1, x2, y2));
};
/*\
 * Snap.len2
 [ method ]
 **
 * Returns squared distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len2 = function (x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
};
/*\
 * Snap.closestPoint
 [ method ]
 **
 * Returns closest point to a given one on a given path.
 - path (Element) path element
 - x (number) x coord of a point
 - y (number) y coord of a point
 = (object) in format
 {
    x (number) x coord of the point on the path
    y (number) y coord of the point on the path
    length (number) length of the path to the point
    distance (number) distance from the given point to the path
 }
\*/
// Copied from http://bl.ocks.org/mbostock/8027637
Snap.closestPoint = function (path, x, y) {
    function distance2(p) {
        var dx = p.x - x,
            dy = p.y - y;
        return dx * dx + dy * dy;
    }
    var pathNode = path.node,
        pathLength = pathNode.getTotalLength(),
        precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision *= .5;
    while (precision > .5) {
        var before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
            best = before;
            bestLength = beforeLength;
            bestDistance = beforeDistance;
        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
            best = after;
            bestLength = afterLength;
            bestDistance = afterDistance;
        } else {
            precision *= .5;
        }
    }

    best = {
        x: best.x,
        y: best.y,
        length: bestLength,
        distance: Math.sqrt(bestDistance)
    };
    return best;
}
/*\
 * Snap.is
 [ method ]
 **
 * Handy replacement for the `typeof` operator
 - o (…) any object or primitive
 - type (string) name of the type, e.g., `string`, `function`, `number`, etc.
 = (boolean) `true` if given value is of given type
\*/
Snap.is = is;
/*\
 * Snap.snapTo
 [ method ]
 **
 * Snaps given value to given grid
 - values (array|number) given array of values or step of the grid
 - value (number) value to adjust
 - tolerance (number) #optional maximum distance to the target value that would trigger the snap. Default is `10`.
 = (number) adjusted value
\*/
Snap.snapTo = function (values, value, tolerance) {
    tolerance = is(tolerance, "finite") ? tolerance : 10;
    if (is(values, "array")) {
        var i = values.length;
        while (i--) if (abs(values[i] - value) <= tolerance) {
            return values[i];
        }
    } else {
        values = +values;
        var rem = value % values;
        if (rem < tolerance) {
            return value - rem;
        }
        if (rem > values - tolerance) {
            return value - rem + values;
        }
    }
    return value;
};
// Colour
/*\
 * Snap.getRGB
 [ method ]
 **
 * Parses color string as RGB object
 - color (string) color string in one of the following formats:
 # <ul>
 #     <li>Color name (<code>red</code>, <code>green</code>, <code>cornflowerblue</code>, etc)</li>
 #     <li>#••• — shortened HTML color: (<code>#000</code>, <code>#fc0</code>, etc.)</li>
 #     <li>#•••••• — full length HTML color: (<code>#000000</code>, <code>#bd2300</code>)</li>
 #     <li>rgb(•••, •••, •••) — red, green and blue channels values: (<code>rgb(200,&nbsp;100,&nbsp;0)</code>)</li>
 #     <li>rgba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>)</li>
 #     <li>rgba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>)</li>
 #     <li>hsba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsl(•••, •••, •••) — hue, saturation and luminosity values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;0.5)</code>)</li>
 #     <li>hsla(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsla(•••%, •••%, •••%, •••%) — also with opacity</li>
 # </ul>
 * Note that `%` can be used any time: `rgb(20%, 255, 50%)`.
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) true if string can't be parsed
 o }
\*/
Snap.getRGB = cacher(function (colour) {
    if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    if (colour == "none") {
        return {r: -1, g: -1, b: -1, hex: "none", toString: rgbtoString};
    }
    !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
    if (!colour) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    var res,
        red,
        green,
        blue,
        opacity,
        t,
        values,
        rgb = colour.match(colourRegExp);
    if (rgb) {
        if (rgb[2]) {
            blue = toInt(rgb[2].substring(5), 16);
            green = toInt(rgb[2].substring(3, 5), 16);
            red = toInt(rgb[2].substring(1, 3), 16);
        }
        if (rgb[3]) {
            blue = toInt((t = rgb[3].charAt(3)) + t, 16);
            green = toInt((t = rgb[3].charAt(2)) + t, 16);
            red = toInt((t = rgb[3].charAt(1)) + t, 16);
        }
        if (rgb[4]) {
            values = rgb[4].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red *= 2.55);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green *= 2.55);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue *= 2.55);
            rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
        }
        if (rgb[5]) {
            values = rgb[5].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsb2rgb(red, green, blue, opacity);
        }
        if (rgb[6]) {
            values = rgb[6].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsl2rgb(red, green, blue, opacity);
        }
        red = mmin(math.round(red), 255);
        green = mmin(math.round(green), 255);
        blue = mmin(math.round(blue), 255);
        opacity = mmin(mmax(opacity, 0), 1);
        rgb = {r: red, g: green, b: blue, toString: rgbtoString};
        rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1);
        rgb.opacity = is(opacity, "finite") ? opacity : 1;
        return rgb;
    }
    return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
}, Snap);
/*\
 * Snap.hsb
 [ method ]
 **
 * Converts HSB values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - b (number) value or brightness
 = (string) hex representation of the color
\*/
Snap.hsb = cacher(function (h, s, b) {
    return Snap.hsb2rgb(h, s, b).hex;
});
/*\
 * Snap.hsl
 [ method ]
 **
 * Converts HSL values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (string) hex representation of the color
\*/
Snap.hsl = cacher(function (h, s, l) {
    return Snap.hsl2rgb(h, s, l).hex;
});
/*\
 * Snap.rgb
 [ method ]
 **
 * Converts RGB values to a hex representation of the color
 - r (number) red
 - g (number) green
 - b (number) blue
 = (string) hex representation of the color
\*/
Snap.rgb = cacher(function (r, g, b, o) {
    if (is(o, "finite")) {
        var round = math.round;
        return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
    }
    return "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1);
});
var toHex = function (color) {
    var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0],
        red = "rgb(255, 0, 0)";
    toHex = cacher(function (color) {
        if (color.toLowerCase() == "red") {
            return red;
        }
        i.style.color = red;
        i.style.color = color;
        var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
        return out == red ? null : out;
    });
    return toHex(color);
},
hsbtoString = function () {
    return "hsb(" + [this.h, this.s, this.b] + ")";
},
hsltoString = function () {
    return "hsl(" + [this.h, this.s, this.l] + ")";
},
rgbtoString = function () {
    return this.opacity == 1 || this.opacity == null ?
            this.hex :
            "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
},
prepareRGB = function (r, g, b) {
    if (g == null && is(r, "object") && "r" in r && "g" in r && "b" in r) {
        b = r.b;
        g = r.g;
        r = r.r;
    }
    if (g == null && is(r, string)) {
        var clr = Snap.getRGB(r);
        r = clr.r;
        g = clr.g;
        b = clr.b;
    }
    if (r > 1 || g > 1 || b > 1) {
        r /= 255;
        g /= 255;
        b /= 255;
    }

    return [r, g, b];
},
packageRGB = function (r, g, b, o) {
    r = math.round(r * 255);
    g = math.round(g * 255);
    b = math.round(b * 255);
    var rgb = {
        r: r,
        g: g,
        b: b,
        opacity: is(o, "finite") ? o : 1,
        hex: Snap.rgb(r, g, b),
        toString: rgbtoString
    };
    is(o, "finite") && (rgb.opacity = o);
    return rgb;
};
/*\
 * Snap.color
 [ method ]
 **
 * Parses the color string and returns an object featuring the color's component values
 - clr (string) color string in one of the supported formats (see @Snap.getRGB)
 = (object) Combined RGB/HSB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) `true` if string can't be parsed,
 o     h (number) hue,
 o     s (number) saturation,
 o     v (number) value (brightness),
 o     l (number) lightness
 o }
\*/
Snap.color = function (clr) {
    var rgb;
    if (is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
        rgb = Snap.hsb2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else if (is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
        rgb = Snap.hsl2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else {
        if (is(clr, "string")) {
            clr = Snap.getRGB(clr);
        }
        if (is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr)) {
            rgb = Snap.rgb2hsl(clr);
            clr.h = rgb.h;
            clr.s = rgb.s;
            clr.l = rgb.l;
            rgb = Snap.rgb2hsb(clr);
            clr.v = rgb.b;
        } else {
            clr = {hex: "none"};
            clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            clr.error = 1;
        }
    }
    clr.toString = rgbtoString;
    return clr;
};
/*\
 * Snap.hsb2rgb
 [ method ]
 **
 * Converts HSB values to an RGB object
 - h (number) hue
 - s (number) saturation
 - v (number) value or brightness
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsb2rgb = function (h, s, v, o) {
    if (is(h, "object") && "h" in h && "s" in h && "b" in h) {
        v = h.b;
        s = h.s;
        o = h.o;
        h = h.h;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = v * s;
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = v - C;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.hsl2rgb
 [ method ]
 **
 * Converts HSL values to an RGB object
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsl2rgb = function (h, s, l, o) {
    if (is(h, "object") && "h" in h && "s" in h && "l" in h) {
        l = h.l;
        s = h.s;
        h = h.h;
    }
    if (h > 1 || s > 1 || l > 1) {
        h /= 360;
        s /= 100;
        l /= 100;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = 2 * s * (l < .5 ? l : 1 - l);
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = l - C / 2;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.rgb2hsb
 [ method ]
 **
 * Converts RGB values to an HSB object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSB object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     b (number) brightness
 o }
\*/
Snap.rgb2hsb = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, V, C;
    V = mmax(r, g, b);
    C = V - mmin(r, g, b);
    H = C == 0 ? null :
        V == r ? (g - b) / C :
        V == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    S = C == 0 ? 0 : C / V;
    return {h: H, s: S, b: V, toString: hsbtoString};
};
/*\
 * Snap.rgb2hsl
 [ method ]
 **
 * Converts RGB values to an HSL object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSL object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     l (number) luminosity
 o }
\*/
Snap.rgb2hsl = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, L, M, m, C;
    M = mmax(r, g, b);
    m = mmin(r, g, b);
    C = M - m;
    H = C == 0 ? null :
        M == r ? (g - b) / C :
        M == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    L = (M + m) / 2;
    S = C == 0 ? 0 :
         L < .5 ? C / (2 * L) :
                  C / (2 - 2 * L);
    return {h: H, s: S, l: L, toString: hsltoString};
};

// Transformations
/*\
 * Snap.parsePathString
 [ method ]
 **
 * Utility method
 **
 * Parses given path string into an array of arrays of path segments
 - pathString (string|array) path string or array of segments (in the last case it is returned straight away)
 = (array) array of segments
\*/
Snap.parsePathString = function (pathString) {
    if (!pathString) {
        return null;
    }
    var pth = Snap.path(pathString);
    if (pth.arr) {
        return Snap.path.clone(pth.arr);
    }

    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];
    if (is(pathString, "array") && is(pathString[0], "array")) { // rough assumption
        data = Snap.path.clone(pathString);
    }
    if (!data.length) {
        Str(pathString).replace(pathCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            if (name == "m" && params.length > 2) {
                data.push([b].concat(params.splice(0, 2)));
                name = "l";
                b = b == "m" ? "l" : "L";
            }
            if (name == "o" && params.length == 1) {
                data.push([b, params[0]]);
            }
            if (name == "r") {
                data.push([b].concat(params));
            } else while (params.length >= paramCounts[name]) {
                data.push([b].concat(params.splice(0, paramCounts[name])));
                if (!paramCounts[name]) {
                    break;
                }
            }
        });
    }
    data.toString = Snap.path.toString;
    pth.arr = Snap.path.clone(data);
    return data;
};
/*\
 * Snap.parseTransformString
 [ method ]
 **
 * Utility method
 **
 * Parses given transform string into an array of transformations
 - TString (string|array) transform string or array of transformations (in the last case it is returned straight away)
 = (array) array of transformations
\*/
var parseTransformString = Snap.parseTransformString = function (TString) {
    if (!TString) {
        return null;
    }
    var paramCounts = {r: 3, s: 4, t: 2, m: 6},
        data = [];
    if (is(TString, "array") && is(TString[0], "array")) { // rough assumption
        data = Snap.path.clone(TString);
    }
    if (!data.length) {
        Str(TString).replace(tCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            data.push([b].concat(params));
        });
    }
    data.toString = Snap.path.toString;
    return data;
};
function svgTransform2string(tstr) {
    var res = [];
    tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
        params = params.split(/\s*,\s*|\s+/);
        if (name == "rotate" && params.length == 1) {
            params.push(0, 0);
        }
        if (name == "scale") {
            if (params.length > 2) {
                params = params.slice(0, 2);
            } else if (params.length == 2) {
                params.push(0, 0);
            }
            if (params.length == 1) {
                params.push(params[0], 0, 0);
            }
        }
        if (name == "skewX") {
            res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
        } else if (name == "skewY") {
            res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
        } else {
            res.push([name.charAt(0)].concat(params));
        }
        return all;
    });
    return res;
}
Snap._.svgTransform2string = svgTransform2string;
Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
function transform2matrix(tstr, bbox) {
    var tdata = parseTransformString(tstr),
        m = new Snap.Matrix;
    if (tdata) {
        for (var i = 0, ii = tdata.length; i < ii; i++) {
            var t = tdata[i],
                tlen = t.length,
                command = Str(t[0]).toLowerCase(),
                absolute = t[0] != command,
                inver = absolute ? m.invert() : 0,
                x1,
                y1,
                x2,
                y2,
                bb;
            if (command == "t" && tlen == 2){
                m.translate(t[1], 0);
            } else if (command == "t" && tlen == 3) {
                if (absolute) {
                    x1 = inver.x(0, 0);
                    y1 = inver.y(0, 0);
                    x2 = inver.x(t[1], t[2]);
                    y2 = inver.y(t[1], t[2]);
                    m.translate(x2 - x1, y2 - y1);
                } else {
                    m.translate(t[1], t[2]);
                }
            } else if (command == "r") {
                if (tlen == 2) {
                    bb = bb || bbox;
                    m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.rotate(t[1], x2, y2);
                    } else {
                        m.rotate(t[1], t[2], t[3]);
                    }
                }
            } else if (command == "s") {
                if (tlen == 2 || tlen == 3) {
                    bb = bb || bbox;
                    m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.scale(t[1], t[1], x2, y2);
                    } else {
                        m.scale(t[1], t[1], t[2], t[3]);
                    }
                } else if (tlen == 5) {
                    if (absolute) {
                        x2 = inver.x(t[3], t[4]);
                        y2 = inver.y(t[3], t[4]);
                        m.scale(t[1], t[2], x2, y2);
                    } else {
                        m.scale(t[1], t[2], t[3], t[4]);
                    }
                }
            } else if (command == "m" && tlen == 7) {
                m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
            }
        }
    }
    return m;
}
Snap._.transform2matrix = transform2matrix;
Snap._unit2px = unit2px;
var contains = glob.doc.contains || glob.doc.compareDocumentPosition ?
    function (a, b) {
        var adown = a.nodeType == 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a == bup || !!(bup && bup.nodeType == 1 && (
                adown.contains ?
                    adown.contains(bup) :
                    a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
    } :
    function (a, b) {
        if (b) {
            while (b) {
                b = b.parentNode;
                if (b == a) {
                    return true;
                }
            }
        }
        return false;
    };
function getSomeDefs(el) {
    var p = el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) ||
            el.node.parentNode && wrap(el.node.parentNode) ||
            Snap.select("svg") ||
            Snap(0, 0),
        pdefs = p.select("defs"),
        defs  = pdefs == null ? false : pdefs.node;
    if (!defs) {
        defs = make("defs", p.node).node;
    }
    return defs;
}
function getSomeSVG(el) {
    return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
}
Snap._.getSomeDefs = getSomeDefs;
Snap._.getSomeSVG = getSomeSVG;
function unit2px(el, name, value) {
    var svg = getSomeSVG(el).node,
        out = {},
        mgr = svg.querySelector(".svg---mgr");
    if (!mgr) {
        mgr = $("rect");
        $(mgr, {x: -9e9, y: -9e9, width: 10, height: 10, "class": "svg---mgr", fill: "none"});
        svg.appendChild(mgr);
    }
    function getW(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {width: val});
        try {
            return mgr.getBBox().width;
        } catch (e) {
            return 0;
        }
    }
    function getH(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {height: val});
        try {
            return mgr.getBBox().height;
        } catch (e) {
            return 0;
        }
    }
    function set(nam, f) {
        if (name == null) {
            out[nam] = f(el.attr(nam) || 0);
        } else if (nam == name) {
            out = f(value == null ? el.attr(nam) || 0 : value);
        }
    }
    switch (el.type) {
        case "rect":
            set("rx", getW);
            set("ry", getH);
        case "image":
            set("width", getW);
            set("height", getH);
        case "text":
            set("x", getW);
            set("y", getH);
        break;
        case "circle":
            set("cx", getW);
            set("cy", getH);
            set("r", getW);
        break;
        case "ellipse":
            set("cx", getW);
            set("cy", getH);
            set("rx", getW);
            set("ry", getH);
        break;
        case "line":
            set("x1", getW);
            set("x2", getW);
            set("y1", getH);
            set("y2", getH);
        break;
        case "marker":
            set("refX", getW);
            set("markerWidth", getW);
            set("refY", getH);
            set("markerHeight", getH);
        break;
        case "radialGradient":
            set("fx", getW);
            set("fy", getH);
        break;
        case "tspan":
            set("dx", getW);
            set("dy", getH);
        break;
        default:
            set(name, getW);
    }
    svg.removeChild(mgr);
    return out;
}
/*\
 * Snap.select
 [ method ]
 **
 * Wraps a DOM element specified by CSS selector as @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.select = function (query) {
    query = Str(query).replace(/([^\\]):/g, "$1\\:");
    return wrap(glob.doc.querySelector(query));
};
/*\
 * Snap.selectAll
 [ method ]
 **
 * Wraps DOM elements specified by CSS selector as set or array of @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.selectAll = function (query) {
    var nodelist = glob.doc.querySelectorAll(query),
        set = (Snap.set || Array)();
    for (var i = 0; i < nodelist.length; i++) {
        set.push(wrap(nodelist[i]));
    }
    return set;
};

function add2group(list) {
    if (!is(list, "array")) {
        list = Array.prototype.slice.call(arguments, 0);
    }
    var i = 0,
        j = 0,
        node = this.node;
    while (this[i]) delete this[i++];
    for (i = 0; i < list.length; i++) {
        if (list[i].type == "set") {
            list[i].forEach(function (el) {
                node.appendChild(el.node);
            });
        } else {
            node.appendChild(list[i].node);
        }
    }
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        this[j++] = wrap(children[i]);
    }
    return this;
}
// Hub garbage collector every 10s
setInterval(function () {
    for (var key in hub) if (hub[has](key)) {
        var el = hub[key],
            node = el.node;
        if (el.type != "svg" && !node.ownerSVGElement || el.type == "svg" && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) {
            delete hub[key];
        }
    }
}, 1e4);
function Element(el) {
    if (el.snap in hub) {
        return hub[el.snap];
    }
    var svg;
    try {
        svg = el.ownerSVGElement;
    } catch(e) {}
    /*\
     * Element.node
     [ property (object) ]
     **
     * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
     > Usage
     | // draw a circle at coordinate 10,10 with radius of 10
     | var c = paper.circle(10, 10, 10);
     | c.node.onclick = function () {
     |     c.attr("fill", "red");
     | };
    \*/
    this.node = el;
    if (svg) {
        this.paper = new Paper(svg);
    }
    /*\
     * Element.type
     [ property (string) ]
     **
     * SVG tag name of the given element.
    \*/
    this.type = el.tagName || el.nodeName;
    var id = this.id = ID(this);
    this.anims = {};
    this._ = {
        transform: []
    };
    el.snap = id;
    hub[id] = this;
    if (this.type == "g") {
        this.add = add2group;
    }
    if (this.type in {g: 1, mask: 1, pattern: 1, symbol: 1}) {
        for (var method in Paper.prototype) if (Paper.prototype[has](method)) {
            this[method] = Paper.prototype[method];
        }
    }
}
   /*\
     * Element.attr
     [ method ]
     **
     * Gets or sets given attributes of the element.
     **
     - params (object) contains key-value pairs of attributes you want to set
     * or
     - param (string) name of the attribute
     = (Element) the current element
     * or
     = (string) value of attribute
     > Usage
     | el.attr({
     |     fill: "#fc0",
     |     stroke: "#000",
     |     strokeWidth: 2, // CamelCase...
     |     "fill-opacity": 0.5, // or dash-separated names
     |     width: "*=2" // prefixed values
     | });
     | console.log(el.attr("fill")); // #fc0
     * Prefixed values in format `"+=10"` supported. All four operations
     * (`+`, `-`, `*` and `/`) could be used. Optionally you can use units for `+`
     * and `-`: `"+=2em"`.
    \*/
    Element.prototype.attr = function (params, value) {
        var el = this,
            node = el.node;
        if (!params) {
            if (node.nodeType != 1) {
                return {
                    text: node.nodeValue
                };
            }
            var attr = node.attributes,
                out = {};
            for (var i = 0, ii = attr.length; i < ii; i++) {
                out[attr[i].nodeName] = attr[i].nodeValue;
            }
            return out;
        }
        if (is(params, "string")) {
            if (arguments.length > 1) {
                var json = {};
                json[params] = value;
                params = json;
            } else {
                return eve("snap.util.getattr." + params, el).firstDefined();
            }
        }
        for (var att in params) {
            if (params[has](att)) {
                eve("snap.util.attr." + att, el, params[att]);
            }
        }
        return el;
    };
/*\
 * Snap.parse
 [ method ]
 **
 * Parses SVG fragment and converts it into a @Fragment
 **
 - svg (string) SVG string
 = (Fragment) the @Fragment
\*/
Snap.parse = function (svg) {
    var f = glob.doc.createDocumentFragment(),
        full = true,
        div = glob.doc.createElement("div");
    svg = Str(svg);
    if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
        svg = "<svg>" + svg + "</svg>";
        full = false;
    }
    div.innerHTML = svg;
    svg = div.getElementsByTagName("svg")[0];
    if (svg) {
        if (full) {
            f = svg;
        } else {
            while (svg.firstChild) {
                f.appendChild(svg.firstChild);
            }
        }
    }
    return new Fragment(f);
};
function Fragment(frag) {
    this.node = frag;
}
/*\
 * Snap.fragment
 [ method ]
 **
 * Creates a DOM fragment from a given list of elements or strings
 **
 - varargs (…) SVG string
 = (Fragment) the @Fragment
\*/
Snap.fragment = function () {
    var args = Array.prototype.slice.call(arguments, 0),
        f = glob.doc.createDocumentFragment();
    for (var i = 0, ii = args.length; i < ii; i++) {
        var item = args[i];
        if (item.node && item.node.nodeType) {
            f.appendChild(item.node);
        }
        if (item.nodeType) {
            f.appendChild(item);
        }
        if (typeof item == "string") {
            f.appendChild(Snap.parse(item).node);
        }
    }
    return new Fragment(f);
};

function make(name, parent) {
    var res = $(name);
    parent.appendChild(res);
    var el = wrap(res);
    return el;
}
function Paper(w, h) {
    var res,
        desc,
        defs,
        proto = Paper.prototype;
    if (w && w.tagName && w.tagName.toLowerCase() == "svg") {
        if (w.snap in hub) {
            return hub[w.snap];
        }
        var doc = w.ownerDocument;
        res = new Element(w);
        desc = w.getElementsByTagName("desc")[0];
        defs = w.getElementsByTagName("defs")[0];
        if (!desc) {
            desc = $("desc");
            desc.appendChild(doc.createTextNode("Created with Snap"));
            res.node.appendChild(desc);
        }
        if (!defs) {
            defs = $("defs");
            res.node.appendChild(defs);
        }
        res.defs = defs;
        for (var key in proto) if (proto[has](key)) {
            res[key] = proto[key];
        }
        res.paper = res.root = res;
    } else {
        res = make("svg", glob.doc.body);
        $(res.node, {
            height: h,
            version: 1.1,
            width: w,
            xmlns: xmlns
        });
    }
    return res;
}
function wrap(dom) {
    if (!dom) {
        return dom;
    }
    if (dom instanceof Element || dom instanceof Fragment) {
        return dom;
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "svg") {
        return new Paper(dom);
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "object" && dom.type == "image/svg+xml") {
        return new Paper(dom.contentDocument.getElementsByTagName("svg")[0]);
    }
    return new Element(dom);
}

Snap._.make = make;
Snap._.wrap = wrap;
/*\
 * Paper.el
 [ method ]
 **
 * Creates an element on paper with a given name and no attributes
 **
 - name (string) tag name
 - attr (object) attributes
 = (Element) the current element
 > Usage
 | var c = paper.circle(10, 10, 10); // is the same as...
 | var c = paper.el("circle").attr({
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
 | // and the same as
 | var c = paper.el("circle", {
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
\*/
Paper.prototype.el = function (name, attr) {
    var el = make(name, this.node);
    attr && el.attr(attr);
    return el;
};
/*\
 * Element.children
 [ method ]
 **
 * Returns array of all the children of the element.
 = (array) array of Elements
\*/
Element.prototype.children = function () {
    var out = [],
        ch = this.node.childNodes;
    for (var i = 0, ii = ch.length; i < ii; i++) {
        out[i] = Snap(ch[i]);
    }
    return out;
};
function jsonFiller(root, o) {
    for (var i = 0, ii = root.length; i < ii; i++) {
        var item = {
                type: root[i].type,
                attr: root[i].attr()
            },
            children = root[i].children();
        o.push(item);
        if (children.length) {
            jsonFiller(children, item.childNodes = []);
        }
    }
}
/*\
 * Element.toJSON
 [ method ]
 **
 * Returns object representation of the given element and all its children.
 = (object) in format
 o {
 o     type (string) this.type,
 o     attr (object) attributes map,
 o     childNodes (array) optional array of children in the same format
 o }
\*/
Element.prototype.toJSON = function () {
    var out = [];
    jsonFiller([this], out);
    return out[0];
};
// default
eve.on("snap.util.getattr", function () {
    var att = eve.nt();
    att = att.substring(att.lastIndexOf(".") + 1);
    var css = att.replace(/[A-Z]/g, function (letter) {
        return "-" + letter.toLowerCase();
    });
    if (cssAttr[has](css)) {
        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css);
    } else {
        return $(this.node, att);
    }
});
var cssAttr = {
    "alignment-baseline": 0,
    "baseline-shift": 0,
    "clip": 0,
    "clip-path": 0,
    "clip-rule": 0,
    "color": 0,
    "color-interpolation": 0,
    "color-interpolation-filters": 0,
    "color-profile": 0,
    "color-rendering": 0,
    "cursor": 0,
    "direction": 0,
    "display": 0,
    "dominant-baseline": 0,
    "enable-background": 0,
    "fill": 0,
    "fill-opacity": 0,
    "fill-rule": 0,
    "filter": 0,
    "flood-color": 0,
    "flood-opacity": 0,
    "font": 0,
    "font-family": 0,
    "font-size": 0,
    "font-size-adjust": 0,
    "font-stretch": 0,
    "font-style": 0,
    "font-variant": 0,
    "font-weight": 0,
    "glyph-orientation-horizontal": 0,
    "glyph-orientation-vertical": 0,
    "image-rendering": 0,
    "kerning": 0,
    "letter-spacing": 0,
    "lighting-color": 0,
    "marker": 0,
    "marker-end": 0,
    "marker-mid": 0,
    "marker-start": 0,
    "mask": 0,
    "opacity": 0,
    "overflow": 0,
    "pointer-events": 0,
    "shape-rendering": 0,
    "stop-color": 0,
    "stop-opacity": 0,
    "stroke": 0,
    "stroke-dasharray": 0,
    "stroke-dashoffset": 0,
    "stroke-linecap": 0,
    "stroke-linejoin": 0,
    "stroke-miterlimit": 0,
    "stroke-opacity": 0,
    "stroke-width": 0,
    "text-anchor": 0,
    "text-decoration": 0,
    "text-rendering": 0,
    "unicode-bidi": 0,
    "visibility": 0,
    "word-spacing": 0,
    "writing-mode": 0
};

eve.on("snap.util.attr", function (value) {
    var att = eve.nt(),
        attr = {};
    att = att.substring(att.lastIndexOf(".") + 1);
    attr[att] = value;
    var style = att.replace(/-(\w)/gi, function (all, letter) {
            return letter.toUpperCase();
        }),
        css = att.replace(/[A-Z]/g, function (letter) {
            return "-" + letter.toLowerCase();
        });
    if (cssAttr[has](css)) {
        this.node.style[style] = value == null ? E : value;
    } else {
        $(this.node, attr);
    }
});
(function (proto) {}(Paper.prototype));

// simple ajax
/*\
 * Snap.ajax
 [ method ]
 **
 * Simple implementation of Ajax
 **
 - url (string) URL
 - postData (object|string) data for post request
 - callback (function) callback
 - scope (object) #optional scope of callback
 * or
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
 = (XMLHttpRequest) the XMLHttpRequest object, just in case
\*/
Snap.ajax = function (url, postData, callback, scope){
    var req = new XMLHttpRequest,
        id = ID();
    if (req) {
        if (is(postData, "function")) {
            scope = callback;
            callback = postData;
            postData = null;
        } else if (is(postData, "object")) {
            var pd = [];
            for (var key in postData) if (postData.hasOwnProperty(key)) {
                pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
            }
            postData = pd.join("&");
        }
        req.open(postData ? "POST" : "GET", url, true);
        if (postData) {
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        if (callback) {
            eve.once("snap.ajax." + id + ".0", callback);
            eve.once("snap.ajax." + id + ".200", callback);
            eve.once("snap.ajax." + id + ".304", callback);
        }
        req.onreadystatechange = function() {
            if (req.readyState != 4) return;
            eve("snap.ajax." + id + "." + req.status, scope, req);
        };
        if (req.readyState == 4) {
            return req;
        }
        req.send(postData);
        return req;
    }
};
/*\
 * Snap.load
 [ method ]
 **
 * Loads external SVG file as a @Fragment (see @Snap.ajax for more advanced AJAX)
 **
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
\*/
Snap.load = function (url, callback, scope) {
    Snap.ajax(url, function (req) {
        var f = Snap.parse(req.responseText);
        scope ? callback.call(scope, f) : callback(f);
    });
};
var getOffset = function (elem) {
    var box = elem.getBoundingClientRect(),
        doc = elem.ownerDocument,
        body = doc.body,
        docElem = doc.documentElement,
        clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
        left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
    return {
        y: top,
        x: left
    };
};
/*\
 * Snap.getElementByPoint
 [ method ]
 **
 * Returns you topmost element under given point.
 **
 = (object) Snap element object
 - x (number) x coordinate from the top left corner of the window
 - y (number) y coordinate from the top left corner of the window
 > Usage
 | Snap.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
\*/
Snap.getElementByPoint = function (x, y) {
    var paper = this,
        svg = paper.canvas,
        target = glob.doc.elementFromPoint(x, y);
    if (glob.win.opera && target.tagName == "svg") {
        var so = getOffset(target),
            sr = target.createSVGRect();
        sr.x = x - so.x;
        sr.y = y - so.y;
        sr.width = sr.height = 1;
        var hits = target.getIntersectionList(sr, null);
        if (hits.length) {
            target = hits[hits.length - 1];
        }
    }
    if (!target) {
        return null;
    }
    return wrap(target);
};
/*\
 * Snap.plugin
 [ method ]
 **
 * Let you write plugins. You pass in a function with five arguments, like this:
 | Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
 |     Snap.newmethod = function () {};
 |     Element.prototype.newmethod = function () {};
 |     Paper.prototype.newmethod = function () {};
 | });
 * Inside the function you have access to all main objects (and their
 * prototypes). This allow you to extend anything you want.
 **
 - f (function) your plugin body
\*/
Snap.plugin = function (f) {
    f(Snap, Element, Paper, glob, Fragment);
};
glob.win.Snap = Snap;
return Snap;
}(window || this));

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        unit2px = Snap._unit2px,
        $ = Snap._.$,
        make = Snap._.make,
        getSomeDefs = Snap._.getSomeDefs,
        has = "hasOwnProperty",
        wrap = Snap._.wrap;
    /*\
     * Element.getBBox
     [ method ]
     **
     * Returns the bounding box descriptor for the given element
     **
     = (object) bounding box descriptor:
     o {
     o     cx: (number) x of the center,
     o     cy: (number) x of the center,
     o     h: (number) height,
     o     height: (number) height,
     o     path: (string) path command for the box,
     o     r0: (number) radius of a circle that fully encloses the box,
     o     r1: (number) radius of the smallest circle that can be enclosed,
     o     r2: (number) radius of the largest circle that can be enclosed,
     o     vb: (string) box as a viewbox command,
     o     w: (number) width,
     o     width: (number) width,
     o     x2: (number) x of the right side,
     o     x: (number) x of the left side,
     o     y2: (number) y of the bottom edge,
     o     y: (number) y of the top edge
     o }
    \*/
    elproto.getBBox = function (isWithoutTransform) {
        if (this.type == "tspan") {
            return Snap._.box(this.node.getClientRects().item(0));
        }
        if (!Snap.Matrix || !Snap.path) {
            return this.node.getBBox();
        }
        var el = this,
            m = new Snap.Matrix;
        if (el.removed) {
            return Snap._.box();
        }
        while (el.type == "use") {
            if (!isWithoutTransform) {
                m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0));
            }
            if (el.original) {
                el = el.original;
            } else {
                var href = el.attr("xlink:href");
                el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
            }
        }
        var _ = el._,
            pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
        try {
            if (isWithoutTransform) {
                _.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox());
                return Snap._.box(_.bboxwt);
            } else {
                el.realPath = pathfinder(el);
                el.matrix = el.transform().localMatrix;
                _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix)));
                return Snap._.box(_.bbox);
            }
        } catch (e) {
            // Firefox doesn’t give you bbox of hidden element
            return Snap._.box();
        }
    };
    var propString = function () {
        return this.string;
    };
    function extractTransform(el, tstr) {
        if (tstr == null) {
            var doReturn = true;
            if (el.type == "linearGradient" || el.type == "radialGradient") {
                tstr = el.node.getAttribute("gradientTransform");
            } else if (el.type == "pattern") {
                tstr = el.node.getAttribute("patternTransform");
            } else {
                tstr = el.node.getAttribute("transform");
            }
            if (!tstr) {
                return new Snap.Matrix;
            }
            tstr = Snap._.svgTransform2string(tstr);
        } else {
            if (!Snap._.rgTransform.test(tstr)) {
                tstr = Snap._.svgTransform2string(tstr);
            } else {
                tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || "");
            }
            if (is(tstr, "array")) {
                tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr);
            }
            el._.transform = tstr;
        }
        var m = Snap._.transform2matrix(tstr, el.getBBox(1));
        if (doReturn) {
            return m;
        } else {
            el.matrix = m;
        }
    }
    /*\
     * Element.transform
     [ method ]
     **
     * Gets or sets transformation of the element
     **
     - tstr (string) transform string in Snap or SVG format
     = (Element) the current element
     * or
     = (object) transformation descriptor:
     o {
     o     string (string) transform string,
     o     globalMatrix (Matrix) matrix of all transformations applied to element or its parents,
     o     localMatrix (Matrix) matrix of transformations applied only to the element,
     o     diffMatrix (Matrix) matrix of difference between global and local transformations,
     o     global (string) global transformation as string,
     o     local (string) local transformation as string,
     o     toString (function) returns `string` property
     o }
    \*/
    elproto.transform = function (tstr) {
        var _ = this._;
        if (tstr == null) {
            var papa = this,
                global = new Snap.Matrix(this.node.getCTM()),
                local = extractTransform(this),
                ms = [local],
                m = new Snap.Matrix,
                i,
                localString = local.toTransformString(),
                string = Str(local) == Str(this.matrix) ?
                            Str(_.transform) : localString;
            while (papa.type != "svg" && (papa = papa.parent())) {
                ms.push(extractTransform(papa));
            }
            i = ms.length;
            while (i--) {
                m.add(ms[i]);
            }
            return {
                string: string,
                globalMatrix: global,
                totalMatrix: m,
                localMatrix: local,
                diffMatrix: global.clone().add(local.invert()),
                global: global.toTransformString(),
                total: m.toTransformString(),
                local: localString,
                toString: propString
            };
        }
        if (tstr instanceof Snap.Matrix) {
            this.matrix = tstr;
            this._.transform = tstr.toTransformString();
        } else {
            extractTransform(this, tstr);
        }

        if (this.node) {
            if (this.type == "linearGradient" || this.type == "radialGradient") {
                $(this.node, {gradientTransform: this.matrix});
            } else if (this.type == "pattern") {
                $(this.node, {patternTransform: this.matrix});
            } else {
                $(this.node, {transform: this.matrix});
            }
        }

        return this;
    };
    /*\
     * Element.parent
     [ method ]
     **
     * Returns the element's parent
     **
     = (Element) the parent element
    \*/
    elproto.parent = function () {
        return wrap(this.node.parentNode);
    };
    /*\
     * Element.append
     [ method ]
     **
     * Appends the given element to current one
     **
     - el (Element|Set) element to append
     = (Element) the parent element
    \*/
    /*\
     * Element.add
     [ method ]
     **
     * See @Element.append
    \*/
    elproto.append = elproto.add = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this;
                el.forEach(function (el) {
                    it.add(el);
                });
                return this;
            }
            el = wrap(el);
            this.node.appendChild(el.node);
            el.paper = this.paper;
        }
        return this;
    };
    /*\
     * Element.appendTo
     [ method ]
     **
     * Appends the current element to the given one
     **
     - el (Element) parent element to append to
     = (Element) the child element
    \*/
    elproto.appendTo = function (el) {
        if (el) {
            el = wrap(el);
            el.append(this);
        }
        return this;
    };
    /*\
     * Element.prepend
     [ method ]
     **
     * Prepends the given element to the current one
     **
     - el (Element) element to prepend
     = (Element) the parent element
    \*/
    elproto.prepend = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this,
                    first;
                el.forEach(function (el) {
                    if (first) {
                        first.after(el);
                    } else {
                        it.prepend(el);
                    }
                    first = el;
                });
                return this;
            }
            el = wrap(el);
            var parent = el.parent();
            this.node.insertBefore(el.node, this.node.firstChild);
            this.add && this.add();
            el.paper = this.paper;
            this.parent() && this.parent().add();
            parent && parent.add();
        }
        return this;
    };
    /*\
     * Element.prependTo
     [ method ]
     **
     * Prepends the current element to the given one
     **
     - el (Element) parent element to prepend to
     = (Element) the child element
    \*/
    elproto.prependTo = function (el) {
        el = wrap(el);
        el.prepend(this);
        return this;
    };
    /*\
     * Element.before
     [ method ]
     **
     * Inserts given element before the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.before = function (el) {
        if (el.type == "set") {
            var it = this;
            el.forEach(function (el) {
                var parent = el.parent();
                it.node.parentNode.insertBefore(el.node, it.node);
                parent && parent.add();
            });
            this.parent().add();
            return this;
        }
        el = wrap(el);
        var parent = el.parent();
        this.node.parentNode.insertBefore(el.node, this.node);
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.after
     [ method ]
     **
     * Inserts given element after the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.after = function (el) {
        el = wrap(el);
        var parent = el.parent();
        if (this.node.nextSibling) {
            this.node.parentNode.insertBefore(el.node, this.node.nextSibling);
        } else {
            this.node.parentNode.appendChild(el.node);
        }
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.insertBefore
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertBefore = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.insertAfter
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertAfter = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node.nextSibling);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.remove
     [ method ]
     **
     * Removes element from the DOM
     = (Element) the detached element
    \*/
    elproto.remove = function () {
        var parent = this.parent();
        this.node.parentNode && this.node.parentNode.removeChild(this.node);
        delete this.paper;
        this.removed = true;
        parent && parent.add();
        return this;
    };
    /*\
     * Element.select
     [ method ]
     **
     * Gathers the nested @Element matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Element) result of query selection
    \*/
    elproto.select = function (query) {
        return wrap(this.node.querySelector(query));
    };
    /*\
     * Element.selectAll
     [ method ]
     **
     * Gathers nested @Element objects matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Set|array) result of query selection
    \*/
    elproto.selectAll = function (query) {
        var nodelist = this.node.querySelectorAll(query),
            set = (Snap.set || Array)();
        for (var i = 0; i < nodelist.length; i++) {
            set.push(wrap(nodelist[i]));
        }
        return set;
    };
    /*\
     * Element.asPX
     [ method ]
     **
     * Returns given attribute of the element as a `px` value (not %, em, etc.)
     **
     - attr (string) attribute name
     - value (string) #optional attribute value
     = (Element) result of query selection
    \*/
    elproto.asPX = function (attr, value) {
        if (value == null) {
            value = this.attr(attr);
        }
        return +unit2px(this, attr, value);
    };
    // SIERRA Element.use(): I suggest adding a note about how to access the original element the returned <use> instantiates. It's a part of SVG with which ordinary web developers may be least familiar.
    /*\
     * Element.use
     [ method ]
     **
     * Creates a `<use>` element linked to the current element
     **
     = (Element) the `<use>` element
    \*/
    elproto.use = function () {
        var use,
            id = this.node.id;
        if (!id) {
            id = this.id;
            $(this.node, {
                id: id
            });
        }
        if (this.type == "linearGradient" || this.type == "radialGradient" ||
            this.type == "pattern") {
            use = make(this.type, this.node.parentNode);
        } else {
            use = make("use", this.node.parentNode);
        }
        $(use.node, {
            "xlink:href": "#" + id
        });
        use.original = this;
        return use;
    };
    function fixids(el) {
        var els = el.selectAll("*"),
            it,
            url = /^\s*url\(("|'|)(.*)\1\)\s*$/,
            ids = [],
            uses = {};
        function urltest(it, name) {
            var val = $(it.node, name);
            val = val && val.match(url);
            val = val && val[2];
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    var attr = {};
                    attr[name] = Snap.url(id);
                    $(it.node, attr);
                });
            }
        }
        function linktest(it) {
            var val = $(it.node, "xlink:href");
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    it.attr("xlink:href", "#" + id);
                });
            }
        }
        for (var i = 0, ii = els.length; i < ii; i++) {
            it = els[i];
            urltest(it, "fill");
            urltest(it, "stroke");
            urltest(it, "filter");
            urltest(it, "mask");
            urltest(it, "clip-path");
            linktest(it);
            var oldid = $(it.node, "id");
            if (oldid) {
                $(it.node, {id: it.id});
                ids.push({
                    old: oldid,
                    id: it.id
                });
            }
        }
        for (i = 0, ii = ids.length; i < ii; i++) {
            var fs = uses[ids[i].old];
            if (fs) {
                for (var j = 0, jj = fs.length; j < jj; j++) {
                    fs[j](ids[i].id);
                }
            }
        }
    }
    /*\
     * Element.clone
     [ method ]
     **
     * Creates a clone of the element and inserts it after the element
     **
     = (Element) the clone
    \*/
    elproto.clone = function () {
        var clone = wrap(this.node.cloneNode(true));
        if ($(clone.node, "id")) {
            $(clone.node, {id: clone.id});
        }
        fixids(clone);
        clone.insertAfter(this);
        return clone;
    };
    /*\
     * Element.toDefs
     [ method ]
     **
     * Moves element to the shared `<defs>` area
     **
     = (Element) the element
    \*/
    elproto.toDefs = function () {
        var defs = getSomeDefs(this);
        defs.appendChild(this.node);
        return this;
    };
    /*\
     * Element.toPattern
     [ method ]
     **
     * Creates a `<pattern>` element from the current element
     **
     * To create a pattern you have to specify the pattern rect:
     - x (string|number)
     - y (string|number)
     - width (string|number)
     - height (string|number)
     = (Element) the `<pattern>` element
     * You can use pattern later on as an argument for `fill` attribute:
     | var p = paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
     |         fill: "none",
     |         stroke: "#bada55",
     |         strokeWidth: 5
     |     }).pattern(0, 0, 10, 10),
     |     c = paper.circle(200, 200, 100);
     | c.attr({
     |     fill: p
     | });
    \*/
    elproto.pattern = elproto.toPattern = function (x, y, width, height) {
        var p = make("pattern", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        $(p.node, {
            x: x,
            y: y,
            width: width,
            height: height,
            patternUnits: "userSpaceOnUse",
            id: p.id,
            viewBox: [x, y, width, height].join(" ")
        });
        p.node.appendChild(this.node);
        return p;
    };
// SIERRA Element.marker(): clarify what a reference point is. E.g., helps you offset the object from its edge such as when centering it over a path.
// SIERRA Element.marker(): I suggest the method should accept default reference point values.  Perhaps centered with (refX = width/2) and (refY = height/2)? Also, couldn't it assume the element's current _width_ and _height_? And please specify what _x_ and _y_ mean: offsets? If so, from where?  Couldn't they also be assigned default values?
    /*\
     * Element.marker
     [ method ]
     **
     * Creates a `<marker>` element from the current element
     **
     * To create a marker you have to specify the bounding rect and reference point:
     - x (number)
     - y (number)
     - width (number)
     - height (number)
     - refX (number)
     - refY (number)
     = (Element) the `<marker>` element
     * You can specify the marker later as an argument for `marker-start`, `marker-end`, `marker-mid`, and `marker` attributes. The `marker` attribute places the marker at every point along the path, and `marker-mid` places them at every point except the start and end.
    \*/
    // TODO add usage for markers
    elproto.marker = function (x, y, width, height, refX, refY) {
        var p = make("marker", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            refX = x.refX || x.cx;
            refY = x.refY || x.cy;
            x = x.x;
        }
        $(p.node, {
            viewBox: [x, y, width, height].join(" "),
            markerWidth: width,
            markerHeight: height,
            orient: "auto",
            refX: refX || 0,
            refY: refY || 0,
            id: p.id
        });
        p.node.appendChild(this.node);
        return p;
    };
    var eldata = {};
    /*\
     * Element.data
     [ method ]
     **
     * Adds or retrieves given value associated with given key. (Don’t confuse
     * with `data-` attributes)
     *
     * See also @Element.removeData
     - key (string) key to store data
     - value (any) #optional value to store
     = (object) @Element
     * or, if value is not specified:
     = (any) value
     > Usage
     | for (var i = 0, i < 5, i++) {
     |     paper.circle(10 + 15 * i, 10, 10)
     |          .attr({fill: "#000"})
     |          .data("i", i)
     |          .click(function () {
     |             alert(this.data("i"));
     |          });
     | }
    \*/
    elproto.data = function (key, value) {
        var data = eldata[this.id] = eldata[this.id] || {};
        if (arguments.length == 0){
            eve("snap.data.get." + this.id, this, data, null);
            return data;
        }
        if (arguments.length == 1) {
            if (Snap.is(key, "object")) {
                for (var i in key) if (key[has](i)) {
                    this.data(i, key[i]);
                }
                return this;
            }
            eve("snap.data.get." + this.id, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        eve("snap.data.set." + this.id, this, value, key);
        return this;
    };
    /*\
     * Element.removeData
     [ method ]
     **
     * Removes value associated with an element by given key.
     * If key is not provided, removes all the data of the element.
     - key (string) #optional key
     = (object) @Element
    \*/
    elproto.removeData = function (key) {
        if (key == null) {
            eldata[this.id] = {};
        } else {
            eldata[this.id] && delete eldata[this.id][key];
        }
        return this;
    };
    /*\
     * Element.outerSVG
     [ method ]
     **
     * Returns SVG code for the element, equivalent to HTML's `outerHTML`.
     *
     * See also @Element.innerSVG
     = (string) SVG code for the element
    \*/
    /*\
     * Element.toString
     [ method ]
     **
     * See @Element.outerSVG
    \*/
    elproto.outerSVG = elproto.toString = toString(1);
    /*\
     * Element.innerSVG
     [ method ]
     **
     * Returns SVG code for the element's contents, equivalent to HTML's `innerHTML`
     = (string) SVG code for the element
    \*/
    elproto.innerSVG = toString();
    function toString(type) {
        return function () {
            var res = type ? "<" + this.type : "",
                attr = this.node.attributes,
                chld = this.node.childNodes;
            if (type) {
                for (var i = 0, ii = attr.length; i < ii; i++) {
                    res += " " + attr[i].name + '="' +
                            attr[i].value.replace(/"/g, '\\"') + '"';
                }
            }
            if (chld.length) {
                type && (res += ">");
                for (i = 0, ii = chld.length; i < ii; i++) {
                    if (chld[i].nodeType == 3) {
                        res += chld[i].nodeValue;
                    } else if (chld[i].nodeType == 1) {
                        res += wrap(chld[i]).toString();
                    }
                }
                type && (res += "</" + this.type + ">");
            } else {
                type && (res += "/>");
            }
            return res;
        };
    }
    elproto.toDataURL = function () {
        if (window && window.btoa) {
            var bb = this.getBBox(),
                svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                x: +bb.x.toFixed(3),
                y: +bb.y.toFixed(3),
                width: +bb.width.toFixed(3),
                height: +bb.height.toFixed(3),
                contents: this.outerSVG()
            });
            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
        }
    };
    /*\
     * Fragment.select
     [ method ]
     **
     * See @Element.select
    \*/
    Fragment.prototype.select = elproto.select;
    /*\
     * Fragment.selectAll
     [ method ]
     **
     * See @Element.selectAll
    \*/
    Fragment.prototype.selectAll = elproto.selectAll;
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var objectToString = Object.prototype.toString,
        Str = String,
        math = Math,
        E = "";
    function Matrix(a, b, c, d, e, f) {
        if (b == null && objectToString.call(a) == "[object SVGMatrix]") {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
            this.e = a.e;
            this.f = a.f;
            return;
        }
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function (matrixproto) {
        /*\
         * Matrix.add
         [ method ]
         **
         * Adds the given matrix to existing one
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        matrixproto.add = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.add(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + b * this.c,
                bNew = a * this.b + b * this.d;
            this.e += e * this.a + f * this.c;
            this.f += e * this.b + f * this.d;
            this.c = c * this.a + d * this.c;
            this.d = c * this.b + d * this.d;

            this.a = aNew;
            this.b = bNew;
            return this;
        };
        /*\
         * Matrix.multLeft
         [ method ]
         **
         * Multiplies a passed affine transform to the left: M * this.
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        Matrix.prototype.multLeft = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.multLeft(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + c * this.b,
                cNew = a * this.c + c * this.d,
                eNew = a * this.e + c * this.f + e;
            this.b = b * this.a + d * this.b;
            this.d = b * this.c + d * this.d;
            this.f = b * this.e + d * this.f + f;

            this.a = aNew;
            this.c = cNew;
            this.e = eNew;
            return this;
        };
        /*\
         * Matrix.invert
         [ method ]
         **
         * Returns an inverted version of the matrix
         = (object) @Matrix
        \*/
        matrixproto.invert = function () {
            var me = this,
                x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        /*\
         * Matrix.clone
         [ method ]
         **
         * Returns a copy of the matrix
         = (object) @Matrix
        \*/
        matrixproto.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        /*\
         * Matrix.translate
         [ method ]
         **
         * Translate the matrix
         - x (number) horizontal offset distance
         - y (number) vertical offset distance
        \*/
        matrixproto.translate = function (x, y) {
            this.e += x * this.a + y * this.c;
            this.f += x * this.b + y * this.d;
            return this;
        };
        /*\
         * Matrix.scale
         [ method ]
         **
         * Scales the matrix
         - x (number) amount to be scaled, with `1` resulting in no change
         - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
         - cx (number) #optional horizontal origin point from which to scale
         - cy (number) #optional vertical origin point from which to scale
         * Default cx, cy is the middle point of the element.
        \*/
        matrixproto.scale = function (x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.translate(cx, cy);
            this.a *= x;
            this.b *= x;
            this.c *= y;
            this.d *= y;
            (cx || cy) && this.translate(-cx, -cy);
            return this;
        };
        /*\
         * Matrix.rotate
         [ method ]
         **
         * Rotates the matrix
         - a (number) angle of rotation, in degrees
         - x (number) horizontal origin point from which to rotate
         - y (number) vertical origin point from which to rotate
        \*/
        matrixproto.rotate = function (a, x, y) {
            a = Snap.rad(a);
            x = x || 0;
            y = y || 0;
            var cos = +math.cos(a).toFixed(9),
                sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, -sin, cos, x, y);
            return this.add(1, 0, 0, 1, -x, -y);
        };
        /*\
         * Matrix.skewX
         [ method ]
         **
         * Skews the matrix along the x-axis
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skewX = function (x) {
            return this.skew(x, 0);
        };
        /*\
         * Matrix.skewY
         [ method ]
         **
         * Skews the matrix along the y-axis
         - y (number) Angle to skew along the y-axis (in degrees).
        \*/
        matrixproto.skewY = function (y) {
            return this.skew(0, y);
        };
        /*\
         * Matrix.skew
         [ method ]
         **
         * Skews the matrix
         - y (number) Angle to skew along the y-axis (in degrees).
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skew = function (x, y) {
            x = x || 0;
            y = y || 0;
            x = Snap.rad(x);
            y = Snap.rad(y);
            var c = math.tan(x).toFixed(9);
            var b = math.tan(y).toFixed(9);
            return this.add(1, b, c, 1, 0, 0);
        };
        /*\
         * Matrix.x
         [ method ]
         **
         * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
         - x (number)
         - y (number)
         = (number) x
        \*/
        matrixproto.x = function (x, y) {
            return x * this.a + y * this.c + this.e;
        };
        /*\
         * Matrix.y
         [ method ]
         **
         * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
         - x (number)
         - y (number)
         = (number) y
        \*/
        matrixproto.y = function (x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function (i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function () {
            return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
        };
        matrixproto.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)];
        };
        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }
        function normalize(a) {
            var mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        /*\
         * Matrix.determinant
         [ method ]
         **
         * Finds determinant of the given matrix.
         = (number) determinant
        \*/
        matrixproto.determinant = function () {
            return this.a * this.d - this.b * this.c;
        };
        /*\
         * Matrix.split
         [ method ]
         **
         * Splits matrix into primitive transformations
         = (object) in format:
         o dx (number) translation by x
         o dy (number) translation by y
         o scalex (number) scale by x
         o scaley (number) scale by y
         o shear (number) shear
         o rotate (number) rotation in deg
         o isSimple (boolean) could it be represented via simple transformations
        \*/
        matrixproto.split = function () {
            var out = {};
            // translation
            out.dx = this.e;
            out.dy = this.f;

            // scale and shear
            var row = [[this.a, this.b], [this.c, this.d]];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);

            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;

            if (this.determinant() < 0) {
                out.scalex = -out.scalex;
            }

            // rotation
            var sin = row[0][1],
                cos = row[1][1];
            if (cos < 0) {
                out.rotate = Snap.deg(math.acos(cos));
                if (sin < 0) {
                    out.rotate = 360 - out.rotate;
                }
            } else {
                out.rotate = Snap.deg(math.asin(sin));
            }

            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        /*\
         * Matrix.toTransformString
         [ method ]
         **
         * Returns transform string that represents given matrix
         = (string) transform string
        \*/
        matrixproto.toTransformString = function (shorter) {
            var s = shorter || this.split();
            if (!+s.shear.toFixed(9)) {
                s.scalex = +s.scalex.toFixed(4);
                s.scaley = +s.scaley.toFixed(4);
                s.rotate = +s.rotate.toFixed(4);
                return  (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) +
                        (s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E) +
                        (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E);
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            }
        };
    })(Matrix.prototype);
    /*\
     * Snap.Matrix
     [ method ]
     **
     * Matrix constructor, extend on your own risk.
     * To create matrices use @Snap.matrix.
    \*/
    Snap.Matrix = Matrix;
    /*\
     * Snap.matrix
     [ method ]
     **
     * Utility method
     **
     * Returns a matrix based on the given parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     * or
     - svgMatrix (SVGMatrix)
     = (object) @Matrix
    \*/
    Snap.matrix = function (a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var has = "hasOwnProperty",
        make = Snap._.make,
        wrap = Snap._.wrap,
        is = Snap.is,
        getSomeDefs = Snap._.getSomeDefs,
        reURLValue = /^url\((['"]?)([^)]+)\1\)$/,
        $ = Snap._.$,
        URL = Snap.url,
        Str = String,
        separator = Snap._.separator,
        E = "";
    /*\
     * Snap.deurl
     [ method ]
     **
     * Unwraps path from `"url(<path>)"`.
     - value (string) url path
     = (string) unwrapped path
    \*/
    Snap.deurl = function (value) {
        var res = String(value).match(reURLValue);
        return res ? res[2] : value;
    }
    // Attributes event handlers
    eve.on("snap.util.attr.mask", function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value.type == "mask") {
                var mask = value;
            } else {
                mask = make("mask", getSomeDefs(this));
                mask.node.appendChild(value.node);
            }
            !mask.node.id && $(mask.node, {
                id: mask.id
            });
            $(this.node, {
                mask: URL(mask.id)
            });
        }
    });
    (function (clipIt) {
        eve.on("snap.util.attr.clip", clipIt);
        eve.on("snap.util.attr.clip-path", clipIt);
        eve.on("snap.util.attr.clipPath", clipIt);
    }(function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            var clip,
                node = value.node;
            while (node) {
                if (node.nodeName === "clipPath") {
                    clip = new Element(node);
                    break;
                }
                if (node.nodeName === "svg") {
                    clip = undefined;
                    break;
                }
                node = node.parentNode;
            }
            if (!clip) {
                clip = make("clipPath", getSomeDefs(this));
                clip.node.appendChild(value.node);
                !clip.node.id && $(clip.node, {
                    id: clip.id
                });
            }
            $(this.node, {
                "clip-path": URL(clip.node.id || clip.id)
            });
        }
    }));
    function fillStroke(name) {
        return function (value) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1 &&
                (value.node.firstChild.tagName == "radialGradient" ||
                value.node.firstChild.tagName == "linearGradient" ||
                value.node.firstChild.tagName == "pattern")) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value instanceof Element) {
                if (value.type == "radialGradient" || value.type == "linearGradient"
                   || value.type == "pattern") {
                    if (!value.node.id) {
                        $(value.node, {
                            id: value.id
                        });
                    }
                    var fill = URL(value.node.id);
                } else {
                    fill = value.attr(name);
                }
            } else {
                fill = Snap.color(value);
                if (fill.error) {
                    var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
                    if (grad) {
                        if (!grad.node.id) {
                            $(grad.node, {
                                id: grad.id
                            });
                        }
                        fill = URL(grad.node.id);
                    } else {
                        fill = value;
                    }
                } else {
                    fill = Str(fill);
                }
            }
            var attrs = {};
            attrs[name] = fill;
            $(this.node, attrs);
            this.node.style[name] = E;
        };
    }
    eve.on("snap.util.attr.fill", fillStroke("fill"));
    eve.on("snap.util.attr.stroke", fillStroke("stroke"));
    var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
    eve.on("snap.util.grad.parse", function parseGrad(string) {
        string = Str(string);
        var tokens = string.match(gradrg);
        if (!tokens) {
            return null;
        }
        var type = tokens[1],
            params = tokens[2],
            stops = tokens[3];
        params = params.split(/\s*,\s*/).map(function (el) {
            return +el == el ? +el : el;
        });
        if (params.length == 1 && params[0] == 0) {
            params = [];
        }
        stops = stops.split("-");
        stops = stops.map(function (el) {
            el = el.split(":");
            var out = {
                color: el[0]
            };
            if (el[1]) {
                out.offset = parseFloat(el[1]);
            }
            return out;
        });
        var len = stops.length,
            start = 0,
            j = 0;
        function seed(i, end) {
            var step = (end - start) / (i - j);
            for (var k = j; k < i; k++) {
                stops[k].offset = +(+start + step * (k - j)).toFixed(2);
            }
            j = i;
            start = end;
        }
        len--;
        for (var i = 0; i < len; i++) if ("offset" in stops[i]) {
            seed(i, stops[i].offset);
        }
        stops[len].offset = stops[len].offset || 100;
        seed(len, stops[len].offset);
        return {
            type: type,
            params: params,
            stops: stops
        };
    });

    eve.on("snap.util.attr.d", function (value) {
        eve.stop();
        if (is(value, "array") && is(value[0], "array")) {
            value = Snap.path.toString.call(value);
        }
        value = Str(value);
        if (value.match(/[ruo]/i)) {
            value = Snap.path.toAbsolute(value);
        }
        $(this.node, {d: value});
    })(-1);
    eve.on("snap.util.attr.#text", function (value) {
        eve.stop();
        value = Str(value);
        var txt = glob.doc.createTextNode(value);
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.appendChild(txt);
    })(-1);
    eve.on("snap.util.attr.path", function (value) {
        eve.stop();
        this.attr({d: value});
    })(-1);
    eve.on("snap.util.attr.class", function (value) {
        eve.stop();
        this.node.className.baseVal = value;
    })(-1);
    eve.on("snap.util.attr.viewBox", function (value) {
        var vb;
        if (is(value, "object") && "x" in value) {
            vb = [value.x, value.y, value.width, value.height].join(" ");
        } else if (is(value, "array")) {
            vb = value.join(" ");
        } else {
            vb = value;
        }
        $(this.node, {
            viewBox: vb
        });
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.transform", function (value) {
        this.transform(value);
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.r", function (value) {
        if (this.type == "rect") {
            eve.stop();
            $(this.node, {
                rx: value,
                ry: value
            });
        }
    })(-1);
    eve.on("snap.util.attr.textpath", function (value) {
        eve.stop();
        if (this.type == "text") {
            var id, tp, node;
            if (!value && this.textPath) {
                tp = this.textPath;
                while (tp.node.firstChild) {
                    this.node.appendChild(tp.node.firstChild);
                }
                tp.remove();
                delete this.textPath;
                return;
            }
            if (is(value, "string")) {
                var defs = getSomeDefs(this),
                    path = wrap(defs.parentNode).path(value);
                defs.appendChild(path.node);
                id = path.id;
                path.attr({id: id});
            } else {
                value = wrap(value);
                if (value instanceof Element) {
                    id = value.attr("id");
                    if (!id) {
                        id = value.id;
                        value.attr({id: id});
                    }
                }
            }
            if (id) {
                tp = this.textPath;
                node = this.node;
                if (tp) {
                    tp.attr({"xlink:href": "#" + id});
                } else {
                    tp = $("textPath", {
                        "xlink:href": "#" + id
                    });
                    while (node.firstChild) {
                        tp.appendChild(node.firstChild);
                    }
                    node.appendChild(tp);
                    this.textPath = wrap(tp);
                }
            }
        }
    })(-1);
    eve.on("snap.util.attr.text", function (value) {
        if (this.type == "text") {
            var i = 0,
                node = this.node,
                tuner = function (chunk) {
                    var out = $("tspan");
                    if (is(chunk, "array")) {
                        for (var i = 0; i < chunk.length; i++) {
                            out.appendChild(tuner(chunk[i]));
                        }
                    } else {
                        out.appendChild(glob.doc.createTextNode(chunk));
                    }
                    out.normalize && out.normalize();
                    return out;
                };
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            var tuned = tuner(value);
            while (tuned.firstChild) {
                node.appendChild(tuned.firstChild);
            }
        }
        eve.stop();
    })(-1);
    function setFontSize(value) {
        eve.stop();
        if (value == +value) {
            value += "px";
        }
        this.node.style.fontSize = value;
    }
    eve.on("snap.util.attr.fontSize", setFontSize)(-1);
    eve.on("snap.util.attr.font-size", setFontSize)(-1);


    eve.on("snap.util.getattr.transform", function () {
        eve.stop();
        return this.transform();
    })(-1);
    eve.on("snap.util.getattr.textpath", function () {
        eve.stop();
        return this.textPath;
    })(-1);
    // Markers
    (function () {
        function getter(end) {
            return function () {
                eve.stop();
                var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
                if (style == "none") {
                    return style;
                } else {
                    return Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
                }
            };
        }
        function setter(end) {
            return function (value) {
                eve.stop();
                var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
                if (value == "" || !value) {
                    this.node.style[name] = "none";
                    return;
                }
                if (value.type == "marker") {
                    var id = value.node.id;
                    if (!id) {
                        $(value.node, {id: value.id});
                    }
                    this.node.style[name] = URL(id);
                    return;
                }
            };
        }
        eve.on("snap.util.getattr.marker-end", getter("end"))(-1);
        eve.on("snap.util.getattr.markerEnd", getter("end"))(-1);
        eve.on("snap.util.getattr.marker-start", getter("start"))(-1);
        eve.on("snap.util.getattr.markerStart", getter("start"))(-1);
        eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1);
        eve.on("snap.util.getattr.markerMid", getter("mid"))(-1);
        eve.on("snap.util.attr.marker-end", setter("end"))(-1);
        eve.on("snap.util.attr.markerEnd", setter("end"))(-1);
        eve.on("snap.util.attr.marker-start", setter("start"))(-1);
        eve.on("snap.util.attr.markerStart", setter("start"))(-1);
        eve.on("snap.util.attr.marker-mid", setter("mid"))(-1);
        eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
    }());
    eve.on("snap.util.getattr.r", function () {
        if (this.type == "rect" && $(this.node, "rx") == $(this.node, "ry")) {
            eve.stop();
            return $(this.node, "rx");
        }
    })(-1);
    function textExtract(node) {
        var out = [];
        var children = node.childNodes;
        for (var i = 0, ii = children.length; i < ii; i++) {
            var chi = children[i];
            if (chi.nodeType == 3) {
                out.push(chi.nodeValue);
            }
            if (chi.tagName == "tspan") {
                if (chi.childNodes.length == 1 && chi.firstChild.nodeType == 3) {
                    out.push(chi.firstChild.nodeValue);
                } else {
                    out.push(textExtract(chi));
                }
            }
        }
        return out;
    }
    eve.on("snap.util.getattr.text", function () {
        if (this.type == "text" || this.type == "tspan") {
            eve.stop();
            var out = textExtract(this.node);
            return out.length == 1 ? out[0] : out;
        }
    })(-1);
    eve.on("snap.util.getattr.#text", function () {
        return this.node.textContent;
    })(-1);
    eve.on("snap.util.getattr.fill", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.fill", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.stroke", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.stroke", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.viewBox", function () {
        eve.stop();
        var vb = $(this.node, "viewBox");
        if (vb) {
            vb = vb.split(separator);
            return Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3]);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.points", function () {
        var p = $(this.node, "points");
        eve.stop();
        if (p) {
            return p.split(separator);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.path", function () {
        var p = $(this.node, "d");
        eve.stop();
        return p;
    })(-1);
    eve.on("snap.util.getattr.class", function () {
        return this.node.className.baseVal;
    })(-1);
    function getFontSize() {
        eve.stop();
        return this.node.style.fontSize;
    }
    eve.on("snap.util.getattr.fontSize", getFontSize)(-1);
    eve.on("snap.util.getattr.font-size", getFontSize)(-1);
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var rgNotSpace = /\S+/g,
        rgBadSpace = /[\t\r\n\f]/g,
        rgTrim = /(^\s+|\s+$)/g,
        Str = String,
        elproto = Element.prototype;
    /*\
     * Element.addClass
     [ method ]
     **
     * Adds given class name or list of class names to the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.addClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;

        if (classes.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (!~pos) {
                    curClasses.push(clazz);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.removeClass
     [ method ]
     **
     * Removes given class name or list of class names from the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.removeClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        if (curClasses.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (~pos) {
                    curClasses.splice(pos, 1);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.hasClass
     [ method ]
     **
     * Checks if the element has a given class name in the list of class names applied to it.
     - value (string) class name
     **
     = (boolean) `true` if the element has given class
    \*/
    elproto.hasClass = function (value) {
        var elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [];
        return !!~curClasses.indexOf(value);
    };
    /*\
     * Element.toggleClass
     [ method ]
     **
     * Add or remove one or more classes from the element, depending on either
     * the class’s presence or the value of the `flag` argument.
     - value (string) class name or space separated list of class names
     - flag (boolean) value to determine whether the class should be added or removed
     **
     = (Element) original element.
    \*/
    elproto.toggleClass = function (value, flag) {
        if (flag != null) {
            if (flag) {
                return this.addClass(value);
            } else {
                return this.removeClass(value);
            }
        }
        var classes = (value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        j = 0;
        while (clazz = classes[j++]) {
            pos = curClasses.indexOf(clazz);
            if (~pos) {
                curClasses.splice(pos, 1);
            } else {
                curClasses.push(clazz);
            }
        }

        finalValue = curClasses.join(" ");
        if (className != finalValue) {
            elem.className.baseVal = finalValue;
        }
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var operators = {
            "+": function (x, y) {
                    return x + y;
                },
            "-": function (x, y) {
                    return x - y;
                },
            "/": function (x, y) {
                    return x / y;
                },
            "*": function (x, y) {
                    return x * y;
                }
        },
        Str = String,
        reUnit = /[a-z]+$/i,
        reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    eve.on("snap.util.attr", function (val) {
        var plus = Str(val).match(reAddon);
        if (plus) {
            var evnt = eve.nt(),
                name = evnt.substring(evnt.lastIndexOf(".") + 1),
                a = this.attr(name),
                atr = {};
            eve.stop();
            var unit = plus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[plus[1]];
            if (aUnit && aUnit == unit) {
                val = op(parseFloat(a), +plus[2]);
            } else {
                a = this.asPX(name);
                val = op(this.asPX(name), this.asPX(name, plus[2] + unit));
            }
            if (isNaN(a) || isNaN(val)) {
                return;
            }
            atr[name] = val;
            this.attr(atr);
        }
    })(-10);
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this,
            bplus = Str(b).match(reAddon);
        if (bplus) {
            eve.stop();
            var unit = bplus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[bplus[1]];
            if (aUnit && aUnit == unit) {
                return {
                    from: parseFloat(a),
                    to: op(parseFloat(a), +bplus[2]),
                    f: getUnit(aUnit)
                };
            } else {
                a = this.asPX(name);
                return {
                    from: a,
                    to: op(a, this.asPX(name, bplus[2] + unit)),
                    f: getNumber
                };
            }
        }
    })(-10);
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var proto = Paper.prototype,
        is = Snap.is;
    /*\
     * Paper.rect
     [ method ]
     *
     * Draws a rectangle
     **
     - x (number) x coordinate of the top left corner
     - y (number) y coordinate of the top left corner
     - width (number) width
     - height (number) height
     - rx (number) #optional horizontal radius for rounded corners, default is 0
     - ry (number) #optional vertical radius for rounded corners, default is rx or 0
     = (object) the `rect` element
     **
     > Usage
     | // regular rectangle
     | var c = paper.rect(10, 10, 50, 50);
     | // rectangle with rounded corners
     | var c = paper.rect(40, 40, 50, 50, 10);
    \*/
    proto.rect = function (x, y, w, h, rx, ry) {
        var attr;
        if (ry == null) {
            ry = rx;
        }
        if (is(x, "object") && x == "[object Object]") {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                width: w,
                height: h
            };
            if (rx != null) {
                attr.rx = rx;
                attr.ry = ry;
            }
        }
        return this.el("rect", attr);
    };
    /*\
     * Paper.circle
     [ method ]
     **
     * Draws a circle
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - r (number) radius
     = (object) the `circle` element
     **
     > Usage
     | var c = paper.circle(50, 50, 40);
    \*/
    proto.circle = function (cx, cy, r) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr = {
                cx: cx,
                cy: cy,
                r: r
            };
        }
        return this.el("circle", attr);
    };

    var preload = (function () {
        function onerror() {
            this.parentNode.removeChild(this);
        }
        return function (src, f) {
            var img = glob.doc.createElement("img"),
                body = glob.doc.body;
            img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
            img.onload = function () {
                f.call(img);
                img.onload = img.onerror = null;
                body.removeChild(img);
            };
            img.onerror = onerror;
            body.appendChild(img);
            img.src = src;
        };
    }());

    /*\
     * Paper.image
     [ method ]
     **
     * Places an image on the surface
     **
     - src (string) URI of the source image
     - x (number) x offset position
     - y (number) y offset position
     - width (number) width of the image
     - height (number) height of the image
     = (object) the `image` element
     * or
     = (object) Snap element object with type `image`
     **
     > Usage
     | var c = paper.image("apple.png", 10, 10, 80, 80);
    \*/
    proto.image = function (src, x, y, width, height) {
        var el = this.el("image");
        if (is(src, "object") && "src" in src) {
            el.attr(src);
        } else if (src != null) {
            var set = {
                "xlink:href": src,
                preserveAspectRatio: "none"
            };
            if (x != null && y != null) {
                set.x = x;
                set.y = y;
            }
            if (width != null && height != null) {
                set.width = width;
                set.height = height;
            } else {
                preload(src, function () {
                    Snap._.$(el.node, {
                        width: this.offsetWidth,
                        height: this.offsetHeight
                    });
                });
            }
            Snap._.$(el.node, set);
        }
        return el;
    };
    /*\
     * Paper.ellipse
     [ method ]
     **
     * Draws an ellipse
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - rx (number) horizontal radius
     - ry (number) vertical radius
     = (object) the `ellipse` element
     **
     > Usage
     | var c = paper.ellipse(50, 50, 40, 20);
    \*/
    proto.ellipse = function (cx, cy, rx, ry) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr ={
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            };
        }
        return this.el("ellipse", attr);
    };
    // SIERRA Paper.path(): Unclear from the link what a Catmull-Rom curveto is, and why it would make life any easier.
    /*\
     * Paper.path
     [ method ]
     **
     * Creates a `<path>` element using the given string as the path's definition
     - pathString (string) #optional path string in SVG format
     * Path string consists of one-letter commands, followed by comma seprarated arguments in numerical form. Example:
     | "M10,20L30,40"
     * This example features two commands: `M`, with arguments `(10, 20)` and `L` with arguments `(30, 40)`. Uppercase letter commands express coordinates in absolute terms, while lowercase commands express them in relative terms from the most recently declared coordinates.
     *
     # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a> or <a href="https://developer.mozilla.org/en/SVG/Tutorial/Paths">article about path strings at MDN</a>.</p>
     # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
     # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
     # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
     # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
     # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
     # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
     # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
     # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
     # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
     # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
     # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
     # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
     * * _Catmull-Rom curveto_ is a not standard SVG command and added to make life easier.
     * Note: there is a special case when a path consists of only three commands: `M10,10R…z`. In this case the path connects back to its starting point.
     > Usage
     | var c = paper.path("M10 10L90 90");
     | // draw a diagonal line:
     | // move to 10,10, line to 90,90
    \*/
    proto.path = function (d) {
        var attr;
        if (is(d, "object") && !is(d, "array")) {
            attr = d;
        } else if (d) {
            attr = {d: d};
        }
        return this.el("path", attr);
    };
    /*\
     * Paper.g
     [ method ]
     **
     * Creates a group element
     **
     - varargs (…) #optional elements to nest within the group
     = (object) the `g` element
     **
     > Usage
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g(c2, c1); // note that the order of elements is different
     * or
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g();
     | g.add(c2, c1);
    \*/
    /*\
     * Paper.group
     [ method ]
     **
     * See @Paper.g
    \*/
    proto.group = proto.g = function (first) {
        var attr,
            el = this.el("g");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.svg
     [ method ]
     **
     * Creates a nested SVG element.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `svg` element
     **
    \*/
    proto.svg = function (x, y, width, height, vbx, vby, vbw, vbh) {
        var attrs = {};
        if (is(x, "object") && y == null) {
            attrs = x;
        } else {
            if (x != null) {
                attrs.x = x;
            }
            if (y != null) {
                attrs.y = y;
            }
            if (width != null) {
                attrs.width = width;
            }
            if (height != null) {
                attrs.height = height;
            }
            if (vbx != null && vby != null && vbw != null && vbh != null) {
                attrs.viewBox = [vbx, vby, vbw, vbh];
            }
        }
        return this.el("svg", attrs);
    };
    /*\
     * Paper.mask
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a mask.
     **
     = (object) the `mask` element
     **
    \*/
    proto.mask = function (first) {
        var attr,
            el = this.el("mask");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.ptrn
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a pattern.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `pattern` element
     **
    \*/
    proto.ptrn = function (x, y, width, height, vx, vy, vw, vh) {
        if (is(x, "object")) {
            var attr = x;
        } else {
            attr = {patternUnits: "userSpaceOnUse"};
            if (x) {
                attr.x = x;
            }
            if (y) {
                attr.y = y;
            }
            if (width != null) {
                attr.width = width;
            }
            if (height != null) {
                attr.height = height;
            }
            if (vx != null && vy != null && vw != null && vh != null) {
                attr.viewBox = [vx, vy, vw, vh];
            } else {
                attr.viewBox = [x || 0, y || 0, width || 0, height || 0];
            }
        }
        return this.el("pattern", attr);
    };
    /*\
     * Paper.use
     [ method ]
     **
     * Creates a <use> element.
     - id (string) @optional id of element to link
     * or
     - id (Element) @optional element to link
     **
     = (object) the `use` element
     **
    \*/
    proto.use = function (id) {
        if (id != null) {
            if (id instanceof Element) {
                if (!id.attr("id")) {
                    id.attr({id: Snap._.id(id)});
                }
                id = id.attr("id");
            }
            if (String(id).charAt() == "#") {
                id = id.substring(1);
            }
            return this.el("use", {"xlink:href": "#" + id});
        } else {
            return Element.prototype.use.call(this);
        }
    };
    /*\
     * Paper.symbol
     [ method ]
     **
     * Creates a <symbol> element.
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     = (object) the `symbol` element
     **
    \*/
    proto.symbol = function (vx, vy, vw, vh) {
        var attr = {};
        if (vx != null && vy != null && vw != null && vh != null) {
            attr.viewBox = [vx, vy, vw, vh];
        }

        return this.el("symbol", attr);
    };
    /*\
     * Paper.text
     [ method ]
     **
     * Draws a text string
     **
     - x (number) x coordinate position
     - y (number) y coordinate position
     - text (string|array) The text string to draw or array of strings to nest within separate `<tspan>` elements
     = (object) the `text` element
     **
     > Usage
     | var t1 = paper.text(50, 50, "Snap");
     | var t2 = paper.text(50, 50, ["S","n","a","p"]);
     | // Text path usage
     | t1.attr({textpath: "M10,10L100,100"});
     | // or
     | var pth = paper.path("M10,10L100,100");
     | t1.attr({textpath: pth});
    \*/
    proto.text = function (x, y, text) {
        var attr = {};
        if (is(x, "object")) {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                text: text || ""
            };
        }
        return this.el("text", attr);
    };
    /*\
     * Paper.line
     [ method ]
     **
     * Draws a line
     **
     - x1 (number) x coordinate position of the start
     - y1 (number) y coordinate position of the start
     - x2 (number) x coordinate position of the end
     - y2 (number) y coordinate position of the end
     = (object) the `line` element
     **
     > Usage
     | var t1 = paper.line(50, 50, 100, 100);
    \*/
    proto.line = function (x1, y1, x2, y2) {
        var attr = {};
        if (is(x1, "object")) {
            attr = x1;
        } else if (x1 != null) {
            attr = {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        }
        return this.el("line", attr);
    };
    /*\
     * Paper.polyline
     [ method ]
     **
     * Draws a polyline
     **
     - points (array) array of points
     * or
     - varargs (…) points
     = (object) the `polyline` element
     **
     > Usage
     | var p1 = paper.polyline([10, 10, 100, 100]);
     | var p2 = paper.polyline(10, 10, 100, 100);
    \*/
    proto.polyline = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polyline", attr);
    };
    /*\
     * Paper.polygon
     [ method ]
     **
     * Draws a polygon. See @Paper.polyline
    \*/
    proto.polygon = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polygon", attr);
    };
    // gradients
    (function () {
        var $ = Snap._.$;
        // gradients' helpers
        /*\
         * Element.stops
         [ method ]
         **
         * Only for gradients!
         * Returns array of gradient stops elements.
         = (array) the stops array.
        \*/
        function Gstops() {
            return this.selectAll("stop");
        }
        /*\
         * Element.addStop
         [ method ]
         **
         * Only for gradients!
         * Adds another stop to the gradient.
         - color (string) stops color
         - offset (number) stops offset 0..100
         = (object) gradient element
        \*/
        function GaddStop(color, offset) {
            var stop = $("stop"),
                attr = {
                    offset: +offset + "%"
                };
            color = Snap.color(color);
            attr["stop-color"] = color.hex;
            if (color.opacity < 1) {
                attr["stop-opacity"] = color.opacity;
            }
            $(stop, attr);
            var stops = this.stops(),
                inserted;
            for (var i = 0; i < stops.length; i++) {
                var stopOffset = parseFloat(stops[i].attr("offset"));
                if (stopOffset > offset) {
                    this.node.insertBefore(stop, stops[i].node);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.node.appendChild(stop);
            }
            return this;
        }
        function GgetBBox() {
            if (this.type == "linearGradient") {
                var x1 = $(this.node, "x1") || 0,
                    x2 = $(this.node, "x2") || 1,
                    y1 = $(this.node, "y1") || 0,
                    y2 = $(this.node, "y2") || 0;
                return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
            } else {
                var cx = this.node.cx || .5,
                    cy = this.node.cy || .5,
                    r = this.node.r || 0;
                return Snap._.box(cx - r, cy - r, r * 2, r * 2);
            }
        }
        /*\
         * Element.setStops
         [ method ]
         **
         * Only for gradients!
         * Updates stops of the gradient based on passed gradient descriptor. See @Ppaer.gradient
         - str (string) gradient descriptor part after `()`.
         = (object) gradient element
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         | g.setStops("#fff-#000-#f00-#fc0");
        \*/
        function GsetStops(str) {
            var grad = str,
                stops = this.stops();
            if (typeof str == "string") {
                grad = eve("snap.util.grad.parse", null, "l(0,0,0,1)" + str).firstDefined().stops;
            }
            if (!Snap.is(grad, "array")) {
                return;
            }
            for (var i = 0; i < stops.length; i++) {
                if (grad[i]) {
                    var color = Snap.color(grad[i].color),
                        attr = {"offset": grad[i].offset + "%"};
                    attr["stop-color"] = color.hex;
                    if (color.opacity < 1) {
                        attr["stop-opacity"] = color.opacity;
                    }
                    stops[i].attr(attr);
                } else {
                    stops[i].remove();
                }
            }
            for (i = stops.length; i < grad.length; i++) {
                this.addStop(grad[i].color, grad[i].offset);
            }
            return this;
        }
        function gradient(defs, str) {
            var grad = eve("snap.util.grad.parse", null, str).firstDefined(),
                el;
            if (!grad) {
                return null;
            }
            grad.params.unshift(defs);
            if (grad.type.toLowerCase() == "l") {
                el = gradientLinear.apply(0, grad.params);
            } else {
                el = gradientRadial.apply(0, grad.params);
            }
            if (grad.type != grad.type.toLowerCase()) {
                $(el.node, {
                    gradientUnits: "userSpaceOnUse"
                });
            }
            var stops = grad.stops,
                len = stops.length;
            for (var i = 0; i < len; i++) {
                var stop = stops[i];
                el.addStop(stop.color, stop.offset);
            }
            return el;
        }
        function gradientLinear(defs, x1, y1, x2, y2) {
            var el = Snap._.make("linearGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            el.setStops = GsetStops;
            if (x1 != null) {
                $(el.node, {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            }
            return el;
        }
        function gradientRadial(defs, cx, cy, r, fx, fy) {
            var el = Snap._.make("radialGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            if (cx != null) {
                $(el.node, {
                    cx: cx,
                    cy: cy,
                    r: r
                });
            }
            if (fx != null && fy != null) {
                $(el.node, {
                    fx: fx,
                    fy: fy
                });
            }
            return el;
        }
        /*\
         * Paper.gradient
         [ method ]
         **
         * Creates a gradient element
         **
         - gradient (string) gradient descriptor
         > Gradient Descriptor
         * The gradient descriptor is an expression formatted as
         * follows: `<type>(<coords>)<colors>`.  The `<type>` can be
         * either linear or radial.  The uppercase `L` or `R` letters
         * indicate absolute coordinates offset from the SVG surface.
         * Lowercase `l` or `r` letters indicate coordinates
         * calculated relative to the element to which the gradient is
         * applied.  Coordinates specify a linear gradient vector as
         * `x1`, `y1`, `x2`, `y2`, or a radial gradient as `cx`, `cy`,
         * `r` and optional `fx`, `fy` specifying a focal point away
         * from the center of the circle. Specify `<colors>` as a list
         * of dash-separated CSS color values.  Each color may be
         * followed by a custom offset value, separated with a colon
         * character.
         > Examples
         * Linear gradient, relative from top-left corner to bottom-right
         * corner, from black through red to white:
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         * Linear gradient, absolute from (0, 0) to (100, 100), from black
         * through red at 25% to white:
         | var g = paper.gradient("L(0, 0, 100, 100)#000-#f00:25-#fff");
         * Radial gradient, relative from the center of the element with radius
         * half the width, from black to white:
         | var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
         * To apply the gradient:
         | paper.circle(50, 50, 40).attr({
         |     fill: g
         | });
         = (object) the `gradient` element
        \*/
        proto.gradient = function (str) {
            return gradient(this.defs, str);
        };
        proto.gradientLinear = function (x1, y1, x2, y2) {
            return gradientLinear(this.defs, x1, y1, x2, y2);
        };
        proto.gradientRadial = function (cx, cy, r, fx, fy) {
            return gradientRadial(this.defs, cx, cy, r, fx, fy);
        };
        /*\
         * Paper.toString
         [ method ]
         **
         * Returns SVG code for the @Paper
         = (string) SVG code for the @Paper
        \*/
        proto.toString = function () {
            var doc = this.node.ownerDocument,
                f = doc.createDocumentFragment(),
                d = doc.createElement("div"),
                svg = this.node.cloneNode(true),
                res;
            f.appendChild(d);
            d.appendChild(svg);
            Snap._.$(svg, {xmlns: "http://www.w3.org/2000/svg"});
            res = d.innerHTML;
            f.removeChild(f.firstChild);
            return res;
        };
        /*\
         * Paper.toDataURL
         [ method ]
         **
         * Returns SVG code for the @Paper as Data URI string.
         = (string) Data URI string
        \*/
        proto.toDataURL = function () {
            if (window && window.btoa) {
                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
            }
        };
        /*\
         * Paper.clear
         [ method ]
         **
         * Removes all child nodes of the paper, except <defs>.
        \*/
        proto.clear = function () {
            var node = this.node.firstChild,
                next;
            while (node) {
                next = node.nextSibling;
                if (node.tagName != "defs") {
                    node.parentNode.removeChild(node);
                } else {
                    proto.clear.call({node: node});
                }
                node = next;
            }
        };
    }());
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        is = Snap.is,
        clone = Snap._.clone,
        has = "hasOwnProperty",
        p2s = /,?([a-z]),?/gi,
        toFloat = parseFloat,
        math = Math,
        PI = math.PI,
        mmin = math.min,
        mmax = math.max,
        pow = math.pow,
        abs = math.abs;
    function paths(ps) {
        var p = paths.ps = paths.ps || {};
        if (p[ps]) {
            p[ps].sleep = 100;
        } else {
            p[ps] = {
                sleep: 100
            };
        }
        setTimeout(function () {
            for (var key in p) if (p[has](key) && key != ps) {
                p[key].sleep--;
                !p[key].sleep && delete p[key];
            }
        });
        return p[ps];
    }
    function box(x, y, width, height) {
        if (x == null) {
            x = y = width = height = 0;
        }
        if (y == null) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        return {
            x: x,
            y: y,
            width: width,
            w: width,
            height: height,
            h: height,
            x2: x + width,
            y2: y + height,
            cx: x + width / 2,
            cy: y + height / 2,
            r1: math.min(width, height) / 2,
            r2: math.max(width, height) / 2,
            r0: math.sqrt(width * width + height * height) / 2,
            path: rectPath(x, y, width, height),
            vb: [x, y, width, height].join(" ")
        };
    }
    function toString() {
        return this.join(",").replace(p2s, "$1");
    }
    function pathClone(pathArray) {
        var res = clone(pathArray);
        res.toString = toString;
        return res;
    }
    function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        if (length == null) {
            return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
        } else {
            return findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y,
                getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
        }
    }
    function getLengthFactory(istotal, subpath) {
        function O(val) {
            return +(+val).toFixed(3);
        }
        return Snap._.cacher(function (path, length, onlystart) {
            if (path instanceof Element) {
                path = path.attr("d");
            }
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += [
                                "C" + O(point.start.x),
                                O(point.start.y),
                                O(point.m.x),
                                O(point.m.y),
                                O(point.x),
                                O(point.y)
                            ];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = [
                                "M" + O(point.x),
                                O(point.y) + "C" + O(point.n.x),
                                O(point.n.y),
                                O(point.end.x),
                                O(point.end.y),
                                O(p[5]),
                                O(p[6])
                            ].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return point;
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            return point;
        }, null, Snap._.clone);
    }
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            t13 = pow(t1, 3),
            t12 = pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
        // (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {x: mx, y: my},
            n: {x: nx, y: ny},
            start: {x: ax, y: ay},
            end: {x: cx, y: cy},
            alpha: alpha
        };
    }
    function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        if (!Snap.is(p1x, "array")) {
            p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
        }
        var bbox = curveDim.apply(null, p1x);
        return box(
            bbox.min.x,
            bbox.min.y,
            bbox.max.x - bbox.min.x,
            bbox.max.y - bbox.min.y
        );
    }
    function isPointInsideBBox(bbox, x, y) {
        return  x >= bbox.x &&
                x <= bbox.x + bbox.width &&
                y >= bbox.y &&
                y <= bbox.y + bbox.height;
    }
    function isBBoxIntersect(bbox1, bbox2) {
        bbox1 = box(bbox1);
        bbox2 = box(bbox2);
        return isPointInsideBBox(bbox2, bbox1.x, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2)
            || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x
                || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)
            && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y
                || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
    }
    function base3(t, p1, p2, p3, p4) {
        var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
            t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
        return t * t2 - 3 * p1 + 3 * p2;
    }
    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
        if (z == null) {
            z = 1;
        }
        z = z > 1 ? 1 : z < 0 ? 0 : z;
        var z2 = z / 2,
            n = 12,
            Tvalues = [-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],
            Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],
            sum = 0;
        for (var i = 0; i < n; i++) {
            var ct = z2 * Tvalues[i] + z2,
                xbase = base3(ct, x1, x2, x3, x4),
                ybase = base3(ct, y1, y2, y3, y4),
                comb = xbase * xbase + ybase * ybase;
            sum += Cvalues[i] * math.sqrt(comb);
        }
        return z2 * sum;
    }
    function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
        if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
            return;
        }
        var t = 1,
            step = t / 2,
            t2 = t - step,
            l,
            e = .01;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        while (abs(l - ll) > e) {
            step /= 2;
            t2 += (l < ll ? 1 : -1) * step;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        }
        return t2;
    }
    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if (
            mmax(x1, x2) < mmin(x3, x4) ||
            mmin(x1, x2) > mmax(x3, x4) ||
            mmax(y1, y2) < mmin(y3, y4) ||
            mmin(y1, y2) > mmax(y3, y4)
        ) {
            return;
        }
        var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
            ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
            denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (!denominator) {
            return;
        }
        var px = nx / denominator,
            py = ny / denominator,
            px2 = +px.toFixed(2),
            py2 = +py.toFixed(2);
        if (
            px2 < +mmin(x1, x2).toFixed(2) ||
            px2 > +mmax(x1, x2).toFixed(2) ||
            px2 < +mmin(x3, x4).toFixed(2) ||
            px2 > +mmax(x3, x4).toFixed(2) ||
            py2 < +mmin(y1, y2).toFixed(2) ||
            py2 > +mmax(y1, y2).toFixed(2) ||
            py2 < +mmin(y3, y4).toFixed(2) ||
            py2 > +mmax(y3, y4).toFixed(2)
        ) {
            return;
        }
        return {x: px, y: py};
    }
    function inter(bez1, bez2) {
        return interHelper(bez1, bez2);
    }
    function interCount(bez1, bez2) {
        return interHelper(bez1, bez2, 1);
    }
    function interHelper(bez1, bez2, justCount) {
        var bbox1 = bezierBBox(bez1),
            bbox2 = bezierBBox(bez2);
        if (!isBBoxIntersect(bbox1, bbox2)) {
            return justCount ? 0 : [];
        }
        var l1 = bezlen.apply(0, bez1),
            l2 = bezlen.apply(0, bez2),
            n1 = ~~(l1 / 8),
            n2 = ~~(l2 / 8),
            dots1 = [],
            dots2 = [],
            xy = {},
            res = justCount ? 0 : [];
        for (var i = 0; i < n1 + 1; i++) {
            var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
            dots1.push({x: p.x, y: p.y, t: i / n1});
        }
        for (i = 0; i < n2 + 1; i++) {
            p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
            dots2.push({x: p.x, y: p.y, t: i / n2});
        }
        for (i = 0; i < n1; i++) {
            for (var j = 0; j < n2; j++) {
                var di = dots1[i],
                    di1 = dots1[i + 1],
                    dj = dots2[j],
                    dj1 = dots2[j + 1],
                    ci = abs(di1.x - di.x) < .001 ? "y" : "x",
                    cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
                    is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                if (is) {
                    if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
                        continue;
                    }
                    xy[is.x.toFixed(4)] = is.y.toFixed(4);
                    var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
                        t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
                        if (justCount) {
                            res++;
                        } else {
                            res.push({
                                x: is.x,
                                y: is.y,
                                t1: t1,
                                t2: t2
                            });
                        }
                    }
                }
            }
        }
        return res;
    }
    function pathIntersection(path1, path2) {
        return interPathHelper(path1, path2);
    }
    function pathIntersectionNumber(path1, path2) {
        return interPathHelper(path1, path2, 1);
    }
    function interPathHelper(path1, path2, justCount) {
        path1 = path2curve(path1);
        path2 = path2curve(path2);
        var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2,
            res = justCount ? 0 : [];
        for (var i = 0, ii = path1.length; i < ii; i++) {
            var pi = path1[i];
            if (pi[0] == "M") {
                x1 = x1m = pi[1];
                y1 = y1m = pi[2];
            } else {
                if (pi[0] == "C") {
                    bez1 = [x1, y1].concat(pi.slice(1));
                    x1 = bez1[6];
                    y1 = bez1[7];
                } else {
                    bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
                    x1 = x1m;
                    y1 = y1m;
                }
                for (var j = 0, jj = path2.length; j < jj; j++) {
                    var pj = path2[j];
                    if (pj[0] == "M") {
                        x2 = x2m = pj[1];
                        y2 = y2m = pj[2];
                    } else {
                        if (pj[0] == "C") {
                            bez2 = [x2, y2].concat(pj.slice(1));
                            x2 = bez2[6];
                            y2 = bez2[7];
                        } else {
                            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
                            x2 = x2m;
                            y2 = y2m;
                        }
                        var intr = interHelper(bez1, bez2, justCount);
                        if (justCount) {
                            res += intr;
                        } else {
                            for (var k = 0, kk = intr.length; k < kk; k++) {
                                intr[k].segment1 = i;
                                intr[k].segment2 = j;
                                intr[k].bez1 = bez1;
                                intr[k].bez2 = bez2;
                            }
                            res = res.concat(intr);
                        }
                    }
                }
            }
        }
        return res;
    }
    function isPointInsidePath(path, x, y) {
        var bbox = pathBBox(path);
        return isPointInsideBBox(bbox, x, y) &&
               interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
    }
    function pathBBox(path) {
        var pth = paths(path);
        if (pth.bbox) {
            return clone(pth.bbox);
        }
        if (!path) {
            return box();
        }
        path = path2curve(path);
        var x = 0,
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X.concat(dim.min.x, dim.max.x);
                Y = Y.concat(dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin.apply(0, X),
            ymin = mmin.apply(0, Y),
            xmax = mmax.apply(0, X),
            ymax = mmax.apply(0, Y),
            bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
        pth.bbox = clone(bb);
        return bb;
    }
    function rectPath(x, y, w, h, r) {
        if (r) {
            return [
                ["M", +x + +r, y],
                ["l", w - r * 2, 0],
                ["a", r, r, 0, 0, 1, r, r],
                ["l", 0, h - r * 2],
                ["a", r, r, 0, 0, 1, -r, r],
                ["l", r * 2 - w, 0],
                ["a", r, r, 0, 0, 1, -r, -r],
                ["l", 0, r * 2 - h],
                ["a", r, r, 0, 0, 1, r, -r],
                ["z"]
            ];
        }
        var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        res.toString = toString;
        return res;
    }
    function ellipsePath(x, y, rx, ry, a) {
        if (a == null && ry == null) {
            ry = rx;
        }
        x = +x;
        y = +y;
        rx = +rx;
        ry = +ry;
        if (a != null) {
            var rad = Math.PI / 180,
                x1 = x + rx * Math.cos(-ry * rad),
                x2 = x + rx * Math.cos(-a * rad),
                y1 = y + rx * Math.sin(-ry * rad),
                y2 = y + rx * Math.sin(-a * rad),
                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
        } else {
            res = [
                ["M", x, y],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];
        }
        res.toString = toString;
        return res;
    }
    var unit2px = Snap._unit2px,
        getPath = {
        path: function (el) {
            return el.attr("path");
        },
        circle: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx, attr.cy, attr.r);
        },
        ellipse: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
        },
        rect: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
        },
        image: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
        },
        line: function (el) {
            return "M" + [el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2")];
        },
        polyline: function (el) {
            return "M" + el.attr("points");
        },
        polygon: function (el) {
            return "M" + el.attr("points") + "z";
        },
        deflt: function (el) {
            var bbox = el.node.getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        }
    };
    function pathToRelative(pathArray) {
        var pth = paths(pathArray),
            lowerCase = String.prototype.toLowerCase;
        if (pth.rel) {
            return pathClone(pth.rel);
        }
        if (!Snap.is(pathArray, "array") || !Snap.is(pathArray && pathArray[0], "array")) {
            pathArray = Snap.parsePathString(pathArray);
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0;
        if (pathArray[0][0] == "M") {
            x = pathArray[0][1];
            y = pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res.push(["M", x, y]);
        }
        for (var i = start, ii = pathArray.length; i < ii; i++) {
            var r = res[i] = [],
                pa = pathArray[i];
            if (pa[0] != lowerCase.call(pa[0])) {
                r[0] = lowerCase.call(pa[0]);
                switch (r[0]) {
                    case "a":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] - x).toFixed(3);
                        r[7] = +(pa[7] - y).toFixed(3);
                        break;
                    case "v":
                        r[1] = +(pa[1] - y).toFixed(3);
                        break;
                    case "m":
                        mx = pa[1];
                        my = pa[2];
                    default:
                        for (var j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                        }
                }
            } else {
                r = res[i] = [];
                if (pa[0] == "m") {
                    mx = pa[1] + x;
                    my = pa[2] + y;
                }
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    res[i][k] = pa[k];
                }
            }
            var len = res[i].length;
            switch (res[i][0]) {
                case "z":
                    x = mx;
                    y = my;
                    break;
                case "h":
                    x += +res[i][len - 1];
                    break;
                case "v":
                    y += +res[i][len - 1];
                    break;
                default:
                    x += +res[i][len - 2];
                    y += +res[i][len - 1];
            }
        }
        res.toString = toString;
        pth.rel = pathClone(res);
        return res;
    }
    function pathToAbsolute(pathArray) {
        var pth = paths(pathArray);
        if (pth.abs) {
            return pathClone(pth.abs);
        }
        if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) { // rough assumption
            pathArray = Snap.parsePathString(pathArray);
        }
        if (!pathArray || !pathArray.length) {
            return [["M", 0, 0]];
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0,
            pa0;
        if (pathArray[0][0] == "M") {
            x = +pathArray[0][1];
            y = +pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = ["M", x, y];
        }
        var crz = pathArray.length == 3 &&
            pathArray[0][0] == "M" &&
            pathArray[1][0].toUpperCase() == "R" &&
            pathArray[2][0].toUpperCase() == "Z";
        for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
            res.push(r = []);
            pa = pathArray[i];
            pa0 = pa[0];
            if (pa0 != pa0.toUpperCase()) {
                r[0] = pa0.toUpperCase();
                switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +pa[6] + x;
                        r[7] = +pa[7] + y;
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y].concat(pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res.concat(catmullRom2bezier(dots, crz));
                        break;
                    case "O":
                        res.pop();
                        dots = ellipsePath(x, y, pa[1], pa[2]);
                        dots.push(dots[0]);
                        res = res.concat(dots);
                        break;
                    case "U":
                        res.pop();
                        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                        r = ["U"].concat(res[res.length - 1].slice(-2));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + (j % 2 ? x : y);
                        }
                }
            } else if (pa0 == "R") {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ["R"].concat(pa.slice(-2));
            } else if (pa0 == "O") {
                res.pop();
                dots = ellipsePath(x, y, pa[1], pa[2]);
                dots.push(dots[0]);
                res = res.concat(dots);
            } else if (pa0 == "U") {
                res.pop();
                res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                r = ["U"].concat(res[res.length - 1].slice(-2));
            } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    r[k] = pa[k];
                }
            }
            pa0 = pa0.toUpperCase();
            if (pa0 != "O") {
                switch (r[0]) {
                    case "Z":
                        x = +mx;
                        y = +my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = r[r.length - 2];
                        my = r[r.length - 1];
                    default:
                        x = r[r.length - 2];
                        y = r[r.length - 1];
                }
            }
        }
        res.toString = toString;
        pth.abs = pathClone(res);
        return res;
    }
    function l2c(x1, y1, x2, y2) {
        return [x1, y1, x2, y2, x2, y2];
    }
    function q2c(x1, y1, ax, ay, x2, y2) {
        var _13 = 1 / 3,
            _23 = 2 / 3;
        return [
                _13 * x1 + _23 * ax,
                _13 * y1 + _23 * ay,
                _13 * x2 + _23 * ax,
                _13 * y2 + _23 * ay,
                x2,
                y2
            ];
    }
    function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
        // for more information of where this math came from visit:
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        var _120 = PI * 120 / 180,
            rad = PI / 180 * (+angle || 0),
            res = [],
            xy,
            rotate = Snap._.cacher(function (x, y, rad) {
                var X = x * math.cos(rad) - y * math.sin(rad),
                    Y = x * math.sin(rad) + y * math.cos(rad);
                return {x: X, y: Y};
            });
        if (!rx || !ry) {
            return [x1, y1, x2, y2, x2, y2];
        }
        if (!recursive) {
            xy = rotate(x1, y1, -rad);
            x1 = xy.x;
            y1 = xy.y;
            xy = rotate(x2, y2, -rad);
            x2 = xy.x;
            y2 = xy.y;
            var cos = math.cos(PI / 180 * angle),
                sin = math.sin(PI / 180 * angle),
                x = (x1 - x2) / 2,
                y = (y1 - y2) / 2;
            var h = x * x / (rx * rx) + y * y / (ry * ry);
            if (h > 1) {
                h = math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            var rx2 = rx * rx,
                ry2 = ry * ry,
                k = (large_arc_flag == sweep_flag ? -1 : 1) *
                    math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                cx = k * rx * y / ry + (x1 + x2) / 2,
                cy = k * -ry * x / rx + (y1 + y2) / 2,
                f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                f2 = math.asin(((y2 - cy) / ry).toFixed(9));

            f1 = x1 < cx ? PI - f1 : f1;
            f2 = x2 < cx ? PI - f2 : f2;
            f1 < 0 && (f1 = PI * 2 + f1);
            f2 < 0 && (f2 = PI * 2 + f2);
            if (sweep_flag && f1 > f2) {
                f1 = f1 - PI * 2;
            }
            if (!sweep_flag && f2 > f1) {
                f2 = f2 - PI * 2;
            }
        } else {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        var df = f2 - f1;
        if (abs(df) > _120) {
            var f2old = f2,
                x2old = x2,
                y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * math.cos(f2);
            y2 = cy + ry * math.sin(f2);
            res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        var c1 = math.cos(f1),
            s1 = math.sin(f1),
            c2 = math.cos(f2),
            s2 = math.sin(f2),
            t = math.tan(df / 4),
            hx = 4 / 3 * rx * t,
            hy = 4 / 3 * ry * t,
            m1 = [x1, y1],
            m2 = [x1 + hx * s1, y1 - hy * c1],
            m3 = [x2 + hx * s2, y2 - hy * c2],
            m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) {
            return [m2, m3, m4].concat(res);
        } else {
            res = [m2, m3, m4].concat(res).join().split(",");
            var newres = [];
            for (var i = 0, ii = res.length; i < ii; i++) {
                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
            }
            return newres;
        }
    }
    function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t;
        return {
            x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
        };
    }

    // Returns bounding box of cubic bezier curve.
    // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
    // Original version: NISHIO Hirokazu
    // Modifications: https://github.com/timo22345
    function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
        var tvalues = [],
            bounds = [[], []],
            a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        for (var i = 0; i < 2; ++i) {
            if (i == 0) {
                b = 6 * x0 - 12 * x1 + 6 * x2;
                a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                c = 3 * x1 - 3 * x0;
            } else {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            sqrtb2ac = math.sqrt(b2ac);
            if (b2ac < 0) {
                continue;
            }
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }

        var x, y, j = tvalues.length,
            jlen = j,
            mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
        }

        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        bounds[0].length = bounds[1].length = jlen + 2;


        return {
          min: {x: mmin.apply(0, bounds[0]), y: mmin.apply(0, bounds[1])},
          max: {x: mmax.apply(0, bounds[0]), y: mmax.apply(0, bounds[1])}
        };
    }

    function path2curve(path, path2) {
        var pth = !path2 && paths(path);
        if (!path2 && pth.curve) {
            return pathClone(pth.curve);
        }
        var p = pathToAbsolute(path),
            p2 = path2 && pathToAbsolute(path2),
            attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            processPath = function (path, d, pcom) {
                var nx, ny;
                if (!path) {
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                }
                !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
                switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                        break;
                    case "S":
                        if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
                            nx = d.x * 2 - d.bx;          // And reflect the previous
                            ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                        }
                        else {                            // or some else or nothing
                            nx = d.x;
                            ny = d.y;
                        }
                        path = ["C", nx, ny].concat(path.slice(1));
                        break;
                    case "T":
                        if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
                            d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                            d.qy = d.y * 2 - d.qy;        // to case "S".
                        }
                        else {                            // or something else or nothing
                            d.qx = d.x;
                            d.qy = d.y;
                        }
                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                        break;
                }
                return path;
            },
            fixArc = function (pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            fixM = function (path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command

            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
                p2[i] && (pfirst = p2[i][0]);
                if (pfirst != "C") {
                    pcoms2[i] = pfirst;
                    i && (pcom = pcoms2[i - 1]);
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] != "A" && pfirst == "C") {
                    pcoms2[i] = "C";
                }

                fixArc(p2, i);
            }
            fixM(p, p2, attrs, attrs2, i);
            fixM(p2, p, attrs2, attrs, i);
            var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
        }
        if (!p2) {
            pth.curve = pathClone(p);
        }
        return p2 ? [p, p2] : p;
    }
    function mapPath(path, matrix) {
        if (!matrix) {
            return path;
        }
        var x, y, i, j, ii, jj, pathi;
        path = path2curve(path);
        for (i = 0, ii = path.length; i < ii; i++) {
            pathi = path[i];
            for (j = 1, jj = pathi.length; j < jj; j += 2) {
                x = matrix.x(pathi[j], pathi[j + 1]);
                y = matrix.y(pathi[j], pathi[j + 1]);
                pathi[j] = x;
                pathi[j + 1] = y;
            }
        }
        return path;
    }

    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z) {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
            var p = [
                        {x: +crp[i - 2], y: +crp[i - 1]},
                        {x: +crp[i],     y: +crp[i + 1]},
                        {x: +crp[i + 2], y: +crp[i + 3]},
                        {x: +crp[i + 4], y: +crp[i + 5]}
                    ];
            if (z) {
                if (!i) {
                    p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
                } else if (iLen - 4 == i) {
                    p[3] = {x: +crp[0], y: +crp[1]};
                } else if (iLen - 2 == i) {
                    p[2] = {x: +crp[0], y: +crp[1]};
                    p[3] = {x: +crp[2], y: +crp[3]};
                }
            } else {
                if (iLen - 4 == i) {
                    p[3] = p[2];
                } else if (!i) {
                    p[0] = {x: +crp[i], y: +crp[i + 1]};
                }
            }
            d.push(["C",
                  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                  (p[1].x + 6 * p[2].x - p[3].x) / 6,
                  (p[1].y + 6*p[2].y - p[3].y) / 6,
                  p[2].x,
                  p[2].y
            ]);
        }

        return d;
    }

    // export
    Snap.path = paths;

    /*\
     * Snap.path.getTotalLength
     [ method ]
     **
     * Returns the length of the given path in pixels
     **
     - path (string) SVG path string
     **
     = (number) length
    \*/
    Snap.path.getTotalLength = getTotalLength;
    /*\
     * Snap.path.getPointAtLength
     [ method ]
     **
     * Returns the coordinates of the point located at the given length along the given path
     **
     - path (string) SVG path string
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    Snap.path.getPointAtLength = getPointAtLength;
    /*\
     * Snap.path.getSubpath
     [ method ]
     **
     * Returns the subpath of a given path between given start and end lengths
     **
     - path (string) SVG path string
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    Snap.path.getSubpath = function (path, from, to) {
        if (this.getTotalLength(path) - to < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    /*\
     * Element.getTotalLength
     [ method ]
     **
     * Returns the length of the path in pixels (only works for `path` elements)
     = (number) length
    \*/
    elproto.getTotalLength = function () {
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
    };
    // SIERRA Element.getPointAtLength()/Element.getTotalLength(): If a <path> is broken into different segments, is the jump distance to the new coordinates set by the _M_ or _m_ commands calculated as part of the path's total length?
    /*\
     * Element.getPointAtLength
     [ method ]
     **
     * Returns coordinates of the point located at the given length on the given path (only works for `path` elements)
     **
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    elproto.getPointAtLength = function (length) {
        return getPointAtLength(this.attr("d"), length);
    };
    // SIERRA Element.getSubpath(): Similar to the problem for Element.getPointAtLength(). Unclear how this would work for a segmented path. Overall, the concept of _subpath_ and what I'm calling a _segment_ (series of non-_M_ or _Z_ commands) is unclear.
    /*\
     * Element.getSubpath
     [ method ]
     **
     * Returns subpath of a given element from given start and end lengths (only works for `path` elements)
     **
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    elproto.getSubpath = function (from, to) {
        return Snap.path.getSubpath(this.attr("d"), from, to);
    };
    Snap._.box = box;
    /*\
     * Snap.path.findDotsAtSegment
     [ method ]
     **
     * Utility method
     **
     * Finds dot coordinates on the given cubic beziér curve at the given t
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     - t (number) position on the curve (0..1)
     = (object) point information in format:
     o {
     o     x: (number) x coordinate of the point,
     o     y: (number) y coordinate of the point,
     o     m: {
     o         x: (number) x coordinate of the left anchor,
     o         y: (number) y coordinate of the left anchor
     o     },
     o     n: {
     o         x: (number) x coordinate of the right anchor,
     o         y: (number) y coordinate of the right anchor
     o     },
     o     start: {
     o         x: (number) x coordinate of the start of the curve,
     o         y: (number) y coordinate of the start of the curve
     o     },
     o     end: {
     o         x: (number) x coordinate of the end of the curve,
     o         y: (number) y coordinate of the end of the curve
     o     },
     o     alpha: (number) angle of the curve derivative at the point
     o }
    \*/
    Snap.path.findDotsAtSegment = findDotsAtSegment;
    /*\
     * Snap.path.bezierBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given cubic beziér curve
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     * or
     - bez (array) array of six points for beziér curve
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.bezierBBox = bezierBBox;
    /*\
     * Snap.path.isPointInsideBBox
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside bounding box
     - bbox (string) bounding box
     - x (string) x coordinate of the point
     - y (string) y coordinate of the point
     = (boolean) `true` if point is inside
    \*/
    Snap.path.isPointInsideBBox = isPointInsideBBox;
    Snap.closest = function (x, y, X, Y) {
        var r = 100,
            b = box(x - r / 2, y - r / 2, r, r),
            inside = [],
            getter = X[0].hasOwnProperty("x") ? function (i) {
                return {
                    x: X[i].x,
                    y: X[i].y
                };
            } : function (i) {
                return {
                    x: X[i],
                    y: Y[i]
                };
            },
            found = 0;
        while (r <= 1e6 && !found) {
            for (var i = 0, ii = X.length; i < ii; i++) {
                var xy = getter(i);
                if (isPointInsideBBox(b, xy.x, xy.y)) {
                    found++;
                    inside.push(xy);
                    break;
                }
            }
            if (!found) {
                r *= 2;
                b = box(x - r / 2, y - r / 2, r, r)
            }
        }
        if (r == 1e6) {
            return;
        }
        var len = Infinity,
            res;
        for (i = 0, ii = inside.length; i < ii; i++) {
            var l = Snap.len(x, y, inside[i].x, inside[i].y);
            if (len > l) {
                len = l;
                inside[i].len = l;
                res = inside[i];
            }
        }
        return res;
    };
    /*\
     * Snap.path.isBBoxIntersect
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if two bounding boxes intersect
     - bbox1 (string) first bounding box
     - bbox2 (string) second bounding box
     = (boolean) `true` if bounding boxes intersect
    \*/
    Snap.path.isBBoxIntersect = isBBoxIntersect;
    /*\
     * Snap.path.intersection
     [ method ]
     **
     * Utility method
     **
     * Finds intersections of two paths
     - path1 (string) path string
     - path2 (string) path string
     = (array) dots of intersection
     o [
     o     {
     o         x: (number) x coordinate of the point,
     o         y: (number) y coordinate of the point,
     o         t1: (number) t value for segment of path1,
     o         t2: (number) t value for segment of path2,
     o         segment1: (number) order number for segment of path1,
     o         segment2: (number) order number for segment of path2,
     o         bez1: (array) eight coordinates representing beziér curve for the segment of path1,
     o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
     o     }
     o ]
    \*/
    Snap.path.intersection = pathIntersection;
    Snap.path.intersectionNumber = pathIntersectionNumber;
    /*\
     * Snap.path.isPointInside
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside a given closed path.
     *
     * Note: fill mode doesn’t affect the result of this method.
     - path (string) path string
     - x (number) x of the point
     - y (number) y of the point
     = (boolean) `true` if point is inside the path
    \*/
    Snap.path.isPointInside = isPointInsidePath;
    /*\
     * Snap.path.getBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given path
     - path (string) path string
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.getBBox = pathBBox;
    Snap.path.get = getPath;
    /*\
     * Snap.path.toRelative
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into relative values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toRelative = pathToRelative;
    /*\
     * Snap.path.toAbsolute
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into absolute values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toAbsolute = pathToAbsolute;
    /*\
     * Snap.path.toCubic
     [ method ]
     **
     * Utility method
     **
     * Converts path to a new path where all segments are cubic beziér curves
     - pathString (string|array) path string or array of segments
     = (array) array of segments
    \*/
    Snap.path.toCubic = path2curve;
    /*\
     * Snap.path.map
     [ method ]
     **
     * Transform the path string with the given matrix
     - path (string) path string
     - matrix (object) see @Matrix
     = (string) transformed path string
    \*/
    Snap.path.map = mapPath;
    Snap.path.toString = toString;
    Snap.path.clone = pathClone;
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var mmax = Math.max,
        mmin = Math.min;

    // Set
    var Set = function (items) {
        this.items = [];
	this.bindings = {};
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i]) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    },
    setproto = Set.prototype;
    /*\
     * Set.push
     [ method ]
     **
     * Adds each argument to the current set
     = (object) original element
    \*/
    setproto.push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    /*\
     * Set.pop
     [ method ]
     **
     * Removes last element and returns it
     = (object) element
    \*/
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    /*\
     * Set.forEach
     [ method ]
     **
     * Executes given function for each element in the set
     *
     * If the function returns `false`, the loop stops running.
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Set object
    \*/
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i], i) === false) {
                return this;
            }
        }
        return this;
    };
    /*\
     * Set.animate
     [ method ]
     **
     * Animates each element in set in sync.
     *
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     * or
     - animation (array) array of animation parameter for each element in set in format `[attrs, duration, easing, callback]`
     > Usage
     | // animate all elements in set to radius 10
     | set.animate({r: 10}, 500, mina.easein);
     | // or
     | // animate first element to radius 10, but second to radius 20 and in different time
     | set.animate([{r: 10}, 500, mina.easein], [{r: 20}, 1500, mina.easein]);
     = (Element) the current element
    \*/
    setproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Snap._.Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = easing.dur;
            attrs = attrs.attr;
        }
        var args = arguments;
        if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) {
            var each = true;
        }
        var begin,
            handler = function () {
                if (begin) {
                    this.b = begin;
                } else {
                    begin = this.b;
                }
            },
            cb = 0,
            set = this,
            callbacker = callback && function () {
                if (++cb == set.length) {
                    callback.call(this);
                }
            };
        return this.forEach(function (el, i) {
            eve.once("snap.animcreated." + el.id, handler);
            if (each) {
                args[i] && el.animate.apply(el, args[i]);
            } else {
                el.animate(attrs, ms, easing, callbacker);
            }
        });
    };
    /*\
     * Set.remove
     [ method ]
     **
     * Removes all children of the set.
     *
     = (object) Set object
    \*/
    setproto.remove = function () {
        while (this.length) {
            this.pop().remove();
        }
        return this;
    };
    /*\
     * Set.bind
     [ method ]
     **
     * Specifies how to handle a specific attribute when applied
     * to a set.
     *
     **
     - attr (string) attribute name
     - callback (function) function to run
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     - eattr (string) attribute on the element to bind the attribute to
     = (object) Set object
    \*/
    setproto.bind = function (attr, a, b) {
        var data = {};
        if (typeof a == "function") {
            this.bindings[attr] = a;
        } else {
            var aname = b || attr;
            this.bindings[attr] = function (v) {
                data[aname] = v;
                a.attr(data);
            };
        }
        return this;
    };
    /*\
     * Set.attr
     [ method ]
     **
     * Equivalent of @Element.attr.
     = (object) Set object
    \*/
    setproto.attr = function (value) {
        var unbound = {};
        for (var k in value) {
            if (this.bindings[k]) {
                this.bindings[k](value[k]);
            } else {
                unbound[k] = value[k];
            }
        }
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            this.items[i].attr(unbound);
        }
        return this;
    };
    /*\
     * Set.clear
     [ method ]
     **
     * Removes all elements from the set
    \*/
    setproto.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    /*\
     * Set.splice
     [ method ]
     **
     * Removes range of elements from the set
     **
     - index (number) position of the deletion
     - count (number) number of element to remove
     - insertion… (object) #optional elements to insert
     = (object) set elements that were deleted
    \*/
    setproto.splice = function (index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        var tail = [],
            todel = [],
            args = [],
            i;
        for (i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (i = 0; i < count; i++) {
            todel.push(this[index + i]);
        }
        for (; i < this.length - index; i++) {
            tail.push(this[index + i]);
        }
        var arglen = args.length;
        for (i = 0; i < arglen + tail.length; i++) {
            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        }
        i = this.items.length = this.length -= count - arglen;
        while (this[i]) {
            delete this[i++];
        }
        return new Set(todel);
    };
    /*\
     * Set.exclude
     [ method ]
     **
     * Removes given element from the set
     **
     - element (object) element to remove
     = (boolean) `true` if object was found and removed from the set
    \*/
    setproto.exclude = function (el) {
        for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
            this.splice(i, 1);
            return true;
        }
        return false;
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Inserts set elements after given element.
     **
     - element (object) set will be inserted after this element
     = (object) Set object
    \*/
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    /*\
     * Set.getBBox
     [ method ]
     **
     * Union of all bboxes of the set. See @Element.getBBox.
     = (object) bounding box descriptor. See @Element.getBBox.
    \*/
    setproto.getBBox = function () {
        var x = [],
            y = [],
            x2 = [],
            y2 = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            x2.push(box.x + box.width);
            y2.push(box.y + box.height);
        }
        x = mmin.apply(0, x);
        y = mmin.apply(0, y);
        x2 = mmax.apply(0, x2);
        y2 = mmax.apply(0, y2);
        return {
            x: x,
            y: y,
            x2: x2,
            y2: y2,
            width: x2 - x,
            height: y2 - y,
            cx: x + (x2 - x) / 2,
            cy: y + (y2 - y) / 2
        };
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Creates a clone of the set.
     **
     = (object) New Set object
    \*/
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Snap\u2018s set";
    };
    setproto.type = "set";
    // export
    /*\
     * Snap.Set
     [ property ]
     **
     * Set constructor.
    \*/
    Snap.Set = Set;
    /*\
     * Snap.set
     [ method ]
     **
     * Creates a set and fills it with list of arguments.
     **
     = (object) New Set object
     | var r = paper.rect(0, 0, 10, 10),
     |     s1 = Snap.set(), // empty set
     |     s2 = Snap.set(r, paper.circle(100, 100, 20)); // prefilled set
    \*/
    Snap.set = function () {
        var set = new Set;
        if (arguments.length) {
            set.push.apply(set, Array.prototype.slice.call(arguments, 0));
        }
        return set;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var names = {},
        reUnit = /[%a-z]+$/i,
        Str = String;
    names.stroke = names.fill = "colour";
    function getEmpty(item) {
        var l = item[0];
        switch (l.toLowerCase()) {
            case "t": return [l, 0, 0];
            case "m": return [l, 1, 0, 0, 1, 0, 0];
            case "r": if (item.length == 4) {
                return [l, 0, item[2], item[3]];
            } else {
                return [l, 0];
            }
            case "s": if (item.length == 5) {
                return [l, 1, 1, item[3], item[4]];
            } else if (item.length == 3) {
                return [l, 1, 1];
            } else {
                return [l, 1];
            }
        }
    }
    function equaliseTransform(t1, t2, getBBox) {
        t1 = t1 || new Snap.Matrix;
        t2 = t2 || new Snap.Matrix;
        t1 = Snap.parseTransformString(t1.toTransformString()) || [];
        t2 = Snap.parseTransformString(t2.toTransformString()) || [];
        var maxlength = Math.max(t1.length, t2.length),
            from = [],
            to = [],
            i = 0, j, jj,
            tt1, tt2;
        for (; i < maxlength; i++) {
            tt1 = t1[i] || getEmpty(t2[i]);
            tt2 = t2[i] || getEmpty(tt1);
            if (tt1[0] != tt2[0] ||
                tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) ||
                tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4])
                ) {
                    t1 = Snap._.transform2matrix(t1, getBBox());
                    t2 = Snap._.transform2matrix(t2, getBBox());
                    from = [["m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f]];
                    to = [["m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f]];
                    break;
            }
            from[i] = [];
            to[i] = [];
            for (j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) {
                j in tt1 && (from[i][j] = tt1[j]);
                j in tt2 && (to[i][j] = tt2[j]);
            }
        }
        return {
            from: path2array(from),
            to: path2array(to),
            f: getPath(from)
        };
    }
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    function getViewBox(val) {
        return val.join(" ");
    }
    function getColour(clr) {
        return Snap.rgb(clr[0], clr[1], clr[2], clr[3]);
    }
    function getPath(path) {
        var k = 0, i, ii, j, jj, out, a, b = [];
        for (i = 0, ii = path.length; i < ii; i++) {
            out = "[";
            a = ['"' + path[i][0] + '"'];
            for (j = 1, jj = path[i].length; j < jj; j++) {
                a[j] = "val[" + k++ + "]";
            }
            out += a + "]";
            b[i] = out;
        }
        return Function("val", "return Snap.path.toString.call([" + b + "])");
    }
    function path2array(path) {
        var out = [];
        for (var i = 0, ii = path.length; i < ii; i++) {
            for (var j = 1, jj = path[i].length; j < jj; j++) {
                out.push(path[i][j]);
            }
        }
        return out;
    }
    function isNumeric(obj) {
        return isFinite(obj);
    }
    function arrayEqual(arr1, arr2) {
        if (!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) {
            return false;
        }
        return arr1.toString() == arr2.toString();
    }
    Element.prototype.equal = function (name, b) {
        return eve("snap.util.equal", this, name, b).firstDefined();
    };
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this;
        if (names[name] == "colour") {
            A = Snap.color(a);
            B = Snap.color(b);
            return {
                from: [A.r, A.g, A.b, A.opacity],
                to: [B.r, B.g, B.b, B.opacity],
                f: getColour
            };
        }
        if (name == "viewBox") {
            A = this.attr(name).vb.split(" ").map(Number);
            B = b.split(" ").map(Number);
            return {
                from: A,
                to: B,
                f: getViewBox
            };
        }
        if (name == "transform" || name == "gradientTransform" || name == "patternTransform") {
            if (typeof b == "string") {
                b = Str(b).replace(/\.{3}|\u2026/g, a);
            }
            a = this.matrix;
            if (!Snap._.rgTransform.test(b)) {
                b = Snap._.transform2matrix(Snap._.svgTransform2string(b), this.getBBox());
            } else {
                b = Snap._.transform2matrix(b, this.getBBox());
            }
            return equaliseTransform(a, b, function () {
                return el.getBBox(1);
            });
        }
        if (name == "d" || name == "path") {
            A = Snap.path.toCubic(a, b);
            return {
                from: path2array(A[0]),
                to: path2array(A[1]),
                f: getPath(A[0])
            };
        }
        if (name == "points") {
            A = Str(a).split(Snap._.separator);
            B = Str(b).split(Snap._.separator);
            return {
                from: A,
                to: B,
                f: function (val) { return val; }
            };
        }
        if (isNumeric(a) && isNumeric(b)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getNumber
            };
        }
        var aUnit = a.match(reUnit),
            bUnit = Str(b).match(reUnit);
        if (aUnit && arrayEqual(aUnit, bUnit)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getUnit(aUnit)
            };
        } else {
            return {
                from: this.asPX(name),
                to: this.asPX(name, b),
                f: getNumber
            };
        }
    });
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
    has = "hasOwnProperty",
    supportsTouch = "createTouch" in glob.doc,
    events = [
        "click", "dblclick", "mousedown", "mousemove", "mouseout",
        "mouseover", "mouseup", "touchstart", "touchmove", "touchend",
        "touchcancel"
    ],
    touchMap = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    },
    getScroll = function (xy, el) {
        var name = xy == "y" ? "scrollTop" : "scrollLeft",
            doc = el && el.node ? el.node.ownerDocument : glob.doc;
        return doc[name in doc.documentElement ? "documentElement" : "body"][name];
    },
    preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = function (obj, type, fn, element) {
        var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
            f = function (e) {
                var scrollY = getScroll("y", element),
                    scrollX = getScroll("x", element);
                if (supportsTouch && touchMap[has](type)) {
                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                        if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
                            var olde = e;
                            e = e.targetTouches[i];
                            e.originalEvent = olde;
                            e.preventDefault = preventTouch;
                            e.stopPropagation = stopTouch;
                            break;
                        }
                    }
                }
                var x = e.clientX + scrollX,
                    y = e.clientY + scrollY;
                return fn.call(element, e, x, y);
            };

        if (type !== realName) {
            obj.addEventListener(type, f, false);
        }

        obj.addEventListener(realName, f, false);

        return function () {
            if (type !== realName) {
                obj.removeEventListener(type, f, false);
            }

            obj.removeEventListener(realName, f, false);
            return true;
        };
    },
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = getScroll("y"),
            scrollX = getScroll("x"),
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches && e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            var node = dragi.el.node,
                o,
                next = node.nextSibling,
                parent = node.parentNode,
                display = node.style.display;
            // glob.win.opera && parent.removeChild(node);
            // node.style.display = "none";
            // o = dragi.el.paper.getElementByPoint(x, y);
            // node.style.display = display;
            // glob.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            // o && eve("snap.drag.over." + dragi.el.id, dragi.el, o);
            x += scrollX;
            y += scrollY;
            eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        Snap.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
            eve.off("snap.drag.*." + dragi.el.id);
        }
        drag = [];
    };
    /*\
     * Element.click
     [ method ]
     **
     * Adds a click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unclick
     [ method ]
     **
     * Removes a click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.dblclick
     [ method ]
     **
     * Adds a double click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.undblclick
     [ method ]
     **
     * Removes a double click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousedown
     [ method ]
     **
     * Adds a mousedown event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousedown
     [ method ]
     **
     * Removes a mousedown event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousemove
     [ method ]
     **
     * Adds a mousemove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousemove
     [ method ]
     **
     * Removes a mousemove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseout
     [ method ]
     **
     * Adds a mouseout event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseout
     [ method ]
     **
     * Removes a mouseout event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseover
     [ method ]
     **
     * Adds a mouseover event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseover
     [ method ]
     **
     * Removes a mouseover event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseup
     [ method ]
     **
     * Adds a mouseup event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseup
     [ method ]
     **
     * Removes a mouseup event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchstart
     [ method ]
     **
     * Adds a touchstart event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchstart
     [ method ]
     **
     * Removes a touchstart event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchmove
     [ method ]
     **
     * Adds a touchmove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchmove
     [ method ]
     **
     * Removes a touchmove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchend
     [ method ]
     **
     * Adds a touchend event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchend
     [ method ]
     **
     * Removes a touchend event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchcancel
     [ method ]
     **
     * Adds a touchcancel event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchcancel
     [ method ]
     **
     * Removes a touchcancel event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    for (var i = events.length; i--;) {
        (function (eventName) {
            Snap[eventName] = elproto[eventName] = function (fn, scope) {
                if (Snap.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({
                        name: eventName,
                        f: fn,
                        unbind: addEvent(this.node || document, eventName, fn, scope || this)
                    });
                } else {
                    for (var i = 0, ii = this.events.length; i < ii; i++) if (this.events[i].name == eventName) {
                        try {
                            this.events[i].f.call(this);
                        } catch (e) {}
                    }
                }
                return this;
            };
            Snap["un" + eventName] =
            elproto["un" + eventName] = function (fn) {
                var events = this.events || [],
                    l = events.length;
                while (l--) if (events[l].name == eventName &&
                               (events[l].f == fn || !fn)) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    /*\
     * Element.hover
     [ method ]
     **
     * Adds hover event handlers to the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     - icontext (object) #optional context for hover in handler
     - ocontext (object) #optional context for hover out handler
     = (object) @Element
    \*/
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    /*\
     * Element.unhover
     [ method ]
     **
     * Removes hover event handlers from the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     = (object) @Element
    \*/
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    var draggable = [];
    // SIERRA unclear what _context_ refers to for starting, ending, moving the drag gesture.
    // SIERRA Element.drag(): _x position of the mouse_: Where are the x/y values offset from?
    // SIERRA Element.drag(): much of this member's doc appears to be duplicated for some reason.
    // SIERRA Unclear about this sentence: _Additionally following drag events will be triggered: drag.start.<id> on start, drag.end.<id> on end and drag.move.<id> on every move._ Is there a global _drag_ object to which you can assign handlers keyed by an element's ID?
    /*\
     * Element.drag
     [ method ]
     **
     * Adds event handlers for an element's drag gesture
     **
     - onmove (function) handler for moving
     - onstart (function) handler for drag start
     - onend (function) handler for drag end
     - mcontext (object) #optional context for moving handler
     - scontext (object) #optional context for drag start handler
     - econtext (object) #optional context for drag end handler
     * Additionaly following `drag` events are triggered: `drag.start.<id>` on start, 
     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element is dragged over another element 
     * `drag.over.<id>` fires as well.
     *
     * Start event and start handler are called in specified context or in context of the element with following parameters:
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * Move event and move handler are called in specified context or in context of the element with following parameters:
     o dx (number) shift by x from the start point
     o dy (number) shift by y from the start point
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * End event and end handler are called in specified context or in context of the element with following parameters:
     o event (object) DOM event object
     = (object) @Element
    \*/
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        var el = this;
        if (!arguments.length) {
            var origTransform;
            return el.drag(function (dx, dy) {
                this.attr({
                    transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
                });
            }, function () {
                origTransform = this.transform().local;
            });
        }
        function start(e, x, y) {
            (e.originalEvent || e).preventDefault();
            el._drag.x = x;
            el._drag.y = y;
            el._drag.id = e.identifier;
            !drag.length && Snap.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: el, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
            onstart && eve.on("snap.drag.start." + el.id, onstart);
            onmove && eve.on("snap.drag.move." + el.id, onmove);
            onend && eve.on("snap.drag.end." + el.id, onend);
            eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
        }
        function init(e, x, y) {
            eve("snap.draginit." + el.id, el, e, x, y);
        }
        eve.on("snap.draginit." + el.id, start);
        el._drag = {};
        draggable.push({el: el, start: start, init: init});
        el.mousedown(init);
        return el;
    };
    /*
     * Element.onDragOver
     [ method ]
     **
     * Shortcut to assign event handler for `drag.over.<id>` event, where `id` is the element's `id` (see @Element.id)
     - f (function) handler for event, first argument would be the element you are dragging over
    \*/
    // elproto.onDragOver = function (f) {
    //     f ? eve.on("snap.drag.over." + this.id, f) : eve.unbind("snap.drag.over." + this.id);
    // };
    /*\
     * Element.undrag
     [ method ]
     **
     * Removes all drag event handlers from the given element
    \*/
    elproto.undrag = function () {
        var i = draggable.length;
        while (i--) if (draggable[i].el == this) {
            this.unmousedown(draggable[i].init);
            draggable.splice(i, 1);
            eve.unbind("snap.drag.*." + this.id);
            eve.unbind("snap.draginit." + this.id);
        }
        !draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp);
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        pproto = Paper.prototype,
        rgurl = /^\s*url\((.+)\)/,
        Str = String,
        $ = Snap._.$;
    Snap.filter = {};
    /*\
     * Paper.filter
     [ method ]
     **
     * Creates a `<filter>` element
     **
     - filstr (string) SVG fragment of filter provided as a string
     = (object) @Element
     * Note: It is recommended to use filters embedded into the page inside an empty SVG element.
     > Usage
     | var f = paper.filter('<feGaussianBlur stdDeviation="2"/>'),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    pproto.filter = function (filstr) {
        var paper = this;
        if (paper.type != "svg") {
            paper = paper.paper;
        }
        var f = Snap.parse(Str(filstr)),
            id = Snap._.id(),
            width = paper.node.offsetWidth,
            height = paper.node.offsetHeight,
            filter = $("filter");
        $(filter, {
            id: id,
            filterUnits: "userSpaceOnUse"
        });
        filter.appendChild(f.node);
        paper.defs.appendChild(filter);
        return new Element(filter);
    };

    eve.on("snap.util.getattr.filter", function () {
        eve.stop();
        var p = $(this.node, "filter");
        if (p) {
            var match = Str(p).match(rgurl);
            return match && Snap.select(match[1]);
        }
    });
    eve.on("snap.util.attr.filter", function (value) {
        if (value instanceof Element && value.type == "filter") {
            eve.stop();
            var id = value.node.id;
            if (!id) {
                $(value.node, {id: value.id});
                id = value.id;
            }
            $(this.node, {
                filter: Snap.url(id)
            });
        }
        if (!value || value == "none") {
            eve.stop();
            this.node.removeAttribute("filter");
        }
    });
    /*\
     * Snap.filter.blur
     [ method ]
     **
     * Returns an SVG markup string for the blur filter
     **
     - x (number) amount of horizontal blur, in pixels
     - y (number) #optional amount of vertical blur, in pixels
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.blur(5, 10)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.blur = function (x, y) {
        if (x == null) {
            x = 2;
        }
        var def = y == null ? x : [x, y];
        return Snap.format('\<feGaussianBlur stdDeviation="{def}"/>', {
            def: def
        });
    };
    Snap.filter.blur.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.shadow
     [ method ]
     **
     * Returns an SVG markup string for the shadow filter
     **
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - blur (number) #optional amount of blur
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * which makes blur default to `4`. Or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - opacity (number) #optional `0..1` opacity of the shadow
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.shadow(0, 2, .3)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.shadow = function (dx, dy, blur, color, opacity) {
        if (opacity == null) {
            if (color == null) {
                opacity = blur;
                blur = 4;
                color = "#000";
            } else {
                opacity = color;
                color = blur;
                blur = 4;
            }
        }
        if (blur == null) {
            blur = 4;
        }
        if (opacity == null) {
            opacity = 1;
        }
        if (dx == null) {
            dx = 0;
            dy = 2;
        }
        if (dy == null) {
            dy = dx;
        }
        color = Snap.color(color);
        return Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
            color: color,
            dx: dx,
            dy: dy,
            blur: blur,
            opacity: opacity
        });
    };
    Snap.filter.shadow.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.grayscale
     [ method ]
     **
     * Returns an SVG markup string for the grayscale filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.grayscale = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
            a: 0.2126 + 0.7874 * (1 - amount),
            b: 0.7152 - 0.7152 * (1 - amount),
            c: 0.0722 - 0.0722 * (1 - amount),
            d: 0.2126 - 0.2126 * (1 - amount),
            e: 0.7152 + 0.2848 * (1 - amount),
            f: 0.0722 - 0.0722 * (1 - amount),
            g: 0.2126 - 0.2126 * (1 - amount),
            h: 0.0722 + 0.9278 * (1 - amount)
        });
    };
    Snap.filter.grayscale.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.sepia
     [ method ]
     **
     * Returns an SVG markup string for the sepia filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.sepia = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
            a: 0.393 + 0.607 * (1 - amount),
            b: 0.769 - 0.769 * (1 - amount),
            c: 0.189 - 0.189 * (1 - amount),
            d: 0.349 - 0.349 * (1 - amount),
            e: 0.686 + 0.314 * (1 - amount),
            f: 0.168 - 0.168 * (1 - amount),
            g: 0.272 - 0.272 * (1 - amount),
            h: 0.534 - 0.534 * (1 - amount),
            i: 0.131 + 0.869 * (1 - amount)
        });
    };
    Snap.filter.sepia.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.saturate
     [ method ]
     **
     * Returns an SVG markup string for the saturate filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.saturate = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
            amount: 1 - amount
        });
    };
    Snap.filter.saturate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.hueRotate
     [ method ]
     **
     * Returns an SVG markup string for the hue-rotate filter
     **
     - angle (number) angle of rotation
     = (string) filter representation
    \*/
    Snap.filter.hueRotate = function (angle) {
        angle = angle || 0;
        return Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
            angle: angle
        });
    };
    Snap.filter.hueRotate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.invert
     [ method ]
     **
     * Returns an SVG markup string for the invert filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.invert = function (amount) {
        if (amount == null) {
            amount = 1;
        }
//        <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB"/>
        return Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: 1 - amount
        });
    };
    Snap.filter.invert.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.brightness
     [ method ]
     **
     * Returns an SVG markup string for the brightness filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.brightness = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
            amount: amount
        });
    };
    Snap.filter.brightness.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.contrast
     [ method ]
     **
     * Returns an SVG markup string for the contrast filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.contrast = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: .5 - amount / 2
        });
    };
    Snap.filter.contrast.toString = function () {
        return this();
    };
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var box = Snap._.box,
        is = Snap.is,
        firstLetter = /^[^a-z]*([tbmlrc])/i,
        toString = function () {
            return "T" + this.dx + "," + this.dy;
        };
    /*\
     * Element.getAlign
     [ method ]
     **
     * Returns shift needed to align the element relatively to given element.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object|string) Object in format `{dx: , dy: }` also has a string representation as a transformation string
     > Usage
     | el.transform(el.getAlign(el2, "top"));
     * or
     | var dy = el.getAlign(el2, "top").dy;
    \*/
    Element.prototype.getAlign = function (el, way) {
        if (way == null && is(el, "string")) {
            way = el;
            el = null;
        }
        el = el || this.paper;
        var bx = el.getBBox ? el.getBBox() : box(el),
            bb = this.getBBox(),
            out = {};
        way = way && way.match(firstLetter);
        way = way ? way[1].toLowerCase() : "c";
        switch (way) {
            case "t":
                out.dx = 0;
                out.dy = bx.y - bb.y;
            break;
            case "b":
                out.dx = 0;
                out.dy = bx.y2 - bb.y2;
            break;
            case "m":
                out.dx = 0;
                out.dy = bx.cy - bb.cy;
            break;
            case "l":
                out.dx = bx.x - bb.x;
                out.dy = 0;
            break;
            case "r":
                out.dx = bx.x2 - bb.x2;
                out.dy = 0;
            break;
            default:
                out.dx = bx.cx - bb.cx;
                out.dy = 0;
            break;
        }
        out.toString = toString;
        return out;
    };
    /*\
     * Element.align
     [ method ]
     **
     * Aligns the element relatively to given one via transformation.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object) this element
     > Usage
     | el.align(el2, "top");
     * or
     | el.align("middle");
    \*/
    Element.prototype.align = function (el, way) {
        return this.transform("..." + this.getAlign(el, way));
    };
});

// Copyright (c) 2016 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        has = "hasOwnProperty";
    function slice(from, to, f) {
        return function (arr) {
            var res = arr.slice(from, to);
            if (res.length == 1) {
                res = res[0];
            }
            return f ? f(res) : res;
        };
    }
    var Animation = function (attr, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        this.attr = attr;
        this.dur = ms;
        easing && (this.easing = easing);
        callback && (this.callback = callback);
    };
    Snap._.Animation = Animation;
    /*\
     * Snap.animation
     [ method ]
     **
     * Creates an animation object
     **
     - attr (object) attributes of final destination
     - duration (number) duration of the animation, in milliseconds
     - easing (function) #optional one of easing functions of @mina or custom one
     - callback (function) #optional callback function that fires when animation ends
     = (object) animation object
    \*/
    Snap.animation = function (attr, ms, easing, callback) {
        return new Animation(attr, ms, easing, callback);
    };
    /*\
     * Element.inAnim
     [ method ]
     **
     * Returns a set of animations that may be able to manipulate the current element
     **
     = (object) in format:
     o {
     o     anim (object) animation object,
     o     mina (object) @mina object,
     o     curStatus (number) 0..1 — status of the animation: 0 — just started, 1 — just finished,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
    \*/
    elproto.inAnim = function () {
        var el = this,
            res = [];
        for (var id in el.anims) if (el.anims[has](id)) {
            (function (a) {
                res.push({
                    anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
                    mina: a,
                    curStatus: a.status(),
                    status: function (val) {
                        return a.status(val);
                    },
                    stop: function () {
                        a.stop();
                    }
                });
            }(el.anims[id]));
        }
        return res;
    };
    /*\
     * Snap.animate
     [ method ]
     **
     * Runs generic animation of one number into another with a caring function
     **
     - from (number|array) number or array of numbers
     - to (number|array) number or array of numbers
     - setter (function) caring function that accepts one number argument
     - duration (number) duration, in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function to execute when animation ends
     = (object) animation object in @mina format
     o {
     o     id (string) animation id, consider it read-only,
     o     duration (function) gets or sets the duration of the animation,
     o     easing (function) easing,
     o     speed (function) gets or sets the speed of the animation,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
     | var rect = Snap().rect(0, 0, 10, 10);
     | Snap.animate(0, 10, function (val) {
     |     rect.attr({
     |         x: val
     |     });
     | }, 1000);
     | // in given context is equivalent to
     | rect.animate({x: 10}, 1000);
    \*/
    Snap.animate = function (from, to, setter, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        var now = mina.time(),
            anim = mina(from, to, now, now + ms, mina.time, setter, easing);
        callback && eve.once("mina.finish." + anim.id, callback);
        return anim;
    };
    /*\
     * Element.stop
     [ method ]
     **
     * Stops all the animations for the current element
     **
     = (Element) the current element
    \*/
    elproto.stop = function () {
        var anims = this.inAnim();
        for (var i = 0, ii = anims.length; i < ii; i++) {
            anims[i].stop();
        }
        return this;
    };
    /*\
     * Element.animate
     [ method ]
     **
     * Animates the given attributes of the element
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     = (Element) the current element
    \*/
    elproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = attrs.dur;
            attrs = attrs.attr;
        }
        var fkeys = [], tkeys = [], keys = {}, from, to, f, eq,
            el = this;
        for (var key in attrs) if (attrs[has](key)) {
            if (el.equal) {
                eq = el.equal(key, Str(attrs[key]));
                from = eq.from;
                to = eq.to;
                f = eq.f;
            } else {
                from = +el.attr(key);
                to = +attrs[key];
            }
            var len = is(from, "array") ? from.length : 1;
            keys[key] = slice(fkeys.length, fkeys.length + len, f);
            fkeys = fkeys.concat(from);
            tkeys = tkeys.concat(to);
        }
        var now = mina.time(),
            anim = mina(fkeys, tkeys, now, now + ms, mina.time, function (val) {
                var attr = {};
                for (var key in keys) if (keys[has](key)) {
                    attr[key] = keys[key](val);
                }
                el.attr(attr);
            }, easing);
        el.anims[anim.id] = anim;
        anim._attrs = attrs;
        anim._callback = callback;
        eve("snap.animcreated." + el.id, anim);
        eve.once("mina.finish." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
            callback && callback.call(el);
        });
        eve.once("mina.stop." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
        });
        return el;
    };
});

// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    // Colours are from https://www.materialui.co
    var red         = "#ffebee#ffcdd2#ef9a9a#e57373#ef5350#f44336#e53935#d32f2f#c62828#b71c1c#ff8a80#ff5252#ff1744#d50000",
        pink        = "#FCE4EC#F8BBD0#F48FB1#F06292#EC407A#E91E63#D81B60#C2185B#AD1457#880E4F#FF80AB#FF4081#F50057#C51162",
        purple      = "#F3E5F5#E1BEE7#CE93D8#BA68C8#AB47BC#9C27B0#8E24AA#7B1FA2#6A1B9A#4A148C#EA80FC#E040FB#D500F9#AA00FF",
        deeppurple  = "#EDE7F6#D1C4E9#B39DDB#9575CD#7E57C2#673AB7#5E35B1#512DA8#4527A0#311B92#B388FF#7C4DFF#651FFF#6200EA",
        indigo      = "#E8EAF6#C5CAE9#9FA8DA#7986CB#5C6BC0#3F51B5#3949AB#303F9F#283593#1A237E#8C9EFF#536DFE#3D5AFE#304FFE",
        blue        = "#E3F2FD#BBDEFB#90CAF9#64B5F6#64B5F6#2196F3#1E88E5#1976D2#1565C0#0D47A1#82B1FF#448AFF#2979FF#2962FF",
        lightblue   = "#E1F5FE#B3E5FC#81D4FA#4FC3F7#29B6F6#03A9F4#039BE5#0288D1#0277BD#01579B#80D8FF#40C4FF#00B0FF#0091EA",
        cyan        = "#E0F7FA#B2EBF2#80DEEA#4DD0E1#26C6DA#00BCD4#00ACC1#0097A7#00838F#006064#84FFFF#18FFFF#00E5FF#00B8D4",
        teal        = "#E0F2F1#B2DFDB#80CBC4#4DB6AC#26A69A#009688#00897B#00796B#00695C#004D40#A7FFEB#64FFDA#1DE9B6#00BFA5",
        green       = "#E8F5E9#C8E6C9#A5D6A7#81C784#66BB6A#4CAF50#43A047#388E3C#2E7D32#1B5E20#B9F6CA#69F0AE#00E676#00C853",
        lightgreen  = "#F1F8E9#DCEDC8#C5E1A5#AED581#9CCC65#8BC34A#7CB342#689F38#558B2F#33691E#CCFF90#B2FF59#76FF03#64DD17",
        lime        = "#F9FBE7#F0F4C3#E6EE9C#DCE775#D4E157#CDDC39#C0CA33#AFB42B#9E9D24#827717#F4FF81#EEFF41#C6FF00#AEEA00",
        yellow      = "#FFFDE7#FFF9C4#FFF59D#FFF176#FFEE58#FFEB3B#FDD835#FBC02D#F9A825#F57F17#FFFF8D#FFFF00#FFEA00#FFD600",
        amber       = "#FFF8E1#FFECB3#FFE082#FFD54F#FFCA28#FFC107#FFB300#FFA000#FF8F00#FF6F00#FFE57F#FFD740#FFC400#FFAB00",
        orange      = "#FFF3E0#FFE0B2#FFCC80#FFB74D#FFA726#FF9800#FB8C00#F57C00#EF6C00#E65100#FFD180#FFAB40#FF9100#FF6D00",
        deeporange  = "#FBE9E7#FFCCBC#FFAB91#FF8A65#FF7043#FF5722#F4511E#E64A19#D84315#BF360C#FF9E80#FF6E40#FF3D00#DD2C00",
        brown       = "#EFEBE9#D7CCC8#BCAAA4#A1887F#8D6E63#795548#6D4C41#5D4037#4E342E#3E2723",
        grey        = "#FAFAFA#F5F5F5#EEEEEE#E0E0E0#BDBDBD#9E9E9E#757575#616161#424242#212121",
        bluegrey    = "#ECEFF1#CFD8DC#B0BEC5#90A4AE#78909C#607D8B#546E7A#455A64#37474F#263238";
    /*\
     * Snap.mui
     [ property ]
     **
     * Contain Material UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.mui.deeppurple, stroke: Snap.mui.amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.mui = {};
    /*\
     * Snap.flat
     [ property ]
     **
     * Contain Flat UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.flat.carrot, stroke: Snap.flat.wetasphalt});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.flat = {};
    function saveColor(colors) {
        colors = colors.split(/(?=#)/);
        var color = new String(colors[5]);
        color[50] = colors[0];
        color[100] = colors[1];
        color[200] = colors[2];
        color[300] = colors[3];
        color[400] = colors[4];
        color[500] = colors[5];
        color[600] = colors[6];
        color[700] = colors[7];
        color[800] = colors[8];
        color[900] = colors[9];
        if (colors[10]) {
            color.A100 = colors[10];
            color.A200 = colors[11];
            color.A400 = colors[12];
            color.A700 = colors[13];
        }
        return color;
    }
    Snap.mui.red = saveColor(red);
    Snap.mui.pink = saveColor(pink);
    Snap.mui.purple = saveColor(purple);
    Snap.mui.deeppurple = saveColor(deeppurple);
    Snap.mui.indigo = saveColor(indigo);
    Snap.mui.blue = saveColor(blue);
    Snap.mui.lightblue = saveColor(lightblue);
    Snap.mui.cyan = saveColor(cyan);
    Snap.mui.teal = saveColor(teal);
    Snap.mui.green = saveColor(green);
    Snap.mui.lightgreen = saveColor(lightgreen);
    Snap.mui.lime = saveColor(lime);
    Snap.mui.yellow = saveColor(yellow);
    Snap.mui.amber = saveColor(amber);
    Snap.mui.orange = saveColor(orange);
    Snap.mui.deeporange = saveColor(deeporange);
    Snap.mui.brown = saveColor(brown);
    Snap.mui.grey = saveColor(grey);
    Snap.mui.bluegrey = saveColor(bluegrey);
    Snap.flat.turquoise = "#1abc9c";
    Snap.flat.greensea = "#16a085";
    Snap.flat.sunflower = "#f1c40f";
    Snap.flat.orange = "#f39c12";
    Snap.flat.emerland = "#2ecc71";
    Snap.flat.nephritis = "#27ae60";
    Snap.flat.carrot = "#e67e22";
    Snap.flat.pumpkin = "#d35400";
    Snap.flat.peterriver = "#3498db";
    Snap.flat.belizehole = "#2980b9";
    Snap.flat.alizarin = "#e74c3c";
    Snap.flat.pomegranate = "#c0392b";
    Snap.flat.amethyst = "#9b59b6";
    Snap.flat.wisteria = "#8e44ad";
    Snap.flat.clouds = "#ecf0f1";
    Snap.flat.silver = "#bdc3c7";
    Snap.flat.wetasphalt = "#34495e";
    Snap.flat.midnightblue = "#2c3e50";
    Snap.flat.concrete = "#95a5a6";
    Snap.flat.asbestos = "#7f8c8d";
    /*\
     * Snap.importMUIColors
     [ method ]
     **
     * Imports Material UI colours into global object.
     | Snap.importMUIColors();
     | Snap().rect(0, 0, 10, 10).attr({fill: deeppurple, stroke: amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.importMUIColors = function () {
        for (var color in Snap.mui) {
            if (Snap.mui.hasOwnProperty(color)) {
                window[color] = Snap.mui[color];
            }
        }
    };
});

module.exports = Snap


/***/ }),

/***/ "./src/lib/components/NavBar.react.js":
/*!********************************************!*\
  !*** ./src/lib/components/NavBar.react.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NavBar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_burger_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-burger-menu */ "./node_modules/react-burger-menu/lib/BurgerMenu.js");
/* harmony import */ var react_burger_menu__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_burger_menu__WEBPACK_IMPORTED_MODULE_2__);



/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */

function NavBar() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_burger_menu__WEBPACK_IMPORTED_MODULE_2__["slide"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    id: "home",
    className: "menu-item",
    href: "/"
  }, "Home"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    id: "about",
    className: "menu-item",
    href: "/about"
  }, "About"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    id: "contact",
    className: "menu-item",
    href: "/contact"
  }, "Contact"));
}
NavBar.defaultProps = {};
NavBar.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};

/***/ }),

/***/ "./src/lib/index.js":
/*!**************************!*\
  !*** ./src/lib/index.js ***!
  \**************************/
/*! exports provided: SearchBar, Accordion, Treemap, Navbar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SearchBar_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/SearchBar.react */ "./src/lib/components/SearchBar.react.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SearchBar", function() { return _components_SearchBar_react__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _components_Accordion_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Accordion.react */ "./src/lib/components/Accordion.react.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Accordion", function() { return _components_Accordion_react__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _components_Treemap_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Treemap.react */ "./src/lib/components/Treemap.react.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Treemap", function() { return _components_Treemap_react__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _components_NavBar_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/NavBar.react */ "./src/lib/components/NavBar.react.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Navbar", function() { return _components_NavBar_react__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* eslint-disable import/prefer-default-export */






/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL2V2ZS9ldmUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvQnVyZ2VyTWVudS5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9jb21wb25lbnRzL0J1cmdlckljb24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvY29tcG9uZW50cy9Dcm9zc0ljb24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvaGVscGVycy9iYXNlU3R5bGVzLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvZG9tLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvc25hcHN2Z0ltcG9ydGVyLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudUZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvYnViYmxlLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL21lbnVzL2VsYXN0aWMuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvZmFsbERvd24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvcHVzaC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9tZW51cy9wdXNoUm90YXRlLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL21lbnVzL3JldmVhbC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9tZW51cy9zY2FsZURvd24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc2NhbGVSb3RhdGUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc2xpZGUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc3RhY2suanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9zbmFwc3ZnLWNqcy9kaXN0L3NuYXAuc3ZnLWNqcy5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6WyJOYXZCYXIiLCJkZWZhdWx0UHJvcHMiLCJwcm9wVHlwZXMiLCJpZCIsIlByb3BUeXBlcyIsInN0cmluZyIsInNldFByb3BzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGtCQUFrQixNQUFNO0FBQ3hCO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxxRkFBcUYsTUFBTTtBQUMzRjtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUMsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFFBQVE7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBNEIsNENBQTRDLEtBQTBDLEdBQUcsaUNBQWMsRUFBRSxtQ0FBRSxhQUFhLFlBQVksRUFBRTtBQUFBLG9HQUFDLEdBQUcsU0FBYztBQUN4TCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDbGJZOztBQUViO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxTQUFTLG1CQUFPLENBQUMsMEVBQWU7QUFDaEMsU0FBUyxtQkFBTyxDQUFDLDBFQUFlO0FBQ2hDLFdBQVcsbUJBQU8sQ0FBQyw4RUFBaUI7QUFDcEMsVUFBVSxtQkFBTyxDQUFDLDRFQUFnQjtBQUNsQyxRQUFRLG1CQUFPLENBQUMsd0VBQWM7QUFDOUIsY0FBYyxtQkFBTyxDQUFDLG9GQUFvQjtBQUMxQyxhQUFhLG1CQUFPLENBQUMsa0ZBQW1CO0FBQ3hDLGVBQWUsbUJBQU8sQ0FBQyxzRkFBcUI7QUFDNUMsWUFBWSxtQkFBTyxDQUFDLGdGQUFrQjtBQUN0QyxVQUFVLG1CQUFPLENBQUMsNEVBQWdCO0FBQ2xDO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pCYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxtREFBbUQsZ0JBQWdCLHNCQUFzQixPQUFPLDJCQUEyQiwwQkFBMEIseURBQXlELDJCQUEyQixFQUFFLEVBQUUsRUFBRSxlQUFlOztBQUU5UCxpQ0FBaUMsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsMkRBQTJELEVBQUUsRUFBRSx5REFBeUQscUVBQXFFLDZEQUE2RCxvQkFBb0IsR0FBRyxFQUFFOztBQUVsakIsdUNBQXVDLG1CQUFtQiw0QkFBNEIsaURBQWlELGdCQUFnQixrREFBa0QsOERBQThELDBCQUEwQiw0Q0FBNEMsdUJBQXVCLGtCQUFrQixFQUFFLE9BQU8sYUFBYSxnQkFBZ0IsZ0JBQWdCLGVBQWUsMkJBQTJCLG9CQUFvQixFQUFFLEVBQUUsNEJBQTRCLG1CQUFtQixFQUFFLE9BQU8sdUJBQXVCLDRCQUE0QixrQkFBa0IsRUFBRSw4QkFBOEIsRUFBRSxFQUFFOztBQUUvb0Isc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLGlEQUFpRCwwQ0FBMEMsMERBQTBELEVBQUU7O0FBRXZKLDBDQUEwQywrREFBK0QscUdBQXFHLEVBQUUseUVBQXlFLGVBQWUseUVBQXlFLEVBQUUsRUFBRSx1SEFBdUg7O0FBRTVlLGFBQWEsbUJBQU8sQ0FBQyw0Q0FBTzs7QUFFNUI7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsc0RBQVk7O0FBRXJDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDLGFBQWE7QUFDYixXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixlQUFlO0FBQzFDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsY0FBYztBQUM1QztBQUNBLCtDQUErQyxrQkFBa0I7QUFDakU7QUFDQSxhQUFhO0FBQ2I7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBLCtDQUErQyxtQkFBbUI7QUFDbEU7QUFDQSxhQUFhO0FBQ2I7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUMzSWE7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsbURBQW1ELGdCQUFnQixzQkFBc0IsT0FBTywyQkFBMkIsMEJBQTBCLHlEQUF5RCwyQkFBMkIsRUFBRSxFQUFFLEVBQUUsZUFBZTs7QUFFOVAsaUNBQWlDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQsb0JBQW9CLEdBQUcsRUFBRTs7QUFFbGpCLHVDQUF1QyxtQkFBbUIsNEJBQTRCLGlEQUFpRCxnQkFBZ0Isa0RBQWtELDhEQUE4RCwwQkFBMEIsNENBQTRDLHVCQUF1QixrQkFBa0IsRUFBRSxPQUFPLGFBQWEsZ0JBQWdCLGdCQUFnQixlQUFlLDJCQUEyQixvQkFBb0IsRUFBRSxFQUFFLDRCQUE0QixtQkFBbUIsRUFBRSxPQUFPLHVCQUF1Qiw0QkFBNEIsa0JBQWtCLEVBQUUsOEJBQThCLEVBQUUsRUFBRTs7QUFFL29CLHNDQUFzQyx1Q0FBdUMsa0JBQWtCOztBQUUvRixpREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SiwwQ0FBMEMsK0RBQStELHFHQUFxRyxFQUFFLHlFQUF5RSxlQUFlLHlFQUF5RSxFQUFFLEVBQUUsdUhBQXVIOztBQUU1ZSxhQUFhLG1CQUFPLENBQUMsNENBQU87O0FBRTVCOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHNEQUFZOztBQUVyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxXQUFXLFNBQVMsa0RBQWtELEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ3BJYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDN0RhOztBQUViO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDaEVhOztBQUViO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsbUJBQU8sQ0FBQyxvRUFBYTtBQUNoQyxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLG9DOzs7Ozs7Ozs7Ozs7QUNmYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDBCOzs7Ozs7Ozs7Ozs7QUNSYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxtQ0FBbUMsaUNBQWlDLGVBQWUsZUFBZSxnQkFBZ0Isb0JBQW9CLE1BQU0sMENBQTBDLCtCQUErQixhQUFhLHFCQUFxQixtQ0FBbUMsRUFBRSxFQUFFLGNBQWMsV0FBVyxVQUFVLEVBQUUsVUFBVSxNQUFNLHlDQUF5QyxFQUFFLFVBQVUsa0JBQWtCLEVBQUUsRUFBRSxhQUFhLEVBQUUsMkJBQTJCLDBCQUEwQixZQUFZLEVBQUUsMkNBQTJDLDhCQUE4QixFQUFFLE9BQU8sNkVBQTZFLEVBQUUsR0FBRyxFQUFFOztBQUV0cEIsbURBQW1ELGdCQUFnQixzQkFBc0IsT0FBTywyQkFBMkIsMEJBQTBCLHlEQUF5RCwyQkFBMkIsRUFBRSxFQUFFLEVBQUUsZUFBZTs7QUFFOVAsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLGFBQWEsbUJBQU8sQ0FBQyw0Q0FBTzs7QUFFNUI7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsb0RBQVc7O0FBRW5DOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHNEQUFZOztBQUVyQzs7QUFFQSx5QkFBeUIsbUJBQU8sQ0FBQyx3RkFBc0I7O0FBRXZEOztBQUVBLGtCQUFrQixtQkFBTyxDQUFDLDBFQUFlOztBQUV6Qyw0QkFBNEIsbUJBQU8sQ0FBQyw4RkFBeUI7O0FBRTdEOztBQUVBLDJCQUEyQixtQkFBTyxDQUFDLDRGQUF3Qjs7QUFFM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9EO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0NBQW9DO0FBQ3hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsaUJBQWlCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFdBQVc7QUFDWCxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsNEVBQTRFOztBQUU1RTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTLGlDQUFpQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixzREFBc0QsNEJBQTRCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGtDQUFrQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0M7Ozs7Ozs7Ozs7OztBQ2xmYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsOEJBQThCLG1CQUFPLENBQUMsbUdBQTRCOztBQUVsRTs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQywyRUFBZ0I7O0FBRTNDOztBQUVBLG9CQUFvQixtQkFBTyxDQUFDLCtFQUFrQjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7QUFDdkY7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pIYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsOEJBQThCLG1CQUFPLENBQUMsbUdBQTRCOztBQUVsRTs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQywyRUFBZ0I7O0FBRTNDOztBQUVBLG9CQUFvQixtQkFBTyxDQUFDLCtFQUFrQjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pHYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQzdDYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2hDYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ25DYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ3ZFYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUNsQ2E7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUNuQ2E7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDZmE7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7QUNyQ0EsYUFBYSxtQkFBTyxDQUFDLHNDQUFLOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0Q0FBNEM7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLEVBQUUsWUFBWSxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxhQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxzQkFBc0I7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLHdCQUF3QixLQUFLLEtBQUs7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdEQUFnRCwwQkFBMEI7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRixVQUFVO0FBQ3BHO0FBQ0Esa0ZBQWtGLFdBQVc7QUFDN0Y7QUFDQSw0RkFBNEYsV0FBVztBQUN2RztBQUNBO0FBQ0E7QUFDQSw0RkFBNEYsV0FBVztBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLDZFQUE2RTtBQUNwRztBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw0RUFBNEU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFdBQVc7QUFDM0I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQkFBcUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHFDQUFxQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1Isb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiLDZDQUE2QyxFQUFFO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLCtCQUErQjtBQUM3RCxhQUFhO0FBQ2IsOEJBQThCLDhCQUE4QjtBQUM1RCxhQUFhO0FBQ2IsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0Esd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsYUFBYTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsUUFBUTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0SUFBNEksTUFBTSxXQUFXLE9BQU8sWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEdBQUcsU0FBUztBQUNuTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsU0FBUztBQUMvQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsdUJBQXVCO0FBQ3BELGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsa0JBQWtCO0FBQ3pEO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsYUFBYTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxhQUFhO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixrQkFBa0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHVCQUF1QjtBQUMxRCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDJCQUEyQjtBQUMzQztBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixTQUFTO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsc0NBQXNDLFdBQVc7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixhQUFhO0FBQzdCLGdCQUFnQixhQUFhO0FBQzdCLG9CQUFvQixhQUFhO0FBQ2pDLGtCQUFrQixhQUFhO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQiwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qiw2REFBNkQsUUFBUTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELFFBQVE7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxRQUFRO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxnQkFBZ0IseURBQXlEO0FBQ3pFLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHlEQUF5RDtBQUM5RSxzQkFBc0IseURBQXlEO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsV0FBVztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRDtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsa0RBQWtEO0FBQ2xELGtEQUFrRDtBQUNsRDtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCLGtFQUFrRSxRQUFRO0FBQzFFLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyw2Q0FBNkM7QUFDN0M7QUFDQSxrREFBa0Q7O0FBRWxELG1FQUFtRTtBQUNuRTtBQUNBOztBQUVBLHlCQUF5Qjs7QUFFekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLG1CQUFtQjtBQUM3RDtBQUNBLHlCQUF5QiwrQkFBK0I7QUFDeEQseUJBQXlCLCtCQUErQjtBQUN4RCx5QkFBeUIsK0JBQStCO0FBQ3hELHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsaUJBQWlCO0FBQ2pCLDRCQUE0QjtBQUM1QixpQkFBaUI7QUFDakIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBLHFCQUFxQixNQUFNLHVCQUF1QixNQUFNO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBLGNBQWMseUJBQXlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGVBQWU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxRQUFRO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsRUFBRTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsWUFBWTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYsUUFBUTtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixLQUFLO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLDREQUE0RCxRQUFRO0FBQ3BFO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLCtFQUErRTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQ0FBaUM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGFBQWE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsSUFBSTtBQUNoRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLEtBQUssa0JBQWtCLEdBQUcsT0FBTyxHQUFHLDhDQUE4QyxNQUFNLG9HQUFvRyxRQUFRO0FBQ2hSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRSxPQUFPO0FBQzNFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxNQUFNO0FBQzNFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRixPQUFPLEVBQUUsUUFBUSx1Q0FBdUMsT0FBTyxFQUFFLFFBQVEsdUNBQXVDLE9BQU8sRUFBRSxRQUFRO0FBQ3ROO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixPQUFPLGtDQUFrQyxPQUFPLGtDQUFrQyxPQUFPO0FBQ3pLO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsT0FBTyxjQUFjLFFBQVEsa0NBQWtDLE9BQU8sY0FBYyxRQUFRLGtDQUFrQyxPQUFPLGNBQWMsUUFBUTtBQUMzTztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxXQUFXO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osUUFBUTtBQUNSO0FBQ0EscUJBQXFCLE1BQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsdURBQXVEO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMscURBQXFEO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQ0FBcUM7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7OztBQ2g5UEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNlLFNBQVNBLE1BQVQsR0FBa0I7QUFDL0Isc0JBQ0UsMkRBQUMsdURBQUQscUJBQ0U7QUFBRyxNQUFFLEVBQUMsTUFBTjtBQUFhLGFBQVMsRUFBQyxXQUF2QjtBQUFtQyxRQUFJLEVBQUM7QUFBeEMsWUFERixlQUVJO0FBQUcsTUFBRSxFQUFDLE9BQU47QUFBYyxhQUFTLEVBQUMsV0FBeEI7QUFBb0MsUUFBSSxFQUFDO0FBQXpDLGFBRkosZUFHSTtBQUFHLE1BQUUsRUFBQyxTQUFOO0FBQWdCLGFBQVMsRUFBQyxXQUExQjtBQUFzQyxRQUFJLEVBQUM7QUFBM0MsZUFISixDQURGO0FBT0Q7QUFFREEsTUFBTSxDQUFDQyxZQUFQLEdBQXNCLEVBQXRCO0FBR0FELE1BQU0sQ0FBQ0UsU0FBUCxHQUFtQjtBQUNmO0FBQ0o7QUFDQTtBQUNJQyxJQUFFLEVBQUVDLGlEQUFTLENBQUNDLE1BSkM7O0FBTWY7QUFDSjtBQUNBO0FBQ0E7QUFDSUMsVUFBUSxFQUFFRixpREFBUyxDQUFDRztBQVZMLENBQW5CLEM7Ozs7Ozs7Ozs7OztBQzFCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMDc3YjA2Yi1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTcgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4vLyDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgXFxcXFxuLy8g4pSCIEV2ZSAwLjUuNCAtIEphdmFTY3JpcHQgRXZlbnRzIExpYnJhcnkgICAgICAgICAgICAgICAgICAgICAg4pSCIFxcXFxcbi8vIOKUnOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUpCBcXFxcXG4vLyDilIIgQXV0aG9yIERtaXRyeSBCYXJhbm92c2tpeSAoaHR0cDovL2RtaXRyeS5iYXJhbm92c2tpeS5jb20vKSDilIIgXFxcXFxuLy8g4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYIFxcXFxcblxuKGZ1bmN0aW9uIChnbG9iKSB7XG4gICAgdmFyIHZlcnNpb24gPSBcIjAuNS40XCIsXG4gICAgICAgIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIixcbiAgICAgICAgc2VwYXJhdG9yID0gL1tcXC5cXC9dLyxcbiAgICAgICAgY29tYXNlcGFyYXRvciA9IC9cXHMqLFxccyovLFxuICAgICAgICB3aWxkY2FyZCA9IFwiKlwiLFxuICAgICAgICBudW1zb3J0ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVudF9ldmVudCxcbiAgICAgICAgc3RvcCxcbiAgICAgICAgZXZlbnRzID0ge246IHt9fSxcbiAgICAgICAgZmlyc3REZWZpbmVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW2ldICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsYXN0RGVmaW5lZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoLS1pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW2ldICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvYmp0b3MgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICBTdHIgPSBTdHJpbmcsXG4gICAgICAgIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcikge1xuICAgICAgICAgICAgcmV0dXJuIGFyIGluc3RhbmNlb2YgQXJyYXkgfHwgb2JqdG9zLmNhbGwoYXIpID09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfSxcbiAgICAvKlxcXG4gICAgICogZXZlXG4gICAgIFsgbWV0aG9kIF1cblxuICAgICAqIEZpcmVzIGV2ZW50IHdpdGggZ2l2ZW4gYG5hbWVgLCBnaXZlbiBzY29wZSBhbmQgb3RoZXIgcGFyYW1ldGVycy5cblxuICAgICAtIG5hbWUgKHN0cmluZykgbmFtZSBvZiB0aGUgKmV2ZW50KiwgZG90IChgLmApIG9yIHNsYXNoIChgL2ApIHNlcGFyYXRlZFxuICAgICAtIHNjb3BlIChvYmplY3QpIGNvbnRleHQgZm9yIHRoZSBldmVudCBoYW5kbGVyc1xuICAgICAtIHZhcmFyZ3MgKC4uLikgdGhlIHJlc3Qgb2YgYXJndW1lbnRzIHdpbGwgYmUgc2VudCB0byBldmVudCBoYW5kbGVyc1xuXG4gICAgID0gKG9iamVjdCkgYXJyYXkgb2YgcmV0dXJuZWQgdmFsdWVzIGZyb20gdGhlIGxpc3RlbmVycy4gQXJyYXkgaGFzIHR3byBtZXRob2RzIGAuZmlyc3REZWZpbmVkKClgIGFuZCBgLmxhc3REZWZpbmVkKClgIHRvIGdldCBmaXJzdCBvciBsYXN0IG5vdCBgdW5kZWZpbmVkYCB2YWx1ZS5cbiAgICBcXCovXG4gICAgICAgIGV2ZSA9IGZ1bmN0aW9uIChuYW1lLCBzY29wZSkge1xuICAgICAgICAgICAgdmFyIG9sZHN0b3AgPSBzdG9wLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVycyA9IGV2ZS5saXN0ZW5lcnMobmFtZSksXG4gICAgICAgICAgICAgICAgeiA9IDAsXG4gICAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgICBpbmRleGVkID0gW10sXG4gICAgICAgICAgICAgICAgcXVldWUgPSB7fSxcbiAgICAgICAgICAgICAgICBvdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBjZSA9IGN1cnJlbnRfZXZlbnQ7XG4gICAgICAgICAgICBvdXQuZmlyc3REZWZpbmVkID0gZmlyc3REZWZpbmVkO1xuICAgICAgICAgICAgb3V0Lmxhc3REZWZpbmVkID0gbGFzdERlZmluZWQ7XG4gICAgICAgICAgICBjdXJyZW50X2V2ZW50ID0gbmFtZTtcbiAgICAgICAgICAgIHN0b3AgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGlpOyBpKyspIGlmIChcInpJbmRleFwiIGluIGxpc3RlbmVyc1tpXSkge1xuICAgICAgICAgICAgICAgIGluZGV4ZWQucHVzaChsaXN0ZW5lcnNbaV0uekluZGV4KTtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldLnpJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWVbbGlzdGVuZXJzW2ldLnpJbmRleF0gPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXhlZC5zb3J0KG51bXNvcnQpO1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4ZWRbel0gPCAwKSB7XG4gICAgICAgICAgICAgICAgbCA9IHF1ZXVlW2luZGV4ZWRbeisrXV07XG4gICAgICAgICAgICAgICAgb3V0LnB1c2gobC5hcHBseShzY29wZSwgYXJncykpO1xuICAgICAgICAgICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3AgPSBvbGRzdG9wO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbCA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoXCJ6SW5kZXhcIiBpbiBsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsLnpJbmRleCA9PSBpbmRleGVkW3pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChsLmFwcGx5KHNjb3BlLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHorKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsID0gcXVldWVbaW5kZXhlZFt6XV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCAmJiBvdXQucHVzaChsLmFwcGx5KHNjb3BlLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAobClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlW2wuekluZGV4XSA9IGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChsLmFwcGx5KHNjb3BlLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0b3AgPSBvbGRzdG9wO1xuICAgICAgICAgICAgY3VycmVudF9ldmVudCA9IGNlO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfTtcbiAgICAvLyBVbmRvY3VtZW50ZWQuIERlYnVnIG9ubHkuXG4gICAgZXZlLl9ldmVudHMgPSBldmVudHM7XG4gICAgLypcXFxuICAgICAqIGV2ZS5saXN0ZW5lcnNcbiAgICAgWyBtZXRob2QgXVxuXG4gICAgICogSW50ZXJuYWwgbWV0aG9kIHdoaWNoIGdpdmVzIHlvdSBhcnJheSBvZiBhbGwgZXZlbnQgaGFuZGxlcnMgdGhhdCB3aWxsIGJlIHRyaWdnZXJlZCBieSB0aGUgZ2l2ZW4gYG5hbWVgLlxuXG4gICAgIC0gbmFtZSAoc3RyaW5nKSBuYW1lIG9mIHRoZSBldmVudCwgZG90IChgLmApIG9yIHNsYXNoIChgL2ApIHNlcGFyYXRlZFxuXG4gICAgID0gKGFycmF5KSBhcnJheSBvZiBldmVudCBoYW5kbGVyc1xuICAgIFxcKi9cbiAgICBldmUubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIG5hbWVzID0gaXNBcnJheShuYW1lKSA/IG5hbWUgOiBuYW1lLnNwbGl0KHNlcGFyYXRvciksXG4gICAgICAgICAgICBlID0gZXZlbnRzLFxuICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgIGl0ZW1zLFxuICAgICAgICAgICAgayxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBpaSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBqaixcbiAgICAgICAgICAgIG5lcyxcbiAgICAgICAgICAgIGVzID0gW2VdLFxuICAgICAgICAgICAgb3V0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gbmFtZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbmVzID0gW107XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBqaiA9IGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBlID0gZXNbal0ubjtcbiAgICAgICAgICAgICAgICBpdGVtcyA9IFtlW25hbWVzW2ldXSwgZVt3aWxkY2FyZF1dO1xuICAgICAgICAgICAgICAgIGsgPSAyO1xuICAgICAgICAgICAgICAgIHdoaWxlIChrLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2tdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmVzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgPSBvdXQuY29uY2F0KGl0ZW0uZiB8fCBbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlcyA9IG5lcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIGV2ZS5zZXBhcmF0b3JcbiAgICAgWyBtZXRob2QgXVxuXG4gICAgICogSWYgZm9yIHNvbWUgcmVhc29ucyB5b3UgZG9u4oCZdCBsaWtlIGRlZmF1bHQgc2VwYXJhdG9ycyAoYC5gIG9yIGAvYCkgeW91IGNhbiBzcGVjaWZ5IHlvdXJzXG4gICAgICogaGVyZS4gQmUgYXdhcmUgdGhhdCBpZiB5b3UgcGFzcyBhIHN0cmluZyBsb25nZXIgdGhhbiBvbmUgY2hhcmFjdGVyIGl0IHdpbGwgYmUgdHJlYXRlZCBhc1xuICAgICAqIGEgbGlzdCBvZiBjaGFyYWN0ZXJzLlxuXG4gICAgIC0gc2VwYXJhdG9yIChzdHJpbmcpIG5ldyBzZXBhcmF0b3IuIEVtcHR5IHN0cmluZyByZXNldHMgdG8gZGVmYXVsdDogYC5gIG9yIGAvYC5cbiAgICBcXCovXG4gICAgZXZlLnNlcGFyYXRvciA9IGZ1bmN0aW9uIChzZXApIHtcbiAgICAgICAgaWYgKHNlcCkge1xuICAgICAgICAgICAgc2VwID0gU3RyKHNlcCkucmVwbGFjZSgvKD89W1xcLlxcXlxcXVxcW1xcLV0pL2csIFwiXFxcXFwiKTtcbiAgICAgICAgICAgIHNlcCA9IFwiW1wiICsgc2VwICsgXCJdXCI7XG4gICAgICAgICAgICBzZXBhcmF0b3IgPSBuZXcgUmVnRXhwKHNlcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXBhcmF0b3IgPSAvW1xcLlxcL10vO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLm9uXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBCaW5kcyBnaXZlbiBldmVudCBoYW5kbGVyIHdpdGggYSBnaXZlbiBuYW1lLiBZb3UgY2FuIHVzZSB3aWxkY2FyZHMg4oCcYCpg4oCdIGZvciB0aGUgbmFtZXM6XG4gICAgIHwgZXZlLm9uKFwiKi51bmRlci4qXCIsIGYpO1xuICAgICB8IGV2ZShcIm1vdXNlLnVuZGVyLmZsb29yXCIpOyAvLyB0cmlnZ2VycyBmXG4gICAgICogVXNlIEBldmUgdG8gdHJpZ2dlciB0aGUgbGlzdGVuZXIuXG4gICAgICoqXG4gICAgIC0gbmFtZSAoc3RyaW5nKSBuYW1lIG9mIHRoZSBldmVudCwgZG90IChgLmApIG9yIHNsYXNoIChgL2ApIHNlcGFyYXRlZCwgd2l0aCBvcHRpb25hbCB3aWxkY2FyZHNcbiAgICAgLSBmIChmdW5jdGlvbikgZXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICAgICAqKlxuICAgICAtIG5hbWUgKGFycmF5KSBpZiB5b3UgZG9u4oCZdCB3YW50IHRvIHVzZSBzZXBhcmF0b3JzLCB5b3UgY2FuIHVzZSBhcnJheSBvZiBzdHJpbmdzXG4gICAgIC0gZiAoZnVuY3Rpb24pIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKipcbiAgICAgPSAoZnVuY3Rpb24pIHJldHVybmVkIGZ1bmN0aW9uIGFjY2VwdHMgYSBzaW5nbGUgbnVtZXJpYyBwYXJhbWV0ZXIgdGhhdCByZXByZXNlbnRzIHotaW5kZXggb2YgdGhlIGhhbmRsZXIuIEl0IGlzIGFuIG9wdGlvbmFsIGZlYXR1cmUgYW5kIG9ubHkgdXNlZCB3aGVuIHlvdSBuZWVkIHRvIGVuc3VyZSB0aGF0IHNvbWUgc3Vic2V0IG9mIGhhbmRsZXJzIHdpbGwgYmUgaW52b2tlZCBpbiBhIGdpdmVuIG9yZGVyLCBkZXNwaXRlIG9mIHRoZSBvcmRlciBvZiBhc3NpZ25tZW50LlxuICAgICA+IEV4YW1wbGU6XG4gICAgIHwgZXZlLm9uKFwibW91c2VcIiwgZWF0SXQpKDIpO1xuICAgICB8IGV2ZS5vbihcIm1vdXNlXCIsIHNjcmVhbSk7XG4gICAgIHwgZXZlLm9uKFwibW91c2VcIiwgY2F0Y2hJdCkoMSk7XG4gICAgICogVGhpcyB3aWxsIGVuc3VyZSB0aGF0IGBjYXRjaEl0YCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgYGVhdEl0YC5cbiAgICAgKlxuICAgICAqIElmIHlvdSB3YW50IHRvIHB1dCB5b3VyIGhhbmRsZXIgYmVmb3JlIG5vbi1pbmRleGVkIGhhbmRsZXJzLCBzcGVjaWZ5IGEgbmVnYXRpdmUgdmFsdWUuXG4gICAgICogTm90ZTogSSBhc3N1bWUgbW9zdCBvZiB0aGUgdGltZSB5b3UgZG9u4oCZdCBuZWVkIHRvIHdvcnJ5IGFib3V0IHotaW5kZXgsIGJ1dCBpdOKAmXMgbmljZSB0byBoYXZlIHRoaXMgZmVhdHVyZSDigJxqdXN0IGluIGNhc2XigJ0uXG4gICAgXFwqL1xuICAgIGV2ZS5vbiA9IGZ1bmN0aW9uIChuYW1lLCBmKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZiAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZXMgPSBpc0FycmF5KG5hbWUpID8gaXNBcnJheShuYW1lWzBdKSA/IG5hbWUgOiBbbmFtZV0gOiBTdHIobmFtZSkuc3BsaXQoY29tYXNlcGFyYXRvcik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lcyA9IGlzQXJyYXkobmFtZSkgPyBuYW1lIDogU3RyKG5hbWUpLnNwbGl0KHNlcGFyYXRvciksXG4gICAgICAgICAgICAgICAgICAgIGUgPSBldmVudHMsXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGUubjtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGUuaGFzT3duUHJvcGVydHkobmFtZXNbaV0pICYmIGVbbmFtZXNbaV1dIHx8IChlW25hbWVzW2ldXSA9IHtuOiB7fX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLmYgPSBlLmYgfHwgW107XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgaWkgPSBlLmYubGVuZ3RoOyBpIDwgaWk7IGkrKykgaWYgKGUuZltpXSA9PSBmKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICFleGlzdCAmJiBlLmYucHVzaChmKTtcbiAgICAgICAgICAgIH0obmFtZXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHpJbmRleCkge1xuICAgICAgICAgICAgaWYgKCt6SW5kZXggPT0gK3pJbmRleCkge1xuICAgICAgICAgICAgICAgIGYuekluZGV4ID0gK3pJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUuZlxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBmdW5jdGlvbiB0aGF0IHdpbGwgZmlyZSBnaXZlbiBldmVudCB3aXRoIG9wdGlvbmFsIGFyZ3VtZW50cy5cbiAgICAgKiBBcmd1bWVudHMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgcmVzdWx0IGZ1bmN0aW9uIHdpbGwgYmUgYWxzb1xuICAgICAqIGNvbmNhdGVkIHRvIHRoZSBsaXN0IG9mIGZpbmFsIGFyZ3VtZW50cy5cbiAgICAgfCBlbC5vbmNsaWNrID0gZXZlLmYoXCJjbGlja1wiLCAxLCAyKTtcbiAgICAgfCBldmUub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICB8ICAgICBjb25zb2xlLmxvZyhhLCBiLCBjKTsgLy8gMSwgMiwgW2V2ZW50IG9iamVjdF1cbiAgICAgfCB9KTtcbiAgICAgLSBldmVudCAoc3RyaW5nKSBldmVudCBuYW1lXG4gICAgIC0gdmFyYXJncyAo4oCmKSBhbmQgYW55IG90aGVyIGFyZ3VtZW50c1xuICAgICA9IChmdW5jdGlvbikgcG9zc2libGUgZXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICAgIFxcKi9cbiAgICBldmUuZiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgYXR0cnMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBldmUuYXBwbHkobnVsbCwgW2V2ZW50LCBudWxsXS5jb25jYXQoYXR0cnMpLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUuc3RvcFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogSXMgdXNlZCBpbnNpZGUgYW4gZXZlbnQgaGFuZGxlciB0byBzdG9wIHRoZSBldmVudCwgcHJldmVudGluZyBhbnkgc3Vic2VxdWVudCBsaXN0ZW5lcnMgZnJvbSBmaXJpbmcuXG4gICAgXFwqL1xuICAgIGV2ZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzdG9wID0gMTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUubnRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENvdWxkIGJlIHVzZWQgaW5zaWRlIGV2ZW50IGhhbmRsZXIgdG8gZmlndXJlIG91dCBhY3R1YWwgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAgICoqXG4gICAgIC0gc3VibmFtZSAoc3RyaW5nKSAjb3B0aW9uYWwgc3VibmFtZSBvZiB0aGUgZXZlbnRcbiAgICAgKipcbiAgICAgPSAoc3RyaW5nKSBuYW1lIG9mIHRoZSBldmVudCwgaWYgYHN1Ym5hbWVgIGlzIG5vdCBzcGVjaWZpZWRcbiAgICAgKiBvclxuICAgICA9IChib29sZWFuKSBgdHJ1ZWAsIGlmIGN1cnJlbnQgZXZlbnTigJlzIG5hbWUgY29udGFpbnMgYHN1Ym5hbWVgXG4gICAgXFwqL1xuICAgIGV2ZS5udCA9IGZ1bmN0aW9uIChzdWJuYW1lKSB7XG4gICAgICAgIHZhciBjdXIgPSBpc0FycmF5KGN1cnJlbnRfZXZlbnQpID8gY3VycmVudF9ldmVudC5qb2luKFwiLlwiKSA6IGN1cnJlbnRfZXZlbnQ7XG4gICAgICAgIGlmIChzdWJuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIig/OlxcXFwufFxcXFwvfF4pXCIgKyBzdWJuYW1lICsgXCIoPzpcXFxcLnxcXFxcL3wkKVwiKS50ZXN0KGN1cik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cjtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUubnRzXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDb3VsZCBiZSB1c2VkIGluc2lkZSBldmVudCBoYW5kbGVyIHRvIGZpZ3VyZSBvdXQgYWN0dWFsIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgICAqKlxuICAgICAqKlxuICAgICA9IChhcnJheSkgbmFtZXMgb2YgdGhlIGV2ZW50XG4gICAgXFwqL1xuICAgIGV2ZS5udHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KGN1cnJlbnRfZXZlbnQpID8gY3VycmVudF9ldmVudCA6IGN1cnJlbnRfZXZlbnQuc3BsaXQoc2VwYXJhdG9yKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUub2ZmXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGdpdmVuIGZ1bmN0aW9uIGZyb20gdGhlIGxpc3Qgb2YgZXZlbnQgbGlzdGVuZXJzIGFzc2lnbmVkIHRvIGdpdmVuIG5hbWUuXG4gICAgICogSWYgbm8gYXJndW1lbnRzIHNwZWNpZmllZCBhbGwgdGhlIGV2ZW50cyB3aWxsIGJlIGNsZWFyZWQuXG4gICAgICoqXG4gICAgIC0gbmFtZSAoc3RyaW5nKSBuYW1lIG9mIHRoZSBldmVudCwgZG90IChgLmApIG9yIHNsYXNoIChgL2ApIHNlcGFyYXRlZCwgd2l0aCBvcHRpb25hbCB3aWxkY2FyZHNcbiAgICAgLSBmIChmdW5jdGlvbikgZXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogZXZlLnVuYmluZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2VlIEBldmUub2ZmXG4gICAgXFwqL1xuICAgIGV2ZS5vZmYgPSBldmUudW5iaW5kID0gZnVuY3Rpb24gKG5hbWUsIGYpIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBldmUuX2V2ZW50cyA9IGV2ZW50cyA9IHtuOiB7fX07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hbWVzID0gaXNBcnJheShuYW1lKSA/IGlzQXJyYXkobmFtZVswXSkgPyBuYW1lIDogW25hbWVdIDogU3RyKG5hbWUpLnNwbGl0KGNvbWFzZXBhcmF0b3IpO1xuICAgICAgICBpZiAobmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gbmFtZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGV2ZS5vZmYobmFtZXNbaV0sIGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5hbWVzID0gaXNBcnJheShuYW1lKSA/IG5hbWUgOiBTdHIobmFtZSkuc3BsaXQoc2VwYXJhdG9yKTtcbiAgICAgICAgdmFyIGUsXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBzcGxpY2UsXG4gICAgICAgICAgICBpLCBpaSwgaiwgamosXG4gICAgICAgICAgICBjdXIgPSBbZXZlbnRzXSxcbiAgICAgICAgICAgIGlub2RlcyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjdXIubGVuZ3RoOyBqICs9IHNwbGljZS5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgc3BsaWNlID0gW2osIDFdO1xuICAgICAgICAgICAgICAgIGUgPSBjdXJbal0ubjtcbiAgICAgICAgICAgICAgICBpZiAobmFtZXNbaV0gIT0gd2lsZGNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVbbmFtZXNbaV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGxpY2UucHVzaChlW25hbWVzW2ldXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbm9kZXMudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbjogZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lc1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBlKSBpZiAoZVtoYXNdKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwbGljZS5wdXNoKGVba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbm9kZXMudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbjogZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1ci5zcGxpY2UuYXBwbHkoY3VyLCBzcGxpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gY3VyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGUgPSBjdXJbaV07XG4gICAgICAgICAgICB3aGlsZSAoZS5uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBlLmYubGVuZ3RoOyBqIDwgamo7IGorKykgaWYgKGUuZltqXSA9PSBmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5mLnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICFlLmYubGVuZ3RoICYmIGRlbGV0ZSBlLmY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gZS5uKSBpZiAoZS5uW2hhc10oa2V5KSAmJiBlLm5ba2V5XS5mKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3MgPSBlLm5ba2V5XS5mO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBmdW5jcy5sZW5ndGg7IGogPCBqajsgaisrKSBpZiAoZnVuY3Nbal0gPT0gZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNzLnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICFmdW5jcy5sZW5ndGggJiYgZGVsZXRlIGUubltrZXldLmY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5mO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBlLm4pIGlmIChlLm5baGFzXShrZXkpICYmIGUubltrZXldLmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlLm5ba2V5XS5mO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGUgPSBlLm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJ1bmUgaW5uZXIgbm9kZXMgaW4gcGF0aFxuICAgICAgICBwcnVuZTogZm9yIChpID0gMCwgaWkgPSBpbm9kZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgZSA9IGlub2Rlc1tpXTtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGUubltlLm5hbWVdLmYpIHtcbiAgICAgICAgICAgICAgICAvLyBub3QgZW1wdHkgKGhhcyBsaXN0ZW5lcnMpXG4gICAgICAgICAgICAgICAgY29udGludWUgcHJ1bmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBlLm5bZS5uYW1lXS5uKSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IGVtcHR5IChoYXMgY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgY29udGludWUgcHJ1bmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpcyBlbXB0eVxuICAgICAgICAgICAgZGVsZXRlIGUubltlLm5hbWVdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLm9uY2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEJpbmRzIGdpdmVuIGV2ZW50IGhhbmRsZXIgd2l0aCBhIGdpdmVuIG5hbWUgdG8gb25seSBydW4gb25jZSB0aGVuIHVuYmluZCBpdHNlbGYuXG4gICAgIHwgZXZlLm9uY2UoXCJsb2dpblwiLCBmKTtcbiAgICAgfCBldmUoXCJsb2dpblwiKTsgLy8gdHJpZ2dlcnMgZlxuICAgICB8IGV2ZShcImxvZ2luXCIpOyAvLyBubyBsaXN0ZW5lcnNcbiAgICAgKiBVc2UgQGV2ZSB0byB0cmlnZ2VyIHRoZSBsaXN0ZW5lci5cbiAgICAgKipcbiAgICAgLSBuYW1lIChzdHJpbmcpIG5hbWUgb2YgdGhlIGV2ZW50LCBkb3QgKGAuYCkgb3Igc2xhc2ggKGAvYCkgc2VwYXJhdGVkLCB3aXRoIG9wdGlvbmFsIHdpbGRjYXJkc1xuICAgICAtIGYgKGZ1bmN0aW9uKSBldmVudCBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICoqXG4gICAgID0gKGZ1bmN0aW9uKSBzYW1lIHJldHVybiBmdW5jdGlvbiBhcyBAZXZlLm9uXG4gICAgXFwqL1xuICAgIGV2ZS5vbmNlID0gZnVuY3Rpb24gKG5hbWUsIGYpIHtcbiAgICAgICAgdmFyIGYyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXZlLm9mZihuYW1lLCBmMik7XG4gICAgICAgICAgICByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZXZlLm9uKG5hbWUsIGYyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUudmVyc2lvblxuICAgICBbIHByb3BlcnR5IChzdHJpbmcpIF1cbiAgICAgKipcbiAgICAgKiBDdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnkuXG4gICAgXFwqL1xuICAgIGV2ZS52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICBldmUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIllvdSBhcmUgcnVubmluZyBFdmUgXCIgKyB2ZXJzaW9uO1xuICAgIH07XG4gICAgZ2xvYi5ldmUgPSBldmU7XG4gICAgdHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBldmUgOiB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShcImV2ZVwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gZXZlOyB9KSA6IGdsb2IuZXZlID0gZXZlO1xufSkodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdGhpcyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0ge1xuICBzbGlkZTogcmVxdWlyZSgnLi9tZW51cy9zbGlkZScpLFxuICBzdGFjazogcmVxdWlyZSgnLi9tZW51cy9zdGFjaycpLFxuICBlbGFzdGljOiByZXF1aXJlKCcuL21lbnVzL2VsYXN0aWMnKSxcbiAgYnViYmxlOiByZXF1aXJlKCcuL21lbnVzL2J1YmJsZScpLFxuICBwdXNoOiByZXF1aXJlKCcuL21lbnVzL3B1c2gnKSxcbiAgcHVzaFJvdGF0ZTogcmVxdWlyZSgnLi9tZW51cy9wdXNoUm90YXRlJyksXG4gIHNjYWxlRG93bjogcmVxdWlyZSgnLi9tZW51cy9zY2FsZURvd24nKSxcbiAgc2NhbGVSb3RhdGU6IHJlcXVpcmUoJy4vbWVudXMvc2NhbGVSb3RhdGUnKSxcbiAgZmFsbERvd246IHJlcXVpcmUoJy4vbWVudXMvZmFsbERvd24nKSxcbiAgcmV2ZWFsOiByZXF1aXJlKCcuL21lbnVzL3JldmVhbCcpXG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7IHZhciBfYWdhaW4gPSB0cnVlOyBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHsgdmFyIG9iamVjdCA9IF94LCBwcm9wZXJ0eSA9IF94MiwgcmVjZWl2ZXIgPSBfeDM7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3ggPSBwYXJlbnQ7IF94MiA9IHByb3BlcnR5OyBfeDMgPSByZWNlaXZlcjsgX2FnYWluID0gdHJ1ZTsgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDsgY29udGludWUgX2Z1bmN0aW9uOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG52YXIgQnVyZ2VySWNvbiA9IChmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoQnVyZ2VySWNvbiwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gQnVyZ2VySWNvbihwcm9wcykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCdXJnZXJJY29uKTtcblxuICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEJ1cmdlckljb24ucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGhvdmVyOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQnVyZ2VySWNvbiwgW3tcbiAgICBrZXk6ICdnZXRMaW5lU3R5bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRMaW5lU3R5bGUoaW5kZXgpIHtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICBoZWlnaHQ6ICcyMCUnLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgdG9wOiAyMCAqIChpbmRleCAqIDIpICsgJyUnLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLnN0YXRlLmhvdmVyID8gMC42IDogMVxuICAgICAgfSwgdGhpcy5zdGF0ZS5ob3ZlciAmJiB0aGlzLnByb3BzLnN0eWxlcy5ibUJ1cmdlckJhcnNIb3Zlcik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGljb24gPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgYnV0dG9uU3R5bGUgPSB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgIGZvbnRTaXplOiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMucHJvcHMuY3VzdG9tSWNvbikge1xuICAgICAgICB2YXIgZXh0cmFQcm9wcyA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6ICgnYm0taWNvbiAnICsgKHRoaXMucHJvcHMuY3VzdG9tSWNvbi5wcm9wcy5jbGFzc05hbWUgfHwgJycpKS50cmltKCksXG4gICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHsgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfSwgdGhpcy5wcm9wcy5zdHlsZXMuYm1JY29uKVxuICAgICAgICB9O1xuICAgICAgICBpY29uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNsb25lRWxlbWVudCh0aGlzLnByb3BzLmN1c3RvbUljb24sIGV4dHJhUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWNvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIFswLCAxLCAyXS5tYXAoZnVuY3Rpb24gKGJhcikge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICBrZXk6IGJhcixcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWJ1cmdlci1iYXJzICcgKyBfdGhpcy5wcm9wcy5iYXJDbGFzc05hbWUgKyAnICcgKyAoX3RoaXMuc3RhdGUuaG92ZXIgPyAnYm0tYnVyZ2VyLWJhcnMtaG92ZXInIDogJycpKS50cmltKCksXG4gICAgICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7fSwgX3RoaXMuZ2V0TGluZVN0eWxlKGJhciksIF90aGlzLnByb3BzLnN0eWxlcy5ibUJ1cmdlckJhcnMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWJ1cmdlci1idXR0b24gJyArIHRoaXMucHJvcHMuY2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHsgekluZGV4OiAxMDAwIH0sIHRoaXMucHJvcHMuc3R5bGVzLmJtQnVyZ2VyQnV0dG9uKVxuICAgICAgICB9LFxuICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3JlYWN0LWJ1cmdlci1tZW51LWJ0bicsXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLm9uQ2xpY2ssXG4gICAgICAgICAgICBvbk1vdXNlT3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh7IGhvdmVyOiB0cnVlIH0pO1xuICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvcHMub25JY29uSG92ZXJDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcm9wcy5vbkljb25Ib3ZlckNoYW5nZSh7IGlzTW91c2VJbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uTW91c2VPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBob3ZlcjogZmFsc2UgfSk7XG4gICAgICAgICAgICAgIGlmIChfdGhpcy5wcm9wcy5vbkljb25Ib3ZlckNoYW5nZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnByb3BzLm9uSWNvbkhvdmVyQ2hhbmdlKHsgaXNNb3VzZUluOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0eWxlOiBidXR0b25TdHlsZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ09wZW4gTWVudSdcbiAgICAgICAgKSxcbiAgICAgICAgaWNvblxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQnVyZ2VySWNvbjtcbn0pKF9yZWFjdC5Db21wb25lbnQpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBCdXJnZXJJY29uO1xuXG5CdXJnZXJJY29uLnByb3BUeXBlcyA9IHtcbiAgYmFyQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgY3VzdG9tSWNvbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5lbGVtZW50LFxuICBzdHlsZXM6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub2JqZWN0XG59O1xuXG5CdXJnZXJJY29uLmRlZmF1bHRQcm9wcyA9IHtcbiAgYmFyQ2xhc3NOYW1lOiAnJyxcbiAgY2xhc3NOYW1lOiAnJyxcbiAgc3R5bGVzOiB7fVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94MykgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeCwgcHJvcGVydHkgPSBfeDIsIHJlY2VpdmVyID0gX3gzOyBfYWdhaW4gPSBmYWxzZTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IF94ID0gcGFyZW50OyBfeDIgPSBwcm9wZXJ0eTsgX3gzID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxudmFyIENyb3NzSWNvbiA9IChmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoQ3Jvc3NJY29uLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBDcm9zc0ljb24oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENyb3NzSWNvbik7XG5cbiAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihDcm9zc0ljb24ucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDcm9zc0ljb24sIFt7XG4gICAga2V5OiAnZ2V0Q3Jvc3NTdHlsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldENyb3NzU3R5bGUodHlwZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgIHdpZHRoOiAzLFxuICAgICAgICBoZWlnaHQ6IDE0LFxuICAgICAgICB0cmFuc2Zvcm06IHR5cGUgPT09ICdiZWZvcmUnID8gJ3JvdGF0ZSg0NWRlZyknIDogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW5kZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgaWNvbjtcbiAgICAgIHZhciBidXR0b25XcmFwcGVyU3R5bGUgPSB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB3aWR0aDogMjQsXG4gICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICB0b3A6IDhcbiAgICAgIH07XG4gICAgICB2YXIgYnV0dG9uU3R5bGUgPSB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgIGZvbnRTaXplOiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMucHJvcHMuY3VzdG9tSWNvbikge1xuICAgICAgICB2YXIgZXh0cmFQcm9wcyA9IHtcbiAgICAgICAgICBjbGFzc05hbWU6ICgnYm0tY3Jvc3MgJyArICh0aGlzLnByb3BzLmN1c3RvbUljb24ucHJvcHMuY2xhc3NOYW1lIHx8ICcnKSkudHJpbSgpLFxuICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH0sIHRoaXMucHJvcHMuc3R5bGVzLmJtQ3Jvc3MpXG4gICAgICAgIH07XG4gICAgICAgIGljb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY2xvbmVFbGVtZW50KHRoaXMucHJvcHMuY3VzdG9tSWNvbiwgZXh0cmFQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpY29uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgIHsgc3R5bGU6IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzZweCcsIHJpZ2h0OiAnMTRweCcgfSB9LFxuICAgICAgICAgIFsnYmVmb3JlJywgJ2FmdGVyJ10ubWFwKGZ1bmN0aW9uICh0eXBlLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWNyb3NzICcgKyBfdGhpcy5wcm9wcy5jcm9zc0NsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIF90aGlzLmdldENyb3NzU3R5bGUodHlwZSksIF90aGlzLnByb3BzLnN0eWxlcy5ibUNyb3NzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1jcm9zcy1idXR0b24gJyArIHRoaXMucHJvcHMuY2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBidXR0b25XcmFwcGVyU3R5bGUsIHRoaXMucHJvcHMuc3R5bGVzLmJtQ3Jvc3NCdXR0b24pXG4gICAgICAgIH0sXG4gICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAncmVhY3QtYnVyZ2VyLWNyb3NzLWJ0bicsXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLm9uQ2xpY2ssXG4gICAgICAgICAgICBzdHlsZTogYnV0dG9uU3R5bGUsXG4gICAgICAgICAgICB0YWJJbmRleDogdGhpcy5wcm9wcy5pc09wZW4gPyAwIDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgICdDbG9zZSBNZW51J1xuICAgICAgICApLFxuICAgICAgICBpY29uXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDcm9zc0ljb247XG59KShfcmVhY3QuQ29tcG9uZW50KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQ3Jvc3NJY29uO1xuXG5Dcm9zc0ljb24ucHJvcFR5cGVzID0ge1xuICBjcm9zc0NsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gIGN1c3RvbUljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZWxlbWVudCxcbiAgaXNPcGVuOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gIHN0eWxlczogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vYmplY3Rcbn07XG5cbkNyb3NzSWNvbi5kZWZhdWx0UHJvcHMgPSB7XG4gIGNyb3NzQ2xhc3NOYW1lOiAnJyxcbiAgY2xhc3NOYW1lOiAnJyxcbiAgc3R5bGVzOiB7fSxcbiAgaXNPcGVuOiBmYWxzZVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgc3R5bGVzID0ge1xuICBvdmVybGF5OiBmdW5jdGlvbiBvdmVybGF5KGlzT3Blbikge1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIHpJbmRleDogMTAwMCxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDAuMyknLFxuICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDAsXG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ29wYWNpdHkgMC4zcycgOiAnb3BhY2l0eSAwLjNzLCB0cmFuc2Zvcm0gMHMgMC4zcydcbiAgICB9O1xuICB9LFxuXG4gIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIHJpZ2h0OiByaWdodCA/IDAgOiAnaW5oZXJpdCcsXG4gICAgICB6SW5kZXg6IDExMDAsXG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICB9O1xuICB9LFxuXG4gIG1lbnU6IGZ1bmN0aW9uIG1lbnUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgICBvdmVyZmxvdzogJ2F1dG8nXG4gICAgfTtcbiAgfSxcblxuICBpdGVtTGlzdDogZnVuY3Rpb24gaXRlbUxpc3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzEwMCUnXG4gICAgfTtcbiAgfSxcblxuICBpdGVtOiBmdW5jdGlvbiBpdGVtKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkaXNwbGF5OiAnYmxvY2snXG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gc3R5bGVzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZm9jdXNPbkZpcnN0TWVudUl0ZW0gPSBmb2N1c09uRmlyc3RNZW51SXRlbTtcbmV4cG9ydHMuZm9jdXNPbkxhc3RNZW51SXRlbSA9IGZvY3VzT25MYXN0TWVudUl0ZW07XG5leHBvcnRzLmZvY3VzT25Dcm9zc0J1dHRvbiA9IGZvY3VzT25Dcm9zc0J1dHRvbjtcbmV4cG9ydHMuZm9jdXNPbk1lbnVCdXR0b24gPSBmb2N1c09uTWVudUJ1dHRvbjtcbmV4cG9ydHMuZm9jdXNPbk1lbnVJdGVtID0gZm9jdXNPbk1lbnVJdGVtO1xuZXhwb3J0cy5mb2N1c09uTmV4dE1lbnVJdGVtID0gZm9jdXNPbk5leHRNZW51SXRlbTtcbmV4cG9ydHMuZm9jdXNPblByZXZpb3VzTWVudUl0ZW0gPSBmb2N1c09uUHJldmlvdXNNZW51SXRlbTtcblxuZnVuY3Rpb24gZm9jdXNPbkZpcnN0TWVudUl0ZW0oKSB7XG4gIHZhciBmaXJzdEl0ZW0gPSBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JtLWl0ZW0nKSkuc2hpZnQoKTtcbiAgaWYgKGZpcnN0SXRlbSkge1xuICAgIGZpcnN0SXRlbS5mb2N1cygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvY3VzT25MYXN0TWVudUl0ZW0oKSB7XG4gIHZhciBsYXN0SXRlbSA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm0taXRlbScpKS5wb3AoKTtcbiAgaWYgKGxhc3RJdGVtKSB7XG4gICAgbGFzdEl0ZW0uZm9jdXMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2N1c09uQ3Jvc3NCdXR0b24oKSB7XG4gIHZhciBjcm9zc0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1idXJnZXItY3Jvc3MtYnRuJyk7XG4gIGlmIChjcm9zc0J1dHRvbikge1xuICAgIGNyb3NzQnV0dG9uLmZvY3VzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9jdXNPbk1lbnVCdXR0b24oKSB7XG4gIHZhciBtZW51QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWJ1cmdlci1tZW51LWJ0bicpO1xuICBpZiAobWVudUJ1dHRvbikge1xuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2N1c09uTWVudUl0ZW0oc2libGluZ1R5cGUpIHtcbiAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xhc3NOYW1lLmluY2x1ZGVzKCdibS1pdGVtJykpIHtcbiAgICB2YXIgc2libGluZyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRbc2libGluZ1R5cGVdO1xuICAgIGlmIChzaWJsaW5nKSB7XG4gICAgICBzaWJsaW5nLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvY3VzT25Dcm9zc0J1dHRvbigpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc2libGluZ1R5cGUgPT09ICdwcmV2aW91c0VsZW1lbnRTaWJsaW5nJykge1xuICAgICAgZm9jdXNPbkxhc3RNZW51SXRlbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c09uRmlyc3RNZW51SXRlbSgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmb2N1c09uTmV4dE1lbnVJdGVtKCkge1xuICBmb2N1c09uTWVudUl0ZW0oJ25leHRFbGVtZW50U2libGluZycpO1xufVxuXG5mdW5jdGlvbiBmb2N1c09uUHJldmlvdXNNZW51SXRlbSgpIHtcbiAgZm9jdXNPbk1lbnVJdGVtKCdwcmV2aW91c0VsZW1lbnRTaWJsaW5nJyk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKCkge1xuICB2YXIgU25hcCA9IHVuZGVmaW5lZDtcbiAgdHJ5IHtcbiAgICBTbmFwID0gcmVxdWlyZSgnc25hcHN2Zy1janMnKTtcbiAgfSBmaW5hbGx5IHtcbiAgICByZXR1cm4gU25hcDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgcHhUb051bSA9IGZ1bmN0aW9uIHB4VG9OdW0odmFsKSB7XG4gIHJldHVybiBwYXJzZUludCh2YWwuc2xpY2UoMCwgLTIpLCAxMCk7XG59O1xuZXhwb3J0cy5weFRvTnVtID0gcHhUb051bTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG52YXIgX2hlbHBlcnNCYXNlU3R5bGVzID0gcmVxdWlyZSgnLi9oZWxwZXJzL2Jhc2VTdHlsZXMnKTtcblxudmFyIF9oZWxwZXJzQmFzZVN0eWxlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQmFzZVN0eWxlcyk7XG5cbnZhciBfaGVscGVyc0RvbSA9IHJlcXVpcmUoJy4vaGVscGVycy9kb20nKTtcblxudmFyIF9jb21wb25lbnRzQnVyZ2VySWNvbiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9CdXJnZXJJY29uJyk7XG5cbnZhciBfY29tcG9uZW50c0J1cmdlckljb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9uZW50c0J1cmdlckljb24pO1xuXG52YXIgX2NvbXBvbmVudHNDcm9zc0ljb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ3Jvc3NJY29uJyk7XG5cbnZhciBfY29tcG9uZW50c0Nyb3NzSWNvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnRzQ3Jvc3NJY29uKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKHN0eWxlcykge1xuICBpZiAoIXN0eWxlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gc3R5bGVzIHN1cHBsaWVkJyk7XG4gIH1cblxuICB2YXIgQVJST1dfRE9XTiA9ICdBcnJvd0Rvd24nO1xuICB2YXIgQVJST1dfVVAgPSAnQXJyb3dVcCc7XG4gIHZhciBFU0NBUEUgPSAnRXNjYXBlJztcbiAgdmFyIFNQQUNFID0gJyAnO1xuICB2YXIgSE9NRSA9ICdIb21lJztcbiAgdmFyIEVORCA9ICdFbmQnO1xuXG4gIGZ1bmN0aW9uIHVzZVByZXZpb3VzKHZhbHVlKSB7XG4gICAgdmFyIHJlZiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VSZWYodmFsdWUpO1xuICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmVmLmN1cnJlbnQgPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVmLmN1cnJlbnQ7XG4gIH1cblxuICB2YXIgTWVudSA9IGZ1bmN0aW9uIE1lbnUocHJvcHMpIHtcbiAgICB2YXIgX1JlYWN0JHVzZVN0YXRlID0gX3JlYWN0MlsnZGVmYXVsdCddLnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIHZhciBfUmVhY3QkdXNlU3RhdGUyID0gX3NsaWNlZFRvQXJyYXkoX1JlYWN0JHVzZVN0YXRlLCAyKTtcblxuICAgIHZhciBpc09wZW4gPSBfUmVhY3QkdXNlU3RhdGUyWzBdO1xuICAgIHZhciBzZXRJc09wZW4gPSBfUmVhY3QkdXNlU3RhdGUyWzFdO1xuXG4gICAgdmFyIHRpbWVvdXRJZCA9IF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VSZWYoKTtcbiAgICB2YXIgdG9nZ2xlT3B0aW9ucyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VSZWYoe30pO1xuICAgIHZhciBwcmV2SXNPcGVuUHJvcCA9IHVzZVByZXZpb3VzKHByb3BzLmlzT3Blbik7XG5cbiAgICBfcmVhY3QyWydkZWZhdWx0J10udXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChwcm9wcy5pc09wZW4pIHtcbiAgICAgICAgdG9nZ2xlTWVudSh7IGlzT3BlbjogdHJ1ZSwgbm9TdGF0ZUNoYW5nZTogdHJ1ZSB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGFwcGx5V3JhcHBlclN0eWxlcyhmYWxzZSk7XG4gICAgICAgIGNsZWFyQ3VycmVudFRpbWVvdXQoKTtcbiAgICAgIH07XG4gICAgfSwgW10pO1xuXG4gICAgX3JlYWN0MlsnZGVmYXVsdCddLnVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgd2FzVG9nZ2xlZCA9IHR5cGVvZiBwcm9wcy5pc09wZW4gIT09ICd1bmRlZmluZWQnICYmIHByb3BzLmlzT3BlbiAhPT0gaXNPcGVuICYmIHByb3BzLmlzT3BlbiAhPT0gcHJldklzT3BlblByb3A7XG5cbiAgICAgIGlmICh3YXNUb2dnbGVkKSB7XG4gICAgICAgIHRvZ2dsZU1lbnUoKTtcbiAgICAgICAgLy8gVG9nZ2xpbmcgY2hhbmdlcyBTVkcgYW5pbWF0aW9uIHJlcXVpcmVtZW50cywgc28gZGVmZXIgdGhlc2UgdW50aWwgbmV4dCB1cGRhdGVcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3R5bGVzLnN2Zykge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBtb3JwaFNoYXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JtLW1vcnBoLXNoYXBlJyk7XG4gICAgICAgICAgdmFyIHBhdGggPSBzdHlsZXMuc3ZnLmxpYihtb3JwaFNoYXBlKS5zZWxlY3QoJ3BhdGgnKTtcblxuICAgICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgIC8vIEFuaW1hdGUgU1ZHIHBhdGhcbiAgICAgICAgICAgIHN0eWxlcy5zdmcuYW5pbWF0ZShwYXRoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVzZXQgcGF0aCAodGltZW91dCBlbnN1cmVzIGFuaW1hdGlvbiBoYXBwZW5zIG9mZiBzY3JlZW4pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcGF0aC5hdHRyKCdkJywgc3R5bGVzLnN2Zy5wYXRoSW5pdGlhbCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90b2dnbGVPcHRpb25zJGN1cnJlbnQgPSB0b2dnbGVPcHRpb25zLmN1cnJlbnQ7XG4gICAgICB2YXIgbm9TdGF0ZUNoYW5nZSA9IF90b2dnbGVPcHRpb25zJGN1cnJlbnQubm9TdGF0ZUNoYW5nZTtcbiAgICAgIHZhciBmb2N1c09uTGFzdEl0ZW0gPSBfdG9nZ2xlT3B0aW9ucyRjdXJyZW50LmZvY3VzT25MYXN0SXRlbTtcblxuICAgICAgaWYgKCFub1N0YXRlQ2hhbmdlKSB7XG4gICAgICAgIHByb3BzLm9uU3RhdGVDaGFuZ2UoeyBpc09wZW46IGlzT3BlbiB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwcm9wcy5kaXNhYmxlQXV0b0ZvY3VzKSB7XG4gICAgICAgIC8vIEZvciBhY2Nlc3NpYmlsaXR5IHJlYXNvbnMsIGVuc3VyZXMgdGhhdCB3aGVuIHdlIHRvZ2dsZSBvcGVuLFxuICAgICAgICAvLyB3ZSBmb2N1cyB0aGUgZmlyc3Qgb3IgbGFzdCBtZW51IGl0ZW0gYWNjb3JkaW5nIHRvIGdpdmVuIHBhcmFtZXRlclxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgZm9jdXNPbkxhc3RJdGVtID8gKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25MYXN0TWVudUl0ZW0pKCkgOiAoMCwgX2hlbHBlcnNEb20uZm9jdXNPbkZpcnN0TWVudUl0ZW0pKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmJsdXIoKTsgLy8gTmVlZGVkIGZvciBJRVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaW1lb3V0IGVuc3VyZXMgd3JhcHBlcnMgYXJlIGNsZWFyZWQgYWZ0ZXIgYW5pbWF0aW9uIGZpbmlzaGVzXG4gICAgICBjbGVhckN1cnJlbnRUaW1lb3V0KCk7XG4gICAgICB0aW1lb3V0SWQuY3VycmVudCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lb3V0SWQuY3VycmVudCA9IG51bGw7XG4gICAgICAgIGlmICghaXNPcGVuKSB7XG4gICAgICAgICAgYXBwbHlXcmFwcGVyU3R5bGVzKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTAwKTtcblxuICAgICAgLy8gQmluZCBrZXlkb3duIGhhbmRsZXJzIChvciBjdXN0b20gZnVuY3Rpb24gaWYgc3VwcGxpZWQpXG4gICAgICB2YXIgZGVmYXVsdE9uS2V5RG93biA9IGlzT3BlbiA/IG9uS2V5RG93bk9wZW4gOiBvbktleURvd25DbG9zZWQ7XG4gICAgICB2YXIgb25LZXlEb3duID0gcHJvcHMuY3VzdG9tT25LZXlEb3duIHx8IGRlZmF1bHRPbktleURvd247XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bik7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bik7XG4gICAgICB9O1xuICAgIH0sIFtpc09wZW5dKTtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gICAgICB0b2dnbGVPcHRpb25zLmN1cnJlbnQgPSBvcHRpb25zO1xuXG4gICAgICBhcHBseVdyYXBwZXJTdHlsZXMoKTtcblxuICAgICAgLy8gRW5zdXJlcyB3cmFwcGVyIHN0eWxlcyBhcmUgYXBwbGllZCBiZWZvcmUgdGhlIG1lbnUgaXMgdG9nZ2xlZFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNldElzT3BlbihmdW5jdGlvbiAob3Blbikge1xuICAgICAgICAgIHJldHVybiB0eXBlb2Ygb3B0aW9ucy5pc09wZW4gIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pc09wZW4gOiAhb3BlbjtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuKCkge1xuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5vbk9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJvcHMub25PcGVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b2dnbGVNZW51KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BzLm9uQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJvcHMub25DbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9nZ2xlTWVudSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0eWxlKHN0eWxlLCBpbmRleCkge1xuICAgICAgdmFyIHdpZHRoID0gcHJvcHMud2lkdGg7XG4gICAgICB2YXIgcmlnaHQgPSBwcm9wcy5yaWdodDtcblxuICAgICAgdmFyIGZvcm1hdHRlZFdpZHRoID0gdHlwZW9mIHdpZHRoICE9PSAnc3RyaW5nJyA/IHdpZHRoICsgJ3B4JyA6IHdpZHRoO1xuICAgICAgcmV0dXJuIHN0eWxlKGlzT3BlbiwgZm9ybWF0dGVkV2lkdGgsIHJpZ2h0LCBpbmRleCk7XG4gICAgfVxuXG4gICAgLy8gQnVpbGRzIHN0eWxlcyBpbmNyZW1lbnRhbGx5IGZvciBhIGdpdmVuIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBnZXRTdHlsZXMoZWwsIGluZGV4LCBpbmxpbmUpIHtcbiAgICAgIHZhciBwcm9wTmFtZSA9ICdibScgKyBlbC5yZXBsYWNlKGVsLmNoYXJBdCgwKSwgZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkpO1xuXG4gICAgICAvLyBTZXQgYmFzZSBzdHlsZXNcbiAgICAgIHZhciBvdXRwdXQgPSBfaGVscGVyc0Jhc2VTdHlsZXMyWydkZWZhdWx0J11bZWxdID8gZ2V0U3R5bGUoX2hlbHBlcnNCYXNlU3R5bGVzMlsnZGVmYXVsdCddW2VsXSkgOiB7fTtcblxuICAgICAgLy8gQWRkIGFuaW1hdGlvbi1zcGVjaWZpYyBzdHlsZXNcbiAgICAgIGlmIChzdHlsZXNbZWxdKSB7XG4gICAgICAgIG91dHB1dCA9IF9leHRlbmRzKHt9LCBvdXRwdXQsIGdldFN0eWxlKHN0eWxlc1tlbF0sIGluZGV4ICsgMSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgY3VzdG9tIHN0eWxlc1xuICAgICAgaWYgKHByb3BzLnN0eWxlc1twcm9wTmFtZV0pIHtcbiAgICAgICAgb3V0cHV0ID0gX2V4dGVuZHMoe30sIG91dHB1dCwgcHJvcHMuc3R5bGVzW3Byb3BOYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBlbGVtZW50IGlubGluZSBzdHlsZXNcbiAgICAgIGlmIChpbmxpbmUpIHtcbiAgICAgICAgb3V0cHV0ID0gX2V4dGVuZHMoe30sIG91dHB1dCwgaW5saW5lKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHRyYW5zaXRpb24gaWYgcmVxdWlyZWRcbiAgICAgIC8vICh1c2VmdWwgaWYgcmVuZGVyaW5nIG9wZW4gaW5pdGlhbGx5KVxuICAgICAgaWYgKHByb3BzLm5vVHJhbnNpdGlvbikge1xuICAgICAgICBkZWxldGUgb3V0cHV0LnRyYW5zaXRpb247XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gU2V0cyBvciB1bnNldHMgc3R5bGVzIG9uIERPTSBlbGVtZW50cyBvdXRzaWRlIHRoZSBtZW51IGNvbXBvbmVudFxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBjb3JyZWN0IHBhZ2UgaW50ZXJhY3Rpb24gd2l0aCBzb21lIG9mIHRoZSBtZW51c1xuICAgIC8vIFRocm93cyBhbmQgcmV0dXJucyBpZiB0aGUgcmVxdWlyZWQgZXh0ZXJuYWwgZWxlbWVudHMgZG9uJ3QgZXhpc3QsXG4gICAgLy8gd2hpY2ggbWVhbnMgYW55IGV4dGVybmFsIHBhZ2UgYW5pbWF0aW9ucyB3b24ndCBiZSBhcHBsaWVkXG4gICAgZnVuY3Rpb24gaGFuZGxlRXh0ZXJuYWxXcmFwcGVyKGlkLCB3cmFwcGVyU3R5bGVzLCBzZXQpIHtcbiAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICBpZiAoIXdyYXBwZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVsZW1lbnQgd2l0aCBJRCAnXCIgKyBpZCArIFwiJyBub3QgZm91bmRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGJ1aWx0U3R5bGVzID0gZ2V0U3R5bGUod3JhcHBlclN0eWxlcyk7XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gYnVpbHRTdHlsZXMpIHtcbiAgICAgICAgaWYgKGJ1aWx0U3R5bGVzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgd3JhcHBlci5zdHlsZVtwcm9wXSA9IHNldCA/IGJ1aWx0U3R5bGVzW3Byb3BdIDogJyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBhbnkgaG9yaXpvbnRhbCBzY3JvbGxcbiAgICAgIC8vIE9ubHkgc2V0IG92ZXJmbG93LXggYXMgYW4gaW5saW5lIHN0eWxlIGlmIGh0bWxDbGFzc05hbWUgb3JcbiAgICAgIC8vIGJvZHlDbGFzc05hbWUgaXMgbm90IHBhc3NlZCBpbi4gT3RoZXJ3aXNlLCBpdCBpcyB1cCB0byB0aGUgY2FsbGVyIHRvXG4gICAgICAvLyBkZWNpZGUgaWYgdGhleSB3YW50IHRvIHNldCB0aGUgb3ZlcmZsb3cgc3R5bGUgaW4gQ1NTIHVzaW5nIHRoZSBjdXN0b21cbiAgICAgIC8vIGNsYXNzIG5hbWVzXG4gICAgICB2YXIgYXBwbHlPdmVyZmxvdyA9IGZ1bmN0aW9uIGFwcGx5T3ZlcmZsb3coZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLnN0eWxlWydvdmVyZmxvdy14J10gPSBzZXQgPyAnaGlkZGVuJyA6ICcnO1xuICAgICAgfTtcbiAgICAgIGlmICghcHJvcHMuaHRtbENsYXNzTmFtZSkge1xuICAgICAgICBhcHBseU92ZXJmbG93KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKSk7XG4gICAgICB9XG4gICAgICBpZiAoIXByb3BzLmJvZHlDbGFzc05hbWUpIHtcbiAgICAgICAgYXBwbHlPdmVyZmxvdyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFwcGxpZXMgY29tcG9uZW50LXNwZWNpZmljIHN0eWxlcyB0byBleHRlcm5hbCB3cmFwcGVyIGVsZW1lbnRzXG4gICAgZnVuY3Rpb24gYXBwbHlXcmFwcGVyU3R5bGVzKCkge1xuICAgICAgdmFyIHNldCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRydWUgOiBhcmd1bWVudHNbMF07XG5cbiAgICAgIHZhciBhcHBseUNsYXNzID0gZnVuY3Rpb24gYXBwbHlDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGFzc0xpc3Rbc2V0ID8gJ2FkZCcgOiAncmVtb3ZlJ10oY2xhc3NOYW1lKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChwcm9wcy5odG1sQ2xhc3NOYW1lKSB7XG4gICAgICAgIGFwcGx5Q2xhc3MoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLCBwcm9wcy5odG1sQ2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wcy5ib2R5Q2xhc3NOYW1lKSB7XG4gICAgICAgIGFwcGx5Q2xhc3MoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCBwcm9wcy5ib2R5Q2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0eWxlcy5wYWdlV3JhcCAmJiBwcm9wcy5wYWdlV3JhcElkKSB7XG4gICAgICAgIGhhbmRsZUV4dGVybmFsV3JhcHBlcihwcm9wcy5wYWdlV3JhcElkLCBzdHlsZXMucGFnZVdyYXAsIHNldCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHlsZXMub3V0ZXJDb250YWluZXIgJiYgcHJvcHMub3V0ZXJDb250YWluZXJJZCkge1xuICAgICAgICBoYW5kbGVFeHRlcm5hbFdyYXBwZXIocHJvcHMub3V0ZXJDb250YWluZXJJZCwgc3R5bGVzLm91dGVyQ29udGFpbmVyLCBzZXQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWVudVdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm0tbWVudS13cmFwJyk7XG4gICAgICBpZiAobWVudVdyYXApIHtcbiAgICAgICAgaWYgKHNldCkge1xuICAgICAgICAgIG1lbnVXcmFwLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVudVdyYXAuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkcyBwb3RlbnRpYWxseSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSBhbiB1bm1vdW50ZWQgY29tcG9uZW50XG4gICAgZnVuY3Rpb24gY2xlYXJDdXJyZW50VGltZW91dCgpIHtcbiAgICAgIGlmICh0aW1lb3V0SWQuY3VycmVudCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkLmN1cnJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uS2V5RG93bk9wZW4oZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgICAvLyBDbG9zZSBvbiBFU0MsIHVubGVzcyBkaXNhYmxlZFxuICAgICAgICAgIGlmICghcHJvcHMuZGlzYWJsZUNsb3NlT25Fc2MpIHtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgICAoMCwgX2hlbHBlcnNEb20uZm9jdXNPbk1lbnVCdXR0b24pKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFSUk9XX0RPV046XG4gICAgICAgICAgKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25OZXh0TWVudUl0ZW0pKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVJST1dfVVA6XG4gICAgICAgICAgKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25QcmV2aW91c01lbnVJdGVtKSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEhPTUU6XG4gICAgICAgICAgKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25GaXJzdE1lbnVJdGVtKSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVORDpcbiAgICAgICAgICAoMCwgX2hlbHBlcnNEb20uZm9jdXNPbkxhc3RNZW51SXRlbSkoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbktleURvd25DbG9zZWQoZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgLy8gS2V5IGRvd25zIGNhbWUgZnJvbSBtZW51IGJ1dHRvblxuICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYnVyZ2VyLW1lbnUtYnRuJykpIHtcbiAgICAgICAgc3dpdGNoIChlLmtleSkge1xuICAgICAgICAgIGNhc2UgQVJST1dfRE9XTjpcbiAgICAgICAgICBjYXNlIFNQQUNFOlxuICAgICAgICAgICAgLy8gSWYgZG93biBhcnJvdywgc3BhY2Ugb3IgZW50ZXIsIG9wZW4gbWVudSBhbmQgZm9jdXMgb24gZmlyc3QgbWVudWl0ZW1cbiAgICAgICAgICAgIHRvZ2dsZU1lbnUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQVJST1dfVVA6XG4gICAgICAgICAgICAvLyBJZiBhcnJvdyB1cCwgb3BlbiBtZW51IGFuZCBmb2N1cyBvbiBsYXN0IG1lbnVpdGVtXG4gICAgICAgICAgICB0b2dnbGVNZW51KHsgZm9jdXNPbkxhc3RJdGVtOiB0cnVlIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xpY2soKSB7XG4gICAgICBpZiAocHJvcHMuZGlzYWJsZU92ZXJsYXlDbGljayA9PT0gdHJ1ZSB8fCB0eXBlb2YgcHJvcHMuZGlzYWJsZU92ZXJsYXlDbGljayA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wcy5kaXNhYmxlT3ZlcmxheUNsaWNrKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICAhcHJvcHMubm9PdmVybGF5ICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIGNsYXNzTmFtZTogKCdibS1vdmVybGF5ICcgKyBwcm9wcy5vdmVybGF5Q2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgIG9uQ2xpY2s6IGhhbmRsZU92ZXJsYXlDbGljayxcbiAgICAgICAgc3R5bGU6IGdldFN0eWxlcygnb3ZlcmxheScpXG4gICAgICB9KSxcbiAgICAgIHByb3BzLmN1c3RvbUJ1cmdlckljb24gIT09IGZhbHNlICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBzdHlsZTogZ2V0U3R5bGVzKCdidXJnZXJJY29uJykgfSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX2NvbXBvbmVudHNCdXJnZXJJY29uMlsnZGVmYXVsdCddLCB7XG4gICAgICAgICAgb25DbGljazogb3BlbixcbiAgICAgICAgICBzdHlsZXM6IHByb3BzLnN0eWxlcyxcbiAgICAgICAgICBjdXN0b21JY29uOiBwcm9wcy5jdXN0b21CdXJnZXJJY29uLFxuICAgICAgICAgIGNsYXNzTmFtZTogcHJvcHMuYnVyZ2VyQnV0dG9uQ2xhc3NOYW1lLFxuICAgICAgICAgIGJhckNsYXNzTmFtZTogcHJvcHMuYnVyZ2VyQmFyQ2xhc3NOYW1lLFxuICAgICAgICAgIG9uSWNvblN0YXRlQ2hhbmdlOiBwcm9wcy5vbkljb25TdGF0ZUNoYW5nZVxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgICBjbGFzc05hbWU6ICgnYm0tbWVudS13cmFwICcgKyBwcm9wcy5jbGFzc05hbWUpLnRyaW0oKSxcbiAgICAgICAgICBzdHlsZTogZ2V0U3R5bGVzKCdtZW51V3JhcCcpLFxuICAgICAgICAgICdhcmlhLWhpZGRlbic6ICFpc09wZW5cbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGVzLnN2ZyAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ2JtLW1vcnBoLXNoYXBlJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1tb3JwaC1zaGFwZSAnICsgcHJvcHMubW9ycGhTaGFwZUNsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgc3R5bGU6IGdldFN0eWxlcygnbW9ycGhTaGFwZScpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdzdmcnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdmlld0JveDogJzAgMCAxMDAgODAwJyxcbiAgICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ25vbmUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7IGQ6IHN0eWxlcy5zdmcucGF0aEluaXRpYWwgfSlcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1tZW51ICcgKyBwcm9wcy5tZW51Q2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgICAgICBzdHlsZTogZ2V0U3R5bGVzKCdtZW51JylcbiAgICAgICAgICB9LFxuICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KHByb3BzLml0ZW1MaXN0RWxlbWVudCwge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWl0ZW0tbGlzdCAnICsgcHJvcHMuaXRlbUxpc3RDbGFzc05hbWUpLnRyaW0oKSxcbiAgICAgICAgICAgIHN0eWxlOiBnZXRTdHlsZXMoJ2l0ZW1MaXN0JylcbiAgICAgICAgICB9LCBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ubWFwKHByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgIHZhciBjbGFzc0xpc3QgPSBbJ2JtLWl0ZW0nLCBwcm9wcy5pdGVtQ2xhc3NOYW1lLCBpdGVtLnByb3BzLmNsYXNzTmFtZV0uZmlsdGVyKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFjbGFzc05hbWU7XG4gICAgICAgICAgICAgIH0pLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgdmFyIGV4dHJhUHJvcHMgPSB7XG4gICAgICAgICAgICAgICAga2V5OiBpbmRleCxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTGlzdCxcbiAgICAgICAgICAgICAgICBzdHlsZTogZ2V0U3R5bGVzKCdpdGVtJywgaW5kZXgsIGl0ZW0ucHJvcHMuc3R5bGUpLFxuICAgICAgICAgICAgICAgIHRhYkluZGV4OiBpc09wZW4gPyAwIDogLTFcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jbG9uZUVsZW1lbnQoaXRlbSwgZXh0cmFQcm9wcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpXG4gICAgICAgICksXG4gICAgICAgIHByb3BzLmN1c3RvbUNyb3NzSWNvbiAhPT0gZmFsc2UgJiYgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBzdHlsZTogZ2V0U3R5bGVzKCdjbG9zZUJ1dHRvbicpIH0sXG4gICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX2NvbXBvbmVudHNDcm9zc0ljb24yWydkZWZhdWx0J10sIHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGNsb3NlLFxuICAgICAgICAgICAgc3R5bGVzOiBwcm9wcy5zdHlsZXMsXG4gICAgICAgICAgICBjdXN0b21JY29uOiBwcm9wcy5jdXN0b21Dcm9zc0ljb24sXG4gICAgICAgICAgICBjbGFzc05hbWU6IHByb3BzLmNyb3NzQnV0dG9uQ2xhc3NOYW1lLFxuICAgICAgICAgICAgY3Jvc3NDbGFzc05hbWU6IHByb3BzLmNyb3NzQ2xhc3NOYW1lLFxuICAgICAgICAgICAgaXNPcGVuOiBpc09wZW5cbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfTtcblxuICBNZW51LnByb3BUeXBlcyA9IHtcbiAgICBib2R5Q2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBidXJnZXJCYXJDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGJ1cmdlckJ1dHRvbkNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgY2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBjcm9zc0J1dHRvbkNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgY3Jvc3NDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGN1c3RvbUJ1cmdlckljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2ZUeXBlKFtfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmVsZW1lbnQsIF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2YoW2ZhbHNlXSldKSxcbiAgICBjdXN0b21Dcm9zc0ljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2ZUeXBlKFtfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmVsZW1lbnQsIF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2YoW2ZhbHNlXSldKSxcbiAgICBjdXN0b21PbktleURvd246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZnVuYyxcbiAgICBkaXNhYmxlQXV0b0ZvY3VzOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgZGlzYWJsZUNsb3NlT25Fc2M6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uYm9vbCxcbiAgICBkaXNhYmxlT3ZlcmxheUNsaWNrOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mVHlwZShbX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLCBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmZ1bmNdKSxcbiAgICBodG1sQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBpZDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgaXNPcGVuOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgaXRlbUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgaXRlbUxpc3RDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGl0ZW1MaXN0RWxlbWVudDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vbmVPZihbJ2RpdicsICduYXYnXSksXG4gICAgbWVudUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgbW9ycGhTaGFwZUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgbm9PdmVybGF5OiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgbm9UcmFuc2l0aW9uOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgb25DbG9zZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jLFxuICAgIG9uSWNvbkhvdmVyQ2hhbmdlOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmZ1bmMsXG4gICAgb25PcGVuOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmZ1bmMsXG4gICAgb25TdGF0ZUNoYW5nZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jLFxuICAgIG91dGVyQ29udGFpbmVySWQ6IHN0eWxlcyAmJiBzdHlsZXMub3V0ZXJDb250YWluZXIgPyBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZy5pc1JlcXVpcmVkIDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgb3ZlcmxheUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgcGFnZVdyYXBJZDogc3R5bGVzICYmIHN0eWxlcy5wYWdlV3JhcCA/IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLmlzUmVxdWlyZWQgOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICByaWdodDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgIHN0eWxlczogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vYmplY3QsXG4gICAgd2lkdGg6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2ZUeXBlKFtfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm51bWJlciwgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmddKVxuICB9O1xuXG4gIE1lbnUuZGVmYXVsdFByb3BzID0ge1xuICAgIGJvZHlDbGFzc05hbWU6ICcnLFxuICAgIGJ1cmdlckJhckNsYXNzTmFtZTogJycsXG4gICAgYnVyZ2VyQnV0dG9uQ2xhc3NOYW1lOiAnJyxcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIGNyb3NzQnV0dG9uQ2xhc3NOYW1lOiAnJyxcbiAgICBjcm9zc0NsYXNzTmFtZTogJycsXG4gICAgZGlzYWJsZUF1dG9Gb2N1czogZmFsc2UsXG4gICAgZGlzYWJsZUNsb3NlT25Fc2M6IGZhbHNlLFxuICAgIGh0bWxDbGFzc05hbWU6ICcnLFxuICAgIGlkOiAnJyxcbiAgICBpdGVtQ2xhc3NOYW1lOiAnJyxcbiAgICBpdGVtTGlzdENsYXNzTmFtZTogJycsXG4gICAgbWVudUNsYXNzTmFtZTogJycsXG4gICAgbW9ycGhTaGFwZUNsYXNzTmFtZTogJycsXG4gICAgbm9PdmVybGF5OiBmYWxzZSxcbiAgICBub1RyYW5zaXRpb246IGZhbHNlLFxuICAgIG9uU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uIG9uU3RhdGVDaGFuZ2UoKSB7fSxcbiAgICBvdXRlckNvbnRhaW5lcklkOiAnJyxcbiAgICBvdmVybGF5Q2xhc3NOYW1lOiAnJyxcbiAgICBwYWdlV3JhcElkOiAnJyxcbiAgICBzdHlsZXM6IHt9LFxuICAgIHdpZHRoOiAzMDAsXG4gICAgb25JY29uSG92ZXJDaGFuZ2U6IGZ1bmN0aW9uIG9uSWNvbkhvdmVyQ2hhbmdlKCkge30sXG4gICAgaXRlbUxpc3RFbGVtZW50OiAnbmF2J1xuICB9O1xuXG4gIHJldHVybiBNZW51O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3NuYXBzdmdJbXBvcnRlcicpO1xuXG52YXIgX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1NuYXBzdmdJbXBvcnRlcik7XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIF9oZWxwZXJzVXRpbHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3V0aWxzJyk7XG5cbnZhciBCVUJCTEVfV0lEVEggPSAxNDA7XG5cbnZhciBzdHlsZXMgPSB7XG4gIHN2Zzoge1xuICAgIGxpYjogX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIyWydkZWZhdWx0J10sXG4gICAgcGF0aEluaXRpYWw6ICdNLTcuMzEyLDBIMGMwLDAsMCwxMTMuODM5LDAsNDAwYzAsMjY0LjUwNiwwLDQwMCwwLDQwMGgtNy4zMTJWMHonLFxuICAgIHBhdGhPcGVuOiAnTS03LjMxMiwwSDE1YzAsMCw2NiwxMTMuMzM5LDY2LDM5OS41QzgxLDY2NC4wMDYsMTUsODAwLDE1LDgwMEgtNy4zMTJWMHo7TS03LjMxMiwwSDEwMGMwLDAsMCwxMTMuODM5LDAsNDAwYzAsMjY0LjUwNiwwLDQwMCwwLDQwMEgtNy4zMTJWMHonLFxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUocGF0aCkge1xuICAgICAgdmFyIHBvcyA9IDA7XG4gICAgICB2YXIgc3RlcHMgPSB0aGlzLnBhdGhPcGVuLnNwbGl0KCc7Jyk7XG4gICAgICB2YXIgc3RlcHNUb3RhbCA9IHN0ZXBzLmxlbmd0aDtcbiAgICAgIHZhciBtaW5hID0gd2luZG93Lm1pbmE7XG5cbiAgICAgIHZhciBuZXh0U3RlcCA9IGZ1bmN0aW9uIG5leHRTdGVwKCkge1xuICAgICAgICBpZiAocG9zID4gc3RlcHNUb3RhbCAtIDEpIHJldHVybjtcblxuICAgICAgICBwYXRoLmFuaW1hdGUoeyBwYXRoOiBzdGVwc1twb3NdIH0sIHBvcyA9PT0gMCA/IDQwMCA6IDUwMCwgcG9zID09PSAwID8gbWluYS5lYXNlaW4gOiBtaW5hLmVsYXN0aWMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBuZXh0U3RlcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwb3MrKztcbiAgICAgIH07XG5cbiAgICAgIG5leHRTdGVwKCk7XG4gICAgfVxuICB9LFxuXG4gIG1vcnBoU2hhcGU6IGZ1bmN0aW9uIG1vcnBoU2hhcGUoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICByaWdodDogcmlnaHQgPyAnaW5oZXJpdCcgOiAwLFxuICAgICAgbGVmdDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgTW96VHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknLFxuICAgICAgTXNUcmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAncm90YXRlWSgwZGVnKScsXG4gICAgICBPVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknLFxuICAgICAgdHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknXG4gICAgfTtcbiAgfSxcblxuICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICd0cmFuc2Zvcm0gMC40cyAwcycgOiAndHJhbnNmb3JtIDAuNHMnXG4gICAgfTtcbiAgfSxcblxuICBtZW51OiBmdW5jdGlvbiBtZW51KGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgdmFyIGZpbmFsV2lkdGggPSAoMCwgX2hlbHBlcnNVdGlscy5weFRvTnVtKSh3aWR0aCkgLSBCVUJCTEVfV0lEVEg7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAnb3BhY2l0eSAwLjFzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyksIHRyYW5zZm9ybSAwLjFzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknIDogJ29wYWNpdHkgMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDBzIDAuM3MgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknLFxuICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDBcbiAgICB9O1xuICB9LFxuXG4gIGl0ZW06IGZ1bmN0aW9uIGl0ZW0oaXNPcGVuLCB3aWR0aCwgcmlnaHQsIG50aENoaWxkKSB7XG4gICAgdmFyIGZpbmFsV2lkdGggPSAoMCwgX2hlbHBlcnNVdGlscy5weFRvTnVtKSh3aWR0aCkgLSBCVUJCTEVfV0lEVEg7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdvcGFjaXR5IDAuM3MgMC40cywgdHJhbnNmb3JtIDAuM3MgMC40cycgOiAnb3BhY2l0eSAwcyAwLjNzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpLCB0cmFuc2Zvcm0gMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScsXG4gICAgICBvcGFjaXR5OiBpc09wZW4gPyAxIDogMFxuICAgIH07XG4gIH0sXG5cbiAgY2xvc2VCdXR0b246IGZ1bmN0aW9uIGNsb3NlQnV0dG9uKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgdmFyIGZpbmFsV2lkdGggPSAoMCwgX2hlbHBlcnNVdGlscy5weFRvTnVtKSh3aWR0aCkgLSBCVUJCTEVfV0lEVEg7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdvcGFjaXR5IDAuM3MgMC40cyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDAuM3MgMC40cyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScgOiAnb3BhY2l0eSAwcyAwLjNzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpLCB0cmFuc2Zvcm0gMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScsXG4gICAgICBvcGFjaXR5OiBpc09wZW4gPyAxIDogMFxuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfaGVscGVyc1NuYXBzdmdJbXBvcnRlciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc25hcHN2Z0ltcG9ydGVyJyk7XG5cbnZhciBfaGVscGVyc1NuYXBzdmdJbXBvcnRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU25hcHN2Z0ltcG9ydGVyKTtcblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgX2hlbHBlcnNVdGlscyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcblxudmFyIE1PUlBIX1NIQVBFX1dJRFRIID0gMTIwO1xuXG52YXIgc3R5bGVzID0ge1xuICBzdmc6IHtcbiAgICBsaWI6IF9oZWxwZXJzU25hcHN2Z0ltcG9ydGVyMlsnZGVmYXVsdCddLFxuICAgIHBhdGhJbml0aWFsOiAnTS0xLDBoMTAxYzAsMC05Ny44MzMsMTUzLjYwMy05Ny44MzMsMzk2LjE2N0MyLjE2Nyw2MjcuNTc5LDEwMCw4MDAsMTAwLDgwMEgtMVYweicsXG4gICAgcGF0aE9wZW46ICdNLTEsMGgxMDFjMCwwLDAtMSwwLDM5NWMwLDQwNCwwLDQwNSwwLDQwNUgtMVYweicsXG4gICAgYW5pbWF0ZTogZnVuY3Rpb24gYW5pbWF0ZShwYXRoKSB7XG4gICAgICBwYXRoLmFuaW1hdGUoeyBwYXRoOiB0aGlzLnBhdGhPcGVuIH0sIDQwMCwgd2luZG93Lm1pbmEuZWFzZWlub3V0KTtcbiAgICB9XG4gIH0sXG5cbiAgbW9ycGhTaGFwZTogZnVuY3Rpb24gbW9ycGhTaGFwZShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiBNT1JQSF9TSEFQRV9XSURUSCxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgcmlnaHQ6IHJpZ2h0ID8gJ2luaGVyaXQnIDogMCxcbiAgICAgIGxlZnQ6IHJpZ2h0ID8gMCA6ICdpbmhlcml0JyxcbiAgICAgIE1velRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnLFxuICAgICAgTXNUcmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAnJyxcbiAgICAgIE9UcmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAnJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnLFxuICAgICAgdHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJydcbiAgICB9O1xuICB9LFxuXG4gIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzJ1xuICAgIH07XG4gIH0sXG5cbiAgbWVudTogZnVuY3Rpb24gbWVudShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIHJpZ2h0OiByaWdodCA/IDAgOiAnaW5oZXJpdCcsXG4gICAgICB3aWR0aDogKDAsIF9oZWxwZXJzVXRpbHMucHhUb051bSkod2lkdGgpIC0gTU9SUEhfU0hBUEVfV0lEVEgsXG4gICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJ1xuICAgIH07XG4gIH0sXG5cbiAgaXRlbUxpc3Q6IGZ1bmN0aW9uIGl0ZW1MaXN0KGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgaWYgKHJpZ2h0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgbGVmdDogJy0xMTBweCcsXG4gICAgICAgIHdpZHRoOiAnMTcwJScsXG4gICAgICAgIG92ZXJmbG93OiAnYXV0bydcbiAgICAgIH07XG4gICAgfVxuICB9LFxuXG4gIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ2FsbCAwLjNzJyA6ICdhbGwgMC4zcyAwLjFzJ1xuICAgIH07XG4gIH0sXG5cbiAgb3V0ZXJDb250YWluZXI6IGZ1bmN0aW9uIG91dGVyQ29udGFpbmVyKGlzT3Blbikge1xuICAgIHJldHVybiB7XG4gICAgICBvdmVyZmxvdzogaXNPcGVuID8gJycgOiAnaGlkZGVuJ1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIHN0eWxlcyA9IHtcbiAgbWVudVdyYXA6IGZ1bmN0aW9uIG1lbnVXcmFwKGlzT3Blbikge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMgZWFzZS1pbi1vdXQnXG4gICAgfTtcbiAgfSxcblxuICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJ1xuICAgIH07XG4gIH0sXG5cbiAgb3V0ZXJDb250YWluZXI6IGZ1bmN0aW9uIG91dGVyQ29udGFpbmVyKGlzT3Blbikge1xuICAgIHJldHVybiB7XG4gICAgICBwZXJzcGVjdGl2ZTogJzE1MDBweCcsXG4gICAgICBwZXJzcGVjdGl2ZU9yaWdpbjogJzAlIDUwJScsXG4gICAgICBvdmVyZmxvdzogaXNPcGVuID8gJycgOiAnaGlkZGVuJ1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIHN0eWxlcyA9IHtcbiAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgxNWRlZyknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoLTE1ZGVnKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKDE1ZGVnKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgtMTVkZWcpJyxcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogcmlnaHQgPyAnMTAwJSA1MCUnIDogJzAlIDUwJScsXG4gICAgICB0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGVyc3BlY3RpdmU6ICcxNTAwcHgnLFxuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICB6SW5kZXg6IGlzT3BlbiA/IDEwMDAgOiAtMVxuICAgIH07XG4gIH0sXG5cbiAgb3ZlcmxheTogZnVuY3Rpb24gb3ZlcmxheShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICB6SW5kZXg6IDE0MDAsXG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJyxcbiAgICAgIHZpc2liaWxpdHk6IGlzT3BlbiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfSxcblxuICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJyxcbiAgICAgIHpJbmRleDogMTIwMCxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgfTtcbiAgfSxcblxuICBidXJnZXJJY29uOiBmdW5jdGlvbiBidXJnZXJJY29uKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMXMnLFxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICB6SW5kZXg6IDEzMDBcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAtJyArIHdpZHRoICsgJyknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzEwMCUnLFxuICAgICAgdHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgfTtcbiAgfSxcblxuICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBlcnNwZWN0aXZlOiAnMTUwMHB4J1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIHN0eWxlcyA9IHtcbiAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKDIwZGVnKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgtMjBkZWcpJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoMjBkZWcpJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKC0yMGRlZyknLFxuICAgICAgdHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnLFxuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGVyc3BlY3RpdmU6ICcxNTAwcHgnLFxuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7fTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgc3R5bGVzID0ge1xuICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ3RyYW5zZm9ybSAwLjhzIGN1YmljLWJlemllcigwLjcsIDAsIDAuMywgMSknIDogJ3RyYW5zZm9ybSAwLjRzIGN1YmljLWJlemllcigwLjcsIDAsIDAuMywgMSknXG4gICAgfTtcbiAgfSxcblxuICBpdGVtOiBmdW5jdGlvbiBpdGVtKGlzT3Blbiwgd2lkdGgsIHJpZ2h0LCBudGhDaGlsZCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsICcgKyBudGhDaGlsZCAqIDUwMCArICdweCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsICcgKyBudGhDaGlsZCAqIDUwMCArICdweCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgJyArIG50aENoaWxkICogNTAwICsgJ3B4LCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsICcgKyBudGhDaGlsZCAqIDUwMCArICdweCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICd0cmFuc2Zvcm0gMC44cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJyA6ICd0cmFuc2Zvcm0gMHMgMC4ycyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJ1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJ3aW5kb3cuZXZlID0gcmVxdWlyZSgnZXZlJylcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE3IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxudmFyIG1pbmEgPSAoZnVuY3Rpb24gKGV2ZSkge1xuICAgIHZhciBhbmltYXRpb25zID0ge30sXG4gICAgcmVxdWVzdEFuaW1GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDE2LCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICByZXF1ZXN0SUQsXG4gICAgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheSB8fFxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9LFxuICAgIGlkZ2VuID0gMCxcbiAgICBpZHByZWZpeCA9IFwiTVwiICsgKCtuZXcgRGF0ZSkudG9TdHJpbmcoMzYpLFxuICAgIElEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaWRwcmVmaXggKyAoaWRnZW4rKykudG9TdHJpbmcoMzYpO1xuICAgIH0sXG4gICAgZGlmZiA9IGZ1bmN0aW9uIChhLCBiLCBBLCBCKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGEpKSB7XG4gICAgICAgICAgICByZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGEubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlc1tpXSA9IGRpZmYoYVtpXSwgYiwgQVtpXSwgQik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWYgPSAoQSAtIGEpIC8gKEIgLSBiKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgKyBkaWYgKiAoYmIgLSBiKTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIHRpbWVyID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlO1xuICAgIH0sXG4gICAgc3RhID0gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICB2YXIgYSA9IHRoaXM7XG4gICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGEucztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZHMgPSBhLnMgLSB2YWw7XG4gICAgICAgIGEuYiArPSBhLmR1ciAqIGRzO1xuICAgICAgICBhLkIgKz0gYS5kdXIgKiBkcztcbiAgICAgICAgYS5zID0gdmFsO1xuICAgIH0sXG4gICAgc3BlZWQgPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHZhciBhID0gdGhpcztcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5zcGQ7XG4gICAgICAgIH1cbiAgICAgICAgYS5zcGQgPSB2YWw7XG4gICAgfSxcbiAgICBkdXJhdGlvbiA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgdmFyIGEgPSB0aGlzO1xuICAgICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmR1cjtcbiAgICAgICAgfVxuICAgICAgICBhLnMgPSBhLnMgKiB2YWwgLyBhLmR1cjtcbiAgICAgICAgYS5kdXIgPSB2YWw7XG4gICAgfSxcbiAgICBzdG9waXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcztcbiAgICAgICAgZGVsZXRlIGFuaW1hdGlvbnNbYS5pZF07XG4gICAgICAgIGEudXBkYXRlKCk7XG4gICAgICAgIGV2ZShcIm1pbmEuc3RvcC5cIiArIGEuaWQsIGEpO1xuICAgIH0sXG4gICAgcGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcztcbiAgICAgICAgaWYgKGEucGRpZikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBhbmltYXRpb25zW2EuaWRdO1xuICAgICAgICBhLnVwZGF0ZSgpO1xuICAgICAgICBhLnBkaWYgPSBhLmdldCgpIC0gYS5iO1xuICAgIH0sXG4gICAgcmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXM7XG4gICAgICAgIGlmICghYS5wZGlmKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYS5iID0gYS5nZXQoKSAtIGEucGRpZjtcbiAgICAgICAgZGVsZXRlIGEucGRpZjtcbiAgICAgICAgYW5pbWF0aW9uc1thLmlkXSA9IGE7XG4gICAgICAgIGZyYW1lKCk7XG4gICAgfSxcbiAgICB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcyxcbiAgICAgICAgICAgIHJlcztcbiAgICAgICAgaWYgKGlzQXJyYXkoYS5zdGFydCkpIHtcbiAgICAgICAgICAgIHJlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0gYS5zdGFydC5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgcmVzW2pdID0gK2Euc3RhcnRbal0gK1xuICAgICAgICAgICAgICAgICAgICAoYS5lbmRbal0gLSBhLnN0YXJ0W2pdKSAqIGEuZWFzaW5nKGEucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSArYS5zdGFydCArIChhLmVuZCAtIGEuc3RhcnQpICogYS5lYXNpbmcoYS5zKTtcbiAgICAgICAgfVxuICAgICAgICBhLnNldChyZXMpO1xuICAgIH0sXG4gICAgZnJhbWUgPSBmdW5jdGlvbiAodGltZVN0YW1wKSB7XG4gICAgICAgIC8vIE1hbnVhbCBpbnZva2F0aW9uP1xuICAgICAgICBpZiAoIXRpbWVTdGFtcCkge1xuICAgICAgICAgICAgLy8gRnJhbWUgbG9vcCBzdG9wcGVkP1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0SUQpIHtcbiAgICAgICAgICAgICAgICAvLyBTdGFydCBmcmFtZSBsb29wLi4uXG4gICAgICAgICAgICAgICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1GcmFtZShmcmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYW5pbWF0aW9ucykgaWYgKGFuaW1hdGlvbnMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIHZhciBhID0gYW5pbWF0aW9uc1tpXSxcbiAgICAgICAgICAgICAgICBiID0gYS5nZXQoKSxcbiAgICAgICAgICAgICAgICByZXM7XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgIGEucyA9IChiIC0gYS5iKSAvIChhLmR1ciAvIGEuc3BkKTtcbiAgICAgICAgICAgIGlmIChhLnMgPj0gMSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBhbmltYXRpb25zW2ldO1xuICAgICAgICAgICAgICAgIGEucyA9IDE7XG4gICAgICAgICAgICAgICAgbGVuLS07XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlKFwibWluYS5maW5pc2guXCIgKyBhLmlkLCBhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfShhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RJRCA9IGxlbiA/IHJlcXVlc3RBbmltRnJhbWUoZnJhbWUpIDogZmFsc2U7XG4gICAgfSxcbiAgICAvKlxcXG4gICAgICogbWluYVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogR2VuZXJpYyBhbmltYXRpb24gb2YgbnVtYmVyc1xuICAgICAqKlxuICAgICAtIGEgKG51bWJlcikgc3RhcnQgX3NsYXZlXyBudW1iZXJcbiAgICAgLSBBIChudW1iZXIpIGVuZCBfc2xhdmVfIG51bWJlclxuICAgICAtIGIgKG51bWJlcikgc3RhcnQgX21hc3Rlcl8gbnVtYmVyIChzdGFydCB0aW1lIGluIGdlbmVyYWwgY2FzZSlcbiAgICAgLSBCIChudW1iZXIpIGVuZCBfbWFzdGVyXyBudW1iZXIgKGVuZCB0aW1lIGluIGdlbmVyYWwgY2FzZSlcbiAgICAgLSBnZXQgKGZ1bmN0aW9uKSBnZXR0ZXIgb2YgX21hc3Rlcl8gbnVtYmVyIChzZWUgQG1pbmEudGltZSlcbiAgICAgLSBzZXQgKGZ1bmN0aW9uKSBzZXR0ZXIgb2YgX3NsYXZlXyBudW1iZXJcbiAgICAgLSBlYXNpbmcgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgZWFzaW5nIGZ1bmN0aW9uLCBkZWZhdWx0IGlzIEBtaW5hLmxpbmVhclxuICAgICA9IChvYmplY3QpIGFuaW1hdGlvbiBkZXNjcmlwdG9yXG4gICAgIG8ge1xuICAgICBvICAgICAgICAgaWQgKHN0cmluZykgYW5pbWF0aW9uIGlkLFxuICAgICBvICAgICAgICAgc3RhcnQgKG51bWJlcikgc3RhcnQgX3NsYXZlXyBudW1iZXIsXG4gICAgIG8gICAgICAgICBlbmQgKG51bWJlcikgZW5kIF9zbGF2ZV8gbnVtYmVyLFxuICAgICBvICAgICAgICAgYiAobnVtYmVyKSBzdGFydCBfbWFzdGVyXyBudW1iZXIsXG4gICAgIG8gICAgICAgICBzIChudW1iZXIpIGFuaW1hdGlvbiBzdGF0dXMgKDAuLjEpLFxuICAgICBvICAgICAgICAgZHVyIChudW1iZXIpIGFuaW1hdGlvbiBkdXJhdGlvbixcbiAgICAgbyAgICAgICAgIHNwZCAobnVtYmVyKSBhbmltYXRpb24gc3BlZWQsXG4gICAgIG8gICAgICAgICBnZXQgKGZ1bmN0aW9uKSBnZXR0ZXIgb2YgX21hc3Rlcl8gbnVtYmVyIChzZWUgQG1pbmEudGltZSksXG4gICAgIG8gICAgICAgICBzZXQgKGZ1bmN0aW9uKSBzZXR0ZXIgb2YgX3NsYXZlXyBudW1iZXIsXG4gICAgIG8gICAgICAgICBlYXNpbmcgKGZ1bmN0aW9uKSBlYXNpbmcgZnVuY3Rpb24sIGRlZmF1bHQgaXMgQG1pbmEubGluZWFyLFxuICAgICBvICAgICAgICAgc3RhdHVzIChmdW5jdGlvbikgc3RhdHVzIGdldHRlci9zZXR0ZXIsXG4gICAgIG8gICAgICAgICBzcGVlZCAoZnVuY3Rpb24pIHNwZWVkIGdldHRlci9zZXR0ZXIsXG4gICAgIG8gICAgICAgICBkdXJhdGlvbiAoZnVuY3Rpb24pIGR1cmF0aW9uIGdldHRlci9zZXR0ZXIsXG4gICAgIG8gICAgICAgICBzdG9wIChmdW5jdGlvbikgYW5pbWF0aW9uIHN0b3BwZXJcbiAgICAgbyAgICAgICAgIHBhdXNlIChmdW5jdGlvbikgcGF1c2VzIHRoZSBhbmltYXRpb25cbiAgICAgbyAgICAgICAgIHJlc3VtZSAoZnVuY3Rpb24pIHJlc3VtZXMgdGhlIGFuaW1hdGlvblxuICAgICBvICAgICAgICAgdXBkYXRlIChmdW5jdGlvbikgY2FsbGVzIHNldHRlciB3aXRoIHRoZSByaWdodCB2YWx1ZSBvZiB0aGUgYW5pbWF0aW9uXG4gICAgIG8gfVxuICAgIFxcKi9cbiAgICBtaW5hID0gZnVuY3Rpb24gKGEsIEEsIGIsIEIsIGdldCwgc2V0LCBlYXNpbmcpIHtcbiAgICAgICAgdmFyIGFuaW0gPSB7XG4gICAgICAgICAgICBpZDogSUQoKSxcbiAgICAgICAgICAgIHN0YXJ0OiBhLFxuICAgICAgICAgICAgZW5kOiBBLFxuICAgICAgICAgICAgYjogYixcbiAgICAgICAgICAgIHM6IDAsXG4gICAgICAgICAgICBkdXI6IEIgLSBiLFxuICAgICAgICAgICAgc3BkOiAxLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBzZXQ6IHNldCxcbiAgICAgICAgICAgIGVhc2luZzogZWFzaW5nIHx8IG1pbmEubGluZWFyLFxuICAgICAgICAgICAgc3RhdHVzOiBzdGEsXG4gICAgICAgICAgICBzcGVlZDogc3BlZWQsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBzdG9wOiBzdG9waXQsXG4gICAgICAgICAgICBwYXVzZTogcGF1c2UsXG4gICAgICAgICAgICByZXN1bWU6IHJlc3VtZSxcbiAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICAgIH07XG4gICAgICAgIGFuaW1hdGlvbnNbYW5pbS5pZF0gPSBhbmltO1xuICAgICAgICB2YXIgbGVuID0gMCwgaTtcbiAgICAgICAgZm9yIChpIGluIGFuaW1hdGlvbnMpIGlmIChhbmltYXRpb25zLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgIGlmIChsZW4gPT0gMikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxlbiA9PSAxICYmIGZyYW1lKCk7XG4gICAgICAgIHJldHVybiBhbmltO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEudGltZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lLiBFcXVpdmFsZW50IHRvOlxuICAgICB8IGZ1bmN0aW9uICgpIHtcbiAgICAgfCAgICAgcmV0dXJuIChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuICAgICB8IH1cbiAgICBcXCovXG4gICAgbWluYS50aW1lID0gdGltZXI7XG4gICAgLypcXFxuICAgICAqIG1pbmEuZ2V0QnlJZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBhbmltYXRpb24gYnkgaXRzIGlkXG4gICAgIC0gaWQgKHN0cmluZykgYW5pbWF0aW9uJ3MgaWRcbiAgICAgPSAob2JqZWN0KSBTZWUgQG1pbmFcbiAgICBcXCovXG4gICAgbWluYS5nZXRCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBhbmltYXRpb25zW2lkXSB8fCBudWxsO1xuICAgIH07XG5cbiAgICAvKlxcXG4gICAgICogbWluYS5saW5lYXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIERlZmF1bHQgbGluZWFyIGVhc2luZ1xuICAgICAtIG4gKG51bWJlcikgaW5wdXQgMC4uMVxuICAgICA9IChudW1iZXIpIG91dHB1dCAwLi4xXG4gICAgXFwqL1xuICAgIG1pbmEubGluZWFyID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogbWluYS5lYXNlb3V0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBFYXNlb3V0IGVhc2luZ1xuICAgICAtIG4gKG51bWJlcikgaW5wdXQgMC4uMVxuICAgICA9IChudW1iZXIpIG91dHB1dCAwLi4xXG4gICAgXFwqL1xuICAgIG1pbmEuZWFzZW91dCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdyhuLCAxLjcpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuZWFzZWluXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBFYXNlaW4gZWFzaW5nXG4gICAgIC0gbiAobnVtYmVyKSBpbnB1dCAwLi4xXG4gICAgID0gKG51bWJlcikgb3V0cHV0IDAuLjFcbiAgICBcXCovXG4gICAgbWluYS5lYXNlaW4gPSBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3cobiwgLjQ4KTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmVhc2Vpbm91dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRWFzZWlub3V0IGVhc2luZ1xuICAgICAtIG4gKG51bWJlcikgaW5wdXQgMC4uMVxuICAgICA9IChudW1iZXIpIG91dHB1dCAwLi4xXG4gICAgXFwqL1xuICAgIG1pbmEuZWFzZWlub3V0ID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgaWYgKG4gPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG4gPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHEgPSAuNDggLSBuIC8gMS4wNCxcbiAgICAgICAgICAgIFEgPSBNYXRoLnNxcnQoLjE3MzQgKyBxICogcSksXG4gICAgICAgICAgICB4ID0gUSAtIHEsXG4gICAgICAgICAgICBYID0gTWF0aC5wb3coTWF0aC5hYnMoeCksIDEgLyAzKSAqICh4IDwgMCA/IC0xIDogMSksXG4gICAgICAgICAgICB5ID0gLVEgLSBxLFxuICAgICAgICAgICAgWSA9IE1hdGgucG93KE1hdGguYWJzKHkpLCAxIC8gMykgKiAoeSA8IDAgPyAtMSA6IDEpLFxuICAgICAgICAgICAgdCA9IFggKyBZICsgLjU7XG4gICAgICAgIHJldHVybiAoMSAtIHQpICogMyAqIHQgKiB0ICsgdCAqIHQgKiB0O1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuYmFja2luXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBCYWNraW4gZWFzaW5nXG4gICAgIC0gbiAobnVtYmVyKSBpbnB1dCAwLi4xXG4gICAgID0gKG51bWJlcikgb3V0cHV0IDAuLjFcbiAgICBcXCovXG4gICAgbWluYS5iYWNraW4gPSBmdW5jdGlvbiAobikge1xuICAgICAgICBpZiAobiA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiBuICogbiAqICgocyArIDEpICogbiAtIHMpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuYmFja291dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQmFja291dCBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmJhY2tvdXQgPSBmdW5jdGlvbiAobikge1xuICAgICAgICBpZiAobiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBuID0gbiAtIDE7XG4gICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgcmV0dXJuIG4gKiBuICogKChzICsgMSkgKiBuICsgcykgKyAxO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuZWxhc3RpY1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRWxhc3RpYyBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmVsYXN0aWMgPSBmdW5jdGlvbiAobikge1xuICAgICAgICBpZiAobiA9PSAhIW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLnBvdygyLCAtMTAgKiBuKSAqIE1hdGguc2luKChuIC0gLjA3NSkgKlxuICAgICAgICAgICAgKDIgKiBNYXRoLlBJKSAvIC4zKSArIDE7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogbWluYS5ib3VuY2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEJvdW5jZSBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmJvdW5jZSA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHZhciBzID0gNy41NjI1LFxuICAgICAgICAgICAgcCA9IDIuNzUsXG4gICAgICAgICAgICBsO1xuICAgICAgICBpZiAobiA8IDEgLyBwKSB7XG4gICAgICAgICAgICBsID0gcyAqIG4gKiBuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG4gPCAyIC8gcCkge1xuICAgICAgICAgICAgICAgIG4gLT0gMS41IC8gcDtcbiAgICAgICAgICAgICAgICBsID0gcyAqIG4gKiBuICsgLjc1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobiA8IDIuNSAvIHApIHtcbiAgICAgICAgICAgICAgICAgICAgbiAtPSAyLjI1IC8gcDtcbiAgICAgICAgICAgICAgICAgICAgbCA9IHMgKiBuICogbiArIC45Mzc1O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG4gLT0gMi42MjUgLyBwO1xuICAgICAgICAgICAgICAgICAgICBsID0gcyAqIG4gKiBuICsgLjk4NDM3NTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGw7XG4gICAgfTtcbiAgICB3aW5kb3cubWluYSA9IG1pbmE7XG4gICAgcmV0dXJuIG1pbmE7XG59KSh0eXBlb2YgZXZlID09IFwidW5kZWZpbmVkXCIgPyBmdW5jdGlvbiAoKSB7fSA6IGV2ZSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyAtIDIwMTcgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbnZhciBTbmFwID0gKGZ1bmN0aW9uKHJvb3QpIHtcblNuYXAudmVyc2lvbiA9IFwiMC41LjFcIjtcbi8qXFxcbiAqIFNuYXBcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENyZWF0ZXMgYSBkcmF3aW5nIHN1cmZhY2Ugb3Igd3JhcHMgZXhpc3RpbmcgU1ZHIGVsZW1lbnQuXG4gKipcbiAtIHdpZHRoIChudW1iZXJ8c3RyaW5nKSB3aWR0aCBvZiBzdXJmYWNlXG4gLSBoZWlnaHQgKG51bWJlcnxzdHJpbmcpIGhlaWdodCBvZiBzdXJmYWNlXG4gKiBvclxuIC0gRE9NIChTVkdFbGVtZW50KSBlbGVtZW50IHRvIGJlIHdyYXBwZWQgaW50byBTbmFwIHN0cnVjdHVyZVxuICogb3JcbiAtIGFycmF5IChhcnJheSkgYXJyYXkgb2YgZWxlbWVudHMgKHdpbGwgcmV0dXJuIHNldCBvZiBlbGVtZW50cylcbiAqIG9yXG4gLSBxdWVyeSAoc3RyaW5nKSBDU1MgcXVlcnkgc2VsZWN0b3JcbiA9IChvYmplY3QpIEBFbGVtZW50XG5cXCovXG5mdW5jdGlvbiBTbmFwKHcsIGgpIHtcbiAgICBpZiAodykge1xuICAgICAgICBpZiAody5ub2RlVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzKHcsIFwiYXJyYXlcIikgJiYgU25hcC5zZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLnNldC5hcHBseShTbmFwLCB3KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodyBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB3O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoID09IG51bGwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdyA9IGdsb2IuZG9jLnF1ZXJ5U2VsZWN0b3IoU3RyaW5nKHcpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gd3JhcCh3KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3ID0gdyA9PSBudWxsID8gXCIxMDAlXCIgOiB3O1xuICAgIGggPSBoID09IG51bGwgPyBcIjEwMCVcIiA6IGg7XG4gICAgcmV0dXJuIG5ldyBQYXBlcih3LCBoKTtcbn1cblNuYXAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiU25hcCB2XCIgKyB0aGlzLnZlcnNpb247XG59O1xuU25hcC5fID0ge307XG52YXIgZ2xvYiA9IHtcbiAgICB3aW46IHJvb3Qud2luZG93LFxuICAgIGRvYzogcm9vdC53aW5kb3cuZG9jdW1lbnRcbn07XG5TbmFwLl8uZ2xvYiA9IGdsb2I7XG52YXIgaGFzID0gXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgIFN0ciA9IFN0cmluZyxcbiAgICB0b0Zsb2F0ID0gcGFyc2VGbG9hdCxcbiAgICB0b0ludCA9IHBhcnNlSW50LFxuICAgIG1hdGggPSBNYXRoLFxuICAgIG1tYXggPSBtYXRoLm1heCxcbiAgICBtbWluID0gbWF0aC5taW4sXG4gICAgYWJzID0gbWF0aC5hYnMsXG4gICAgcG93ID0gbWF0aC5wb3csXG4gICAgUEkgPSBtYXRoLlBJLFxuICAgIHJvdW5kID0gbWF0aC5yb3VuZCxcbiAgICBFID0gXCJcIixcbiAgICBTID0gXCIgXCIsXG4gICAgb2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIElTVVJMID0gL151cmxcXChbJ1wiXT8oW15cXCldKz8pWydcIl0/XFwpJC9pLFxuICAgIGNvbG91clJlZ0V4cCA9IC9eXFxzKigoI1thLWZcXGRdezZ9KXwoI1thLWZcXGRdezN9KXxyZ2JhP1xcKFxccyooW1xcZFxcLl0rJT9cXHMqLFxccypbXFxkXFwuXSslP1xccyosXFxzKltcXGRcXC5dKyU/KD86XFxzKixcXHMqW1xcZFxcLl0rJT8pPylcXHMqXFwpfGhzYmE/XFwoXFxzKihbXFxkXFwuXSsoPzpkZWd8XFx4YjB8JSk/XFxzKixcXHMqW1xcZFxcLl0rJT9cXHMqLFxccypbXFxkXFwuXSsoPzolP1xccyosXFxzKltcXGRcXC5dKyk/JT8pXFxzKlxcKXxoc2xhP1xcKFxccyooW1xcZFxcLl0rKD86ZGVnfFxceGIwfCUpP1xccyosXFxzKltcXGRcXC5dKyU/XFxzKixcXHMqW1xcZFxcLl0rKD86JT9cXHMqLFxccypbXFxkXFwuXSspPyU/KVxccypcXCkpXFxzKiQvaSxcbiAgICBiZXppZXJyZyA9IC9eKD86Y3ViaWMtKT9iZXppZXJcXCgoW14sXSspLChbXixdKyksKFteLF0rKSwoW15cXCldKylcXCkvLFxuICAgIHNlcGFyYXRvciA9IFNuYXAuXy5zZXBhcmF0b3IgPSAvWyxcXHNdKy8sXG4gICAgd2hpdGVzcGFjZSA9IC9bXFxzXS9nLFxuICAgIGNvbW1hU3BhY2VzID0gL1tcXHNdKixbXFxzXSovLFxuICAgIGhzcmcgPSB7aHM6IDEsIHJnOiAxfSxcbiAgICBwYXRoQ29tbWFuZCA9IC8oW2Etel0pW1xccyxdKigoLT9cXGQqXFwuP1xcZCooPzplW1xcLStdP1xcZCspP1tcXHNdKiw/W1xcc10qKSspL2lnLFxuICAgIHRDb21tYW5kID0gLyhbcnN0bV0pW1xccyxdKigoLT9cXGQqXFwuP1xcZCooPzplW1xcLStdP1xcZCspP1tcXHNdKiw/W1xcc10qKSspL2lnLFxuICAgIHBhdGhWYWx1ZXMgPSAvKC0/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT8pW1xcc10qLD9bXFxzXSovaWcsXG4gICAgaWRnZW4gPSAwLFxuICAgIGlkcHJlZml4ID0gXCJTXCIgKyAoK25ldyBEYXRlKS50b1N0cmluZygzNiksXG4gICAgSUQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgcmV0dXJuIChlbCAmJiBlbC50eXBlID8gZWwudHlwZSA6IEUpICsgaWRwcmVmaXggKyAoaWRnZW4rKykudG9TdHJpbmcoMzYpO1xuICAgIH0sXG4gICAgeGxpbmsgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgICB4bWxucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICBodWIgPSB7fSxcbiAgICAvKlxcXG4gICAgICogU25hcC51cmxcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFdyYXBzIHBhdGggaW50byBgXCJ1cmwoJzxwYXRoPicpXCJgLlxuICAgICAtIHZhbHVlIChzdHJpbmcpIHBhdGhcbiAgICAgPSAoc3RyaW5nKSB3cmFwcGVkIHBhdGhcbiAgICBcXCovXG4gICAgVVJMID0gU25hcC51cmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBcInVybCgnI1wiICsgdXJsICsgXCInKVwiO1xuICAgIH07XG5cbmZ1bmN0aW9uICQoZWwsIGF0dHIpIHtcbiAgICBpZiAoYXR0cikge1xuICAgICAgICBpZiAoZWwgPT0gXCIjdGV4dFwiKSB7XG4gICAgICAgICAgICBlbCA9IGdsb2IuZG9jLmNyZWF0ZVRleHROb2RlKGF0dHIudGV4dCB8fCBhdHRyW1wiI3RleHRcIl0gfHwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsID09IFwiI2NvbW1lbnRcIikge1xuICAgICAgICAgICAgZWwgPSBnbG9iLmRvYy5jcmVhdGVDb21tZW50KGF0dHIudGV4dCB8fCBhdHRyW1wiI3RleHRcIl0gfHwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBlbCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlbCA9ICQoZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYXR0ciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoZWwubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLnN1YnN0cmluZygwLCA2KSA9PSBcInhsaW5rOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGVOUyh4bGluaywgYXR0ci5zdWJzdHJpbmcoNikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXR0ci5zdWJzdHJpbmcoMCwgNCkgPT0gXCJ4bWw6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZU5TKHhtbG5zLCBhdHRyLnN1YnN0cmluZyg0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGF0dHIgPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubm9kZVZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHIpIGlmIChhdHRyW2hhc10oa2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBTdHIoYXR0cltrZXldKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkuc3Vic3RyaW5nKDAsIDYpID09IFwieGxpbms6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rLCBrZXkuc3Vic3RyaW5nKDYpLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleS5zdWJzdHJpbmcoMCwgNCkgPT0gXCJ4bWw6XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhtbG5zLCBrZXkuc3Vic3RyaW5nKDQpLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcInRleHRcIiBpbiBhdHRyKSB7XG4gICAgICAgICAgICBlbC5ub2RlVmFsdWUgPSBhdHRyLnRleHQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBlbCA9IGdsb2IuZG9jLmNyZWF0ZUVsZW1lbnROUyh4bWxucywgZWwpO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG59XG5TbmFwLl8uJCA9ICQ7XG5TbmFwLl8uaWQgPSBJRDtcbmZ1bmN0aW9uIGdldEF0dHJzKGVsKSB7XG4gICAgdmFyIGF0dHJzID0gZWwuYXR0cmlidXRlcyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgb3V0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXR0cnNbaV0ubmFtZXNwYWNlVVJJID09IHhsaW5rKSB7XG4gICAgICAgICAgICBuYW1lID0gXCJ4bGluazpcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgKz0gYXR0cnNbaV0ubmFtZTtcbiAgICAgICAgb3V0W25hbWVdID0gYXR0cnNbaV0udGV4dENvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5mdW5jdGlvbiBpcyhvLCB0eXBlKSB7XG4gICAgdHlwZSA9IFN0ci5wcm90b3R5cGUudG9Mb3dlckNhc2UuY2FsbCh0eXBlKTtcbiAgICBpZiAodHlwZSA9PSBcImZpbml0ZVwiKSB7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZShvKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJhcnJheVwiICYmXG4gICAgICAgIChvIGluc3RhbmNlb2YgQXJyYXkgfHwgQXJyYXkuaXNBcnJheSAmJiBBcnJheS5pc0FycmF5KG8pKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICB0eXBlID09IFwibnVsbFwiICYmIG8gPT09IG51bGwgfHxcbiAgICAgICAgICAgIHR5cGUgPT0gdHlwZW9mIG8gJiYgbyAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgdHlwZSA9PSBcIm9iamVjdFwiICYmIG8gPT09IE9iamVjdChvKSB8fFxuICAgICAgICAgICAgb2JqZWN0VG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKSA9PSB0eXBlO1xufVxuLypcXFxuICogU25hcC5mb3JtYXRcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFJlcGxhY2VzIGNvbnN0cnVjdGlvbiBvZiB0eXBlIGB7PG5hbWU+fWAgdG8gdGhlIGNvcnJlc3BvbmRpbmcgYXJndW1lbnRcbiAqKlxuIC0gdG9rZW4gKHN0cmluZykgc3RyaW5nIHRvIGZvcm1hdFxuIC0ganNvbiAob2JqZWN0KSBvYmplY3Qgd2hpY2ggcHJvcGVydGllcyBhcmUgdXNlZCBhcyBhIHJlcGxhY2VtZW50XG4gPSAoc3RyaW5nKSBmb3JtYXR0ZWQgc3RyaW5nXG4gPiBVc2FnZVxuIHwgLy8gdGhpcyBkcmF3cyBhIHJlY3Rhbmd1bGFyIHNoYXBlIGVxdWl2YWxlbnQgdG8gXCJNMTAsMjBoNDB2NTBoLTQwelwiXG4gfCBwYXBlci5wYXRoKFNuYXAuZm9ybWF0KFwiTXt4fSx7eX1oe2RpbS53aWR0aH12e2RpbS5oZWlnaHR9aHtkaW1bJ25lZ2F0aXZlIHdpZHRoJ119elwiLCB7XG4gfCAgICAgeDogMTAsXG4gfCAgICAgeTogMjAsXG4gfCAgICAgZGltOiB7XG4gfCAgICAgICAgIHdpZHRoOiA0MCxcbiB8ICAgICAgICAgaGVpZ2h0OiA1MCxcbiB8ICAgICAgICAgXCJuZWdhdGl2ZSB3aWR0aFwiOiAtNDBcbiB8ICAgICB9XG4gfCB9KSk7XG5cXCovXG5TbmFwLmZvcm1hdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRva2VuUmVnZXggPSAvXFx7KFteXFx9XSspXFx9L2csXG4gICAgICAgIG9iak5vdGF0aW9uUmVnZXggPSAvKD86KD86XnxcXC4pKC4rPykoPz1cXFt8XFwufCR8XFwoKXxcXFsoJ3xcIikoLis/KVxcMlxcXSkoXFwoXFwpKT8vZywgLy8gbWF0Y2hlcyAueHh4eHggb3IgW1wieHh4eHhcIl0gdG8gcnVuIG92ZXIgb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgICAgcmVwbGFjZXIgPSBmdW5jdGlvbiAoYWxsLCBrZXksIG9iaikge1xuICAgICAgICAgICAgdmFyIHJlcyA9IG9iajtcbiAgICAgICAgICAgIGtleS5yZXBsYWNlKG9iak5vdGF0aW9uUmVnZXgsIGZ1bmN0aW9uIChhbGwsIG5hbWUsIHF1b3RlLCBxdW90ZWROYW1lLCBpc0Z1bmMpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZSB8fCBxdW90ZWROYW1lO1xuICAgICAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgaW4gcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHJlcyA9PSBcImZ1bmN0aW9uXCIgJiYgaXNGdW5jICYmIChyZXMgPSByZXMoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXMgPSAocmVzID09IG51bGwgfHwgcmVzID09IG9iaiA/IGFsbCA6IHJlcykgKyBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0ciwgb2JqKSB7XG4gICAgICAgIHJldHVybiBTdHIoc3RyKS5yZXBsYWNlKHRva2VuUmVnZXgsIGZ1bmN0aW9uIChhbGwsIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VyKGFsbCwga2V5LCBvYmopO1xuICAgICAgICB9KTtcbiAgICB9O1xufSkoKTtcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIGlmICh0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIiB8fCBPYmplY3Qob2JqKSAhPT0gb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIHZhciByZXMgPSBuZXcgb2JqLmNvbnN0cnVjdG9yO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChvYmpbaGFzXShrZXkpKSB7XG4gICAgICAgIHJlc1trZXldID0gY2xvbmUob2JqW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuU25hcC5fLmNsb25lID0gY2xvbmU7XG5mdW5jdGlvbiByZXB1c2goYXJyYXksIGl0ZW0pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBhcnJheS5sZW5ndGg7IGkgPCBpaTsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGFycmF5LnB1c2goYXJyYXkuc3BsaWNlKGksIDEpWzBdKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjYWNoZXIoZiwgc2NvcGUsIHBvc3Rwcm9jZXNzb3IpIHtcbiAgICBmdW5jdGlvbiBuZXdmKCkge1xuICAgICAgICB2YXIgYXJnID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmcuam9pbihcIlxcdTI0MDBcIiksXG4gICAgICAgICAgICBjYWNoZSA9IG5ld2YuY2FjaGUgPSBuZXdmLmNhY2hlIHx8IHt9LFxuICAgICAgICAgICAgY291bnQgPSBuZXdmLmNvdW50ID0gbmV3Zi5jb3VudCB8fCBbXTtcbiAgICAgICAgaWYgKGNhY2hlW2hhc10oYXJncykpIHtcbiAgICAgICAgICAgIHJlcHVzaChjb3VudCwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gcG9zdHByb2Nlc3NvciA/IHBvc3Rwcm9jZXNzb3IoY2FjaGVbYXJnc10pIDogY2FjaGVbYXJnc107XG4gICAgICAgIH1cbiAgICAgICAgY291bnQubGVuZ3RoID49IDFlMyAmJiBkZWxldGUgY2FjaGVbY291bnQuc2hpZnQoKV07XG4gICAgICAgIGNvdW50LnB1c2goYXJncyk7XG4gICAgICAgIGNhY2hlW2FyZ3NdID0gZi5hcHBseShzY29wZSwgYXJnKTtcbiAgICAgICAgcmV0dXJuIHBvc3Rwcm9jZXNzb3IgPyBwb3N0cHJvY2Vzc29yKGNhY2hlW2FyZ3NdKSA6IGNhY2hlW2FyZ3NdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3Zjtcbn1cblNuYXAuXy5jYWNoZXIgPSBjYWNoZXI7XG5mdW5jdGlvbiBhbmdsZSh4MSwgeTEsIHgyLCB5MiwgeDMsIHkzKSB7XG4gICAgaWYgKHgzID09IG51bGwpIHtcbiAgICAgICAgdmFyIHggPSB4MSAtIHgyLFxuICAgICAgICAgICAgeSA9IHkxIC0geTI7XG4gICAgICAgIGlmICgheCAmJiAheSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgxODAgKyBtYXRoLmF0YW4yKC15LCAteCkgKiAxODAgLyBQSSArIDM2MCkgJSAzNjA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFuZ2xlKHgxLCB5MSwgeDMsIHkzKSAtIGFuZ2xlKHgyLCB5MiwgeDMsIHkzKTtcbiAgICB9XG59XG5mdW5jdGlvbiByYWQoZGVnKSB7XG4gICAgcmV0dXJuIGRlZyAlIDM2MCAqIFBJIC8gMTgwO1xufVxuZnVuY3Rpb24gZGVnKHJhZCkge1xuICAgIHJldHVybiByYWQgKiAxODAgLyBQSSAlIDM2MDtcbn1cbmZ1bmN0aW9uIHhfeSgpIHtcbiAgICByZXR1cm4gdGhpcy54ICsgUyArIHRoaXMueTtcbn1cbmZ1bmN0aW9uIHhfeV93X2goKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIFMgKyB0aGlzLnkgKyBTICsgdGhpcy53aWR0aCArIFwiIFxceGQ3IFwiICsgdGhpcy5oZWlnaHQ7XG59XG5cbi8qXFxcbiAqIFNuYXAucmFkXG4gWyBtZXRob2QgXVxuICoqXG4gKiBUcmFuc2Zvcm0gYW5nbGUgdG8gcmFkaWFuc1xuIC0gZGVnIChudW1iZXIpIGFuZ2xlIGluIGRlZ3JlZXNcbiA9IChudW1iZXIpIGFuZ2xlIGluIHJhZGlhbnNcblxcKi9cblNuYXAucmFkID0gcmFkO1xuLypcXFxuICogU25hcC5kZWdcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFRyYW5zZm9ybSBhbmdsZSB0byBkZWdyZWVzXG4gLSByYWQgKG51bWJlcikgYW5nbGUgaW4gcmFkaWFuc1xuID0gKG51bWJlcikgYW5nbGUgaW4gZGVncmVlc1xuXFwqL1xuU25hcC5kZWcgPSBkZWc7XG4vKlxcXG4gKiBTbmFwLnNpblxuIFsgbWV0aG9kIF1cbiAqKlxuICogRXF1aXZhbGVudCB0byBgTWF0aC5zaW4oKWAgb25seSB3b3JrcyB3aXRoIGRlZ3JlZXMsIG5vdCByYWRpYW5zLlxuIC0gYW5nbGUgKG51bWJlcikgYW5nbGUgaW4gZGVncmVlc1xuID0gKG51bWJlcikgc2luXG5cXCovXG5TbmFwLnNpbiA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICAgIHJldHVybiBtYXRoLnNpbihTbmFwLnJhZChhbmdsZSkpO1xufTtcbi8qXFxcbiAqIFNuYXAudGFuXG4gWyBtZXRob2QgXVxuICoqXG4gKiBFcXVpdmFsZW50IHRvIGBNYXRoLnRhbigpYCBvbmx5IHdvcmtzIHdpdGggZGVncmVlcywgbm90IHJhZGlhbnMuXG4gLSBhbmdsZSAobnVtYmVyKSBhbmdsZSBpbiBkZWdyZWVzXG4gPSAobnVtYmVyKSB0YW5cblxcKi9cblNuYXAudGFuID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgcmV0dXJuIG1hdGgudGFuKFNuYXAucmFkKGFuZ2xlKSk7XG59O1xuLypcXFxuICogU25hcC5jb3NcbiBbIG1ldGhvZCBdXG4gKipcbiAqIEVxdWl2YWxlbnQgdG8gYE1hdGguY29zKClgIG9ubHkgd29ya3Mgd2l0aCBkZWdyZWVzLCBub3QgcmFkaWFucy5cbiAtIGFuZ2xlIChudW1iZXIpIGFuZ2xlIGluIGRlZ3JlZXNcbiA9IChudW1iZXIpIGNvc1xuXFwqL1xuU25hcC5jb3MgPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICByZXR1cm4gbWF0aC5jb3MoU25hcC5yYWQoYW5nbGUpKTtcbn07XG4vKlxcXG4gKiBTbmFwLmFzaW5cbiBbIG1ldGhvZCBdXG4gKipcbiAqIEVxdWl2YWxlbnQgdG8gYE1hdGguYXNpbigpYCBvbmx5IHdvcmtzIHdpdGggZGVncmVlcywgbm90IHJhZGlhbnMuXG4gLSBudW0gKG51bWJlcikgdmFsdWVcbiA9IChudW1iZXIpIGFzaW4gaW4gZGVncmVlc1xuXFwqL1xuU25hcC5hc2luID0gZnVuY3Rpb24gKG51bSkge1xuICAgIHJldHVybiBTbmFwLmRlZyhtYXRoLmFzaW4obnVtKSk7XG59O1xuLypcXFxuICogU25hcC5hY29zXG4gWyBtZXRob2QgXVxuICoqXG4gKiBFcXVpdmFsZW50IHRvIGBNYXRoLmFjb3MoKWAgb25seSB3b3JrcyB3aXRoIGRlZ3JlZXMsIG5vdCByYWRpYW5zLlxuIC0gbnVtIChudW1iZXIpIHZhbHVlXG4gPSAobnVtYmVyKSBhY29zIGluIGRlZ3JlZXNcblxcKi9cblNuYXAuYWNvcyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICByZXR1cm4gU25hcC5kZWcobWF0aC5hY29zKG51bSkpO1xufTtcbi8qXFxcbiAqIFNuYXAuYXRhblxuIFsgbWV0aG9kIF1cbiAqKlxuICogRXF1aXZhbGVudCB0byBgTWF0aC5hdGFuKClgIG9ubHkgd29ya3Mgd2l0aCBkZWdyZWVzLCBub3QgcmFkaWFucy5cbiAtIG51bSAobnVtYmVyKSB2YWx1ZVxuID0gKG51bWJlcikgYXRhbiBpbiBkZWdyZWVzXG5cXCovXG5TbmFwLmF0YW4gPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgcmV0dXJuIFNuYXAuZGVnKG1hdGguYXRhbihudW0pKTtcbn07XG4vKlxcXG4gKiBTbmFwLmF0YW4yXG4gWyBtZXRob2QgXVxuICoqXG4gKiBFcXVpdmFsZW50IHRvIGBNYXRoLmF0YW4yKClgIG9ubHkgd29ya3Mgd2l0aCBkZWdyZWVzLCBub3QgcmFkaWFucy5cbiAtIG51bSAobnVtYmVyKSB2YWx1ZVxuID0gKG51bWJlcikgYXRhbjIgaW4gZGVncmVlc1xuXFwqL1xuU25hcC5hdGFuMiA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICByZXR1cm4gU25hcC5kZWcobWF0aC5hdGFuMihudW0pKTtcbn07XG4vKlxcXG4gKiBTbmFwLmFuZ2xlXG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXR1cm5zIGFuIGFuZ2xlIGJldHdlZW4gdHdvIG9yIHRocmVlIHBvaW50c1xuIC0geDEgKG51bWJlcikgeCBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geTEgKG51bWJlcikgeSBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geDIgKG51bWJlcikgeCBjb29yZCBvZiBzZWNvbmQgcG9pbnRcbiAtIHkyIChudW1iZXIpIHkgY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gLSB4MyAobnVtYmVyKSAjb3B0aW9uYWwgeCBjb29yZCBvZiB0aGlyZCBwb2ludFxuIC0geTMgKG51bWJlcikgI29wdGlvbmFsIHkgY29vcmQgb2YgdGhpcmQgcG9pbnRcbiA9IChudW1iZXIpIGFuZ2xlIGluIGRlZ3JlZXNcblxcKi9cblNuYXAuYW5nbGUgPSBhbmdsZTtcbi8qXFxcbiAqIFNuYXAubGVuXG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXR1cm5zIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuIC0geDEgKG51bWJlcikgeCBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geTEgKG51bWJlcikgeSBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geDIgKG51bWJlcikgeCBjb29yZCBvZiBzZWNvbmQgcG9pbnRcbiAtIHkyIChudW1iZXIpIHkgY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gPSAobnVtYmVyKSBkaXN0YW5jZVxuXFwqL1xuU25hcC5sZW4gPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KFNuYXAubGVuMih4MSwgeTEsIHgyLCB5MikpO1xufTtcbi8qXFxcbiAqIFNuYXAubGVuMlxuIFsgbWV0aG9kIF1cbiAqKlxuICogUmV0dXJucyBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuIC0geDEgKG51bWJlcikgeCBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geTEgKG51bWJlcikgeSBjb29yZCBvZiBmaXJzdCBwb2ludFxuIC0geDIgKG51bWJlcikgeCBjb29yZCBvZiBzZWNvbmQgcG9pbnRcbiAtIHkyIChudW1iZXIpIHkgY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gPSAobnVtYmVyKSBkaXN0YW5jZVxuXFwqL1xuU25hcC5sZW4yID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuICh4MSAtIHgyKSAqICh4MSAtIHgyKSArICh5MSAtIHkyKSAqICh5MSAtIHkyKTtcbn07XG4vKlxcXG4gKiBTbmFwLmNsb3Nlc3RQb2ludFxuIFsgbWV0aG9kIF1cbiAqKlxuICogUmV0dXJucyBjbG9zZXN0IHBvaW50IHRvIGEgZ2l2ZW4gb25lIG9uIGEgZ2l2ZW4gcGF0aC5cbiAtIHBhdGggKEVsZW1lbnQpIHBhdGggZWxlbWVudFxuIC0geCAobnVtYmVyKSB4IGNvb3JkIG9mIGEgcG9pbnRcbiAtIHkgKG51bWJlcikgeSBjb29yZCBvZiBhIHBvaW50XG4gPSAob2JqZWN0KSBpbiBmb3JtYXRcbiB7XG4gICAgeCAobnVtYmVyKSB4IGNvb3JkIG9mIHRoZSBwb2ludCBvbiB0aGUgcGF0aFxuICAgIHkgKG51bWJlcikgeSBjb29yZCBvZiB0aGUgcG9pbnQgb24gdGhlIHBhdGhcbiAgICBsZW5ndGggKG51bWJlcikgbGVuZ3RoIG9mIHRoZSBwYXRoIHRvIHRoZSBwb2ludFxuICAgIGRpc3RhbmNlIChudW1iZXIpIGRpc3RhbmNlIGZyb20gdGhlIGdpdmVuIHBvaW50IHRvIHRoZSBwYXRoXG4gfVxuXFwqL1xuLy8gQ29waWVkIGZyb20gaHR0cDovL2JsLm9ja3Mub3JnL21ib3N0b2NrLzgwMjc2MzdcblNuYXAuY2xvc2VzdFBvaW50ID0gZnVuY3Rpb24gKHBhdGgsIHgsIHkpIHtcbiAgICBmdW5jdGlvbiBkaXN0YW5jZTIocCkge1xuICAgICAgICB2YXIgZHggPSBwLnggLSB4LFxuICAgICAgICAgICAgZHkgPSBwLnkgLSB5O1xuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG4gICAgfVxuICAgIHZhciBwYXRoTm9kZSA9IHBhdGgubm9kZSxcbiAgICAgICAgcGF0aExlbmd0aCA9IHBhdGhOb2RlLmdldFRvdGFsTGVuZ3RoKCksXG4gICAgICAgIHByZWNpc2lvbiA9IHBhdGhMZW5ndGggLyBwYXRoTm9kZS5wYXRoU2VnTGlzdC5udW1iZXJPZkl0ZW1zICogLjEyNSxcbiAgICAgICAgYmVzdCxcbiAgICAgICAgYmVzdExlbmd0aCxcbiAgICAgICAgYmVzdERpc3RhbmNlID0gSW5maW5pdHk7XG5cbiAgICAvLyBsaW5lYXIgc2NhbiBmb3IgY29hcnNlIGFwcHJveGltYXRpb25cbiAgICBmb3IgKHZhciBzY2FuLCBzY2FuTGVuZ3RoID0gMCwgc2NhbkRpc3RhbmNlOyBzY2FuTGVuZ3RoIDw9IHBhdGhMZW5ndGg7IHNjYW5MZW5ndGggKz0gcHJlY2lzaW9uKSB7XG4gICAgICAgIGlmICgoc2NhbkRpc3RhbmNlID0gZGlzdGFuY2UyKHNjYW4gPSBwYXRoTm9kZS5nZXRQb2ludEF0TGVuZ3RoKHNjYW5MZW5ndGgpKSkgPCBiZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIGJlc3QgPSBzY2FuO1xuICAgICAgICAgICAgYmVzdExlbmd0aCA9IHNjYW5MZW5ndGg7XG4gICAgICAgICAgICBiZXN0RGlzdGFuY2UgPSBzY2FuRGlzdGFuY2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBiaW5hcnkgc2VhcmNoIGZvciBwcmVjaXNlIGVzdGltYXRlXG4gICAgcHJlY2lzaW9uICo9IC41O1xuICAgIHdoaWxlIChwcmVjaXNpb24gPiAuNSkge1xuICAgICAgICB2YXIgYmVmb3JlLFxuICAgICAgICAgICAgYWZ0ZXIsXG4gICAgICAgICAgICBiZWZvcmVMZW5ndGgsXG4gICAgICAgICAgICBhZnRlckxlbmd0aCxcbiAgICAgICAgICAgIGJlZm9yZURpc3RhbmNlLFxuICAgICAgICAgICAgYWZ0ZXJEaXN0YW5jZTtcbiAgICAgICAgaWYgKChiZWZvcmVMZW5ndGggPSBiZXN0TGVuZ3RoIC0gcHJlY2lzaW9uKSA+PSAwICYmIChiZWZvcmVEaXN0YW5jZSA9IGRpc3RhbmNlMihiZWZvcmUgPSBwYXRoTm9kZS5nZXRQb2ludEF0TGVuZ3RoKGJlZm9yZUxlbmd0aCkpKSA8IGJlc3REaXN0YW5jZSkge1xuICAgICAgICAgICAgYmVzdCA9IGJlZm9yZTtcbiAgICAgICAgICAgIGJlc3RMZW5ndGggPSBiZWZvcmVMZW5ndGg7XG4gICAgICAgICAgICBiZXN0RGlzdGFuY2UgPSBiZWZvcmVEaXN0YW5jZTtcbiAgICAgICAgfSBlbHNlIGlmICgoYWZ0ZXJMZW5ndGggPSBiZXN0TGVuZ3RoICsgcHJlY2lzaW9uKSA8PSBwYXRoTGVuZ3RoICYmIChhZnRlckRpc3RhbmNlID0gZGlzdGFuY2UyKGFmdGVyID0gcGF0aE5vZGUuZ2V0UG9pbnRBdExlbmd0aChhZnRlckxlbmd0aCkpKSA8IGJlc3REaXN0YW5jZSkge1xuICAgICAgICAgICAgYmVzdCA9IGFmdGVyO1xuICAgICAgICAgICAgYmVzdExlbmd0aCA9IGFmdGVyTGVuZ3RoO1xuICAgICAgICAgICAgYmVzdERpc3RhbmNlID0gYWZ0ZXJEaXN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiAqPSAuNTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJlc3QgPSB7XG4gICAgICAgIHg6IGJlc3QueCxcbiAgICAgICAgeTogYmVzdC55LFxuICAgICAgICBsZW5ndGg6IGJlc3RMZW5ndGgsXG4gICAgICAgIGRpc3RhbmNlOiBNYXRoLnNxcnQoYmVzdERpc3RhbmNlKVxuICAgIH07XG4gICAgcmV0dXJuIGJlc3Q7XG59XG4vKlxcXG4gKiBTbmFwLmlzXG4gWyBtZXRob2QgXVxuICoqXG4gKiBIYW5keSByZXBsYWNlbWVudCBmb3IgdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gLSBvICjigKYpIGFueSBvYmplY3Qgb3IgcHJpbWl0aXZlXG4gLSB0eXBlIChzdHJpbmcpIG5hbWUgb2YgdGhlIHR5cGUsIGUuZy4sIGBzdHJpbmdgLCBgZnVuY3Rpb25gLCBgbnVtYmVyYCwgZXRjLlxuID0gKGJvb2xlYW4pIGB0cnVlYCBpZiBnaXZlbiB2YWx1ZSBpcyBvZiBnaXZlbiB0eXBlXG5cXCovXG5TbmFwLmlzID0gaXM7XG4vKlxcXG4gKiBTbmFwLnNuYXBUb1xuIFsgbWV0aG9kIF1cbiAqKlxuICogU25hcHMgZ2l2ZW4gdmFsdWUgdG8gZ2l2ZW4gZ3JpZFxuIC0gdmFsdWVzIChhcnJheXxudW1iZXIpIGdpdmVuIGFycmF5IG9mIHZhbHVlcyBvciBzdGVwIG9mIHRoZSBncmlkXG4gLSB2YWx1ZSAobnVtYmVyKSB2YWx1ZSB0byBhZGp1c3RcbiAtIHRvbGVyYW5jZSAobnVtYmVyKSAjb3B0aW9uYWwgbWF4aW11bSBkaXN0YW5jZSB0byB0aGUgdGFyZ2V0IHZhbHVlIHRoYXQgd291bGQgdHJpZ2dlciB0aGUgc25hcC4gRGVmYXVsdCBpcyBgMTBgLlxuID0gKG51bWJlcikgYWRqdXN0ZWQgdmFsdWVcblxcKi9cblNuYXAuc25hcFRvID0gZnVuY3Rpb24gKHZhbHVlcywgdmFsdWUsIHRvbGVyYW5jZSkge1xuICAgIHRvbGVyYW5jZSA9IGlzKHRvbGVyYW5jZSwgXCJmaW5pdGVcIikgPyB0b2xlcmFuY2UgOiAxMDtcbiAgICBpZiAoaXModmFsdWVzLCBcImFycmF5XCIpKSB7XG4gICAgICAgIHZhciBpID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkgaWYgKGFicyh2YWx1ZXNbaV0gLSB2YWx1ZSkgPD0gdG9sZXJhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzW2ldO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzID0gK3ZhbHVlcztcbiAgICAgICAgdmFyIHJlbSA9IHZhbHVlICUgdmFsdWVzO1xuICAgICAgICBpZiAocmVtIDwgdG9sZXJhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgLSByZW07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbSA+IHZhbHVlcyAtIHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIC0gcmVtICsgdmFsdWVzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn07XG4vLyBDb2xvdXJcbi8qXFxcbiAqIFNuYXAuZ2V0UkdCXG4gWyBtZXRob2QgXVxuICoqXG4gKiBQYXJzZXMgY29sb3Igc3RyaW5nIGFzIFJHQiBvYmplY3RcbiAtIGNvbG9yIChzdHJpbmcpIGNvbG9yIHN0cmluZyBpbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXRzOlxuICMgPHVsPlxuICMgICAgIDxsaT5Db2xvciBuYW1lICg8Y29kZT5yZWQ8L2NvZGU+LCA8Y29kZT5ncmVlbjwvY29kZT4sIDxjb2RlPmNvcm5mbG93ZXJibHVlPC9jb2RlPiwgZXRjKTwvbGk+XG4gIyAgICAgPGxpPiPigKLigKLigKIg4oCUIHNob3J0ZW5lZCBIVE1MIGNvbG9yOiAoPGNvZGU+IzAwMDwvY29kZT4sIDxjb2RlPiNmYzA8L2NvZGU+LCBldGMuKTwvbGk+XG4gIyAgICAgPGxpPiPigKLigKLigKLigKLigKLigKIg4oCUIGZ1bGwgbGVuZ3RoIEhUTUwgY29sb3I6ICg8Y29kZT4jMDAwMDAwPC9jb2RlPiwgPGNvZGU+I2JkMjMwMDwvY29kZT4pPC9saT5cbiAjICAgICA8bGk+cmdiKOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIpIOKAlCByZWQsIGdyZWVuIGFuZCBibHVlIGNoYW5uZWxzIHZhbHVlczogKDxjb2RlPnJnYigyMDAsJm5ic3A7MTAwLCZuYnNwOzApPC9jb2RlPik8L2xpPlxuICMgICAgIDxsaT5yZ2JhKOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIsIOKAouKAouKAoikg4oCUIGFsc28gd2l0aCBvcGFjaXR5PC9saT5cbiAjICAgICA8bGk+cmdiKOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUpIOKAlCBzYW1lIGFzIGFib3ZlLCBidXQgaW4gJTogKDxjb2RlPnJnYigxMDAlLCZuYnNwOzE3NSUsJm5ic3A7MCUpPC9jb2RlPik8L2xpPlxuICMgICAgIDxsaT5yZ2JhKOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyAgICAgPGxpPmhzYijigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiKSDigJQgaHVlLCBzYXR1cmF0aW9uIGFuZCBicmlnaHRuZXNzIHZhbHVlczogKDxjb2RlPmhzYigwLjUsJm5ic3A7MC4yNSwmbmJzcDsxKTwvY29kZT4pPC9saT5cbiAjICAgICA8bGk+aHNiYSjigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyAgICAgPGxpPmhzYijigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlKSDigJQgc2FtZSBhcyBhYm92ZSwgYnV0IGluICU8L2xpPlxuICMgICAgIDxsaT5oc2JhKOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyAgICAgPGxpPmhzbCjigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiKSDigJQgaHVlLCBzYXR1cmF0aW9uIGFuZCBsdW1pbm9zaXR5IHZhbHVlczogKDxjb2RlPmhzYigwLjUsJm5ic3A7MC4yNSwmbmJzcDswLjUpPC9jb2RlPik8L2xpPlxuICMgICAgIDxsaT5oc2xhKOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIsIOKAouKAouKAoikg4oCUIGFsc28gd2l0aCBvcGFjaXR5PC9saT5cbiAjICAgICA8bGk+aHNsKOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUpIOKAlCBzYW1lIGFzIGFib3ZlLCBidXQgaW4gJTwvbGk+XG4gIyAgICAgPGxpPmhzbGEo4oCi4oCi4oCiJSwg4oCi4oCi4oCiJSwg4oCi4oCi4oCiJSwg4oCi4oCi4oCiJSkg4oCUIGFsc28gd2l0aCBvcGFjaXR5PC9saT5cbiAjIDwvdWw+XG4gKiBOb3RlIHRoYXQgYCVgIGNhbiBiZSB1c2VkIGFueSB0aW1lOiBgcmdiKDIwJSwgMjU1LCA1MCUpYC5cbiA9IChvYmplY3QpIFJHQiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgciAobnVtYmVyKSByZWQsXG4gbyAgICAgZyAobnVtYmVyKSBncmVlbixcbiBvICAgICBiIChudW1iZXIpIGJsdWUsXG4gbyAgICAgaGV4IChzdHJpbmcpIGNvbG9yIGluIEhUTUwvQ1NTIGZvcm1hdDogI+KAouKAouKAouKAouKAouKAoixcbiBvICAgICBlcnJvciAoYm9vbGVhbikgdHJ1ZSBpZiBzdHJpbmcgY2FuJ3QgYmUgcGFyc2VkXG4gbyB9XG5cXCovXG5TbmFwLmdldFJHQiA9IGNhY2hlcihmdW5jdGlvbiAoY29sb3VyKSB7XG4gICAgaWYgKCFjb2xvdXIgfHwgISEoKGNvbG91ciA9IFN0cihjb2xvdXIpKS5pbmRleE9mKFwiLVwiKSArIDEpKSB7XG4gICAgICAgIHJldHVybiB7cjogLTEsIGc6IC0xLCBiOiAtMSwgaGV4OiBcIm5vbmVcIiwgZXJyb3I6IDEsIHRvU3RyaW5nOiByZ2J0b1N0cmluZ307XG4gICAgfVxuICAgIGlmIChjb2xvdXIgPT0gXCJub25lXCIpIHtcbiAgICAgICAgcmV0dXJuIHtyOiAtMSwgZzogLTEsIGI6IC0xLCBoZXg6IFwibm9uZVwiLCB0b1N0cmluZzogcmdidG9TdHJpbmd9O1xuICAgIH1cbiAgICAhKGhzcmdbaGFzXShjb2xvdXIudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMCwgMikpIHx8IGNvbG91ci5jaGFyQXQoKSA9PSBcIiNcIikgJiYgKGNvbG91ciA9IHRvSGV4KGNvbG91cikpO1xuICAgIGlmICghY29sb3VyKSB7XG4gICAgICAgIHJldHVybiB7cjogLTEsIGc6IC0xLCBiOiAtMSwgaGV4OiBcIm5vbmVcIiwgZXJyb3I6IDEsIHRvU3RyaW5nOiByZ2J0b1N0cmluZ307XG4gICAgfVxuICAgIHZhciByZXMsXG4gICAgICAgIHJlZCxcbiAgICAgICAgZ3JlZW4sXG4gICAgICAgIGJsdWUsXG4gICAgICAgIG9wYWNpdHksXG4gICAgICAgIHQsXG4gICAgICAgIHZhbHVlcyxcbiAgICAgICAgcmdiID0gY29sb3VyLm1hdGNoKGNvbG91clJlZ0V4cCk7XG4gICAgaWYgKHJnYikge1xuICAgICAgICBpZiAocmdiWzJdKSB7XG4gICAgICAgICAgICBibHVlID0gdG9JbnQocmdiWzJdLnN1YnN0cmluZyg1KSwgMTYpO1xuICAgICAgICAgICAgZ3JlZW4gPSB0b0ludChyZ2JbMl0uc3Vic3RyaW5nKDMsIDUpLCAxNik7XG4gICAgICAgICAgICByZWQgPSB0b0ludChyZ2JbMl0uc3Vic3RyaW5nKDEsIDMpLCAxNik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJnYlszXSkge1xuICAgICAgICAgICAgYmx1ZSA9IHRvSW50KCh0ID0gcmdiWzNdLmNoYXJBdCgzKSkgKyB0LCAxNik7XG4gICAgICAgICAgICBncmVlbiA9IHRvSW50KCh0ID0gcmdiWzNdLmNoYXJBdCgyKSkgKyB0LCAxNik7XG4gICAgICAgICAgICByZWQgPSB0b0ludCgodCA9IHJnYlszXS5jaGFyQXQoMSkpICsgdCwgMTYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZ2JbNF0pIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHJnYls0XS5zcGxpdChjb21tYVNwYWNlcyk7XG4gICAgICAgICAgICByZWQgPSB0b0Zsb2F0KHZhbHVlc1swXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMF0uc2xpY2UoLTEpID09IFwiJVwiICYmIChyZWQgKj0gMi41NSk7XG4gICAgICAgICAgICBncmVlbiA9IHRvRmxvYXQodmFsdWVzWzFdKTtcbiAgICAgICAgICAgIHZhbHVlc1sxXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKGdyZWVuICo9IDIuNTUpO1xuICAgICAgICAgICAgYmx1ZSA9IHRvRmxvYXQodmFsdWVzWzJdKTtcbiAgICAgICAgICAgIHZhbHVlc1syXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKGJsdWUgKj0gMi41NSk7XG4gICAgICAgICAgICByZ2JbMV0udG9Mb3dlckNhc2UoKS5zbGljZSgwLCA0KSA9PSBcInJnYmFcIiAmJiAob3BhY2l0eSA9IHRvRmxvYXQodmFsdWVzWzNdKSk7XG4gICAgICAgICAgICB2YWx1ZXNbM10gJiYgdmFsdWVzWzNdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAob3BhY2l0eSAvPSAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZ2JbNV0pIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHJnYls1XS5zcGxpdChjb21tYVNwYWNlcyk7XG4gICAgICAgICAgICByZWQgPSB0b0Zsb2F0KHZhbHVlc1swXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMF0uc2xpY2UoLTEpID09IFwiJVwiICYmIChyZWQgLz0gMTAwKTtcbiAgICAgICAgICAgIGdyZWVuID0gdG9GbG9hdCh2YWx1ZXNbMV0pO1xuICAgICAgICAgICAgdmFsdWVzWzFdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAoZ3JlZW4gLz0gMTAwKTtcbiAgICAgICAgICAgIGJsdWUgPSB0b0Zsb2F0KHZhbHVlc1syXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMl0uc2xpY2UoLTEpID09IFwiJVwiICYmIChibHVlIC89IDEwMCk7XG4gICAgICAgICAgICAodmFsdWVzWzBdLnNsaWNlKC0zKSA9PSBcImRlZ1wiIHx8IHZhbHVlc1swXS5zbGljZSgtMSkgPT0gXCJcXHhiMFwiKSAmJiAocmVkIC89IDM2MCk7XG4gICAgICAgICAgICByZ2JbMV0udG9Mb3dlckNhc2UoKS5zbGljZSgwLCA0KSA9PSBcImhzYmFcIiAmJiAob3BhY2l0eSA9IHRvRmxvYXQodmFsdWVzWzNdKSk7XG4gICAgICAgICAgICB2YWx1ZXNbM10gJiYgdmFsdWVzWzNdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAob3BhY2l0eSAvPSAxMDApO1xuICAgICAgICAgICAgcmV0dXJuIFNuYXAuaHNiMnJnYihyZWQsIGdyZWVuLCBibHVlLCBvcGFjaXR5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmdiWzZdKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSByZ2JbNl0uc3BsaXQoY29tbWFTcGFjZXMpO1xuICAgICAgICAgICAgcmVkID0gdG9GbG9hdCh2YWx1ZXNbMF0pO1xuICAgICAgICAgICAgdmFsdWVzWzBdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAocmVkIC89IDEwMCk7XG4gICAgICAgICAgICBncmVlbiA9IHRvRmxvYXQodmFsdWVzWzFdKTtcbiAgICAgICAgICAgIHZhbHVlc1sxXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKGdyZWVuIC89IDEwMCk7XG4gICAgICAgICAgICBibHVlID0gdG9GbG9hdCh2YWx1ZXNbMl0pO1xuICAgICAgICAgICAgdmFsdWVzWzJdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAoYmx1ZSAvPSAxMDApO1xuICAgICAgICAgICAgKHZhbHVlc1swXS5zbGljZSgtMykgPT0gXCJkZWdcIiB8fCB2YWx1ZXNbMF0uc2xpY2UoLTEpID09IFwiXFx4YjBcIikgJiYgKHJlZCAvPSAzNjApO1xuICAgICAgICAgICAgcmdiWzFdLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgNCkgPT0gXCJoc2xhXCIgJiYgKG9wYWNpdHkgPSB0b0Zsb2F0KHZhbHVlc1szXSkpO1xuICAgICAgICAgICAgdmFsdWVzWzNdICYmIHZhbHVlc1szXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKG9wYWNpdHkgLz0gMTAwKTtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmhzbDJyZ2IocmVkLCBncmVlbiwgYmx1ZSwgb3BhY2l0eSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVkID0gbW1pbihtYXRoLnJvdW5kKHJlZCksIDI1NSk7XG4gICAgICAgIGdyZWVuID0gbW1pbihtYXRoLnJvdW5kKGdyZWVuKSwgMjU1KTtcbiAgICAgICAgYmx1ZSA9IG1taW4obWF0aC5yb3VuZChibHVlKSwgMjU1KTtcbiAgICAgICAgb3BhY2l0eSA9IG1taW4obW1heChvcGFjaXR5LCAwKSwgMSk7XG4gICAgICAgIHJnYiA9IHtyOiByZWQsIGc6IGdyZWVuLCBiOiBibHVlLCB0b1N0cmluZzogcmdidG9TdHJpbmd9O1xuICAgICAgICByZ2IuaGV4ID0gXCIjXCIgKyAoMTY3NzcyMTYgfCBibHVlIHwgZ3JlZW4gPDwgOCB8IHJlZCA8PCAxNikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xuICAgICAgICByZ2Iub3BhY2l0eSA9IGlzKG9wYWNpdHksIFwiZmluaXRlXCIpID8gb3BhY2l0eSA6IDE7XG4gICAgICAgIHJldHVybiByZ2I7XG4gICAgfVxuICAgIHJldHVybiB7cjogLTEsIGc6IC0xLCBiOiAtMSwgaGV4OiBcIm5vbmVcIiwgZXJyb3I6IDEsIHRvU3RyaW5nOiByZ2J0b1N0cmluZ307XG59LCBTbmFwKTtcbi8qXFxcbiAqIFNuYXAuaHNiXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDb252ZXJ0cyBIU0IgdmFsdWVzIHRvIGEgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xvclxuIC0gaCAobnVtYmVyKSBodWVcbiAtIHMgKG51bWJlcikgc2F0dXJhdGlvblxuIC0gYiAobnVtYmVyKSB2YWx1ZSBvciBicmlnaHRuZXNzXG4gPSAoc3RyaW5nKSBoZXggcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbG9yXG5cXCovXG5TbmFwLmhzYiA9IGNhY2hlcihmdW5jdGlvbiAoaCwgcywgYikge1xuICAgIHJldHVybiBTbmFwLmhzYjJyZ2IoaCwgcywgYikuaGV4O1xufSk7XG4vKlxcXG4gKiBTbmFwLmhzbFxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgSFNMIHZhbHVlcyB0byBhIGhleCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29sb3JcbiAtIGggKG51bWJlcikgaHVlXG4gLSBzIChudW1iZXIpIHNhdHVyYXRpb25cbiAtIGwgKG51bWJlcikgbHVtaW5vc2l0eVxuID0gKHN0cmluZykgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xvclxuXFwqL1xuU25hcC5oc2wgPSBjYWNoZXIoZnVuY3Rpb24gKGgsIHMsIGwpIHtcbiAgICByZXR1cm4gU25hcC5oc2wycmdiKGgsIHMsIGwpLmhleDtcbn0pO1xuLypcXFxuICogU25hcC5yZ2JcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENvbnZlcnRzIFJHQiB2YWx1ZXMgdG8gYSBoZXggcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbG9yXG4gLSByIChudW1iZXIpIHJlZFxuIC0gZyAobnVtYmVyKSBncmVlblxuIC0gYiAobnVtYmVyKSBibHVlXG4gPSAoc3RyaW5nKSBoZXggcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbG9yXG5cXCovXG5TbmFwLnJnYiA9IGNhY2hlcihmdW5jdGlvbiAociwgZywgYiwgbykge1xuICAgIGlmIChpcyhvLCBcImZpbml0ZVwiKSkge1xuICAgICAgICB2YXIgcm91bmQgPSBtYXRoLnJvdW5kO1xuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgW3JvdW5kKHIpLCByb3VuZChnKSwgcm91bmQoYiksICtvLnRvRml4ZWQoMildICsgXCIpXCI7XG4gICAgfVxuICAgIHJldHVybiBcIiNcIiArICgxNjc3NzIxNiB8IGIgfCBnIDw8IDggfCByIDw8IDE2KS50b1N0cmluZygxNikuc2xpY2UoMSk7XG59KTtcbnZhciB0b0hleCA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgIHZhciBpID0gZ2xvYi5kb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdIHx8IGdsb2IuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3ZnXCIpWzBdLFxuICAgICAgICByZWQgPSBcInJnYigyNTUsIDAsIDApXCI7XG4gICAgdG9IZXggPSBjYWNoZXIoZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiByZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaS5zdHlsZS5jb2xvciA9IHJlZDtcbiAgICAgICAgaS5zdHlsZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICB2YXIgb3V0ID0gZ2xvYi5kb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShpLCBFKS5nZXRQcm9wZXJ0eVZhbHVlKFwiY29sb3JcIik7XG4gICAgICAgIHJldHVybiBvdXQgPT0gcmVkID8gbnVsbCA6IG91dDtcbiAgICB9KTtcbiAgICByZXR1cm4gdG9IZXgoY29sb3IpO1xufSxcbmhzYnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImhzYihcIiArIFt0aGlzLmgsIHRoaXMucywgdGhpcy5iXSArIFwiKVwiO1xufSxcbmhzbHRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcImhzbChcIiArIFt0aGlzLmgsIHRoaXMucywgdGhpcy5sXSArIFwiKVwiO1xufSxcbnJnYnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm9wYWNpdHkgPT0gMSB8fCB0aGlzLm9wYWNpdHkgPT0gbnVsbCA/XG4gICAgICAgICAgICB0aGlzLmhleCA6XG4gICAgICAgICAgICBcInJnYmEoXCIgKyBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5vcGFjaXR5XSArIFwiKVwiO1xufSxcbnByZXBhcmVSR0IgPSBmdW5jdGlvbiAociwgZywgYikge1xuICAgIGlmIChnID09IG51bGwgJiYgaXMociwgXCJvYmplY3RcIikgJiYgXCJyXCIgaW4gciAmJiBcImdcIiBpbiByICYmIFwiYlwiIGluIHIpIHtcbiAgICAgICAgYiA9IHIuYjtcbiAgICAgICAgZyA9IHIuZztcbiAgICAgICAgciA9IHIucjtcbiAgICB9XG4gICAgaWYgKGcgPT0gbnVsbCAmJiBpcyhyLCBzdHJpbmcpKSB7XG4gICAgICAgIHZhciBjbHIgPSBTbmFwLmdldFJHQihyKTtcbiAgICAgICAgciA9IGNsci5yO1xuICAgICAgICBnID0gY2xyLmc7XG4gICAgICAgIGIgPSBjbHIuYjtcbiAgICB9XG4gICAgaWYgKHIgPiAxIHx8IGcgPiAxIHx8IGIgPiAxKSB7XG4gICAgICAgIHIgLz0gMjU1O1xuICAgICAgICBnIC89IDI1NTtcbiAgICAgICAgYiAvPSAyNTU7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtyLCBnLCBiXTtcbn0sXG5wYWNrYWdlUkdCID0gZnVuY3Rpb24gKHIsIGcsIGIsIG8pIHtcbiAgICByID0gbWF0aC5yb3VuZChyICogMjU1KTtcbiAgICBnID0gbWF0aC5yb3VuZChnICogMjU1KTtcbiAgICBiID0gbWF0aC5yb3VuZChiICogMjU1KTtcbiAgICB2YXIgcmdiID0ge1xuICAgICAgICByOiByLFxuICAgICAgICBnOiBnLFxuICAgICAgICBiOiBiLFxuICAgICAgICBvcGFjaXR5OiBpcyhvLCBcImZpbml0ZVwiKSA/IG8gOiAxLFxuICAgICAgICBoZXg6IFNuYXAucmdiKHIsIGcsIGIpLFxuICAgICAgICB0b1N0cmluZzogcmdidG9TdHJpbmdcbiAgICB9O1xuICAgIGlzKG8sIFwiZmluaXRlXCIpICYmIChyZ2Iub3BhY2l0eSA9IG8pO1xuICAgIHJldHVybiByZ2I7XG59O1xuLypcXFxuICogU25hcC5jb2xvclxuIFsgbWV0aG9kIF1cbiAqKlxuICogUGFyc2VzIHRoZSBjb2xvciBzdHJpbmcgYW5kIHJldHVybnMgYW4gb2JqZWN0IGZlYXR1cmluZyB0aGUgY29sb3IncyBjb21wb25lbnQgdmFsdWVzXG4gLSBjbHIgKHN0cmluZykgY29sb3Igc3RyaW5nIGluIG9uZSBvZiB0aGUgc3VwcG9ydGVkIGZvcm1hdHMgKHNlZSBAU25hcC5nZXRSR0IpXG4gPSAob2JqZWN0KSBDb21iaW5lZCBSR0IvSFNCIG9iamVjdCBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiBvIHtcbiBvICAgICByIChudW1iZXIpIHJlZCxcbiBvICAgICBnIChudW1iZXIpIGdyZWVuLFxuIG8gICAgIGIgKG51bWJlcikgYmx1ZSxcbiBvICAgICBoZXggKHN0cmluZykgY29sb3IgaW4gSFRNTC9DU1MgZm9ybWF0OiAj4oCi4oCi4oCi4oCi4oCi4oCiLFxuIG8gICAgIGVycm9yIChib29sZWFuKSBgdHJ1ZWAgaWYgc3RyaW5nIGNhbid0IGJlIHBhcnNlZCxcbiBvICAgICBoIChudW1iZXIpIGh1ZSxcbiBvICAgICBzIChudW1iZXIpIHNhdHVyYXRpb24sXG4gbyAgICAgdiAobnVtYmVyKSB2YWx1ZSAoYnJpZ2h0bmVzcyksXG4gbyAgICAgbCAobnVtYmVyKSBsaWdodG5lc3NcbiBvIH1cblxcKi9cblNuYXAuY29sb3IgPSBmdW5jdGlvbiAoY2xyKSB7XG4gICAgdmFyIHJnYjtcbiAgICBpZiAoaXMoY2xyLCBcIm9iamVjdFwiKSAmJiBcImhcIiBpbiBjbHIgJiYgXCJzXCIgaW4gY2xyICYmIFwiYlwiIGluIGNscikge1xuICAgICAgICByZ2IgPSBTbmFwLmhzYjJyZ2IoY2xyKTtcbiAgICAgICAgY2xyLnIgPSByZ2IucjtcbiAgICAgICAgY2xyLmcgPSByZ2IuZztcbiAgICAgICAgY2xyLmIgPSByZ2IuYjtcbiAgICAgICAgY2xyLm9wYWNpdHkgPSAxO1xuICAgICAgICBjbHIuaGV4ID0gcmdiLmhleDtcbiAgICB9IGVsc2UgaWYgKGlzKGNsciwgXCJvYmplY3RcIikgJiYgXCJoXCIgaW4gY2xyICYmIFwic1wiIGluIGNsciAmJiBcImxcIiBpbiBjbHIpIHtcbiAgICAgICAgcmdiID0gU25hcC5oc2wycmdiKGNscik7XG4gICAgICAgIGNsci5yID0gcmdiLnI7XG4gICAgICAgIGNsci5nID0gcmdiLmc7XG4gICAgICAgIGNsci5iID0gcmdiLmI7XG4gICAgICAgIGNsci5vcGFjaXR5ID0gMTtcbiAgICAgICAgY2xyLmhleCA9IHJnYi5oZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzKGNsciwgXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgIGNsciA9IFNuYXAuZ2V0UkdCKGNscik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzKGNsciwgXCJvYmplY3RcIikgJiYgXCJyXCIgaW4gY2xyICYmIFwiZ1wiIGluIGNsciAmJiBcImJcIiBpbiBjbHIgJiYgIShcImVycm9yXCIgaW4gY2xyKSkge1xuICAgICAgICAgICAgcmdiID0gU25hcC5yZ2IyaHNsKGNscik7XG4gICAgICAgICAgICBjbHIuaCA9IHJnYi5oO1xuICAgICAgICAgICAgY2xyLnMgPSByZ2IucztcbiAgICAgICAgICAgIGNsci5sID0gcmdiLmw7XG4gICAgICAgICAgICByZ2IgPSBTbmFwLnJnYjJoc2IoY2xyKTtcbiAgICAgICAgICAgIGNsci52ID0gcmdiLmI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbHIgPSB7aGV4OiBcIm5vbmVcIn07XG4gICAgICAgICAgICBjbHIuciA9IGNsci5nID0gY2xyLmIgPSBjbHIuaCA9IGNsci5zID0gY2xyLnYgPSBjbHIubCA9IC0xO1xuICAgICAgICAgICAgY2xyLmVycm9yID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbHIudG9TdHJpbmcgPSByZ2J0b1N0cmluZztcbiAgICByZXR1cm4gY2xyO1xufTtcbi8qXFxcbiAqIFNuYXAuaHNiMnJnYlxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgSFNCIHZhbHVlcyB0byBhbiBSR0Igb2JqZWN0XG4gLSBoIChudW1iZXIpIGh1ZVxuIC0gcyAobnVtYmVyKSBzYXR1cmF0aW9uXG4gLSB2IChudW1iZXIpIHZhbHVlIG9yIGJyaWdodG5lc3NcbiA9IChvYmplY3QpIFJHQiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgciAobnVtYmVyKSByZWQsXG4gbyAgICAgZyAobnVtYmVyKSBncmVlbixcbiBvICAgICBiIChudW1iZXIpIGJsdWUsXG4gbyAgICAgaGV4IChzdHJpbmcpIGNvbG9yIGluIEhUTUwvQ1NTIGZvcm1hdDogI+KAouKAouKAouKAouKAouKAolxuIG8gfVxuXFwqL1xuU25hcC5oc2IycmdiID0gZnVuY3Rpb24gKGgsIHMsIHYsIG8pIHtcbiAgICBpZiAoaXMoaCwgXCJvYmplY3RcIikgJiYgXCJoXCIgaW4gaCAmJiBcInNcIiBpbiBoICYmIFwiYlwiIGluIGgpIHtcbiAgICAgICAgdiA9IGguYjtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgbyA9IGgubztcbiAgICAgICAgaCA9IGguaDtcbiAgICB9XG4gICAgaCAqPSAzNjA7XG4gICAgdmFyIFIsIEcsIEIsIFgsIEM7XG4gICAgaCA9IGggJSAzNjAgLyA2MDtcbiAgICBDID0gdiAqIHM7XG4gICAgWCA9IEMgKiAoMSAtIGFicyhoICUgMiAtIDEpKTtcbiAgICBSID0gRyA9IEIgPSB2IC0gQztcblxuICAgIGggPSB+fmg7XG4gICAgUiArPSBbQywgWCwgMCwgMCwgWCwgQ11baF07XG4gICAgRyArPSBbWCwgQywgQywgWCwgMCwgMF1baF07XG4gICAgQiArPSBbMCwgMCwgWCwgQywgQywgWF1baF07XG4gICAgcmV0dXJuIHBhY2thZ2VSR0IoUiwgRywgQiwgbyk7XG59O1xuLypcXFxuICogU25hcC5oc2wycmdiXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDb252ZXJ0cyBIU0wgdmFsdWVzIHRvIGFuIFJHQiBvYmplY3RcbiAtIGggKG51bWJlcikgaHVlXG4gLSBzIChudW1iZXIpIHNhdHVyYXRpb25cbiAtIGwgKG51bWJlcikgbHVtaW5vc2l0eVxuID0gKG9iamVjdCkgUkdCIG9iamVjdCBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiBvIHtcbiBvICAgICByIChudW1iZXIpIHJlZCxcbiBvICAgICBnIChudW1iZXIpIGdyZWVuLFxuIG8gICAgIGIgKG51bWJlcikgYmx1ZSxcbiBvICAgICBoZXggKHN0cmluZykgY29sb3IgaW4gSFRNTC9DU1MgZm9ybWF0OiAj4oCi4oCi4oCi4oCi4oCi4oCiXG4gbyB9XG5cXCovXG5TbmFwLmhzbDJyZ2IgPSBmdW5jdGlvbiAoaCwgcywgbCwgbykge1xuICAgIGlmIChpcyhoLCBcIm9iamVjdFwiKSAmJiBcImhcIiBpbiBoICYmIFwic1wiIGluIGggJiYgXCJsXCIgaW4gaCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBzID0gaC5zO1xuICAgICAgICBoID0gaC5oO1xuICAgIH1cbiAgICBpZiAoaCA+IDEgfHwgcyA+IDEgfHwgbCA+IDEpIHtcbiAgICAgICAgaCAvPSAzNjA7XG4gICAgICAgIHMgLz0gMTAwO1xuICAgICAgICBsIC89IDEwMDtcbiAgICB9XG4gICAgaCAqPSAzNjA7XG4gICAgdmFyIFIsIEcsIEIsIFgsIEM7XG4gICAgaCA9IGggJSAzNjAgLyA2MDtcbiAgICBDID0gMiAqIHMgKiAobCA8IC41ID8gbCA6IDEgLSBsKTtcbiAgICBYID0gQyAqICgxIC0gYWJzKGggJSAyIC0gMSkpO1xuICAgIFIgPSBHID0gQiA9IGwgLSBDIC8gMjtcblxuICAgIGggPSB+fmg7XG4gICAgUiArPSBbQywgWCwgMCwgMCwgWCwgQ11baF07XG4gICAgRyArPSBbWCwgQywgQywgWCwgMCwgMF1baF07XG4gICAgQiArPSBbMCwgMCwgWCwgQywgQywgWF1baF07XG4gICAgcmV0dXJuIHBhY2thZ2VSR0IoUiwgRywgQiwgbyk7XG59O1xuLypcXFxuICogU25hcC5yZ2IyaHNiXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDb252ZXJ0cyBSR0IgdmFsdWVzIHRvIGFuIEhTQiBvYmplY3RcbiAtIHIgKG51bWJlcikgcmVkXG4gLSBnIChudW1iZXIpIGdyZWVuXG4gLSBiIChudW1iZXIpIGJsdWVcbiA9IChvYmplY3QpIEhTQiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgaCAobnVtYmVyKSBodWUsXG4gbyAgICAgcyAobnVtYmVyKSBzYXR1cmF0aW9uLFxuIG8gICAgIGIgKG51bWJlcikgYnJpZ2h0bmVzc1xuIG8gfVxuXFwqL1xuU25hcC5yZ2IyaHNiID0gZnVuY3Rpb24gKHIsIGcsIGIpIHtcbiAgICBiID0gcHJlcGFyZVJHQihyLCBnLCBiKTtcbiAgICByID0gYlswXTtcbiAgICBnID0gYlsxXTtcbiAgICBiID0gYlsyXTtcblxuICAgIHZhciBILCBTLCBWLCBDO1xuICAgIFYgPSBtbWF4KHIsIGcsIGIpO1xuICAgIEMgPSBWIC0gbW1pbihyLCBnLCBiKTtcbiAgICBIID0gQyA9PSAwID8gbnVsbCA6XG4gICAgICAgIFYgPT0gciA/IChnIC0gYikgLyBDIDpcbiAgICAgICAgViA9PSBnID8gKGIgLSByKSAvIEMgKyAyIDpcbiAgICAgICAgICAgICAgICAgKHIgLSBnKSAvIEMgKyA0O1xuICAgIEggPSAoSCArIDM2MCkgJSA2ICogNjAgLyAzNjA7XG4gICAgUyA9IEMgPT0gMCA/IDAgOiBDIC8gVjtcbiAgICByZXR1cm4ge2g6IEgsIHM6IFMsIGI6IFYsIHRvU3RyaW5nOiBoc2J0b1N0cmluZ307XG59O1xuLypcXFxuICogU25hcC5yZ2IyaHNsXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDb252ZXJ0cyBSR0IgdmFsdWVzIHRvIGFuIEhTTCBvYmplY3RcbiAtIHIgKG51bWJlcikgcmVkXG4gLSBnIChudW1iZXIpIGdyZWVuXG4gLSBiIChudW1iZXIpIGJsdWVcbiA9IChvYmplY3QpIEhTTCBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgaCAobnVtYmVyKSBodWUsXG4gbyAgICAgcyAobnVtYmVyKSBzYXR1cmF0aW9uLFxuIG8gICAgIGwgKG51bWJlcikgbHVtaW5vc2l0eVxuIG8gfVxuXFwqL1xuU25hcC5yZ2IyaHNsID0gZnVuY3Rpb24gKHIsIGcsIGIpIHtcbiAgICBiID0gcHJlcGFyZVJHQihyLCBnLCBiKTtcbiAgICByID0gYlswXTtcbiAgICBnID0gYlsxXTtcbiAgICBiID0gYlsyXTtcblxuICAgIHZhciBILCBTLCBMLCBNLCBtLCBDO1xuICAgIE0gPSBtbWF4KHIsIGcsIGIpO1xuICAgIG0gPSBtbWluKHIsIGcsIGIpO1xuICAgIEMgPSBNIC0gbTtcbiAgICBIID0gQyA9PSAwID8gbnVsbCA6XG4gICAgICAgIE0gPT0gciA/IChnIC0gYikgLyBDIDpcbiAgICAgICAgTSA9PSBnID8gKGIgLSByKSAvIEMgKyAyIDpcbiAgICAgICAgICAgICAgICAgKHIgLSBnKSAvIEMgKyA0O1xuICAgIEggPSAoSCArIDM2MCkgJSA2ICogNjAgLyAzNjA7XG4gICAgTCA9IChNICsgbSkgLyAyO1xuICAgIFMgPSBDID09IDAgPyAwIDpcbiAgICAgICAgIEwgPCAuNSA/IEMgLyAoMiAqIEwpIDpcbiAgICAgICAgICAgICAgICAgIEMgLyAoMiAtIDIgKiBMKTtcbiAgICByZXR1cm4ge2g6IEgsIHM6IFMsIGw6IEwsIHRvU3RyaW5nOiBoc2x0b1N0cmluZ307XG59O1xuXG4vLyBUcmFuc2Zvcm1hdGlvbnNcbi8qXFxcbiAqIFNuYXAucGFyc2VQYXRoU3RyaW5nXG4gWyBtZXRob2QgXVxuICoqXG4gKiBVdGlsaXR5IG1ldGhvZFxuICoqXG4gKiBQYXJzZXMgZ2l2ZW4gcGF0aCBzdHJpbmcgaW50byBhbiBhcnJheSBvZiBhcnJheXMgb2YgcGF0aCBzZWdtZW50c1xuIC0gcGF0aFN0cmluZyAoc3RyaW5nfGFycmF5KSBwYXRoIHN0cmluZyBvciBhcnJheSBvZiBzZWdtZW50cyAoaW4gdGhlIGxhc3QgY2FzZSBpdCBpcyByZXR1cm5lZCBzdHJhaWdodCBhd2F5KVxuID0gKGFycmF5KSBhcnJheSBvZiBzZWdtZW50c1xuXFwqL1xuU25hcC5wYXJzZVBhdGhTdHJpbmcgPSBmdW5jdGlvbiAocGF0aFN0cmluZykge1xuICAgIGlmICghcGF0aFN0cmluZykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHB0aCA9IFNuYXAucGF0aChwYXRoU3RyaW5nKTtcbiAgICBpZiAocHRoLmFycikge1xuICAgICAgICByZXR1cm4gU25hcC5wYXRoLmNsb25lKHB0aC5hcnIpO1xuICAgIH1cblxuICAgIHZhciBwYXJhbUNvdW50cyA9IHthOiA3LCBjOiA2LCBvOiAyLCBoOiAxLCBsOiAyLCBtOiAyLCByOiA0LCBxOiA0LCBzOiA0LCB0OiAyLCB2OiAxLCB1OiAzLCB6OiAwfSxcbiAgICAgICAgZGF0YSA9IFtdO1xuICAgIGlmIChpcyhwYXRoU3RyaW5nLCBcImFycmF5XCIpICYmIGlzKHBhdGhTdHJpbmdbMF0sIFwiYXJyYXlcIikpIHsgLy8gcm91Z2ggYXNzdW1wdGlvblxuICAgICAgICBkYXRhID0gU25hcC5wYXRoLmNsb25lKHBhdGhTdHJpbmcpO1xuICAgIH1cbiAgICBpZiAoIWRhdGEubGVuZ3RoKSB7XG4gICAgICAgIFN0cihwYXRoU3RyaW5nKS5yZXBsYWNlKHBhdGhDb21tYW5kLCBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdLFxuICAgICAgICAgICAgICAgIG5hbWUgPSBiLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjLnJlcGxhY2UocGF0aFZhbHVlcywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBiICYmIHBhcmFtcy5wdXNoKCtiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJtXCIgJiYgcGFyYW1zLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goW2JdLmNvbmNhdChwYXJhbXMuc3BsaWNlKDAsIDIpKSk7XG4gICAgICAgICAgICAgICAgbmFtZSA9IFwibFwiO1xuICAgICAgICAgICAgICAgIGIgPSBiID09IFwibVwiID8gXCJsXCIgOiBcIkxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuYW1lID09IFwib1wiICYmIHBhcmFtcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChbYiwgcGFyYW1zWzBdXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcInJcIikge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChbYl0uY29uY2F0KHBhcmFtcykpO1xuICAgICAgICAgICAgfSBlbHNlIHdoaWxlIChwYXJhbXMubGVuZ3RoID49IHBhcmFtQ291bnRzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKFtiXS5jb25jYXQocGFyYW1zLnNwbGljZSgwLCBwYXJhbUNvdW50c1tuYW1lXSkpKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmFtQ291bnRzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRhdGEudG9TdHJpbmcgPSBTbmFwLnBhdGgudG9TdHJpbmc7XG4gICAgcHRoLmFyciA9IFNuYXAucGF0aC5jbG9uZShkYXRhKTtcbiAgICByZXR1cm4gZGF0YTtcbn07XG4vKlxcXG4gKiBTbmFwLnBhcnNlVHJhbnNmb3JtU3RyaW5nXG4gWyBtZXRob2QgXVxuICoqXG4gKiBVdGlsaXR5IG1ldGhvZFxuICoqXG4gKiBQYXJzZXMgZ2l2ZW4gdHJhbnNmb3JtIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIHRyYW5zZm9ybWF0aW9uc1xuIC0gVFN0cmluZyAoc3RyaW5nfGFycmF5KSB0cmFuc2Zvcm0gc3RyaW5nIG9yIGFycmF5IG9mIHRyYW5zZm9ybWF0aW9ucyAoaW4gdGhlIGxhc3QgY2FzZSBpdCBpcyByZXR1cm5lZCBzdHJhaWdodCBhd2F5KVxuID0gKGFycmF5KSBhcnJheSBvZiB0cmFuc2Zvcm1hdGlvbnNcblxcKi9cbnZhciBwYXJzZVRyYW5zZm9ybVN0cmluZyA9IFNuYXAucGFyc2VUcmFuc2Zvcm1TdHJpbmcgPSBmdW5jdGlvbiAoVFN0cmluZykge1xuICAgIGlmICghVFN0cmluZykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHBhcmFtQ291bnRzID0ge3I6IDMsIHM6IDQsIHQ6IDIsIG06IDZ9LFxuICAgICAgICBkYXRhID0gW107XG4gICAgaWYgKGlzKFRTdHJpbmcsIFwiYXJyYXlcIikgJiYgaXMoVFN0cmluZ1swXSwgXCJhcnJheVwiKSkgeyAvLyByb3VnaCBhc3N1bXB0aW9uXG4gICAgICAgIGRhdGEgPSBTbmFwLnBhdGguY2xvbmUoVFN0cmluZyk7XG4gICAgfVxuICAgIGlmICghZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgU3RyKFRTdHJpbmcpLnJlcGxhY2UodENvbW1hbmQsIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gW10sXG4gICAgICAgICAgICAgICAgbmFtZSA9IGIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGMucmVwbGFjZShwYXRoVmFsdWVzLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIGIgJiYgcGFyYW1zLnB1c2goK2IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLnB1c2goW2JdLmNvbmNhdChwYXJhbXMpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRhdGEudG9TdHJpbmcgPSBTbmFwLnBhdGgudG9TdHJpbmc7XG4gICAgcmV0dXJuIGRhdGE7XG59O1xuZnVuY3Rpb24gc3ZnVHJhbnNmb3JtMnN0cmluZyh0c3RyKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHRzdHIgPSB0c3RyLnJlcGxhY2UoLyg/Ol58XFxzKShcXHcrKVxcKChbXildKylcXCkvZywgZnVuY3Rpb24gKGFsbCwgbmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zcGxpdCgvXFxzKixcXHMqfFxccysvKTtcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyb3RhdGVcIiAmJiBwYXJhbXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKDAsIDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwic2NhbGVcIikge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLnNsaWNlKDAsIDIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChwYXJhbXNbMF0sIDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwic2tld1hcIikge1xuICAgICAgICAgICAgcmVzLnB1c2goW1wibVwiLCAxLCAwLCBtYXRoLnRhbihyYWQocGFyYW1zWzBdKSksIDEsIDAsIDBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lID09IFwic2tld1lcIikge1xuICAgICAgICAgICAgcmVzLnB1c2goW1wibVwiLCAxLCBtYXRoLnRhbihyYWQocGFyYW1zWzBdKSksIDAsIDEsIDAsIDBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtuYW1lLmNoYXJBdCgwKV0uY29uY2F0KHBhcmFtcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbn1cblNuYXAuXy5zdmdUcmFuc2Zvcm0yc3RyaW5nID0gc3ZnVHJhbnNmb3JtMnN0cmluZztcblNuYXAuXy5yZ1RyYW5zZm9ybSA9IC9eW2Etel1bXFxzXSotP1xcLj9cXGQvaTtcbmZ1bmN0aW9uIHRyYW5zZm9ybTJtYXRyaXgodHN0ciwgYmJveCkge1xuICAgIHZhciB0ZGF0YSA9IHBhcnNlVHJhbnNmb3JtU3RyaW5nKHRzdHIpLFxuICAgICAgICBtID0gbmV3IFNuYXAuTWF0cml4O1xuICAgIGlmICh0ZGF0YSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0ZGF0YS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRkYXRhW2ldLFxuICAgICAgICAgICAgICAgIHRsZW4gPSB0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gU3RyKHRbMF0pLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgYWJzb2x1dGUgPSB0WzBdICE9IGNvbW1hbmQsXG4gICAgICAgICAgICAgICAgaW52ZXIgPSBhYnNvbHV0ZSA/IG0uaW52ZXJ0KCkgOiAwLFxuICAgICAgICAgICAgICAgIHgxLFxuICAgICAgICAgICAgICAgIHkxLFxuICAgICAgICAgICAgICAgIHgyLFxuICAgICAgICAgICAgICAgIHkyLFxuICAgICAgICAgICAgICAgIGJiO1xuICAgICAgICAgICAgaWYgKGNvbW1hbmQgPT0gXCJ0XCIgJiYgdGxlbiA9PSAyKXtcbiAgICAgICAgICAgICAgICBtLnRyYW5zbGF0ZSh0WzFdLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PSBcInRcIiAmJiB0bGVuID09IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgeDEgPSBpbnZlci54KDAsIDApO1xuICAgICAgICAgICAgICAgICAgICB5MSA9IGludmVyLnkoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHgyID0gaW52ZXIueCh0WzFdLCB0WzJdKTtcbiAgICAgICAgICAgICAgICAgICAgeTIgPSBpbnZlci55KHRbMV0sIHRbMl0pO1xuICAgICAgICAgICAgICAgICAgICBtLnRyYW5zbGF0ZSh4MiAtIHgxLCB5MiAtIHkxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtLnRyYW5zbGF0ZSh0WzFdLCB0WzJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGxlbiA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGJiID0gYmIgfHwgYmJveDtcbiAgICAgICAgICAgICAgICAgICAgbS5yb3RhdGUodFsxXSwgYmIueCArIGJiLndpZHRoIC8gMiwgYmIueSArIGJiLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGxlbiA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBpbnZlci54KHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBpbnZlci55KHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5yb3RhdGUodFsxXSwgeDIsIHkyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0ucm90YXRlKHRbMV0sIHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kID09IFwic1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRsZW4gPT0gMiB8fCB0bGVuID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgYmIgPSBiYiB8fCBiYm94O1xuICAgICAgICAgICAgICAgICAgICBtLnNjYWxlKHRbMV0sIHRbdGxlbiAtIDFdLCBiYi54ICsgYmIud2lkdGggLyAyLCBiYi55ICsgYmIuaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0bGVuID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGludmVyLngodFsyXSwgdFszXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGludmVyLnkodFsyXSwgdFszXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtLnNjYWxlKHRbMV0sIHRbMV0sIHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtLnNjYWxlKHRbMV0sIHRbMV0sIHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0bGVuID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGludmVyLngodFszXSwgdFs0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGludmVyLnkodFszXSwgdFs0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtLnNjYWxlKHRbMV0sIHRbMl0sIHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtLnNjYWxlKHRbMV0sIHRbMl0sIHRbM10sIHRbNF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kID09IFwibVwiICYmIHRsZW4gPT0gNykge1xuICAgICAgICAgICAgICAgIG0uYWRkKHRbMV0sIHRbMl0sIHRbM10sIHRbNF0sIHRbNV0sIHRbNl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtO1xufVxuU25hcC5fLnRyYW5zZm9ybTJtYXRyaXggPSB0cmFuc2Zvcm0ybWF0cml4O1xuU25hcC5fdW5pdDJweCA9IHVuaXQycHg7XG52YXIgY29udGFpbnMgPSBnbG9iLmRvYy5jb250YWlucyB8fCBnbG9iLmRvYy5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/XG4gICAgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgdmFyIGFkb3duID0gYS5ub2RlVHlwZSA9PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuICAgICAgICAgICAgYnVwID0gYiAmJiBiLnBhcmVudE5vZGU7XG4gICAgICAgICAgICByZXR1cm4gYSA9PSBidXAgfHwgISEoYnVwICYmIGJ1cC5ub2RlVHlwZSA9PSAxICYmIChcbiAgICAgICAgICAgICAgICBhZG93bi5jb250YWlucyA/XG4gICAgICAgICAgICAgICAgICAgIGFkb3duLmNvbnRhaW5zKGJ1cCkgOlxuICAgICAgICAgICAgICAgICAgICBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYnVwKSAmIDE2XG4gICAgICAgICAgICApKTtcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoYikge1xuICAgICAgICAgICAgd2hpbGUgKGIpIHtcbiAgICAgICAgICAgICAgICBiID0gYi5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmIChiID09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuZnVuY3Rpb24gZ2V0U29tZURlZnMoZWwpIHtcbiAgICB2YXIgcCA9IGVsLm5vZGUub3duZXJTVkdFbGVtZW50ICYmIHdyYXAoZWwubm9kZS5vd25lclNWR0VsZW1lbnQpIHx8XG4gICAgICAgICAgICBlbC5ub2RlLnBhcmVudE5vZGUgJiYgd3JhcChlbC5ub2RlLnBhcmVudE5vZGUpIHx8XG4gICAgICAgICAgICBTbmFwLnNlbGVjdChcInN2Z1wiKSB8fFxuICAgICAgICAgICAgU25hcCgwLCAwKSxcbiAgICAgICAgcGRlZnMgPSBwLnNlbGVjdChcImRlZnNcIiksXG4gICAgICAgIGRlZnMgID0gcGRlZnMgPT0gbnVsbCA/IGZhbHNlIDogcGRlZnMubm9kZTtcbiAgICBpZiAoIWRlZnMpIHtcbiAgICAgICAgZGVmcyA9IG1ha2UoXCJkZWZzXCIsIHAubm9kZSkubm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZnM7XG59XG5mdW5jdGlvbiBnZXRTb21lU1ZHKGVsKSB7XG4gICAgcmV0dXJuIGVsLm5vZGUub3duZXJTVkdFbGVtZW50ICYmIHdyYXAoZWwubm9kZS5vd25lclNWR0VsZW1lbnQpIHx8IFNuYXAuc2VsZWN0KFwic3ZnXCIpO1xufVxuU25hcC5fLmdldFNvbWVEZWZzID0gZ2V0U29tZURlZnM7XG5TbmFwLl8uZ2V0U29tZVNWRyA9IGdldFNvbWVTVkc7XG5mdW5jdGlvbiB1bml0MnB4KGVsLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzdmcgPSBnZXRTb21lU1ZHKGVsKS5ub2RlLFxuICAgICAgICBvdXQgPSB7fSxcbiAgICAgICAgbWdyID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoXCIuc3ZnLS0tbWdyXCIpO1xuICAgIGlmICghbWdyKSB7XG4gICAgICAgIG1nciA9ICQoXCJyZWN0XCIpO1xuICAgICAgICAkKG1nciwge3g6IC05ZTksIHk6IC05ZTksIHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgXCJjbGFzc1wiOiBcInN2Zy0tLW1nclwiLCBmaWxsOiBcIm5vbmVcIn0pO1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQobWdyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Vyh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsID09ICt2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgJChtZ3IsIHt3aWR0aDogdmFsfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWdyLmdldEJCb3goKS53aWR0aDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SCh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsID09ICt2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgJChtZ3IsIHtoZWlnaHQ6IHZhbH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1nci5nZXRCQm94KCkuaGVpZ2h0O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzZXQobmFtLCBmKSB7XG4gICAgICAgIGlmIChuYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgIG91dFtuYW1dID0gZihlbC5hdHRyKG5hbSkgfHwgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtID09IG5hbWUpIHtcbiAgICAgICAgICAgIG91dCA9IGYodmFsdWUgPT0gbnVsbCA/IGVsLmF0dHIobmFtKSB8fCAwIDogdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN3aXRjaCAoZWwudHlwZSkge1xuICAgICAgICBjYXNlIFwicmVjdFwiOlxuICAgICAgICAgICAgc2V0KFwicnhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJyeVwiLCBnZXRIKTtcbiAgICAgICAgY2FzZSBcImltYWdlXCI6XG4gICAgICAgICAgICBzZXQoXCJ3aWR0aFwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcImhlaWdodFwiLCBnZXRIKTtcbiAgICAgICAgY2FzZSBcInRleHRcIjpcbiAgICAgICAgICAgIHNldChcInhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJ5XCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgICAgICAgc2V0KFwiY3hcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJjeVwiLCBnZXRIKTtcbiAgICAgICAgICAgIHNldChcInJcIiwgZ2V0Vyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZWxsaXBzZVwiOlxuICAgICAgICAgICAgc2V0KFwiY3hcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJjeVwiLCBnZXRIKTtcbiAgICAgICAgICAgIHNldChcInJ4XCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwicnlcIiwgZ2V0SCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGluZVwiOlxuICAgICAgICAgICAgc2V0KFwieDFcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJ4MlwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcInkxXCIsIGdldEgpO1xuICAgICAgICAgICAgc2V0KFwieTJcIiwgZ2V0SCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFya2VyXCI6XG4gICAgICAgICAgICBzZXQoXCJyZWZYXCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwibWFya2VyV2lkdGhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJyZWZZXCIsIGdldEgpO1xuICAgICAgICAgICAgc2V0KFwibWFya2VySGVpZ2h0XCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJhZGlhbEdyYWRpZW50XCI6XG4gICAgICAgICAgICBzZXQoXCJmeFwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcImZ5XCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRzcGFuXCI6XG4gICAgICAgICAgICBzZXQoXCJkeFwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcImR5XCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNldChuYW1lLCBnZXRXKTtcbiAgICB9XG4gICAgc3ZnLnJlbW92ZUNoaWxkKG1ncik7XG4gICAgcmV0dXJuIG91dDtcbn1cbi8qXFxcbiAqIFNuYXAuc2VsZWN0XG4gWyBtZXRob2QgXVxuICoqXG4gKiBXcmFwcyBhIERPTSBlbGVtZW50IHNwZWNpZmllZCBieSBDU1Mgc2VsZWN0b3IgYXMgQEVsZW1lbnRcbiAtIHF1ZXJ5IChzdHJpbmcpIENTUyBzZWxlY3RvciBvZiB0aGUgZWxlbWVudFxuID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcblxcKi9cblNuYXAuc2VsZWN0ID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSBTdHIocXVlcnkpLnJlcGxhY2UoLyhbXlxcXFxdKTovZywgXCIkMVxcXFw6XCIpO1xuICAgIHJldHVybiB3cmFwKGdsb2IuZG9jLnF1ZXJ5U2VsZWN0b3IocXVlcnkpKTtcbn07XG4vKlxcXG4gKiBTbmFwLnNlbGVjdEFsbFxuIFsgbWV0aG9kIF1cbiAqKlxuICogV3JhcHMgRE9NIGVsZW1lbnRzIHNwZWNpZmllZCBieSBDU1Mgc2VsZWN0b3IgYXMgc2V0IG9yIGFycmF5IG9mIEBFbGVtZW50XG4gLSBxdWVyeSAoc3RyaW5nKSBDU1Mgc2VsZWN0b3Igb2YgdGhlIGVsZW1lbnRcbiA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG5cXCovXG5TbmFwLnNlbGVjdEFsbCA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgIHZhciBub2RlbGlzdCA9IGdsb2IuZG9jLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLFxuICAgICAgICBzZXQgPSAoU25hcC5zZXQgfHwgQXJyYXkpKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzZXQucHVzaCh3cmFwKG5vZGVsaXN0W2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBzZXQ7XG59O1xuXG5mdW5jdGlvbiBhZGQyZ3JvdXAobGlzdCkge1xuICAgIGlmICghaXMobGlzdCwgXCJhcnJheVwiKSkge1xuICAgICAgICBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICB9XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgbm9kZSA9IHRoaXMubm9kZTtcbiAgICB3aGlsZSAodGhpc1tpXSkgZGVsZXRlIHRoaXNbaSsrXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobGlzdFtpXS50eXBlID09IFwic2V0XCIpIHtcbiAgICAgICAgICAgIGxpc3RbaV0uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGVsLm5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGxpc3RbaV0ubm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZE5vZGVzO1xuICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzW2orK10gPSB3cmFwKGNoaWxkcmVuW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG4vLyBIdWIgZ2FyYmFnZSBjb2xsZWN0b3IgZXZlcnkgMTBzXG5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGh1YikgaWYgKGh1YltoYXNdKGtleSkpIHtcbiAgICAgICAgdmFyIGVsID0gaHViW2tleV0sXG4gICAgICAgICAgICBub2RlID0gZWwubm9kZTtcbiAgICAgICAgaWYgKGVsLnR5cGUgIT0gXCJzdmdcIiAmJiAhbm9kZS5vd25lclNWR0VsZW1lbnQgfHwgZWwudHlwZSA9PSBcInN2Z1wiICYmICghbm9kZS5wYXJlbnROb2RlIHx8IFwib3duZXJTVkdFbGVtZW50XCIgaW4gbm9kZS5wYXJlbnROb2RlICYmICFub2RlLm93bmVyU1ZHRWxlbWVudCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBodWJba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbn0sIDFlNCk7XG5mdW5jdGlvbiBFbGVtZW50KGVsKSB7XG4gICAgaWYgKGVsLnNuYXAgaW4gaHViKSB7XG4gICAgICAgIHJldHVybiBodWJbZWwuc25hcF07XG4gICAgfVxuICAgIHZhciBzdmc7XG4gICAgdHJ5IHtcbiAgICAgICAgc3ZnID0gZWwub3duZXJTVkdFbGVtZW50O1xuICAgIH0gY2F0Y2goZSkge31cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5ub2RlXG4gICAgIFsgcHJvcGVydHkgKG9iamVjdCkgXVxuICAgICAqKlxuICAgICAqIEdpdmVzIHlvdSBhIHJlZmVyZW5jZSB0byB0aGUgRE9NIG9iamVjdCwgc28geW91IGNhbiBhc3NpZ24gZXZlbnQgaGFuZGxlcnMgb3IganVzdCBtZXNzIGFyb3VuZC5cbiAgICAgPiBVc2FnZVxuICAgICB8IC8vIGRyYXcgYSBjaXJjbGUgYXQgY29vcmRpbmF0ZSAxMCwxMCB3aXRoIHJhZGl1cyBvZiAxMFxuICAgICB8IHZhciBjID0gcGFwZXIuY2lyY2xlKDEwLCAxMCwgMTApO1xuICAgICB8IGMubm9kZS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICB8ICAgICBjLmF0dHIoXCJmaWxsXCIsIFwicmVkXCIpO1xuICAgICB8IH07XG4gICAgXFwqL1xuICAgIHRoaXMubm9kZSA9IGVsO1xuICAgIGlmIChzdmcpIHtcbiAgICAgICAgdGhpcy5wYXBlciA9IG5ldyBQYXBlcihzdmcpO1xuICAgIH1cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50eXBlXG4gICAgIFsgcHJvcGVydHkgKHN0cmluZykgXVxuICAgICAqKlxuICAgICAqIFNWRyB0YWcgbmFtZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICBcXCovXG4gICAgdGhpcy50eXBlID0gZWwudGFnTmFtZSB8fCBlbC5ub2RlTmFtZTtcbiAgICB2YXIgaWQgPSB0aGlzLmlkID0gSUQodGhpcyk7XG4gICAgdGhpcy5hbmltcyA9IHt9O1xuICAgIHRoaXMuXyA9IHtcbiAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgIH07XG4gICAgZWwuc25hcCA9IGlkO1xuICAgIGh1YltpZF0gPSB0aGlzO1xuICAgIGlmICh0aGlzLnR5cGUgPT0gXCJnXCIpIHtcbiAgICAgICAgdGhpcy5hZGQgPSBhZGQyZ3JvdXA7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgaW4ge2c6IDEsIG1hc2s6IDEsIHBhdHRlcm46IDEsIHN5bWJvbDogMX0pIHtcbiAgICAgICAgZm9yICh2YXIgbWV0aG9kIGluIFBhcGVyLnByb3RvdHlwZSkgaWYgKFBhcGVyLnByb3RvdHlwZVtoYXNdKG1ldGhvZCkpIHtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kXSA9IFBhcGVyLnByb3RvdHlwZVttZXRob2RdO1xuICAgICAgICB9XG4gICAgfVxufVxuICAgLypcXFxuICAgICAqIEVsZW1lbnQuYXR0clxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogR2V0cyBvciBzZXRzIGdpdmVuIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnQuXG4gICAgICoqXG4gICAgIC0gcGFyYW1zIChvYmplY3QpIGNvbnRhaW5zIGtleS12YWx1ZSBwYWlycyBvZiBhdHRyaWJ1dGVzIHlvdSB3YW50IHRvIHNldFxuICAgICAqIG9yXG4gICAgIC0gcGFyYW0gKHN0cmluZykgbmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICAgID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICAgKiBvclxuICAgICA9IChzdHJpbmcpIHZhbHVlIG9mIGF0dHJpYnV0ZVxuICAgICA+IFVzYWdlXG4gICAgIHwgZWwuYXR0cih7XG4gICAgIHwgICAgIGZpbGw6IFwiI2ZjMFwiLFxuICAgICB8ICAgICBzdHJva2U6IFwiIzAwMFwiLFxuICAgICB8ICAgICBzdHJva2VXaWR0aDogMiwgLy8gQ2FtZWxDYXNlLi4uXG4gICAgIHwgICAgIFwiZmlsbC1vcGFjaXR5XCI6IDAuNSwgLy8gb3IgZGFzaC1zZXBhcmF0ZWQgbmFtZXNcbiAgICAgfCAgICAgd2lkdGg6IFwiKj0yXCIgLy8gcHJlZml4ZWQgdmFsdWVzXG4gICAgIHwgfSk7XG4gICAgIHwgY29uc29sZS5sb2coZWwuYXR0cihcImZpbGxcIikpOyAvLyAjZmMwXG4gICAgICogUHJlZml4ZWQgdmFsdWVzIGluIGZvcm1hdCBgXCIrPTEwXCJgIHN1cHBvcnRlZC4gQWxsIGZvdXIgb3BlcmF0aW9uc1xuICAgICAqIChgK2AsIGAtYCwgYCpgIGFuZCBgL2ApIGNvdWxkIGJlIHVzZWQuIE9wdGlvbmFsbHkgeW91IGNhbiB1c2UgdW5pdHMgZm9yIGArYFxuICAgICAqIGFuZCBgLWA6IGBcIis9MmVtXCJgLlxuICAgIFxcKi9cbiAgICBFbGVtZW50LnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKHBhcmFtcywgdmFsdWUpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcyxcbiAgICAgICAgICAgIG5vZGUgPSBlbC5ub2RlO1xuICAgICAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IG5vZGUubm9kZVZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIG91dCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYXR0ci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0W2F0dHJbaV0ubm9kZU5hbWVdID0gYXR0cltpXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpcyhwYXJhbXMsIFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIganNvbiA9IHt9O1xuICAgICAgICAgICAgICAgIGpzb25bcGFyYW1zXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IGpzb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBldmUoXCJzbmFwLnV0aWwuZ2V0YXR0ci5cIiArIHBhcmFtcywgZWwpLmZpcnN0RGVmaW5lZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGF0dCBpbiBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbaGFzXShhdHQpKSB7XG4gICAgICAgICAgICAgICAgZXZlKFwic25hcC51dGlsLmF0dHIuXCIgKyBhdHQsIGVsLCBwYXJhbXNbYXR0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4vKlxcXG4gKiBTbmFwLnBhcnNlXG4gWyBtZXRob2QgXVxuICoqXG4gKiBQYXJzZXMgU1ZHIGZyYWdtZW50IGFuZCBjb252ZXJ0cyBpdCBpbnRvIGEgQEZyYWdtZW50XG4gKipcbiAtIHN2ZyAoc3RyaW5nKSBTVkcgc3RyaW5nXG4gPSAoRnJhZ21lbnQpIHRoZSBARnJhZ21lbnRcblxcKi9cblNuYXAucGFyc2UgPSBmdW5jdGlvbiAoc3ZnKSB7XG4gICAgdmFyIGYgPSBnbG9iLmRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIGZ1bGwgPSB0cnVlLFxuICAgICAgICBkaXYgPSBnbG9iLmRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHN2ZyA9IFN0cihzdmcpO1xuICAgIGlmICghc3ZnLm1hdGNoKC9eXFxzKjxcXHMqc3ZnKD86XFxzfD4pLykpIHtcbiAgICAgICAgc3ZnID0gXCI8c3ZnPlwiICsgc3ZnICsgXCI8L3N2Zz5cIjtcbiAgICAgICAgZnVsbCA9IGZhbHNlO1xuICAgIH1cbiAgICBkaXYuaW5uZXJIVE1MID0gc3ZnO1xuICAgIHN2ZyA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN2Z1wiKVswXTtcbiAgICBpZiAoc3ZnKSB7XG4gICAgICAgIGlmIChmdWxsKSB7XG4gICAgICAgICAgICBmID0gc3ZnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKHN2Zy5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgZi5hcHBlbmRDaGlsZChzdmcuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGcmFnbWVudChmKTtcbn07XG5mdW5jdGlvbiBGcmFnbWVudChmcmFnKSB7XG4gICAgdGhpcy5ub2RlID0gZnJhZztcbn1cbi8qXFxcbiAqIFNuYXAuZnJhZ21lbnRcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENyZWF0ZXMgYSBET00gZnJhZ21lbnQgZnJvbSBhIGdpdmVuIGxpc3Qgb2YgZWxlbWVudHMgb3Igc3RyaW5nc1xuICoqXG4gLSB2YXJhcmdzICjigKYpIFNWRyBzdHJpbmdcbiA9IChGcmFnbWVudCkgdGhlIEBGcmFnbWVudFxuXFwqL1xuU25hcC5mcmFnbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCksXG4gICAgICAgIGYgPSBnbG9iLmRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYXJncy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gYXJnc1tpXTtcbiAgICAgICAgaWYgKGl0ZW0ubm9kZSAmJiBpdGVtLm5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGYuYXBwZW5kQ2hpbGQoaXRlbS5ub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgZi5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZi5hcHBlbmRDaGlsZChTbmFwLnBhcnNlKGl0ZW0pLm5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgRnJhZ21lbnQoZik7XG59O1xuXG5mdW5jdGlvbiBtYWtlKG5hbWUsIHBhcmVudCkge1xuICAgIHZhciByZXMgPSAkKG5hbWUpO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChyZXMpO1xuICAgIHZhciBlbCA9IHdyYXAocmVzKTtcbiAgICByZXR1cm4gZWw7XG59XG5mdW5jdGlvbiBQYXBlcih3LCBoKSB7XG4gICAgdmFyIHJlcyxcbiAgICAgICAgZGVzYyxcbiAgICAgICAgZGVmcyxcbiAgICAgICAgcHJvdG8gPSBQYXBlci5wcm90b3R5cGU7XG4gICAgaWYgKHcgJiYgdy50YWdOYW1lICYmIHcudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwic3ZnXCIpIHtcbiAgICAgICAgaWYgKHcuc25hcCBpbiBodWIpIHtcbiAgICAgICAgICAgIHJldHVybiBodWJbdy5zbmFwXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZG9jID0gdy5vd25lckRvY3VtZW50O1xuICAgICAgICByZXMgPSBuZXcgRWxlbWVudCh3KTtcbiAgICAgICAgZGVzYyA9IHcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZXNjXCIpWzBdO1xuICAgICAgICBkZWZzID0gdy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRlZnNcIilbMF07XG4gICAgICAgIGlmICghZGVzYykge1xuICAgICAgICAgICAgZGVzYyA9ICQoXCJkZXNjXCIpO1xuICAgICAgICAgICAgZGVzYy5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUoXCJDcmVhdGVkIHdpdGggU25hcFwiKSk7XG4gICAgICAgICAgICByZXMubm9kZS5hcHBlbmRDaGlsZChkZXNjKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlZnMpIHtcbiAgICAgICAgICAgIGRlZnMgPSAkKFwiZGVmc1wiKTtcbiAgICAgICAgICAgIHJlcy5ub2RlLmFwcGVuZENoaWxkKGRlZnMpO1xuICAgICAgICB9XG4gICAgICAgIHJlcy5kZWZzID0gZGVmcztcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3RvKSBpZiAocHJvdG9baGFzXShrZXkpKSB7XG4gICAgICAgICAgICByZXNba2V5XSA9IHByb3RvW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnBhcGVyID0gcmVzLnJvb3QgPSByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzID0gbWFrZShcInN2Z1wiLCBnbG9iLmRvYy5ib2R5KTtcbiAgICAgICAgJChyZXMubm9kZSwge1xuICAgICAgICAgICAgaGVpZ2h0OiBoLFxuICAgICAgICAgICAgdmVyc2lvbjogMS4xLFxuICAgICAgICAgICAgd2lkdGg6IHcsXG4gICAgICAgICAgICB4bWxuczogeG1sbnNcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiB3cmFwKGRvbSkge1xuICAgIGlmICghZG9tKSB7XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGlmIChkb20gaW5zdGFuY2VvZiBFbGVtZW50IHx8IGRvbSBpbnN0YW5jZW9mIEZyYWdtZW50KSB7XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGlmIChkb20udGFnTmFtZSAmJiBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwic3ZnXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXBlcihkb20pO1xuICAgIH1cbiAgICBpZiAoZG9tLnRhZ05hbWUgJiYgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcIm9iamVjdFwiICYmIGRvbS50eXBlID09IFwiaW1hZ2Uvc3ZnK3htbFwiKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXIoZG9tLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN2Z1wiKVswXSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRWxlbWVudChkb20pO1xufVxuXG5TbmFwLl8ubWFrZSA9IG1ha2U7XG5TbmFwLl8ud3JhcCA9IHdyYXA7XG4vKlxcXG4gKiBQYXBlci5lbFxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ3JlYXRlcyBhbiBlbGVtZW50IG9uIHBhcGVyIHdpdGggYSBnaXZlbiBuYW1lIGFuZCBubyBhdHRyaWJ1dGVzXG4gKipcbiAtIG5hbWUgKHN0cmluZykgdGFnIG5hbWVcbiAtIGF0dHIgKG9iamVjdCkgYXR0cmlidXRlc1xuID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcbiA+IFVzYWdlXG4gfCB2YXIgYyA9IHBhcGVyLmNpcmNsZSgxMCwgMTAsIDEwKTsgLy8gaXMgdGhlIHNhbWUgYXMuLi5cbiB8IHZhciBjID0gcGFwZXIuZWwoXCJjaXJjbGVcIikuYXR0cih7XG4gfCAgICAgY3g6IDEwLFxuIHwgICAgIGN5OiAxMCxcbiB8ICAgICByOiAxMFxuIHwgfSk7XG4gfCAvLyBhbmQgdGhlIHNhbWUgYXNcbiB8IHZhciBjID0gcGFwZXIuZWwoXCJjaXJjbGVcIiwge1xuIHwgICAgIGN4OiAxMCxcbiB8ICAgICBjeTogMTAsXG4gfCAgICAgcjogMTBcbiB8IH0pO1xuXFwqL1xuUGFwZXIucHJvdG90eXBlLmVsID0gZnVuY3Rpb24gKG5hbWUsIGF0dHIpIHtcbiAgICB2YXIgZWwgPSBtYWtlKG5hbWUsIHRoaXMubm9kZSk7XG4gICAgYXR0ciAmJiBlbC5hdHRyKGF0dHIpO1xuICAgIHJldHVybiBlbDtcbn07XG4vKlxcXG4gKiBFbGVtZW50LmNoaWxkcmVuXG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXR1cm5zIGFycmF5IG9mIGFsbCB0aGUgY2hpbGRyZW4gb2YgdGhlIGVsZW1lbnQuXG4gPSAoYXJyYXkpIGFycmF5IG9mIEVsZW1lbnRzXG5cXCovXG5FbGVtZW50LnByb3RvdHlwZS5jaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3V0ID0gW10sXG4gICAgICAgIGNoID0gdGhpcy5ub2RlLmNoaWxkTm9kZXM7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gY2gubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICBvdXRbaV0gPSBTbmFwKGNoW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG5mdW5jdGlvbiBqc29uRmlsbGVyKHJvb3QsIG8pIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSByb290Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogcm9vdFtpXS50eXBlLFxuICAgICAgICAgICAgICAgIGF0dHI6IHJvb3RbaV0uYXR0cigpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hpbGRyZW4gPSByb290W2ldLmNoaWxkcmVuKCk7XG4gICAgICAgIG8ucHVzaChpdGVtKTtcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAganNvbkZpbGxlcihjaGlsZHJlbiwgaXRlbS5jaGlsZE5vZGVzID0gW10pO1xuICAgICAgICB9XG4gICAgfVxufVxuLypcXFxuICogRWxlbWVudC50b0pTT05cbiBbIG1ldGhvZCBdXG4gKipcbiAqIFJldHVybnMgb2JqZWN0IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBlbGVtZW50IGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuID0gKG9iamVjdCkgaW4gZm9ybWF0XG4gbyB7XG4gbyAgICAgdHlwZSAoc3RyaW5nKSB0aGlzLnR5cGUsXG4gbyAgICAgYXR0ciAob2JqZWN0KSBhdHRyaWJ1dGVzIG1hcCxcbiBvICAgICBjaGlsZE5vZGVzIChhcnJheSkgb3B0aW9uYWwgYXJyYXkgb2YgY2hpbGRyZW4gaW4gdGhlIHNhbWUgZm9ybWF0XG4gbyB9XG5cXCovXG5FbGVtZW50LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGpzb25GaWxsZXIoW3RoaXNdLCBvdXQpO1xuICAgIHJldHVybiBvdXRbMF07XG59O1xuLy8gZGVmYXVsdFxuZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHJcIiwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhdHQgPSBldmUubnQoKTtcbiAgICBhdHQgPSBhdHQuc3Vic3RyaW5nKGF0dC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgICB2YXIgY3NzID0gYXR0LnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uIChsZXR0ZXIpIHtcbiAgICAgICAgcmV0dXJuIFwiLVwiICsgbGV0dGVyLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgaWYgKGNzc0F0dHJbaGFzXShjc3MpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShjc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMubm9kZSwgYXR0KTtcbiAgICB9XG59KTtcbnZhciBjc3NBdHRyID0ge1xuICAgIFwiYWxpZ25tZW50LWJhc2VsaW5lXCI6IDAsXG4gICAgXCJiYXNlbGluZS1zaGlmdFwiOiAwLFxuICAgIFwiY2xpcFwiOiAwLFxuICAgIFwiY2xpcC1wYXRoXCI6IDAsXG4gICAgXCJjbGlwLXJ1bGVcIjogMCxcbiAgICBcImNvbG9yXCI6IDAsXG4gICAgXCJjb2xvci1pbnRlcnBvbGF0aW9uXCI6IDAsXG4gICAgXCJjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnNcIjogMCxcbiAgICBcImNvbG9yLXByb2ZpbGVcIjogMCxcbiAgICBcImNvbG9yLXJlbmRlcmluZ1wiOiAwLFxuICAgIFwiY3Vyc29yXCI6IDAsXG4gICAgXCJkaXJlY3Rpb25cIjogMCxcbiAgICBcImRpc3BsYXlcIjogMCxcbiAgICBcImRvbWluYW50LWJhc2VsaW5lXCI6IDAsXG4gICAgXCJlbmFibGUtYmFja2dyb3VuZFwiOiAwLFxuICAgIFwiZmlsbFwiOiAwLFxuICAgIFwiZmlsbC1vcGFjaXR5XCI6IDAsXG4gICAgXCJmaWxsLXJ1bGVcIjogMCxcbiAgICBcImZpbHRlclwiOiAwLFxuICAgIFwiZmxvb2QtY29sb3JcIjogMCxcbiAgICBcImZsb29kLW9wYWNpdHlcIjogMCxcbiAgICBcImZvbnRcIjogMCxcbiAgICBcImZvbnQtZmFtaWx5XCI6IDAsXG4gICAgXCJmb250LXNpemVcIjogMCxcbiAgICBcImZvbnQtc2l6ZS1hZGp1c3RcIjogMCxcbiAgICBcImZvbnQtc3RyZXRjaFwiOiAwLFxuICAgIFwiZm9udC1zdHlsZVwiOiAwLFxuICAgIFwiZm9udC12YXJpYW50XCI6IDAsXG4gICAgXCJmb250LXdlaWdodFwiOiAwLFxuICAgIFwiZ2x5cGgtb3JpZW50YXRpb24taG9yaXpvbnRhbFwiOiAwLFxuICAgIFwiZ2x5cGgtb3JpZW50YXRpb24tdmVydGljYWxcIjogMCxcbiAgICBcImltYWdlLXJlbmRlcmluZ1wiOiAwLFxuICAgIFwia2VybmluZ1wiOiAwLFxuICAgIFwibGV0dGVyLXNwYWNpbmdcIjogMCxcbiAgICBcImxpZ2h0aW5nLWNvbG9yXCI6IDAsXG4gICAgXCJtYXJrZXJcIjogMCxcbiAgICBcIm1hcmtlci1lbmRcIjogMCxcbiAgICBcIm1hcmtlci1taWRcIjogMCxcbiAgICBcIm1hcmtlci1zdGFydFwiOiAwLFxuICAgIFwibWFza1wiOiAwLFxuICAgIFwib3BhY2l0eVwiOiAwLFxuICAgIFwib3ZlcmZsb3dcIjogMCxcbiAgICBcInBvaW50ZXItZXZlbnRzXCI6IDAsXG4gICAgXCJzaGFwZS1yZW5kZXJpbmdcIjogMCxcbiAgICBcInN0b3AtY29sb3JcIjogMCxcbiAgICBcInN0b3Atb3BhY2l0eVwiOiAwLFxuICAgIFwic3Ryb2tlXCI6IDAsXG4gICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IDAsXG4gICAgXCJzdHJva2UtZGFzaG9mZnNldFwiOiAwLFxuICAgIFwic3Ryb2tlLWxpbmVjYXBcIjogMCxcbiAgICBcInN0cm9rZS1saW5lam9pblwiOiAwLFxuICAgIFwic3Ryb2tlLW1pdGVybGltaXRcIjogMCxcbiAgICBcInN0cm9rZS1vcGFjaXR5XCI6IDAsXG4gICAgXCJzdHJva2Utd2lkdGhcIjogMCxcbiAgICBcInRleHQtYW5jaG9yXCI6IDAsXG4gICAgXCJ0ZXh0LWRlY29yYXRpb25cIjogMCxcbiAgICBcInRleHQtcmVuZGVyaW5nXCI6IDAsXG4gICAgXCJ1bmljb2RlLWJpZGlcIjogMCxcbiAgICBcInZpc2liaWxpdHlcIjogMCxcbiAgICBcIndvcmQtc3BhY2luZ1wiOiAwLFxuICAgIFwid3JpdGluZy1tb2RlXCI6IDBcbn07XG5cbmV2ZS5vbihcInNuYXAudXRpbC5hdHRyXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBhdHQgPSBldmUubnQoKSxcbiAgICAgICAgYXR0ciA9IHt9O1xuICAgIGF0dCA9IGF0dC5zdWJzdHJpbmcoYXR0Lmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xuICAgIGF0dHJbYXR0XSA9IHZhbHVlO1xuICAgIHZhciBzdHlsZSA9IGF0dC5yZXBsYWNlKC8tKFxcdykvZ2ksIGZ1bmN0aW9uIChhbGwsIGxldHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9KSxcbiAgICAgICAgY3NzID0gYXR0LnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uIChsZXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIi1cIiArIGxldHRlci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9KTtcbiAgICBpZiAoY3NzQXR0cltoYXNdKGNzcykpIHtcbiAgICAgICAgdGhpcy5ub2RlLnN0eWxlW3N0eWxlXSA9IHZhbHVlID09IG51bGwgPyBFIDogdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzLm5vZGUsIGF0dHIpO1xuICAgIH1cbn0pO1xuKGZ1bmN0aW9uIChwcm90bykge30oUGFwZXIucHJvdG90eXBlKSk7XG5cbi8vIHNpbXBsZSBhamF4XG4vKlxcXG4gKiBTbmFwLmFqYXhcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFNpbXBsZSBpbXBsZW1lbnRhdGlvbiBvZiBBamF4XG4gKipcbiAtIHVybCAoc3RyaW5nKSBVUkxcbiAtIHBvc3REYXRhIChvYmplY3R8c3RyaW5nKSBkYXRhIGZvciBwb3N0IHJlcXVlc3RcbiAtIGNhbGxiYWNrIChmdW5jdGlvbikgY2FsbGJhY2tcbiAtIHNjb3BlIChvYmplY3QpICNvcHRpb25hbCBzY29wZSBvZiBjYWxsYmFja1xuICogb3JcbiAtIHVybCAoc3RyaW5nKSBVUkxcbiAtIGNhbGxiYWNrIChmdW5jdGlvbikgY2FsbGJhY2tcbiAtIHNjb3BlIChvYmplY3QpICNvcHRpb25hbCBzY29wZSBvZiBjYWxsYmFja1xuID0gKFhNTEh0dHBSZXF1ZXN0KSB0aGUgWE1MSHR0cFJlcXVlc3Qgb2JqZWN0LCBqdXN0IGluIGNhc2VcblxcKi9cblNuYXAuYWpheCA9IGZ1bmN0aW9uICh1cmwsIHBvc3REYXRhLCBjYWxsYmFjaywgc2NvcGUpe1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QsXG4gICAgICAgIGlkID0gSUQoKTtcbiAgICBpZiAocmVxKSB7XG4gICAgICAgIGlmIChpcyhwb3N0RGF0YSwgXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgc2NvcGUgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIGNhbGxiYWNrID0gcG9zdERhdGE7XG4gICAgICAgICAgICBwb3N0RGF0YSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMocG9zdERhdGEsIFwib2JqZWN0XCIpKSB7XG4gICAgICAgICAgICB2YXIgcGQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwb3N0RGF0YSkgaWYgKHBvc3REYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwZC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocG9zdERhdGFba2V5XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zdERhdGEgPSBwZC5qb2luKFwiJlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXEub3Blbihwb3N0RGF0YSA/IFwiUE9TVFwiIDogXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgaWYgKHBvc3REYXRhKSB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgZXZlLm9uY2UoXCJzbmFwLmFqYXguXCIgKyBpZCArIFwiLjBcIiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgZXZlLm9uY2UoXCJzbmFwLmFqYXguXCIgKyBpZCArIFwiLjIwMFwiLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBldmUub25jZShcInNuYXAuYWpheC5cIiArIGlkICsgXCIuMzA0XCIsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xuICAgICAgICAgICAgZXZlKFwic25hcC5hamF4LlwiICsgaWQgKyBcIi5cIiArIHJlcS5zdGF0dXMsIHNjb3BlLCByZXEpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfVxuICAgICAgICByZXEuc2VuZChwb3N0RGF0YSk7XG4gICAgICAgIHJldHVybiByZXE7XG4gICAgfVxufTtcbi8qXFxcbiAqIFNuYXAubG9hZFxuIFsgbWV0aG9kIF1cbiAqKlxuICogTG9hZHMgZXh0ZXJuYWwgU1ZHIGZpbGUgYXMgYSBARnJhZ21lbnQgKHNlZSBAU25hcC5hamF4IGZvciBtb3JlIGFkdmFuY2VkIEFKQVgpXG4gKipcbiAtIHVybCAoc3RyaW5nKSBVUkxcbiAtIGNhbGxiYWNrIChmdW5jdGlvbikgY2FsbGJhY2tcbiAtIHNjb3BlIChvYmplY3QpICNvcHRpb25hbCBzY29wZSBvZiBjYWxsYmFja1xuXFwqL1xuU25hcC5sb2FkID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgU25hcC5hamF4KHVybCwgZnVuY3Rpb24gKHJlcSkge1xuICAgICAgICB2YXIgZiA9IFNuYXAucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIHNjb3BlID8gY2FsbGJhY2suY2FsbChzY29wZSwgZikgOiBjYWxsYmFjayhmKTtcbiAgICB9KTtcbn07XG52YXIgZ2V0T2Zmc2V0ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgZG9jID0gZWxlbS5vd25lckRvY3VtZW50LFxuICAgICAgICBib2R5ID0gZG9jLmJvZHksXG4gICAgICAgIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICBjbGllbnRUb3AgPSBkb2NFbGVtLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwLCBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLFxuICAgICAgICB0b3AgID0gYm94LnRvcCAgKyAoZy53aW4ucGFnZVlPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxUb3AgfHwgYm9keS5zY3JvbGxUb3AgKSAtIGNsaWVudFRvcCxcbiAgICAgICAgbGVmdCA9IGJveC5sZWZ0ICsgKGcud2luLnBhZ2VYT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQpIC0gY2xpZW50TGVmdDtcbiAgICByZXR1cm4ge1xuICAgICAgICB5OiB0b3AsXG4gICAgICAgIHg6IGxlZnRcbiAgICB9O1xufTtcbi8qXFxcbiAqIFNuYXAuZ2V0RWxlbWVudEJ5UG9pbnRcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFJldHVybnMgeW91IHRvcG1vc3QgZWxlbWVudCB1bmRlciBnaXZlbiBwb2ludC5cbiAqKlxuID0gKG9iamVjdCkgU25hcCBlbGVtZW50IG9iamVjdFxuIC0geCAobnVtYmVyKSB4IGNvb3JkaW5hdGUgZnJvbSB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSB3aW5kb3dcbiAtIHkgKG51bWJlcikgeSBjb29yZGluYXRlIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgd2luZG93XG4gPiBVc2FnZVxuIHwgU25hcC5nZXRFbGVtZW50QnlQb2ludChtb3VzZVgsIG1vdXNlWSkuYXR0cih7c3Ryb2tlOiBcIiNmMDBcIn0pO1xuXFwqL1xuU25hcC5nZXRFbGVtZW50QnlQb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdmFyIHBhcGVyID0gdGhpcyxcbiAgICAgICAgc3ZnID0gcGFwZXIuY2FudmFzLFxuICAgICAgICB0YXJnZXQgPSBnbG9iLmRvYy5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgIGlmIChnbG9iLndpbi5vcGVyYSAmJiB0YXJnZXQudGFnTmFtZSA9PSBcInN2Z1wiKSB7XG4gICAgICAgIHZhciBzbyA9IGdldE9mZnNldCh0YXJnZXQpLFxuICAgICAgICAgICAgc3IgPSB0YXJnZXQuY3JlYXRlU1ZHUmVjdCgpO1xuICAgICAgICBzci54ID0geCAtIHNvLng7XG4gICAgICAgIHNyLnkgPSB5IC0gc28ueTtcbiAgICAgICAgc3Iud2lkdGggPSBzci5oZWlnaHQgPSAxO1xuICAgICAgICB2YXIgaGl0cyA9IHRhcmdldC5nZXRJbnRlcnNlY3Rpb25MaXN0KHNyLCBudWxsKTtcbiAgICAgICAgaWYgKGhpdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSBoaXRzW2hpdHMubGVuZ3RoIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB3cmFwKHRhcmdldCk7XG59O1xuLypcXFxuICogU25hcC5wbHVnaW5cbiBbIG1ldGhvZCBdXG4gKipcbiAqIExldCB5b3Ugd3JpdGUgcGx1Z2lucy4gWW91IHBhc3MgaW4gYSBmdW5jdGlvbiB3aXRoIGZpdmUgYXJndW1lbnRzLCBsaWtlIHRoaXM6XG4gfCBTbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2JhbCwgRnJhZ21lbnQpIHtcbiB8ICAgICBTbmFwLm5ld21ldGhvZCA9IGZ1bmN0aW9uICgpIHt9O1xuIHwgICAgIEVsZW1lbnQucHJvdG90eXBlLm5ld21ldGhvZCA9IGZ1bmN0aW9uICgpIHt9O1xuIHwgICAgIFBhcGVyLnByb3RvdHlwZS5uZXdtZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcbiB8IH0pO1xuICogSW5zaWRlIHRoZSBmdW5jdGlvbiB5b3UgaGF2ZSBhY2Nlc3MgdG8gYWxsIG1haW4gb2JqZWN0cyAoYW5kIHRoZWlyXG4gKiBwcm90b3R5cGVzKS4gVGhpcyBhbGxvdyB5b3UgdG8gZXh0ZW5kIGFueXRoaW5nIHlvdSB3YW50LlxuICoqXG4gLSBmIChmdW5jdGlvbikgeW91ciBwbHVnaW4gYm9keVxuXFwqL1xuU25hcC5wbHVnaW4gPSBmdW5jdGlvbiAoZikge1xuICAgIGYoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KTtcbn07XG5nbG9iLndpbi5TbmFwID0gU25hcDtcbnJldHVybiBTbmFwO1xufSh3aW5kb3cgfHwgdGhpcykpO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIGVscHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgaXMgPSBTbmFwLmlzLFxuICAgICAgICBTdHIgPSBTdHJpbmcsXG4gICAgICAgIHVuaXQycHggPSBTbmFwLl91bml0MnB4LFxuICAgICAgICAkID0gU25hcC5fLiQsXG4gICAgICAgIG1ha2UgPSBTbmFwLl8ubWFrZSxcbiAgICAgICAgZ2V0U29tZURlZnMgPSBTbmFwLl8uZ2V0U29tZURlZnMsXG4gICAgICAgIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIixcbiAgICAgICAgd3JhcCA9IFNuYXAuXy53cmFwO1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmdldEJCb3hcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgdGhlIGJvdW5kaW5nIGJveCBkZXNjcmlwdG9yIGZvciB0aGUgZ2l2ZW4gZWxlbWVudFxuICAgICAqKlxuICAgICA9IChvYmplY3QpIGJvdW5kaW5nIGJveCBkZXNjcmlwdG9yOlxuICAgICBvIHtcbiAgICAgbyAgICAgY3g6IChudW1iZXIpIHggb2YgdGhlIGNlbnRlcixcbiAgICAgbyAgICAgY3k6IChudW1iZXIpIHggb2YgdGhlIGNlbnRlcixcbiAgICAgbyAgICAgaDogKG51bWJlcikgaGVpZ2h0LFxuICAgICBvICAgICBoZWlnaHQ6IChudW1iZXIpIGhlaWdodCxcbiAgICAgbyAgICAgcGF0aDogKHN0cmluZykgcGF0aCBjb21tYW5kIGZvciB0aGUgYm94LFxuICAgICBvICAgICByMDogKG51bWJlcikgcmFkaXVzIG9mIGEgY2lyY2xlIHRoYXQgZnVsbHkgZW5jbG9zZXMgdGhlIGJveCxcbiAgICAgbyAgICAgcjE6IChudW1iZXIpIHJhZGl1cyBvZiB0aGUgc21hbGxlc3QgY2lyY2xlIHRoYXQgY2FuIGJlIGVuY2xvc2VkLFxuICAgICBvICAgICByMjogKG51bWJlcikgcmFkaXVzIG9mIHRoZSBsYXJnZXN0IGNpcmNsZSB0aGF0IGNhbiBiZSBlbmNsb3NlZCxcbiAgICAgbyAgICAgdmI6IChzdHJpbmcpIGJveCBhcyBhIHZpZXdib3ggY29tbWFuZCxcbiAgICAgbyAgICAgdzogKG51bWJlcikgd2lkdGgsXG4gICAgIG8gICAgIHdpZHRoOiAobnVtYmVyKSB3aWR0aCxcbiAgICAgbyAgICAgeDI6IChudW1iZXIpIHggb2YgdGhlIHJpZ2h0IHNpZGUsXG4gICAgIG8gICAgIHg6IChudW1iZXIpIHggb2YgdGhlIGxlZnQgc2lkZSxcbiAgICAgbyAgICAgeTI6IChudW1iZXIpIHkgb2YgdGhlIGJvdHRvbSBlZGdlLFxuICAgICBvICAgICB5OiAobnVtYmVyKSB5IG9mIHRoZSB0b3AgZWRnZVxuICAgICBvIH1cbiAgICBcXCovXG4gICAgZWxwcm90by5nZXRCQm94ID0gZnVuY3Rpb24gKGlzV2l0aG91dFRyYW5zZm9ybSkge1xuICAgICAgICBpZiAodGhpcy50eXBlID09IFwidHNwYW5cIikge1xuICAgICAgICAgICAgcmV0dXJuIFNuYXAuXy5ib3godGhpcy5ub2RlLmdldENsaWVudFJlY3RzKCkuaXRlbSgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFTbmFwLk1hdHJpeCB8fCAhU25hcC5wYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldEJCb3goKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWwgPSB0aGlzLFxuICAgICAgICAgICAgbSA9IG5ldyBTbmFwLk1hdHJpeDtcbiAgICAgICAgaWYgKGVsLnJlbW92ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGVsLnR5cGUgPT0gXCJ1c2VcIikge1xuICAgICAgICAgICAgaWYgKCFpc1dpdGhvdXRUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgICAgICBtID0gbS5hZGQoZWwudHJhbnNmb3JtKCkubG9jYWxNYXRyaXgudHJhbnNsYXRlKGVsLmF0dHIoXCJ4XCIpIHx8IDAsIGVsLmF0dHIoXCJ5XCIpIHx8IDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbC5vcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgIGVsID0gZWwub3JpZ2luYWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBocmVmID0gZWwuYXR0cihcInhsaW5rOmhyZWZcIik7XG4gICAgICAgICAgICAgICAgZWwgPSBlbC5vcmlnaW5hbCA9IGVsLm5vZGUub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChocmVmLnN1YnN0cmluZyhocmVmLmluZGV4T2YoXCIjXCIpICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBfID0gZWwuXyxcbiAgICAgICAgICAgIHBhdGhmaW5kZXIgPSBTbmFwLnBhdGguZ2V0W2VsLnR5cGVdIHx8IFNuYXAucGF0aC5nZXQuZGVmbHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoaXNXaXRob3V0VHJhbnNmb3JtKSB7XG4gICAgICAgICAgICAgICAgXy5iYm94d3QgPSBwYXRoZmluZGVyID8gU25hcC5wYXRoLmdldEJCb3goZWwucmVhbFBhdGggPSBwYXRoZmluZGVyKGVsKSkgOiBTbmFwLl8uYm94KGVsLm5vZGUuZ2V0QkJveCgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gU25hcC5fLmJveChfLmJib3h3dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLnJlYWxQYXRoID0gcGF0aGZpbmRlcihlbCk7XG4gICAgICAgICAgICAgICAgZWwubWF0cml4ID0gZWwudHJhbnNmb3JtKCkubG9jYWxNYXRyaXg7XG4gICAgICAgICAgICAgICAgXy5iYm94ID0gU25hcC5wYXRoLmdldEJCb3goU25hcC5wYXRoLm1hcChlbC5yZWFsUGF0aCwgbS5hZGQoZWwubWF0cml4KSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KF8uYmJveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggZG9lc27igJl0IGdpdmUgeW91IGJib3ggb2YgaGlkZGVuIGVsZW1lbnRcbiAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBwcm9wU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmc7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBleHRyYWN0VHJhbnNmb3JtKGVsLCB0c3RyKSB7XG4gICAgICAgIGlmICh0c3RyID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBkb1JldHVybiA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZWwudHlwZSA9PSBcImxpbmVhckdyYWRpZW50XCIgfHwgZWwudHlwZSA9PSBcInJhZGlhbEdyYWRpZW50XCIpIHtcbiAgICAgICAgICAgICAgICB0c3RyID0gZWwubm9kZS5nZXRBdHRyaWJ1dGUoXCJncmFkaWVudFRyYW5zZm9ybVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWwudHlwZSA9PSBcInBhdHRlcm5cIikge1xuICAgICAgICAgICAgICAgIHRzdHIgPSBlbC5ub2RlLmdldEF0dHJpYnV0ZShcInBhdHRlcm5UcmFuc2Zvcm1cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRzdHIgPSBlbC5ub2RlLmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdHN0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU25hcC5NYXRyaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0c3RyID0gU25hcC5fLnN2Z1RyYW5zZm9ybTJzdHJpbmcodHN0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIVNuYXAuXy5yZ1RyYW5zZm9ybS50ZXN0KHRzdHIpKSB7XG4gICAgICAgICAgICAgICAgdHN0ciA9IFNuYXAuXy5zdmdUcmFuc2Zvcm0yc3RyaW5nKHRzdHIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0c3RyID0gU3RyKHRzdHIpLnJlcGxhY2UoL1xcLnszfXxcXHUyMDI2L2csIGVsLl8udHJhbnNmb3JtIHx8IFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzKHRzdHIsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgICAgICB0c3RyID0gU25hcC5wYXRoID8gU25hcC5wYXRoLnRvU3RyaW5nLmNhbGwodHN0cikgOiBTdHIodHN0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5fLnRyYW5zZm9ybSA9IHRzdHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG0gPSBTbmFwLl8udHJhbnNmb3JtMm1hdHJpeCh0c3RyLCBlbC5nZXRCQm94KDEpKTtcbiAgICAgICAgaWYgKGRvUmV0dXJuKSB7XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLm1hdHJpeCA9IG07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudHJhbnNmb3JtXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBHZXRzIG9yIHNldHMgdHJhbnNmb3JtYXRpb24gb2YgdGhlIGVsZW1lbnRcbiAgICAgKipcbiAgICAgLSB0c3RyIChzdHJpbmcpIHRyYW5zZm9ybSBzdHJpbmcgaW4gU25hcCBvciBTVkcgZm9ybWF0XG4gICAgID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICAgKiBvclxuICAgICA9IChvYmplY3QpIHRyYW5zZm9ybWF0aW9uIGRlc2NyaXB0b3I6XG4gICAgIG8ge1xuICAgICBvICAgICBzdHJpbmcgKHN0cmluZykgdHJhbnNmb3JtIHN0cmluZyxcbiAgICAgbyAgICAgZ2xvYmFsTWF0cml4IChNYXRyaXgpIG1hdHJpeCBvZiBhbGwgdHJhbnNmb3JtYXRpb25zIGFwcGxpZWQgdG8gZWxlbWVudCBvciBpdHMgcGFyZW50cyxcbiAgICAgbyAgICAgbG9jYWxNYXRyaXggKE1hdHJpeCkgbWF0cml4IG9mIHRyYW5zZm9ybWF0aW9ucyBhcHBsaWVkIG9ubHkgdG8gdGhlIGVsZW1lbnQsXG4gICAgIG8gICAgIGRpZmZNYXRyaXggKE1hdHJpeCkgbWF0cml4IG9mIGRpZmZlcmVuY2UgYmV0d2VlbiBnbG9iYWwgYW5kIGxvY2FsIHRyYW5zZm9ybWF0aW9ucyxcbiAgICAgbyAgICAgZ2xvYmFsIChzdHJpbmcpIGdsb2JhbCB0cmFuc2Zvcm1hdGlvbiBhcyBzdHJpbmcsXG4gICAgIG8gICAgIGxvY2FsIChzdHJpbmcpIGxvY2FsIHRyYW5zZm9ybWF0aW9uIGFzIHN0cmluZyxcbiAgICAgbyAgICAgdG9TdHJpbmcgKGZ1bmN0aW9uKSByZXR1cm5zIGBzdHJpbmdgIHByb3BlcnR5XG4gICAgIG8gfVxuICAgIFxcKi9cbiAgICBlbHByb3RvLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0c3RyKSB7XG4gICAgICAgIHZhciBfID0gdGhpcy5fO1xuICAgICAgICBpZiAodHN0ciA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcGFwYSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZ2xvYmFsID0gbmV3IFNuYXAuTWF0cml4KHRoaXMubm9kZS5nZXRDVE0oKSksXG4gICAgICAgICAgICAgICAgbG9jYWwgPSBleHRyYWN0VHJhbnNmb3JtKHRoaXMpLFxuICAgICAgICAgICAgICAgIG1zID0gW2xvY2FsXSxcbiAgICAgICAgICAgICAgICBtID0gbmV3IFNuYXAuTWF0cml4LFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgbG9jYWxTdHJpbmcgPSBsb2NhbC50b1RyYW5zZm9ybVN0cmluZygpLFxuICAgICAgICAgICAgICAgIHN0cmluZyA9IFN0cihsb2NhbCkgPT0gU3RyKHRoaXMubWF0cml4KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyKF8udHJhbnNmb3JtKSA6IGxvY2FsU3RyaW5nO1xuICAgICAgICAgICAgd2hpbGUgKHBhcGEudHlwZSAhPSBcInN2Z1wiICYmIChwYXBhID0gcGFwYS5wYXJlbnQoKSkpIHtcbiAgICAgICAgICAgICAgICBtcy5wdXNoKGV4dHJhY3RUcmFuc2Zvcm0ocGFwYSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSA9IG1zLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBtLmFkZChtc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgICAgICAgICAgICAgIGdsb2JhbE1hdHJpeDogZ2xvYmFsLFxuICAgICAgICAgICAgICAgIHRvdGFsTWF0cml4OiBtLFxuICAgICAgICAgICAgICAgIGxvY2FsTWF0cml4OiBsb2NhbCxcbiAgICAgICAgICAgICAgICBkaWZmTWF0cml4OiBnbG9iYWwuY2xvbmUoKS5hZGQobG9jYWwuaW52ZXJ0KCkpLFxuICAgICAgICAgICAgICAgIGdsb2JhbDogZ2xvYmFsLnRvVHJhbnNmb3JtU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdG90YWw6IG0udG9UcmFuc2Zvcm1TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBsb2NhbDogbG9jYWxTdHJpbmcsXG4gICAgICAgICAgICAgICAgdG9TdHJpbmc6IHByb3BTdHJpbmdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRzdHIgaW5zdGFuY2VvZiBTbmFwLk1hdHJpeCkge1xuICAgICAgICAgICAgdGhpcy5tYXRyaXggPSB0c3RyO1xuICAgICAgICAgICAgdGhpcy5fLnRyYW5zZm9ybSA9IHRzdHIudG9UcmFuc2Zvcm1TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4dHJhY3RUcmFuc2Zvcm0odGhpcywgdHN0cik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09IFwibGluZWFyR3JhZGllbnRcIiB8fCB0aGlzLnR5cGUgPT0gXCJyYWRpYWxHcmFkaWVudFwiKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtncmFkaWVudFRyYW5zZm9ybTogdGhpcy5tYXRyaXh9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50eXBlID09IFwicGF0dGVyblwiKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtwYXR0ZXJuVHJhbnNmb3JtOiB0aGlzLm1hdHJpeH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMubm9kZSwge3RyYW5zZm9ybTogdGhpcy5tYXRyaXh9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucGFyZW50XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBlbGVtZW50J3MgcGFyZW50XG4gICAgICoqXG4gICAgID0gKEVsZW1lbnQpIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdyYXAodGhpcy5ub2RlLnBhcmVudE5vZGUpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYXBwZW5kXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBcHBlbmRzIHRoZSBnaXZlbiBlbGVtZW50IHRvIGN1cnJlbnQgb25lXG4gICAgICoqXG4gICAgIC0gZWwgKEVsZW1lbnR8U2V0KSBlbGVtZW50IHRvIGFwcGVuZFxuICAgICA9IChFbGVtZW50KSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYWRkXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBTZWUgQEVsZW1lbnQuYXBwZW5kXG4gICAgXFwqL1xuICAgIGVscHJvdG8uYXBwZW5kID0gZWxwcm90by5hZGQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBpZiAoZWwudHlwZSA9PSBcInNldFwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ID0gdGhpcztcbiAgICAgICAgICAgICAgICBlbC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5hZGQoZWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwgPSB3cmFwKGVsKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChlbC5ub2RlKTtcbiAgICAgICAgICAgIGVsLnBhcGVyID0gdGhpcy5wYXBlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFwcGVuZFRvXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBcHBlbmRzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gdGhlIGdpdmVuIG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBwYXJlbnQgZWxlbWVudCB0byBhcHBlbmQgdG9cbiAgICAgPSAoRWxlbWVudCkgdGhlIGNoaWxkIGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5hcHBlbmRUbyA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgICAgICBlbC5hcHBlbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5wcmVwZW5kXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBQcmVwZW5kcyB0aGUgZ2l2ZW4gZWxlbWVudCB0byB0aGUgY3VycmVudCBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgZWxlbWVudCB0byBwcmVwZW5kXG4gICAgID0gKEVsZW1lbnQpIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnByZXBlbmQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBpZiAoZWwudHlwZSA9PSBcInNldFwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q7XG4gICAgICAgICAgICAgICAgZWwuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdC5hZnRlcihlbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5wcmVwZW5kKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IGVsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwgPSB3cmFwKGVsKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5pbnNlcnRCZWZvcmUoZWwubm9kZSwgdGhpcy5ub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgdGhpcy5hZGQgJiYgdGhpcy5hZGQoKTtcbiAgICAgICAgICAgIGVsLnBhcGVyID0gdGhpcy5wYXBlcjtcbiAgICAgICAgICAgIHRoaXMucGFyZW50KCkgJiYgdGhpcy5wYXJlbnQoKS5hZGQoKTtcbiAgICAgICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5wcmVwZW5kVG9cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFByZXBlbmRzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gdGhlIGdpdmVuIG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBwYXJlbnQgZWxlbWVudCB0byBwcmVwZW5kIHRvXG4gICAgID0gKEVsZW1lbnQpIHRoZSBjaGlsZCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8ucHJlcGVuZFRvID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgIGVsLnByZXBlbmQodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYmVmb3JlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBJbnNlcnRzIGdpdmVuIGVsZW1lbnQgYmVmb3JlIHRoZSBjdXJyZW50IG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBlbGVtZW50IHRvIGluc2VydFxuICAgICA9IChFbGVtZW50KSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5iZWZvcmUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgaWYgKGVsLnR5cGUgPT0gXCJzZXRcIikge1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcztcbiAgICAgICAgICAgIGVsLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIGl0Lm5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwubm9kZSwgaXQubm9kZSk7XG4gICAgICAgICAgICAgICAgcGFyZW50ICYmIHBhcmVudC5hZGQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQoKS5hZGQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLm5vZGUsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMucGFyZW50KCkgJiYgdGhpcy5wYXJlbnQoKS5hZGQoKTtcbiAgICAgICAgcGFyZW50ICYmIHBhcmVudC5hZGQoKTtcbiAgICAgICAgZWwucGFwZXIgPSB0aGlzLnBhcGVyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFmdGVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBJbnNlcnRzIGdpdmVuIGVsZW1lbnQgYWZ0ZXIgdGhlIGN1cnJlbnQgb25lXG4gICAgICoqXG4gICAgIC0gZWwgKEVsZW1lbnQpIGVsZW1lbnQgdG8gaW5zZXJ0XG4gICAgID0gKEVsZW1lbnQpIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmFmdGVyID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQoKTtcbiAgICAgICAgaWYgKHRoaXMubm9kZS5uZXh0U2libGluZykge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLm5vZGUsIHRoaXMubm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbC5ub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudCgpICYmIHRoaXMucGFyZW50KCkuYWRkKCk7XG4gICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgIGVsLnBhcGVyID0gdGhpcy5wYXBlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5pbnNlcnRCZWZvcmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEluc2VydHMgdGhlIGVsZW1lbnQgYWZ0ZXIgdGhlIGdpdmVuIG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBlbGVtZW50IG5leHQgdG8gd2hvbSBpbnNlcnQgdG9cbiAgICAgPSAoRWxlbWVudCkgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCgpO1xuICAgICAgICBlbC5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubm9kZSwgZWwubm9kZSk7XG4gICAgICAgIHRoaXMucGFwZXIgPSBlbC5wYXBlcjtcbiAgICAgICAgcGFyZW50ICYmIHBhcmVudC5hZGQoKTtcbiAgICAgICAgZWwucGFyZW50KCkgJiYgZWwucGFyZW50KCkuYWRkKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuaW5zZXJ0QWZ0ZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEluc2VydHMgdGhlIGVsZW1lbnQgYWZ0ZXIgdGhlIGdpdmVuIG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBlbGVtZW50IG5leHQgdG8gd2hvbSBpbnNlcnQgdG9cbiAgICAgPSAoRWxlbWVudCkgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwgPSB3cmFwKGVsKTtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50KCk7XG4gICAgICAgIGVsLm5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5ub2RlLCBlbC5ub2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgdGhpcy5wYXBlciA9IGVsLnBhcGVyO1xuICAgICAgICBwYXJlbnQgJiYgcGFyZW50LmFkZCgpO1xuICAgICAgICBlbC5wYXJlbnQoKSAmJiBlbC5wYXJlbnQoKS5hZGQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5yZW1vdmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgZWxlbWVudCBmcm9tIHRoZSBET01cbiAgICAgPSAoRWxlbWVudCkgdGhlIGRldGFjaGVkIGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCgpO1xuICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZSAmJiB0aGlzLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgICBkZWxldGUgdGhpcy5wYXBlcjtcbiAgICAgICAgdGhpcy5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50ICYmIHBhcmVudC5hZGQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5zZWxlY3RcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEdhdGhlcnMgdGhlIG5lc3RlZCBARWxlbWVudCBtYXRjaGluZyB0aGUgZ2l2ZW4gc2V0IG9mIENTUyBzZWxlY3RvcnNcbiAgICAgKipcbiAgICAgLSBxdWVyeSAoc3RyaW5nKSBDU1Mgc2VsZWN0b3JcbiAgICAgPSAoRWxlbWVudCkgcmVzdWx0IG9mIHF1ZXJ5IHNlbGVjdGlvblxuICAgIFxcKi9cbiAgICBlbHByb3RvLnNlbGVjdCA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgICByZXR1cm4gd3JhcCh0aGlzLm5vZGUucXVlcnlTZWxlY3RvcihxdWVyeSkpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuc2VsZWN0QWxsXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBHYXRoZXJzIG5lc3RlZCBARWxlbWVudCBvYmplY3RzIG1hdGNoaW5nIHRoZSBnaXZlbiBzZXQgb2YgQ1NTIHNlbGVjdG9yc1xuICAgICAqKlxuICAgICAtIHF1ZXJ5IChzdHJpbmcpIENTUyBzZWxlY3RvclxuICAgICA9IChTZXR8YXJyYXkpIHJlc3VsdCBvZiBxdWVyeSBzZWxlY3Rpb25cbiAgICBcXCovXG4gICAgZWxwcm90by5zZWxlY3RBbGwgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICAgICAgdmFyIG5vZGVsaXN0ID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLFxuICAgICAgICAgICAgc2V0ID0gKFNuYXAuc2V0IHx8IEFycmF5KSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZXQucHVzaCh3cmFwKG5vZGVsaXN0W2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFzUFhcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgZ2l2ZW4gYXR0cmlidXRlIG9mIHRoZSBlbGVtZW50IGFzIGEgYHB4YCB2YWx1ZSAobm90ICUsIGVtLCBldGMuKVxuICAgICAqKlxuICAgICAtIGF0dHIgKHN0cmluZykgYXR0cmlidXRlIG5hbWVcbiAgICAgLSB2YWx1ZSAoc3RyaW5nKSAjb3B0aW9uYWwgYXR0cmlidXRlIHZhbHVlXG4gICAgID0gKEVsZW1lbnQpIHJlc3VsdCBvZiBxdWVyeSBzZWxlY3Rpb25cbiAgICBcXCovXG4gICAgZWxwcm90by5hc1BYID0gZnVuY3Rpb24gKGF0dHIsIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuYXR0cihhdHRyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gK3VuaXQycHgodGhpcywgYXR0ciwgdmFsdWUpO1xuICAgIH07XG4gICAgLy8gU0lFUlJBIEVsZW1lbnQudXNlKCk6IEkgc3VnZ2VzdCBhZGRpbmcgYSBub3RlIGFib3V0IGhvdyB0byBhY2Nlc3MgdGhlIG9yaWdpbmFsIGVsZW1lbnQgdGhlIHJldHVybmVkIDx1c2U+IGluc3RhbnRpYXRlcy4gSXQncyBhIHBhcnQgb2YgU1ZHIHdpdGggd2hpY2ggb3JkaW5hcnkgd2ViIGRldmVsb3BlcnMgbWF5IGJlIGxlYXN0IGZhbWlsaWFyLlxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVzZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIGA8dXNlPmAgZWxlbWVudCBsaW5rZWQgdG8gdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgICAqKlxuICAgICA9IChFbGVtZW50KSB0aGUgYDx1c2U+YCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8udXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXNlLFxuICAgICAgICAgICAgaWQgPSB0aGlzLm5vZGUuaWQ7XG4gICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZDtcbiAgICAgICAgICAgICQodGhpcy5ub2RlLCB7XG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50eXBlID09IFwibGluZWFyR3JhZGllbnRcIiB8fCB0aGlzLnR5cGUgPT0gXCJyYWRpYWxHcmFkaWVudFwiIHx8XG4gICAgICAgICAgICB0aGlzLnR5cGUgPT0gXCJwYXR0ZXJuXCIpIHtcbiAgICAgICAgICAgIHVzZSA9IG1ha2UodGhpcy50eXBlLCB0aGlzLm5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c2UgPSBtYWtlKFwidXNlXCIsIHRoaXMubm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICAkKHVzZS5ub2RlLCB7XG4gICAgICAgICAgICBcInhsaW5rOmhyZWZcIjogXCIjXCIgKyBpZFxuICAgICAgICB9KTtcbiAgICAgICAgdXNlLm9yaWdpbmFsID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHVzZTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGZpeGlkcyhlbCkge1xuICAgICAgICB2YXIgZWxzID0gZWwuc2VsZWN0QWxsKFwiKlwiKSxcbiAgICAgICAgICAgIGl0LFxuICAgICAgICAgICAgdXJsID0gL15cXHMqdXJsXFwoKFwifCd8KSguKilcXDFcXClcXHMqJC8sXG4gICAgICAgICAgICBpZHMgPSBbXSxcbiAgICAgICAgICAgIHVzZXMgPSB7fTtcbiAgICAgICAgZnVuY3Rpb24gdXJsdGVzdChpdCwgbmFtZSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9ICQoaXQubm9kZSwgbmFtZSk7XG4gICAgICAgICAgICB2YWwgPSB2YWwgJiYgdmFsLm1hdGNoKHVybCk7XG4gICAgICAgICAgICB2YWwgPSB2YWwgJiYgdmFsWzJdO1xuICAgICAgICAgICAgaWYgKHZhbCAmJiB2YWwuY2hhckF0KCkgPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgdXNlc1t2YWxdID0gKHVzZXNbdmFsXSB8fCBbXSkuY29uY2F0KGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBhdHRyW25hbWVdID0gU25hcC51cmwoaWQpO1xuICAgICAgICAgICAgICAgICAgICAkKGl0Lm5vZGUsIGF0dHIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGxpbmt0ZXN0KGl0KSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gJChpdC5ub2RlLCBcInhsaW5rOmhyZWZcIik7XG4gICAgICAgICAgICBpZiAodmFsICYmIHZhbC5jaGFyQXQoKSA9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICB1c2VzW3ZhbF0gPSAodXNlc1t2YWxdIHx8IFtdKS5jb25jYXQoZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0LmF0dHIoXCJ4bGluazpocmVmXCIsIFwiI1wiICsgaWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGVscy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpdCA9IGVsc1tpXTtcbiAgICAgICAgICAgIHVybHRlc3QoaXQsIFwiZmlsbFwiKTtcbiAgICAgICAgICAgIHVybHRlc3QoaXQsIFwic3Ryb2tlXCIpO1xuICAgICAgICAgICAgdXJsdGVzdChpdCwgXCJmaWx0ZXJcIik7XG4gICAgICAgICAgICB1cmx0ZXN0KGl0LCBcIm1hc2tcIik7XG4gICAgICAgICAgICB1cmx0ZXN0KGl0LCBcImNsaXAtcGF0aFwiKTtcbiAgICAgICAgICAgIGxpbmt0ZXN0KGl0KTtcbiAgICAgICAgICAgIHZhciBvbGRpZCA9ICQoaXQubm9kZSwgXCJpZFwiKTtcbiAgICAgICAgICAgIGlmIChvbGRpZCkge1xuICAgICAgICAgICAgICAgICQoaXQubm9kZSwge2lkOiBpdC5pZH0pO1xuICAgICAgICAgICAgICAgIGlkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgb2xkOiBvbGRpZCxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGl0LmlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBpZHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIGZzID0gdXNlc1tpZHNbaV0ub2xkXTtcbiAgICAgICAgICAgIGlmIChmcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IGZzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZnNbal0oaWRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuY2xvbmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgZWxlbWVudCBhbmQgaW5zZXJ0cyBpdCBhZnRlciB0aGUgZWxlbWVudFxuICAgICAqKlxuICAgICA9IChFbGVtZW50KSB0aGUgY2xvbmVcbiAgICBcXCovXG4gICAgZWxwcm90by5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNsb25lID0gd3JhcCh0aGlzLm5vZGUuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgaWYgKCQoY2xvbmUubm9kZSwgXCJpZFwiKSkge1xuICAgICAgICAgICAgJChjbG9uZS5ub2RlLCB7aWQ6IGNsb25lLmlkfSk7XG4gICAgICAgIH1cbiAgICAgICAgZml4aWRzKGNsb25lKTtcbiAgICAgICAgY2xvbmUuaW5zZXJ0QWZ0ZXIodGhpcyk7XG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvRGVmc1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogTW92ZXMgZWxlbWVudCB0byB0aGUgc2hhcmVkIGA8ZGVmcz5gIGFyZWFcbiAgICAgKipcbiAgICAgPSAoRWxlbWVudCkgdGhlIGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by50b0RlZnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZzID0gZ2V0U29tZURlZnModGhpcyk7XG4gICAgICAgIGRlZnMuYXBwZW5kQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50b1BhdHRlcm5cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSBgPHBhdHRlcm4+YCBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgICAqKlxuICAgICAqIFRvIGNyZWF0ZSBhIHBhdHRlcm4geW91IGhhdmUgdG8gc3BlY2lmeSB0aGUgcGF0dGVybiByZWN0OlxuICAgICAtIHggKHN0cmluZ3xudW1iZXIpXG4gICAgIC0geSAoc3RyaW5nfG51bWJlcilcbiAgICAgLSB3aWR0aCAoc3RyaW5nfG51bWJlcilcbiAgICAgLSBoZWlnaHQgKHN0cmluZ3xudW1iZXIpXG4gICAgID0gKEVsZW1lbnQpIHRoZSBgPHBhdHRlcm4+YCBlbGVtZW50XG4gICAgICogWW91IGNhbiB1c2UgcGF0dGVybiBsYXRlciBvbiBhcyBhbiBhcmd1bWVudCBmb3IgYGZpbGxgIGF0dHJpYnV0ZTpcbiAgICAgfCB2YXIgcCA9IHBhcGVyLnBhdGgoXCJNMTAtNS0xMCwxNU0xNSwwLDAsMTVNMC01LTIwLDE1XCIpLmF0dHIoe1xuICAgICB8ICAgICAgICAgZmlsbDogXCJub25lXCIsXG4gICAgIHwgICAgICAgICBzdHJva2U6IFwiI2JhZGE1NVwiLFxuICAgICB8ICAgICAgICAgc3Ryb2tlV2lkdGg6IDVcbiAgICAgfCAgICAgfSkucGF0dGVybigwLCAwLCAxMCwgMTApLFxuICAgICB8ICAgICBjID0gcGFwZXIuY2lyY2xlKDIwMCwgMjAwLCAxMDApO1xuICAgICB8IGMuYXR0cih7XG4gICAgIHwgICAgIGZpbGw6IHBcbiAgICAgfCB9KTtcbiAgICBcXCovXG4gICAgZWxwcm90by5wYXR0ZXJuID0gZWxwcm90by50b1BhdHRlcm4gPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB2YXIgcCA9IG1ha2UoXCJwYXR0ZXJuXCIsIGdldFNvbWVEZWZzKHRoaXMpKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICAgICAgeCA9IHRoaXMuZ2V0QkJveCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpcyh4LCBcIm9iamVjdFwiKSAmJiBcInhcIiBpbiB4KSB7XG4gICAgICAgICAgICB5ID0geC55O1xuICAgICAgICAgICAgd2lkdGggPSB4LndpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0geC5oZWlnaHQ7XG4gICAgICAgICAgICB4ID0geC54O1xuICAgICAgICB9XG4gICAgICAgICQocC5ub2RlLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgcGF0dGVyblVuaXRzOiBcInVzZXJTcGFjZU9uVXNlXCIsXG4gICAgICAgICAgICBpZDogcC5pZCxcbiAgICAgICAgICAgIHZpZXdCb3g6IFt4LCB5LCB3aWR0aCwgaGVpZ2h0XS5qb2luKFwiIFwiKVxuICAgICAgICB9KTtcbiAgICAgICAgcC5ub2RlLmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH07XG4vLyBTSUVSUkEgRWxlbWVudC5tYXJrZXIoKTogY2xhcmlmeSB3aGF0IGEgcmVmZXJlbmNlIHBvaW50IGlzLiBFLmcuLCBoZWxwcyB5b3Ugb2Zmc2V0IHRoZSBvYmplY3QgZnJvbSBpdHMgZWRnZSBzdWNoIGFzIHdoZW4gY2VudGVyaW5nIGl0IG92ZXIgYSBwYXRoLlxuLy8gU0lFUlJBIEVsZW1lbnQubWFya2VyKCk6IEkgc3VnZ2VzdCB0aGUgbWV0aG9kIHNob3VsZCBhY2NlcHQgZGVmYXVsdCByZWZlcmVuY2UgcG9pbnQgdmFsdWVzLiAgUGVyaGFwcyBjZW50ZXJlZCB3aXRoIChyZWZYID0gd2lkdGgvMikgYW5kIChyZWZZID0gaGVpZ2h0LzIpPyBBbHNvLCBjb3VsZG4ndCBpdCBhc3N1bWUgdGhlIGVsZW1lbnQncyBjdXJyZW50IF93aWR0aF8gYW5kIF9oZWlnaHRfPyBBbmQgcGxlYXNlIHNwZWNpZnkgd2hhdCBfeF8gYW5kIF95XyBtZWFuOiBvZmZzZXRzPyBJZiBzbywgZnJvbSB3aGVyZT8gIENvdWxkbid0IHRoZXkgYWxzbyBiZSBhc3NpZ25lZCBkZWZhdWx0IHZhbHVlcz9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5tYXJrZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSBgPG1hcmtlcj5gIGVsZW1lbnQgZnJvbSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICoqXG4gICAgICogVG8gY3JlYXRlIGEgbWFya2VyIHlvdSBoYXZlIHRvIHNwZWNpZnkgdGhlIGJvdW5kaW5nIHJlY3QgYW5kIHJlZmVyZW5jZSBwb2ludDpcbiAgICAgLSB4IChudW1iZXIpXG4gICAgIC0geSAobnVtYmVyKVxuICAgICAtIHdpZHRoIChudW1iZXIpXG4gICAgIC0gaGVpZ2h0IChudW1iZXIpXG4gICAgIC0gcmVmWCAobnVtYmVyKVxuICAgICAtIHJlZlkgKG51bWJlcilcbiAgICAgPSAoRWxlbWVudCkgdGhlIGA8bWFya2VyPmAgZWxlbWVudFxuICAgICAqIFlvdSBjYW4gc3BlY2lmeSB0aGUgbWFya2VyIGxhdGVyIGFzIGFuIGFyZ3VtZW50IGZvciBgbWFya2VyLXN0YXJ0YCwgYG1hcmtlci1lbmRgLCBgbWFya2VyLW1pZGAsIGFuZCBgbWFya2VyYCBhdHRyaWJ1dGVzLiBUaGUgYG1hcmtlcmAgYXR0cmlidXRlIHBsYWNlcyB0aGUgbWFya2VyIGF0IGV2ZXJ5IHBvaW50IGFsb25nIHRoZSBwYXRoLCBhbmQgYG1hcmtlci1taWRgIHBsYWNlcyB0aGVtIGF0IGV2ZXJ5IHBvaW50IGV4Y2VwdCB0aGUgc3RhcnQgYW5kIGVuZC5cbiAgICBcXCovXG4gICAgLy8gVE9ETyBhZGQgdXNhZ2UgZm9yIG1hcmtlcnNcbiAgICBlbHByb3RvLm1hcmtlciA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCByZWZYLCByZWZZKSB7XG4gICAgICAgIHZhciBwID0gbWFrZShcIm1hcmtlclwiLCBnZXRTb21lRGVmcyh0aGlzKSk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHtcbiAgICAgICAgICAgIHggPSB0aGlzLmdldEJCb3goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXMoeCwgXCJvYmplY3RcIikgJiYgXCJ4XCIgaW4geCkge1xuICAgICAgICAgICAgeSA9IHgueTtcbiAgICAgICAgICAgIHdpZHRoID0geC53aWR0aDtcbiAgICAgICAgICAgIGhlaWdodCA9IHguaGVpZ2h0O1xuICAgICAgICAgICAgcmVmWCA9IHgucmVmWCB8fCB4LmN4O1xuICAgICAgICAgICAgcmVmWSA9IHgucmVmWSB8fCB4LmN5O1xuICAgICAgICAgICAgeCA9IHgueDtcbiAgICAgICAgfVxuICAgICAgICAkKHAubm9kZSwge1xuICAgICAgICAgICAgdmlld0JveDogW3gsIHksIHdpZHRoLCBoZWlnaHRdLmpvaW4oXCIgXCIpLFxuICAgICAgICAgICAgbWFya2VyV2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgbWFya2VySGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICBvcmllbnQ6IFwiYXV0b1wiLFxuICAgICAgICAgICAgcmVmWDogcmVmWCB8fCAwLFxuICAgICAgICAgICAgcmVmWTogcmVmWSB8fCAwLFxuICAgICAgICAgICAgaWQ6IHAuaWRcbiAgICAgICAgfSk7XG4gICAgICAgIHAubm9kZS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9O1xuICAgIHZhciBlbGRhdGEgPSB7fTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5kYXRhXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIG9yIHJldHJpZXZlcyBnaXZlbiB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggZ2l2ZW4ga2V5LiAoRG9u4oCZdCBjb25mdXNlXG4gICAgICogd2l0aCBgZGF0YS1gIGF0dHJpYnV0ZXMpXG4gICAgICpcbiAgICAgKiBTZWUgYWxzbyBARWxlbWVudC5yZW1vdmVEYXRhXG4gICAgIC0ga2V5IChzdHJpbmcpIGtleSB0byBzdG9yZSBkYXRhXG4gICAgIC0gdmFsdWUgKGFueSkgI29wdGlvbmFsIHZhbHVlIHRvIHN0b3JlXG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICAgKiBvciwgaWYgdmFsdWUgaXMgbm90IHNwZWNpZmllZDpcbiAgICAgPSAoYW55KSB2YWx1ZVxuICAgICA+IFVzYWdlXG4gICAgIHwgZm9yICh2YXIgaSA9IDAsIGkgPCA1LCBpKyspIHtcbiAgICAgfCAgICAgcGFwZXIuY2lyY2xlKDEwICsgMTUgKiBpLCAxMCwgMTApXG4gICAgIHwgICAgICAgICAgLmF0dHIoe2ZpbGw6IFwiIzAwMFwifSlcbiAgICAgfCAgICAgICAgICAuZGF0YShcImlcIiwgaSlcbiAgICAgfCAgICAgICAgICAuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICB8ICAgICAgICAgICAgIGFsZXJ0KHRoaXMuZGF0YShcImlcIikpO1xuICAgICB8ICAgICAgICAgIH0pO1xuICAgICB8IH1cbiAgICBcXCovXG4gICAgZWxwcm90by5kYXRhID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBlbGRhdGFbdGhpcy5pZF0gPSBlbGRhdGFbdGhpcy5pZF0gfHwge307XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgZXZlKFwic25hcC5kYXRhLmdldC5cIiArIHRoaXMuaWQsIHRoaXMsIGRhdGEsIG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgaWYgKFNuYXAuaXMoa2V5LCBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4ga2V5KSBpZiAoa2V5W2hhc10oaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhKGksIGtleVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXZlKFwic25hcC5kYXRhLmdldC5cIiArIHRoaXMuaWQsIHRoaXMsIGRhdGFba2V5XSwga2V5KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgIGV2ZShcInNuYXAuZGF0YS5zZXQuXCIgKyB0aGlzLmlkLCB0aGlzLCB2YWx1ZSwga2V5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5yZW1vdmVEYXRhXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhbiBlbGVtZW50IGJ5IGdpdmVuIGtleS5cbiAgICAgKiBJZiBrZXkgaXMgbm90IHByb3ZpZGVkLCByZW1vdmVzIGFsbCB0aGUgZGF0YSBvZiB0aGUgZWxlbWVudC5cbiAgICAgLSBrZXkgKHN0cmluZykgI29wdGlvbmFsIGtleVxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8ucmVtb3ZlRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICAgICAgICBlbGRhdGFbdGhpcy5pZF0gPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZGF0YVt0aGlzLmlkXSAmJiBkZWxldGUgZWxkYXRhW3RoaXMuaWRdW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5vdXRlclNWR1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBTVkcgY29kZSBmb3IgdGhlIGVsZW1lbnQsIGVxdWl2YWxlbnQgdG8gSFRNTCdzIGBvdXRlckhUTUxgLlxuICAgICAqXG4gICAgICogU2VlIGFsc28gQEVsZW1lbnQuaW5uZXJTVkdcbiAgICAgPSAoc3RyaW5nKSBTVkcgY29kZSBmb3IgdGhlIGVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudG9TdHJpbmdcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFNlZSBARWxlbWVudC5vdXRlclNWR1xuICAgIFxcKi9cbiAgICBlbHByb3RvLm91dGVyU1ZHID0gZWxwcm90by50b1N0cmluZyA9IHRvU3RyaW5nKDEpO1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmlubmVyU1ZHXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIFNWRyBjb2RlIGZvciB0aGUgZWxlbWVudCdzIGNvbnRlbnRzLCBlcXVpdmFsZW50IHRvIEhUTUwncyBgaW5uZXJIVE1MYFxuICAgICA9IChzdHJpbmcpIFNWRyBjb2RlIGZvciB0aGUgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmlubmVyU1ZHID0gdG9TdHJpbmcoKTtcbiAgICBmdW5jdGlvbiB0b1N0cmluZyh0eXBlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gdHlwZSA/IFwiPFwiICsgdGhpcy50eXBlIDogXCJcIixcbiAgICAgICAgICAgICAgICBhdHRyID0gdGhpcy5ub2RlLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgY2hsZCA9IHRoaXMubm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBhdHRyLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9IFwiIFwiICsgYXR0cltpXS5uYW1lICsgJz1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJbaV0udmFsdWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hsZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0eXBlICYmIChyZXMgKz0gXCI+XCIpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGlpID0gY2hsZC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGxkW2ldLm5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSBjaGxkW2ldLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGxkW2ldLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSB3cmFwKGNobGRbaV0pLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHlwZSAmJiAocmVzICs9IFwiPC9cIiArIHRoaXMudHlwZSArIFwiPlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHlwZSAmJiAocmVzICs9IFwiLz5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHByb3RvLnRvRGF0YVVSTCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cuYnRvYSkge1xuICAgICAgICAgICAgdmFyIGJiID0gdGhpcy5nZXRCQm94KCksXG4gICAgICAgICAgICAgICAgc3ZnID0gU25hcC5mb3JtYXQoJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB3aWR0aD1cInt3aWR0aH1cIiBoZWlnaHQ9XCJ7aGVpZ2h0fVwiIHZpZXdCb3g9XCJ7eH0ge3l9IHt3aWR0aH0ge2hlaWdodH1cIj57Y29udGVudHN9PC9zdmc+Jywge1xuICAgICAgICAgICAgICAgIHg6ICtiYi54LnRvRml4ZWQoMyksXG4gICAgICAgICAgICAgICAgeTogK2JiLnkudG9GaXhlZCgzKSxcbiAgICAgICAgICAgICAgICB3aWR0aDogK2JiLndpZHRoLnRvRml4ZWQoMyksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiArYmIuaGVpZ2h0LnRvRml4ZWQoMyksXG4gICAgICAgICAgICAgICAgY29udGVudHM6IHRoaXMub3V0ZXJTVkcoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3ZnKSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRnJhZ21lbnQuc2VsZWN0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBTZWUgQEVsZW1lbnQuc2VsZWN0XG4gICAgXFwqL1xuICAgIEZyYWdtZW50LnByb3RvdHlwZS5zZWxlY3QgPSBlbHByb3RvLnNlbGVjdDtcbiAgICAvKlxcXG4gICAgICogRnJhZ21lbnQuc2VsZWN0QWxsXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBTZWUgQEVsZW1lbnQuc2VsZWN0QWxsXG4gICAgXFwqL1xuICAgIEZyYWdtZW50LnByb3RvdHlwZS5zZWxlY3RBbGwgPSBlbHByb3RvLnNlbGVjdEFsbDtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICBtYXRoID0gTWF0aCxcbiAgICAgICAgRSA9IFwiXCI7XG4gICAgZnVuY3Rpb24gTWF0cml4KGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAgICAgaWYgKGIgPT0gbnVsbCAmJiBvYmplY3RUb1N0cmluZy5jYWxsKGEpID09IFwiW29iamVjdCBTVkdNYXRyaXhdXCIpIHtcbiAgICAgICAgICAgIHRoaXMuYSA9IGEuYTtcbiAgICAgICAgICAgIHRoaXMuYiA9IGEuYjtcbiAgICAgICAgICAgIHRoaXMuYyA9IGEuYztcbiAgICAgICAgICAgIHRoaXMuZCA9IGEuZDtcbiAgICAgICAgICAgIHRoaXMuZSA9IGEuZTtcbiAgICAgICAgICAgIHRoaXMuZiA9IGEuZjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmEgPSArYTtcbiAgICAgICAgICAgIHRoaXMuYiA9ICtiO1xuICAgICAgICAgICAgdGhpcy5jID0gK2M7XG4gICAgICAgICAgICB0aGlzLmQgPSArZDtcbiAgICAgICAgICAgIHRoaXMuZSA9ICtlO1xuICAgICAgICAgICAgdGhpcy5mID0gK2Y7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmEgPSAxO1xuICAgICAgICAgICAgdGhpcy5iID0gMDtcbiAgICAgICAgICAgIHRoaXMuYyA9IDA7XG4gICAgICAgICAgICB0aGlzLmQgPSAxO1xuICAgICAgICAgICAgdGhpcy5lID0gMDtcbiAgICAgICAgICAgIHRoaXMuZiA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKGZ1bmN0aW9uIChtYXRyaXhwcm90bykge1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC5hZGRcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIEFkZHMgdGhlIGdpdmVuIG1hdHJpeCB0byBleGlzdGluZyBvbmVcbiAgICAgICAgIC0gYSAobnVtYmVyKVxuICAgICAgICAgLSBiIChudW1iZXIpXG4gICAgICAgICAtIGMgKG51bWJlcilcbiAgICAgICAgIC0gZCAobnVtYmVyKVxuICAgICAgICAgLSBlIChudW1iZXIpXG4gICAgICAgICAtIGYgKG51bWJlcilcbiAgICAgICAgICogb3JcbiAgICAgICAgIC0gbWF0cml4IChvYmplY3QpIEBNYXRyaXhcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5hZGQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSwgZikge1xuICAgICAgICAgICAgaWYgKGEgJiYgYSBpbnN0YW5jZW9mIE1hdHJpeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChhLmEsIGEuYiwgYS5jLCBhLmQsIGEuZSwgYS5mKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhTmV3ID0gYSAqIHRoaXMuYSArIGIgKiB0aGlzLmMsXG4gICAgICAgICAgICAgICAgYk5ldyA9IGEgKiB0aGlzLmIgKyBiICogdGhpcy5kO1xuICAgICAgICAgICAgdGhpcy5lICs9IGUgKiB0aGlzLmEgKyBmICogdGhpcy5jO1xuICAgICAgICAgICAgdGhpcy5mICs9IGUgKiB0aGlzLmIgKyBmICogdGhpcy5kO1xuICAgICAgICAgICAgdGhpcy5jID0gYyAqIHRoaXMuYSArIGQgKiB0aGlzLmM7XG4gICAgICAgICAgICB0aGlzLmQgPSBjICogdGhpcy5iICsgZCAqIHRoaXMuZDtcblxuICAgICAgICAgICAgdGhpcy5hID0gYU5ldztcbiAgICAgICAgICAgIHRoaXMuYiA9IGJOZXc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXgubXVsdExlZnRcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIE11bHRpcGxpZXMgYSBwYXNzZWQgYWZmaW5lIHRyYW5zZm9ybSB0byB0aGUgbGVmdDogTSAqIHRoaXMuXG4gICAgICAgICAtIGEgKG51bWJlcilcbiAgICAgICAgIC0gYiAobnVtYmVyKVxuICAgICAgICAgLSBjIChudW1iZXIpXG4gICAgICAgICAtIGQgKG51bWJlcilcbiAgICAgICAgIC0gZSAobnVtYmVyKVxuICAgICAgICAgLSBmIChudW1iZXIpXG4gICAgICAgICAqIG9yXG4gICAgICAgICAtIG1hdHJpeCAob2JqZWN0KSBATWF0cml4XG4gICAgICAgIFxcKi9cbiAgICAgICAgTWF0cml4LnByb3RvdHlwZS5tdWx0TGVmdCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgICAgICAgICBpZiAoYSAmJiBhIGluc3RhbmNlb2YgTWF0cml4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdExlZnQoYS5hLCBhLmIsIGEuYywgYS5kLCBhLmUsIGEuZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYU5ldyA9IGEgKiB0aGlzLmEgKyBjICogdGhpcy5iLFxuICAgICAgICAgICAgICAgIGNOZXcgPSBhICogdGhpcy5jICsgYyAqIHRoaXMuZCxcbiAgICAgICAgICAgICAgICBlTmV3ID0gYSAqIHRoaXMuZSArIGMgKiB0aGlzLmYgKyBlO1xuICAgICAgICAgICAgdGhpcy5iID0gYiAqIHRoaXMuYSArIGQgKiB0aGlzLmI7XG4gICAgICAgICAgICB0aGlzLmQgPSBiICogdGhpcy5jICsgZCAqIHRoaXMuZDtcbiAgICAgICAgICAgIHRoaXMuZiA9IGIgKiB0aGlzLmUgKyBkICogdGhpcy5mICsgZjtcblxuICAgICAgICAgICAgdGhpcy5hID0gYU5ldztcbiAgICAgICAgICAgIHRoaXMuYyA9IGNOZXc7XG4gICAgICAgICAgICB0aGlzLmUgPSBlTmV3O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LmludmVydFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUmV0dXJucyBhbiBpbnZlcnRlZCB2ZXJzaW9uIG9mIHRoZSBtYXRyaXhcbiAgICAgICAgID0gKG9iamVjdCkgQE1hdHJpeFxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLmludmVydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgeCA9IG1lLmEgKiBtZS5kIC0gbWUuYiAqIG1lLmM7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeChtZS5kIC8geCwgLW1lLmIgLyB4LCAtbWUuYyAvIHgsIG1lLmEgLyB4LCAobWUuYyAqIG1lLmYgLSBtZS5kICogbWUuZSkgLyB4LCAobWUuYiAqIG1lLmUgLSBtZS5hICogbWUuZikgLyB4KTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguY2xvbmVcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBtYXRyaXhcbiAgICAgICAgID0gKG9iamVjdCkgQE1hdHJpeFxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcy5hLCB0aGlzLmIsIHRoaXMuYywgdGhpcy5kLCB0aGlzLmUsIHRoaXMuZik7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnRyYW5zbGF0ZVxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogVHJhbnNsYXRlIHRoZSBtYXRyaXhcbiAgICAgICAgIC0geCAobnVtYmVyKSBob3Jpem9udGFsIG9mZnNldCBkaXN0YW5jZVxuICAgICAgICAgLSB5IChudW1iZXIpIHZlcnRpY2FsIG9mZnNldCBkaXN0YW5jZVxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICB0aGlzLmUgKz0geCAqIHRoaXMuYSArIHkgKiB0aGlzLmM7XG4gICAgICAgICAgICB0aGlzLmYgKz0geCAqIHRoaXMuYiArIHkgKiB0aGlzLmQ7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguc2NhbGVcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFNjYWxlcyB0aGUgbWF0cml4XG4gICAgICAgICAtIHggKG51bWJlcikgYW1vdW50IHRvIGJlIHNjYWxlZCwgd2l0aCBgMWAgcmVzdWx0aW5nIGluIG5vIGNoYW5nZVxuICAgICAgICAgLSB5IChudW1iZXIpICNvcHRpb25hbCBhbW91bnQgdG8gc2NhbGUgYWxvbmcgdGhlIHZlcnRpY2FsIGF4aXMuIChPdGhlcndpc2UgYHhgIGFwcGxpZXMgdG8gYm90aCBheGVzLilcbiAgICAgICAgIC0gY3ggKG51bWJlcikgI29wdGlvbmFsIGhvcml6b250YWwgb3JpZ2luIHBvaW50IGZyb20gd2hpY2ggdG8gc2NhbGVcbiAgICAgICAgIC0gY3kgKG51bWJlcikgI29wdGlvbmFsIHZlcnRpY2FsIG9yaWdpbiBwb2ludCBmcm9tIHdoaWNoIHRvIHNjYWxlXG4gICAgICAgICAqIERlZmF1bHQgY3gsIGN5IGlzIHRoZSBtaWRkbGUgcG9pbnQgb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uc2NhbGUgPSBmdW5jdGlvbiAoeCwgeSwgY3gsIGN5KSB7XG4gICAgICAgICAgICB5ID09IG51bGwgJiYgKHkgPSB4KTtcbiAgICAgICAgICAgIChjeCB8fCBjeSkgJiYgdGhpcy50cmFuc2xhdGUoY3gsIGN5KTtcbiAgICAgICAgICAgIHRoaXMuYSAqPSB4O1xuICAgICAgICAgICAgdGhpcy5iICo9IHg7XG4gICAgICAgICAgICB0aGlzLmMgKj0geTtcbiAgICAgICAgICAgIHRoaXMuZCAqPSB5O1xuICAgICAgICAgICAgKGN4IHx8IGN5KSAmJiB0aGlzLnRyYW5zbGF0ZSgtY3gsIC1jeSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXgucm90YXRlXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSb3RhdGVzIHRoZSBtYXRyaXhcbiAgICAgICAgIC0gYSAobnVtYmVyKSBhbmdsZSBvZiByb3RhdGlvbiwgaW4gZGVncmVlc1xuICAgICAgICAgLSB4IChudW1iZXIpIGhvcml6b250YWwgb3JpZ2luIHBvaW50IGZyb20gd2hpY2ggdG8gcm90YXRlXG4gICAgICAgICAtIHkgKG51bWJlcikgdmVydGljYWwgb3JpZ2luIHBvaW50IGZyb20gd2hpY2ggdG8gcm90YXRlXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8ucm90YXRlID0gZnVuY3Rpb24gKGEsIHgsIHkpIHtcbiAgICAgICAgICAgIGEgPSBTbmFwLnJhZChhKTtcbiAgICAgICAgICAgIHggPSB4IHx8IDA7XG4gICAgICAgICAgICB5ID0geSB8fCAwO1xuICAgICAgICAgICAgdmFyIGNvcyA9ICttYXRoLmNvcyhhKS50b0ZpeGVkKDkpLFxuICAgICAgICAgICAgICAgIHNpbiA9ICttYXRoLnNpbihhKS50b0ZpeGVkKDkpO1xuICAgICAgICAgICAgdGhpcy5hZGQoY29zLCBzaW4sIC1zaW4sIGNvcywgeCwgeSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoMSwgMCwgMCwgMSwgLXgsIC15KTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguc2tld1hcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFNrZXdzIHRoZSBtYXRyaXggYWxvbmcgdGhlIHgtYXhpc1xuICAgICAgICAgLSB4IChudW1iZXIpIEFuZ2xlIHRvIHNrZXcgYWxvbmcgdGhlIHgtYXhpcyAoaW4gZGVncmVlcykuXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uc2tld1ggPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2tldyh4LCAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguc2tld1lcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFNrZXdzIHRoZSBtYXRyaXggYWxvbmcgdGhlIHktYXhpc1xuICAgICAgICAgLSB5IChudW1iZXIpIEFuZ2xlIHRvIHNrZXcgYWxvbmcgdGhlIHktYXhpcyAoaW4gZGVncmVlcykuXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uc2tld1kgPSBmdW5jdGlvbiAoeSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2tldygwLCB5KTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguc2tld1xuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogU2tld3MgdGhlIG1hdHJpeFxuICAgICAgICAgLSB5IChudW1iZXIpIEFuZ2xlIHRvIHNrZXcgYWxvbmcgdGhlIHktYXhpcyAoaW4gZGVncmVlcykuXG4gICAgICAgICAtIHggKG51bWJlcikgQW5nbGUgdG8gc2tldyBhbG9uZyB0aGUgeC1heGlzIChpbiBkZWdyZWVzKS5cbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5za2V3ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgIHggPSB4IHx8IDA7XG4gICAgICAgICAgICB5ID0geSB8fCAwO1xuICAgICAgICAgICAgeCA9IFNuYXAucmFkKHgpO1xuICAgICAgICAgICAgeSA9IFNuYXAucmFkKHkpO1xuICAgICAgICAgICAgdmFyIGMgPSBtYXRoLnRhbih4KS50b0ZpeGVkKDkpO1xuICAgICAgICAgICAgdmFyIGIgPSBtYXRoLnRhbih5KS50b0ZpeGVkKDkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKDEsIGIsIGMsIDEsIDAsIDApO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC54XG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSZXR1cm5zIHggY29vcmRpbmF0ZSBmb3IgZ2l2ZW4gcG9pbnQgYWZ0ZXIgdHJhbnNmb3JtYXRpb24gZGVzY3JpYmVkIGJ5IHRoZSBtYXRyaXguIFNlZSBhbHNvIEBNYXRyaXgueVxuICAgICAgICAgLSB4IChudW1iZXIpXG4gICAgICAgICAtIHkgKG51bWJlcilcbiAgICAgICAgID0gKG51bWJlcikgeFxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnggPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgcmV0dXJuIHggKiB0aGlzLmEgKyB5ICogdGhpcy5jICsgdGhpcy5lO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC55XG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSZXR1cm5zIHkgY29vcmRpbmF0ZSBmb3IgZ2l2ZW4gcG9pbnQgYWZ0ZXIgdHJhbnNmb3JtYXRpb24gZGVzY3JpYmVkIGJ5IHRoZSBtYXRyaXguIFNlZSBhbHNvIEBNYXRyaXgueFxuICAgICAgICAgLSB4IChudW1iZXIpXG4gICAgICAgICAtIHkgKG51bWJlcilcbiAgICAgICAgID0gKG51bWJlcikgeVxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnkgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgcmV0dXJuIHggKiB0aGlzLmIgKyB5ICogdGhpcy5kICsgdGhpcy5mO1xuICAgICAgICB9O1xuICAgICAgICBtYXRyaXhwcm90by5nZXQgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzW1N0ci5mcm9tQ2hhckNvZGUoOTcgKyBpKV0udG9GaXhlZCg0KTtcbiAgICAgICAgfTtcbiAgICAgICAgbWF0cml4cHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXgoXCIgKyBbdGhpcy5nZXQoMCksIHRoaXMuZ2V0KDEpLCB0aGlzLmdldCgyKSwgdGhpcy5nZXQoMyksIHRoaXMuZ2V0KDQpLCB0aGlzLmdldCg1KV0uam9pbigpICsgXCIpXCI7XG4gICAgICAgIH07XG4gICAgICAgIG1hdHJpeHByb3RvLm9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5lLnRvRml4ZWQoNCksIHRoaXMuZi50b0ZpeGVkKDQpXTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gbm9ybShhKSB7XG4gICAgICAgICAgICByZXR1cm4gYVswXSAqIGFbMF0gKyBhWzFdICogYVsxXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBub3JtYWxpemUoYSkge1xuICAgICAgICAgICAgdmFyIG1hZyA9IG1hdGguc3FydChub3JtKGEpKTtcbiAgICAgICAgICAgIGFbMF0gJiYgKGFbMF0gLz0gbWFnKTtcbiAgICAgICAgICAgIGFbMV0gJiYgKGFbMV0gLz0gbWFnKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC5kZXRlcm1pbmFudFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogRmluZHMgZGV0ZXJtaW5hbnQgb2YgdGhlIGdpdmVuIG1hdHJpeC5cbiAgICAgICAgID0gKG51bWJlcikgZGV0ZXJtaW5hbnRcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5kZXRlcm1pbmFudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmEgKiB0aGlzLmQgLSB0aGlzLmIgKiB0aGlzLmM7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnNwbGl0XG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBTcGxpdHMgbWF0cml4IGludG8gcHJpbWl0aXZlIHRyYW5zZm9ybWF0aW9uc1xuICAgICAgICAgPSAob2JqZWN0KSBpbiBmb3JtYXQ6XG4gICAgICAgICBvIGR4IChudW1iZXIpIHRyYW5zbGF0aW9uIGJ5IHhcbiAgICAgICAgIG8gZHkgKG51bWJlcikgdHJhbnNsYXRpb24gYnkgeVxuICAgICAgICAgbyBzY2FsZXggKG51bWJlcikgc2NhbGUgYnkgeFxuICAgICAgICAgbyBzY2FsZXkgKG51bWJlcikgc2NhbGUgYnkgeVxuICAgICAgICAgbyBzaGVhciAobnVtYmVyKSBzaGVhclxuICAgICAgICAgbyByb3RhdGUgKG51bWJlcikgcm90YXRpb24gaW4gZGVnXG4gICAgICAgICBvIGlzU2ltcGxlIChib29sZWFuKSBjb3VsZCBpdCBiZSByZXByZXNlbnRlZCB2aWEgc2ltcGxlIHRyYW5zZm9ybWF0aW9uc1xuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnNwbGl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dCA9IHt9O1xuICAgICAgICAgICAgLy8gdHJhbnNsYXRpb25cbiAgICAgICAgICAgIG91dC5keCA9IHRoaXMuZTtcbiAgICAgICAgICAgIG91dC5keSA9IHRoaXMuZjtcblxuICAgICAgICAgICAgLy8gc2NhbGUgYW5kIHNoZWFyXG4gICAgICAgICAgICB2YXIgcm93ID0gW1t0aGlzLmEsIHRoaXMuYl0sIFt0aGlzLmMsIHRoaXMuZF1dO1xuICAgICAgICAgICAgb3V0LnNjYWxleCA9IG1hdGguc3FydChub3JtKHJvd1swXSkpO1xuICAgICAgICAgICAgbm9ybWFsaXplKHJvd1swXSk7XG5cbiAgICAgICAgICAgIG91dC5zaGVhciA9IHJvd1swXVswXSAqIHJvd1sxXVswXSArIHJvd1swXVsxXSAqIHJvd1sxXVsxXTtcbiAgICAgICAgICAgIHJvd1sxXSA9IFtyb3dbMV1bMF0gLSByb3dbMF1bMF0gKiBvdXQuc2hlYXIsIHJvd1sxXVsxXSAtIHJvd1swXVsxXSAqIG91dC5zaGVhcl07XG5cbiAgICAgICAgICAgIG91dC5zY2FsZXkgPSBtYXRoLnNxcnQobm9ybShyb3dbMV0pKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZShyb3dbMV0pO1xuICAgICAgICAgICAgb3V0LnNoZWFyIC89IG91dC5zY2FsZXk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRldGVybWluYW50KCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgb3V0LnNjYWxleCA9IC1vdXQuc2NhbGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByb3RhdGlvblxuICAgICAgICAgICAgdmFyIHNpbiA9IHJvd1swXVsxXSxcbiAgICAgICAgICAgICAgICBjb3MgPSByb3dbMV1bMV07XG4gICAgICAgICAgICBpZiAoY29zIDwgMCkge1xuICAgICAgICAgICAgICAgIG91dC5yb3RhdGUgPSBTbmFwLmRlZyhtYXRoLmFjb3MoY29zKSk7XG4gICAgICAgICAgICAgICAgaWYgKHNpbiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnJvdGF0ZSA9IDM2MCAtIG91dC5yb3RhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQucm90YXRlID0gU25hcC5kZWcobWF0aC5hc2luKHNpbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXQuaXNTaW1wbGUgPSAhK291dC5zaGVhci50b0ZpeGVkKDkpICYmIChvdXQuc2NhbGV4LnRvRml4ZWQoOSkgPT0gb3V0LnNjYWxleS50b0ZpeGVkKDkpIHx8ICFvdXQucm90YXRlKTtcbiAgICAgICAgICAgIG91dC5pc1N1cGVyU2ltcGxlID0gIStvdXQuc2hlYXIudG9GaXhlZCg5KSAmJiBvdXQuc2NhbGV4LnRvRml4ZWQoOSkgPT0gb3V0LnNjYWxleS50b0ZpeGVkKDkpICYmICFvdXQucm90YXRlO1xuICAgICAgICAgICAgb3V0Lm5vUm90YXRpb24gPSAhK291dC5zaGVhci50b0ZpeGVkKDkpICYmICFvdXQucm90YXRlO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXgudG9UcmFuc2Zvcm1TdHJpbmdcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJldHVybnMgdHJhbnNmb3JtIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgZ2l2ZW4gbWF0cml4XG4gICAgICAgICA9IChzdHJpbmcpIHRyYW5zZm9ybSBzdHJpbmdcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by50b1RyYW5zZm9ybVN0cmluZyA9IGZ1bmN0aW9uIChzaG9ydGVyKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHNob3J0ZXIgfHwgdGhpcy5zcGxpdCgpO1xuICAgICAgICAgICAgaWYgKCErcy5zaGVhci50b0ZpeGVkKDkpKSB7XG4gICAgICAgICAgICAgICAgcy5zY2FsZXggPSArcy5zY2FsZXgudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICBzLnNjYWxleSA9ICtzLnNjYWxleS50b0ZpeGVkKDQpO1xuICAgICAgICAgICAgICAgIHMucm90YXRlID0gK3Mucm90YXRlLnRvRml4ZWQoNCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICAocy5keCB8fCBzLmR5ID8gXCJ0XCIgKyBbK3MuZHgudG9GaXhlZCg0KSwgK3MuZHkudG9GaXhlZCg0KV0gOiBFKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5yb3RhdGUgPyBcInJcIiArIFsrcy5yb3RhdGUudG9GaXhlZCg0KSwgMCwgMF0gOiBFKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5zY2FsZXggIT0gMSB8fCBzLnNjYWxleSAhPSAxID8gXCJzXCIgKyBbcy5zY2FsZXgsIHMuc2NhbGV5LCAwLCAwXSA6IEUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJtXCIgKyBbdGhpcy5nZXQoMCksIHRoaXMuZ2V0KDEpLCB0aGlzLmdldCgyKSwgdGhpcy5nZXQoMyksIHRoaXMuZ2V0KDQpLCB0aGlzLmdldCg1KV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkoTWF0cml4LnByb3RvdHlwZSk7XG4gICAgLypcXFxuICAgICAqIFNuYXAuTWF0cml4XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBNYXRyaXggY29uc3RydWN0b3IsIGV4dGVuZCBvbiB5b3VyIG93biByaXNrLlxuICAgICAqIFRvIGNyZWF0ZSBtYXRyaWNlcyB1c2UgQFNuYXAubWF0cml4LlxuICAgIFxcKi9cbiAgICBTbmFwLk1hdHJpeCA9IE1hdHJpeDtcbiAgICAvKlxcXG4gICAgICogU25hcC5tYXRyaXhcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhIG1hdHJpeCBiYXNlZCBvbiB0aGUgZ2l2ZW4gcGFyYW1ldGVyc1xuICAgICAtIGEgKG51bWJlcilcbiAgICAgLSBiIChudW1iZXIpXG4gICAgIC0gYyAobnVtYmVyKVxuICAgICAtIGQgKG51bWJlcilcbiAgICAgLSBlIChudW1iZXIpXG4gICAgIC0gZiAobnVtYmVyKVxuICAgICAqIG9yXG4gICAgIC0gc3ZnTWF0cml4IChTVkdNYXRyaXgpXG4gICAgID0gKG9iamVjdCkgQE1hdHJpeFxuICAgIFxcKi9cbiAgICBTbmFwLm1hdHJpeCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KGEsIGIsIGMsIGQsIGUsIGYpO1xuICAgIH07XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBoYXMgPSBcImhhc093blByb3BlcnR5XCIsXG4gICAgICAgIG1ha2UgPSBTbmFwLl8ubWFrZSxcbiAgICAgICAgd3JhcCA9IFNuYXAuXy53cmFwLFxuICAgICAgICBpcyA9IFNuYXAuaXMsXG4gICAgICAgIGdldFNvbWVEZWZzID0gU25hcC5fLmdldFNvbWVEZWZzLFxuICAgICAgICByZVVSTFZhbHVlID0gL151cmxcXCgoWydcIl0/KShbXildKylcXDFcXCkkLyxcbiAgICAgICAgJCA9IFNuYXAuXy4kLFxuICAgICAgICBVUkwgPSBTbmFwLnVybCxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICBzZXBhcmF0b3IgPSBTbmFwLl8uc2VwYXJhdG9yLFxuICAgICAgICBFID0gXCJcIjtcbiAgICAvKlxcXG4gICAgICogU25hcC5kZXVybFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVW53cmFwcyBwYXRoIGZyb20gYFwidXJsKDxwYXRoPilcImAuXG4gICAgIC0gdmFsdWUgKHN0cmluZykgdXJsIHBhdGhcbiAgICAgPSAoc3RyaW5nKSB1bndyYXBwZWQgcGF0aFxuICAgIFxcKi9cbiAgICBTbmFwLmRldXJsID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciByZXMgPSBTdHJpbmcodmFsdWUpLm1hdGNoKHJlVVJMVmFsdWUpO1xuICAgICAgICByZXR1cm4gcmVzID8gcmVzWzJdIDogdmFsdWU7XG4gICAgfVxuICAgIC8vIEF0dHJpYnV0ZXMgZXZlbnQgaGFuZGxlcnNcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5tYXNrXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGcmFnbWVudCAmJiB2YWx1ZS5ub2RlLmNoaWxkTm9kZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICBnZXRTb21lRGVmcyh0aGlzKS5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZS50eXBlID09IFwibWFza1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hc2sgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFzayA9IG1ha2UoXCJtYXNrXCIsIGdldFNvbWVEZWZzKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBtYXNrLm5vZGUuYXBwZW5kQ2hpbGQodmFsdWUubm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAhbWFzay5ub2RlLmlkICYmICQobWFzay5ub2RlLCB7XG4gICAgICAgICAgICAgICAgaWQ6IG1hc2suaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtcbiAgICAgICAgICAgICAgICBtYXNrOiBVUkwobWFzay5pZClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgKGZ1bmN0aW9uIChjbGlwSXQpIHtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuY2xpcFwiLCBjbGlwSXQpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5jbGlwLXBhdGhcIiwgY2xpcEl0KTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuY2xpcFBhdGhcIiwgY2xpcEl0KTtcbiAgICB9KGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICB2YXIgY2xpcCxcbiAgICAgICAgICAgICAgICBub2RlID0gdmFsdWUubm9kZTtcbiAgICAgICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IFwiY2xpcFBhdGhcIikge1xuICAgICAgICAgICAgICAgICAgICBjbGlwID0gbmV3IEVsZW1lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICBjbGlwID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXAgPSBtYWtlKFwiY2xpcFBhdGhcIiwgZ2V0U29tZURlZnModGhpcykpO1xuICAgICAgICAgICAgICAgIGNsaXAubm9kZS5hcHBlbmRDaGlsZCh2YWx1ZS5ub2RlKTtcbiAgICAgICAgICAgICAgICAhY2xpcC5ub2RlLmlkICYmICQoY2xpcC5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBjbGlwLmlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMubm9kZSwge1xuICAgICAgICAgICAgICAgIFwiY2xpcC1wYXRoXCI6IFVSTChjbGlwLm5vZGUuaWQgfHwgY2xpcC5pZClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIGZ1bmN0aW9uIGZpbGxTdHJva2UobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnJhZ21lbnQgJiYgdmFsdWUubm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxICYmXG4gICAgICAgICAgICAgICAgKHZhbHVlLm5vZGUuZmlyc3RDaGlsZC50YWdOYW1lID09IFwicmFkaWFsR3JhZGllbnRcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlLm5vZGUuZmlyc3RDaGlsZC50YWdOYW1lID09IFwibGluZWFyR3JhZGllbnRcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlLm5vZGUuZmlyc3RDaGlsZC50YWdOYW1lID09IFwicGF0dGVyblwiKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUubm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIGdldFNvbWVEZWZzKHRoaXMpLmFwcGVuZENoaWxkKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXAodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS50eXBlID09IFwicmFkaWFsR3JhZGllbnRcIiB8fCB2YWx1ZS50eXBlID09IFwibGluZWFyR3JhZGllbnRcIlxuICAgICAgICAgICAgICAgICAgIHx8IHZhbHVlLnR5cGUgPT0gXCJwYXR0ZXJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZS5ub2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHZhbHVlLm5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogdmFsdWUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWxsID0gVVJMKHZhbHVlLm5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGwgPSB2YWx1ZS5hdHRyKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsbCA9IFNuYXAuY29sb3IodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxsLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBncmFkID0gU25hcChnZXRTb21lRGVmcyh0aGlzKS5vd25lclNWR0VsZW1lbnQpLmdyYWRpZW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZ3JhZC5ub2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChncmFkLm5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGdyYWQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGwgPSBVUkwoZ3JhZC5ub2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGwgPSBTdHIoZmlsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGF0dHJzID0ge307XG4gICAgICAgICAgICBhdHRyc1tuYW1lXSA9IGZpbGw7XG4gICAgICAgICAgICAkKHRoaXMubm9kZSwgYXR0cnMpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnN0eWxlW25hbWVdID0gRTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuZmlsbFwiLCBmaWxsU3Ryb2tlKFwiZmlsbFwiKSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuc3Ryb2tlXCIsIGZpbGxTdHJva2UoXCJzdHJva2VcIikpO1xuICAgIHZhciBncmFkcmcgPSAvXihbbHJdKSg/OlxcKChbXildKilcXCkpPyguKikkL2k7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdyYWQucGFyc2VcIiwgZnVuY3Rpb24gcGFyc2VHcmFkKHN0cmluZykge1xuICAgICAgICBzdHJpbmcgPSBTdHIoc3RyaW5nKTtcbiAgICAgICAgdmFyIHRva2VucyA9IHN0cmluZy5tYXRjaChncmFkcmcpO1xuICAgICAgICBpZiAoIXRva2Vucykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHR5cGUgPSB0b2tlbnNbMV0sXG4gICAgICAgICAgICBwYXJhbXMgPSB0b2tlbnNbMl0sXG4gICAgICAgICAgICBzdG9wcyA9IHRva2Vuc1szXTtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLnNwbGl0KC9cXHMqLFxccyovKS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gK2VsID09IGVsID8gK2VsIDogZWw7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PSAxICYmIHBhcmFtc1swXSA9PSAwKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBzdG9wcyA9IHN0b3BzLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgc3RvcHMgPSBzdG9wcy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbCA9IGVsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICAgIHZhciBvdXQgPSB7XG4gICAgICAgICAgICAgICAgY29sb3I6IGVsWzBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGVsWzFdKSB7XG4gICAgICAgICAgICAgICAgb3V0Lm9mZnNldCA9IHBhcnNlRmxvYXQoZWxbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBsZW4gPSBzdG9wcy5sZW5ndGgsXG4gICAgICAgICAgICBzdGFydCA9IDAsXG4gICAgICAgICAgICBqID0gMDtcbiAgICAgICAgZnVuY3Rpb24gc2VlZChpLCBlbmQpIHtcbiAgICAgICAgICAgIHZhciBzdGVwID0gKGVuZCAtIHN0YXJ0KSAvIChpIC0gaik7XG4gICAgICAgICAgICBmb3IgKHZhciBrID0gajsgayA8IGk7IGsrKykge1xuICAgICAgICAgICAgICAgIHN0b3BzW2tdLm9mZnNldCA9ICsoK3N0YXJ0ICsgc3RlcCAqIChrIC0gaikpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqID0gaTtcbiAgICAgICAgICAgIHN0YXJ0ID0gZW5kO1xuICAgICAgICB9XG4gICAgICAgIGxlbi0tO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSBpZiAoXCJvZmZzZXRcIiBpbiBzdG9wc1tpXSkge1xuICAgICAgICAgICAgc2VlZChpLCBzdG9wc1tpXS5vZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHN0b3BzW2xlbl0ub2Zmc2V0ID0gc3RvcHNbbGVuXS5vZmZzZXQgfHwgMTAwO1xuICAgICAgICBzZWVkKGxlbiwgc3RvcHNbbGVuXS5vZmZzZXQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICAgICAgc3RvcHM6IHN0b3BzXG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5kXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICBpZiAoaXModmFsdWUsIFwiYXJyYXlcIikgJiYgaXModmFsdWVbMF0sIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gU25hcC5wYXRoLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlID0gU3RyKHZhbHVlKTtcbiAgICAgICAgaWYgKHZhbHVlLm1hdGNoKC9bcnVvXS9pKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBTbmFwLnBhdGgudG9BYnNvbHV0ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLm5vZGUsIHtkOiB2YWx1ZX0pO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci4jdGV4dFwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgdmFsdWUgPSBTdHIodmFsdWUpO1xuICAgICAgICB2YXIgdHh0ID0gZ2xvYi5kb2MuY3JlYXRlVGV4dE5vZGUodmFsdWUpO1xuICAgICAgICB3aGlsZSAodGhpcy5ub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHR4dCk7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLnBhdGhcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHRoaXMuYXR0cih7ZDogdmFsdWV9KTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuY2xhc3NcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHRoaXMubm9kZS5jbGFzc05hbWUuYmFzZVZhbCA9IHZhbHVlO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci52aWV3Qm94XCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgdmI7XG4gICAgICAgIGlmIChpcyh2YWx1ZSwgXCJvYmplY3RcIikgJiYgXCJ4XCIgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIHZiID0gW3ZhbHVlLngsIHZhbHVlLnksIHZhbHVlLndpZHRoLCB2YWx1ZS5oZWlnaHRdLmpvaW4oXCIgXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzKHZhbHVlLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICB2YiA9IHZhbHVlLmpvaW4oXCIgXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmIgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMubm9kZSwge1xuICAgICAgICAgICAgdmlld0JveDogdmJcbiAgICAgICAgfSk7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLnRyYW5zZm9ybVwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0odmFsdWUpO1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5yXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50eXBlID09IFwicmVjdFwiKSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtcbiAgICAgICAgICAgICAgICByeDogdmFsdWUsXG4gICAgICAgICAgICAgICAgcnk6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci50ZXh0cGF0aFwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcInRleHRcIikge1xuICAgICAgICAgICAgdmFyIGlkLCB0cCwgbm9kZTtcbiAgICAgICAgICAgIGlmICghdmFsdWUgJiYgdGhpcy50ZXh0UGF0aCkge1xuICAgICAgICAgICAgICAgIHRwID0gdGhpcy50ZXh0UGF0aDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHAubm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZCh0cC5ub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy50ZXh0UGF0aDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXModmFsdWUsIFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZnMgPSBnZXRTb21lRGVmcyh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHdyYXAoZGVmcy5wYXJlbnROb2RlKS5wYXRoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBkZWZzLmFwcGVuZENoaWxkKHBhdGgubm9kZSk7XG4gICAgICAgICAgICAgICAgaWQgPSBwYXRoLmlkO1xuICAgICAgICAgICAgICAgIHBhdGguYXR0cih7aWQ6IGlkfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZCA9IHZhbHVlLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmF0dHIoe2lkOiBpZH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgdHAgPSB0aGlzLnRleHRQYXRoO1xuICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKHRwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRwLmF0dHIoe1wieGxpbms6aHJlZlwiOiBcIiNcIiArIGlkfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHAgPSAkKFwidGV4dFBhdGhcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ4bGluazpocmVmXCI6IFwiI1wiICsgaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwLmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZCh0cCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFBhdGggPSB3cmFwKHRwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIudGV4dFwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcInRleHRcIikge1xuICAgICAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLm5vZGUsXG4gICAgICAgICAgICAgICAgdHVuZXIgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG91dCA9ICQoXCJ0c3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzKGNodW5rLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0LmFwcGVuZENoaWxkKHR1bmVyKGNodW5rW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQuYXBwZW5kQ2hpbGQoZ2xvYi5kb2MuY3JlYXRlVGV4dE5vZGUoY2h1bmspKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXQubm9ybWFsaXplICYmIG91dC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0dW5lZCA9IHR1bmVyKHZhbHVlKTtcbiAgICAgICAgICAgIHdoaWxlICh0dW5lZC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZCh0dW5lZC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldmUuc3RvcCgpO1xuICAgIH0pKC0xKTtcbiAgICBmdW5jdGlvbiBzZXRGb250U2l6ZSh2YWx1ZSkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICBpZiAodmFsdWUgPT0gK3ZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLnN0eWxlLmZvbnRTaXplID0gdmFsdWU7XG4gICAgfVxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmZvbnRTaXplXCIsIHNldEZvbnRTaXplKSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuZm9udC1zaXplXCIsIHNldEZvbnRTaXplKSgtMSk7XG5cblxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSgpO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci50ZXh0cGF0aFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRQYXRoO1xuICAgIH0pKC0xKTtcbiAgICAvLyBNYXJrZXJzXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gZ2V0dGVyKGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IGdsb2IuZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUodGhpcy5ub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwibWFya2VyLVwiICsgZW5kKTtcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUgPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTbmFwKGdsb2IuZG9jLmdldEVsZW1lbnRCeUlkKHN0eWxlLm1hdGNoKHJlVVJMVmFsdWUpWzFdKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzZXR0ZXIoZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IFwibWFya2VyXCIgKyBlbmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBlbmQuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIlwiIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc3R5bGVbbmFtZV0gPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PSBcIm1hcmtlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHZhbHVlLm5vZGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodmFsdWUubm9kZSwge2lkOiB2YWx1ZS5pZH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zdHlsZVtuYW1lXSA9IFVSTChpZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlci1lbmRcIiwgZ2V0dGVyKFwiZW5kXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlckVuZFwiLCBnZXR0ZXIoXCJlbmRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIubWFya2VyLXN0YXJ0XCIsIGdldHRlcihcInN0YXJ0XCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlclN0YXJ0XCIsIGdldHRlcihcInN0YXJ0XCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlci1taWRcIiwgZ2V0dGVyKFwibWlkXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlck1pZFwiLCBnZXR0ZXIoXCJtaWRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyLWVuZFwiLCBzZXR0ZXIoXCJlbmRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyRW5kXCIsIHNldHRlcihcImVuZFwiKSkoLTEpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5tYXJrZXItc3RhcnRcIiwgc2V0dGVyKFwic3RhcnRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyU3RhcnRcIiwgc2V0dGVyKFwic3RhcnRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyLW1pZFwiLCBzZXR0ZXIoXCJtaWRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyTWlkXCIsIHNldHRlcihcIm1pZFwiKSkoLTEpO1xuICAgIH0oKSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIuclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJyZWN0XCIgJiYgJCh0aGlzLm5vZGUsIFwicnhcIikgPT0gJCh0aGlzLm5vZGUsIFwicnlcIikpIHtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzLm5vZGUsIFwicnhcIik7XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZnVuY3Rpb24gdGV4dEV4dHJhY3Qobm9kZSkge1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaS5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgb3V0LnB1c2goY2hpLm5vZGVWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hpLnRhZ05hbWUgPT0gXCJ0c3BhblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxICYmIGNoaS5maXJzdENoaWxkLm5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2goY2hpLmZpcnN0Q2hpbGQubm9kZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaCh0ZXh0RXh0cmFjdChjaGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIudGV4dFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJ0ZXh0XCIgfHwgdGhpcy50eXBlID09IFwidHNwYW5cIikge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIHZhciBvdXQgPSB0ZXh0RXh0cmFjdCh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIG91dC5sZW5ndGggPT0gMSA/IG91dFswXSA6IG91dDtcbiAgICAgICAgfVxuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci4jdGV4dFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUudGV4dENvbnRlbnQ7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLmZpbGxcIiwgZnVuY3Rpb24gKGludGVybmFsKSB7XG4gICAgICAgIGlmIChpbnRlcm5hbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHZhciB2YWx1ZSA9IGV2ZShcInNuYXAudXRpbC5nZXRhdHRyLmZpbGxcIiwgdGhpcywgdHJ1ZSkuZmlyc3REZWZpbmVkKCk7XG4gICAgICAgIHJldHVybiBTbmFwKFNuYXAuZGV1cmwodmFsdWUpKSB8fCB2YWx1ZTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIuc3Ryb2tlXCIsIGZ1bmN0aW9uIChpbnRlcm5hbCkge1xuICAgICAgICBpZiAoaW50ZXJuYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB2YXIgdmFsdWUgPSBldmUoXCJzbmFwLnV0aWwuZ2V0YXR0ci5zdHJva2VcIiwgdGhpcywgdHJ1ZSkuZmlyc3REZWZpbmVkKCk7XG4gICAgICAgIHJldHVybiBTbmFwKFNuYXAuZGV1cmwodmFsdWUpKSB8fCB2YWx1ZTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIudmlld0JveFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHZhciB2YiA9ICQodGhpcy5ub2RlLCBcInZpZXdCb3hcIik7XG4gICAgICAgIGlmICh2Yikge1xuICAgICAgICAgICAgdmIgPSB2Yi5zcGxpdChzZXBhcmF0b3IpO1xuICAgICAgICAgICAgcmV0dXJuIFNuYXAuXy5ib3goK3ZiWzBdLCArdmJbMV0sICt2YlsyXSwgK3ZiWzNdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5wb2ludHNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcCA9ICQodGhpcy5ub2RlLCBcInBvaW50c1wiKTtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgaWYgKHApIHtcbiAgICAgICAgICAgIHJldHVybiBwLnNwbGl0KHNlcGFyYXRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIucGF0aFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwID0gJCh0aGlzLm5vZGUsIFwiZFwiKTtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLmNsYXNzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5jbGFzc05hbWUuYmFzZVZhbDtcbiAgICB9KSgtMSk7XG4gICAgZnVuY3Rpb24gZ2V0Rm9udFNpemUoKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuc3R5bGUuZm9udFNpemU7XG4gICAgfVxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLmZvbnRTaXplXCIsIGdldEZvbnRTaXplKSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIuZm9udC1zaXplXCIsIGdldEZvbnRTaXplKSgtMSk7XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE0IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciByZ05vdFNwYWNlID0gL1xcUysvZyxcbiAgICAgICAgcmdCYWRTcGFjZSA9IC9bXFx0XFxyXFxuXFxmXS9nLFxuICAgICAgICByZ1RyaW0gPSAvKF5cXHMrfFxccyskKS9nLFxuICAgICAgICBTdHIgPSBTdHJpbmcsXG4gICAgICAgIGVscHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5hZGRDbGFzc1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBnaXZlbiBjbGFzcyBuYW1lIG9yIGxpc3Qgb2YgY2xhc3MgbmFtZXMgdG8gdGhlIGVsZW1lbnQuXG4gICAgIC0gdmFsdWUgKHN0cmluZykgY2xhc3MgbmFtZSBvciBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgICAqKlxuICAgICA9IChFbGVtZW50KSBvcmlnaW5hbCBlbGVtZW50LlxuICAgIFxcKi9cbiAgICBlbHByb3RvLmFkZENsYXNzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3RyKHZhbHVlIHx8IFwiXCIpLm1hdGNoKHJnTm90U3BhY2UpIHx8IFtdLFxuICAgICAgICAgICAgZWxlbSA9IHRoaXMubm9kZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLmJhc2VWYWwsXG4gICAgICAgICAgICBjdXJDbGFzc2VzID0gY2xhc3NOYW1lLm1hdGNoKHJnTm90U3BhY2UpIHx8IFtdLFxuICAgICAgICAgICAgaixcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgIGNsYXp6LFxuICAgICAgICAgICAgZmluYWxWYWx1ZTtcblxuICAgICAgICBpZiAoY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNsYXp6ID0gY2xhc3Nlc1tqKytdKSB7XG4gICAgICAgICAgICAgICAgcG9zID0gY3VyQ2xhc3Nlcy5pbmRleE9mKGNsYXp6KTtcbiAgICAgICAgICAgICAgICBpZiAoIX5wb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2xhc3Nlcy5wdXNoKGNsYXp6KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbmFsVmFsdWUgPSBjdXJDbGFzc2VzLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSAhPSBmaW5hbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUuYmFzZVZhbCA9IGZpbmFsVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5yZW1vdmVDbGFzc1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBnaXZlbiBjbGFzcyBuYW1lIG9yIGxpc3Qgb2YgY2xhc3MgbmFtZXMgZnJvbSB0aGUgZWxlbWVudC5cbiAgICAgLSB2YWx1ZSAoc3RyaW5nKSBjbGFzcyBuYW1lIG9yIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAgICoqXG4gICAgID0gKEVsZW1lbnQpIG9yaWdpbmFsIGVsZW1lbnQuXG4gICAgXFwqL1xuICAgIGVscHJvdG8ucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBTdHIodmFsdWUgfHwgXCJcIikubWF0Y2gocmdOb3RTcGFjZSkgfHwgW10sXG4gICAgICAgICAgICBlbGVtID0gdGhpcy5ub2RlLFxuICAgICAgICAgICAgY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUuYmFzZVZhbCxcbiAgICAgICAgICAgIGN1ckNsYXNzZXMgPSBjbGFzc05hbWUubWF0Y2gocmdOb3RTcGFjZSkgfHwgW10sXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgY2xhenosXG4gICAgICAgICAgICBmaW5hbFZhbHVlO1xuICAgICAgICBpZiAoY3VyQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNsYXp6ID0gY2xhc3Nlc1tqKytdKSB7XG4gICAgICAgICAgICAgICAgcG9zID0gY3VyQ2xhc3Nlcy5pbmRleE9mKGNsYXp6KTtcbiAgICAgICAgICAgICAgICBpZiAofnBvcykge1xuICAgICAgICAgICAgICAgICAgICBjdXJDbGFzc2VzLnNwbGljZShwb3MsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmluYWxWYWx1ZSA9IGN1ckNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lICE9IGZpbmFsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTmFtZS5iYXNlVmFsID0gZmluYWxWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50Lmhhc0NsYXNzXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGVsZW1lbnQgaGFzIGEgZ2l2ZW4gY2xhc3MgbmFtZSBpbiB0aGUgbGlzdCBvZiBjbGFzcyBuYW1lcyBhcHBsaWVkIHRvIGl0LlxuICAgICAtIHZhbHVlIChzdHJpbmcpIGNsYXNzIG5hbWVcbiAgICAgKipcbiAgICAgPSAoYm9vbGVhbikgYHRydWVgIGlmIHRoZSBlbGVtZW50IGhhcyBnaXZlbiBjbGFzc1xuICAgIFxcKi9cbiAgICBlbHByb3RvLmhhc0NsYXNzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBlbGVtID0gdGhpcy5ub2RlLFxuICAgICAgICAgICAgY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUuYmFzZVZhbCxcbiAgICAgICAgICAgIGN1ckNsYXNzZXMgPSBjbGFzc05hbWUubWF0Y2gocmdOb3RTcGFjZSkgfHwgW107XG4gICAgICAgIHJldHVybiAhIX5jdXJDbGFzc2VzLmluZGV4T2YodmFsdWUpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudG9nZ2xlQ2xhc3NcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZCBvciByZW1vdmUgb25lIG9yIG1vcmUgY2xhc3NlcyBmcm9tIHRoZSBlbGVtZW50LCBkZXBlbmRpbmcgb24gZWl0aGVyXG4gICAgICogdGhlIGNsYXNz4oCZcyBwcmVzZW5jZSBvciB0aGUgdmFsdWUgb2YgdGhlIGBmbGFnYCBhcmd1bWVudC5cbiAgICAgLSB2YWx1ZSAoc3RyaW5nKSBjbGFzcyBuYW1lIG9yIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAgIC0gZmxhZyAoYm9vbGVhbikgdmFsdWUgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGNsYXNzIHNob3VsZCBiZSBhZGRlZCBvciByZW1vdmVkXG4gICAgICoqXG4gICAgID0gKEVsZW1lbnQpIG9yaWdpbmFsIGVsZW1lbnQuXG4gICAgXFwqL1xuICAgIGVscHJvdG8udG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAodmFsdWUsIGZsYWcpIHtcbiAgICAgICAgaWYgKGZsYWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRDbGFzcyh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY2xhc3NlcyA9ICh2YWx1ZSB8fCBcIlwiKS5tYXRjaChyZ05vdFNwYWNlKSB8fCBbXSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLm5vZGUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5iYXNlVmFsLFxuICAgICAgICAgICAgY3VyQ2xhc3NlcyA9IGNsYXNzTmFtZS5tYXRjaChyZ05vdFNwYWNlKSB8fCBbXSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBwb3MsXG4gICAgICAgICAgICBjbGF6eixcbiAgICAgICAgICAgIGZpbmFsVmFsdWU7XG4gICAgICAgIGogPSAwO1xuICAgICAgICB3aGlsZSAoY2xhenogPSBjbGFzc2VzW2orK10pIHtcbiAgICAgICAgICAgIHBvcyA9IGN1ckNsYXNzZXMuaW5kZXhPZihjbGF6eik7XG4gICAgICAgICAgICBpZiAofnBvcykge1xuICAgICAgICAgICAgICAgIGN1ckNsYXNzZXMuc3BsaWNlKHBvcywgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1ckNsYXNzZXMucHVzaChjbGF6eik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmaW5hbFZhbHVlID0gY3VyQ2xhc3Nlcy5qb2luKFwiIFwiKTtcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAhPSBmaW5hbFZhbHVlKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTmFtZS5iYXNlVmFsID0gZmluYWxWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYiwgRnJhZ21lbnQpIHtcbiAgICB2YXIgb3BlcmF0b3JzID0ge1xuICAgICAgICAgICAgXCIrXCI6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgeTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCItXCI6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4IC0geTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIvXCI6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4IC8geTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIqXCI6IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICogeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFN0ciA9IFN0cmluZyxcbiAgICAgICAgcmVVbml0ID0gL1thLXpdKyQvaSxcbiAgICAgICAgcmVBZGRvbiA9IC9eXFxzKihbK1xcLVxcLypdKVxccyo9XFxzKihbXFxkLmVFK1xcLV0rKVxccyooW15cXGRcXHNdKyk/XFxzKiQvO1xuICAgIGZ1bmN0aW9uIGdldE51bWJlcih2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VW5pdCh1bml0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gK3ZhbC50b0ZpeGVkKDMpICsgdW5pdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHJcIiwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICB2YXIgcGx1cyA9IFN0cih2YWwpLm1hdGNoKHJlQWRkb24pO1xuICAgICAgICBpZiAocGx1cykge1xuICAgICAgICAgICAgdmFyIGV2bnQgPSBldmUubnQoKSxcbiAgICAgICAgICAgICAgICBuYW1lID0gZXZudC5zdWJzdHJpbmcoZXZudC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKSxcbiAgICAgICAgICAgICAgICBhID0gdGhpcy5hdHRyKG5hbWUpLFxuICAgICAgICAgICAgICAgIGF0ciA9IHt9O1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIHZhciB1bml0ID0gcGx1c1szXSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgIGFVbml0ID0gYS5tYXRjaChyZVVuaXQpLFxuICAgICAgICAgICAgICAgIG9wID0gb3BlcmF0b3JzW3BsdXNbMV1dO1xuICAgICAgICAgICAgaWYgKGFVbml0ICYmIGFVbml0ID09IHVuaXQpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSBvcChwYXJzZUZsb2F0KGEpLCArcGx1c1syXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGEgPSB0aGlzLmFzUFgobmFtZSk7XG4gICAgICAgICAgICAgICAgdmFsID0gb3AodGhpcy5hc1BYKG5hbWUpLCB0aGlzLmFzUFgobmFtZSwgcGx1c1syXSArIHVuaXQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05hTihhKSB8fCBpc05hTih2YWwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXRyW25hbWVdID0gdmFsO1xuICAgICAgICAgICAgdGhpcy5hdHRyKGF0cik7XG4gICAgICAgIH1cbiAgICB9KSgtMTApO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5lcXVhbFwiLCBmdW5jdGlvbiAobmFtZSwgYikge1xuICAgICAgICB2YXIgQSwgQiwgYSA9IFN0cih0aGlzLmF0dHIobmFtZSkgfHwgXCJcIiksXG4gICAgICAgICAgICBlbCA9IHRoaXMsXG4gICAgICAgICAgICBicGx1cyA9IFN0cihiKS5tYXRjaChyZUFkZG9uKTtcbiAgICAgICAgaWYgKGJwbHVzKSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgdmFyIHVuaXQgPSBicGx1c1szXSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgIGFVbml0ID0gYS5tYXRjaChyZVVuaXQpLFxuICAgICAgICAgICAgICAgIG9wID0gb3BlcmF0b3JzW2JwbHVzWzFdXTtcbiAgICAgICAgICAgIGlmIChhVW5pdCAmJiBhVW5pdCA9PSB1bml0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogcGFyc2VGbG9hdChhKSxcbiAgICAgICAgICAgICAgICAgICAgdG86IG9wKHBhcnNlRmxvYXQoYSksICticGx1c1syXSksXG4gICAgICAgICAgICAgICAgICAgIGY6IGdldFVuaXQoYVVuaXQpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYSA9IHRoaXMuYXNQWChuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBmcm9tOiBhLFxuICAgICAgICAgICAgICAgICAgICB0bzogb3AoYSwgdGhpcy5hc1BYKG5hbWUsIGJwbHVzWzJdICsgdW5pdCkpLFxuICAgICAgICAgICAgICAgICAgICBmOiBnZXROdW1iZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkoLTEwKTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIHByb3RvID0gUGFwZXIucHJvdG90eXBlLFxuICAgICAgICBpcyA9IFNuYXAuaXM7XG4gICAgLypcXFxuICAgICAqIFBhcGVyLnJlY3RcbiAgICAgWyBtZXRob2QgXVxuICAgICAqXG4gICAgICogRHJhd3MgYSByZWN0YW5nbGVcbiAgICAgKipcbiAgICAgLSB4IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgdG9wIGxlZnQgY29ybmVyXG4gICAgIC0geSAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lclxuICAgICAtIHdpZHRoIChudW1iZXIpIHdpZHRoXG4gICAgIC0gaGVpZ2h0IChudW1iZXIpIGhlaWdodFxuICAgICAtIHJ4IChudW1iZXIpICNvcHRpb25hbCBob3Jpem9udGFsIHJhZGl1cyBmb3Igcm91bmRlZCBjb3JuZXJzLCBkZWZhdWx0IGlzIDBcbiAgICAgLSByeSAobnVtYmVyKSAjb3B0aW9uYWwgdmVydGljYWwgcmFkaXVzIGZvciByb3VuZGVkIGNvcm5lcnMsIGRlZmF1bHQgaXMgcnggb3IgMFxuICAgICA9IChvYmplY3QpIHRoZSBgcmVjdGAgZWxlbWVudFxuICAgICAqKlxuICAgICA+IFVzYWdlXG4gICAgIHwgLy8gcmVndWxhciByZWN0YW5nbGVcbiAgICAgfCB2YXIgYyA9IHBhcGVyLnJlY3QoMTAsIDEwLCA1MCwgNTApO1xuICAgICB8IC8vIHJlY3RhbmdsZSB3aXRoIHJvdW5kZWQgY29ybmVyc1xuICAgICB8IHZhciBjID0gcGFwZXIucmVjdCg0MCwgNDAsIDUwLCA1MCwgMTApO1xuICAgIFxcKi9cbiAgICBwcm90by5yZWN0ID0gZnVuY3Rpb24gKHgsIHksIHcsIGgsIHJ4LCByeSkge1xuICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgaWYgKHJ5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJ5ID0gcng7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzKHgsIFwib2JqZWN0XCIpICYmIHggPT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgYXR0ciA9IHg7XG4gICAgICAgIH0gZWxzZSBpZiAoeCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyID0ge1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICB3aWR0aDogdyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocnggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHIucnggPSByeDtcbiAgICAgICAgICAgICAgICBhdHRyLnJ5ID0gcnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJyZWN0XCIsIGF0dHIpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLmNpcmNsZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRHJhd3MgYSBjaXJjbGVcbiAgICAgKipcbiAgICAgLSB4IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlXG4gICAgIC0geSAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRyZVxuICAgICAtIHIgKG51bWJlcikgcmFkaXVzXG4gICAgID0gKG9iamVjdCkgdGhlIGBjaXJjbGVgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBjID0gcGFwZXIuY2lyY2xlKDUwLCA1MCwgNDApO1xuICAgIFxcKi9cbiAgICBwcm90by5jaXJjbGUgPSBmdW5jdGlvbiAoY3gsIGN5LCByKSB7XG4gICAgICAgIHZhciBhdHRyO1xuICAgICAgICBpZiAoaXMoY3gsIFwib2JqZWN0XCIpICYmIGN4ID09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgIGF0dHIgPSBjeDtcbiAgICAgICAgfSBlbHNlIGlmIChjeCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyID0ge1xuICAgICAgICAgICAgICAgIGN4OiBjeCxcbiAgICAgICAgICAgICAgICBjeTogY3ksXG4gICAgICAgICAgICAgICAgcjogclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbChcImNpcmNsZVwiLCBhdHRyKTtcbiAgICB9O1xuXG4gICAgdmFyIHByZWxvYWQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBvbmVycm9yKCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3JjLCBmKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gZ2xvYi5kb2MuY3JlYXRlRWxlbWVudChcImltZ1wiKSxcbiAgICAgICAgICAgICAgICBib2R5ID0gZ2xvYi5kb2MuYm9keTtcbiAgICAgICAgICAgIGltZy5zdHlsZS5jc3NUZXh0ID0gXCJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi05OTk5ZW07dG9wOi05OTk5ZW1cIjtcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZi5jYWxsKGltZyk7XG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGltZy5vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICAgICBib2R5LnJlbW92ZUNoaWxkKGltZyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSBvbmVycm9yO1xuICAgICAgICAgICAgYm9keS5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgLypcXFxuICAgICAqIFBhcGVyLmltYWdlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBQbGFjZXMgYW4gaW1hZ2Ugb24gdGhlIHN1cmZhY2VcbiAgICAgKipcbiAgICAgLSBzcmMgKHN0cmluZykgVVJJIG9mIHRoZSBzb3VyY2UgaW1hZ2VcbiAgICAgLSB4IChudW1iZXIpIHggb2Zmc2V0IHBvc2l0aW9uXG4gICAgIC0geSAobnVtYmVyKSB5IG9mZnNldCBwb3NpdGlvblxuICAgICAtIHdpZHRoIChudW1iZXIpIHdpZHRoIG9mIHRoZSBpbWFnZVxuICAgICAtIGhlaWdodCAobnVtYmVyKSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gICAgID0gKG9iamVjdCkgdGhlIGBpbWFnZWAgZWxlbWVudFxuICAgICAqIG9yXG4gICAgID0gKG9iamVjdCkgU25hcCBlbGVtZW50IG9iamVjdCB3aXRoIHR5cGUgYGltYWdlYFxuICAgICAqKlxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIGMgPSBwYXBlci5pbWFnZShcImFwcGxlLnBuZ1wiLCAxMCwgMTAsIDgwLCA4MCk7XG4gICAgXFwqL1xuICAgIHByb3RvLmltYWdlID0gZnVuY3Rpb24gKHNyYywgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsKFwiaW1hZ2VcIik7XG4gICAgICAgIGlmIChpcyhzcmMsIFwib2JqZWN0XCIpICYmIFwic3JjXCIgaW4gc3JjKSB7XG4gICAgICAgICAgICBlbC5hdHRyKHNyYyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3JjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzZXQgPSB7XG4gICAgICAgICAgICAgICAgXCJ4bGluazpocmVmXCI6IHNyYyxcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiBcIm5vbmVcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh4ICE9IG51bGwgJiYgeSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc2V0LnggPSB4O1xuICAgICAgICAgICAgICAgIHNldC55ID0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3aWR0aCAhPSBudWxsICYmIGhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc2V0LndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICAgICAgc2V0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJlbG9hZChzcmMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgU25hcC5fLiQoZWwubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU25hcC5fLiQoZWwubm9kZSwgc2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIuZWxsaXBzZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRHJhd3MgYW4gZWxsaXBzZVxuICAgICAqKlxuICAgICAtIHggKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSBjZW50cmVcbiAgICAgLSB5IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlXG4gICAgIC0gcnggKG51bWJlcikgaG9yaXpvbnRhbCByYWRpdXNcbiAgICAgLSByeSAobnVtYmVyKSB2ZXJ0aWNhbCByYWRpdXNcbiAgICAgPSAob2JqZWN0KSB0aGUgYGVsbGlwc2VgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBjID0gcGFwZXIuZWxsaXBzZSg1MCwgNTAsIDQwLCAyMCk7XG4gICAgXFwqL1xuICAgIHByb3RvLmVsbGlwc2UgPSBmdW5jdGlvbiAoY3gsIGN5LCByeCwgcnkpIHtcbiAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgIGlmIChpcyhjeCwgXCJvYmplY3RcIikgJiYgY3ggPT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICAgICAgYXR0ciA9IGN4O1xuICAgICAgICB9IGVsc2UgaWYgKGN4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHIgPXtcbiAgICAgICAgICAgICAgICBjeDogY3gsXG4gICAgICAgICAgICAgICAgY3k6IGN5LFxuICAgICAgICAgICAgICAgIHJ4OiByeCxcbiAgICAgICAgICAgICAgICByeTogcnlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJlbGxpcHNlXCIsIGF0dHIpO1xuICAgIH07XG4gICAgLy8gU0lFUlJBIFBhcGVyLnBhdGgoKTogVW5jbGVhciBmcm9tIHRoZSBsaW5rIHdoYXQgYSBDYXRtdWxsLVJvbSBjdXJ2ZXRvIGlzLCBhbmQgd2h5IGl0IHdvdWxkIG1ha2UgbGlmZSBhbnkgZWFzaWVyLlxuICAgIC8qXFxcbiAgICAgKiBQYXBlci5wYXRoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgYDxwYXRoPmAgZWxlbWVudCB1c2luZyB0aGUgZ2l2ZW4gc3RyaW5nIGFzIHRoZSBwYXRoJ3MgZGVmaW5pdGlvblxuICAgICAtIHBhdGhTdHJpbmcgKHN0cmluZykgI29wdGlvbmFsIHBhdGggc3RyaW5nIGluIFNWRyBmb3JtYXRcbiAgICAgKiBQYXRoIHN0cmluZyBjb25zaXN0cyBvZiBvbmUtbGV0dGVyIGNvbW1hbmRzLCBmb2xsb3dlZCBieSBjb21tYSBzZXByYXJhdGVkIGFyZ3VtZW50cyBpbiBudW1lcmljYWwgZm9ybS4gRXhhbXBsZTpcbiAgICAgfCBcIk0xMCwyMEwzMCw0MFwiXG4gICAgICogVGhpcyBleGFtcGxlIGZlYXR1cmVzIHR3byBjb21tYW5kczogYE1gLCB3aXRoIGFyZ3VtZW50cyBgKDEwLCAyMClgIGFuZCBgTGAgd2l0aCBhcmd1bWVudHMgYCgzMCwgNDApYC4gVXBwZXJjYXNlIGxldHRlciBjb21tYW5kcyBleHByZXNzIGNvb3JkaW5hdGVzIGluIGFic29sdXRlIHRlcm1zLCB3aGlsZSBsb3dlcmNhc2UgY29tbWFuZHMgZXhwcmVzcyB0aGVtIGluIHJlbGF0aXZlIHRlcm1zIGZyb20gdGhlIG1vc3QgcmVjZW50bHkgZGVjbGFyZWQgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgIyA8cD5IZXJlIGlzIHNob3J0IGxpc3Qgb2YgY29tbWFuZHMgYXZhaWxhYmxlLCBmb3IgbW9yZSBkZXRhaWxzIHNlZSA8YSBocmVmPVwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHL3BhdGhzLmh0bWwjUGF0aERhdGFcIiB0aXRsZT1cIkRldGFpbHMgb2YgYSBwYXRoJ3MgZGF0YSBhdHRyaWJ1dGUncyBmb3JtYXQgYXJlIGRlc2NyaWJlZCBpbiB0aGUgU1ZHIHNwZWNpZmljYXRpb24uXCI+U1ZHIHBhdGggc3RyaW5nIGZvcm1hdDwvYT4gb3IgPGEgaHJlZj1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL1NWRy9UdXRvcmlhbC9QYXRoc1wiPmFydGljbGUgYWJvdXQgcGF0aCBzdHJpbmdzIGF0IE1ETjwvYT4uPC9wPlxuICAgICAjIDx0YWJsZT48dGhlYWQ+PHRyPjx0aD5Db21tYW5kPC90aD48dGg+TmFtZTwvdGg+PHRoPlBhcmFtZXRlcnM8L3RoPjwvdHI+PC90aGVhZD48dGJvZHk+XG4gICAgICMgPHRyPjx0ZD5NPC90ZD48dGQ+bW92ZXRvPC90ZD48dGQ+KHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+WjwvdGQ+PHRkPmNsb3NlcGF0aDwvdGQ+PHRkPihub25lKTwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPkw8L3RkPjx0ZD5saW5ldG88L3RkPjx0ZD4oeCB5KSs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5IPC90ZD48dGQ+aG9yaXpvbnRhbCBsaW5ldG88L3RkPjx0ZD54KzwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPlY8L3RkPjx0ZD52ZXJ0aWNhbCBsaW5ldG88L3RkPjx0ZD55KzwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPkM8L3RkPjx0ZD5jdXJ2ZXRvPC90ZD48dGQ+KHgxIHkxIHgyIHkyIHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+UzwvdGQ+PHRkPnNtb290aCBjdXJ2ZXRvPC90ZD48dGQ+KHgyIHkyIHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+UTwvdGQ+PHRkPnF1YWRyYXRpYyBCw6l6aWVyIGN1cnZldG88L3RkPjx0ZD4oeDEgeTEgeCB5KSs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5UPC90ZD48dGQ+c21vb3RoIHF1YWRyYXRpYyBCw6l6aWVyIGN1cnZldG88L3RkPjx0ZD4oeCB5KSs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5BPC90ZD48dGQ+ZWxsaXB0aWNhbCBhcmM8L3RkPjx0ZD4ocnggcnkgeC1heGlzLXJvdGF0aW9uIGxhcmdlLWFyYy1mbGFnIHN3ZWVwLWZsYWcgeCB5KSs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5SPC90ZD48dGQ+PGEgaHJlZj1cImh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2F0bXVsbOKAk1JvbV9zcGxpbmUjQ2F0bXVsbC5FMi44MC45M1JvbV9zcGxpbmVcIj5DYXRtdWxsLVJvbSBjdXJ2ZXRvPC9hPio8L3RkPjx0ZD54MSB5MSAoeCB5KSs8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPlxuICAgICAqICogX0NhdG11bGwtUm9tIGN1cnZldG9fIGlzIGEgbm90IHN0YW5kYXJkIFNWRyBjb21tYW5kIGFuZCBhZGRlZCB0byBtYWtlIGxpZmUgZWFzaWVyLlxuICAgICAqIE5vdGU6IHRoZXJlIGlzIGEgc3BlY2lhbCBjYXNlIHdoZW4gYSBwYXRoIGNvbnNpc3RzIG9mIG9ubHkgdGhyZWUgY29tbWFuZHM6IGBNMTAsMTBS4oCmemAuIEluIHRoaXMgY2FzZSB0aGUgcGF0aCBjb25uZWN0cyBiYWNrIHRvIGl0cyBzdGFydGluZyBwb2ludC5cbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBjID0gcGFwZXIucGF0aChcIk0xMCAxMEw5MCA5MFwiKTtcbiAgICAgfCAvLyBkcmF3IGEgZGlhZ29uYWwgbGluZTpcbiAgICAgfCAvLyBtb3ZlIHRvIDEwLDEwLCBsaW5lIHRvIDkwLDkwXG4gICAgXFwqL1xuICAgIHByb3RvLnBhdGggPSBmdW5jdGlvbiAoZCkge1xuICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgaWYgKGlzKGQsIFwib2JqZWN0XCIpICYmICFpcyhkLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICBhdHRyID0gZDtcbiAgICAgICAgfSBlbHNlIGlmIChkKSB7XG4gICAgICAgICAgICBhdHRyID0ge2Q6IGR9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwicGF0aFwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5nXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgZ3JvdXAgZWxlbWVudFxuICAgICAqKlxuICAgICAtIHZhcmFyZ3MgKOKApikgI29wdGlvbmFsIGVsZW1lbnRzIHRvIG5lc3Qgd2l0aGluIHRoZSBncm91cFxuICAgICA9IChvYmplY3QpIHRoZSBgZ2AgZWxlbWVudFxuICAgICAqKlxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIGMxID0gcGFwZXIuY2lyY2xlKCksXG4gICAgIHwgICAgIGMyID0gcGFwZXIucmVjdCgpLFxuICAgICB8ICAgICBnID0gcGFwZXIuZyhjMiwgYzEpOyAvLyBub3RlIHRoYXQgdGhlIG9yZGVyIG9mIGVsZW1lbnRzIGlzIGRpZmZlcmVudFxuICAgICAqIG9yXG4gICAgIHwgdmFyIGMxID0gcGFwZXIuY2lyY2xlKCksXG4gICAgIHwgICAgIGMyID0gcGFwZXIucmVjdCgpLFxuICAgICB8ICAgICBnID0gcGFwZXIuZygpO1xuICAgICB8IGcuYWRkKGMyLCBjMSk7XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5ncm91cFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2VlIEBQYXBlci5nXG4gICAgXFwqL1xuICAgIHByb3RvLmdyb3VwID0gcHJvdG8uZyA9IGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgICB2YXIgYXR0cixcbiAgICAgICAgICAgIGVsID0gdGhpcy5lbChcImdcIik7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgZmlyc3QgJiYgIWZpcnN0LnR5cGUpIHtcbiAgICAgICAgICAgIGVsLmF0dHIoZmlyc3QpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsLmFkZChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIuc3ZnXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgbmVzdGVkIFNWRyBlbGVtZW50LlxuICAgICAtIHggKG51bWJlcikgQG9wdGlvbmFsIFggb2YgdGhlIGVsZW1lbnRcbiAgICAgLSB5IChudW1iZXIpIEBvcHRpb25hbCBZIG9mIHRoZSBlbGVtZW50XG4gICAgIC0gd2lkdGggKG51bWJlcikgQG9wdGlvbmFsIHdpZHRoIG9mIHRoZSBlbGVtZW50XG4gICAgIC0gaGVpZ2h0IChudW1iZXIpIEBvcHRpb25hbCBoZWlnaHQgb2YgdGhlIGVsZW1lbnRcbiAgICAgLSB2YnggKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggWFxuICAgICAtIHZieSAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBZXG4gICAgIC0gdmJ3IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IHdpZHRoXG4gICAgIC0gdmJoIChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IGhlaWdodFxuICAgICAqKlxuICAgICA9IChvYmplY3QpIHRoZSBgc3ZnYCBlbGVtZW50XG4gICAgICoqXG4gICAgXFwqL1xuICAgIHByb3RvLnN2ZyA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YngsIHZieSwgdmJ3LCB2YmgpIHtcbiAgICAgICAgdmFyIGF0dHJzID0ge307XG4gICAgICAgIGlmIChpcyh4LCBcIm9iamVjdFwiKSAmJiB5ID09IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHJzID0geDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRycy54ID0geDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRycy55ID0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0cnMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YnggIT0gbnVsbCAmJiB2YnkgIT0gbnVsbCAmJiB2YncgIT0gbnVsbCAmJiB2YmggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJzLnZpZXdCb3ggPSBbdmJ4LCB2YnksIHZidywgdmJoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbChcInN2Z1wiLCBhdHRycyk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIubWFza1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRXF1aXZhbGVudCBpbiBiZWhhdmlvdXIgdG8gQFBhcGVyLmcsIGV4Y2VwdCBpdOKAmXMgYSBtYXNrLlxuICAgICAqKlxuICAgICA9IChvYmplY3QpIHRoZSBgbWFza2AgZWxlbWVudFxuICAgICAqKlxuICAgIFxcKi9cbiAgICBwcm90by5tYXNrID0gZnVuY3Rpb24gKGZpcnN0KSB7XG4gICAgICAgIHZhciBhdHRyLFxuICAgICAgICAgICAgZWwgPSB0aGlzLmVsKFwibWFza1wiKTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBmaXJzdCAmJiAhZmlyc3QudHlwZSkge1xuICAgICAgICAgICAgZWwuYXR0cihmaXJzdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZWwuYWRkKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5wdHJuXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBFcXVpdmFsZW50IGluIGJlaGF2aW91ciB0byBAUGFwZXIuZywgZXhjZXB0IGl04oCZcyBhIHBhdHRlcm4uXG4gICAgIC0geCAobnVtYmVyKSBAb3B0aW9uYWwgWCBvZiB0aGUgZWxlbWVudFxuICAgICAtIHkgKG51bWJlcikgQG9wdGlvbmFsIFkgb2YgdGhlIGVsZW1lbnRcbiAgICAgLSB3aWR0aCAobnVtYmVyKSBAb3B0aW9uYWwgd2lkdGggb2YgdGhlIGVsZW1lbnRcbiAgICAgLSBoZWlnaHQgKG51bWJlcikgQG9wdGlvbmFsIGhlaWdodCBvZiB0aGUgZWxlbWVudFxuICAgICAtIHZieCAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBYXG4gICAgIC0gdmJ5IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IFlcbiAgICAgLSB2YncgKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggd2lkdGhcbiAgICAgLSB2YmggKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggaGVpZ2h0XG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgdGhlIGBwYXR0ZXJuYCBlbGVtZW50XG4gICAgICoqXG4gICAgXFwqL1xuICAgIHByb3RvLnB0cm4gPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgdngsIHZ5LCB2dywgdmgpIHtcbiAgICAgICAgaWYgKGlzKHgsIFwib2JqZWN0XCIpKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9IHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyID0ge3BhdHRlcm5Vbml0czogXCJ1c2VyU3BhY2VPblVzZVwifTtcbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgYXR0ci54ID0geDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICAgICAgYXR0ci55ID0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0ci53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0ci5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodnggIT0gbnVsbCAmJiB2eSAhPSBudWxsICYmIHZ3ICE9IG51bGwgJiYgdmggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHIudmlld0JveCA9IFt2eCwgdnksIHZ3LCB2aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0dHIudmlld0JveCA9IFt4IHx8IDAsIHkgfHwgMCwgd2lkdGggfHwgMCwgaGVpZ2h0IHx8IDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwicGF0dGVyblwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci51c2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSA8dXNlPiBlbGVtZW50LlxuICAgICAtIGlkIChzdHJpbmcpIEBvcHRpb25hbCBpZCBvZiBlbGVtZW50IHRvIGxpbmtcbiAgICAgKiBvclxuICAgICAtIGlkIChFbGVtZW50KSBAb3B0aW9uYWwgZWxlbWVudCB0byBsaW5rXG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgdGhlIGB1c2VgIGVsZW1lbnRcbiAgICAgKipcbiAgICBcXCovXG4gICAgcHJvdG8udXNlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaWQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpZC5hdHRyKFwiaWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQuYXR0cih7aWQ6IFNuYXAuXy5pZChpZCl9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWQgPSBpZC5hdHRyKFwiaWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoU3RyaW5nKGlkKS5jaGFyQXQoKSA9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJ1c2VcIiwge1wieGxpbms6aHJlZlwiOiBcIiNcIiArIGlkfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gRWxlbWVudC5wcm90b3R5cGUudXNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5zeW1ib2xcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSA8c3ltYm9sPiBlbGVtZW50LlxuICAgICAtIHZieCAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBYXG4gICAgIC0gdmJ5IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IFlcbiAgICAgLSB2YncgKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggd2lkdGhcbiAgICAgLSB2YmggKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggaGVpZ2h0XG4gICAgID0gKG9iamVjdCkgdGhlIGBzeW1ib2xgIGVsZW1lbnRcbiAgICAgKipcbiAgICBcXCovXG4gICAgcHJvdG8uc3ltYm9sID0gZnVuY3Rpb24gKHZ4LCB2eSwgdncsIHZoKSB7XG4gICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgIGlmICh2eCAhPSBudWxsICYmIHZ5ICE9IG51bGwgJiYgdncgIT0gbnVsbCAmJiB2aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyLnZpZXdCb3ggPSBbdngsIHZ5LCB2dywgdmhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJzeW1ib2xcIiwgYXR0cik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIudGV4dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRHJhd3MgYSB0ZXh0IHN0cmluZ1xuICAgICAqKlxuICAgICAtIHggKG51bWJlcikgeCBjb29yZGluYXRlIHBvc2l0aW9uXG4gICAgIC0geSAobnVtYmVyKSB5IGNvb3JkaW5hdGUgcG9zaXRpb25cbiAgICAgLSB0ZXh0IChzdHJpbmd8YXJyYXkpIFRoZSB0ZXh0IHN0cmluZyB0byBkcmF3IG9yIGFycmF5IG9mIHN0cmluZ3MgdG8gbmVzdCB3aXRoaW4gc2VwYXJhdGUgYDx0c3Bhbj5gIGVsZW1lbnRzXG4gICAgID0gKG9iamVjdCkgdGhlIGB0ZXh0YCBlbGVtZW50XG4gICAgICoqXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgdDEgPSBwYXBlci50ZXh0KDUwLCA1MCwgXCJTbmFwXCIpO1xuICAgICB8IHZhciB0MiA9IHBhcGVyLnRleHQoNTAsIDUwLCBbXCJTXCIsXCJuXCIsXCJhXCIsXCJwXCJdKTtcbiAgICAgfCAvLyBUZXh0IHBhdGggdXNhZ2VcbiAgICAgfCB0MS5hdHRyKHt0ZXh0cGF0aDogXCJNMTAsMTBMMTAwLDEwMFwifSk7XG4gICAgIHwgLy8gb3JcbiAgICAgfCB2YXIgcHRoID0gcGFwZXIucGF0aChcIk0xMCwxMEwxMDAsMTAwXCIpO1xuICAgICB8IHQxLmF0dHIoe3RleHRwYXRoOiBwdGh9KTtcbiAgICBcXCovXG4gICAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uICh4LCB5LCB0ZXh0KSB7XG4gICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgIGlmIChpcyh4LCBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgYXR0ciA9IHg7XG4gICAgICAgIH0gZWxzZSBpZiAoeCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyID0ge1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0IHx8IFwiXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJ0ZXh0XCIsIGF0dHIpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLmxpbmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIERyYXdzIGEgbGluZVxuICAgICAqKlxuICAgICAtIHgxIChudW1iZXIpIHggY29vcmRpbmF0ZSBwb3NpdGlvbiBvZiB0aGUgc3RhcnRcbiAgICAgLSB5MSAobnVtYmVyKSB5IGNvb3JkaW5hdGUgcG9zaXRpb24gb2YgdGhlIHN0YXJ0XG4gICAgIC0geDIgKG51bWJlcikgeCBjb29yZGluYXRlIHBvc2l0aW9uIG9mIHRoZSBlbmRcbiAgICAgLSB5MiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgcG9zaXRpb24gb2YgdGhlIGVuZFxuICAgICA9IChvYmplY3QpIHRoZSBgbGluZWAgZWxlbWVudFxuICAgICAqKlxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIHQxID0gcGFwZXIubGluZSg1MCwgNTAsIDEwMCwgMTAwKTtcbiAgICBcXCovXG4gICAgcHJvdG8ubGluZSA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICBpZiAoaXMoeDEsIFwib2JqZWN0XCIpKSB7XG4gICAgICAgICAgICBhdHRyID0geDE7XG4gICAgICAgIH0gZWxzZSBpZiAoeDEgIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ciA9IHtcbiAgICAgICAgICAgICAgICB4MTogeDEsXG4gICAgICAgICAgICAgICAgeDI6IHgyLFxuICAgICAgICAgICAgICAgIHkxOiB5MSxcbiAgICAgICAgICAgICAgICB5MjogeTJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJsaW5lXCIsIGF0dHIpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLnBvbHlsaW5lXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBEcmF3cyBhIHBvbHlsaW5lXG4gICAgICoqXG4gICAgIC0gcG9pbnRzIChhcnJheSkgYXJyYXkgb2YgcG9pbnRzXG4gICAgICogb3JcbiAgICAgLSB2YXJhcmdzICjigKYpIHBvaW50c1xuICAgICA9IChvYmplY3QpIHRoZSBgcG9seWxpbmVgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBwMSA9IHBhcGVyLnBvbHlsaW5lKFsxMCwgMTAsIDEwMCwgMTAwXSk7XG4gICAgIHwgdmFyIHAyID0gcGFwZXIucG9seWxpbmUoMTAsIDEwLCAxMDAsIDEwMCk7XG4gICAgXFwqL1xuICAgIHByb3RvLnBvbHlsaW5lID0gZnVuY3Rpb24gKHBvaW50cykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHBvaW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGF0dHIgPSB7fTtcbiAgICAgICAgaWYgKGlzKHBvaW50cywgXCJvYmplY3RcIikgJiYgIWlzKHBvaW50cywgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgYXR0ciA9IHBvaW50cztcbiAgICAgICAgfSBlbHNlIGlmIChwb2ludHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ciA9IHtwb2ludHM6IHBvaW50c307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJwb2x5bGluZVwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5wb2x5Z29uXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBEcmF3cyBhIHBvbHlnb24uIFNlZSBAUGFwZXIucG9seWxpbmVcbiAgICBcXCovXG4gICAgcHJvdG8ucG9seWdvbiA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBwb2ludHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgIGlmIChpcyhwb2ludHMsIFwib2JqZWN0XCIpICYmICFpcyhwb2ludHMsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiAocG9pbnRzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHIgPSB7cG9pbnRzOiBwb2ludHN9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwicG9seWdvblwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8vIGdyYWRpZW50c1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkID0gU25hcC5fLiQ7XG4gICAgICAgIC8vIGdyYWRpZW50cycgaGVscGVyc1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIEVsZW1lbnQuc3RvcHNcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIE9ubHkgZm9yIGdyYWRpZW50cyFcbiAgICAgICAgICogUmV0dXJucyBhcnJheSBvZiBncmFkaWVudCBzdG9wcyBlbGVtZW50cy5cbiAgICAgICAgID0gKGFycmF5KSB0aGUgc3RvcHMgYXJyYXkuXG4gICAgICAgIFxcKi9cbiAgICAgICAgZnVuY3Rpb24gR3N0b3BzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKFwic3RvcFwiKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxcXG4gICAgICAgICAqIEVsZW1lbnQuYWRkU3RvcFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogT25seSBmb3IgZ3JhZGllbnRzIVxuICAgICAgICAgKiBBZGRzIGFub3RoZXIgc3RvcCB0byB0aGUgZ3JhZGllbnQuXG4gICAgICAgICAtIGNvbG9yIChzdHJpbmcpIHN0b3BzIGNvbG9yXG4gICAgICAgICAtIG9mZnNldCAobnVtYmVyKSBzdG9wcyBvZmZzZXQgMC4uMTAwXG4gICAgICAgICA9IChvYmplY3QpIGdyYWRpZW50IGVsZW1lbnRcbiAgICAgICAgXFwqL1xuICAgICAgICBmdW5jdGlvbiBHYWRkU3RvcChjb2xvciwgb2Zmc2V0KSB7XG4gICAgICAgICAgICB2YXIgc3RvcCA9ICQoXCJzdG9wXCIpLFxuICAgICAgICAgICAgICAgIGF0dHIgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogK29mZnNldCArIFwiJVwiXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbG9yID0gU25hcC5jb2xvcihjb2xvcik7XG4gICAgICAgICAgICBhdHRyW1wic3RvcC1jb2xvclwiXSA9IGNvbG9yLmhleDtcbiAgICAgICAgICAgIGlmIChjb2xvci5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgICAgIGF0dHJbXCJzdG9wLW9wYWNpdHlcIl0gPSBjb2xvci5vcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChzdG9wLCBhdHRyKTtcbiAgICAgICAgICAgIHZhciBzdG9wcyA9IHRoaXMuc3RvcHMoKSxcbiAgICAgICAgICAgICAgICBpbnNlcnRlZDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RvcE9mZnNldCA9IHBhcnNlRmxvYXQoc3RvcHNbaV0uYXR0cihcIm9mZnNldFwiKSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3BPZmZzZXQgPiBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmluc2VydEJlZm9yZShzdG9wLCBzdG9wc1tpXS5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHN0b3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gR2dldEJCb3goKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09IFwibGluZWFyR3JhZGllbnRcIikge1xuICAgICAgICAgICAgICAgIHZhciB4MSA9ICQodGhpcy5ub2RlLCBcIngxXCIpIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgIHgyID0gJCh0aGlzLm5vZGUsIFwieDJcIikgfHwgMSxcbiAgICAgICAgICAgICAgICAgICAgeTEgPSAkKHRoaXMubm9kZSwgXCJ5MVwiKSB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB5MiA9ICQodGhpcy5ub2RlLCBcInkyXCIpIHx8IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNuYXAuXy5ib3goeDEsIHkxLCBtYXRoLmFicyh4MiAtIHgxKSwgbWF0aC5hYnMoeTIgLSB5MSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY3ggPSB0aGlzLm5vZGUuY3ggfHwgLjUsXG4gICAgICAgICAgICAgICAgICAgIGN5ID0gdGhpcy5ub2RlLmN5IHx8IC41LFxuICAgICAgICAgICAgICAgICAgICByID0gdGhpcy5ub2RlLnIgfHwgMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gU25hcC5fLmJveChjeCAtIHIsIGN5IC0gciwgciAqIDIsIHIgKiAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKlxcXG4gICAgICAgICAqIEVsZW1lbnQuc2V0U3RvcHNcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIE9ubHkgZm9yIGdyYWRpZW50cyFcbiAgICAgICAgICogVXBkYXRlcyBzdG9wcyBvZiB0aGUgZ3JhZGllbnQgYmFzZWQgb24gcGFzc2VkIGdyYWRpZW50IGRlc2NyaXB0b3IuIFNlZSBAUHBhZXIuZ3JhZGllbnRcbiAgICAgICAgIC0gc3RyIChzdHJpbmcpIGdyYWRpZW50IGRlc2NyaXB0b3IgcGFydCBhZnRlciBgKClgLlxuICAgICAgICAgPSAob2JqZWN0KSBncmFkaWVudCBlbGVtZW50XG4gICAgICAgICB8IHZhciBnID0gcGFwZXIuZ3JhZGllbnQoXCJsKDAsIDAsIDEsIDEpIzAwMC0jZjAwLSNmZmZcIik7XG4gICAgICAgICB8IGcuc2V0U3RvcHMoXCIjZmZmLSMwMDAtI2YwMC0jZmMwXCIpO1xuICAgICAgICBcXCovXG4gICAgICAgIGZ1bmN0aW9uIEdzZXRTdG9wcyhzdHIpIHtcbiAgICAgICAgICAgIHZhciBncmFkID0gc3RyLFxuICAgICAgICAgICAgICAgIHN0b3BzID0gdGhpcy5zdG9wcygpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHIgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGdyYWQgPSBldmUoXCJzbmFwLnV0aWwuZ3JhZC5wYXJzZVwiLCBudWxsLCBcImwoMCwwLDAsMSlcIiArIHN0cikuZmlyc3REZWZpbmVkKCkuc3RvcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIVNuYXAuaXMoZ3JhZCwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JhZFtpXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSBTbmFwLmNvbG9yKGdyYWRbaV0uY29sb3IpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciA9IHtcIm9mZnNldFwiOiBncmFkW2ldLm9mZnNldCArIFwiJVwifTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cltcInN0b3AtY29sb3JcIl0gPSBjb2xvci5oZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2xvci5vcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cltcInN0b3Atb3BhY2l0eVwiXSA9IGNvbG9yLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RvcHNbaV0uYXR0cihhdHRyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdG9wc1tpXS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSBzdG9wcy5sZW5ndGg7IGkgPCBncmFkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTdG9wKGdyYWRbaV0uY29sb3IsIGdyYWRbaV0ub2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdyYWRpZW50KGRlZnMsIHN0cikge1xuICAgICAgICAgICAgdmFyIGdyYWQgPSBldmUoXCJzbmFwLnV0aWwuZ3JhZC5wYXJzZVwiLCBudWxsLCBzdHIpLmZpcnN0RGVmaW5lZCgpLFxuICAgICAgICAgICAgICAgIGVsO1xuICAgICAgICAgICAgaWYgKCFncmFkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncmFkLnBhcmFtcy51bnNoaWZ0KGRlZnMpO1xuICAgICAgICAgICAgaWYgKGdyYWQudHlwZS50b0xvd2VyQ2FzZSgpID09IFwibFwiKSB7XG4gICAgICAgICAgICAgICAgZWwgPSBncmFkaWVudExpbmVhci5hcHBseSgwLCBncmFkLnBhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsID0gZ3JhZGllbnRSYWRpYWwuYXBwbHkoMCwgZ3JhZC5wYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdyYWQudHlwZSAhPSBncmFkLnR5cGUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICQoZWwubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICBncmFkaWVudFVuaXRzOiBcInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdG9wcyA9IGdyYWQuc3RvcHMsXG4gICAgICAgICAgICAgICAgbGVuID0gc3RvcHMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBzdG9wID0gc3RvcHNbaV07XG4gICAgICAgICAgICAgICAgZWwuYWRkU3RvcChzdG9wLmNvbG9yLCBzdG9wLm9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ3JhZGllbnRMaW5lYXIoZGVmcywgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgICAgIHZhciBlbCA9IFNuYXAuXy5tYWtlKFwibGluZWFyR3JhZGllbnRcIiwgZGVmcyk7XG4gICAgICAgICAgICBlbC5zdG9wcyA9IEdzdG9wcztcbiAgICAgICAgICAgIGVsLmFkZFN0b3AgPSBHYWRkU3RvcDtcbiAgICAgICAgICAgIGVsLmdldEJCb3ggPSBHZ2V0QkJveDtcbiAgICAgICAgICAgIGVsLnNldFN0b3BzID0gR3NldFN0b3BzO1xuICAgICAgICAgICAgaWYgKHgxICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkKGVsLm5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgeDE6IHgxLFxuICAgICAgICAgICAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgICAgICAgICAgIHgyOiB4MixcbiAgICAgICAgICAgICAgICAgICAgeTI6IHkyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ3JhZGllbnRSYWRpYWwoZGVmcywgY3gsIGN5LCByLCBmeCwgZnkpIHtcbiAgICAgICAgICAgIHZhciBlbCA9IFNuYXAuXy5tYWtlKFwicmFkaWFsR3JhZGllbnRcIiwgZGVmcyk7XG4gICAgICAgICAgICBlbC5zdG9wcyA9IEdzdG9wcztcbiAgICAgICAgICAgIGVsLmFkZFN0b3AgPSBHYWRkU3RvcDtcbiAgICAgICAgICAgIGVsLmdldEJCb3ggPSBHZ2V0QkJveDtcbiAgICAgICAgICAgIGlmIChjeCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJChlbC5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgIGN4OiBjeCxcbiAgICAgICAgICAgICAgICAgICAgY3k6IGN5LFxuICAgICAgICAgICAgICAgICAgICByOiByXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnggIT0gbnVsbCAmJiBmeSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJChlbC5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgIGZ4OiBmeCxcbiAgICAgICAgICAgICAgICAgICAgZnk6IGZ5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgICAgLypcXFxuICAgICAgICAgKiBQYXBlci5ncmFkaWVudFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogQ3JlYXRlcyBhIGdyYWRpZW50IGVsZW1lbnRcbiAgICAgICAgICoqXG4gICAgICAgICAtIGdyYWRpZW50IChzdHJpbmcpIGdyYWRpZW50IGRlc2NyaXB0b3JcbiAgICAgICAgID4gR3JhZGllbnQgRGVzY3JpcHRvclxuICAgICAgICAgKiBUaGUgZ3JhZGllbnQgZGVzY3JpcHRvciBpcyBhbiBleHByZXNzaW9uIGZvcm1hdHRlZCBhc1xuICAgICAgICAgKiBmb2xsb3dzOiBgPHR5cGU+KDxjb29yZHM+KTxjb2xvcnM+YC4gIFRoZSBgPHR5cGU+YCBjYW4gYmVcbiAgICAgICAgICogZWl0aGVyIGxpbmVhciBvciByYWRpYWwuICBUaGUgdXBwZXJjYXNlIGBMYCBvciBgUmAgbGV0dGVyc1xuICAgICAgICAgKiBpbmRpY2F0ZSBhYnNvbHV0ZSBjb29yZGluYXRlcyBvZmZzZXQgZnJvbSB0aGUgU1ZHIHN1cmZhY2UuXG4gICAgICAgICAqIExvd2VyY2FzZSBgbGAgb3IgYHJgIGxldHRlcnMgaW5kaWNhdGUgY29vcmRpbmF0ZXNcbiAgICAgICAgICogY2FsY3VsYXRlZCByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCB0byB3aGljaCB0aGUgZ3JhZGllbnQgaXNcbiAgICAgICAgICogYXBwbGllZC4gIENvb3JkaW5hdGVzIHNwZWNpZnkgYSBsaW5lYXIgZ3JhZGllbnQgdmVjdG9yIGFzXG4gICAgICAgICAqIGB4MWAsIGB5MWAsIGB4MmAsIGB5MmAsIG9yIGEgcmFkaWFsIGdyYWRpZW50IGFzIGBjeGAsIGBjeWAsXG4gICAgICAgICAqIGByYCBhbmQgb3B0aW9uYWwgYGZ4YCwgYGZ5YCBzcGVjaWZ5aW5nIGEgZm9jYWwgcG9pbnQgYXdheVxuICAgICAgICAgKiBmcm9tIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZS4gU3BlY2lmeSBgPGNvbG9ycz5gIGFzIGEgbGlzdFxuICAgICAgICAgKiBvZiBkYXNoLXNlcGFyYXRlZCBDU1MgY29sb3IgdmFsdWVzLiAgRWFjaCBjb2xvciBtYXkgYmVcbiAgICAgICAgICogZm9sbG93ZWQgYnkgYSBjdXN0b20gb2Zmc2V0IHZhbHVlLCBzZXBhcmF0ZWQgd2l0aCBhIGNvbG9uXG4gICAgICAgICAqIGNoYXJhY3Rlci5cbiAgICAgICAgID4gRXhhbXBsZXNcbiAgICAgICAgICogTGluZWFyIGdyYWRpZW50LCByZWxhdGl2ZSBmcm9tIHRvcC1sZWZ0IGNvcm5lciB0byBib3R0b20tcmlnaHRcbiAgICAgICAgICogY29ybmVyLCBmcm9tIGJsYWNrIHRocm91Z2ggcmVkIHRvIHdoaXRlOlxuICAgICAgICAgfCB2YXIgZyA9IHBhcGVyLmdyYWRpZW50KFwibCgwLCAwLCAxLCAxKSMwMDAtI2YwMC0jZmZmXCIpO1xuICAgICAgICAgKiBMaW5lYXIgZ3JhZGllbnQsIGFic29sdXRlIGZyb20gKDAsIDApIHRvICgxMDAsIDEwMCksIGZyb20gYmxhY2tcbiAgICAgICAgICogdGhyb3VnaCByZWQgYXQgMjUlIHRvIHdoaXRlOlxuICAgICAgICAgfCB2YXIgZyA9IHBhcGVyLmdyYWRpZW50KFwiTCgwLCAwLCAxMDAsIDEwMCkjMDAwLSNmMDA6MjUtI2ZmZlwiKTtcbiAgICAgICAgICogUmFkaWFsIGdyYWRpZW50LCByZWxhdGl2ZSBmcm9tIHRoZSBjZW50ZXIgb2YgdGhlIGVsZW1lbnQgd2l0aCByYWRpdXNcbiAgICAgICAgICogaGFsZiB0aGUgd2lkdGgsIGZyb20gYmxhY2sgdG8gd2hpdGU6XG4gICAgICAgICB8IHZhciBnID0gcGFwZXIuZ3JhZGllbnQoXCJyKDAuNSwgMC41LCAwLjUpIzAwMC0jZmZmXCIpO1xuICAgICAgICAgKiBUbyBhcHBseSB0aGUgZ3JhZGllbnQ6XG4gICAgICAgICB8IHBhcGVyLmNpcmNsZSg1MCwgNTAsIDQwKS5hdHRyKHtcbiAgICAgICAgIHwgICAgIGZpbGw6IGdcbiAgICAgICAgIHwgfSk7XG4gICAgICAgICA9IChvYmplY3QpIHRoZSBgZ3JhZGllbnRgIGVsZW1lbnRcbiAgICAgICAgXFwqL1xuICAgICAgICBwcm90by5ncmFkaWVudCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBncmFkaWVudCh0aGlzLmRlZnMsIHN0cik7XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvLmdyYWRpZW50TGluZWFyID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JhZGllbnRMaW5lYXIodGhpcy5kZWZzLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgICAgIH07XG4gICAgICAgIHByb3RvLmdyYWRpZW50UmFkaWFsID0gZnVuY3Rpb24gKGN4LCBjeSwgciwgZngsIGZ5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JhZGllbnRSYWRpYWwodGhpcy5kZWZzLCBjeCwgY3ksIHIsIGZ4LCBmeSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogUGFwZXIudG9TdHJpbmdcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJldHVybnMgU1ZHIGNvZGUgZm9yIHRoZSBAUGFwZXJcbiAgICAgICAgID0gKHN0cmluZykgU1ZHIGNvZGUgZm9yIHRoZSBAUGFwZXJcbiAgICAgICAgXFwqL1xuICAgICAgICBwcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkb2MgPSB0aGlzLm5vZGUub3duZXJEb2N1bWVudCxcbiAgICAgICAgICAgICAgICBmID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgICAgICBkID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgICAgICAgICAgICAgc3ZnID0gdGhpcy5ub2RlLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgICAgICByZXM7XG4gICAgICAgICAgICBmLmFwcGVuZENoaWxkKGQpO1xuICAgICAgICAgICAgZC5hcHBlbmRDaGlsZChzdmcpO1xuICAgICAgICAgICAgU25hcC5fLiQoc3ZnLCB7eG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIn0pO1xuICAgICAgICAgICAgcmVzID0gZC5pbm5lckhUTUw7XG4gICAgICAgICAgICBmLnJlbW92ZUNoaWxkKGYuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIFBhcGVyLnRvRGF0YVVSTFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUmV0dXJucyBTVkcgY29kZSBmb3IgdGhlIEBQYXBlciBhcyBEYXRhIFVSSSBzdHJpbmcuXG4gICAgICAgICA9IChzdHJpbmcpIERhdGEgVVJJIHN0cmluZ1xuICAgICAgICBcXCovXG4gICAgICAgIHByb3RvLnRvRGF0YVVSTCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93LmJ0b2EpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQodGhpcykpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBQYXBlci5jbGVhclxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUmVtb3ZlcyBhbGwgY2hpbGQgbm9kZXMgb2YgdGhlIHBhcGVyLCBleGNlcHQgPGRlZnM+LlxuICAgICAgICBcXCovXG4gICAgICAgIHByb3RvLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBuZXh0O1xuICAgICAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBuZXh0ID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAobm9kZS50YWdOYW1lICE9IFwiZGVmc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm90by5jbGVhci5jYWxsKHtub2RlOiBub2RlfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0oKSk7XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XG4gICAgdmFyIGVscHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgaXMgPSBTbmFwLmlzLFxuICAgICAgICBjbG9uZSA9IFNuYXAuXy5jbG9uZSxcbiAgICAgICAgaGFzID0gXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgICAgICBwMnMgPSAvLD8oW2Etel0pLD8vZ2ksXG4gICAgICAgIHRvRmxvYXQgPSBwYXJzZUZsb2F0LFxuICAgICAgICBtYXRoID0gTWF0aCxcbiAgICAgICAgUEkgPSBtYXRoLlBJLFxuICAgICAgICBtbWluID0gbWF0aC5taW4sXG4gICAgICAgIG1tYXggPSBtYXRoLm1heCxcbiAgICAgICAgcG93ID0gbWF0aC5wb3csXG4gICAgICAgIGFicyA9IG1hdGguYWJzO1xuICAgIGZ1bmN0aW9uIHBhdGhzKHBzKSB7XG4gICAgICAgIHZhciBwID0gcGF0aHMucHMgPSBwYXRocy5wcyB8fCB7fTtcbiAgICAgICAgaWYgKHBbcHNdKSB7XG4gICAgICAgICAgICBwW3BzXS5zbGVlcCA9IDEwMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBbcHNdID0ge1xuICAgICAgICAgICAgICAgIHNsZWVwOiAxMDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcCkgaWYgKHBbaGFzXShrZXkpICYmIGtleSAhPSBwcykge1xuICAgICAgICAgICAgICAgIHBba2V5XS5zbGVlcC0tO1xuICAgICAgICAgICAgICAgICFwW2tleV0uc2xlZXAgJiYgZGVsZXRlIHBba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwW3BzXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYm94KHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICAgICAgeCA9IHkgPSB3aWR0aCA9IGhlaWdodCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgeSA9IHgueTtcbiAgICAgICAgICAgIHdpZHRoID0geC53aWR0aDtcbiAgICAgICAgICAgIGhlaWdodCA9IHguaGVpZ2h0O1xuICAgICAgICAgICAgeCA9IHgueDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICB3OiB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgaDogaGVpZ2h0LFxuICAgICAgICAgICAgeDI6IHggKyB3aWR0aCxcbiAgICAgICAgICAgIHkyOiB5ICsgaGVpZ2h0LFxuICAgICAgICAgICAgY3g6IHggKyB3aWR0aCAvIDIsXG4gICAgICAgICAgICBjeTogeSArIGhlaWdodCAvIDIsXG4gICAgICAgICAgICByMTogbWF0aC5taW4od2lkdGgsIGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgcjI6IG1hdGgubWF4KHdpZHRoLCBoZWlnaHQpIC8gMixcbiAgICAgICAgICAgIHIwOiBtYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodCkgLyAyLFxuICAgICAgICAgICAgcGF0aDogcmVjdFBhdGgoeCwgeSwgd2lkdGgsIGhlaWdodCksXG4gICAgICAgICAgICB2YjogW3gsIHksIHdpZHRoLCBoZWlnaHRdLmpvaW4oXCIgXCIpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5qb2luKFwiLFwiKS5yZXBsYWNlKHAycywgXCIkMVwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGF0aENsb25lKHBhdGhBcnJheSkge1xuICAgICAgICB2YXIgcmVzID0gY2xvbmUocGF0aEFycmF5KTtcbiAgICAgICAgcmVzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFBvaW50QXRTZWdtZW50TGVuZ3RoKHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5LCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYmV6bGVuKHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaW5kRG90c0F0U2VnbWVudChwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeSxcbiAgICAgICAgICAgICAgICBnZXRUb3RMZW4ocDF4LCBwMXksIGMxeCwgYzF5LCBjMngsIGMyeSwgcDJ4LCBwMnksIGxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldExlbmd0aEZhY3RvcnkoaXN0b3RhbCwgc3VicGF0aCkge1xuICAgICAgICBmdW5jdGlvbiBPKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuICsoK3ZhbCkudG9GaXhlZCgzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5fLmNhY2hlcihmdW5jdGlvbiAocGF0aCwgbGVuZ3RoLCBvbmx5c3RhcnQpIHtcbiAgICAgICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLmF0dHIoXCJkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0aCA9IHBhdGgyY3VydmUocGF0aCk7XG4gICAgICAgICAgICB2YXIgeCwgeSwgcCwgbCwgc3AgPSBcIlwiLCBzdWJwYXRocyA9IHt9LCBwb2ludCxcbiAgICAgICAgICAgICAgICBsZW4gPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcGF0aC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcCA9IHBhdGhbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBbMF0gPT0gXCJNXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeCA9ICtwWzFdO1xuICAgICAgICAgICAgICAgICAgICB5ID0gK3BbMl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGdldFBvaW50QXRTZWdtZW50TGVuZ3RoKHgsIHksIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0sIHBbNl0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVuICsgbCA+IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnBhdGggJiYgIXN1YnBhdGhzLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQgPSBnZXRQb2ludEF0U2VnbWVudExlbmd0aCh4LCB5LCBwWzFdLCBwWzJdLCBwWzNdLCBwWzRdLCBwWzVdLCBwWzZdLCBsZW5ndGggLSBsZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwICs9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDXCIgKyBPKHBvaW50LnN0YXJ0LngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50LnN0YXJ0LnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50Lm0ueCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQubS55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC54KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC55KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ubHlzdGFydCkge3JldHVybiBzcDt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VicGF0aHMuc3RhcnQgPSBzcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJNXCIgKyBPKHBvaW50LngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50LnkpICsgXCJDXCIgKyBPKHBvaW50Lm4ueCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQubi55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC5lbmQueCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQuZW5kLnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBbNV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBbNl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuICs9IGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9ICtwWzVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSArcFs2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXN0b3RhbCAmJiAhc3VicGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ID0gZ2V0UG9pbnRBdFNlZ21lbnRMZW5ndGgoeCwgeSwgcFsxXSwgcFsyXSwgcFszXSwgcFs0XSwgcFs1XSwgcFs2XSwgbGVuZ3RoIC0gbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGVuICs9IGw7XG4gICAgICAgICAgICAgICAgICAgIHggPSArcFs1XTtcbiAgICAgICAgICAgICAgICAgICAgeSA9ICtwWzZdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzcCArPSBwLnNoaWZ0KCkgKyBwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VicGF0aHMuZW5kID0gc3A7XG4gICAgICAgICAgICBwb2ludCA9IGlzdG90YWwgPyBsZW4gOiBzdWJwYXRoID8gc3VicGF0aHMgOiBmaW5kRG90c0F0U2VnbWVudCh4LCB5LCBwWzBdLCBwWzFdLCBwWzJdLCBwWzNdLCBwWzRdLCBwWzVdLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgfSwgbnVsbCwgU25hcC5fLmNsb25lKTtcbiAgICB9XG4gICAgdmFyIGdldFRvdGFsTGVuZ3RoID0gZ2V0TGVuZ3RoRmFjdG9yeSgxKSxcbiAgICAgICAgZ2V0UG9pbnRBdExlbmd0aCA9IGdldExlbmd0aEZhY3RvcnkoKSxcbiAgICAgICAgZ2V0U3VicGF0aHNBdExlbmd0aCA9IGdldExlbmd0aEZhY3RvcnkoMCwgMSk7XG4gICAgZnVuY3Rpb24gZmluZERvdHNBdFNlZ21lbnQocDF4LCBwMXksIGMxeCwgYzF5LCBjMngsIGMyeSwgcDJ4LCBwMnksIHQpIHtcbiAgICAgICAgdmFyIHQxID0gMSAtIHQsXG4gICAgICAgICAgICB0MTMgPSBwb3codDEsIDMpLFxuICAgICAgICAgICAgdDEyID0gcG93KHQxLCAyKSxcbiAgICAgICAgICAgIHQyID0gdCAqIHQsXG4gICAgICAgICAgICB0MyA9IHQyICogdCxcbiAgICAgICAgICAgIHggPSB0MTMgKiBwMXggKyB0MTIgKiAzICogdCAqIGMxeCArIHQxICogMyAqIHQgKiB0ICogYzJ4ICsgdDMgKiBwMngsXG4gICAgICAgICAgICB5ID0gdDEzICogcDF5ICsgdDEyICogMyAqIHQgKiBjMXkgKyB0MSAqIDMgKiB0ICogdCAqIGMyeSArIHQzICogcDJ5LFxuICAgICAgICAgICAgbXggPSBwMXggKyAyICogdCAqIChjMXggLSBwMXgpICsgdDIgKiAoYzJ4IC0gMiAqIGMxeCArIHAxeCksXG4gICAgICAgICAgICBteSA9IHAxeSArIDIgKiB0ICogKGMxeSAtIHAxeSkgKyB0MiAqIChjMnkgLSAyICogYzF5ICsgcDF5KSxcbiAgICAgICAgICAgIG54ID0gYzF4ICsgMiAqIHQgKiAoYzJ4IC0gYzF4KSArIHQyICogKHAyeCAtIDIgKiBjMnggKyBjMXgpLFxuICAgICAgICAgICAgbnkgPSBjMXkgKyAyICogdCAqIChjMnkgLSBjMXkpICsgdDIgKiAocDJ5IC0gMiAqIGMyeSArIGMxeSksXG4gICAgICAgICAgICBheCA9IHQxICogcDF4ICsgdCAqIGMxeCxcbiAgICAgICAgICAgIGF5ID0gdDEgKiBwMXkgKyB0ICogYzF5LFxuICAgICAgICAgICAgY3ggPSB0MSAqIGMyeCArIHQgKiBwMngsXG4gICAgICAgICAgICBjeSA9IHQxICogYzJ5ICsgdCAqIHAyeSxcbiAgICAgICAgICAgIGFscGhhID0gOTAgLSBtYXRoLmF0YW4yKG14IC0gbngsIG15IC0gbnkpICogMTgwIC8gUEk7XG4gICAgICAgIC8vIChteCA+IG54IHx8IG15IDwgbnkpICYmIChhbHBoYSArPSAxODApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICBtOiB7eDogbXgsIHk6IG15fSxcbiAgICAgICAgICAgIG46IHt4OiBueCwgeTogbnl9LFxuICAgICAgICAgICAgc3RhcnQ6IHt4OiBheCwgeTogYXl9LFxuICAgICAgICAgICAgZW5kOiB7eDogY3gsIHk6IGN5fSxcbiAgICAgICAgICAgIGFscGhhOiBhbHBoYVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBiZXppZXJCQm94KHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5KSB7XG4gICAgICAgIGlmICghU25hcC5pcyhwMXgsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIHAxeCA9IFtwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJib3ggPSBjdXJ2ZURpbS5hcHBseShudWxsLCBwMXgpO1xuICAgICAgICByZXR1cm4gYm94KFxuICAgICAgICAgICAgYmJveC5taW4ueCxcbiAgICAgICAgICAgIGJib3gubWluLnksXG4gICAgICAgICAgICBiYm94Lm1heC54IC0gYmJveC5taW4ueCxcbiAgICAgICAgICAgIGJib3gubWF4LnkgLSBiYm94Lm1pbi55XG4gICAgICAgICk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzUG9pbnRJbnNpZGVCQm94KGJib3gsIHgsIHkpIHtcbiAgICAgICAgcmV0dXJuICB4ID49IGJib3gueCAmJlxuICAgICAgICAgICAgICAgIHggPD0gYmJveC54ICsgYmJveC53aWR0aCAmJlxuICAgICAgICAgICAgICAgIHkgPj0gYmJveC55ICYmXG4gICAgICAgICAgICAgICAgeSA8PSBiYm94LnkgKyBiYm94LmhlaWdodDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNCQm94SW50ZXJzZWN0KGJib3gxLCBiYm94Mikge1xuICAgICAgICBiYm94MSA9IGJveChiYm94MSk7XG4gICAgICAgIGJib3gyID0gYm94KGJib3gyKTtcbiAgICAgICAgcmV0dXJuIGlzUG9pbnRJbnNpZGVCQm94KGJib3gyLCBiYm94MS54LCBiYm94MS55KVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDIsIGJib3gxLngyLCBiYm94MS55KVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDIsIGJib3gxLngsIGJib3gxLnkyKVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDIsIGJib3gxLngyLCBiYm94MS55MilcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gxLCBiYm94Mi54LCBiYm94Mi55KVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDEsIGJib3gyLngyLCBiYm94Mi55KVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDEsIGJib3gyLngsIGJib3gyLnkyKVxuICAgICAgICAgICAgfHwgaXNQb2ludEluc2lkZUJCb3goYmJveDEsIGJib3gyLngyLCBiYm94Mi55MilcbiAgICAgICAgICAgIHx8IChiYm94MS54IDwgYmJveDIueDIgJiYgYmJveDEueCA+IGJib3gyLnhcbiAgICAgICAgICAgICAgICB8fCBiYm94Mi54IDwgYmJveDEueDIgJiYgYmJveDIueCA+IGJib3gxLngpXG4gICAgICAgICAgICAmJiAoYmJveDEueSA8IGJib3gyLnkyICYmIGJib3gxLnkgPiBiYm94Mi55XG4gICAgICAgICAgICAgICAgfHwgYmJveDIueSA8IGJib3gxLnkyICYmIGJib3gyLnkgPiBiYm94MS55KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYmFzZTModCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgdmFyIHQxID0gLTMgKiBwMSArIDkgKiBwMiAtIDkgKiBwMyArIDMgKiBwNCxcbiAgICAgICAgICAgIHQyID0gdCAqIHQxICsgNiAqIHAxIC0gMTIgKiBwMiArIDYgKiBwMztcbiAgICAgICAgcmV0dXJuIHQgKiB0MiAtIDMgKiBwMSArIDMgKiBwMjtcbiAgICB9XG4gICAgZnVuY3Rpb24gYmV6bGVuKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgeikge1xuICAgICAgICBpZiAoeiA9PSBudWxsKSB7XG4gICAgICAgICAgICB6ID0gMTtcbiAgICAgICAgfVxuICAgICAgICB6ID0geiA+IDEgPyAxIDogeiA8IDAgPyAwIDogejtcbiAgICAgICAgdmFyIHoyID0geiAvIDIsXG4gICAgICAgICAgICBuID0gMTIsXG4gICAgICAgICAgICBUdmFsdWVzID0gWy0uMTI1MiwuMTI1MiwtLjM2NzgsLjM2NzgsLS41ODczLC41ODczLC0uNzY5OSwuNzY5OSwtLjkwNDEsLjkwNDEsLS45ODE2LC45ODE2XSxcbiAgICAgICAgICAgIEN2YWx1ZXMgPSBbMC4yNDkxLDAuMjQ5MSwwLjIzMzUsMC4yMzM1LDAuMjAzMiwwLjIwMzIsMC4xNjAxLDAuMTYwMSwwLjEwNjksMC4xMDY5LDAuMDQ3MiwwLjA0NzJdLFxuICAgICAgICAgICAgc3VtID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdCA9IHoyICogVHZhbHVlc1tpXSArIHoyLFxuICAgICAgICAgICAgICAgIHhiYXNlID0gYmFzZTMoY3QsIHgxLCB4MiwgeDMsIHg0KSxcbiAgICAgICAgICAgICAgICB5YmFzZSA9IGJhc2UzKGN0LCB5MSwgeTIsIHkzLCB5NCksXG4gICAgICAgICAgICAgICAgY29tYiA9IHhiYXNlICogeGJhc2UgKyB5YmFzZSAqIHliYXNlO1xuICAgICAgICAgICAgc3VtICs9IEN2YWx1ZXNbaV0gKiBtYXRoLnNxcnQoY29tYik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHoyICogc3VtO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRUb3RMZW4oeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCBsbCkge1xuICAgICAgICBpZiAobGwgPCAwIHx8IGJlemxlbih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQpIDwgbGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdCA9IDEsXG4gICAgICAgICAgICBzdGVwID0gdCAvIDIsXG4gICAgICAgICAgICB0MiA9IHQgLSBzdGVwLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGUgPSAuMDE7XG4gICAgICAgIGwgPSBiZXpsZW4oeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCB0Mik7XG4gICAgICAgIHdoaWxlIChhYnMobCAtIGxsKSA+IGUpIHtcbiAgICAgICAgICAgIHN0ZXAgLz0gMjtcbiAgICAgICAgICAgIHQyICs9IChsIDwgbGwgPyAxIDogLTEpICogc3RlcDtcbiAgICAgICAgICAgIGwgPSBiZXpsZW4oeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0LCB0Mik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQyO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbnRlcnNlY3QoeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG1tYXgoeDEsIHgyKSA8IG1taW4oeDMsIHg0KSB8fFxuICAgICAgICAgICAgbW1pbih4MSwgeDIpID4gbW1heCh4MywgeDQpIHx8XG4gICAgICAgICAgICBtbWF4KHkxLCB5MikgPCBtbWluKHkzLCB5NCkgfHxcbiAgICAgICAgICAgIG1taW4oeTEsIHkyKSA+IG1tYXgoeTMsIHk0KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnggPSAoeDEgKiB5MiAtIHkxICogeDIpICogKHgzIC0geDQpIC0gKHgxIC0geDIpICogKHgzICogeTQgLSB5MyAqIHg0KSxcbiAgICAgICAgICAgIG55ID0gKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCksXG4gICAgICAgICAgICBkZW5vbWluYXRvciA9ICh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KTtcblxuICAgICAgICBpZiAoIWRlbm9taW5hdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHB4ID0gbnggLyBkZW5vbWluYXRvcixcbiAgICAgICAgICAgIHB5ID0gbnkgLyBkZW5vbWluYXRvcixcbiAgICAgICAgICAgIHB4MiA9ICtweC50b0ZpeGVkKDIpLFxuICAgICAgICAgICAgcHkyID0gK3B5LnRvRml4ZWQoMik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHB4MiA8ICttbWluKHgxLCB4MikudG9GaXhlZCgyKSB8fFxuICAgICAgICAgICAgcHgyID4gK21tYXgoeDEsIHgyKS50b0ZpeGVkKDIpIHx8XG4gICAgICAgICAgICBweDIgPCArbW1pbih4MywgeDQpLnRvRml4ZWQoMikgfHxcbiAgICAgICAgICAgIHB4MiA+ICttbWF4KHgzLCB4NCkudG9GaXhlZCgyKSB8fFxuICAgICAgICAgICAgcHkyIDwgK21taW4oeTEsIHkyKS50b0ZpeGVkKDIpIHx8XG4gICAgICAgICAgICBweTIgPiArbW1heCh5MSwgeTIpLnRvRml4ZWQoMikgfHxcbiAgICAgICAgICAgIHB5MiA8ICttbWluKHkzLCB5NCkudG9GaXhlZCgyKSB8fFxuICAgICAgICAgICAgcHkyID4gK21tYXgoeTMsIHk0KS50b0ZpeGVkKDIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7eDogcHgsIHk6IHB5fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW50ZXIoYmV6MSwgYmV6Mikge1xuICAgICAgICByZXR1cm4gaW50ZXJIZWxwZXIoYmV6MSwgYmV6Mik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludGVyQ291bnQoYmV6MSwgYmV6Mikge1xuICAgICAgICByZXR1cm4gaW50ZXJIZWxwZXIoYmV6MSwgYmV6MiwgMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludGVySGVscGVyKGJlejEsIGJlejIsIGp1c3RDb3VudCkge1xuICAgICAgICB2YXIgYmJveDEgPSBiZXppZXJCQm94KGJlejEpLFxuICAgICAgICAgICAgYmJveDIgPSBiZXppZXJCQm94KGJlejIpO1xuICAgICAgICBpZiAoIWlzQkJveEludGVyc2VjdChiYm94MSwgYmJveDIpKSB7XG4gICAgICAgICAgICByZXR1cm4ganVzdENvdW50ID8gMCA6IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsMSA9IGJlemxlbi5hcHBseSgwLCBiZXoxKSxcbiAgICAgICAgICAgIGwyID0gYmV6bGVuLmFwcGx5KDAsIGJlejIpLFxuICAgICAgICAgICAgbjEgPSB+fihsMSAvIDgpLFxuICAgICAgICAgICAgbjIgPSB+fihsMiAvIDgpLFxuICAgICAgICAgICAgZG90czEgPSBbXSxcbiAgICAgICAgICAgIGRvdHMyID0gW10sXG4gICAgICAgICAgICB4eSA9IHt9LFxuICAgICAgICAgICAgcmVzID0ganVzdENvdW50ID8gMCA6IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4xICsgMTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcCA9IGZpbmREb3RzQXRTZWdtZW50LmFwcGx5KDAsIGJlejEuY29uY2F0KGkgLyBuMSkpO1xuICAgICAgICAgICAgZG90czEucHVzaCh7eDogcC54LCB5OiBwLnksIHQ6IGkgLyBuMX0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuMiArIDE7IGkrKykge1xuICAgICAgICAgICAgcCA9IGZpbmREb3RzQXRTZWdtZW50LmFwcGx5KDAsIGJlejIuY29uY2F0KGkgLyBuMikpO1xuICAgICAgICAgICAgZG90czIucHVzaCh7eDogcC54LCB5OiBwLnksIHQ6IGkgLyBuMn0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuMTsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG4yOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZGkgPSBkb3RzMVtpXSxcbiAgICAgICAgICAgICAgICAgICAgZGkxID0gZG90czFbaSArIDFdLFxuICAgICAgICAgICAgICAgICAgICBkaiA9IGRvdHMyW2pdLFxuICAgICAgICAgICAgICAgICAgICBkajEgPSBkb3RzMltqICsgMV0sXG4gICAgICAgICAgICAgICAgICAgIGNpID0gYWJzKGRpMS54IC0gZGkueCkgPCAuMDAxID8gXCJ5XCIgOiBcInhcIixcbiAgICAgICAgICAgICAgICAgICAgY2ogPSBhYnMoZGoxLnggLSBkai54KSA8IC4wMDEgPyBcInlcIiA6IFwieFwiLFxuICAgICAgICAgICAgICAgICAgICBpcyA9IGludGVyc2VjdChkaS54LCBkaS55LCBkaTEueCwgZGkxLnksIGRqLngsIGRqLnksIGRqMS54LCBkajEueSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4eVtpcy54LnRvRml4ZWQoNCldID09IGlzLnkudG9GaXhlZCg0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgeHlbaXMueC50b0ZpeGVkKDQpXSA9IGlzLnkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQxID0gZGkudCArIGFicygoaXNbY2ldIC0gZGlbY2ldKSAvIChkaTFbY2ldIC0gZGlbY2ldKSkgKiAoZGkxLnQgLSBkaS50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHQyID0gZGoudCArIGFicygoaXNbY2pdIC0gZGpbY2pdKSAvIChkajFbY2pdIC0gZGpbY2pdKSkgKiAoZGoxLnQgLSBkai50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQxID49IDAgJiYgdDEgPD0gMSAmJiB0MiA+PSAwICYmIHQyIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqdXN0Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBpcy54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBpcy55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0MTogdDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQyOiB0MlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhdGhJbnRlcnNlY3Rpb24ocGF0aDEsIHBhdGgyKSB7XG4gICAgICAgIHJldHVybiBpbnRlclBhdGhIZWxwZXIocGF0aDEsIHBhdGgyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGF0aEludGVyc2VjdGlvbk51bWJlcihwYXRoMSwgcGF0aDIpIHtcbiAgICAgICAgcmV0dXJuIGludGVyUGF0aEhlbHBlcihwYXRoMSwgcGF0aDIsIDEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbnRlclBhdGhIZWxwZXIocGF0aDEsIHBhdGgyLCBqdXN0Q291bnQpIHtcbiAgICAgICAgcGF0aDEgPSBwYXRoMmN1cnZlKHBhdGgxKTtcbiAgICAgICAgcGF0aDIgPSBwYXRoMmN1cnZlKHBhdGgyKTtcbiAgICAgICAgdmFyIHgxLCB5MSwgeDIsIHkyLCB4MW0sIHkxbSwgeDJtLCB5Mm0sIGJlejEsIGJlejIsXG4gICAgICAgICAgICByZXMgPSBqdXN0Q291bnQgPyAwIDogW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBhdGgxLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwaSA9IHBhdGgxW2ldO1xuICAgICAgICAgICAgaWYgKHBpWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICAgICAgeDEgPSB4MW0gPSBwaVsxXTtcbiAgICAgICAgICAgICAgICB5MSA9IHkxbSA9IHBpWzJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocGlbMF0gPT0gXCJDXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYmV6MSA9IFt4MSwgeTFdLmNvbmNhdChwaS5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgICAgIHgxID0gYmV6MVs2XTtcbiAgICAgICAgICAgICAgICAgICAgeTEgPSBiZXoxWzddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJlejEgPSBbeDEsIHkxLCB4MSwgeTEsIHgxbSwgeTFtLCB4MW0sIHkxbV07XG4gICAgICAgICAgICAgICAgICAgIHgxID0geDFtO1xuICAgICAgICAgICAgICAgICAgICB5MSA9IHkxbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0gcGF0aDIubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGogPSBwYXRoMltqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBqWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHgybSA9IHBqWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSB5Mm0gPSBwalsyXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwalswXSA9PSBcIkNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlejIgPSBbeDIsIHkyXS5jb25jYXQocGouc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gYmV6Mls2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGJlejJbN107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlejIgPSBbeDIsIHkyLCB4MiwgeTIsIHgybSwgeTJtLCB4Mm0sIHkybV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSB4Mm07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSB5Mm07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW50ciA9IGludGVySGVscGVyKGJlejEsIGJlejIsIGp1c3RDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanVzdENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9IGludHI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwLCBrayA9IGludHIubGVuZ3RoOyBrIDwga2s7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRyW2tdLnNlZ21lbnQxID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50cltrXS5zZWdtZW50MiA9IGo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludHJba10uYmV6MSA9IGJlejE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludHJba10uYmV6MiA9IGJlejI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoaW50cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNQb2ludEluc2lkZVBhdGgocGF0aCwgeCwgeSkge1xuICAgICAgICB2YXIgYmJveCA9IHBhdGhCQm94KHBhdGgpO1xuICAgICAgICByZXR1cm4gaXNQb2ludEluc2lkZUJCb3goYmJveCwgeCwgeSkgJiZcbiAgICAgICAgICAgICAgIGludGVyUGF0aEhlbHBlcihwYXRoLCBbW1wiTVwiLCB4LCB5XSwgW1wiSFwiLCBiYm94LngyICsgMTBdXSwgMSkgJSAyID09IDE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhdGhCQm94KHBhdGgpIHtcbiAgICAgICAgdmFyIHB0aCA9IHBhdGhzKHBhdGgpO1xuICAgICAgICBpZiAocHRoLmJib3gpIHtcbiAgICAgICAgICAgIHJldHVybiBjbG9uZShwdGguYmJveCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYm94KCk7XG4gICAgICAgIH1cbiAgICAgICAgcGF0aCA9IHBhdGgyY3VydmUocGF0aCk7XG4gICAgICAgIHZhciB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwLFxuICAgICAgICAgICAgWCA9IFtdLFxuICAgICAgICAgICAgWSA9IFtdLFxuICAgICAgICAgICAgcDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcGF0aC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBwID0gcGF0aFtpXTtcbiAgICAgICAgICAgIGlmIChwWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICAgICAgeCA9IHBbMV07XG4gICAgICAgICAgICAgICAgeSA9IHBbMl07XG4gICAgICAgICAgICAgICAgWC5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIFkucHVzaCh5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpbSA9IGN1cnZlRGltKHgsIHksIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0sIHBbNl0pO1xuICAgICAgICAgICAgICAgIFggPSBYLmNvbmNhdChkaW0ubWluLngsIGRpbS5tYXgueCk7XG4gICAgICAgICAgICAgICAgWSA9IFkuY29uY2F0KGRpbS5taW4ueSwgZGltLm1heC55KTtcbiAgICAgICAgICAgICAgICB4ID0gcFs1XTtcbiAgICAgICAgICAgICAgICB5ID0gcFs2XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgeG1pbiA9IG1taW4uYXBwbHkoMCwgWCksXG4gICAgICAgICAgICB5bWluID0gbW1pbi5hcHBseSgwLCBZKSxcbiAgICAgICAgICAgIHhtYXggPSBtbWF4LmFwcGx5KDAsIFgpLFxuICAgICAgICAgICAgeW1heCA9IG1tYXguYXBwbHkoMCwgWSksXG4gICAgICAgICAgICBiYiA9IGJveCh4bWluLCB5bWluLCB4bWF4IC0geG1pbiwgeW1heCAtIHltaW4pO1xuICAgICAgICBwdGguYmJveCA9IGNsb25lKGJiKTtcbiAgICAgICAgcmV0dXJuIGJiO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWN0UGF0aCh4LCB5LCB3LCBoLCByKSB7XG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIFtcIk1cIiwgK3ggKyArciwgeV0sXG4gICAgICAgICAgICAgICAgW1wibFwiLCB3IC0gciAqIDIsIDBdLFxuICAgICAgICAgICAgICAgIFtcImFcIiwgciwgciwgMCwgMCwgMSwgciwgcl0sXG4gICAgICAgICAgICAgICAgW1wibFwiLCAwLCBoIC0gciAqIDJdLFxuICAgICAgICAgICAgICAgIFtcImFcIiwgciwgciwgMCwgMCwgMSwgLXIsIHJdLFxuICAgICAgICAgICAgICAgIFtcImxcIiwgciAqIDIgLSB3LCAwXSxcbiAgICAgICAgICAgICAgICBbXCJhXCIsIHIsIHIsIDAsIDAsIDEsIC1yLCAtcl0sXG4gICAgICAgICAgICAgICAgW1wibFwiLCAwLCByICogMiAtIGhdLFxuICAgICAgICAgICAgICAgIFtcImFcIiwgciwgciwgMCwgMCwgMSwgciwgLXJdLFxuICAgICAgICAgICAgICAgIFtcInpcIl1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcyA9IFtbXCJNXCIsIHgsIHldLCBbXCJsXCIsIHcsIDBdLCBbXCJsXCIsIDAsIGhdLCBbXCJsXCIsIC13LCAwXSwgW1wielwiXV07XG4gICAgICAgIHJlcy50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbGxpcHNlUGF0aCh4LCB5LCByeCwgcnksIGEpIHtcbiAgICAgICAgaWYgKGEgPT0gbnVsbCAmJiByeSA9PSBudWxsKSB7XG4gICAgICAgICAgICByeSA9IHJ4O1xuICAgICAgICB9XG4gICAgICAgIHggPSAreDtcbiAgICAgICAgeSA9ICt5O1xuICAgICAgICByeCA9ICtyeDtcbiAgICAgICAgcnkgPSArcnk7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByYWQgPSBNYXRoLlBJIC8gMTgwLFxuICAgICAgICAgICAgICAgIHgxID0geCArIHJ4ICogTWF0aC5jb3MoLXJ5ICogcmFkKSxcbiAgICAgICAgICAgICAgICB4MiA9IHggKyByeCAqIE1hdGguY29zKC1hICogcmFkKSxcbiAgICAgICAgICAgICAgICB5MSA9IHkgKyByeCAqIE1hdGguc2luKC1yeSAqIHJhZCksXG4gICAgICAgICAgICAgICAgeTIgPSB5ICsgcnggKiBNYXRoLnNpbigtYSAqIHJhZCksXG4gICAgICAgICAgICAgICAgcmVzID0gW1tcIk1cIiwgeDEsIHkxXSwgW1wiQVwiLCByeCwgcngsIDAsICsoYSAtIHJ5ID4gMTgwKSwgMCwgeDIsIHkyXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBbXG4gICAgICAgICAgICAgICAgW1wiTVwiLCB4LCB5XSxcbiAgICAgICAgICAgICAgICBbXCJtXCIsIDAsIC1yeV0sXG4gICAgICAgICAgICAgICAgW1wiYVwiLCByeCwgcnksIDAsIDEsIDEsIDAsIDIgKiByeV0sXG4gICAgICAgICAgICAgICAgW1wiYVwiLCByeCwgcnksIDAsIDEsIDEsIDAsIC0yICogcnldLFxuICAgICAgICAgICAgICAgIFtcInpcIl1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIHZhciB1bml0MnB4ID0gU25hcC5fdW5pdDJweCxcbiAgICAgICAgZ2V0UGF0aCA9IHtcbiAgICAgICAgcGF0aDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuYXR0cihcInBhdGhcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGNpcmNsZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9IHVuaXQycHgoZWwpO1xuICAgICAgICAgICAgcmV0dXJuIGVsbGlwc2VQYXRoKGF0dHIuY3gsIGF0dHIuY3ksIGF0dHIucik7XG4gICAgICAgIH0sXG4gICAgICAgIGVsbGlwc2U6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB1bml0MnB4KGVsKTtcbiAgICAgICAgICAgIHJldHVybiBlbGxpcHNlUGF0aChhdHRyLmN4IHx8IDAsIGF0dHIuY3kgfHwgMCwgYXR0ci5yeCwgYXR0ci5yeSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlY3Q6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB1bml0MnB4KGVsKTtcbiAgICAgICAgICAgIHJldHVybiByZWN0UGF0aChhdHRyLnggfHwgMCwgYXR0ci55IHx8IDAsIGF0dHIud2lkdGgsIGF0dHIuaGVpZ2h0LCBhdHRyLnJ4LCBhdHRyLnJ5KTtcbiAgICAgICAgfSxcbiAgICAgICAgaW1hZ2U6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB1bml0MnB4KGVsKTtcbiAgICAgICAgICAgIHJldHVybiByZWN0UGF0aChhdHRyLnggfHwgMCwgYXR0ci55IHx8IDAsIGF0dHIud2lkdGgsIGF0dHIuaGVpZ2h0KTtcbiAgICAgICAgfSxcbiAgICAgICAgbGluZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBbZWwuYXR0cihcIngxXCIpIHx8IDAsIGVsLmF0dHIoXCJ5MVwiKSB8fCAwLCBlbC5hdHRyKFwieDJcIiksIGVsLmF0dHIoXCJ5MlwiKV07XG4gICAgICAgIH0sXG4gICAgICAgIHBvbHlsaW5lOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIk1cIiArIGVsLmF0dHIoXCJwb2ludHNcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHBvbHlnb246IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTVwiICsgZWwuYXR0cihcInBvaW50c1wiKSArIFwielwiO1xuICAgICAgICB9LFxuICAgICAgICBkZWZsdDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB2YXIgYmJveCA9IGVsLm5vZGUuZ2V0QkJveCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY3RQYXRoKGJib3gueCwgYmJveC55LCBiYm94LndpZHRoLCBiYm94LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZ1bmN0aW9uIHBhdGhUb1JlbGF0aXZlKHBhdGhBcnJheSkge1xuICAgICAgICB2YXIgcHRoID0gcGF0aHMocGF0aEFycmF5KSxcbiAgICAgICAgICAgIGxvd2VyQ2FzZSA9IFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2U7XG4gICAgICAgIGlmIChwdGgucmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aENsb25lKHB0aC5yZWwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghU25hcC5pcyhwYXRoQXJyYXksIFwiYXJyYXlcIikgfHwgIVNuYXAuaXMocGF0aEFycmF5ICYmIHBhdGhBcnJheVswXSwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgcGF0aEFycmF5ID0gU25hcC5wYXJzZVBhdGhTdHJpbmcocGF0aEFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzID0gW10sXG4gICAgICAgICAgICB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwLFxuICAgICAgICAgICAgbXggPSAwLFxuICAgICAgICAgICAgbXkgPSAwLFxuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICBpZiAocGF0aEFycmF5WzBdWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICB4ID0gcGF0aEFycmF5WzBdWzFdO1xuICAgICAgICAgICAgeSA9IHBhdGhBcnJheVswXVsyXTtcbiAgICAgICAgICAgIG14ID0geDtcbiAgICAgICAgICAgIG15ID0geTtcbiAgICAgICAgICAgIHN0YXJ0Kys7XG4gICAgICAgICAgICByZXMucHVzaChbXCJNXCIsIHgsIHldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQsIGlpID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByID0gcmVzW2ldID0gW10sXG4gICAgICAgICAgICAgICAgcGEgPSBwYXRoQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocGFbMF0gIT0gbG93ZXJDYXNlLmNhbGwocGFbMF0pKSB7XG4gICAgICAgICAgICAgICAgclswXSA9IGxvd2VyQ2FzZS5jYWxsKHBhWzBdKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMV0gPSBwYVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMl0gPSBwYVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbM10gPSBwYVszXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNF0gPSBwYVs0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNV0gPSBwYVs1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNl0gPSArKHBhWzZdIC0geCkudG9GaXhlZCgzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbN10gPSArKHBhWzddIC0geSkudG9GaXhlZCgzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgclsxXSA9ICsocGFbMV0gLSB5KS50b0ZpeGVkKDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBteCA9IHBhWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXkgPSBwYVsyXTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAxLCBqaiA9IHBhLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByW2pdID0gKyhwYVtqXSAtIChqICUgMiA/IHggOiB5KSkudG9GaXhlZCgzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHIgPSByZXNbaV0gPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAocGFbMF0gPT0gXCJtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbXggPSBwYVsxXSArIHg7XG4gICAgICAgICAgICAgICAgICAgIG15ID0gcGFbMl0gKyB5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMCwga2sgPSBwYS5sZW5ndGg7IGsgPCBrazsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc1tpXVtrXSA9IHBhW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsZW4gPSByZXNbaV0ubGVuZ3RoO1xuICAgICAgICAgICAgc3dpdGNoIChyZXNbaV1bMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwielwiOlxuICAgICAgICAgICAgICAgICAgICB4ID0gbXg7XG4gICAgICAgICAgICAgICAgICAgIHkgPSBteTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImhcIjpcbiAgICAgICAgICAgICAgICAgICAgeCArPSArcmVzW2ldW2xlbiAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwidlwiOlxuICAgICAgICAgICAgICAgICAgICB5ICs9ICtyZXNbaV1bbGVuIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHggKz0gK3Jlc1tpXVtsZW4gLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgeSArPSArcmVzW2ldW2xlbiAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcy50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgICAgICBwdGgucmVsID0gcGF0aENsb25lKHJlcyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhdGhUb0Fic29sdXRlKHBhdGhBcnJheSkge1xuICAgICAgICB2YXIgcHRoID0gcGF0aHMocGF0aEFycmF5KTtcbiAgICAgICAgaWYgKHB0aC5hYnMpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoQ2xvbmUocHRoLmFicyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpcyhwYXRoQXJyYXksIFwiYXJyYXlcIikgfHwgIWlzKHBhdGhBcnJheSAmJiBwYXRoQXJyYXlbMF0sIFwiYXJyYXlcIikpIHsgLy8gcm91Z2ggYXNzdW1wdGlvblxuICAgICAgICAgICAgcGF0aEFycmF5ID0gU25hcC5wYXJzZVBhdGhTdHJpbmcocGF0aEFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBhdGhBcnJheSB8fCAhcGF0aEFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtbXCJNXCIsIDAsIDBdXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzID0gW10sXG4gICAgICAgICAgICB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwLFxuICAgICAgICAgICAgbXggPSAwLFxuICAgICAgICAgICAgbXkgPSAwLFxuICAgICAgICAgICAgc3RhcnQgPSAwLFxuICAgICAgICAgICAgcGEwO1xuICAgICAgICBpZiAocGF0aEFycmF5WzBdWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICB4ID0gK3BhdGhBcnJheVswXVsxXTtcbiAgICAgICAgICAgIHkgPSArcGF0aEFycmF5WzBdWzJdO1xuICAgICAgICAgICAgbXggPSB4O1xuICAgICAgICAgICAgbXkgPSB5O1xuICAgICAgICAgICAgc3RhcnQrKztcbiAgICAgICAgICAgIHJlc1swXSA9IFtcIk1cIiwgeCwgeV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNyeiA9IHBhdGhBcnJheS5sZW5ndGggPT0gMyAmJlxuICAgICAgICAgICAgcGF0aEFycmF5WzBdWzBdID09IFwiTVwiICYmXG4gICAgICAgICAgICBwYXRoQXJyYXlbMV1bMF0udG9VcHBlckNhc2UoKSA9PSBcIlJcIiAmJlxuICAgICAgICAgICAgcGF0aEFycmF5WzJdWzBdLnRvVXBwZXJDYXNlKCkgPT0gXCJaXCI7XG4gICAgICAgIGZvciAodmFyIHIsIHBhLCBpID0gc3RhcnQsIGlpID0gcGF0aEFycmF5Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKHIgPSBbXSk7XG4gICAgICAgICAgICBwYSA9IHBhdGhBcnJheVtpXTtcbiAgICAgICAgICAgIHBhMCA9IHBhWzBdO1xuICAgICAgICAgICAgaWYgKHBhMCAhPSBwYTAudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHJbMF0gPSBwYTAudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMV0gPSBwYVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMl0gPSBwYVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbM10gPSBwYVszXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNF0gPSBwYVs0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNV0gPSBwYVs1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbNl0gPSArcGFbNl0gKyB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgcls3XSA9ICtwYVs3XSArIHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMV0gPSArcGFbMV0gKyB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByWzFdID0gK3BhWzFdICsgeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRvdHMgPSBbeCwgeV0uY29uY2F0KHBhLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAyLCBqaiA9IGRvdHMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHNbal0gPSArZG90c1tqXSArIHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG90c1srK2pdID0gK2RvdHNbal0gKyB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdChjYXRtdWxsUm9tMmJlemllcihkb3RzLCBjcnopKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiT1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG90cyA9IGVsbGlwc2VQYXRoKHgsIHksIHBhWzFdLCBwYVsyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzLnB1c2goZG90c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGRvdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJVXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGVsbGlwc2VQYXRoKHgsIHksIHBhWzFdLCBwYVsyXSwgcGFbM10pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBbXCJVXCJdLmNvbmNhdChyZXNbcmVzLmxlbmd0aCAtIDFdLnNsaWNlKC0yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG14ID0gK3BhWzFdICsgeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15ID0gK3BhWzJdICsgeTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDEsIGpqID0gcGEubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJbal0gPSArcGFbal0gKyAoaiAlIDIgPyB4IDogeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYTAgPT0gXCJSXCIpIHtcbiAgICAgICAgICAgICAgICBkb3RzID0gW3gsIHldLmNvbmNhdChwYS5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgcmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoY2F0bXVsbFJvbTJiZXppZXIoZG90cywgY3J6KSk7XG4gICAgICAgICAgICAgICAgciA9IFtcIlJcIl0uY29uY2F0KHBhLnNsaWNlKC0yKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhMCA9PSBcIk9cIikge1xuICAgICAgICAgICAgICAgIHJlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICBkb3RzID0gZWxsaXBzZVBhdGgoeCwgeSwgcGFbMV0sIHBhWzJdKTtcbiAgICAgICAgICAgICAgICBkb3RzLnB1c2goZG90c1swXSk7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdChkb3RzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGEwID09IFwiVVwiKSB7XG4gICAgICAgICAgICAgICAgcmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoZWxsaXBzZVBhdGgoeCwgeSwgcGFbMV0sIHBhWzJdLCBwYVszXSkpO1xuICAgICAgICAgICAgICAgIHIgPSBbXCJVXCJdLmNvbmNhdChyZXNbcmVzLmxlbmd0aCAtIDFdLnNsaWNlKC0yKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwLCBrayA9IHBhLmxlbmd0aDsgayA8IGtrOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcltrXSA9IHBhW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhMCA9IHBhMC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhMCAhPSBcIk9cIikge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoclswXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9ICtteDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSArbXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSByWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gclsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgbXggPSByW3IubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBteSA9IHJbci5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSByW3IubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gcltyLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMudG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICAgICAgcHRoLmFicyA9IHBhdGhDbG9uZShyZXMpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsMmMoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgcmV0dXJuIFt4MSwgeTEsIHgyLCB5MiwgeDIsIHkyXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcTJjKHgxLCB5MSwgYXgsIGF5LCB4MiwgeTIpIHtcbiAgICAgICAgdmFyIF8xMyA9IDEgLyAzLFxuICAgICAgICAgICAgXzIzID0gMiAvIDM7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgXzEzICogeDEgKyBfMjMgKiBheCxcbiAgICAgICAgICAgICAgICBfMTMgKiB5MSArIF8yMyAqIGF5LFxuICAgICAgICAgICAgICAgIF8xMyAqIHgyICsgXzIzICogYXgsXG4gICAgICAgICAgICAgICAgXzEzICogeTIgKyBfMjMgKiBheSxcbiAgICAgICAgICAgICAgICB4MixcbiAgICAgICAgICAgICAgICB5MlxuICAgICAgICAgICAgXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYTJjKHgxLCB5MSwgcngsIHJ5LCBhbmdsZSwgbGFyZ2VfYXJjX2ZsYWcsIHN3ZWVwX2ZsYWcsIHgyLCB5MiwgcmVjdXJzaXZlKSB7XG4gICAgICAgIC8vIGZvciBtb3JlIGluZm9ybWF0aW9uIG9mIHdoZXJlIHRoaXMgbWF0aCBjYW1lIGZyb20gdmlzaXQ6XG4gICAgICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ltcGxub3RlLmh0bWwjQXJjSW1wbGVtZW50YXRpb25Ob3Rlc1xuICAgICAgICB2YXIgXzEyMCA9IFBJICogMTIwIC8gMTgwLFxuICAgICAgICAgICAgcmFkID0gUEkgLyAxODAgKiAoK2FuZ2xlIHx8IDApLFxuICAgICAgICAgICAgcmVzID0gW10sXG4gICAgICAgICAgICB4eSxcbiAgICAgICAgICAgIHJvdGF0ZSA9IFNuYXAuXy5jYWNoZXIoZnVuY3Rpb24gKHgsIHksIHJhZCkge1xuICAgICAgICAgICAgICAgIHZhciBYID0geCAqIG1hdGguY29zKHJhZCkgLSB5ICogbWF0aC5zaW4ocmFkKSxcbiAgICAgICAgICAgICAgICAgICAgWSA9IHggKiBtYXRoLnNpbihyYWQpICsgeSAqIG1hdGguY29zKHJhZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt4OiBYLCB5OiBZfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJ4IHx8ICFyeSkge1xuICAgICAgICAgICAgcmV0dXJuIFt4MSwgeTEsIHgyLCB5MiwgeDIsIHkyXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlY3Vyc2l2ZSkge1xuICAgICAgICAgICAgeHkgPSByb3RhdGUoeDEsIHkxLCAtcmFkKTtcbiAgICAgICAgICAgIHgxID0geHkueDtcbiAgICAgICAgICAgIHkxID0geHkueTtcbiAgICAgICAgICAgIHh5ID0gcm90YXRlKHgyLCB5MiwgLXJhZCk7XG4gICAgICAgICAgICB4MiA9IHh5Lng7XG4gICAgICAgICAgICB5MiA9IHh5Lnk7XG4gICAgICAgICAgICB2YXIgY29zID0gbWF0aC5jb3MoUEkgLyAxODAgKiBhbmdsZSksXG4gICAgICAgICAgICAgICAgc2luID0gbWF0aC5zaW4oUEkgLyAxODAgKiBhbmdsZSksXG4gICAgICAgICAgICAgICAgeCA9ICh4MSAtIHgyKSAvIDIsXG4gICAgICAgICAgICAgICAgeSA9ICh5MSAtIHkyKSAvIDI7XG4gICAgICAgICAgICB2YXIgaCA9IHggKiB4IC8gKHJ4ICogcngpICsgeSAqIHkgLyAocnkgKiByeSk7XG4gICAgICAgICAgICBpZiAoaCA+IDEpIHtcbiAgICAgICAgICAgICAgICBoID0gbWF0aC5zcXJ0KGgpO1xuICAgICAgICAgICAgICAgIHJ4ID0gaCAqIHJ4O1xuICAgICAgICAgICAgICAgIHJ5ID0gaCAqIHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJ4MiA9IHJ4ICogcngsXG4gICAgICAgICAgICAgICAgcnkyID0gcnkgKiByeSxcbiAgICAgICAgICAgICAgICBrID0gKGxhcmdlX2FyY19mbGFnID09IHN3ZWVwX2ZsYWcgPyAtMSA6IDEpICpcbiAgICAgICAgICAgICAgICAgICAgbWF0aC5zcXJ0KGFicygocngyICogcnkyIC0gcngyICogeSAqIHkgLSByeTIgKiB4ICogeCkgLyAocngyICogeSAqIHkgKyByeTIgKiB4ICogeCkpKSxcbiAgICAgICAgICAgICAgICBjeCA9IGsgKiByeCAqIHkgLyByeSArICh4MSArIHgyKSAvIDIsXG4gICAgICAgICAgICAgICAgY3kgPSBrICogLXJ5ICogeCAvIHJ4ICsgKHkxICsgeTIpIC8gMixcbiAgICAgICAgICAgICAgICBmMSA9IG1hdGguYXNpbigoKHkxIC0gY3kpIC8gcnkpLnRvRml4ZWQoOSkpLFxuICAgICAgICAgICAgICAgIGYyID0gbWF0aC5hc2luKCgoeTIgLSBjeSkgLyByeSkudG9GaXhlZCg5KSk7XG5cbiAgICAgICAgICAgIGYxID0geDEgPCBjeCA/IFBJIC0gZjEgOiBmMTtcbiAgICAgICAgICAgIGYyID0geDIgPCBjeCA/IFBJIC0gZjIgOiBmMjtcbiAgICAgICAgICAgIGYxIDwgMCAmJiAoZjEgPSBQSSAqIDIgKyBmMSk7XG4gICAgICAgICAgICBmMiA8IDAgJiYgKGYyID0gUEkgKiAyICsgZjIpO1xuICAgICAgICAgICAgaWYgKHN3ZWVwX2ZsYWcgJiYgZjEgPiBmMikge1xuICAgICAgICAgICAgICAgIGYxID0gZjEgLSBQSSAqIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN3ZWVwX2ZsYWcgJiYgZjIgPiBmMSkge1xuICAgICAgICAgICAgICAgIGYyID0gZjIgLSBQSSAqIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmMSA9IHJlY3Vyc2l2ZVswXTtcbiAgICAgICAgICAgIGYyID0gcmVjdXJzaXZlWzFdO1xuICAgICAgICAgICAgY3ggPSByZWN1cnNpdmVbMl07XG4gICAgICAgICAgICBjeSA9IHJlY3Vyc2l2ZVszXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGYgPSBmMiAtIGYxO1xuICAgICAgICBpZiAoYWJzKGRmKSA+IF8xMjApIHtcbiAgICAgICAgICAgIHZhciBmMm9sZCA9IGYyLFxuICAgICAgICAgICAgICAgIHgyb2xkID0geDIsXG4gICAgICAgICAgICAgICAgeTJvbGQgPSB5MjtcbiAgICAgICAgICAgIGYyID0gZjEgKyBfMTIwICogKHN3ZWVwX2ZsYWcgJiYgZjIgPiBmMSA/IDEgOiAtMSk7XG4gICAgICAgICAgICB4MiA9IGN4ICsgcnggKiBtYXRoLmNvcyhmMik7XG4gICAgICAgICAgICB5MiA9IGN5ICsgcnkgKiBtYXRoLnNpbihmMik7XG4gICAgICAgICAgICByZXMgPSBhMmMoeDIsIHkyLCByeCwgcnksIGFuZ2xlLCAwLCBzd2VlcF9mbGFnLCB4Mm9sZCwgeTJvbGQsIFtmMiwgZjJvbGQsIGN4LCBjeV0pO1xuICAgICAgICB9XG4gICAgICAgIGRmID0gZjIgLSBmMTtcbiAgICAgICAgdmFyIGMxID0gbWF0aC5jb3MoZjEpLFxuICAgICAgICAgICAgczEgPSBtYXRoLnNpbihmMSksXG4gICAgICAgICAgICBjMiA9IG1hdGguY29zKGYyKSxcbiAgICAgICAgICAgIHMyID0gbWF0aC5zaW4oZjIpLFxuICAgICAgICAgICAgdCA9IG1hdGgudGFuKGRmIC8gNCksXG4gICAgICAgICAgICBoeCA9IDQgLyAzICogcnggKiB0LFxuICAgICAgICAgICAgaHkgPSA0IC8gMyAqIHJ5ICogdCxcbiAgICAgICAgICAgIG0xID0gW3gxLCB5MV0sXG4gICAgICAgICAgICBtMiA9IFt4MSArIGh4ICogczEsIHkxIC0gaHkgKiBjMV0sXG4gICAgICAgICAgICBtMyA9IFt4MiArIGh4ICogczIsIHkyIC0gaHkgKiBjMl0sXG4gICAgICAgICAgICBtNCA9IFt4MiwgeTJdO1xuICAgICAgICBtMlswXSA9IDIgKiBtMVswXSAtIG0yWzBdO1xuICAgICAgICBtMlsxXSA9IDIgKiBtMVsxXSAtIG0yWzFdO1xuICAgICAgICBpZiAocmVjdXJzaXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gW20yLCBtMywgbTRdLmNvbmNhdChyZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gW20yLCBtMywgbTRdLmNvbmNhdChyZXMpLmpvaW4oKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICB2YXIgbmV3cmVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSByZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIG5ld3Jlc1tpXSA9IGkgJSAyID8gcm90YXRlKHJlc1tpIC0gMV0sIHJlc1tpXSwgcmFkKS55IDogcm90YXRlKHJlc1tpXSwgcmVzW2kgKyAxXSwgcmFkKS54O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld3JlcztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBmaW5kRG90QXRTZWdtZW50KHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5LCB0KSB7XG4gICAgICAgIHZhciB0MSA9IDEgLSB0O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcG93KHQxLCAzKSAqIHAxeCArIHBvdyh0MSwgMikgKiAzICogdCAqIGMxeCArIHQxICogMyAqIHQgKiB0ICogYzJ4ICsgcG93KHQsIDMpICogcDJ4LFxuICAgICAgICAgICAgeTogcG93KHQxLCAzKSAqIHAxeSArIHBvdyh0MSwgMikgKiAzICogdCAqIGMxeSArIHQxICogMyAqIHQgKiB0ICogYzJ5ICsgcG93KHQsIDMpICogcDJ5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBib3VuZGluZyBib3ggb2YgY3ViaWMgYmV6aWVyIGN1cnZlLlxuICAgIC8vIFNvdXJjZTogaHR0cDovL2Jsb2cuaGFja2Vycy1jYWZlLm5ldC8yMDA5LzA2L2hvdy10by1jYWxjdWxhdGUtYmV6aWVyLWN1cnZlcy1ib3VuZGluZy5odG1sXG4gICAgLy8gT3JpZ2luYWwgdmVyc2lvbjogTklTSElPIEhpcm9rYXp1XG4gICAgLy8gTW9kaWZpY2F0aW9uczogaHR0cHM6Ly9naXRodWIuY29tL3RpbW8yMjM0NVxuICAgIGZ1bmN0aW9uIGN1cnZlRGltKHgwLCB5MCwgeDEsIHkxLCB4MiwgeTIsIHgzLCB5Mykge1xuICAgICAgICB2YXIgdHZhbHVlcyA9IFtdLFxuICAgICAgICAgICAgYm91bmRzID0gW1tdLCBbXV0sXG4gICAgICAgICAgICBhLCBiLCBjLCB0LCB0MSwgdDIsIGIyYWMsIHNxcnRiMmFjO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7ICsraSkge1xuICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgIGIgPSA2ICogeDAgLSAxMiAqIHgxICsgNiAqIHgyO1xuICAgICAgICAgICAgICAgIGEgPSAtMyAqIHgwICsgOSAqIHgxIC0gOSAqIHgyICsgMyAqIHgzO1xuICAgICAgICAgICAgICAgIGMgPSAzICogeDEgLSAzICogeDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGIgPSA2ICogeTAgLSAxMiAqIHkxICsgNiAqIHkyO1xuICAgICAgICAgICAgICAgIGEgPSAtMyAqIHkwICsgOSAqIHkxIC0gOSAqIHkyICsgMyAqIHkzO1xuICAgICAgICAgICAgICAgIGMgPSAzICogeTEgLSAzICogeTA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWJzKGEpIDwgMWUtMTIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWJzKGIpIDwgMWUtMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHQgPSAtYyAvIGI7XG4gICAgICAgICAgICAgICAgaWYgKDAgPCB0ICYmIHQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHR2YWx1ZXMucHVzaCh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiMmFjID0gYiAqIGIgLSA0ICogYyAqIGE7XG4gICAgICAgICAgICBzcXJ0YjJhYyA9IG1hdGguc3FydChiMmFjKTtcbiAgICAgICAgICAgIGlmIChiMmFjIDwgMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdDEgPSAoLWIgKyBzcXJ0YjJhYykgLyAoMiAqIGEpO1xuICAgICAgICAgICAgaWYgKDAgPCB0MSAmJiB0MSA8IDEpIHtcbiAgICAgICAgICAgICAgICB0dmFsdWVzLnB1c2godDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdDIgPSAoLWIgLSBzcXJ0YjJhYykgLyAoMiAqIGEpO1xuICAgICAgICAgICAgaWYgKDAgPCB0MiAmJiB0MiA8IDEpIHtcbiAgICAgICAgICAgICAgICB0dmFsdWVzLnB1c2godDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHgsIHksIGogPSB0dmFsdWVzLmxlbmd0aCxcbiAgICAgICAgICAgIGpsZW4gPSBqLFxuICAgICAgICAgICAgbXQ7XG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICAgIHQgPSB0dmFsdWVzW2pdO1xuICAgICAgICAgICAgbXQgPSAxIC0gdDtcbiAgICAgICAgICAgIGJvdW5kc1swXVtqXSA9IG10ICogbXQgKiBtdCAqIHgwICsgMyAqIG10ICogbXQgKiB0ICogeDEgKyAzICogbXQgKiB0ICogdCAqIHgyICsgdCAqIHQgKiB0ICogeDM7XG4gICAgICAgICAgICBib3VuZHNbMV1bal0gPSBtdCAqIG10ICogbXQgKiB5MCArIDMgKiBtdCAqIG10ICogdCAqIHkxICsgMyAqIG10ICogdCAqIHQgKiB5MiArIHQgKiB0ICogdCAqIHkzO1xuICAgICAgICB9XG5cbiAgICAgICAgYm91bmRzWzBdW2psZW5dID0geDA7XG4gICAgICAgIGJvdW5kc1sxXVtqbGVuXSA9IHkwO1xuICAgICAgICBib3VuZHNbMF1bamxlbiArIDFdID0geDM7XG4gICAgICAgIGJvdW5kc1sxXVtqbGVuICsgMV0gPSB5MztcbiAgICAgICAgYm91bmRzWzBdLmxlbmd0aCA9IGJvdW5kc1sxXS5sZW5ndGggPSBqbGVuICsgMjtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWluOiB7eDogbW1pbi5hcHBseSgwLCBib3VuZHNbMF0pLCB5OiBtbWluLmFwcGx5KDAsIGJvdW5kc1sxXSl9LFxuICAgICAgICAgIG1heDoge3g6IG1tYXguYXBwbHkoMCwgYm91bmRzWzBdKSwgeTogbW1heC5hcHBseSgwLCBib3VuZHNbMV0pfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhdGgyY3VydmUocGF0aCwgcGF0aDIpIHtcbiAgICAgICAgdmFyIHB0aCA9ICFwYXRoMiAmJiBwYXRocyhwYXRoKTtcbiAgICAgICAgaWYgKCFwYXRoMiAmJiBwdGguY3VydmUpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoQ2xvbmUocHRoLmN1cnZlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcCA9IHBhdGhUb0Fic29sdXRlKHBhdGgpLFxuICAgICAgICAgICAgcDIgPSBwYXRoMiAmJiBwYXRoVG9BYnNvbHV0ZShwYXRoMiksXG4gICAgICAgICAgICBhdHRycyA9IHt4OiAwLCB5OiAwLCBieDogMCwgYnk6IDAsIFg6IDAsIFk6IDAsIHF4OiBudWxsLCBxeTogbnVsbH0sXG4gICAgICAgICAgICBhdHRyczIgPSB7eDogMCwgeTogMCwgYng6IDAsIGJ5OiAwLCBYOiAwLCBZOiAwLCBxeDogbnVsbCwgcXk6IG51bGx9LFxuICAgICAgICAgICAgcHJvY2Vzc1BhdGggPSBmdW5jdGlvbiAocGF0aCwgZCwgcGNvbSkge1xuICAgICAgICAgICAgICAgIHZhciBueCwgbnk7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCJDXCIsIGQueCwgZC55LCBkLngsIGQueSwgZC54LCBkLnldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAhKHBhdGhbMF0gaW4ge1Q6IDEsIFE6IDF9KSAmJiAoZC5xeCA9IGQucXkgPSBudWxsKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHBhdGhbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuWCA9IHBhdGhbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBkLlkgPSBwYXRoWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gW1wiQ1wiXS5jb25jYXQoYTJjLmFwcGx5KDAsIFtkLngsIGQueV0uY29uY2F0KHBhdGguc2xpY2UoMSkpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwY29tID09IFwiQ1wiIHx8IHBjb20gPT0gXCJTXCIpIHsgLy8gSW4gXCJTXCIgY2FzZSB3ZSBoYXZlIHRvIHRha2UgaW50byBhY2NvdW50LCBpZiB0aGUgcHJldmlvdXMgY29tbWFuZCBpcyBDL1MuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnggPSBkLnggKiAyIC0gZC5ieDsgICAgICAgICAgLy8gQW5kIHJlZmxlY3QgdGhlIHByZXZpb3VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnkgPSBkLnkgKiAyIC0gZC5ieTsgICAgICAgICAgLy8gY29tbWFuZCdzIGNvbnRyb2wgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgcG9pbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3Igc29tZSBlbHNlIG9yIG5vdGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBueCA9IGQueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBueSA9IGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBbXCJDXCIsIG54LCBueV0uY29uY2F0KHBhdGguc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJUXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGNvbSA9PSBcIlFcIiB8fCBwY29tID09IFwiVFwiKSB7IC8vIEluIFwiVFwiIGNhc2Ugd2UgaGF2ZSB0byB0YWtlIGludG8gYWNjb3VudCwgaWYgdGhlIHByZXZpb3VzIGNvbW1hbmQgaXMgUS9ULlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucXggPSBkLnggKiAyIC0gZC5xeDsgICAgICAgIC8vIEFuZCBtYWtlIGEgcmVmbGVjdGlvbiBzaW1pbGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5xeSA9IGQueSAqIDIgLSBkLnF5OyAgICAgICAgLy8gdG8gY2FzZSBcIlNcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvciBzb21ldGhpbmcgZWxzZSBvciBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5xeCA9IGQueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnF5ID0gZC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KHEyYyhkLngsIGQueSwgZC5xeCwgZC5xeSwgcGF0aFsxXSwgcGF0aFsyXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJRXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnF4ID0gcGF0aFsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucXkgPSBwYXRoWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KHEyYyhkLngsIGQueSwgcGF0aFsxXSwgcGF0aFsyXSwgcGF0aFszXSwgcGF0aFs0XSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJMXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gW1wiQ1wiXS5jb25jYXQobDJjKGQueCwgZC55LCBwYXRoWzFdLCBwYXRoWzJdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBbXCJDXCJdLmNvbmNhdChsMmMoZC54LCBkLnksIHBhdGhbMV0sIGQueSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gW1wiQ1wiXS5jb25jYXQobDJjKGQueCwgZC55LCBkLngsIHBhdGhbMV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KGwyYyhkLngsIGQueSwgZC5YLCBkLlkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmaXhBcmMgPSBmdW5jdGlvbiAocHAsIGkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHBbaV0ubGVuZ3RoID4gNykge1xuICAgICAgICAgICAgICAgICAgICBwcFtpXS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGkgPSBwcFtpXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGNvbXMxW2ldID0gXCJBXCI7IC8vIGlmIGNyZWF0ZWQgbXVsdGlwbGUgQzpzLCB0aGVpciBvcmlnaW5hbCBzZWcgaXMgc2F2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHAyICYmIChwY29tczJbaV0gPSBcIkFcIik7IC8vIHRoZSBzYW1lIGFzIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICBwcC5zcGxpY2UoaSsrLCAwLCBbXCJDXCJdLmNvbmNhdChwaS5zcGxpY2UoMCwgNikpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlpID0gbW1heChwLmxlbmd0aCwgcDIgJiYgcDIubGVuZ3RoIHx8IDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmaXhNID0gZnVuY3Rpb24gKHBhdGgxLCBwYXRoMiwgYTEsIGEyLCBpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGgxICYmIHBhdGgyICYmIHBhdGgxW2ldWzBdID09IFwiTVwiICYmIHBhdGgyW2ldWzBdICE9IFwiTVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGgyLnNwbGljZShpLCAwLCBbXCJNXCIsIGEyLngsIGEyLnldKTtcbiAgICAgICAgICAgICAgICAgICAgYTEuYnggPSAwO1xuICAgICAgICAgICAgICAgICAgICBhMS5ieSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGExLnggPSBwYXRoMVtpXVsxXTtcbiAgICAgICAgICAgICAgICAgICAgYTEueSA9IHBhdGgxW2ldWzJdO1xuICAgICAgICAgICAgICAgICAgICBpaSA9IG1tYXgocC5sZW5ndGgsIHAyICYmIHAyLmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGNvbXMxID0gW10sIC8vIHBhdGggY29tbWFuZHMgb2Ygb3JpZ2luYWwgcGF0aCBwXG4gICAgICAgICAgICBwY29tczIgPSBbXSwgLy8gcGF0aCBjb21tYW5kcyBvZiBvcmlnaW5hbCBwYXRoIHAyXG4gICAgICAgICAgICBwZmlyc3QgPSBcIlwiLCAvLyB0ZW1wb3JhcnkgaG9sZGVyIGZvciBvcmlnaW5hbCBwYXRoIGNvbW1hbmRcbiAgICAgICAgICAgIHBjb20gPSBcIlwiOyAvLyBob2xkZXIgZm9yIHByZXZpb3VzIHBhdGggY29tbWFuZCBvZiBvcmlnaW5hbCBwYXRoXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IG1tYXgocC5sZW5ndGgsIHAyICYmIHAyLmxlbmd0aCB8fCAwKTsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHBbaV0gJiYgKHBmaXJzdCA9IHBbaV1bMF0pOyAvLyBzYXZlIGN1cnJlbnQgcGF0aCBjb21tYW5kXG5cbiAgICAgICAgICAgIGlmIChwZmlyc3QgIT0gXCJDXCIpIC8vIEMgaXMgbm90IHNhdmVkIHlldCwgYmVjYXVzZSBpdCBtYXkgYmUgcmVzdWx0IG9mIGNvbnZlcnNpb25cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwY29tczFbaV0gPSBwZmlyc3Q7IC8vIFNhdmUgY3VycmVudCBwYXRoIGNvbW1hbmRcbiAgICAgICAgICAgICAgICBpICYmICggcGNvbSA9IHBjb21zMVtpIC0gMV0pOyAvLyBHZXQgcHJldmlvdXMgcGF0aCBjb21tYW5kIHBjb21cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBbaV0gPSBwcm9jZXNzUGF0aChwW2ldLCBhdHRycywgcGNvbSk7IC8vIFByZXZpb3VzIHBhdGggY29tbWFuZCBpcyBpbnB1dHRlZCB0byBwcm9jZXNzUGF0aFxuXG4gICAgICAgICAgICBpZiAocGNvbXMxW2ldICE9IFwiQVwiICYmIHBmaXJzdCA9PSBcIkNcIikgcGNvbXMxW2ldID0gXCJDXCI7IC8vIEEgaXMgdGhlIG9ubHkgY29tbWFuZFxuICAgICAgICAgICAgLy8gd2hpY2ggbWF5IHByb2R1Y2UgbXVsdGlwbGUgQzpzXG4gICAgICAgICAgICAvLyBzbyB3ZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IEMgaXMgYWxzbyBDIGluIG9yaWdpbmFsIHBhdGhcblxuICAgICAgICAgICAgZml4QXJjKHAsIGkpOyAvLyBmaXhBcmMgYWRkcyBhbHNvIHRoZSByaWdodCBhbW91bnQgb2YgQTpzIHRvIHBjb21zMVxuXG4gICAgICAgICAgICBpZiAocDIpIHsgLy8gdGhlIHNhbWUgcHJvY2VkdXJlcyBpcyBkb25lIHRvIHAyXG4gICAgICAgICAgICAgICAgcDJbaV0gJiYgKHBmaXJzdCA9IHAyW2ldWzBdKTtcbiAgICAgICAgICAgICAgICBpZiAocGZpcnN0ICE9IFwiQ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBjb21zMltpXSA9IHBmaXJzdDtcbiAgICAgICAgICAgICAgICAgICAgaSAmJiAocGNvbSA9IHBjb21zMltpIC0gMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwMltpXSA9IHByb2Nlc3NQYXRoKHAyW2ldLCBhdHRyczIsIHBjb20pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBjb21zMltpXSAhPSBcIkFcIiAmJiBwZmlyc3QgPT0gXCJDXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGNvbXMyW2ldID0gXCJDXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZml4QXJjKHAyLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpeE0ocCwgcDIsIGF0dHJzLCBhdHRyczIsIGkpO1xuICAgICAgICAgICAgZml4TShwMiwgcCwgYXR0cnMyLCBhdHRycywgaSk7XG4gICAgICAgICAgICB2YXIgc2VnID0gcFtpXSxcbiAgICAgICAgICAgICAgICBzZWcyID0gcDIgJiYgcDJbaV0sXG4gICAgICAgICAgICAgICAgc2VnbGVuID0gc2VnLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBzZWcybGVuID0gcDIgJiYgc2VnMi5sZW5ndGg7XG4gICAgICAgICAgICBhdHRycy54ID0gc2VnW3NlZ2xlbiAtIDJdO1xuICAgICAgICAgICAgYXR0cnMueSA9IHNlZ1tzZWdsZW4gLSAxXTtcbiAgICAgICAgICAgIGF0dHJzLmJ4ID0gdG9GbG9hdChzZWdbc2VnbGVuIC0gNF0pIHx8IGF0dHJzLng7XG4gICAgICAgICAgICBhdHRycy5ieSA9IHRvRmxvYXQoc2VnW3NlZ2xlbiAtIDNdKSB8fCBhdHRycy55O1xuICAgICAgICAgICAgYXR0cnMyLmJ4ID0gcDIgJiYgKHRvRmxvYXQoc2VnMltzZWcybGVuIC0gNF0pIHx8IGF0dHJzMi54KTtcbiAgICAgICAgICAgIGF0dHJzMi5ieSA9IHAyICYmICh0b0Zsb2F0KHNlZzJbc2VnMmxlbiAtIDNdKSB8fCBhdHRyczIueSk7XG4gICAgICAgICAgICBhdHRyczIueCA9IHAyICYmIHNlZzJbc2VnMmxlbiAtIDJdO1xuICAgICAgICAgICAgYXR0cnMyLnkgPSBwMiAmJiBzZWcyW3NlZzJsZW4gLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXAyKSB7XG4gICAgICAgICAgICBwdGguY3VydmUgPSBwYXRoQ2xvbmUocCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHAyID8gW3AsIHAyXSA6IHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1hcFBhdGgocGF0aCwgbWF0cml4KSB7XG4gICAgICAgIGlmICghbWF0cml4KSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeCwgeSwgaSwgaiwgaWksIGpqLCBwYXRoaTtcbiAgICAgICAgcGF0aCA9IHBhdGgyY3VydmUocGF0aCk7XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gcGF0aC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBwYXRoaSA9IHBhdGhbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAxLCBqaiA9IHBhdGhpLmxlbmd0aDsgaiA8IGpqOyBqICs9IDIpIHtcbiAgICAgICAgICAgICAgICB4ID0gbWF0cml4LngocGF0aGlbal0sIHBhdGhpW2ogKyAxXSk7XG4gICAgICAgICAgICAgICAgeSA9IG1hdHJpeC55KHBhdGhpW2pdLCBwYXRoaVtqICsgMV0pO1xuICAgICAgICAgICAgICAgIHBhdGhpW2pdID0geDtcbiAgICAgICAgICAgICAgICBwYXRoaVtqICsgMV0gPSB5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoO1xuICAgIH1cblxuICAgIC8vIGh0dHA6Ly9zY2hlcGVycy5jYy9nZXR0aW5nLXRvLXRoZS1wb2ludFxuICAgIGZ1bmN0aW9uIGNhdG11bGxSb20yYmV6aWVyKGNycCwgeikge1xuICAgICAgICB2YXIgZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGNycC5sZW5ndGg7IGlMZW4gLSAyICogIXogPiBpOyBpICs9IDIpIHtcbiAgICAgICAgICAgIHZhciBwID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAge3g6ICtjcnBbaSAtIDJdLCB5OiArY3JwW2kgLSAxXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7eDogK2NycFtpXSwgICAgIHk6ICtjcnBbaSArIDFdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt4OiArY3JwW2kgKyAyXSwgeTogK2NycFtpICsgM119LFxuICAgICAgICAgICAgICAgICAgICAgICAge3g6ICtjcnBbaSArIDRdLCB5OiArY3JwW2kgKyA1XX1cbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmICh6KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSB7eDogK2NycFtpTGVuIC0gMl0sIHk6ICtjcnBbaUxlbiAtIDFdfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlMZW4gLSA0ID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcFszXSA9IHt4OiArY3JwWzBdLCB5OiArY3JwWzFdfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlMZW4gLSAyID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcFsyXSA9IHt4OiArY3JwWzBdLCB5OiArY3JwWzFdfTtcbiAgICAgICAgICAgICAgICAgICAgcFszXSA9IHt4OiArY3JwWzJdLCB5OiArY3JwWzNdfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpTGVuIC0gNCA9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBbM10gPSBwWzJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWkpIHtcbiAgICAgICAgICAgICAgICAgICAgcFswXSA9IHt4OiArY3JwW2ldLCB5OiArY3JwW2kgKyAxXX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZC5wdXNoKFtcIkNcIixcbiAgICAgICAgICAgICAgICAgICgtcFswXS54ICsgNiAqIHBbMV0ueCArIHBbMl0ueCkgLyA2LFxuICAgICAgICAgICAgICAgICAgKC1wWzBdLnkgKyA2ICogcFsxXS55ICsgcFsyXS55KSAvIDYsXG4gICAgICAgICAgICAgICAgICAocFsxXS54ICsgNiAqIHBbMl0ueCAtIHBbM10ueCkgLyA2LFxuICAgICAgICAgICAgICAgICAgKHBbMV0ueSArIDYqcFsyXS55IC0gcFszXS55KSAvIDYsXG4gICAgICAgICAgICAgICAgICBwWzJdLngsXG4gICAgICAgICAgICAgICAgICBwWzJdLnlcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgfVxuXG4gICAgLy8gZXhwb3J0XG4gICAgU25hcC5wYXRoID0gcGF0aHM7XG5cbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmdldFRvdGFsTGVuZ3RoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGdpdmVuIHBhdGggaW4gcGl4ZWxzXG4gICAgICoqXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBTVkcgcGF0aCBzdHJpbmdcbiAgICAgKipcbiAgICAgPSAobnVtYmVyKSBsZW5ndGhcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmdldFRvdGFsTGVuZ3RoID0gZ2V0VG90YWxMZW5ndGg7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5nZXRQb2ludEF0TGVuZ3RoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnQgbG9jYXRlZCBhdCB0aGUgZ2l2ZW4gbGVuZ3RoIGFsb25nIHRoZSBnaXZlbiBwYXRoXG4gICAgICoqXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBTVkcgcGF0aCBzdHJpbmdcbiAgICAgLSBsZW5ndGggKG51bWJlcikgbGVuZ3RoLCBpbiBwaXhlbHMsIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBwYXRoLCBleGNsdWRpbmcgbm9uLXJlbmRlcmluZyBqdW1wc1xuICAgICAqKlxuICAgICA9IChvYmplY3QpIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwb2ludDpcbiAgICAgbyB7XG4gICAgIG8gICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSxcbiAgICAgbyAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlLFxuICAgICBvICAgICBhbHBoYTogKG51bWJlcikgYW5nbGUgb2YgZGVyaXZhdGl2ZVxuICAgICBvIH1cbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmdldFBvaW50QXRMZW5ndGggPSBnZXRQb2ludEF0TGVuZ3RoO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguZ2V0U3VicGF0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgc3VicGF0aCBvZiBhIGdpdmVuIHBhdGggYmV0d2VlbiBnaXZlbiBzdGFydCBhbmQgZW5kIGxlbmd0aHNcbiAgICAgKipcbiAgICAgLSBwYXRoIChzdHJpbmcpIFNWRyBwYXRoIHN0cmluZ1xuICAgICAtIGZyb20gKG51bWJlcikgbGVuZ3RoLCBpbiBwaXhlbHMsIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBwYXRoIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VnbWVudFxuICAgICAtIHRvIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCB0byB0aGUgZW5kIG9mIHRoZSBzZWdtZW50XG4gICAgICoqXG4gICAgID0gKHN0cmluZykgcGF0aCBzdHJpbmcgZGVmaW5pdGlvbiBmb3IgdGhlIHNlZ21lbnRcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmdldFN1YnBhdGggPSBmdW5jdGlvbiAocGF0aCwgZnJvbSwgdG8pIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0VG90YWxMZW5ndGgocGF0aCkgLSB0byA8IDFlLTYpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdWJwYXRoc0F0TGVuZ3RoKHBhdGgsIGZyb20pLmVuZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYSA9IGdldFN1YnBhdGhzQXRMZW5ndGgocGF0aCwgdG8sIDEpO1xuICAgICAgICByZXR1cm4gZnJvbSA/IGdldFN1YnBhdGhzQXRMZW5ndGgoYSwgZnJvbSkuZW5kIDogYTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmdldFRvdGFsTGVuZ3RoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIHBhdGggaW4gcGl4ZWxzIChvbmx5IHdvcmtzIGZvciBgcGF0aGAgZWxlbWVudHMpXG4gICAgID0gKG51bWJlcikgbGVuZ3RoXG4gICAgXFwqL1xuICAgIGVscHJvdG8uZ2V0VG90YWxMZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuZ2V0VG90YWxMZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gU0lFUlJBIEVsZW1lbnQuZ2V0UG9pbnRBdExlbmd0aCgpL0VsZW1lbnQuZ2V0VG90YWxMZW5ndGgoKTogSWYgYSA8cGF0aD4gaXMgYnJva2VuIGludG8gZGlmZmVyZW50IHNlZ21lbnRzLCBpcyB0aGUganVtcCBkaXN0YW5jZSB0byB0aGUgbmV3IGNvb3JkaW5hdGVzIHNldCBieSB0aGUgX01fIG9yIF9tXyBjb21tYW5kcyBjYWxjdWxhdGVkIGFzIHBhcnQgb2YgdGhlIHBhdGgncyB0b3RhbCBsZW5ndGg/XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZ2V0UG9pbnRBdExlbmd0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnQgbG9jYXRlZCBhdCB0aGUgZ2l2ZW4gbGVuZ3RoIG9uIHRoZSBnaXZlbiBwYXRoIChvbmx5IHdvcmtzIGZvciBgcGF0aGAgZWxlbWVudHMpXG4gICAgICoqXG4gICAgIC0gbGVuZ3RoIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCwgZXhjbHVkaW5nIG5vbi1yZW5kZXJpbmcganVtcHNcbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcG9pbnQ6XG4gICAgIG8ge1xuICAgICBvICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUsXG4gICAgIG8gICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSxcbiAgICAgbyAgICAgYWxwaGE6IChudW1iZXIpIGFuZ2xlIG9mIGRlcml2YXRpdmVcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIGVscHJvdG8uZ2V0UG9pbnRBdExlbmd0aCA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGdldFBvaW50QXRMZW5ndGgodGhpcy5hdHRyKFwiZFwiKSwgbGVuZ3RoKTtcbiAgICB9O1xuICAgIC8vIFNJRVJSQSBFbGVtZW50LmdldFN1YnBhdGgoKTogU2ltaWxhciB0byB0aGUgcHJvYmxlbSBmb3IgRWxlbWVudC5nZXRQb2ludEF0TGVuZ3RoKCkuIFVuY2xlYXIgaG93IHRoaXMgd291bGQgd29yayBmb3IgYSBzZWdtZW50ZWQgcGF0aC4gT3ZlcmFsbCwgdGhlIGNvbmNlcHQgb2YgX3N1YnBhdGhfIGFuZCB3aGF0IEknbSBjYWxsaW5nIGEgX3NlZ21lbnRfIChzZXJpZXMgb2Ygbm9uLV9NXyBvciBfWl8gY29tbWFuZHMpIGlzIHVuY2xlYXIuXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZ2V0U3VicGF0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBzdWJwYXRoIG9mIGEgZ2l2ZW4gZWxlbWVudCBmcm9tIGdpdmVuIHN0YXJ0IGFuZCBlbmQgbGVuZ3RocyAob25seSB3b3JrcyBmb3IgYHBhdGhgIGVsZW1lbnRzKVxuICAgICAqKlxuICAgICAtIGZyb20gKG51bWJlcikgbGVuZ3RoLCBpbiBwaXhlbHMsIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBwYXRoIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VnbWVudFxuICAgICAtIHRvIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCB0byB0aGUgZW5kIG9mIHRoZSBzZWdtZW50XG4gICAgICoqXG4gICAgID0gKHN0cmluZykgcGF0aCBzdHJpbmcgZGVmaW5pdGlvbiBmb3IgdGhlIHNlZ21lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5nZXRTdWJwYXRoID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgICAgIHJldHVybiBTbmFwLnBhdGguZ2V0U3VicGF0aCh0aGlzLmF0dHIoXCJkXCIpLCBmcm9tLCB0byk7XG4gICAgfTtcbiAgICBTbmFwLl8uYm94ID0gYm94O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguZmluZERvdHNBdFNlZ21lbnRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogRmluZHMgZG90IGNvb3JkaW5hdGVzIG9uIHRoZSBnaXZlbiBjdWJpYyBiZXppw6lyIGN1cnZlIGF0IHRoZSBnaXZlbiB0XG4gICAgIC0gcDF4IChudW1iZXIpIHggb2YgdGhlIGZpcnN0IHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAtIHAxeSAobnVtYmVyKSB5IG9mIHRoZSBmaXJzdCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSBjMXggKG51bWJlcikgeCBvZiB0aGUgZmlyc3QgYW5jaG9yIG9mIHRoZSBjdXJ2ZVxuICAgICAtIGMxeSAobnVtYmVyKSB5IG9mIHRoZSBmaXJzdCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gYzJ4IChudW1iZXIpIHggb2YgdGhlIHNlY29uZCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gYzJ5IChudW1iZXIpIHkgb2YgdGhlIHNlY29uZCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gcDJ4IChudW1iZXIpIHggb2YgdGhlIHNlY29uZCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSBwMnkgKG51bWJlcikgeSBvZiB0aGUgc2Vjb25kIHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAtIHQgKG51bWJlcikgcG9zaXRpb24gb24gdGhlIGN1cnZlICgwLi4xKVxuICAgICA9IChvYmplY3QpIHBvaW50IGluZm9ybWF0aW9uIGluIGZvcm1hdDpcbiAgICAgbyB7XG4gICAgIG8gICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQsXG4gICAgIG8gICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQsXG4gICAgIG8gICAgIG06IHtcbiAgICAgbyAgICAgICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgbGVmdCBhbmNob3IsXG4gICAgIG8gICAgICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgYW5jaG9yXG4gICAgIG8gICAgIH0sXG4gICAgIG8gICAgIG46IHtcbiAgICAgbyAgICAgICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgYW5jaG9yLFxuICAgICBvICAgICAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSByaWdodCBhbmNob3JcbiAgICAgbyAgICAgfSxcbiAgICAgbyAgICAgc3RhcnQ6IHtcbiAgICAgbyAgICAgICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgc3RhcnQgb2YgdGhlIGN1cnZlLFxuICAgICBvICAgICAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBzdGFydCBvZiB0aGUgY3VydmVcbiAgICAgbyAgICAgfSxcbiAgICAgbyAgICAgZW5kOiB7XG4gICAgIG8gICAgICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIGVuZCBvZiB0aGUgY3VydmUsXG4gICAgIG8gICAgICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGVuZCBvZiB0aGUgY3VydmVcbiAgICAgbyAgICAgfSxcbiAgICAgbyAgICAgYWxwaGE6IChudW1iZXIpIGFuZ2xlIG9mIHRoZSBjdXJ2ZSBkZXJpdmF0aXZlIGF0IHRoZSBwb2ludFxuICAgICBvIH1cbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmZpbmREb3RzQXRTZWdtZW50ID0gZmluZERvdHNBdFNlZ21lbnQ7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5iZXppZXJCQm94XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIFJldHVybnMgdGhlIGJvdW5kaW5nIGJveCBvZiBhIGdpdmVuIGN1YmljIGJlemnDqXIgY3VydmVcbiAgICAgLSBwMXggKG51bWJlcikgeCBvZiB0aGUgZmlyc3QgcG9pbnQgb2YgdGhlIGN1cnZlXG4gICAgIC0gcDF5IChudW1iZXIpIHkgb2YgdGhlIGZpcnN0IHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAtIGMxeCAobnVtYmVyKSB4IG9mIHRoZSBmaXJzdCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gYzF5IChudW1iZXIpIHkgb2YgdGhlIGZpcnN0IGFuY2hvciBvZiB0aGUgY3VydmVcbiAgICAgLSBjMnggKG51bWJlcikgeCBvZiB0aGUgc2Vjb25kIGFuY2hvciBvZiB0aGUgY3VydmVcbiAgICAgLSBjMnkgKG51bWJlcikgeSBvZiB0aGUgc2Vjb25kIGFuY2hvciBvZiB0aGUgY3VydmVcbiAgICAgLSBwMnggKG51bWJlcikgeCBvZiB0aGUgc2Vjb25kIHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAtIHAyeSAobnVtYmVyKSB5IG9mIHRoZSBzZWNvbmQgcG9pbnQgb2YgdGhlIGN1cnZlXG4gICAgICogb3JcbiAgICAgLSBiZXogKGFycmF5KSBhcnJheSBvZiBzaXggcG9pbnRzIGZvciBiZXppw6lyIGN1cnZlXG4gICAgID0gKG9iamVjdCkgYm91bmRpbmcgYm94XG4gICAgIG8ge1xuICAgICBvICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgdG9wIHBvaW50IG9mIHRoZSBib3gsXG4gICAgIG8gICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgbGVmdCB0b3AgcG9pbnQgb2YgdGhlIGJveCxcbiAgICAgbyAgICAgeDI6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgYm90dG9tIHBvaW50IG9mIHRoZSBib3gsXG4gICAgIG8gICAgIHkyOiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IGJvdHRvbSBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB3aWR0aDogKG51bWJlcikgd2lkdGggb2YgdGhlIGJveCxcbiAgICAgbyAgICAgaGVpZ2h0OiAobnVtYmVyKSBoZWlnaHQgb2YgdGhlIGJveFxuICAgICBvIH1cbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmJlemllckJCb3ggPSBiZXppZXJCQm94O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguaXNQb2ludEluc2lkZUJCb3hcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgZ2l2ZW4gcG9pbnQgaXMgaW5zaWRlIGJvdW5kaW5nIGJveFxuICAgICAtIGJib3ggKHN0cmluZykgYm91bmRpbmcgYm94XG4gICAgIC0geCAoc3RyaW5nKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XG4gICAgIC0geSAoc3RyaW5nKSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50XG4gICAgID0gKGJvb2xlYW4pIGB0cnVlYCBpZiBwb2ludCBpcyBpbnNpZGVcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmlzUG9pbnRJbnNpZGVCQm94ID0gaXNQb2ludEluc2lkZUJCb3g7XG4gICAgU25hcC5jbG9zZXN0ID0gZnVuY3Rpb24gKHgsIHksIFgsIFkpIHtcbiAgICAgICAgdmFyIHIgPSAxMDAsXG4gICAgICAgICAgICBiID0gYm94KHggLSByIC8gMiwgeSAtIHIgLyAyLCByLCByKSxcbiAgICAgICAgICAgIGluc2lkZSA9IFtdLFxuICAgICAgICAgICAgZ2V0dGVyID0gWFswXS5oYXNPd25Qcm9wZXJ0eShcInhcIikgPyBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IFhbaV0ueCxcbiAgICAgICAgICAgICAgICAgICAgeTogWFtpXS55XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IFhbaV0sXG4gICAgICAgICAgICAgICAgICAgIHk6IFlbaV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvdW5kID0gMDtcbiAgICAgICAgd2hpbGUgKHIgPD0gMWU2ICYmICFmb3VuZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gWC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHh5ID0gZ2V0dGVyKGkpO1xuICAgICAgICAgICAgICAgIGlmIChpc1BvaW50SW5zaWRlQkJveChiLCB4eS54LCB4eS55KSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCsrO1xuICAgICAgICAgICAgICAgICAgICBpbnNpZGUucHVzaCh4eSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByICo9IDI7XG4gICAgICAgICAgICAgICAgYiA9IGJveCh4IC0gciAvIDIsIHkgLSByIC8gMiwgciwgcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAociA9PSAxZTYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gSW5maW5pdHksXG4gICAgICAgICAgICByZXM7XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gaW5zaWRlLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsID0gU25hcC5sZW4oeCwgeSwgaW5zaWRlW2ldLngsIGluc2lkZVtpXS55KTtcbiAgICAgICAgICAgIGlmIChsZW4gPiBsKSB7XG4gICAgICAgICAgICAgICAgbGVuID0gbDtcbiAgICAgICAgICAgICAgICBpbnNpZGVbaV0ubGVuID0gbDtcbiAgICAgICAgICAgICAgICByZXMgPSBpbnNpZGVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguaXNCQm94SW50ZXJzZWN0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIHR3byBib3VuZGluZyBib3hlcyBpbnRlcnNlY3RcbiAgICAgLSBiYm94MSAoc3RyaW5nKSBmaXJzdCBib3VuZGluZyBib3hcbiAgICAgLSBiYm94MiAoc3RyaW5nKSBzZWNvbmQgYm91bmRpbmcgYm94XG4gICAgID0gKGJvb2xlYW4pIGB0cnVlYCBpZiBib3VuZGluZyBib3hlcyBpbnRlcnNlY3RcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmlzQkJveEludGVyc2VjdCA9IGlzQkJveEludGVyc2VjdDtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmludGVyc2VjdGlvblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBGaW5kcyBpbnRlcnNlY3Rpb25zIG9mIHR3byBwYXRoc1xuICAgICAtIHBhdGgxIChzdHJpbmcpIHBhdGggc3RyaW5nXG4gICAgIC0gcGF0aDIgKHN0cmluZykgcGF0aCBzdHJpbmdcbiAgICAgPSAoYXJyYXkpIGRvdHMgb2YgaW50ZXJzZWN0aW9uXG4gICAgIG8gW1xuICAgICBvICAgICB7XG4gICAgIG8gICAgICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LFxuICAgICBvICAgICAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCxcbiAgICAgbyAgICAgICAgIHQxOiAobnVtYmVyKSB0IHZhbHVlIGZvciBzZWdtZW50IG9mIHBhdGgxLFxuICAgICBvICAgICAgICAgdDI6IChudW1iZXIpIHQgdmFsdWUgZm9yIHNlZ21lbnQgb2YgcGF0aDIsXG4gICAgIG8gICAgICAgICBzZWdtZW50MTogKG51bWJlcikgb3JkZXIgbnVtYmVyIGZvciBzZWdtZW50IG9mIHBhdGgxLFxuICAgICBvICAgICAgICAgc2VnbWVudDI6IChudW1iZXIpIG9yZGVyIG51bWJlciBmb3Igc2VnbWVudCBvZiBwYXRoMixcbiAgICAgbyAgICAgICAgIGJlejE6IChhcnJheSkgZWlnaHQgY29vcmRpbmF0ZXMgcmVwcmVzZW50aW5nIGJlemnDqXIgY3VydmUgZm9yIHRoZSBzZWdtZW50IG9mIHBhdGgxLFxuICAgICBvICAgICAgICAgYmV6MjogKGFycmF5KSBlaWdodCBjb29yZGluYXRlcyByZXByZXNlbnRpbmcgYmV6acOpciBjdXJ2ZSBmb3IgdGhlIHNlZ21lbnQgb2YgcGF0aDJcbiAgICAgbyAgICAgfVxuICAgICBvIF1cbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmludGVyc2VjdGlvbiA9IHBhdGhJbnRlcnNlY3Rpb247XG4gICAgU25hcC5wYXRoLmludGVyc2VjdGlvbk51bWJlciA9IHBhdGhJbnRlcnNlY3Rpb25OdW1iZXI7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5pc1BvaW50SW5zaWRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIHBvaW50IGlzIGluc2lkZSBhIGdpdmVuIGNsb3NlZCBwYXRoLlxuICAgICAqXG4gICAgICogTm90ZTogZmlsbCBtb2RlIGRvZXNu4oCZdCBhZmZlY3QgdGhlIHJlc3VsdCBvZiB0aGlzIG1ldGhvZC5cbiAgICAgLSBwYXRoIChzdHJpbmcpIHBhdGggc3RyaW5nXG4gICAgIC0geCAobnVtYmVyKSB4IG9mIHRoZSBwb2ludFxuICAgICAtIHkgKG51bWJlcikgeSBvZiB0aGUgcG9pbnRcbiAgICAgPSAoYm9vbGVhbikgYHRydWVgIGlmIHBvaW50IGlzIGluc2lkZSB0aGUgcGF0aFxuICAgIFxcKi9cbiAgICBTbmFwLnBhdGguaXNQb2ludEluc2lkZSA9IGlzUG9pbnRJbnNpZGVQYXRoO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguZ2V0QkJveFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBib3VuZGluZyBib3ggb2YgYSBnaXZlbiBwYXRoXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICA9IChvYmplY3QpIGJvdW5kaW5nIGJveFxuICAgICBvIHtcbiAgICAgbyAgICAgeDogKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IHRvcCBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgdG9wIHBvaW50IG9mIHRoZSBib3gsXG4gICAgIG8gICAgIHgyOiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IGJvdHRvbSBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB5MjogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSByaWdodCBib3R0b20gcG9pbnQgb2YgdGhlIGJveCxcbiAgICAgbyAgICAgd2lkdGg6IChudW1iZXIpIHdpZHRoIG9mIHRoZSBib3gsXG4gICAgIG8gICAgIGhlaWdodDogKG51bWJlcikgaGVpZ2h0IG9mIHRoZSBib3hcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5nZXRCQm94ID0gcGF0aEJCb3g7XG4gICAgU25hcC5wYXRoLmdldCA9IGdldFBhdGg7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC50b1JlbGF0aXZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIENvbnZlcnRzIHBhdGggY29vcmRpbmF0ZXMgaW50byByZWxhdGl2ZSB2YWx1ZXNcbiAgICAgLSBwYXRoIChzdHJpbmcpIHBhdGggc3RyaW5nXG4gICAgID0gKGFycmF5KSBwYXRoIHN0cmluZ1xuICAgIFxcKi9cbiAgICBTbmFwLnBhdGgudG9SZWxhdGl2ZSA9IHBhdGhUb1JlbGF0aXZlO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGgudG9BYnNvbHV0ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBDb252ZXJ0cyBwYXRoIGNvb3JkaW5hdGVzIGludG8gYWJzb2x1dGUgdmFsdWVzXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICA9IChhcnJheSkgcGF0aCBzdHJpbmdcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLnRvQWJzb2x1dGUgPSBwYXRoVG9BYnNvbHV0ZTtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLnRvQ3ViaWNcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogQ29udmVydHMgcGF0aCB0byBhIG5ldyBwYXRoIHdoZXJlIGFsbCBzZWdtZW50cyBhcmUgY3ViaWMgYmV6acOpciBjdXJ2ZXNcbiAgICAgLSBwYXRoU3RyaW5nIChzdHJpbmd8YXJyYXkpIHBhdGggc3RyaW5nIG9yIGFycmF5IG9mIHNlZ21lbnRzXG4gICAgID0gKGFycmF5KSBhcnJheSBvZiBzZWdtZW50c1xuICAgIFxcKi9cbiAgICBTbmFwLnBhdGgudG9DdWJpYyA9IHBhdGgyY3VydmU7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5tYXBcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFRyYW5zZm9ybSB0aGUgcGF0aCBzdHJpbmcgd2l0aCB0aGUgZ2l2ZW4gbWF0cml4XG4gICAgIC0gcGF0aCAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICAtIG1hdHJpeCAob2JqZWN0KSBzZWUgQE1hdHJpeFxuICAgICA9IChzdHJpbmcpIHRyYW5zZm9ybWVkIHBhdGggc3RyaW5nXG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5tYXAgPSBtYXBQYXRoO1xuICAgIFNuYXAucGF0aC50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgIFNuYXAucGF0aC5jbG9uZSA9IHBhdGhDbG9uZTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcbiAgICB2YXIgbW1heCA9IE1hdGgubWF4LFxuICAgICAgICBtbWluID0gTWF0aC5taW47XG5cbiAgICAvLyBTZXRcbiAgICB2YXIgU2V0ID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcblx0dGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMudHlwZSA9IFwic2V0XCI7XG4gICAgICAgIGlmIChpdGVtcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gaXRlbXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3RoaXMuaXRlbXMubGVuZ3RoXSA9IHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGhdID0gaXRlbXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRwcm90byA9IFNldC5wcm90b3R5cGU7XG4gICAgLypcXFxuICAgICAqIFNldC5wdXNoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGVhY2ggYXJndW1lbnQgdG8gdGhlIGN1cnJlbnQgc2V0XG4gICAgID0gKG9iamVjdCkgb3JpZ2luYWwgZWxlbWVudFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5wdXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXRlbSxcbiAgICAgICAgICAgIGxlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGl0ZW0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXNbbGVuXSA9IHRoaXMuaXRlbXNbbGVuXSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTZXQucG9wXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGxhc3QgZWxlbWVudCBhbmQgcmV0dXJucyBpdFxuICAgICA9IChvYmplY3QpIGVsZW1lbnRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8ucG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxlbmd0aCAmJiBkZWxldGUgdGhpc1t0aGlzLmxlbmd0aC0tXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMucG9wKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LmZvckVhY2hcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEV4ZWN1dGVzIGdpdmVuIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldFxuICAgICAqXG4gICAgICogSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYGZhbHNlYCwgdGhlIGxvb3Agc3RvcHMgcnVubmluZy5cbiAgICAgKipcbiAgICAgLSBjYWxsYmFjayAoZnVuY3Rpb24pIGZ1bmN0aW9uIHRvIHJ1blxuICAgICAtIHRoaXNBcmcgKG9iamVjdCkgY29udGV4dCBvYmplY3QgZm9yIHRoZSBjYWxsYmFja1xuICAgICA9IChvYmplY3QpIFNldCBvYmplY3RcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0aGlzLml0ZW1zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMuaXRlbXNbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5hbmltYXRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBbmltYXRlcyBlYWNoIGVsZW1lbnQgaW4gc2V0IGluIHN5bmMuXG4gICAgICpcbiAgICAgKipcbiAgICAgLSBhdHRycyAob2JqZWN0KSBrZXktdmFsdWUgcGFpcnMgb2YgZGVzdGluYXRpb24gYXR0cmlidXRlc1xuICAgICAtIGR1cmF0aW9uIChudW1iZXIpIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzXG4gICAgIC0gZWFzaW5nIChmdW5jdGlvbikgI29wdGlvbmFsIGVhc2luZyBmdW5jdGlvbiBmcm9tIEBtaW5hIG9yIGN1c3RvbVxuICAgICAtIGNhbGxiYWNrIChmdW5jdGlvbikgI29wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgd2hlbiB0aGUgYW5pbWF0aW9uIGVuZHNcbiAgICAgKiBvclxuICAgICAtIGFuaW1hdGlvbiAoYXJyYXkpIGFycmF5IG9mIGFuaW1hdGlvbiBwYXJhbWV0ZXIgZm9yIGVhY2ggZWxlbWVudCBpbiBzZXQgaW4gZm9ybWF0IGBbYXR0cnMsIGR1cmF0aW9uLCBlYXNpbmcsIGNhbGxiYWNrXWBcbiAgICAgPiBVc2FnZVxuICAgICB8IC8vIGFuaW1hdGUgYWxsIGVsZW1lbnRzIGluIHNldCB0byByYWRpdXMgMTBcbiAgICAgfCBzZXQuYW5pbWF0ZSh7cjogMTB9LCA1MDAsIG1pbmEuZWFzZWluKTtcbiAgICAgfCAvLyBvclxuICAgICB8IC8vIGFuaW1hdGUgZmlyc3QgZWxlbWVudCB0byByYWRpdXMgMTAsIGJ1dCBzZWNvbmQgdG8gcmFkaXVzIDIwIGFuZCBpbiBkaWZmZXJlbnQgdGltZVxuICAgICB8IHNldC5hbmltYXRlKFt7cjogMTB9LCA1MDAsIG1pbmEuZWFzZWluXSwgW3tyOiAyMH0sIDE1MDAsIG1pbmEuZWFzZWluXSk7XG4gICAgID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uYW5pbWF0ZSA9IGZ1bmN0aW9uIChhdHRycywgbXMsIGVhc2luZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlYXNpbmcgPT0gXCJmdW5jdGlvblwiICYmICFlYXNpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGVhc2luZztcbiAgICAgICAgICAgIGVhc2luZyA9IG1pbmEubGluZWFyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRycyBpbnN0YW5jZW9mIFNuYXAuXy5BbmltYXRpb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gYXR0cnMuY2FsbGJhY2s7XG4gICAgICAgICAgICBlYXNpbmcgPSBhdHRycy5lYXNpbmc7XG4gICAgICAgICAgICBtcyA9IGVhc2luZy5kdXI7XG4gICAgICAgICAgICBhdHRycyA9IGF0dHJzLmF0dHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGlmIChTbmFwLmlzKGF0dHJzLCBcImFycmF5XCIpICYmIFNuYXAuaXMoYXJnc1thcmdzLmxlbmd0aCAtIDFdLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICB2YXIgZWFjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJlZ2luLFxuICAgICAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYmVnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iID0gYmVnaW47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW4gPSB0aGlzLmI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNiID0gMCxcbiAgICAgICAgICAgIHNldCA9IHRoaXMsXG4gICAgICAgICAgICBjYWxsYmFja2VyID0gY2FsbGJhY2sgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgrK2NiID09IHNldC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgICAgZXZlLm9uY2UoXCJzbmFwLmFuaW1jcmVhdGVkLlwiICsgZWwuaWQsIGhhbmRsZXIpO1xuICAgICAgICAgICAgaWYgKGVhY2gpIHtcbiAgICAgICAgICAgICAgICBhcmdzW2ldICYmIGVsLmFuaW1hdGUuYXBwbHkoZWwsIGFyZ3NbaV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5hbmltYXRlKGF0dHJzLCBtcywgZWFzaW5nLCBjYWxsYmFja2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LnJlbW92ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhbGwgY2hpbGRyZW4gb2YgdGhlIHNldC5cbiAgICAgKlxuICAgICA9IChvYmplY3QpIFNldCBvYmplY3RcbiAgICBcXCovXG4gICAgc2V0cHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucG9wKCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LmJpbmRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFNwZWNpZmllcyBob3cgdG8gaGFuZGxlIGEgc3BlY2lmaWMgYXR0cmlidXRlIHdoZW4gYXBwbGllZFxuICAgICAqIHRvIGEgc2V0LlxuICAgICAqXG4gICAgICoqXG4gICAgIC0gYXR0ciAoc3RyaW5nKSBhdHRyaWJ1dGUgbmFtZVxuICAgICAtIGNhbGxiYWNrIChmdW5jdGlvbikgZnVuY3Rpb24gdG8gcnVuXG4gICAgICogb3JcbiAgICAgLSBhdHRyIChzdHJpbmcpIGF0dHJpYnV0ZSBuYW1lXG4gICAgIC0gZWxlbWVudCAoRWxlbWVudCkgc3BlY2lmaWMgZWxlbWVudCBpbiB0aGUgc2V0IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGUgdG9cbiAgICAgKiBvclxuICAgICAtIGF0dHIgKHN0cmluZykgYXR0cmlidXRlIG5hbWVcbiAgICAgLSBlbGVtZW50IChFbGVtZW50KSBzcGVjaWZpYyBlbGVtZW50IGluIHRoZSBzZXQgdG8gYXBwbHkgdGhlIGF0dHJpYnV0ZSB0b1xuICAgICAtIGVhdHRyIChzdHJpbmcpIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudCB0byBiaW5kIHRoZSBhdHRyaWJ1dGUgdG9cbiAgICAgPSAob2JqZWN0KSBTZXQgb2JqZWN0XG4gICAgXFwqL1xuICAgIHNldHByb3RvLmJpbmQgPSBmdW5jdGlvbiAoYXR0ciwgYSwgYikge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRpbmdzW2F0dHJdID0gYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBhbmFtZSA9IGIgfHwgYXR0cjtcbiAgICAgICAgICAgIHRoaXMuYmluZGluZ3NbYXR0cl0gPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGRhdGFbYW5hbWVdID0gdjtcbiAgICAgICAgICAgICAgICBhLmF0dHIoZGF0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5hdHRyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBFcXVpdmFsZW50IG9mIEBFbGVtZW50LmF0dHIuXG4gICAgID0gKG9iamVjdCkgU2V0IG9iamVjdFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5hdHRyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciB1bmJvdW5kID0ge307XG4gICAgICAgIGZvciAodmFyIGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW2tdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kaW5nc1trXSh2YWx1ZVtrXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuYm91bmRba10gPSB2YWx1ZVtrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0aGlzLml0ZW1zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNbaV0uYXR0cih1bmJvdW5kKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTZXQuY2xlYXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIHNldFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LnNwbGljZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyByYW5nZSBvZiBlbGVtZW50cyBmcm9tIHRoZSBzZXRcbiAgICAgKipcbiAgICAgLSBpbmRleCAobnVtYmVyKSBwb3NpdGlvbiBvZiB0aGUgZGVsZXRpb25cbiAgICAgLSBjb3VudCAobnVtYmVyKSBudW1iZXIgb2YgZWxlbWVudCB0byByZW1vdmVcbiAgICAgLSBpbnNlcnRpb27igKYgKG9iamVjdCkgI29wdGlvbmFsIGVsZW1lbnRzIHRvIGluc2VydFxuICAgICA9IChvYmplY3QpIHNldCBlbGVtZW50cyB0aGF0IHdlcmUgZGVsZXRlZFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5zcGxpY2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvdW50LCBpbnNlcnRpb24pIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyBtbWF4KHRoaXMubGVuZ3RoICsgaW5kZXgsIDApIDogaW5kZXg7XG4gICAgICAgIGNvdW50ID0gbW1heCgwLCBtbWluKHRoaXMubGVuZ3RoIC0gaW5kZXgsIGNvdW50KSk7XG4gICAgICAgIHZhciB0YWlsID0gW10sXG4gICAgICAgICAgICB0b2RlbCA9IFtdLFxuICAgICAgICAgICAgYXJncyA9IFtdLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHRvZGVsLnB1c2godGhpc1tpbmRleCArIGldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKDsgaSA8IHRoaXMubGVuZ3RoIC0gaW5kZXg7IGkrKykge1xuICAgICAgICAgICAgdGFpbC5wdXNoKHRoaXNbaW5kZXggKyBpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3MubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJnbGVuICsgdGFpbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5pdGVtc1tpbmRleCArIGldID0gdGhpc1tpbmRleCArIGldID0gaSA8IGFyZ2xlbiA/IGFyZ3NbaV0gOiB0YWlsW2kgLSBhcmdsZW5dO1xuICAgICAgICB9XG4gICAgICAgIGkgPSB0aGlzLml0ZW1zLmxlbmd0aCA9IHRoaXMubGVuZ3RoIC09IGNvdW50IC0gYXJnbGVuO1xuICAgICAgICB3aGlsZSAodGhpc1tpXSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXNbaSsrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFNldCh0b2RlbCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LmV4Y2x1ZGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgZ2l2ZW4gZWxlbWVudCBmcm9tIHRoZSBzZXRcbiAgICAgKipcbiAgICAgLSBlbGVtZW50IChvYmplY3QpIGVsZW1lbnQgdG8gcmVtb3ZlXG4gICAgID0gKGJvb2xlYW4pIGB0cnVlYCBpZiBvYmplY3Qgd2FzIGZvdW5kIGFuZCByZW1vdmVkIGZyb20gdGhlIHNldFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5leGNsdWRlID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHRoaXMubGVuZ3RoOyBpIDwgaWk7IGkrKykgaWYgKHRoaXNbaV0gPT0gZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5pbnNlcnRBZnRlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogSW5zZXJ0cyBzZXQgZWxlbWVudHMgYWZ0ZXIgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKipcbiAgICAgLSBlbGVtZW50IChvYmplY3QpIHNldCB3aWxsIGJlIGluc2VydGVkIGFmdGVyIHRoaXMgZWxlbWVudFxuICAgICA9IChvYmplY3QpIFNldCBvYmplY3RcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc1tpXS5pbnNlcnRBZnRlcihlbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LmdldEJCb3hcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFVuaW9uIG9mIGFsbCBiYm94ZXMgb2YgdGhlIHNldC4gU2VlIEBFbGVtZW50LmdldEJCb3guXG4gICAgID0gKG9iamVjdCkgYm91bmRpbmcgYm94IGRlc2NyaXB0b3IuIFNlZSBARWxlbWVudC5nZXRCQm94LlxuICAgIFxcKi9cbiAgICBzZXRwcm90by5nZXRCQm94ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeCA9IFtdLFxuICAgICAgICAgICAgeSA9IFtdLFxuICAgICAgICAgICAgeDIgPSBbXSxcbiAgICAgICAgICAgIHkyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLml0ZW1zLmxlbmd0aDsgaS0tOykgaWYgKCF0aGlzLml0ZW1zW2ldLnJlbW92ZWQpIHtcbiAgICAgICAgICAgIHZhciBib3ggPSB0aGlzLml0ZW1zW2ldLmdldEJCb3goKTtcbiAgICAgICAgICAgIHgucHVzaChib3gueCk7XG4gICAgICAgICAgICB5LnB1c2goYm94LnkpO1xuICAgICAgICAgICAgeDIucHVzaChib3gueCArIGJveC53aWR0aCk7XG4gICAgICAgICAgICB5Mi5wdXNoKGJveC55ICsgYm94LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgeCA9IG1taW4uYXBwbHkoMCwgeCk7XG4gICAgICAgIHkgPSBtbWluLmFwcGx5KDAsIHkpO1xuICAgICAgICB4MiA9IG1tYXguYXBwbHkoMCwgeDIpO1xuICAgICAgICB5MiA9IG1tYXguYXBwbHkoMCwgeTIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICB4MjogeDIsXG4gICAgICAgICAgICB5MjogeTIsXG4gICAgICAgICAgICB3aWR0aDogeDIgLSB4LFxuICAgICAgICAgICAgaGVpZ2h0OiB5MiAtIHksXG4gICAgICAgICAgICBjeDogeCArICh4MiAtIHgpIC8gMixcbiAgICAgICAgICAgIGN5OiB5ICsgKHkyIC0geSkgLyAyXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0Lmluc2VydEFmdGVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIHNldC5cbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSBOZXcgU2V0IG9iamVjdFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5jbG9uZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHMgPSBuZXcgU2V0O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0aGlzLml0ZW1zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHMucHVzaCh0aGlzLml0ZW1zW2ldLmNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH07XG4gICAgc2V0cHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIlNuYXBcXHUyMDE4cyBzZXRcIjtcbiAgICB9O1xuICAgIHNldHByb3RvLnR5cGUgPSBcInNldFwiO1xuICAgIC8vIGV4cG9ydFxuICAgIC8qXFxcbiAgICAgKiBTbmFwLlNldFxuICAgICBbIHByb3BlcnR5IF1cbiAgICAgKipcbiAgICAgKiBTZXQgY29uc3RydWN0b3IuXG4gICAgXFwqL1xuICAgIFNuYXAuU2V0ID0gU2V0O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnNldFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIHNldCBhbmQgZmlsbHMgaXQgd2l0aCBsaXN0IG9mIGFyZ3VtZW50cy5cbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSBOZXcgU2V0IG9iamVjdFxuICAgICB8IHZhciByID0gcGFwZXIucmVjdCgwLCAwLCAxMCwgMTApLFxuICAgICB8ICAgICBzMSA9IFNuYXAuc2V0KCksIC8vIGVtcHR5IHNldFxuICAgICB8ICAgICBzMiA9IFNuYXAuc2V0KHIsIHBhcGVyLmNpcmNsZSgxMDAsIDEwMCwgMjApKTsgLy8gcHJlZmlsbGVkIHNldFxuICAgIFxcKi9cbiAgICBTbmFwLnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldCA9IG5ldyBTZXQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZXQucHVzaC5hcHBseShzZXQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcbiAgICB2YXIgbmFtZXMgPSB7fSxcbiAgICAgICAgcmVVbml0ID0gL1slYS16XSskL2ksXG4gICAgICAgIFN0ciA9IFN0cmluZztcbiAgICBuYW1lcy5zdHJva2UgPSBuYW1lcy5maWxsID0gXCJjb2xvdXJcIjtcbiAgICBmdW5jdGlvbiBnZXRFbXB0eShpdGVtKSB7XG4gICAgICAgIHZhciBsID0gaXRlbVswXTtcbiAgICAgICAgc3dpdGNoIChsLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0XCI6IHJldHVybiBbbCwgMCwgMF07XG4gICAgICAgICAgICBjYXNlIFwibVwiOiByZXR1cm4gW2wsIDEsIDAsIDAsIDEsIDAsIDBdO1xuICAgICAgICAgICAgY2FzZSBcInJcIjogaWYgKGl0ZW0ubGVuZ3RoID09IDQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2wsIDAsIGl0ZW1bMl0sIGl0ZW1bM11dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2wsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcInNcIjogaWYgKGl0ZW0ubGVuZ3RoID09IDUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2wsIDEsIDEsIGl0ZW1bM10sIGl0ZW1bNF1dO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsLCAxLCAxXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsLCAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBlcXVhbGlzZVRyYW5zZm9ybSh0MSwgdDIsIGdldEJCb3gpIHtcbiAgICAgICAgdDEgPSB0MSB8fCBuZXcgU25hcC5NYXRyaXg7XG4gICAgICAgIHQyID0gdDIgfHwgbmV3IFNuYXAuTWF0cml4O1xuICAgICAgICB0MSA9IFNuYXAucGFyc2VUcmFuc2Zvcm1TdHJpbmcodDEudG9UcmFuc2Zvcm1TdHJpbmcoKSkgfHwgW107XG4gICAgICAgIHQyID0gU25hcC5wYXJzZVRyYW5zZm9ybVN0cmluZyh0Mi50b1RyYW5zZm9ybVN0cmluZygpKSB8fCBbXTtcbiAgICAgICAgdmFyIG1heGxlbmd0aCA9IE1hdGgubWF4KHQxLmxlbmd0aCwgdDIubGVuZ3RoKSxcbiAgICAgICAgICAgIGZyb20gPSBbXSxcbiAgICAgICAgICAgIHRvID0gW10sXG4gICAgICAgICAgICBpID0gMCwgaiwgamosXG4gICAgICAgICAgICB0dDEsIHR0MjtcbiAgICAgICAgZm9yICg7IGkgPCBtYXhsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdHQxID0gdDFbaV0gfHwgZ2V0RW1wdHkodDJbaV0pO1xuICAgICAgICAgICAgdHQyID0gdDJbaV0gfHwgZ2V0RW1wdHkodHQxKTtcbiAgICAgICAgICAgIGlmICh0dDFbMF0gIT0gdHQyWzBdIHx8XG4gICAgICAgICAgICAgICAgdHQxWzBdLnRvTG93ZXJDYXNlKCkgPT0gXCJyXCIgJiYgKHR0MVsyXSAhPSB0dDJbMl0gfHwgdHQxWzNdICE9IHR0MlszXSkgfHxcbiAgICAgICAgICAgICAgICB0dDFbMF0udG9Mb3dlckNhc2UoKSA9PSBcInNcIiAmJiAodHQxWzNdICE9IHR0MlszXSB8fCB0dDFbNF0gIT0gdHQyWzRdKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0MSA9IFNuYXAuXy50cmFuc2Zvcm0ybWF0cml4KHQxLCBnZXRCQm94KCkpO1xuICAgICAgICAgICAgICAgICAgICB0MiA9IFNuYXAuXy50cmFuc2Zvcm0ybWF0cml4KHQyLCBnZXRCQm94KCkpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tID0gW1tcIm1cIiwgdDEuYSwgdDEuYiwgdDEuYywgdDEuZCwgdDEuZSwgdDEuZl1dO1xuICAgICAgICAgICAgICAgICAgICB0byA9IFtbXCJtXCIsIHQyLmEsIHQyLmIsIHQyLmMsIHQyLmQsIHQyLmUsIHQyLmZdXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcm9tW2ldID0gW107XG4gICAgICAgICAgICB0b1tpXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBNYXRoLm1heCh0dDEubGVuZ3RoLCB0dDIubGVuZ3RoKTsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBqIGluIHR0MSAmJiAoZnJvbVtpXVtqXSA9IHR0MVtqXSk7XG4gICAgICAgICAgICAgICAgaiBpbiB0dDIgJiYgKHRvW2ldW2pdID0gdHQyW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJvbTogcGF0aDJhcnJheShmcm9tKSxcbiAgICAgICAgICAgIHRvOiBwYXRoMmFycmF5KHRvKSxcbiAgICAgICAgICAgIGY6IGdldFBhdGgoZnJvbSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0TnVtYmVyKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRVbml0KHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiArdmFsLnRvRml4ZWQoMykgKyB1bml0O1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRWaWV3Qm94KHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDb2xvdXIoY2xyKSB7XG4gICAgICAgIHJldHVybiBTbmFwLnJnYihjbHJbMF0sIGNsclsxXSwgY2xyWzJdLCBjbHJbM10pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgdmFyIGsgPSAwLCBpLCBpaSwgaiwgamosIG91dCwgYSwgYiA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHBhdGgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgb3V0ID0gXCJbXCI7XG4gICAgICAgICAgICBhID0gWydcIicgKyBwYXRoW2ldWzBdICsgJ1wiJ107XG4gICAgICAgICAgICBmb3IgKGogPSAxLCBqaiA9IHBhdGhbaV0ubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIGFbal0gPSBcInZhbFtcIiArIGsrKyArIFwiXVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9IGEgKyBcIl1cIjtcbiAgICAgICAgICAgIGJbaV0gPSBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKFwidmFsXCIsIFwicmV0dXJuIFNuYXAucGF0aC50b1N0cmluZy5jYWxsKFtcIiArIGIgKyBcIl0pXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXRoMmFycmF5KHBhdGgpIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwYXRoLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAxLCBqaiA9IHBhdGhbaV0ubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKHBhdGhbaV1bal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhvYmopIHtcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFycmF5RXF1YWwoYXJyMSwgYXJyMikge1xuICAgICAgICBpZiAoIVNuYXAuaXMoYXJyMSwgXCJhcnJheVwiKSB8fCAhU25hcC5pcyhhcnIyLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycjEudG9TdHJpbmcoKSA9PSBhcnIyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIEVsZW1lbnQucHJvdG90eXBlLmVxdWFsID0gZnVuY3Rpb24gKG5hbWUsIGIpIHtcbiAgICAgICAgcmV0dXJuIGV2ZShcInNuYXAudXRpbC5lcXVhbFwiLCB0aGlzLCBuYW1lLCBiKS5maXJzdERlZmluZWQoKTtcbiAgICB9O1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5lcXVhbFwiLCBmdW5jdGlvbiAobmFtZSwgYikge1xuICAgICAgICB2YXIgQSwgQiwgYSA9IFN0cih0aGlzLmF0dHIobmFtZSkgfHwgXCJcIiksXG4gICAgICAgICAgICBlbCA9IHRoaXM7XG4gICAgICAgIGlmIChuYW1lc1tuYW1lXSA9PSBcImNvbG91clwiKSB7XG4gICAgICAgICAgICBBID0gU25hcC5jb2xvcihhKTtcbiAgICAgICAgICAgIEIgPSBTbmFwLmNvbG9yKGIpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmcm9tOiBbQS5yLCBBLmcsIEEuYiwgQS5vcGFjaXR5XSxcbiAgICAgICAgICAgICAgICB0bzogW0IuciwgQi5nLCBCLmIsIEIub3BhY2l0eV0sXG4gICAgICAgICAgICAgICAgZjogZ2V0Q29sb3VyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwidmlld0JveFwiKSB7XG4gICAgICAgICAgICBBID0gdGhpcy5hdHRyKG5hbWUpLnZiLnNwbGl0KFwiIFwiKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICAgIEIgPSBiLnNwbGl0KFwiIFwiKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnJvbTogQSxcbiAgICAgICAgICAgICAgICB0bzogQixcbiAgICAgICAgICAgICAgICBmOiBnZXRWaWV3Qm94XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwidHJhbnNmb3JtXCIgfHwgbmFtZSA9PSBcImdyYWRpZW50VHJhbnNmb3JtXCIgfHwgbmFtZSA9PSBcInBhdHRlcm5UcmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBiID0gU3RyKGIpLnJlcGxhY2UoL1xcLnszfXxcXHUyMDI2L2csIGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYSA9IHRoaXMubWF0cml4O1xuICAgICAgICAgICAgaWYgKCFTbmFwLl8ucmdUcmFuc2Zvcm0udGVzdChiKSkge1xuICAgICAgICAgICAgICAgIGIgPSBTbmFwLl8udHJhbnNmb3JtMm1hdHJpeChTbmFwLl8uc3ZnVHJhbnNmb3JtMnN0cmluZyhiKSwgdGhpcy5nZXRCQm94KCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiID0gU25hcC5fLnRyYW5zZm9ybTJtYXRyaXgoYiwgdGhpcy5nZXRCQm94KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVxdWFsaXNlVHJhbnNmb3JtKGEsIGIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuZ2V0QkJveCgxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwiZFwiIHx8IG5hbWUgPT0gXCJwYXRoXCIpIHtcbiAgICAgICAgICAgIEEgPSBTbmFwLnBhdGgudG9DdWJpYyhhLCBiKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnJvbTogcGF0aDJhcnJheShBWzBdKSxcbiAgICAgICAgICAgICAgICB0bzogcGF0aDJhcnJheShBWzFdKSxcbiAgICAgICAgICAgICAgICBmOiBnZXRQYXRoKEFbMF0pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09IFwicG9pbnRzXCIpIHtcbiAgICAgICAgICAgIEEgPSBTdHIoYSkuc3BsaXQoU25hcC5fLnNlcGFyYXRvcik7XG4gICAgICAgICAgICBCID0gU3RyKGIpLnNwbGl0KFNuYXAuXy5zZXBhcmF0b3IpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmcm9tOiBBLFxuICAgICAgICAgICAgICAgIHRvOiBCLFxuICAgICAgICAgICAgICAgIGY6IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbDsgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOdW1lcmljKGEpICYmIGlzTnVtZXJpYyhiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmcm9tOiBwYXJzZUZsb2F0KGEpLFxuICAgICAgICAgICAgICAgIHRvOiBwYXJzZUZsb2F0KGIpLFxuICAgICAgICAgICAgICAgIGY6IGdldE51bWJlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYVVuaXQgPSBhLm1hdGNoKHJlVW5pdCksXG4gICAgICAgICAgICBiVW5pdCA9IFN0cihiKS5tYXRjaChyZVVuaXQpO1xuICAgICAgICBpZiAoYVVuaXQgJiYgYXJyYXlFcXVhbChhVW5pdCwgYlVuaXQpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZyb206IHBhcnNlRmxvYXQoYSksXG4gICAgICAgICAgICAgICAgdG86IHBhcnNlRmxvYXQoYiksXG4gICAgICAgICAgICAgICAgZjogZ2V0VW5pdChhVW5pdClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZyb206IHRoaXMuYXNQWChuYW1lKSxcbiAgICAgICAgICAgICAgICB0bzogdGhpcy5hc1BYKG5hbWUsIGIpLFxuICAgICAgICAgICAgICAgIGY6IGdldE51bWJlclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIFxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8gXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vIFxuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYikge1xuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUsXG4gICAgaGFzID0gXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgIHN1cHBvcnRzVG91Y2ggPSBcImNyZWF0ZVRvdWNoXCIgaW4gZ2xvYi5kb2MsXG4gICAgZXZlbnRzID0gW1xuICAgICAgICBcImNsaWNrXCIsIFwiZGJsY2xpY2tcIiwgXCJtb3VzZWRvd25cIiwgXCJtb3VzZW1vdmVcIiwgXCJtb3VzZW91dFwiLFxuICAgICAgICBcIm1vdXNlb3ZlclwiLCBcIm1vdXNldXBcIiwgXCJ0b3VjaHN0YXJ0XCIsIFwidG91Y2htb3ZlXCIsIFwidG91Y2hlbmRcIixcbiAgICAgICAgXCJ0b3VjaGNhbmNlbFwiXG4gICAgXSxcbiAgICB0b3VjaE1hcCA9IHtcbiAgICAgICAgbW91c2Vkb3duOiBcInRvdWNoc3RhcnRcIixcbiAgICAgICAgbW91c2Vtb3ZlOiBcInRvdWNobW92ZVwiLFxuICAgICAgICBtb3VzZXVwOiBcInRvdWNoZW5kXCJcbiAgICB9LFxuICAgIGdldFNjcm9sbCA9IGZ1bmN0aW9uICh4eSwgZWwpIHtcbiAgICAgICAgdmFyIG5hbWUgPSB4eSA9PSBcInlcIiA/IFwic2Nyb2xsVG9wXCIgOiBcInNjcm9sbExlZnRcIixcbiAgICAgICAgICAgIGRvYyA9IGVsICYmIGVsLm5vZGUgPyBlbC5ub2RlLm93bmVyRG9jdW1lbnQgOiBnbG9iLmRvYztcbiAgICAgICAgcmV0dXJuIGRvY1tuYW1lIGluIGRvYy5kb2N1bWVudEVsZW1lbnQgPyBcImRvY3VtZW50RWxlbWVudFwiIDogXCJib2R5XCJdW25hbWVdO1xuICAgIH0sXG4gICAgcHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICB9LFxuICAgIHByZXZlbnRUb3VjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0sXG4gICAgc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgfSxcbiAgICBzdG9wVG91Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcbiAgICBhZGRFdmVudCA9IGZ1bmN0aW9uIChvYmosIHR5cGUsIGZuLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWFsTmFtZSA9IHN1cHBvcnRzVG91Y2ggJiYgdG91Y2hNYXBbdHlwZV0gPyB0b3VjaE1hcFt0eXBlXSA6IHR5cGUsXG4gICAgICAgICAgICBmID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsWSA9IGdldFNjcm9sbChcInlcIiwgZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFggPSBnZXRTY3JvbGwoXCJ4XCIsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChzdXBwb3J0c1RvdWNoICYmIHRvdWNoTWFwW2hhc10odHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXRUb3VjaGVzW2ldLnRhcmdldCA9PSBvYmogfHwgb2JqLmNvbnRhaW5zKGUudGFyZ2V0VG91Y2hlc1tpXS50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9sZGUgPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBlLnRhcmdldFRvdWNoZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5vcmlnaW5hbEV2ZW50ID0gb2xkZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID0gcHJldmVudFRvdWNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uID0gc3RvcFRvdWNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB4ID0gZS5jbGllbnRYICsgc2Nyb2xsWCxcbiAgICAgICAgICAgICAgICAgICAgeSA9IGUuY2xpZW50WSArIHNjcm9sbFk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoZWxlbWVudCwgZSwgeCwgeSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlICE9PSByZWFsTmFtZSkge1xuICAgICAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZiwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIocmVhbE5hbWUsIGYsIGZhbHNlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT09IHJlYWxOYW1lKSB7XG4gICAgICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZiwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcihyZWFsTmFtZSwgZiwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICBkcmFnID0gW10sXG4gICAgZHJhZ01vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgeCA9IGUuY2xpZW50WCxcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFksXG4gICAgICAgICAgICBzY3JvbGxZID0gZ2V0U2Nyb2xsKFwieVwiKSxcbiAgICAgICAgICAgIHNjcm9sbFggPSBnZXRTY3JvbGwoXCJ4XCIpLFxuICAgICAgICAgICAgZHJhZ2ksXG4gICAgICAgICAgICBqID0gZHJhZy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICAgIGRyYWdpID0gZHJhZ1tqXTtcbiAgICAgICAgICAgIGlmIChzdXBwb3J0c1RvdWNoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdG91Y2g7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0b3VjaCA9IGUudG91Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT0gZHJhZ2kuZWwuX2RyYWcuaWQgfHwgZHJhZ2kuZWwubm9kZS5jb250YWlucyh0b3VjaC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gdG91Y2guY2xpZW50WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSB0b3VjaC5jbGllbnRZO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGUub3JpZ2luYWxFdmVudCA/IGUub3JpZ2luYWxFdmVudCA6IGUpLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5vZGUgPSBkcmFnaS5lbC5ub2RlLFxuICAgICAgICAgICAgICAgIG8sXG4gICAgICAgICAgICAgICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXkgPSBub2RlLnN0eWxlLmRpc3BsYXk7XG4gICAgICAgICAgICAvLyBnbG9iLndpbi5vcGVyYSAmJiBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAvLyBub2RlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIC8vIG8gPSBkcmFnaS5lbC5wYXBlci5nZXRFbGVtZW50QnlQb2ludCh4LCB5KTtcbiAgICAgICAgICAgIC8vIG5vZGUuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgICAgICAgICAvLyBnbG9iLndpbi5vcGVyYSAmJiAobmV4dCA/IHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCkgOiBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSkpO1xuICAgICAgICAgICAgLy8gbyAmJiBldmUoXCJzbmFwLmRyYWcub3Zlci5cIiArIGRyYWdpLmVsLmlkLCBkcmFnaS5lbCwgbyk7XG4gICAgICAgICAgICB4ICs9IHNjcm9sbFg7XG4gICAgICAgICAgICB5ICs9IHNjcm9sbFk7XG4gICAgICAgICAgICBldmUoXCJzbmFwLmRyYWcubW92ZS5cIiArIGRyYWdpLmVsLmlkLCBkcmFnaS5tb3ZlX3Njb3BlIHx8IGRyYWdpLmVsLCB4IC0gZHJhZ2kuZWwuX2RyYWcueCwgeSAtIGRyYWdpLmVsLl9kcmFnLnksIHgsIHksIGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkcmFnVXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBTbmFwLnVubW91c2Vtb3ZlKGRyYWdNb3ZlKS51bm1vdXNldXAoZHJhZ1VwKTtcbiAgICAgICAgdmFyIGkgPSBkcmFnLmxlbmd0aCxcbiAgICAgICAgICAgIGRyYWdpO1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBkcmFnaSA9IGRyYWdbaV07XG4gICAgICAgICAgICBkcmFnaS5lbC5fZHJhZyA9IHt9O1xuICAgICAgICAgICAgZXZlKFwic25hcC5kcmFnLmVuZC5cIiArIGRyYWdpLmVsLmlkLCBkcmFnaS5lbmRfc2NvcGUgfHwgZHJhZ2kuc3RhcnRfc2NvcGUgfHwgZHJhZ2kubW92ZV9zY29wZSB8fCBkcmFnaS5lbCwgZSk7XG4gICAgICAgICAgICBldmUub2ZmKFwic25hcC5kcmFnLiouXCIgKyBkcmFnaS5lbC5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZHJhZyA9IFtdO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuY2xpY2tcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgYSBjbGljayBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVuY2xpY2tcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYSBjbGljayBldmVudCBoYW5kbGVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZGJsY2xpY2tcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgYSBkb3VibGUgY2xpY2sgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bmRibGNsaWNrXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgZG91YmxlIGNsaWNrIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5tb3VzZWRvd25cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgYSBtb3VzZWRvd24gZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bm1vdXNlZG93blxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIG1vdXNlZG93biBldmVudCBoYW5kbGVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQubW91c2Vtb3ZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgbW91c2Vtb3ZlIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW5tb3VzZW1vdmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYSBtb3VzZW1vdmUgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50Lm1vdXNlb3V0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgbW91c2VvdXQgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bm1vdXNlb3V0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgbW91c2VvdXQgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50Lm1vdXNlb3ZlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIG1vdXNlb3ZlciBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVubW91c2VvdmVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgbW91c2VvdmVyIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5tb3VzZXVwXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgbW91c2V1cCBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVubW91c2V1cFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIG1vdXNldXAgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvdWNoc3RhcnRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgYSB0b3VjaHN0YXJ0IGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW50b3VjaHN0YXJ0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgdG91Y2hzdGFydCBldmVudCBoYW5kbGVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudG91Y2htb3ZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgdG91Y2htb3ZlIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW50b3VjaG1vdmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYSB0b3VjaG1vdmUgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvdWNoZW5kXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgdG91Y2hlbmQgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bnRvdWNoZW5kXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgdG91Y2hlbmQgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvdWNoY2FuY2VsXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgdG91Y2hjYW5jZWwgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bnRvdWNoY2FuY2VsXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgdG91Y2hjYW5jZWwgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIGZvciAodmFyIGkgPSBldmVudHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgIChmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBTbmFwW2V2ZW50TmFtZV0gPSBlbHByb3RvW2V2ZW50TmFtZV0gPSBmdW5jdGlvbiAoZm4sIHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgaWYgKFNuYXAuaXMoZm4sIFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmOiBmbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuYmluZDogYWRkRXZlbnQodGhpcy5ub2RlIHx8IGRvY3VtZW50LCBldmVudE5hbWUsIGZuLCBzY29wZSB8fCB0aGlzKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0aGlzLmV2ZW50cy5sZW5ndGg7IGkgPCBpaTsgaSsrKSBpZiAodGhpcy5ldmVudHNbaV0ubmFtZSA9PSBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbaV0uZi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBTbmFwW1widW5cIiArIGV2ZW50TmFtZV0gPVxuICAgICAgICAgICAgZWxwcm90b1tcInVuXCIgKyBldmVudE5hbWVdID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICBsID0gZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB3aGlsZSAobC0tKSBpZiAoZXZlbnRzW2xdLm5hbWUgPT0gZXZlbnROYW1lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW50c1tsXS5mID09IGZuIHx8ICFmbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzW2xdLnVuYmluZCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudHMuc3BsaWNlKGwsIDEpO1xuICAgICAgICAgICAgICAgICAgICAhZXZlbnRzLmxlbmd0aCAmJiBkZWxldGUgdGhpcy5ldmVudHM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKGV2ZW50c1tpXSk7XG4gICAgfVxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmhvdmVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGhvdmVyIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gZl9pbiAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIGhvdmVyIGluXG4gICAgIC0gZl9vdXQgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBob3ZlciBvdXRcbiAgICAgLSBpY29udGV4dCAob2JqZWN0KSAjb3B0aW9uYWwgY29udGV4dCBmb3IgaG92ZXIgaW4gaGFuZGxlclxuICAgICAtIG9jb250ZXh0IChvYmplY3QpICNvcHRpb25hbCBjb250ZXh0IGZvciBob3ZlciBvdXQgaGFuZGxlclxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uaG92ZXIgPSBmdW5jdGlvbiAoZl9pbiwgZl9vdXQsIHNjb3BlX2luLCBzY29wZV9vdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW91c2VvdmVyKGZfaW4sIHNjb3BlX2luKS5tb3VzZW91dChmX291dCwgc2NvcGVfb3V0IHx8IHNjb3BlX2luKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVuaG92ZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgaG92ZXIgZXZlbnQgaGFuZGxlcnMgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGZfaW4gKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBob3ZlciBpblxuICAgICAtIGZfb3V0IChmdW5jdGlvbikgaGFuZGxlciBmb3IgaG92ZXIgb3V0XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by51bmhvdmVyID0gZnVuY3Rpb24gKGZfaW4sIGZfb3V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVubW91c2VvdmVyKGZfaW4pLnVubW91c2VvdXQoZl9vdXQpO1xuICAgIH07XG4gICAgdmFyIGRyYWdnYWJsZSA9IFtdO1xuICAgIC8vIFNJRVJSQSB1bmNsZWFyIHdoYXQgX2NvbnRleHRfIHJlZmVycyB0byBmb3Igc3RhcnRpbmcsIGVuZGluZywgbW92aW5nIHRoZSBkcmFnIGdlc3R1cmUuXG4gICAgLy8gU0lFUlJBIEVsZW1lbnQuZHJhZygpOiBfeCBwb3NpdGlvbiBvZiB0aGUgbW91c2VfOiBXaGVyZSBhcmUgdGhlIHgveSB2YWx1ZXMgb2Zmc2V0IGZyb20/XG4gICAgLy8gU0lFUlJBIEVsZW1lbnQuZHJhZygpOiBtdWNoIG9mIHRoaXMgbWVtYmVyJ3MgZG9jIGFwcGVhcnMgdG8gYmUgZHVwbGljYXRlZCBmb3Igc29tZSByZWFzb24uXG4gICAgLy8gU0lFUlJBIFVuY2xlYXIgYWJvdXQgdGhpcyBzZW50ZW5jZTogX0FkZGl0aW9uYWxseSBmb2xsb3dpbmcgZHJhZyBldmVudHMgd2lsbCBiZSB0cmlnZ2VyZWQ6IGRyYWcuc3RhcnQuPGlkPiBvbiBzdGFydCwgZHJhZy5lbmQuPGlkPiBvbiBlbmQgYW5kIGRyYWcubW92ZS48aWQ+IG9uIGV2ZXJ5IG1vdmUuXyBJcyB0aGVyZSBhIGdsb2JhbCBfZHJhZ18gb2JqZWN0IHRvIHdoaWNoIHlvdSBjYW4gYXNzaWduIGhhbmRsZXJzIGtleWVkIGJ5IGFuIGVsZW1lbnQncyBJRD9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5kcmFnXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGV2ZW50IGhhbmRsZXJzIGZvciBhbiBlbGVtZW50J3MgZHJhZyBnZXN0dXJlXG4gICAgICoqXG4gICAgIC0gb25tb3ZlIChmdW5jdGlvbikgaGFuZGxlciBmb3IgbW92aW5nXG4gICAgIC0gb25zdGFydCAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIGRyYWcgc3RhcnRcbiAgICAgLSBvbmVuZCAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIGRyYWcgZW5kXG4gICAgIC0gbWNvbnRleHQgKG9iamVjdCkgI29wdGlvbmFsIGNvbnRleHQgZm9yIG1vdmluZyBoYW5kbGVyXG4gICAgIC0gc2NvbnRleHQgKG9iamVjdCkgI29wdGlvbmFsIGNvbnRleHQgZm9yIGRyYWcgc3RhcnQgaGFuZGxlclxuICAgICAtIGVjb250ZXh0IChvYmplY3QpICNvcHRpb25hbCBjb250ZXh0IGZvciBkcmFnIGVuZCBoYW5kbGVyXG4gICAgICogQWRkaXRpb25hbHkgZm9sbG93aW5nIGBkcmFnYCBldmVudHMgYXJlIHRyaWdnZXJlZDogYGRyYWcuc3RhcnQuPGlkPmAgb24gc3RhcnQsIFxuICAgICAqIGBkcmFnLmVuZC48aWQ+YCBvbiBlbmQgYW5kIGBkcmFnLm1vdmUuPGlkPmAgb24gZXZlcnkgbW92ZS4gV2hlbiBlbGVtZW50IGlzIGRyYWdnZWQgb3ZlciBhbm90aGVyIGVsZW1lbnQgXG4gICAgICogYGRyYWcub3Zlci48aWQ+YCBmaXJlcyBhcyB3ZWxsLlxuICAgICAqXG4gICAgICogU3RhcnQgZXZlbnQgYW5kIHN0YXJ0IGhhbmRsZXIgYXJlIGNhbGxlZCBpbiBzcGVjaWZpZWQgY29udGV4dCBvciBpbiBjb250ZXh0IG9mIHRoZSBlbGVtZW50IHdpdGggZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAgIG8geCAobnVtYmVyKSB4IHBvc2l0aW9uIG9mIHRoZSBtb3VzZVxuICAgICBvIHkgKG51bWJlcikgeSBwb3NpdGlvbiBvZiB0aGUgbW91c2VcbiAgICAgbyBldmVudCAob2JqZWN0KSBET00gZXZlbnQgb2JqZWN0XG4gICAgICogTW92ZSBldmVudCBhbmQgbW92ZSBoYW5kbGVyIGFyZSBjYWxsZWQgaW4gc3BlY2lmaWVkIGNvbnRleHQgb3IgaW4gY29udGV4dCBvZiB0aGUgZWxlbWVudCB3aXRoIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICBvIGR4IChudW1iZXIpIHNoaWZ0IGJ5IHggZnJvbSB0aGUgc3RhcnQgcG9pbnRcbiAgICAgbyBkeSAobnVtYmVyKSBzaGlmdCBieSB5IGZyb20gdGhlIHN0YXJ0IHBvaW50XG4gICAgIG8geCAobnVtYmVyKSB4IHBvc2l0aW9uIG9mIHRoZSBtb3VzZVxuICAgICBvIHkgKG51bWJlcikgeSBwb3NpdGlvbiBvZiB0aGUgbW91c2VcbiAgICAgbyBldmVudCAob2JqZWN0KSBET00gZXZlbnQgb2JqZWN0XG4gICAgICogRW5kIGV2ZW50IGFuZCBlbmQgaGFuZGxlciBhcmUgY2FsbGVkIGluIHNwZWNpZmllZCBjb250ZXh0IG9yIGluIGNvbnRleHQgb2YgdGhlIGVsZW1lbnQgd2l0aCBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICAgbyBldmVudCAob2JqZWN0KSBET00gZXZlbnQgb2JqZWN0XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5kcmFnID0gZnVuY3Rpb24gKG9ubW92ZSwgb25zdGFydCwgb25lbmQsIG1vdmVfc2NvcGUsIHN0YXJ0X3Njb3BlLCBlbmRfc2NvcGUpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ1RyYW5zZm9ybTtcbiAgICAgICAgICAgIHJldHVybiBlbC5kcmFnKGZ1bmN0aW9uIChkeCwgZHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IG9yaWdUcmFuc2Zvcm0gKyAob3JpZ1RyYW5zZm9ybSA/IFwiVFwiIDogXCJ0XCIpICsgW2R4LCBkeV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvcmlnVHJhbnNmb3JtID0gdGhpcy50cmFuc2Zvcm0oKS5sb2NhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0KGUsIHgsIHkpIHtcbiAgICAgICAgICAgIChlLm9yaWdpbmFsRXZlbnQgfHwgZSkucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGVsLl9kcmFnLnggPSB4O1xuICAgICAgICAgICAgZWwuX2RyYWcueSA9IHk7XG4gICAgICAgICAgICBlbC5fZHJhZy5pZCA9IGUuaWRlbnRpZmllcjtcbiAgICAgICAgICAgICFkcmFnLmxlbmd0aCAmJiBTbmFwLm1vdXNlbW92ZShkcmFnTW92ZSkubW91c2V1cChkcmFnVXApO1xuICAgICAgICAgICAgZHJhZy5wdXNoKHtlbDogZWwsIG1vdmVfc2NvcGU6IG1vdmVfc2NvcGUsIHN0YXJ0X3Njb3BlOiBzdGFydF9zY29wZSwgZW5kX3Njb3BlOiBlbmRfc2NvcGV9KTtcbiAgICAgICAgICAgIG9uc3RhcnQgJiYgZXZlLm9uKFwic25hcC5kcmFnLnN0YXJ0LlwiICsgZWwuaWQsIG9uc3RhcnQpO1xuICAgICAgICAgICAgb25tb3ZlICYmIGV2ZS5vbihcInNuYXAuZHJhZy5tb3ZlLlwiICsgZWwuaWQsIG9ubW92ZSk7XG4gICAgICAgICAgICBvbmVuZCAmJiBldmUub24oXCJzbmFwLmRyYWcuZW5kLlwiICsgZWwuaWQsIG9uZW5kKTtcbiAgICAgICAgICAgIGV2ZShcInNuYXAuZHJhZy5zdGFydC5cIiArIGVsLmlkLCBzdGFydF9zY29wZSB8fCBtb3ZlX3Njb3BlIHx8IGVsLCB4LCB5LCBlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBpbml0KGUsIHgsIHkpIHtcbiAgICAgICAgICAgIGV2ZShcInNuYXAuZHJhZ2luaXQuXCIgKyBlbC5pZCwgZWwsIGUsIHgsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZS5vbihcInNuYXAuZHJhZ2luaXQuXCIgKyBlbC5pZCwgc3RhcnQpO1xuICAgICAgICBlbC5fZHJhZyA9IHt9O1xuICAgICAgICBkcmFnZ2FibGUucHVzaCh7ZWw6IGVsLCBzdGFydDogc3RhcnQsIGluaXQ6IGluaXR9KTtcbiAgICAgICAgZWwubW91c2Vkb3duKGluaXQpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICAvKlxuICAgICAqIEVsZW1lbnQub25EcmFnT3ZlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2hvcnRjdXQgdG8gYXNzaWduIGV2ZW50IGhhbmRsZXIgZm9yIGBkcmFnLm92ZXIuPGlkPmAgZXZlbnQsIHdoZXJlIGBpZGAgaXMgdGhlIGVsZW1lbnQncyBgaWRgIChzZWUgQEVsZW1lbnQuaWQpXG4gICAgIC0gZiAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIGV2ZW50LCBmaXJzdCBhcmd1bWVudCB3b3VsZCBiZSB0aGUgZWxlbWVudCB5b3UgYXJlIGRyYWdnaW5nIG92ZXJcbiAgICBcXCovXG4gICAgLy8gZWxwcm90by5vbkRyYWdPdmVyID0gZnVuY3Rpb24gKGYpIHtcbiAgICAvLyAgICAgZiA/IGV2ZS5vbihcInNuYXAuZHJhZy5vdmVyLlwiICsgdGhpcy5pZCwgZikgOiBldmUudW5iaW5kKFwic25hcC5kcmFnLm92ZXIuXCIgKyB0aGlzLmlkKTtcbiAgICAvLyB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVuZHJhZ1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhbGwgZHJhZyBldmVudCBoYW5kbGVycyBmcm9tIHRoZSBnaXZlbiBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8udW5kcmFnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSA9IGRyYWdnYWJsZS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIGlmIChkcmFnZ2FibGVbaV0uZWwgPT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy51bm1vdXNlZG93bihkcmFnZ2FibGVbaV0uaW5pdCk7XG4gICAgICAgICAgICBkcmFnZ2FibGUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgZXZlLnVuYmluZChcInNuYXAuZHJhZy4qLlwiICsgdGhpcy5pZCk7XG4gICAgICAgICAgICBldmUudW5iaW5kKFwic25hcC5kcmFnaW5pdC5cIiArIHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgICFkcmFnZ2FibGUubGVuZ3RoICYmIFNuYXAudW5tb3VzZW1vdmUoZHJhZ01vdmUpLnVubW91c2V1cChkcmFnVXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYikge1xuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIHBwcm90byA9IFBhcGVyLnByb3RvdHlwZSxcbiAgICAgICAgcmd1cmwgPSAvXlxccyp1cmxcXCgoLispXFwpLyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICAkID0gU25hcC5fLiQ7XG4gICAgU25hcC5maWx0ZXIgPSB7fTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIuZmlsdGVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgYDxmaWx0ZXI+YCBlbGVtZW50XG4gICAgICoqXG4gICAgIC0gZmlsc3RyIChzdHJpbmcpIFNWRyBmcmFnbWVudCBvZiBmaWx0ZXIgcHJvdmlkZWQgYXMgYSBzdHJpbmdcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgICAqIE5vdGU6IEl0IGlzIHJlY29tbWVuZGVkIHRvIHVzZSBmaWx0ZXJzIGVtYmVkZGVkIGludG8gdGhlIHBhZ2UgaW5zaWRlIGFuIGVtcHR5IFNWRyBlbGVtZW50LlxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIGYgPSBwYXBlci5maWx0ZXIoJzxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249XCIyXCIvPicpLFxuICAgICB8ICAgICBjID0gcGFwZXIuY2lyY2xlKDEwLCAxMCwgMTApLmF0dHIoe1xuICAgICB8ICAgICAgICAgZmlsdGVyOiBmXG4gICAgIHwgICAgIH0pO1xuICAgIFxcKi9cbiAgICBwcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24gKGZpbHN0cikge1xuICAgICAgICB2YXIgcGFwZXIgPSB0aGlzO1xuICAgICAgICBpZiAocGFwZXIudHlwZSAhPSBcInN2Z1wiKSB7XG4gICAgICAgICAgICBwYXBlciA9IHBhcGVyLnBhcGVyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmID0gU25hcC5wYXJzZShTdHIoZmlsc3RyKSksXG4gICAgICAgICAgICBpZCA9IFNuYXAuXy5pZCgpLFxuICAgICAgICAgICAgd2lkdGggPSBwYXBlci5ub2RlLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0ID0gcGFwZXIubm9kZS5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICBmaWx0ZXIgPSAkKFwiZmlsdGVyXCIpO1xuICAgICAgICAkKGZpbHRlciwge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgZmlsdGVyVW5pdHM6IFwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICB9KTtcbiAgICAgICAgZmlsdGVyLmFwcGVuZENoaWxkKGYubm9kZSk7XG4gICAgICAgIHBhcGVyLmRlZnMuYXBwZW5kQ2hpbGQoZmlsdGVyKTtcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50KGZpbHRlcik7XG4gICAgfTtcblxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLmZpbHRlclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHZhciBwID0gJCh0aGlzLm5vZGUsIFwiZmlsdGVyXCIpO1xuICAgICAgICBpZiAocCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gU3RyKHApLm1hdGNoKHJndXJsKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaCAmJiBTbmFwLnNlbGVjdChtYXRjaFsxXSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5maWx0ZXJcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgdmFsdWUudHlwZSA9PSBcImZpbHRlclwiKSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgdmFyIGlkID0gdmFsdWUubm9kZS5pZDtcbiAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICAkKHZhbHVlLm5vZGUsIHtpZDogdmFsdWUuaWR9KTtcbiAgICAgICAgICAgICAgICBpZCA9IHZhbHVlLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IFNuYXAudXJsKGlkKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuYmx1clxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBTVkcgbWFya3VwIHN0cmluZyBmb3IgdGhlIGJsdXIgZmlsdGVyXG4gICAgICoqXG4gICAgIC0geCAobnVtYmVyKSBhbW91bnQgb2YgaG9yaXpvbnRhbCBibHVyLCBpbiBwaXhlbHNcbiAgICAgLSB5IChudW1iZXIpICNvcHRpb25hbCBhbW91bnQgb2YgdmVydGljYWwgYmx1ciwgaW4gcGl4ZWxzXG4gICAgID0gKHN0cmluZykgZmlsdGVyIHJlcHJlc2VudGF0aW9uXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgZiA9IHBhcGVyLmZpbHRlcihTbmFwLmZpbHRlci5ibHVyKDUsIDEwKSksXG4gICAgIHwgICAgIGMgPSBwYXBlci5jaXJjbGUoMTAsIDEwLCAxMCkuYXR0cih7XG4gICAgIHwgICAgICAgICBmaWx0ZXI6IGZcbiAgICAgfCAgICAgfSk7XG4gICAgXFwqL1xuICAgIFNuYXAuZmlsdGVyLmJsdXIgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICBpZiAoeCA9PSBudWxsKSB7XG4gICAgICAgICAgICB4ID0gMjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVmID0geSA9PSBudWxsID8geCA6IFt4LCB5XTtcbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCdcXDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249XCJ7ZGVmfVwiLz4nLCB7XG4gICAgICAgICAgICBkZWY6IGRlZlxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmJsdXIudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuc2hhZG93XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgc2hhZG93IGZpbHRlclxuICAgICAqKlxuICAgICAtIGR4IChudW1iZXIpICNvcHRpb25hbCBob3Jpem9udGFsIHNoaWZ0IG9mIHRoZSBzaGFkb3csIGluIHBpeGVsc1xuICAgICAtIGR5IChudW1iZXIpICNvcHRpb25hbCB2ZXJ0aWNhbCBzaGlmdCBvZiB0aGUgc2hhZG93LCBpbiBwaXhlbHNcbiAgICAgLSBibHVyIChudW1iZXIpICNvcHRpb25hbCBhbW91bnQgb2YgYmx1clxuICAgICAtIGNvbG9yIChzdHJpbmcpICNvcHRpb25hbCBjb2xvciBvZiB0aGUgc2hhZG93XG4gICAgIC0gb3BhY2l0eSAobnVtYmVyKSAjb3B0aW9uYWwgYDAuLjFgIG9wYWNpdHkgb2YgdGhlIHNoYWRvd1xuICAgICAqIG9yXG4gICAgIC0gZHggKG51bWJlcikgI29wdGlvbmFsIGhvcml6b250YWwgc2hpZnQgb2YgdGhlIHNoYWRvdywgaW4gcGl4ZWxzXG4gICAgIC0gZHkgKG51bWJlcikgI29wdGlvbmFsIHZlcnRpY2FsIHNoaWZ0IG9mIHRoZSBzaGFkb3csIGluIHBpeGVsc1xuICAgICAtIGNvbG9yIChzdHJpbmcpICNvcHRpb25hbCBjb2xvciBvZiB0aGUgc2hhZG93XG4gICAgIC0gb3BhY2l0eSAobnVtYmVyKSAjb3B0aW9uYWwgYDAuLjFgIG9wYWNpdHkgb2YgdGhlIHNoYWRvd1xuICAgICAqIHdoaWNoIG1ha2VzIGJsdXIgZGVmYXVsdCB0byBgNGAuIE9yXG4gICAgIC0gZHggKG51bWJlcikgI29wdGlvbmFsIGhvcml6b250YWwgc2hpZnQgb2YgdGhlIHNoYWRvdywgaW4gcGl4ZWxzXG4gICAgIC0gZHkgKG51bWJlcikgI29wdGlvbmFsIHZlcnRpY2FsIHNoaWZ0IG9mIHRoZSBzaGFkb3csIGluIHBpeGVsc1xuICAgICAtIG9wYWNpdHkgKG51bWJlcikgI29wdGlvbmFsIGAwLi4xYCBvcGFjaXR5IG9mIHRoZSBzaGFkb3dcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBmID0gcGFwZXIuZmlsdGVyKFNuYXAuZmlsdGVyLnNoYWRvdygwLCAyLCAuMykpLFxuICAgICB8ICAgICBjID0gcGFwZXIuY2lyY2xlKDEwLCAxMCwgMTApLmF0dHIoe1xuICAgICB8ICAgICAgICAgZmlsdGVyOiBmXG4gICAgIHwgICAgIH0pO1xuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5zaGFkb3cgPSBmdW5jdGlvbiAoZHgsIGR5LCBibHVyLCBjb2xvciwgb3BhY2l0eSkge1xuICAgICAgICBpZiAob3BhY2l0eSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBibHVyO1xuICAgICAgICAgICAgICAgIGJsdXIgPSA0O1xuICAgICAgICAgICAgICAgIGNvbG9yID0gXCIjMDAwXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBjb2xvcjtcbiAgICAgICAgICAgICAgICBjb2xvciA9IGJsdXI7XG4gICAgICAgICAgICAgICAgYmx1ciA9IDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsdXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgYmx1ciA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wYWNpdHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3BhY2l0eSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR4ID09IG51bGwpIHtcbiAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgIGR5ID0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgZHkgPSBkeDtcbiAgICAgICAgfVxuICAgICAgICBjb2xvciA9IFNuYXAuY29sb3IoY29sb3IpO1xuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUdhdXNzaWFuQmx1ciBpbj1cIlNvdXJjZUFscGhhXCIgc3RkRGV2aWF0aW9uPVwie2JsdXJ9XCIvPjxmZU9mZnNldCBkeD1cIntkeH1cIiBkeT1cIntkeX1cIiByZXN1bHQ9XCJvZmZzZXRibHVyXCIvPjxmZUZsb29kIGZsb29kLWNvbG9yPVwie2NvbG9yfVwiLz48ZmVDb21wb3NpdGUgaW4yPVwib2Zmc2V0Ymx1clwiIG9wZXJhdG9yPVwiaW5cIi8+PGZlQ29tcG9uZW50VHJhbnNmZXI+PGZlRnVuY0EgdHlwZT1cImxpbmVhclwiIHNsb3BlPVwie29wYWNpdHl9XCIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVNZXJnZT48ZmVNZXJnZU5vZGUvPjxmZU1lcmdlTm9kZSBpbj1cIlNvdXJjZUdyYXBoaWNcIi8+PC9mZU1lcmdlPicsIHtcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgIGR4OiBkeCxcbiAgICAgICAgICAgIGR5OiBkeSxcbiAgICAgICAgICAgIGJsdXI6IGJsdXIsXG4gICAgICAgICAgICBvcGFjaXR5OiBvcGFjaXR5XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuc2hhZG93LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLmdyYXlzY2FsZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBTVkcgbWFya3VwIHN0cmluZyBmb3IgdGhlIGdyYXlzY2FsZSBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBhbW91bnQgKG51bWJlcikgYW1vdW50IG9mIGZpbHRlciAoYDAuLjFgKVxuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5ncmF5c2NhbGUgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbG9yTWF0cml4IHR5cGU9XCJtYXRyaXhcIiB2YWx1ZXM9XCJ7YX0ge2J9IHtjfSAwIDAge2R9IHtlfSB7Zn0gMCAwIHtnfSB7Yn0ge2h9IDAgMCAwIDAgMCAxIDBcIi8+Jywge1xuICAgICAgICAgICAgYTogMC4yMTI2ICsgMC43ODc0ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgYjogMC43MTUyIC0gMC43MTUyICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgYzogMC4wNzIyIC0gMC4wNzIyICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZDogMC4yMTI2IC0gMC4yMTI2ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZTogMC43MTUyICsgMC4yODQ4ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZjogMC4wNzIyIC0gMC4wNzIyICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZzogMC4yMTI2IC0gMC4yMTI2ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgaDogMC4wNzIyICsgMC45Mjc4ICogKDEgLSBhbW91bnQpXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuZ3JheXNjYWxlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLnNlcGlhXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgc2VwaWEgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW1vdW50IChudW1iZXIpIGFtb3VudCBvZiBmaWx0ZXIgKGAwLi4xYClcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuc2VwaWEgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbG9yTWF0cml4IHR5cGU9XCJtYXRyaXhcIiB2YWx1ZXM9XCJ7YX0ge2J9IHtjfSAwIDAge2R9IHtlfSB7Zn0gMCAwIHtnfSB7aH0ge2l9IDAgMCAwIDAgMCAxIDBcIi8+Jywge1xuICAgICAgICAgICAgYTogMC4zOTMgKyAwLjYwNyAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGI6IDAuNzY5IC0gMC43NjkgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBjOiAwLjE4OSAtIDAuMTg5ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZDogMC4zNDkgLSAwLjM0OSAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGU6IDAuNjg2ICsgMC4zMTQgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBmOiAwLjE2OCAtIDAuMTY4ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZzogMC4yNzIgLSAwLjI3MiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGg6IDAuNTM0IC0gMC41MzQgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBpOiAwLjEzMSArIDAuODY5ICogKDEgLSBhbW91bnQpXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuc2VwaWEudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuc2F0dXJhdGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBzYXR1cmF0ZSBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBhbW91bnQgKG51bWJlcikgYW1vdW50IG9mIGZpbHRlciAoYDAuLjFgKVxuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5zYXR1cmF0ZSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBhbW91bnQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTbmFwLmZvcm1hdCgnPGZlQ29sb3JNYXRyaXggdHlwZT1cInNhdHVyYXRlXCIgdmFsdWVzPVwie2Ftb3VudH1cIi8+Jywge1xuICAgICAgICAgICAgYW1vdW50OiAxIC0gYW1vdW50XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuc2F0dXJhdGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuaHVlUm90YXRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgaHVlLXJvdGF0ZSBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBhbmdsZSAobnVtYmVyKSBhbmdsZSBvZiByb3RhdGlvblxuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5odWVSb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICAgICAgYW5nbGUgPSBhbmdsZSB8fCAwO1xuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbG9yTWF0cml4IHR5cGU9XCJodWVSb3RhdGVcIiB2YWx1ZXM9XCJ7YW5nbGV9XCIvPicsIHtcbiAgICAgICAgICAgIGFuZ2xlOiBhbmdsZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmh1ZVJvdGF0ZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMoKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmZpbHRlci5pbnZlcnRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBpbnZlcnQgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW1vdW50IChudW1iZXIpIGFtb3VudCBvZiBmaWx0ZXIgKGAwLi4xYClcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuaW52ZXJ0ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGFtb3VudCA9IDE7XG4gICAgICAgIH1cbi8vICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPVwibWF0cml4XCIgdmFsdWVzPVwiLTEgMCAwIDAgMSAgMCAtMSAwIDAgMSAgMCAwIC0xIDAgMSAgMCAwIDAgMSAwXCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPVwic1JHQlwiLz5cbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPVwidGFibGVcIiB0YWJsZVZhbHVlcz1cInthbW91bnR9IHthbW91bnQyfVwiLz48ZmVGdW5jRyB0eXBlPVwidGFibGVcIiB0YWJsZVZhbHVlcz1cInthbW91bnR9IHthbW91bnQyfVwiLz48ZmVGdW5jQiB0eXBlPVwidGFibGVcIiB0YWJsZVZhbHVlcz1cInthbW91bnR9IHthbW91bnQyfVwiLz48L2ZlQ29tcG9uZW50VHJhbnNmZXI+Jywge1xuICAgICAgICAgICAgYW1vdW50OiBhbW91bnQsXG4gICAgICAgICAgICBhbW91bnQyOiAxIC0gYW1vdW50XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuaW52ZXJ0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLmJyaWdodG5lc3NcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBicmlnaHRuZXNzIGZpbHRlclxuICAgICAqKlxuICAgICAtIGFtb3VudCAobnVtYmVyKSBhbW91bnQgb2YgZmlsdGVyIChgMC4uMWApXG4gICAgID0gKHN0cmluZykgZmlsdGVyIHJlcHJlc2VudGF0aW9uXG4gICAgXFwqL1xuICAgIFNuYXAuZmlsdGVyLmJyaWdodG5lc3MgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbXBvbmVudFRyYW5zZmVyPjxmZUZ1bmNSIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIvPjxmZUZ1bmNHIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIvPjxmZUZ1bmNCIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj4nLCB7XG4gICAgICAgICAgICBhbW91bnQ6IGFtb3VudFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmJyaWdodG5lc3MudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuY29udHJhc3RcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBjb250cmFzdCBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBhbW91bnQgKG51bWJlcikgYW1vdW50IG9mIGZpbHRlciAoYDAuLjFgKVxuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5jb250cmFzdCA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBhbW91bnQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTbmFwLmZvcm1hdCgnPGZlQ29tcG9uZW50VHJhbnNmZXI+PGZlRnVuY1IgdHlwZT1cImxpbmVhclwiIHNsb3BlPVwie2Ftb3VudH1cIiBpbnRlcmNlcHQ9XCJ7YW1vdW50Mn1cIi8+PGZlRnVuY0cgdHlwZT1cImxpbmVhclwiIHNsb3BlPVwie2Ftb3VudH1cIiBpbnRlcmNlcHQ9XCJ7YW1vdW50Mn1cIi8+PGZlRnVuY0IgdHlwZT1cImxpbmVhclwiIHNsb3BlPVwie2Ftb3VudH1cIiBpbnRlcmNlcHQ9XCJ7YW1vdW50Mn1cIi8+PC9mZUNvbXBvbmVudFRyYW5zZmVyPicsIHtcbiAgICAgICAgICAgIGFtb3VudDogYW1vdW50LFxuICAgICAgICAgICAgYW1vdW50MjogLjUgLSBhbW91bnQgLyAyXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU25hcC5maWx0ZXIuY29udHJhc3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTQgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIGJveCA9IFNuYXAuXy5ib3gsXG4gICAgICAgIGlzID0gU25hcC5pcyxcbiAgICAgICAgZmlyc3RMZXR0ZXIgPSAvXlteYS16XSooW3RibWxyY10pL2ksXG4gICAgICAgIHRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVFwiICsgdGhpcy5keCArIFwiLFwiICsgdGhpcy5keTtcbiAgICAgICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5nZXRBbGlnblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBzaGlmdCBuZWVkZWQgdG8gYWxpZ24gdGhlIGVsZW1lbnQgcmVsYXRpdmVseSB0byBnaXZlbiBlbGVtZW50LlxuICAgICAqIElmIG5vIGVsZW1lbnRzIHNwZWNpZmllZCwgcGFyZW50IGA8c3ZnPmAgY29udGFpbmVyIHdpbGwgYmUgdXNlZC5cbiAgICAgLSBlbCAob2JqZWN0KSBAb3B0aW9uYWwgYWxpZ25tZW50IGVsZW1lbnRcbiAgICAgLSB3YXkgKHN0cmluZykgb25lIG9mIHNpeCB2YWx1ZXM6IGBcInRvcFwiYCwgYFwibWlkZGxlXCJgLCBgXCJib3R0b21cImAsIGBcImxlZnRcImAsIGBcImNlbnRlclwiYCwgYFwicmlnaHRcImBcbiAgICAgPSAob2JqZWN0fHN0cmluZykgT2JqZWN0IGluIGZvcm1hdCBge2R4OiAsIGR5OiB9YCBhbHNvIGhhcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBhcyBhIHRyYW5zZm9ybWF0aW9uIHN0cmluZ1xuICAgICA+IFVzYWdlXG4gICAgIHwgZWwudHJhbnNmb3JtKGVsLmdldEFsaWduKGVsMiwgXCJ0b3BcIikpO1xuICAgICAqIG9yXG4gICAgIHwgdmFyIGR5ID0gZWwuZ2V0QWxpZ24oZWwyLCBcInRvcFwiKS5keTtcbiAgICBcXCovXG4gICAgRWxlbWVudC5wcm90b3R5cGUuZ2V0QWxpZ24gPSBmdW5jdGlvbiAoZWwsIHdheSkge1xuICAgICAgICBpZiAod2F5ID09IG51bGwgJiYgaXMoZWwsIFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICB3YXkgPSBlbDtcbiAgICAgICAgICAgIGVsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbCA9IGVsIHx8IHRoaXMucGFwZXI7XG4gICAgICAgIHZhciBieCA9IGVsLmdldEJCb3ggPyBlbC5nZXRCQm94KCkgOiBib3goZWwpLFxuICAgICAgICAgICAgYmIgPSB0aGlzLmdldEJCb3goKSxcbiAgICAgICAgICAgIG91dCA9IHt9O1xuICAgICAgICB3YXkgPSB3YXkgJiYgd2F5Lm1hdGNoKGZpcnN0TGV0dGVyKTtcbiAgICAgICAgd2F5ID0gd2F5ID8gd2F5WzFdLnRvTG93ZXJDYXNlKCkgOiBcImNcIjtcbiAgICAgICAgc3dpdGNoICh3YXkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0XCI6XG4gICAgICAgICAgICAgICAgb3V0LmR4ID0gMDtcbiAgICAgICAgICAgICAgICBvdXQuZHkgPSBieC55IC0gYmIueTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgICBvdXQuZHggPSAwO1xuICAgICAgICAgICAgICAgIG91dC5keSA9IGJ4LnkyIC0gYmIueTI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtXCI6XG4gICAgICAgICAgICAgICAgb3V0LmR4ID0gMDtcbiAgICAgICAgICAgICAgICBvdXQuZHkgPSBieC5jeSAtIGJiLmN5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibFwiOlxuICAgICAgICAgICAgICAgIG91dC5keCA9IGJ4LnggLSBiYi54O1xuICAgICAgICAgICAgICAgIG91dC5keSA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyXCI6XG4gICAgICAgICAgICAgICAgb3V0LmR4ID0gYngueDIgLSBiYi54MjtcbiAgICAgICAgICAgICAgICBvdXQuZHkgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG91dC5keCA9IGJ4LmN4IC0gYmIuY3g7XG4gICAgICAgICAgICAgICAgb3V0LmR5ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG91dC50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYWxpZ25cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFsaWducyB0aGUgZWxlbWVudCByZWxhdGl2ZWx5IHRvIGdpdmVuIG9uZSB2aWEgdHJhbnNmb3JtYXRpb24uXG4gICAgICogSWYgbm8gZWxlbWVudHMgc3BlY2lmaWVkLCBwYXJlbnQgYDxzdmc+YCBjb250YWluZXIgd2lsbCBiZSB1c2VkLlxuICAgICAtIGVsIChvYmplY3QpIEBvcHRpb25hbCBhbGlnbm1lbnQgZWxlbWVudFxuICAgICAtIHdheSAoc3RyaW5nKSBvbmUgb2Ygc2l4IHZhbHVlczogYFwidG9wXCJgLCBgXCJtaWRkbGVcImAsIGBcImJvdHRvbVwiYCwgYFwibGVmdFwiYCwgYFwiY2VudGVyXCJgLCBgXCJyaWdodFwiYFxuICAgICA9IChvYmplY3QpIHRoaXMgZWxlbWVudFxuICAgICA+IFVzYWdlXG4gICAgIHwgZWwuYWxpZ24oZWwyLCBcInRvcFwiKTtcbiAgICAgKiBvclxuICAgICB8IGVsLmFsaWduKFwibWlkZGxlXCIpO1xuICAgIFxcKi9cbiAgICBFbGVtZW50LnByb3RvdHlwZS5hbGlnbiA9IGZ1bmN0aW9uIChlbCwgd2F5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybShcIi4uLlwiICsgdGhpcy5nZXRBbGlnbihlbCwgd2F5KSk7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTYgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIGVscHJvdG8gPSBFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgaXMgPSBTbmFwLmlzLFxuICAgICAgICBTdHIgPSBTdHJpbmcsXG4gICAgICAgIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIjtcbiAgICBmdW5jdGlvbiBzbGljZShmcm9tLCB0bywgZikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFycikge1xuICAgICAgICAgICAgdmFyIHJlcyA9IGFyci5zbGljZShmcm9tLCB0byk7XG4gICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGYgPyBmKHJlcykgOiByZXM7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBBbmltYXRpb24gPSBmdW5jdGlvbiAoYXR0ciwgbXMsIGVhc2luZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlYXNpbmcgPT0gXCJmdW5jdGlvblwiICYmICFlYXNpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGVhc2luZztcbiAgICAgICAgICAgIGVhc2luZyA9IG1pbmEubGluZWFyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXR0ciA9IGF0dHI7XG4gICAgICAgIHRoaXMuZHVyID0gbXM7XG4gICAgICAgIGVhc2luZyAmJiAodGhpcy5lYXNpbmcgPSBlYXNpbmcpO1xuICAgICAgICBjYWxsYmFjayAmJiAodGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIFNuYXAuXy5BbmltYXRpb24gPSBBbmltYXRpb247XG4gICAgLypcXFxuICAgICAqIFNuYXAuYW5pbWF0aW9uXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGFuIGFuaW1hdGlvbiBvYmplY3RcbiAgICAgKipcbiAgICAgLSBhdHRyIChvYmplY3QpIGF0dHJpYnV0ZXMgb2YgZmluYWwgZGVzdGluYXRpb25cbiAgICAgLSBkdXJhdGlvbiAobnVtYmVyKSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uLCBpbiBtaWxsaXNlY29uZHNcbiAgICAgLSBlYXNpbmcgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgb25lIG9mIGVhc2luZyBmdW5jdGlvbnMgb2YgQG1pbmEgb3IgY3VzdG9tIG9uZVxuICAgICAtIGNhbGxiYWNrIChmdW5jdGlvbikgI29wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZmlyZXMgd2hlbiBhbmltYXRpb24gZW5kc1xuICAgICA9IChvYmplY3QpIGFuaW1hdGlvbiBvYmplY3RcbiAgICBcXCovXG4gICAgU25hcC5hbmltYXRpb24gPSBmdW5jdGlvbiAoYXR0ciwgbXMsIGVhc2luZywgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb24oYXR0ciwgbXMsIGVhc2luZywgY2FsbGJhY2spO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuaW5BbmltXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGEgc2V0IG9mIGFuaW1hdGlvbnMgdGhhdCBtYXkgYmUgYWJsZSB0byBtYW5pcHVsYXRlIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSBpbiBmb3JtYXQ6XG4gICAgIG8ge1xuICAgICBvICAgICBhbmltIChvYmplY3QpIGFuaW1hdGlvbiBvYmplY3QsXG4gICAgIG8gICAgIG1pbmEgKG9iamVjdCkgQG1pbmEgb2JqZWN0LFxuICAgICBvICAgICBjdXJTdGF0dXMgKG51bWJlcikgMC4uMSDigJQgc3RhdHVzIG9mIHRoZSBhbmltYXRpb246IDAg4oCUIGp1c3Qgc3RhcnRlZCwgMSDigJQganVzdCBmaW5pc2hlZCxcbiAgICAgbyAgICAgc3RhdHVzIChmdW5jdGlvbikgZ2V0cyBvciBzZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGFuaW1hdGlvbixcbiAgICAgbyAgICAgc3RvcCAoZnVuY3Rpb24pIHN0b3BzIHRoZSBhbmltYXRpb25cbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIGVscHJvdG8uaW5BbmltID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLFxuICAgICAgICAgICAgcmVzID0gW107XG4gICAgICAgIGZvciAodmFyIGlkIGluIGVsLmFuaW1zKSBpZiAoZWwuYW5pbXNbaGFzXShpZCkpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbTogbmV3IEFuaW1hdGlvbihhLl9hdHRycywgYS5kdXIsIGEuZWFzaW5nLCBhLl9jYWxsYmFjayksXG4gICAgICAgICAgICAgICAgICAgIG1pbmE6IGEsXG4gICAgICAgICAgICAgICAgICAgIGN1clN0YXR1czogYS5zdGF0dXMoKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5zdGF0dXModmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0oZWwuYW5pbXNbaWRdKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmFuaW1hdGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJ1bnMgZ2VuZXJpYyBhbmltYXRpb24gb2Ygb25lIG51bWJlciBpbnRvIGFub3RoZXIgd2l0aCBhIGNhcmluZyBmdW5jdGlvblxuICAgICAqKlxuICAgICAtIGZyb20gKG51bWJlcnxhcnJheSkgbnVtYmVyIG9yIGFycmF5IG9mIG51bWJlcnNcbiAgICAgLSB0byAobnVtYmVyfGFycmF5KSBudW1iZXIgb3IgYXJyYXkgb2YgbnVtYmVyc1xuICAgICAtIHNldHRlciAoZnVuY3Rpb24pIGNhcmluZyBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgb25lIG51bWJlciBhcmd1bWVudFxuICAgICAtIGR1cmF0aW9uIChudW1iZXIpIGR1cmF0aW9uLCBpbiBtaWxsaXNlY29uZHNcbiAgICAgLSBlYXNpbmcgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgZWFzaW5nIGZ1bmN0aW9uIGZyb20gQG1pbmEgb3IgY3VzdG9tXG4gICAgIC0gY2FsbGJhY2sgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGFuaW1hdGlvbiBlbmRzXG4gICAgID0gKG9iamVjdCkgYW5pbWF0aW9uIG9iamVjdCBpbiBAbWluYSBmb3JtYXRcbiAgICAgbyB7XG4gICAgIG8gICAgIGlkIChzdHJpbmcpIGFuaW1hdGlvbiBpZCwgY29uc2lkZXIgaXQgcmVhZC1vbmx5LFxuICAgICBvICAgICBkdXJhdGlvbiAoZnVuY3Rpb24pIGdldHMgb3Igc2V0cyB0aGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbixcbiAgICAgbyAgICAgZWFzaW5nIChmdW5jdGlvbikgZWFzaW5nLFxuICAgICBvICAgICBzcGVlZCAoZnVuY3Rpb24pIGdldHMgb3Igc2V0cyB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbixcbiAgICAgbyAgICAgc3RhdHVzIChmdW5jdGlvbikgZ2V0cyBvciBzZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGFuaW1hdGlvbixcbiAgICAgbyAgICAgc3RvcCAoZnVuY3Rpb24pIHN0b3BzIHRoZSBhbmltYXRpb25cbiAgICAgbyB9XG4gICAgIHwgdmFyIHJlY3QgPSBTbmFwKCkucmVjdCgwLCAwLCAxMCwgMTApO1xuICAgICB8IFNuYXAuYW5pbWF0ZSgwLCAxMCwgZnVuY3Rpb24gKHZhbCkge1xuICAgICB8ICAgICByZWN0LmF0dHIoe1xuICAgICB8ICAgICAgICAgeDogdmFsXG4gICAgIHwgICAgIH0pO1xuICAgICB8IH0sIDEwMDApO1xuICAgICB8IC8vIGluIGdpdmVuIGNvbnRleHQgaXMgZXF1aXZhbGVudCB0b1xuICAgICB8IHJlY3QuYW5pbWF0ZSh7eDogMTB9LCAxMDAwKTtcbiAgICBcXCovXG4gICAgU25hcC5hbmltYXRlID0gZnVuY3Rpb24gKGZyb20sIHRvLCBzZXR0ZXIsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWFzaW5nID09IFwiZnVuY3Rpb25cIiAmJiAhZWFzaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBlYXNpbmc7XG4gICAgICAgICAgICBlYXNpbmcgPSBtaW5hLmxpbmVhcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm93ID0gbWluYS50aW1lKCksXG4gICAgICAgICAgICBhbmltID0gbWluYShmcm9tLCB0bywgbm93LCBub3cgKyBtcywgbWluYS50aW1lLCBzZXR0ZXIsIGVhc2luZyk7XG4gICAgICAgIGNhbGxiYWNrICYmIGV2ZS5vbmNlKFwibWluYS5maW5pc2guXCIgKyBhbmltLmlkLCBjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiBhbmltO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuc3RvcFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU3RvcHMgYWxsIHRoZSBhbmltYXRpb25zIGZvciB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICoqXG4gICAgID0gKEVsZW1lbnQpIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5pbXMgPSB0aGlzLmluQW5pbSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBhbmltcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBhbmltc1tpXS5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5hbmltYXRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBbmltYXRlcyB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvZiB0aGUgZWxlbWVudFxuICAgICAqKlxuICAgICAtIGF0dHJzIChvYmplY3QpIGtleS12YWx1ZSBwYWlycyBvZiBkZXN0aW5hdGlvbiBhdHRyaWJ1dGVzXG4gICAgIC0gZHVyYXRpb24gKG51bWJlcikgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiBpbiBtaWxsaXNlY29uZHNcbiAgICAgLSBlYXNpbmcgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgZWFzaW5nIGZ1bmN0aW9uIGZyb20gQG1pbmEgb3IgY3VzdG9tXG4gICAgIC0gY2FsbGJhY2sgKGZ1bmN0aW9uKSAjb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyB3aGVuIHRoZSBhbmltYXRpb24gZW5kc1xuICAgICA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uYW5pbWF0ZSA9IGZ1bmN0aW9uIChhdHRycywgbXMsIGVhc2luZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlYXNpbmcgPT0gXCJmdW5jdGlvblwiICYmICFlYXNpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGVhc2luZztcbiAgICAgICAgICAgIGVhc2luZyA9IG1pbmEubGluZWFyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRycyBpbnN0YW5jZW9mIEFuaW1hdGlvbikge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBhdHRycy5jYWxsYmFjaztcbiAgICAgICAgICAgIGVhc2luZyA9IGF0dHJzLmVhc2luZztcbiAgICAgICAgICAgIG1zID0gYXR0cnMuZHVyO1xuICAgICAgICAgICAgYXR0cnMgPSBhdHRycy5hdHRyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBma2V5cyA9IFtdLCB0a2V5cyA9IFtdLCBrZXlzID0ge30sIGZyb20sIHRvLCBmLCBlcSxcbiAgICAgICAgICAgIGVsID0gdGhpcztcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSBpZiAoYXR0cnNbaGFzXShrZXkpKSB7XG4gICAgICAgICAgICBpZiAoZWwuZXF1YWwpIHtcbiAgICAgICAgICAgICAgICBlcSA9IGVsLmVxdWFsKGtleSwgU3RyKGF0dHJzW2tleV0pKTtcbiAgICAgICAgICAgICAgICBmcm9tID0gZXEuZnJvbTtcbiAgICAgICAgICAgICAgICB0byA9IGVxLnRvO1xuICAgICAgICAgICAgICAgIGYgPSBlcS5mO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gK2VsLmF0dHIoa2V5KTtcbiAgICAgICAgICAgICAgICB0byA9ICthdHRyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxlbiA9IGlzKGZyb20sIFwiYXJyYXlcIikgPyBmcm9tLmxlbmd0aCA6IDE7XG4gICAgICAgICAgICBrZXlzW2tleV0gPSBzbGljZShma2V5cy5sZW5ndGgsIGZrZXlzLmxlbmd0aCArIGxlbiwgZik7XG4gICAgICAgICAgICBma2V5cyA9IGZrZXlzLmNvbmNhdChmcm9tKTtcbiAgICAgICAgICAgIHRrZXlzID0gdGtleXMuY29uY2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm93ID0gbWluYS50aW1lKCksXG4gICAgICAgICAgICBhbmltID0gbWluYShma2V5cywgdGtleXMsIG5vdywgbm93ICsgbXMsIG1pbmEudGltZSwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGtleXMpIGlmIChrZXlzW2hhc10oa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyW2tleV0gPSBrZXlzW2tleV0odmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWwuYXR0cihhdHRyKTtcbiAgICAgICAgICAgIH0sIGVhc2luZyk7XG4gICAgICAgIGVsLmFuaW1zW2FuaW0uaWRdID0gYW5pbTtcbiAgICAgICAgYW5pbS5fYXR0cnMgPSBhdHRycztcbiAgICAgICAgYW5pbS5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgZXZlKFwic25hcC5hbmltY3JlYXRlZC5cIiArIGVsLmlkLCBhbmltKTtcbiAgICAgICAgZXZlLm9uY2UoXCJtaW5hLmZpbmlzaC5cIiArIGFuaW0uaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV2ZS5vZmYoXCJtaW5hLiouXCIgKyBhbmltLmlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbC5hbmltc1thbmltLmlkXTtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZXZlLm9uY2UoXCJtaW5hLnN0b3AuXCIgKyBhbmltLmlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBldmUub2ZmKFwibWluYS4qLlwiICsgYW5pbS5pZCk7XG4gICAgICAgICAgICBkZWxldGUgZWwuYW5pbXNbYW5pbS5pZF07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTcgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcbiAgICAvLyBDb2xvdXJzIGFyZSBmcm9tIGh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY29cbiAgICB2YXIgcmVkICAgICAgICAgPSBcIiNmZmViZWUjZmZjZGQyI2VmOWE5YSNlNTczNzMjZWY1MzUwI2Y0NDMzNiNlNTM5MzUjZDMyZjJmI2M2MjgyOCNiNzFjMWMjZmY4YTgwI2ZmNTI1MiNmZjE3NDQjZDUwMDAwXCIsXG4gICAgICAgIHBpbmsgICAgICAgID0gXCIjRkNFNEVDI0Y4QkJEMCNGNDhGQjEjRjA2MjkyI0VDNDA3QSNFOTFFNjMjRDgxQjYwI0MyMTg1QiNBRDE0NTcjODgwRTRGI0ZGODBBQiNGRjQwODEjRjUwMDU3I0M1MTE2MlwiLFxuICAgICAgICBwdXJwbGUgICAgICA9IFwiI0YzRTVGNSNFMUJFRTcjQ0U5M0Q4I0JBNjhDOCNBQjQ3QkMjOUMyN0IwIzhFMjRBQSM3QjFGQTIjNkExQjlBIzRBMTQ4QyNFQTgwRkMjRTA0MEZCI0Q1MDBGOSNBQTAwRkZcIixcbiAgICAgICAgZGVlcHB1cnBsZSAgPSBcIiNFREU3RjYjRDFDNEU5I0IzOUREQiM5NTc1Q0QjN0U1N0MyIzY3M0FCNyM1RTM1QjEjNTEyREE4IzQ1MjdBMCMzMTFCOTIjQjM4OEZGIzdDNERGRiM2NTFGRkYjNjIwMEVBXCIsXG4gICAgICAgIGluZGlnbyAgICAgID0gXCIjRThFQUY2I0M1Q0FFOSM5RkE4REEjNzk4NkNCIzVDNkJDMCMzRjUxQjUjMzk0OUFCIzMwM0Y5RiMyODM1OTMjMUEyMzdFIzhDOUVGRiM1MzZERkUjM0Q1QUZFIzMwNEZGRVwiLFxuICAgICAgICBibHVlICAgICAgICA9IFwiI0UzRjJGRCNCQkRFRkIjOTBDQUY5IzY0QjVGNiM2NEI1RjYjMjE5NkYzIzFFODhFNSMxOTc2RDIjMTU2NUMwIzBENDdBMSM4MkIxRkYjNDQ4QUZGIzI5NzlGRiMyOTYyRkZcIixcbiAgICAgICAgbGlnaHRibHVlICAgPSBcIiNFMUY1RkUjQjNFNUZDIzgxRDRGQSM0RkMzRjcjMjlCNkY2IzAzQTlGNCMwMzlCRTUjMDI4OEQxIzAyNzdCRCMwMTU3OUIjODBEOEZGIzQwQzRGRiMwMEIwRkYjMDA5MUVBXCIsXG4gICAgICAgIGN5YW4gICAgICAgID0gXCIjRTBGN0ZBI0IyRUJGMiM4MERFRUEjNEREMEUxIzI2QzZEQSMwMEJDRDQjMDBBQ0MxIzAwOTdBNyMwMDgzOEYjMDA2MDY0Izg0RkZGRiMxOEZGRkYjMDBFNUZGIzAwQjhENFwiLFxuICAgICAgICB0ZWFsICAgICAgICA9IFwiI0UwRjJGMSNCMkRGREIjODBDQkM0IzREQjZBQyMyNkE2OUEjMDA5Njg4IzAwODk3QiMwMDc5NkIjMDA2OTVDIzAwNEQ0MCNBN0ZGRUIjNjRGRkRBIzFERTlCNiMwMEJGQTVcIixcbiAgICAgICAgZ3JlZW4gICAgICAgPSBcIiNFOEY1RTkjQzhFNkM5I0E1RDZBNyM4MUM3ODQjNjZCQjZBIzRDQUY1MCM0M0EwNDcjMzg4RTNDIzJFN0QzMiMxQjVFMjAjQjlGNkNBIzY5RjBBRSMwMEU2NzYjMDBDODUzXCIsXG4gICAgICAgIGxpZ2h0Z3JlZW4gID0gXCIjRjFGOEU5I0RDRURDOCNDNUUxQTUjQUVENTgxIzlDQ0M2NSM4QkMzNEEjN0NCMzQyIzY4OUYzOCM1NThCMkYjMzM2OTFFI0NDRkY5MCNCMkZGNTkjNzZGRjAzIzY0REQxN1wiLFxuICAgICAgICBsaW1lICAgICAgICA9IFwiI0Y5RkJFNyNGMEY0QzMjRTZFRTlDI0RDRTc3NSNENEUxNTcjQ0REQzM5I0MwQ0EzMyNBRkI0MkIjOUU5RDI0IzgyNzcxNyNGNEZGODEjRUVGRjQxI0M2RkYwMCNBRUVBMDBcIixcbiAgICAgICAgeWVsbG93ICAgICAgPSBcIiNGRkZERTcjRkZGOUM0I0ZGRjU5RCNGRkYxNzYjRkZFRTU4I0ZGRUIzQiNGREQ4MzUjRkJDMDJEI0Y5QTgyNSNGNTdGMTcjRkZGRjhEI0ZGRkYwMCNGRkVBMDAjRkZENjAwXCIsXG4gICAgICAgIGFtYmVyICAgICAgID0gXCIjRkZGOEUxI0ZGRUNCMyNGRkUwODIjRkZENTRGI0ZGQ0EyOCNGRkMxMDcjRkZCMzAwI0ZGQTAwMCNGRjhGMDAjRkY2RjAwI0ZGRTU3RiNGRkQ3NDAjRkZDNDAwI0ZGQUIwMFwiLFxuICAgICAgICBvcmFuZ2UgICAgICA9IFwiI0ZGRjNFMCNGRkUwQjIjRkZDQzgwI0ZGQjc0RCNGRkE3MjYjRkY5ODAwI0ZCOEMwMCNGNTdDMDAjRUY2QzAwI0U2NTEwMCNGRkQxODAjRkZBQjQwI0ZGOTEwMCNGRjZEMDBcIixcbiAgICAgICAgZGVlcG9yYW5nZSAgPSBcIiNGQkU5RTcjRkZDQ0JDI0ZGQUI5MSNGRjhBNjUjRkY3MDQzI0ZGNTcyMiNGNDUxMUUjRTY0QTE5I0Q4NDMxNSNCRjM2MEMjRkY5RTgwI0ZGNkU0MCNGRjNEMDAjREQyQzAwXCIsXG4gICAgICAgIGJyb3duICAgICAgID0gXCIjRUZFQkU5I0Q3Q0NDOCNCQ0FBQTQjQTE4ODdGIzhENkU2MyM3OTU1NDgjNkQ0QzQxIzVENDAzNyM0RTM0MkUjM0UyNzIzXCIsXG4gICAgICAgIGdyZXkgICAgICAgID0gXCIjRkFGQUZBI0Y1RjVGNSNFRUVFRUUjRTBFMEUwI0JEQkRCRCM5RTlFOUUjNzU3NTc1IzYxNjE2MSM0MjQyNDIjMjEyMTIxXCIsXG4gICAgICAgIGJsdWVncmV5ICAgID0gXCIjRUNFRkYxI0NGRDhEQyNCMEJFQzUjOTBBNEFFIzc4OTA5QyM2MDdEOEIjNTQ2RTdBIzQ1NUE2NCMzNzQ3NEYjMjYzMjM4XCI7XG4gICAgLypcXFxuICAgICAqIFNuYXAubXVpXG4gICAgIFsgcHJvcGVydHkgXVxuICAgICAqKlxuICAgICAqIENvbnRhaW4gTWF0ZXJpYWwgVUkgY29sb3Vycy5cbiAgICAgfCBTbmFwKCkucmVjdCgwLCAwLCAxMCwgMTApLmF0dHIoe2ZpbGw6IFNuYXAubXVpLmRlZXBwdXJwbGUsIHN0cm9rZTogU25hcC5tdWkuYW1iZXJbNjAwXX0pO1xuICAgICAjIEZvciBjb2xvdXIgcmVmZXJlbmNlOiA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWF0ZXJpYWx1aS5jb1wiPmh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY288L2E+LlxuICAgIFxcKi9cbiAgICBTbmFwLm11aSA9IHt9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmZsYXRcbiAgICAgWyBwcm9wZXJ0eSBdXG4gICAgICoqXG4gICAgICogQ29udGFpbiBGbGF0IFVJIGNvbG91cnMuXG4gICAgIHwgU25hcCgpLnJlY3QoMCwgMCwgMTAsIDEwKS5hdHRyKHtmaWxsOiBTbmFwLmZsYXQuY2Fycm90LCBzdHJva2U6IFNuYXAuZmxhdC53ZXRhc3BoYWx0fSk7XG4gICAgICMgRm9yIGNvbG91ciByZWZlcmVuY2U6IDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXRlcmlhbHVpLmNvXCI+aHR0cHM6Ly93d3cubWF0ZXJpYWx1aS5jbzwvYT4uXG4gICAgXFwqL1xuICAgIFNuYXAuZmxhdCA9IHt9O1xuICAgIGZ1bmN0aW9uIHNhdmVDb2xvcihjb2xvcnMpIHtcbiAgICAgICAgY29sb3JzID0gY29sb3JzLnNwbGl0KC8oPz0jKS8pO1xuICAgICAgICB2YXIgY29sb3IgPSBuZXcgU3RyaW5nKGNvbG9yc1s1XSk7XG4gICAgICAgIGNvbG9yWzUwXSA9IGNvbG9yc1swXTtcbiAgICAgICAgY29sb3JbMTAwXSA9IGNvbG9yc1sxXTtcbiAgICAgICAgY29sb3JbMjAwXSA9IGNvbG9yc1syXTtcbiAgICAgICAgY29sb3JbMzAwXSA9IGNvbG9yc1szXTtcbiAgICAgICAgY29sb3JbNDAwXSA9IGNvbG9yc1s0XTtcbiAgICAgICAgY29sb3JbNTAwXSA9IGNvbG9yc1s1XTtcbiAgICAgICAgY29sb3JbNjAwXSA9IGNvbG9yc1s2XTtcbiAgICAgICAgY29sb3JbNzAwXSA9IGNvbG9yc1s3XTtcbiAgICAgICAgY29sb3JbODAwXSA9IGNvbG9yc1s4XTtcbiAgICAgICAgY29sb3JbOTAwXSA9IGNvbG9yc1s5XTtcbiAgICAgICAgaWYgKGNvbG9yc1sxMF0pIHtcbiAgICAgICAgICAgIGNvbG9yLkExMDAgPSBjb2xvcnNbMTBdO1xuICAgICAgICAgICAgY29sb3IuQTIwMCA9IGNvbG9yc1sxMV07XG4gICAgICAgICAgICBjb2xvci5BNDAwID0gY29sb3JzWzEyXTtcbiAgICAgICAgICAgIGNvbG9yLkE3MDAgPSBjb2xvcnNbMTNdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gICAgU25hcC5tdWkucmVkID0gc2F2ZUNvbG9yKHJlZCk7XG4gICAgU25hcC5tdWkucGluayA9IHNhdmVDb2xvcihwaW5rKTtcbiAgICBTbmFwLm11aS5wdXJwbGUgPSBzYXZlQ29sb3IocHVycGxlKTtcbiAgICBTbmFwLm11aS5kZWVwcHVycGxlID0gc2F2ZUNvbG9yKGRlZXBwdXJwbGUpO1xuICAgIFNuYXAubXVpLmluZGlnbyA9IHNhdmVDb2xvcihpbmRpZ28pO1xuICAgIFNuYXAubXVpLmJsdWUgPSBzYXZlQ29sb3IoYmx1ZSk7XG4gICAgU25hcC5tdWkubGlnaHRibHVlID0gc2F2ZUNvbG9yKGxpZ2h0Ymx1ZSk7XG4gICAgU25hcC5tdWkuY3lhbiA9IHNhdmVDb2xvcihjeWFuKTtcbiAgICBTbmFwLm11aS50ZWFsID0gc2F2ZUNvbG9yKHRlYWwpO1xuICAgIFNuYXAubXVpLmdyZWVuID0gc2F2ZUNvbG9yKGdyZWVuKTtcbiAgICBTbmFwLm11aS5saWdodGdyZWVuID0gc2F2ZUNvbG9yKGxpZ2h0Z3JlZW4pO1xuICAgIFNuYXAubXVpLmxpbWUgPSBzYXZlQ29sb3IobGltZSk7XG4gICAgU25hcC5tdWkueWVsbG93ID0gc2F2ZUNvbG9yKHllbGxvdyk7XG4gICAgU25hcC5tdWkuYW1iZXIgPSBzYXZlQ29sb3IoYW1iZXIpO1xuICAgIFNuYXAubXVpLm9yYW5nZSA9IHNhdmVDb2xvcihvcmFuZ2UpO1xuICAgIFNuYXAubXVpLmRlZXBvcmFuZ2UgPSBzYXZlQ29sb3IoZGVlcG9yYW5nZSk7XG4gICAgU25hcC5tdWkuYnJvd24gPSBzYXZlQ29sb3IoYnJvd24pO1xuICAgIFNuYXAubXVpLmdyZXkgPSBzYXZlQ29sb3IoZ3JleSk7XG4gICAgU25hcC5tdWkuYmx1ZWdyZXkgPSBzYXZlQ29sb3IoYmx1ZWdyZXkpO1xuICAgIFNuYXAuZmxhdC50dXJxdW9pc2UgPSBcIiMxYWJjOWNcIjtcbiAgICBTbmFwLmZsYXQuZ3JlZW5zZWEgPSBcIiMxNmEwODVcIjtcbiAgICBTbmFwLmZsYXQuc3VuZmxvd2VyID0gXCIjZjFjNDBmXCI7XG4gICAgU25hcC5mbGF0Lm9yYW5nZSA9IFwiI2YzOWMxMlwiO1xuICAgIFNuYXAuZmxhdC5lbWVybGFuZCA9IFwiIzJlY2M3MVwiO1xuICAgIFNuYXAuZmxhdC5uZXBocml0aXMgPSBcIiMyN2FlNjBcIjtcbiAgICBTbmFwLmZsYXQuY2Fycm90ID0gXCIjZTY3ZTIyXCI7XG4gICAgU25hcC5mbGF0LnB1bXBraW4gPSBcIiNkMzU0MDBcIjtcbiAgICBTbmFwLmZsYXQucGV0ZXJyaXZlciA9IFwiIzM0OThkYlwiO1xuICAgIFNuYXAuZmxhdC5iZWxpemVob2xlID0gXCIjMjk4MGI5XCI7XG4gICAgU25hcC5mbGF0LmFsaXphcmluID0gXCIjZTc0YzNjXCI7XG4gICAgU25hcC5mbGF0LnBvbWVncmFuYXRlID0gXCIjYzAzOTJiXCI7XG4gICAgU25hcC5mbGF0LmFtZXRoeXN0ID0gXCIjOWI1OWI2XCI7XG4gICAgU25hcC5mbGF0Lndpc3RlcmlhID0gXCIjOGU0NGFkXCI7XG4gICAgU25hcC5mbGF0LmNsb3VkcyA9IFwiI2VjZjBmMVwiO1xuICAgIFNuYXAuZmxhdC5zaWx2ZXIgPSBcIiNiZGMzYzdcIjtcbiAgICBTbmFwLmZsYXQud2V0YXNwaGFsdCA9IFwiIzM0NDk1ZVwiO1xuICAgIFNuYXAuZmxhdC5taWRuaWdodGJsdWUgPSBcIiMyYzNlNTBcIjtcbiAgICBTbmFwLmZsYXQuY29uY3JldGUgPSBcIiM5NWE1YTZcIjtcbiAgICBTbmFwLmZsYXQuYXNiZXN0b3MgPSBcIiM3ZjhjOGRcIjtcbiAgICAvKlxcXG4gICAgICogU25hcC5pbXBvcnRNVUlDb2xvcnNcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEltcG9ydHMgTWF0ZXJpYWwgVUkgY29sb3VycyBpbnRvIGdsb2JhbCBvYmplY3QuXG4gICAgIHwgU25hcC5pbXBvcnRNVUlDb2xvcnMoKTtcbiAgICAgfCBTbmFwKCkucmVjdCgwLCAwLCAxMCwgMTApLmF0dHIoe2ZpbGw6IGRlZXBwdXJwbGUsIHN0cm9rZTogYW1iZXJbNjAwXX0pO1xuICAgICAjIEZvciBjb2xvdXIgcmVmZXJlbmNlOiA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWF0ZXJpYWx1aS5jb1wiPmh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY288L2E+LlxuICAgIFxcKi9cbiAgICBTbmFwLmltcG9ydE1VSUNvbG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgY29sb3IgaW4gU25hcC5tdWkpIHtcbiAgICAgICAgICAgIGlmIChTbmFwLm11aS5oYXNPd25Qcm9wZXJ0eShjb2xvcikpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dbY29sb3JdID0gU25hcC5tdWlbY29sb3JdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNuYXBcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBzbGlkZSBhcyBNZW51IH0gZnJvbSAncmVhY3QtYnVyZ2VyLW1lbnUnXG5cblxuXG4vKipcbiAqIEV4YW1wbGVDb21wb25lbnQgaXMgYW4gZXhhbXBsZSBjb21wb25lbnQuXG4gKiBJdCB0YWtlcyBhIHByb3BlcnR5LCBgbGFiZWxgLCBhbmRcbiAqIGRpc3BsYXlzIGl0LlxuICogSXQgcmVuZGVycyBhbiBpbnB1dCB3aXRoIHRoZSBwcm9wZXJ0eSBgdmFsdWVgXG4gKiB3aGljaCBpcyBlZGl0YWJsZSBieSB0aGUgdXNlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2QmFyKCkge1xuICByZXR1cm4gKFxuICAgIDxNZW51PlxuICAgICAgPGEgaWQ9XCJob21lXCIgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgaHJlZj1cIi9cIj5Ib21lPC9hPlxuICAgICAgICA8YSBpZD1cImFib3V0XCIgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgaHJlZj1cIi9hYm91dFwiPkFib3V0PC9hPlxuICAgICAgICA8YSBpZD1cImNvbnRhY3RcIiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBocmVmPVwiL2NvbnRhY3RcIj5Db250YWN0PC9hPlxuICAgIDwvTWVudT5cbiAgKTtcbn1cblxuTmF2QmFyLmRlZmF1bHRQcm9wcyA9IHtcbn07XG5cbk5hdkJhci5wcm9wVHlwZXMgPSB7XG4gICAgLyoqXG4gICAgICogVGhlIElEIHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBjb21wb25lbnQgaW4gRGFzaCBjYWxsYmFja3MuXG4gICAgICovXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBEYXNoLWFzc2lnbmVkIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB0byByZXBvcnQgcHJvcGVydHkgY2hhbmdlc1xuICAgICAqIHRvIERhc2gsIHRvIG1ha2UgdGhlbSBhdmFpbGFibGUgZm9yIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBzZXRQcm9wczogUHJvcFR5cGVzLmZ1bmMsXG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydCAqL1xuaW1wb3J0IFNlYXJjaEJhciBmcm9tICcuL2NvbXBvbmVudHMvU2VhcmNoQmFyLnJlYWN0JztcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL0FjY29yZGlvbi5yZWFjdCc7XG5pbXBvcnQgVHJlZW1hcCBmcm9tICcuL2NvbXBvbmVudHMvVHJlZW1hcC5yZWFjdCc7XG5pbXBvcnQgTmF2YmFyIGZyb20gJy4vY29tcG9uZW50cy9OYXZCYXIucmVhY3QnXG5cblxuZXhwb3J0IHtTZWFyY2hCYXIsIEFjY29yZGlvbiwgVHJlZW1hcCwgTmF2YmFyfTtcbiJdLCJzb3VyY2VSb290IjoiIn0=