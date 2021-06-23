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

function NavBar(_ref) {
  var id = _ref.id,
      setProps = _ref.setProps;
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
/*! exports provided: SearchBar, Accordion, Treemap, NavBar */
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
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NavBar", function() { return _components_NavBar_react__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* eslint-disable import/prefer-default-export */






/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL2V2ZS9ldmUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvQnVyZ2VyTWVudS5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9jb21wb25lbnRzL0J1cmdlckljb24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvY29tcG9uZW50cy9Dcm9zc0ljb24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvaGVscGVycy9iYXNlU3R5bGVzLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvZG9tLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvc25hcHN2Z0ltcG9ydGVyLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL2hlbHBlcnMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudUZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvYnViYmxlLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL21lbnVzL2VsYXN0aWMuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvZmFsbERvd24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvcHVzaC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9tZW51cy9wdXNoUm90YXRlLmpzIiwid2VicGFjazovL2RhdGFtZWRfY3VzdG9tX2NvbXBvbmVudHMvLi9ub2RlX21vZHVsZXMvcmVhY3QtYnVyZ2VyLW1lbnUvbGliL21lbnVzL3JldmVhbC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWJ1cmdlci1tZW51L2xpYi9tZW51cy9zY2FsZURvd24uanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc2NhbGVSb3RhdGUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc2xpZGUuanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9yZWFjdC1idXJnZXItbWVudS9saWIvbWVudXMvc3RhY2suanMiLCJ3ZWJwYWNrOi8vZGF0YW1lZF9jdXN0b21fY29tcG9uZW50cy8uL25vZGVfbW9kdWxlcy9zbmFwc3ZnLWNqcy9kaXN0L3NuYXAuc3ZnLWNqcy5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6WyJOYXZCYXIiLCJpZCIsInNldFByb3BzIiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGtCQUFrQixNQUFNO0FBQ3hCO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7QUFDQSxxRkFBcUYsTUFBTTtBQUMzRjtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUMsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELFFBQVE7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBNEIsNENBQTRDLEtBQTBDLEdBQUcsaUNBQWMsRUFBRSxtQ0FBRSxhQUFhLFlBQVksRUFBRTtBQUFBLG9HQUFDLEdBQUcsU0FBYztBQUN4TCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDbGJZOztBQUViO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxTQUFTLG1CQUFPLENBQUMsMEVBQWU7QUFDaEMsU0FBUyxtQkFBTyxDQUFDLDBFQUFlO0FBQ2hDLFdBQVcsbUJBQU8sQ0FBQyw4RUFBaUI7QUFDcEMsVUFBVSxtQkFBTyxDQUFDLDRFQUFnQjtBQUNsQyxRQUFRLG1CQUFPLENBQUMsd0VBQWM7QUFDOUIsY0FBYyxtQkFBTyxDQUFDLG9GQUFvQjtBQUMxQyxhQUFhLG1CQUFPLENBQUMsa0ZBQW1CO0FBQ3hDLGVBQWUsbUJBQU8sQ0FBQyxzRkFBcUI7QUFDNUMsWUFBWSxtQkFBTyxDQUFDLGdGQUFrQjtBQUN0QyxVQUFVLG1CQUFPLENBQUMsNEVBQWdCO0FBQ2xDO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pCYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxtREFBbUQsZ0JBQWdCLHNCQUFzQixPQUFPLDJCQUEyQiwwQkFBMEIseURBQXlELDJCQUEyQixFQUFFLEVBQUUsRUFBRSxlQUFlOztBQUU5UCxpQ0FBaUMsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsMkRBQTJELEVBQUUsRUFBRSx5REFBeUQscUVBQXFFLDZEQUE2RCxvQkFBb0IsR0FBRyxFQUFFOztBQUVsakIsdUNBQXVDLG1CQUFtQiw0QkFBNEIsaURBQWlELGdCQUFnQixrREFBa0QsOERBQThELDBCQUEwQiw0Q0FBNEMsdUJBQXVCLGtCQUFrQixFQUFFLE9BQU8sYUFBYSxnQkFBZ0IsZ0JBQWdCLGVBQWUsMkJBQTJCLG9CQUFvQixFQUFFLEVBQUUsNEJBQTRCLG1CQUFtQixFQUFFLE9BQU8sdUJBQXVCLDRCQUE0QixrQkFBa0IsRUFBRSw4QkFBOEIsRUFBRSxFQUFFOztBQUUvb0Isc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLGlEQUFpRCwwQ0FBMEMsMERBQTBELEVBQUU7O0FBRXZKLDBDQUEwQywrREFBK0QscUdBQXFHLEVBQUUseUVBQXlFLGVBQWUseUVBQXlFLEVBQUUsRUFBRSx1SEFBdUg7O0FBRTVlLGFBQWEsbUJBQU8sQ0FBQyw0Q0FBTzs7QUFFNUI7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsc0RBQVk7O0FBRXJDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDLGFBQWE7QUFDYixXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixlQUFlO0FBQzFDLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsY0FBYztBQUM1QztBQUNBLCtDQUErQyxrQkFBa0I7QUFDakU7QUFDQSxhQUFhO0FBQ2I7QUFDQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBLCtDQUErQyxtQkFBbUI7QUFDbEU7QUFDQSxhQUFhO0FBQ2I7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUMzSWE7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsbURBQW1ELGdCQUFnQixzQkFBc0IsT0FBTywyQkFBMkIsMEJBQTBCLHlEQUF5RCwyQkFBMkIsRUFBRSxFQUFFLEVBQUUsZUFBZTs7QUFFOVAsaUNBQWlDLDJDQUEyQyxnQkFBZ0Isa0JBQWtCLE9BQU8sMkJBQTJCLHdEQUF3RCxnQ0FBZ0MsdURBQXVELDJEQUEyRCxFQUFFLEVBQUUseURBQXlELHFFQUFxRSw2REFBNkQsb0JBQW9CLEdBQUcsRUFBRTs7QUFFbGpCLHVDQUF1QyxtQkFBbUIsNEJBQTRCLGlEQUFpRCxnQkFBZ0Isa0RBQWtELDhEQUE4RCwwQkFBMEIsNENBQTRDLHVCQUF1QixrQkFBa0IsRUFBRSxPQUFPLGFBQWEsZ0JBQWdCLGdCQUFnQixlQUFlLDJCQUEyQixvQkFBb0IsRUFBRSxFQUFFLDRCQUE0QixtQkFBbUIsRUFBRSxPQUFPLHVCQUF1Qiw0QkFBNEIsa0JBQWtCLEVBQUUsOEJBQThCLEVBQUUsRUFBRTs7QUFFL29CLHNDQUFzQyx1Q0FBdUMsa0JBQWtCOztBQUUvRixpREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SiwwQ0FBMEMsK0RBQStELHFHQUFxRyxFQUFFLHlFQUF5RSxlQUFlLHlFQUF5RSxFQUFFLEVBQUUsdUhBQXVIOztBQUU1ZSxhQUFhLG1CQUFPLENBQUMsNENBQU87O0FBRTVCOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHNEQUFZOztBQUVyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdDQUFnQztBQUMzRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxXQUFXLFNBQVMsa0RBQWtELEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ3BJYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDN0RhOztBQUViO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDaEVhOztBQUViO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsbUJBQU8sQ0FBQyxvRUFBYTtBQUNoQyxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLG9DOzs7Ozs7Ozs7Ozs7QUNmYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDBCOzs7Ozs7Ozs7Ozs7QUNSYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxtQ0FBbUMsaUNBQWlDLGVBQWUsZUFBZSxnQkFBZ0Isb0JBQW9CLE1BQU0sMENBQTBDLCtCQUErQixhQUFhLHFCQUFxQixtQ0FBbUMsRUFBRSxFQUFFLGNBQWMsV0FBVyxVQUFVLEVBQUUsVUFBVSxNQUFNLHlDQUF5QyxFQUFFLFVBQVUsa0JBQWtCLEVBQUUsRUFBRSxhQUFhLEVBQUUsMkJBQTJCLDBCQUEwQixZQUFZLEVBQUUsMkNBQTJDLDhCQUE4QixFQUFFLE9BQU8sNkVBQTZFLEVBQUUsR0FBRyxFQUFFOztBQUV0cEIsbURBQW1ELGdCQUFnQixzQkFBc0IsT0FBTywyQkFBMkIsMEJBQTBCLHlEQUF5RCwyQkFBMkIsRUFBRSxFQUFFLEVBQUUsZUFBZTs7QUFFOVAsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLGFBQWEsbUJBQU8sQ0FBQyw0Q0FBTzs7QUFFNUI7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsb0RBQVc7O0FBRW5DOztBQUVBLGlCQUFpQixtQkFBTyxDQUFDLHNEQUFZOztBQUVyQzs7QUFFQSx5QkFBeUIsbUJBQU8sQ0FBQyx3RkFBc0I7O0FBRXZEOztBQUVBLGtCQUFrQixtQkFBTyxDQUFDLDBFQUFlOztBQUV6Qyw0QkFBNEIsbUJBQU8sQ0FBQyw4RkFBeUI7O0FBRTdEOztBQUVBLDJCQUEyQixtQkFBTyxDQUFDLDRGQUF3Qjs7QUFFM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9EO0FBQ3BEOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0NBQW9DO0FBQ3hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsaUJBQWlCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFdBQVc7QUFDWCxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsNEVBQTRFOztBQUU1RTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdCQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxTQUFTLGlDQUFpQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixzREFBc0QsNEJBQTRCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGtDQUFrQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0M7Ozs7Ozs7Ozs7OztBQ2xmYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsOEJBQThCLG1CQUFPLENBQUMsbUdBQTRCOztBQUVsRTs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQywyRUFBZ0I7O0FBRTNDOztBQUVBLG9CQUFvQixtQkFBTyxDQUFDLCtFQUFrQjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7QUFDdkY7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pIYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsOEJBQThCLG1CQUFPLENBQUMsbUdBQTRCOztBQUVsRTs7QUFFQSxtQkFBbUIsbUJBQU8sQ0FBQywyRUFBZ0I7O0FBRTNDOztBQUVBLG9CQUFvQixtQkFBTyxDQUFDLCtFQUFrQjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2pHYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQzdDYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ2hDYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ25DYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0M7Ozs7Ozs7Ozs7OztBQ3ZFYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxzQ0FBc0MsdUNBQXVDLGtCQUFrQjs7QUFFL0YsbUJBQW1CLG1CQUFPLENBQUMsMkVBQWdCOztBQUUzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUNsQ2E7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DOzs7Ozs7Ozs7Ozs7QUNuQ2E7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDZmE7O0FBRWI7QUFDQTtBQUNBLENBQUM7O0FBRUQsc0NBQXNDLHVDQUF1QyxrQkFBa0I7O0FBRS9GLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFnQjs7QUFFM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7QUNyQ0EsYUFBYSxtQkFBTyxDQUFDLHNDQUFLOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0Q0FBNEM7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLEVBQUUsWUFBWSxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxhQUFhO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxzQkFBc0I7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLHdCQUF3QixLQUFLLEtBQUs7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdEQUFnRCwwQkFBMEI7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRixVQUFVO0FBQ3BHO0FBQ0Esa0ZBQWtGLFdBQVc7QUFDN0Y7QUFDQSw0RkFBNEYsV0FBVztBQUN2RztBQUNBO0FBQ0E7QUFDQSw0RkFBNEYsV0FBVztBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLDZFQUE2RTtBQUNwRztBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw0RUFBNEU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFdBQVc7QUFDM0I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixZQUFZO0FBQzVCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQkFBcUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHFDQUFxQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1Isb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Qsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiLDZDQUE2QyxFQUFFO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLCtCQUErQjtBQUM3RCxhQUFhO0FBQ2IsOEJBQThCLDhCQUE4QjtBQUM1RCxhQUFhO0FBQ2IsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxQkFBcUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0Esd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsYUFBYTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsUUFBUTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0SUFBNEksTUFBTSxXQUFXLE9BQU8sWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEdBQUcsU0FBUztBQUNuTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsU0FBUztBQUMvQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsdUJBQXVCO0FBQ3BELGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsa0JBQWtCO0FBQ3pEO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsYUFBYTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxhQUFhO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixrQkFBa0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHVCQUF1QjtBQUMxRCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDJCQUEyQjtBQUMzQztBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGlCQUFpQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixTQUFTO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsc0NBQXNDLFdBQVc7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixhQUFhO0FBQzdCLGdCQUFnQixhQUFhO0FBQzdCLG9CQUFvQixhQUFhO0FBQ2pDLGtCQUFrQixhQUFhO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQiwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qiw2REFBNkQsUUFBUTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELFFBQVE7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxRQUFRO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxnQkFBZ0IseURBQXlEO0FBQ3pFLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHlEQUF5RDtBQUM5RSxzQkFBc0IseURBQXlEO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsV0FBVztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRDtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsa0RBQWtEO0FBQ2xELGtEQUFrRDtBQUNsRDtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCLGtFQUFrRSxRQUFRO0FBQzFFLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyw2Q0FBNkM7QUFDN0M7QUFDQSxrREFBa0Q7O0FBRWxELG1FQUFtRTtBQUNuRTtBQUNBOztBQUVBLHlCQUF5Qjs7QUFFekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLG1CQUFtQjtBQUM3RDtBQUNBLHlCQUF5QiwrQkFBK0I7QUFDeEQseUJBQXlCLCtCQUErQjtBQUN4RCx5QkFBeUIsK0JBQStCO0FBQ3hELHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUIsaUJBQWlCO0FBQ2pCLDRCQUE0QjtBQUM1QixpQkFBaUI7QUFDakIsNEJBQTRCO0FBQzVCLDRCQUE0QjtBQUM1QjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBLHFCQUFxQixNQUFNLHVCQUF1QixNQUFNO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBLGNBQWMseUJBQXlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLEtBQUs7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGVBQWU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxRQUFRO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsUUFBUTtBQUM3QztBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQsZ0RBQWdELFFBQVE7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsRUFBRTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsWUFBWTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYsUUFBUTtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixLQUFLO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLDREQUE0RCxRQUFRO0FBQ3BFO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLCtFQUErRTtBQUN0RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQ0FBaUM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGFBQWE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsSUFBSTtBQUNoRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLEtBQUssa0JBQWtCLEdBQUcsT0FBTyxHQUFHLDhDQUE4QyxNQUFNLG9HQUFvRyxRQUFRO0FBQ2hSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRSxPQUFPO0FBQzNFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxNQUFNO0FBQzNFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRixPQUFPLEVBQUUsUUFBUSx1Q0FBdUMsT0FBTyxFQUFFLFFBQVEsdUNBQXVDLE9BQU8sRUFBRSxRQUFRO0FBQ3ROO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixPQUFPLGtDQUFrQyxPQUFPLGtDQUFrQyxPQUFPO0FBQ3pLO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsT0FBTyxjQUFjLFFBQVEsa0NBQWtDLE9BQU8sY0FBYyxRQUFRLGtDQUFrQyxPQUFPLGNBQWMsUUFBUTtBQUMzTztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxXQUFXO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osUUFBUTtBQUNSO0FBQ0EscUJBQXFCLE1BQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsdURBQXVEO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMscURBQXFEO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQ0FBcUM7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7OztBQ2g5UEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNlLFNBQVNBLE1BQVQsT0FBa0M7QUFBQSxNQUFoQkMsRUFBZ0IsUUFBaEJBLEVBQWdCO0FBQUEsTUFBWkMsUUFBWSxRQUFaQSxRQUFZO0FBRS9DLHNCQUNFLDJEQUFDLHVEQUFELHFCQUNFO0FBQUcsTUFBRSxFQUFDLE1BQU47QUFBYSxhQUFTLEVBQUMsV0FBdkI7QUFBbUMsUUFBSSxFQUFDO0FBQXhDLFlBREYsZUFFSTtBQUFHLE1BQUUsRUFBQyxPQUFOO0FBQWMsYUFBUyxFQUFDLFdBQXhCO0FBQW9DLFFBQUksRUFBQztBQUF6QyxhQUZKLGVBR0k7QUFBRyxNQUFFLEVBQUMsU0FBTjtBQUFnQixhQUFTLEVBQUMsV0FBMUI7QUFBc0MsUUFBSSxFQUFDO0FBQTNDLGVBSEosQ0FERjtBQU9EO0FBRURGLE1BQU0sQ0FBQ0csWUFBUCxHQUFzQixFQUF0QjtBQUdBSCxNQUFNLENBQUNJLFNBQVAsR0FBbUI7QUFDZjtBQUNKO0FBQ0E7QUFDSUgsSUFBRSxFQUFFSSxpREFBUyxDQUFDQyxNQUpDOztBQU1mO0FBQ0o7QUFDQTtBQUNBO0FBQ0lKLFVBQVEsRUFBRUcsaURBQVMsQ0FBQ0U7QUFWTCxDQUFuQixDOzs7Ozs7Ozs7Ozs7QUMzQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IjU1NzZjMGUtbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuLy8g4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQIFxcXFxcbi8vIOKUgiBFdmUgMC41LjQgLSBKYXZhU2NyaXB0IEV2ZW50cyBMaWJyYXJ5ICAgICAgICAgICAgICAgICAgICAgIOKUgiBcXFxcXG4vLyDilJzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKQgXFxcXFxuLy8g4pSCIEF1dGhvciBEbWl0cnkgQmFyYW5vdnNraXkgKGh0dHA6Ly9kbWl0cnkuYmFyYW5vdnNraXkuY29tLykg4pSCIFxcXFxcbi8vIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCBcXFxcXG5cbihmdW5jdGlvbiAoZ2xvYikge1xuICAgIHZhciB2ZXJzaW9uID0gXCIwLjUuNFwiLFxuICAgICAgICBoYXMgPSBcImhhc093blByb3BlcnR5XCIsXG4gICAgICAgIHNlcGFyYXRvciA9IC9bXFwuXFwvXS8sXG4gICAgICAgIGNvbWFzZXBhcmF0b3IgPSAvXFxzKixcXHMqLyxcbiAgICAgICAgd2lsZGNhcmQgPSBcIipcIixcbiAgICAgICAgbnVtc29ydCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgIH0sXG4gICAgICAgIGN1cnJlbnRfZXZlbnQsXG4gICAgICAgIHN0b3AsXG4gICAgICAgIGV2ZW50cyA9IHtuOiB7fX0sXG4gICAgICAgIGZpcnN0RGVmaW5lZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHRoaXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1tpXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbGFzdERlZmluZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKC0taSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1tpXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb2JqdG9zID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXIpIHtcbiAgICAgICAgICAgIHJldHVybiBhciBpbnN0YW5jZW9mIEFycmF5IHx8IG9ianRvcy5jYWxsKGFyKSA9PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH0sXG4gICAgLypcXFxuICAgICAqIGV2ZVxuICAgICBbIG1ldGhvZCBdXG5cbiAgICAgKiBGaXJlcyBldmVudCB3aXRoIGdpdmVuIGBuYW1lYCwgZ2l2ZW4gc2NvcGUgYW5kIG90aGVyIHBhcmFtZXRlcnMuXG5cbiAgICAgLSBuYW1lIChzdHJpbmcpIG5hbWUgb2YgdGhlICpldmVudCosIGRvdCAoYC5gKSBvciBzbGFzaCAoYC9gKSBzZXBhcmF0ZWRcbiAgICAgLSBzY29wZSAob2JqZWN0KSBjb250ZXh0IGZvciB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgLSB2YXJhcmdzICguLi4pIHRoZSByZXN0IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHNlbnQgdG8gZXZlbnQgaGFuZGxlcnNcblxuICAgICA9IChvYmplY3QpIGFycmF5IG9mIHJldHVybmVkIHZhbHVlcyBmcm9tIHRoZSBsaXN0ZW5lcnMuIEFycmF5IGhhcyB0d28gbWV0aG9kcyBgLmZpcnN0RGVmaW5lZCgpYCBhbmQgYC5sYXN0RGVmaW5lZCgpYCB0byBnZXQgZmlyc3Qgb3IgbGFzdCBub3QgYHVuZGVmaW5lZGAgdmFsdWUuXG4gICAgXFwqL1xuICAgICAgICBldmUgPSBmdW5jdGlvbiAobmFtZSwgc2NvcGUpIHtcbiAgICAgICAgICAgIHZhciBvbGRzdG9wID0gc3RvcCxcbiAgICAgICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMgPSBldmUubGlzdGVuZXJzKG5hbWUpLFxuICAgICAgICAgICAgICAgIHogPSAwLFxuICAgICAgICAgICAgICAgIGwsXG4gICAgICAgICAgICAgICAgaW5kZXhlZCA9IFtdLFxuICAgICAgICAgICAgICAgIHF1ZXVlID0ge30sXG4gICAgICAgICAgICAgICAgb3V0ID0gW10sXG4gICAgICAgICAgICAgICAgY2UgPSBjdXJyZW50X2V2ZW50O1xuICAgICAgICAgICAgb3V0LmZpcnN0RGVmaW5lZCA9IGZpcnN0RGVmaW5lZDtcbiAgICAgICAgICAgIG91dC5sYXN0RGVmaW5lZCA9IGxhc3REZWZpbmVkO1xuICAgICAgICAgICAgY3VycmVudF9ldmVudCA9IG5hbWU7XG4gICAgICAgICAgICBzdG9wID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBpaTsgaSsrKSBpZiAoXCJ6SW5kZXhcIiBpbiBsaXN0ZW5lcnNbaV0pIHtcbiAgICAgICAgICAgICAgICBpbmRleGVkLnB1c2gobGlzdGVuZXJzW2ldLnpJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS56SW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlW2xpc3RlbmVyc1tpXS56SW5kZXhdID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4ZWQuc29ydChudW1zb3J0KTtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleGVkW3pdIDwgMCkge1xuICAgICAgICAgICAgICAgIGwgPSBxdWV1ZVtpbmRleGVkW3orK11dO1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKGwuYXBwbHkoc2NvcGUsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICBzdG9wID0gb2xkc3RvcDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIGwgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKFwiekluZGV4XCIgaW4gbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobC56SW5kZXggPT0gaW5kZXhlZFt6XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2gobC5hcHBseShzY29wZSwgYXJncykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCA9IHF1ZXVlW2luZGV4ZWRbel1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgJiYgb3V0LnB1c2gobC5hcHBseShzY29wZSwgYXJncykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKGwpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZVtsLnpJbmRleF0gPSBsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2gobC5hcHBseShzY29wZSwgYXJncykpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdG9wID0gb2xkc3RvcDtcbiAgICAgICAgICAgIGN1cnJlbnRfZXZlbnQgPSBjZTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH07XG4gICAgLy8gVW5kb2N1bWVudGVkLiBEZWJ1ZyBvbmx5LlxuICAgIGV2ZS5fZXZlbnRzID0gZXZlbnRzO1xuICAgIC8qXFxcbiAgICAgKiBldmUubGlzdGVuZXJzXG4gICAgIFsgbWV0aG9kIF1cblxuICAgICAqIEludGVybmFsIG1ldGhvZCB3aGljaCBnaXZlcyB5b3UgYXJyYXkgb2YgYWxsIGV2ZW50IGhhbmRsZXJzIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgYnkgdGhlIGdpdmVuIGBuYW1lYC5cblxuICAgICAtIG5hbWUgKHN0cmluZykgbmFtZSBvZiB0aGUgZXZlbnQsIGRvdCAoYC5gKSBvciBzbGFzaCAoYC9gKSBzZXBhcmF0ZWRcblxuICAgICA9IChhcnJheSkgYXJyYXkgb2YgZXZlbnQgaGFuZGxlcnNcbiAgICBcXCovXG4gICAgZXZlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBuYW1lcyA9IGlzQXJyYXkobmFtZSkgPyBuYW1lIDogbmFtZS5zcGxpdChzZXBhcmF0b3IpLFxuICAgICAgICAgICAgZSA9IGV2ZW50cyxcbiAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICBpdGVtcyxcbiAgICAgICAgICAgIGssXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgaWksXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgamosXG4gICAgICAgICAgICBuZXMsXG4gICAgICAgICAgICBlcyA9IFtlXSxcbiAgICAgICAgICAgIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIG5lcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMCwgamogPSBlcy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgZSA9IGVzW2pdLm47XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBbZVtuYW1lc1tpXV0sIGVbd2lsZGNhcmRdXTtcbiAgICAgICAgICAgICAgICBrID0gMjtcbiAgICAgICAgICAgICAgICB3aGlsZSAoay0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1trXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChpdGVtLmYgfHwgW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXMgPSBuZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBldmUuc2VwYXJhdG9yXG4gICAgIFsgbWV0aG9kIF1cblxuICAgICAqIElmIGZvciBzb21lIHJlYXNvbnMgeW91IGRvbuKAmXQgbGlrZSBkZWZhdWx0IHNlcGFyYXRvcnMgKGAuYCBvciBgL2ApIHlvdSBjYW4gc3BlY2lmeSB5b3Vyc1xuICAgICAqIGhlcmUuIEJlIGF3YXJlIHRoYXQgaWYgeW91IHBhc3MgYSBzdHJpbmcgbG9uZ2VyIHRoYW4gb25lIGNoYXJhY3RlciBpdCB3aWxsIGJlIHRyZWF0ZWQgYXNcbiAgICAgKiBhIGxpc3Qgb2YgY2hhcmFjdGVycy5cblxuICAgICAtIHNlcGFyYXRvciAoc3RyaW5nKSBuZXcgc2VwYXJhdG9yLiBFbXB0eSBzdHJpbmcgcmVzZXRzIHRvIGRlZmF1bHQ6IGAuYCBvciBgL2AuXG4gICAgXFwqL1xuICAgIGV2ZS5zZXBhcmF0b3IgPSBmdW5jdGlvbiAoc2VwKSB7XG4gICAgICAgIGlmIChzZXApIHtcbiAgICAgICAgICAgIHNlcCA9IFN0cihzZXApLnJlcGxhY2UoLyg/PVtcXC5cXF5cXF1cXFtcXC1dKS9nLCBcIlxcXFxcIik7XG4gICAgICAgICAgICBzZXAgPSBcIltcIiArIHNlcCArIFwiXVwiO1xuICAgICAgICAgICAgc2VwYXJhdG9yID0gbmV3IFJlZ0V4cChzZXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VwYXJhdG9yID0gL1tcXC5cXC9dLztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLypcXFxuICAgICAqIGV2ZS5vblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQmluZHMgZ2l2ZW4gZXZlbnQgaGFuZGxlciB3aXRoIGEgZ2l2ZW4gbmFtZS4gWW91IGNhbiB1c2Ugd2lsZGNhcmRzIOKAnGAqYOKAnSBmb3IgdGhlIG5hbWVzOlxuICAgICB8IGV2ZS5vbihcIioudW5kZXIuKlwiLCBmKTtcbiAgICAgfCBldmUoXCJtb3VzZS51bmRlci5mbG9vclwiKTsgLy8gdHJpZ2dlcnMgZlxuICAgICAqIFVzZSBAZXZlIHRvIHRyaWdnZXIgdGhlIGxpc3RlbmVyLlxuICAgICAqKlxuICAgICAtIG5hbWUgKHN0cmluZykgbmFtZSBvZiB0aGUgZXZlbnQsIGRvdCAoYC5gKSBvciBzbGFzaCAoYC9gKSBzZXBhcmF0ZWQsIHdpdGggb3B0aW9uYWwgd2lsZGNhcmRzXG4gICAgIC0gZiAoZnVuY3Rpb24pIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKipcbiAgICAgLSBuYW1lIChhcnJheSkgaWYgeW91IGRvbuKAmXQgd2FudCB0byB1c2Ugc2VwYXJhdG9ycywgeW91IGNhbiB1c2UgYXJyYXkgb2Ygc3RyaW5nc1xuICAgICAtIGYgKGZ1bmN0aW9uKSBldmVudCBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICoqXG4gICAgID0gKGZ1bmN0aW9uKSByZXR1cm5lZCBmdW5jdGlvbiBhY2NlcHRzIGEgc2luZ2xlIG51bWVyaWMgcGFyYW1ldGVyIHRoYXQgcmVwcmVzZW50cyB6LWluZGV4IG9mIHRoZSBoYW5kbGVyLiBJdCBpcyBhbiBvcHRpb25hbCBmZWF0dXJlIGFuZCBvbmx5IHVzZWQgd2hlbiB5b3UgbmVlZCB0byBlbnN1cmUgdGhhdCBzb21lIHN1YnNldCBvZiBoYW5kbGVycyB3aWxsIGJlIGludm9rZWQgaW4gYSBnaXZlbiBvcmRlciwgZGVzcGl0ZSBvZiB0aGUgb3JkZXIgb2YgYXNzaWdubWVudC5cbiAgICAgPiBFeGFtcGxlOlxuICAgICB8IGV2ZS5vbihcIm1vdXNlXCIsIGVhdEl0KSgyKTtcbiAgICAgfCBldmUub24oXCJtb3VzZVwiLCBzY3JlYW0pO1xuICAgICB8IGV2ZS5vbihcIm1vdXNlXCIsIGNhdGNoSXQpKDEpO1xuICAgICAqIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCBgY2F0Y2hJdGAgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYmVmb3JlIGBlYXRJdGAuXG4gICAgICpcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBwdXQgeW91ciBoYW5kbGVyIGJlZm9yZSBub24taW5kZXhlZCBoYW5kbGVycywgc3BlY2lmeSBhIG5lZ2F0aXZlIHZhbHVlLlxuICAgICAqIE5vdGU6IEkgYXNzdW1lIG1vc3Qgb2YgdGhlIHRpbWUgeW91IGRvbuKAmXQgbmVlZCB0byB3b3JyeSBhYm91dCB6LWluZGV4LCBidXQgaXTigJlzIG5pY2UgdG8gaGF2ZSB0aGlzIGZlYXR1cmUg4oCcanVzdCBpbiBjYXNl4oCdLlxuICAgIFxcKi9cbiAgICBldmUub24gPSBmdW5jdGlvbiAobmFtZSwgZikge1xuICAgICAgICBpZiAodHlwZW9mIGYgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hbWVzID0gaXNBcnJheShuYW1lKSA/IGlzQXJyYXkobmFtZVswXSkgPyBuYW1lIDogW25hbWVdIDogU3RyKG5hbWUpLnNwbGl0KGNvbWFzZXBhcmF0b3IpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBuYW1lcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXMgPSBpc0FycmF5KG5hbWUpID8gbmFtZSA6IFN0cihuYW1lKS5zcGxpdChzZXBhcmF0b3IpLFxuICAgICAgICAgICAgICAgICAgICBlID0gZXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICBleGlzdDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBuYW1lcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBlLm47XG4gICAgICAgICAgICAgICAgICAgIGUgPSBlLmhhc093blByb3BlcnR5KG5hbWVzW2ldKSAmJiBlW25hbWVzW2ldXSB8fCAoZVtuYW1lc1tpXV0gPSB7bjoge319KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZS5mID0gZS5mIHx8IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGlpID0gZS5mLmxlbmd0aDsgaSA8IGlpOyBpKyspIGlmIChlLmZbaV0gPT0gZikge1xuICAgICAgICAgICAgICAgICAgICBleGlzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAhZXhpc3QgJiYgZS5mLnB1c2goZik7XG4gICAgICAgICAgICB9KG5hbWVzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh6SW5kZXgpIHtcbiAgICAgICAgICAgIGlmICgrekluZGV4ID09ICt6SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBmLnpJbmRleCA9ICt6SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLmZcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgZnVuY3Rpb24gdGhhdCB3aWxsIGZpcmUgZ2l2ZW4gZXZlbnQgd2l0aCBvcHRpb25hbCBhcmd1bWVudHMuXG4gICAgICogQXJndW1lbnRzIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIHJlc3VsdCBmdW5jdGlvbiB3aWxsIGJlIGFsc29cbiAgICAgKiBjb25jYXRlZCB0byB0aGUgbGlzdCBvZiBmaW5hbCBhcmd1bWVudHMuXG4gICAgIHwgZWwub25jbGljayA9IGV2ZS5mKFwiY2xpY2tcIiwgMSwgMik7XG4gICAgIHwgZXZlLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgfCAgICAgY29uc29sZS5sb2coYSwgYiwgYyk7IC8vIDEsIDIsIFtldmVudCBvYmplY3RdXG4gICAgIHwgfSk7XG4gICAgIC0gZXZlbnQgKHN0cmluZykgZXZlbnQgbmFtZVxuICAgICAtIHZhcmFyZ3MgKOKApikgYW5kIGFueSBvdGhlciBhcmd1bWVudHNcbiAgICAgPSAoZnVuY3Rpb24pIHBvc3NpYmxlIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25cbiAgICBcXCovXG4gICAgZXZlLmYgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXZlLmFwcGx5KG51bGwsIFtldmVudCwgbnVsbF0uY29uY2F0KGF0dHJzKS5jb25jYXQoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLnN0b3BcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIElzIHVzZWQgaW5zaWRlIGFuIGV2ZW50IGhhbmRsZXIgdG8gc3RvcCB0aGUgZXZlbnQsIHByZXZlbnRpbmcgYW55IHN1YnNlcXVlbnQgbGlzdGVuZXJzIGZyb20gZmlyaW5nLlxuICAgIFxcKi9cbiAgICBldmUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RvcCA9IDE7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLm50XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDb3VsZCBiZSB1c2VkIGluc2lkZSBldmVudCBoYW5kbGVyIHRvIGZpZ3VyZSBvdXQgYWN0dWFsIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgICAqKlxuICAgICAtIHN1Ym5hbWUgKHN0cmluZykgI29wdGlvbmFsIHN1Ym5hbWUgb2YgdGhlIGV2ZW50XG4gICAgICoqXG4gICAgID0gKHN0cmluZykgbmFtZSBvZiB0aGUgZXZlbnQsIGlmIGBzdWJuYW1lYCBpcyBub3Qgc3BlY2lmaWVkXG4gICAgICogb3JcbiAgICAgPSAoYm9vbGVhbikgYHRydWVgLCBpZiBjdXJyZW50IGV2ZW504oCZcyBuYW1lIGNvbnRhaW5zIGBzdWJuYW1lYFxuICAgIFxcKi9cbiAgICBldmUubnQgPSBmdW5jdGlvbiAoc3VibmFtZSkge1xuICAgICAgICB2YXIgY3VyID0gaXNBcnJheShjdXJyZW50X2V2ZW50KSA/IGN1cnJlbnRfZXZlbnQuam9pbihcIi5cIikgOiBjdXJyZW50X2V2ZW50O1xuICAgICAgICBpZiAoc3VibmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpcXFxcLnxcXFxcL3xeKVwiICsgc3VibmFtZSArIFwiKD86XFxcXC58XFxcXC98JClcIikudGVzdChjdXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXI7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLm50c1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ291bGQgYmUgdXNlZCBpbnNpZGUgZXZlbnQgaGFuZGxlciB0byBmaWd1cmUgb3V0IGFjdHVhbCBuYW1lIG9mIHRoZSBldmVudC5cbiAgICAgKipcbiAgICAgKipcbiAgICAgPSAoYXJyYXkpIG5hbWVzIG9mIHRoZSBldmVudFxuICAgIFxcKi9cbiAgICBldmUubnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaXNBcnJheShjdXJyZW50X2V2ZW50KSA/IGN1cnJlbnRfZXZlbnQgOiBjdXJyZW50X2V2ZW50LnNwbGl0KHNlcGFyYXRvcik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLm9mZlxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBnaXZlbiBmdW5jdGlvbiBmcm9tIHRoZSBsaXN0IG9mIGV2ZW50IGxpc3RlbmVycyBhc3NpZ25lZCB0byBnaXZlbiBuYW1lLlxuICAgICAqIElmIG5vIGFyZ3VtZW50cyBzcGVjaWZpZWQgYWxsIHRoZSBldmVudHMgd2lsbCBiZSBjbGVhcmVkLlxuICAgICAqKlxuICAgICAtIG5hbWUgKHN0cmluZykgbmFtZSBvZiB0aGUgZXZlbnQsIGRvdCAoYC5gKSBvciBzbGFzaCAoYC9gKSBzZXBhcmF0ZWQsIHdpdGggb3B0aW9uYWwgd2lsZGNhcmRzXG4gICAgIC0gZiAoZnVuY3Rpb24pIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25cbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIGV2ZS51bmJpbmRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFNlZSBAZXZlLm9mZlxuICAgIFxcKi9cbiAgICBldmUub2ZmID0gZXZlLnVuYmluZCA9IGZ1bmN0aW9uIChuYW1lLCBmKSB7XG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgZXZlLl9ldmVudHMgPSBldmVudHMgPSB7bjoge319O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lcyA9IGlzQXJyYXkobmFtZSkgPyBpc0FycmF5KG5hbWVbMF0pID8gbmFtZSA6IFtuYW1lXSA6IFN0cihuYW1lKS5zcGxpdChjb21hc2VwYXJhdG9yKTtcbiAgICAgICAgaWYgKG5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBldmUub2ZmKG5hbWVzW2ldLCBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYW1lcyA9IGlzQXJyYXkobmFtZSkgPyBuYW1lIDogU3RyKG5hbWUpLnNwbGl0KHNlcGFyYXRvcik7XG4gICAgICAgIHZhciBlLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgc3BsaWNlLFxuICAgICAgICAgICAgaSwgaWksIGosIGpqLFxuICAgICAgICAgICAgY3VyID0gW2V2ZW50c10sXG4gICAgICAgICAgICBpbm9kZXMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBuYW1lcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY3VyLmxlbmd0aDsgaiArPSBzcGxpY2UubGVuZ3RoIC0gMikge1xuICAgICAgICAgICAgICAgIHNwbGljZSA9IFtqLCAxXTtcbiAgICAgICAgICAgICAgICBlID0gY3VyW2pdLm47XG4gICAgICAgICAgICAgICAgaWYgKG5hbWVzW2ldICE9IHdpbGRjYXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlW25hbWVzW2ldXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BsaWNlLnB1c2goZVtuYW1lc1tpXV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5vZGVzLnVuc2hpZnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG46IGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gZSkgaWYgKGVbaGFzXShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGxpY2UucHVzaChlW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5vZGVzLnVuc2hpZnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG46IGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZToga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXIuc3BsaWNlLmFwcGx5KGN1ciwgc3BsaWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGN1ci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBlID0gY3VyW2ldO1xuICAgICAgICAgICAgd2hpbGUgKGUubikge1xuICAgICAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gZS5mLmxlbmd0aDsgaiA8IGpqOyBqKyspIGlmIChlLmZbal0gPT0gZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuZi5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAhZS5mLmxlbmd0aCAmJiBkZWxldGUgZS5mO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIGUubikgaWYgKGUubltoYXNdKGtleSkgJiYgZS5uW2tleV0uZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmNzID0gZS5uW2tleV0uZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gZnVuY3MubGVuZ3RoOyBqIDwgamo7IGorKykgaWYgKGZ1bmNzW2pdID09IGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jcy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAhZnVuY3MubGVuZ3RoICYmIGRlbGV0ZSBlLm5ba2V5XS5mO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGUuZjtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gZS5uKSBpZiAoZS5uW2hhc10oa2V5KSAmJiBlLm5ba2V5XS5mKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZS5uW2tleV0uZjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlID0gZS5uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHBydW5lIGlubmVyIG5vZGVzIGluIHBhdGhcbiAgICAgICAgcHJ1bmU6IGZvciAoaSA9IDAsIGlpID0gaW5vZGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGUgPSBpbm9kZXNbaV07XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBlLm5bZS5uYW1lXS5mKSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IGVtcHR5IChoYXMgbGlzdGVuZXJzKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlIHBydW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZS5uW2UubmFtZV0ubikge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBlbXB0eSAoaGFzIGNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlIHBydW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaXMgZW1wdHlcbiAgICAgICAgICAgIGRlbGV0ZSBlLm5bZS5uYW1lXTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLypcXFxuICAgICAqIGV2ZS5vbmNlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBCaW5kcyBnaXZlbiBldmVudCBoYW5kbGVyIHdpdGggYSBnaXZlbiBuYW1lIHRvIG9ubHkgcnVuIG9uY2UgdGhlbiB1bmJpbmQgaXRzZWxmLlxuICAgICB8IGV2ZS5vbmNlKFwibG9naW5cIiwgZik7XG4gICAgIHwgZXZlKFwibG9naW5cIik7IC8vIHRyaWdnZXJzIGZcbiAgICAgfCBldmUoXCJsb2dpblwiKTsgLy8gbm8gbGlzdGVuZXJzXG4gICAgICogVXNlIEBldmUgdG8gdHJpZ2dlciB0aGUgbGlzdGVuZXIuXG4gICAgICoqXG4gICAgIC0gbmFtZSAoc3RyaW5nKSBuYW1lIG9mIHRoZSBldmVudCwgZG90IChgLmApIG9yIHNsYXNoIChgL2ApIHNlcGFyYXRlZCwgd2l0aCBvcHRpb25hbCB3aWxkY2FyZHNcbiAgICAgLSBmIChmdW5jdGlvbikgZXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICAgICAqKlxuICAgICA9IChmdW5jdGlvbikgc2FtZSByZXR1cm4gZnVuY3Rpb24gYXMgQGV2ZS5vblxuICAgIFxcKi9cbiAgICBldmUub25jZSA9IGZ1bmN0aW9uIChuYW1lLCBmKSB7XG4gICAgICAgIHZhciBmMiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV2ZS5vZmYobmFtZSwgZjIpO1xuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZS5vbihuYW1lLCBmMik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogZXZlLnZlcnNpb25cbiAgICAgWyBwcm9wZXJ0eSAoc3RyaW5nKSBdXG4gICAgICoqXG4gICAgICogQ3VycmVudCB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5LlxuICAgIFxcKi9cbiAgICBldmUudmVyc2lvbiA9IHZlcnNpb247XG4gICAgZXZlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJZb3UgYXJlIHJ1bm5pbmcgRXZlIFwiICsgdmVyc2lvbjtcbiAgICB9O1xuICAgIGdsb2IuZXZlID0gZXZlO1xuICAgIHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyA/IG1vZHVsZS5leHBvcnRzID0gZXZlIDogdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoXCJldmVcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGV2ZTsgfSkgOiBnbG9iLmV2ZSA9IGV2ZTtcbn0pKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcbiAgc2xpZGU6IHJlcXVpcmUoJy4vbWVudXMvc2xpZGUnKSxcbiAgc3RhY2s6IHJlcXVpcmUoJy4vbWVudXMvc3RhY2snKSxcbiAgZWxhc3RpYzogcmVxdWlyZSgnLi9tZW51cy9lbGFzdGljJyksXG4gIGJ1YmJsZTogcmVxdWlyZSgnLi9tZW51cy9idWJibGUnKSxcbiAgcHVzaDogcmVxdWlyZSgnLi9tZW51cy9wdXNoJyksXG4gIHB1c2hSb3RhdGU6IHJlcXVpcmUoJy4vbWVudXMvcHVzaFJvdGF0ZScpLFxuICBzY2FsZURvd246IHJlcXVpcmUoJy4vbWVudXMvc2NhbGVEb3duJyksXG4gIHNjYWxlUm90YXRlOiByZXF1aXJlKCcuL21lbnVzL3NjYWxlUm90YXRlJyksXG4gIGZhbGxEb3duOiByZXF1aXJlKCcuL21lbnVzL2ZhbGxEb3duJyksXG4gIHJldmVhbDogcmVxdWlyZSgnLi9tZW51cy9yZXZlYWwnKVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94MykgeyB2YXIgX2FnYWluID0gdHJ1ZTsgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7IHZhciBvYmplY3QgPSBfeCwgcHJvcGVydHkgPSBfeDIsIHJlY2VpdmVyID0gX3gzOyBfYWdhaW4gPSBmYWxzZTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IF94ID0gcGFyZW50OyBfeDIgPSBwcm9wZXJ0eTsgX3gzID0gcmVjZWl2ZXI7IF9hZ2FpbiA9IHRydWU7IGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7IGNvbnRpbnVlIF9mdW5jdGlvbjsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH0gfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxudmFyIEJ1cmdlckljb24gPSAoZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzKEJ1cmdlckljb24sIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIEJ1cmdlckljb24ocHJvcHMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQnVyZ2VySWNvbik7XG5cbiAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihCdXJnZXJJY29uLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcywgcHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBob3ZlcjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJ1cmdlckljb24sIFt7XG4gICAga2V5OiAnZ2V0TGluZVN0eWxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TGluZVN0eWxlKGluZGV4KSB7XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgaGVpZ2h0OiAnMjAlJyxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIHRvcDogMjAgKiAoaW5kZXggKiAyKSArICclJyxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5zdGF0ZS5ob3ZlciA/IDAuNiA6IDFcbiAgICAgIH0sIHRoaXMuc3RhdGUuaG92ZXIgJiYgdGhpcy5wcm9wcy5zdHlsZXMuYm1CdXJnZXJCYXJzSG92ZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbmRlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBpY29uID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGJ1dHRvblN0eWxlID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICBmb250U2l6ZTogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLmN1c3RvbUljb24pIHtcbiAgICAgICAgdmFyIGV4dHJhUHJvcHMgPSB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWljb24gJyArICh0aGlzLnByb3BzLmN1c3RvbUljb24ucHJvcHMuY2xhc3NOYW1lIHx8ICcnKSkudHJpbSgpLFxuICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH0sIHRoaXMucHJvcHMuc3R5bGVzLmJtSWNvbilcbiAgICAgICAgfTtcbiAgICAgICAgaWNvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jdXN0b21JY29uLCBleHRyYVByb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGljb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBbMCwgMSwgMl0ubWFwKGZ1bmN0aW9uIChiYXIpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAga2V5OiBiYXIsXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1idXJnZXItYmFycyAnICsgX3RoaXMucHJvcHMuYmFyQ2xhc3NOYW1lICsgJyAnICsgKF90aGlzLnN0YXRlLmhvdmVyID8gJ2JtLWJ1cmdlci1iYXJzLWhvdmVyJyA6ICcnKSkudHJpbSgpLFxuICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIF90aGlzLmdldExpbmVTdHlsZShiYXIpLCBfdGhpcy5wcm9wcy5zdHlsZXMuYm1CdXJnZXJCYXJzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1idXJnZXItYnV0dG9uICcgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7IHpJbmRleDogMTAwMCB9LCB0aGlzLnByb3BzLnN0eWxlcy5ibUJ1cmdlckJ1dHRvbilcbiAgICAgICAgfSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdyZWFjdC1idXJnZXItbWVudS1idG4nLFxuICAgICAgICAgICAgb25DbGljazogdGhpcy5wcm9wcy5vbkNsaWNrLFxuICAgICAgICAgICAgb25Nb3VzZU92ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2V0U3RhdGUoeyBob3ZlcjogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgaWYgKF90aGlzLnByb3BzLm9uSWNvbkhvdmVyQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcHMub25JY29uSG92ZXJDaGFuZ2UoeyBpc01vdXNlSW46IHRydWUgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk1vdXNlT3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKHsgaG92ZXI6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvcHMub25JY29uSG92ZXJDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcm9wcy5vbkljb25Ib3ZlckNoYW5nZSh7IGlzTW91c2VJbjogZmFsc2UgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHlsZTogYnV0dG9uU3R5bGVcbiAgICAgICAgICB9LFxuICAgICAgICAgICdPcGVuIE1lbnUnXG4gICAgICAgICksXG4gICAgICAgIGljb25cbiAgICAgICk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJ1cmdlckljb247XG59KShfcmVhY3QuQ29tcG9uZW50KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQnVyZ2VySWNvbjtcblxuQnVyZ2VySWNvbi5wcm9wVHlwZXMgPSB7XG4gIGJhckNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gIGN1c3RvbUljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZWxlbWVudCxcbiAgc3R5bGVzOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9iamVjdFxufTtcblxuQnVyZ2VySWNvbi5kZWZhdWx0UHJvcHMgPSB7XG4gIGJhckNsYXNzTmFtZTogJycsXG4gIGNsYXNzTmFtZTogJycsXG4gIHN0eWxlczoge31cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHsgdmFyIF9hZ2FpbiA9IHRydWU7IF9mdW5jdGlvbjogd2hpbGUgKF9hZ2FpbikgeyB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MzsgX2FnYWluID0gZmFsc2U7IGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyBfeCA9IHBhcmVudDsgX3gyID0gcHJvcGVydHk7IF94MyA9IHJlY2VpdmVyOyBfYWdhaW4gPSB0cnVlOyBkZXNjID0gcGFyZW50ID0gdW5kZWZpbmVkOyBjb250aW51ZSBfZnVuY3Rpb247IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBfcHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb3BUeXBlcyk7XG5cbnZhciBDcm9zc0ljb24gPSAoZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzKENyb3NzSWNvbiwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gQ3Jvc3NJY29uKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDcm9zc0ljb24pO1xuXG4gICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ3Jvc3NJY29uLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ3Jvc3NJY29uLCBbe1xuICAgIGtleTogJ2dldENyb3NzU3R5bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDcm9zc1N0eWxlKHR5cGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgaGVpZ2h0OiAxNCxcbiAgICAgICAgdHJhbnNmb3JtOiB0eXBlID09PSAnYmVmb3JlJyA/ICdyb3RhdGUoNDVkZWcpJyA6ICdyb3RhdGUoLTQ1ZGVnKSdcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGljb247XG4gICAgICB2YXIgYnV0dG9uV3JhcHBlclN0eWxlID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgd2lkdGg6IDI0LFxuICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICByaWdodDogOCxcbiAgICAgICAgdG9wOiA4XG4gICAgICB9O1xuICAgICAgdmFyIGJ1dHRvblN0eWxlID0ge1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICBmb250U2l6ZTogMCxcbiAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLmN1c3RvbUljb24pIHtcbiAgICAgICAgdmFyIGV4dHJhUHJvcHMgPSB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLWNyb3NzICcgKyAodGhpcy5wcm9wcy5jdXN0b21JY29uLnByb3BzLmNsYXNzTmFtZSB8fCAnJykpLnRyaW0oKSxcbiAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoeyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9LCB0aGlzLnByb3BzLnN0eWxlcy5ibUNyb3NzKVxuICAgICAgICB9O1xuICAgICAgICBpY29uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNsb25lRWxlbWVudCh0aGlzLnByb3BzLmN1c3RvbUljb24sIGV4dHJhUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWNvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICB7IHN0eWxlOiB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICc2cHgnLCByaWdodDogJzE0cHgnIH0gfSxcbiAgICAgICAgICBbJ2JlZm9yZScsICdhZnRlciddLm1hcChmdW5jdGlvbiAodHlwZSwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICBrZXk6IGksXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1jcm9zcyAnICsgX3RoaXMucHJvcHMuY3Jvc3NDbGFzc05hbWUpLnRyaW0oKSxcbiAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBfdGhpcy5nZXRDcm9zc1N0eWxlKHR5cGUpLCBfdGhpcy5wcm9wcy5zdHlsZXMuYm1Dcm9zcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICgnYm0tY3Jvc3MtYnV0dG9uICcgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7fSwgYnV0dG9uV3JhcHBlclN0eWxlLCB0aGlzLnByb3BzLnN0eWxlcy5ibUNyb3NzQnV0dG9uKVxuICAgICAgICB9LFxuICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3JlYWN0LWJ1cmdlci1jcm9zcy1idG4nLFxuICAgICAgICAgICAgb25DbGljazogdGhpcy5wcm9wcy5vbkNsaWNrLFxuICAgICAgICAgICAgc3R5bGU6IGJ1dHRvblN0eWxlLFxuICAgICAgICAgICAgdGFiSW5kZXg6IHRoaXMucHJvcHMuaXNPcGVuID8gMCA6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnQ2xvc2UgTWVudSdcbiAgICAgICAgKSxcbiAgICAgICAgaWNvblxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ3Jvc3NJY29uO1xufSkoX3JlYWN0LkNvbXBvbmVudCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IENyb3NzSWNvbjtcblxuQ3Jvc3NJY29uLnByb3BUeXBlcyA9IHtcbiAgY3Jvc3NDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICBjdXN0b21JY29uOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmVsZW1lbnQsXG4gIGlzT3BlbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICBzdHlsZXM6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub2JqZWN0XG59O1xuXG5Dcm9zc0ljb24uZGVmYXVsdFByb3BzID0ge1xuICBjcm9zc0NsYXNzTmFtZTogJycsXG4gIGNsYXNzTmFtZTogJycsXG4gIHN0eWxlczoge30sXG4gIGlzT3BlbjogZmFsc2Vcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIHN0eWxlcyA9IHtcbiAgb3ZlcmxheTogZnVuY3Rpb24gb3ZlcmxheShpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBiYWNrZ3JvdW5kOiAncmdiYSgwLCAwLCAwLCAwLjMpJyxcbiAgICAgIG9wYWNpdHk6IGlzT3BlbiA/IDEgOiAwLFxuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdvcGFjaXR5IDAuM3MnIDogJ29wYWNpdHkgMC4zcywgdHJhbnNmb3JtIDBzIDAuM3MnXG4gICAgfTtcbiAgfSxcblxuICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICByaWdodDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgekluZGV4OiAxMTAwLFxuICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgfTtcbiAgfSxcblxuICBtZW51OiBmdW5jdGlvbiBtZW51KCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgb3ZlcmZsb3c6ICdhdXRvJ1xuICAgIH07XG4gIH0sXG5cbiAgaXRlbUxpc3Q6IGZ1bmN0aW9uIGl0ZW1MaXN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgIH07XG4gIH0sXG5cbiAgaXRlbTogZnVuY3Rpb24gaXRlbSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0eWxlcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmZvY3VzT25GaXJzdE1lbnVJdGVtID0gZm9jdXNPbkZpcnN0TWVudUl0ZW07XG5leHBvcnRzLmZvY3VzT25MYXN0TWVudUl0ZW0gPSBmb2N1c09uTGFzdE1lbnVJdGVtO1xuZXhwb3J0cy5mb2N1c09uQ3Jvc3NCdXR0b24gPSBmb2N1c09uQ3Jvc3NCdXR0b247XG5leHBvcnRzLmZvY3VzT25NZW51QnV0dG9uID0gZm9jdXNPbk1lbnVCdXR0b247XG5leHBvcnRzLmZvY3VzT25NZW51SXRlbSA9IGZvY3VzT25NZW51SXRlbTtcbmV4cG9ydHMuZm9jdXNPbk5leHRNZW51SXRlbSA9IGZvY3VzT25OZXh0TWVudUl0ZW07XG5leHBvcnRzLmZvY3VzT25QcmV2aW91c01lbnVJdGVtID0gZm9jdXNPblByZXZpb3VzTWVudUl0ZW07XG5cbmZ1bmN0aW9uIGZvY3VzT25GaXJzdE1lbnVJdGVtKCkge1xuICB2YXIgZmlyc3RJdGVtID0gQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdibS1pdGVtJykpLnNoaWZ0KCk7XG4gIGlmIChmaXJzdEl0ZW0pIHtcbiAgICBmaXJzdEl0ZW0uZm9jdXMoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb2N1c09uTGFzdE1lbnVJdGVtKCkge1xuICB2YXIgbGFzdEl0ZW0gPSBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JtLWl0ZW0nKSkucG9wKCk7XG4gIGlmIChsYXN0SXRlbSkge1xuICAgIGxhc3RJdGVtLmZvY3VzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9jdXNPbkNyb3NzQnV0dG9uKCkge1xuICB2YXIgY3Jvc3NCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVhY3QtYnVyZ2VyLWNyb3NzLWJ0bicpO1xuICBpZiAoY3Jvc3NCdXR0b24pIHtcbiAgICBjcm9zc0J1dHRvbi5mb2N1cygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvY3VzT25NZW51QnV0dG9uKCkge1xuICB2YXIgbWVudUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZWFjdC1idXJnZXItbWVudS1idG4nKTtcbiAgaWYgKG1lbnVCdXR0b24pIHtcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9jdXNPbk1lbnVJdGVtKHNpYmxpbmdUeXBlKSB7XG4gIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsYXNzTmFtZS5pbmNsdWRlcygnYm0taXRlbScpKSB7XG4gICAgdmFyIHNpYmxpbmcgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50W3NpYmxpbmdUeXBlXTtcbiAgICBpZiAoc2libGluZykge1xuICAgICAgc2libGluZy5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c09uQ3Jvc3NCdXR0b24oKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHNpYmxpbmdUeXBlID09PSAncHJldmlvdXNFbGVtZW50U2libGluZycpIHtcbiAgICAgIGZvY3VzT25MYXN0TWVudUl0ZW0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9jdXNPbkZpcnN0TWVudUl0ZW0oKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9jdXNPbk5leHRNZW51SXRlbSgpIHtcbiAgZm9jdXNPbk1lbnVJdGVtKCduZXh0RWxlbWVudFNpYmxpbmcnKTtcbn1cblxuZnVuY3Rpb24gZm9jdXNPblByZXZpb3VzTWVudUl0ZW0oKSB7XG4gIGZvY3VzT25NZW51SXRlbSgncHJldmlvdXNFbGVtZW50U2libGluZycpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIFNuYXAgPSB1bmRlZmluZWQ7XG4gIHRyeSB7XG4gICAgU25hcCA9IHJlcXVpcmUoJ3NuYXBzdmctY2pzJyk7XG4gIH0gZmluYWxseSB7XG4gICAgcmV0dXJuIFNuYXA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIHB4VG9OdW0gPSBmdW5jdGlvbiBweFRvTnVtKHZhbCkge1xuICByZXR1cm4gcGFyc2VJbnQodmFsLnNsaWNlKDAsIC0yKSwgMTApO1xufTtcbmV4cG9ydHMucHhUb051bSA9IHB4VG9OdW07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbJ3JldHVybiddKSBfaVsncmV0dXJuJ10oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZScpOyB9IH07IH0pKCk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX3Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMnKTtcblxudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcblxudmFyIF9oZWxwZXJzQmFzZVN0eWxlcyA9IHJlcXVpcmUoJy4vaGVscGVycy9iYXNlU3R5bGVzJyk7XG5cbnZhciBfaGVscGVyc0Jhc2VTdHlsZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Jhc2VTdHlsZXMpO1xuXG52YXIgX2hlbHBlcnNEb20gPSByZXF1aXJlKCcuL2hlbHBlcnMvZG9tJyk7XG5cbnZhciBfY29tcG9uZW50c0J1cmdlckljb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQnVyZ2VySWNvbicpO1xuXG52YXIgX2NvbXBvbmVudHNCdXJnZXJJY29uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvbmVudHNCdXJnZXJJY29uKTtcblxudmFyIF9jb21wb25lbnRzQ3Jvc3NJY29uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0Nyb3NzSWNvbicpO1xuXG52YXIgX2NvbXBvbmVudHNDcm9zc0ljb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9uZW50c0Nyb3NzSWNvbik7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChzdHlsZXMpIHtcbiAgaWYgKCFzdHlsZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN0eWxlcyBzdXBwbGllZCcpO1xuICB9XG5cbiAgdmFyIEFSUk9XX0RPV04gPSAnQXJyb3dEb3duJztcbiAgdmFyIEFSUk9XX1VQID0gJ0Fycm93VXAnO1xuICB2YXIgRVNDQVBFID0gJ0VzY2FwZSc7XG4gIHZhciBTUEFDRSA9ICcgJztcbiAgdmFyIEhPTUUgPSAnSG9tZSc7XG4gIHZhciBFTkQgPSAnRW5kJztcblxuICBmdW5jdGlvbiB1c2VQcmV2aW91cyh2YWx1ZSkge1xuICAgIHZhciByZWYgPSBfcmVhY3QyWydkZWZhdWx0J10udXNlUmVmKHZhbHVlKTtcbiAgICBfcmVhY3QyWydkZWZhdWx0J10udXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlZi5jdXJyZW50ID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlZi5jdXJyZW50O1xuICB9XG5cbiAgdmFyIE1lbnUgPSBmdW5jdGlvbiBNZW51KHByb3BzKSB7XG4gICAgdmFyIF9SZWFjdCR1c2VTdGF0ZSA9IF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICB2YXIgX1JlYWN0JHVzZVN0YXRlMiA9IF9zbGljZWRUb0FycmF5KF9SZWFjdCR1c2VTdGF0ZSwgMik7XG5cbiAgICB2YXIgaXNPcGVuID0gX1JlYWN0JHVzZVN0YXRlMlswXTtcbiAgICB2YXIgc2V0SXNPcGVuID0gX1JlYWN0JHVzZVN0YXRlMlsxXTtcblxuICAgIHZhciB0aW1lb3V0SWQgPSBfcmVhY3QyWydkZWZhdWx0J10udXNlUmVmKCk7XG4gICAgdmFyIHRvZ2dsZU9wdGlvbnMgPSBfcmVhY3QyWydkZWZhdWx0J10udXNlUmVmKHt9KTtcbiAgICB2YXIgcHJldklzT3BlblByb3AgPSB1c2VQcmV2aW91cyhwcm9wcy5pc09wZW4pO1xuXG4gICAgX3JlYWN0MlsnZGVmYXVsdCddLnVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocHJvcHMuaXNPcGVuKSB7XG4gICAgICAgIHRvZ2dsZU1lbnUoeyBpc09wZW46IHRydWUsIG5vU3RhdGVDaGFuZ2U6IHRydWUgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBhcHBseVdyYXBwZXJTdHlsZXMoZmFsc2UpO1xuICAgICAgICBjbGVhckN1cnJlbnRUaW1lb3V0KCk7XG4gICAgICB9O1xuICAgIH0sIFtdKTtcblxuICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS51c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdhc1RvZ2dsZWQgPSB0eXBlb2YgcHJvcHMuaXNPcGVuICE9PSAndW5kZWZpbmVkJyAmJiBwcm9wcy5pc09wZW4gIT09IGlzT3BlbiAmJiBwcm9wcy5pc09wZW4gIT09IHByZXZJc09wZW5Qcm9wO1xuXG4gICAgICBpZiAod2FzVG9nZ2xlZCkge1xuICAgICAgICB0b2dnbGVNZW51KCk7XG4gICAgICAgIC8vIFRvZ2dsaW5nIGNoYW5nZXMgU1ZHIGFuaW1hdGlvbiByZXF1aXJlbWVudHMsIHNvIGRlZmVyIHRoZXNlIHVudGlsIG5leHQgdXBkYXRlXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0eWxlcy5zdmcpIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbW9ycGhTaGFwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibS1tb3JwaC1zaGFwZScpO1xuICAgICAgICAgIHZhciBwYXRoID0gc3R5bGVzLnN2Zy5saWIobW9ycGhTaGFwZSkuc2VsZWN0KCdwYXRoJyk7XG5cbiAgICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICAvLyBBbmltYXRlIFNWRyBwYXRoXG4gICAgICAgICAgICBzdHlsZXMuc3ZnLmFuaW1hdGUocGF0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHBhdGggKHRpbWVvdXQgZW5zdXJlcyBhbmltYXRpb24gaGFwcGVucyBvZmYgc2NyZWVuKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHBhdGguYXR0cignZCcsIHN0eWxlcy5zdmcucGF0aEluaXRpYWwpO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBfcmVhY3QyWydkZWZhdWx0J10udXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdG9nZ2xlT3B0aW9ucyRjdXJyZW50ID0gdG9nZ2xlT3B0aW9ucy5jdXJyZW50O1xuICAgICAgdmFyIG5vU3RhdGVDaGFuZ2UgPSBfdG9nZ2xlT3B0aW9ucyRjdXJyZW50Lm5vU3RhdGVDaGFuZ2U7XG4gICAgICB2YXIgZm9jdXNPbkxhc3RJdGVtID0gX3RvZ2dsZU9wdGlvbnMkY3VycmVudC5mb2N1c09uTGFzdEl0ZW07XG5cbiAgICAgIGlmICghbm9TdGF0ZUNoYW5nZSkge1xuICAgICAgICBwcm9wcy5vblN0YXRlQ2hhbmdlKHsgaXNPcGVuOiBpc09wZW4gfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJvcHMuZGlzYWJsZUF1dG9Gb2N1cykge1xuICAgICAgICAvLyBGb3IgYWNjZXNzaWJpbGl0eSByZWFzb25zLCBlbnN1cmVzIHRoYXQgd2hlbiB3ZSB0b2dnbGUgb3BlbixcbiAgICAgICAgLy8gd2UgZm9jdXMgdGhlIGZpcnN0IG9yIGxhc3QgbWVudSBpdGVtIGFjY29yZGluZyB0byBnaXZlbiBwYXJhbWV0ZXJcbiAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgIGZvY3VzT25MYXN0SXRlbSA/ICgwLCBfaGVscGVyc0RvbS5mb2N1c09uTGFzdE1lbnVJdGVtKSgpIDogKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25GaXJzdE1lbnVJdGVtKSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5ibHVyKCk7IC8vIE5lZWRlZCBmb3IgSUVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGltZW91dCBlbnN1cmVzIHdyYXBwZXJzIGFyZSBjbGVhcmVkIGFmdGVyIGFuaW1hdGlvbiBmaW5pc2hlc1xuICAgICAgY2xlYXJDdXJyZW50VGltZW91dCgpO1xuICAgICAgdGltZW91dElkLmN1cnJlbnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZW91dElkLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICAgIGFwcGx5V3JhcHBlclN0eWxlcyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCk7XG5cbiAgICAgIC8vIEJpbmQga2V5ZG93biBoYW5kbGVycyAob3IgY3VzdG9tIGZ1bmN0aW9uIGlmIHN1cHBsaWVkKVxuICAgICAgdmFyIGRlZmF1bHRPbktleURvd24gPSBpc09wZW4gPyBvbktleURvd25PcGVuIDogb25LZXlEb3duQ2xvc2VkO1xuICAgICAgdmFyIG9uS2V5RG93biA9IHByb3BzLmN1c3RvbU9uS2V5RG93biB8fCBkZWZhdWx0T25LZXlEb3duO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24pO1xuICAgICAgfTtcbiAgICB9LCBbaXNPcGVuXSk7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICAgICAgdG9nZ2xlT3B0aW9ucy5jdXJyZW50ID0gb3B0aW9ucztcblxuICAgICAgYXBwbHlXcmFwcGVyU3R5bGVzKCk7XG5cbiAgICAgIC8vIEVuc3VyZXMgd3JhcHBlciBzdHlsZXMgYXJlIGFwcGxpZWQgYmVmb3JlIHRoZSBtZW51IGlzIHRvZ2dsZWRcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZXRJc09wZW4oZnVuY3Rpb24gKG9wZW4pIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIG9wdGlvbnMuaXNPcGVuICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaXNPcGVuIDogIW9wZW47XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcHMub25PcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb3BzLm9uT3BlbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9nZ2xlTWVudSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb3BzLm9uQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZ2dsZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHlsZShzdHlsZSwgaW5kZXgpIHtcbiAgICAgIHZhciB3aWR0aCA9IHByb3BzLndpZHRoO1xuICAgICAgdmFyIHJpZ2h0ID0gcHJvcHMucmlnaHQ7XG5cbiAgICAgIHZhciBmb3JtYXR0ZWRXaWR0aCA9IHR5cGVvZiB3aWR0aCAhPT0gJ3N0cmluZycgPyB3aWR0aCArICdweCcgOiB3aWR0aDtcbiAgICAgIHJldHVybiBzdHlsZShpc09wZW4sIGZvcm1hdHRlZFdpZHRoLCByaWdodCwgaW5kZXgpO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkcyBzdHlsZXMgaW5jcmVtZW50YWxseSBmb3IgYSBnaXZlbiBlbGVtZW50XG4gICAgZnVuY3Rpb24gZ2V0U3R5bGVzKGVsLCBpbmRleCwgaW5saW5lKSB7XG4gICAgICB2YXIgcHJvcE5hbWUgPSAnYm0nICsgZWwucmVwbGFjZShlbC5jaGFyQXQoMCksIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpKTtcblxuICAgICAgLy8gU2V0IGJhc2Ugc3R5bGVzXG4gICAgICB2YXIgb3V0cHV0ID0gX2hlbHBlcnNCYXNlU3R5bGVzMlsnZGVmYXVsdCddW2VsXSA/IGdldFN0eWxlKF9oZWxwZXJzQmFzZVN0eWxlczJbJ2RlZmF1bHQnXVtlbF0pIDoge307XG5cbiAgICAgIC8vIEFkZCBhbmltYXRpb24tc3BlY2lmaWMgc3R5bGVzXG4gICAgICBpZiAoc3R5bGVzW2VsXSkge1xuICAgICAgICBvdXRwdXQgPSBfZXh0ZW5kcyh7fSwgb3V0cHV0LCBnZXRTdHlsZShzdHlsZXNbZWxdLCBpbmRleCArIDEpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGN1c3RvbSBzdHlsZXNcbiAgICAgIGlmIChwcm9wcy5zdHlsZXNbcHJvcE5hbWVdKSB7XG4gICAgICAgIG91dHB1dCA9IF9leHRlbmRzKHt9LCBvdXRwdXQsIHByb3BzLnN0eWxlc1twcm9wTmFtZV0pO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgZWxlbWVudCBpbmxpbmUgc3R5bGVzXG4gICAgICBpZiAoaW5saW5lKSB7XG4gICAgICAgIG91dHB1dCA9IF9leHRlbmRzKHt9LCBvdXRwdXQsIGlubGluZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSB0cmFuc2l0aW9uIGlmIHJlcXVpcmVkXG4gICAgICAvLyAodXNlZnVsIGlmIHJlbmRlcmluZyBvcGVuIGluaXRpYWxseSlcbiAgICAgIGlmIChwcm9wcy5ub1RyYW5zaXRpb24pIHtcbiAgICAgICAgZGVsZXRlIG91dHB1dC50cmFuc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8vIFNldHMgb3IgdW5zZXRzIHN0eWxlcyBvbiBET00gZWxlbWVudHMgb3V0c2lkZSB0aGUgbWVudSBjb21wb25lbnRcbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgY29ycmVjdCBwYWdlIGludGVyYWN0aW9uIHdpdGggc29tZSBvZiB0aGUgbWVudXNcbiAgICAvLyBUaHJvd3MgYW5kIHJldHVybnMgaWYgdGhlIHJlcXVpcmVkIGV4dGVybmFsIGVsZW1lbnRzIGRvbid0IGV4aXN0LFxuICAgIC8vIHdoaWNoIG1lYW5zIGFueSBleHRlcm5hbCBwYWdlIGFuaW1hdGlvbnMgd29uJ3QgYmUgYXBwbGllZFxuICAgIGZ1bmN0aW9uIGhhbmRsZUV4dGVybmFsV3JhcHBlcihpZCwgd3JhcHBlclN0eWxlcywgc2V0KSB7XG4gICAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgaWYgKCF3cmFwcGVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFbGVtZW50IHdpdGggSUQgJ1wiICsgaWQgKyBcIicgbm90IGZvdW5kXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBidWlsdFN0eWxlcyA9IGdldFN0eWxlKHdyYXBwZXJTdHlsZXMpO1xuXG4gICAgICBmb3IgKHZhciBwcm9wIGluIGJ1aWx0U3R5bGVzKSB7XG4gICAgICAgIGlmIChidWlsdFN0eWxlcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHdyYXBwZXIuc3R5bGVbcHJvcF0gPSBzZXQgPyBidWlsdFN0eWxlc1twcm9wXSA6ICcnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXZlbnQgYW55IGhvcml6b250YWwgc2Nyb2xsXG4gICAgICAvLyBPbmx5IHNldCBvdmVyZmxvdy14IGFzIGFuIGlubGluZSBzdHlsZSBpZiBodG1sQ2xhc3NOYW1lIG9yXG4gICAgICAvLyBib2R5Q2xhc3NOYW1lIGlzIG5vdCBwYXNzZWQgaW4uIE90aGVyd2lzZSwgaXQgaXMgdXAgdG8gdGhlIGNhbGxlciB0b1xuICAgICAgLy8gZGVjaWRlIGlmIHRoZXkgd2FudCB0byBzZXQgdGhlIG92ZXJmbG93IHN0eWxlIGluIENTUyB1c2luZyB0aGUgY3VzdG9tXG4gICAgICAvLyBjbGFzcyBuYW1lc1xuICAgICAgdmFyIGFwcGx5T3ZlcmZsb3cgPSBmdW5jdGlvbiBhcHBseU92ZXJmbG93KGVsKSB7XG4gICAgICAgIHJldHVybiBlbC5zdHlsZVsnb3ZlcmZsb3cteCddID0gc2V0ID8gJ2hpZGRlbicgOiAnJztcbiAgICAgIH07XG4gICAgICBpZiAoIXByb3BzLmh0bWxDbGFzc05hbWUpIHtcbiAgICAgICAgYXBwbHlPdmVyZmxvdyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykpO1xuICAgICAgfVxuICAgICAgaWYgKCFwcm9wcy5ib2R5Q2xhc3NOYW1lKSB7XG4gICAgICAgIGFwcGx5T3ZlcmZsb3coZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcHBsaWVzIGNvbXBvbmVudC1zcGVjaWZpYyBzdHlsZXMgdG8gZXh0ZXJuYWwgd3JhcHBlciBlbGVtZW50c1xuICAgIGZ1bmN0aW9uIGFwcGx5V3JhcHBlclN0eWxlcygpIHtcbiAgICAgIHZhciBzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0cnVlIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICB2YXIgYXBwbHlDbGFzcyA9IGZ1bmN0aW9uIGFwcGx5Q2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0W3NldCA/ICdhZGQnIDogJ3JlbW92ZSddKGNsYXNzTmFtZSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAocHJvcHMuaHRtbENsYXNzTmFtZSkge1xuICAgICAgICBhcHBseUNsYXNzKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKSwgcHJvcHMuaHRtbENsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMuYm9keUNsYXNzTmFtZSkge1xuICAgICAgICBhcHBseUNsYXNzKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgcHJvcHMuYm9keUNsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHlsZXMucGFnZVdyYXAgJiYgcHJvcHMucGFnZVdyYXBJZCkge1xuICAgICAgICBoYW5kbGVFeHRlcm5hbFdyYXBwZXIocHJvcHMucGFnZVdyYXBJZCwgc3R5bGVzLnBhZ2VXcmFwLCBzZXQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3R5bGVzLm91dGVyQ29udGFpbmVyICYmIHByb3BzLm91dGVyQ29udGFpbmVySWQpIHtcbiAgICAgICAgaGFuZGxlRXh0ZXJuYWxXcmFwcGVyKHByb3BzLm91dGVyQ29udGFpbmVySWQsIHN0eWxlcy5vdXRlckNvbnRhaW5lciwgc2V0KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1lbnVXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJtLW1lbnUtd3JhcCcpO1xuICAgICAgaWYgKG1lbnVXcmFwKSB7XG4gICAgICAgIGlmIChzZXQpIHtcbiAgICAgICAgICBtZW51V3JhcC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lbnVXcmFwLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZHMgcG90ZW50aWFsbHkgYXR0ZW1wdGluZyB0byB1cGRhdGUgYW4gdW5tb3VudGVkIGNvbXBvbmVudFxuICAgIGZ1bmN0aW9uIGNsZWFyQ3VycmVudFRpbWVvdXQoKSB7XG4gICAgICBpZiAodGltZW91dElkLmN1cnJlbnQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZC5jdXJyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbktleURvd25PcGVuKGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgICAgLy8gQ2xvc2Ugb24gRVNDLCB1bmxlc3MgZGlzYWJsZWRcbiAgICAgICAgICBpZiAoIXByb3BzLmRpc2FibGVDbG9zZU9uRXNjKSB7XG4gICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgICAgKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25NZW51QnV0dG9uKSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBUlJPV19ET1dOOlxuICAgICAgICAgICgwLCBfaGVscGVyc0RvbS5mb2N1c09uTmV4dE1lbnVJdGVtKSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFSUk9XX1VQOlxuICAgICAgICAgICgwLCBfaGVscGVyc0RvbS5mb2N1c09uUHJldmlvdXNNZW51SXRlbSkoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBIT01FOlxuICAgICAgICAgICgwLCBfaGVscGVyc0RvbS5mb2N1c09uRmlyc3RNZW51SXRlbSkoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFTkQ6XG4gICAgICAgICAgKDAsIF9oZWxwZXJzRG9tLmZvY3VzT25MYXN0TWVudUl0ZW0pKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25LZXlEb3duQ2xvc2VkKGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIC8vIEtleSBkb3ducyBjYW1lIGZyb20gbWVudSBidXR0b25cbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWJ1cmdlci1tZW51LWJ0bicpKSB7XG4gICAgICAgIHN3aXRjaCAoZS5rZXkpIHtcbiAgICAgICAgICBjYXNlIEFSUk9XX0RPV046XG4gICAgICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgICAgIC8vIElmIGRvd24gYXJyb3csIHNwYWNlIG9yIGVudGVyLCBvcGVuIG1lbnUgYW5kIGZvY3VzIG9uIGZpcnN0IG1lbnVpdGVtXG4gICAgICAgICAgICB0b2dnbGVNZW51KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFSUk9XX1VQOlxuICAgICAgICAgICAgLy8gSWYgYXJyb3cgdXAsIG9wZW4gbWVudSBhbmQgZm9jdXMgb24gbGFzdCBtZW51aXRlbVxuICAgICAgICAgICAgdG9nZ2xlTWVudSh7IGZvY3VzT25MYXN0SXRlbTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsaWNrKCkge1xuICAgICAgaWYgKHByb3BzLmRpc2FibGVPdmVybGF5Q2xpY2sgPT09IHRydWUgfHwgdHlwZW9mIHByb3BzLmRpc2FibGVPdmVybGF5Q2xpY2sgPT09ICdmdW5jdGlvbicgJiYgcHJvcHMuZGlzYWJsZU92ZXJsYXlDbGljaygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgIXByb3BzLm5vT3ZlcmxheSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBjbGFzc05hbWU6ICgnYm0tb3ZlcmxheSAnICsgcHJvcHMub3ZlcmxheUNsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICBvbkNsaWNrOiBoYW5kbGVPdmVybGF5Q2xpY2ssXG4gICAgICAgIHN0eWxlOiBnZXRTdHlsZXMoJ292ZXJsYXknKVxuICAgICAgfSksXG4gICAgICBwcm9wcy5jdXN0b21CdXJnZXJJY29uICE9PSBmYWxzZSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgc3R5bGU6IGdldFN0eWxlcygnYnVyZ2VySWNvbicpIH0sXG4gICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9jb21wb25lbnRzQnVyZ2VySWNvbjJbJ2RlZmF1bHQnXSwge1xuICAgICAgICAgIG9uQ2xpY2s6IG9wZW4sXG4gICAgICAgICAgc3R5bGVzOiBwcm9wcy5zdHlsZXMsXG4gICAgICAgICAgY3VzdG9tSWNvbjogcHJvcHMuY3VzdG9tQnVyZ2VySWNvbixcbiAgICAgICAgICBjbGFzc05hbWU6IHByb3BzLmJ1cmdlckJ1dHRvbkNsYXNzTmFtZSxcbiAgICAgICAgICBiYXJDbGFzc05hbWU6IHByb3BzLmJ1cmdlckJhckNsYXNzTmFtZSxcbiAgICAgICAgICBvbkljb25TdGF0ZUNoYW5nZTogcHJvcHMub25JY29uU3RhdGVDaGFuZ2VcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogcHJvcHMuaWQsXG4gICAgICAgICAgY2xhc3NOYW1lOiAoJ2JtLW1lbnUtd3JhcCAnICsgcHJvcHMuY2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgICAgc3R5bGU6IGdldFN0eWxlcygnbWVudVdyYXAnKSxcbiAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAhaXNPcGVuXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlcy5zdmcgJiYgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdibS1tb3JwaC1zaGFwZScsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICgnYm0tbW9ycGgtc2hhcGUgJyArIHByb3BzLm1vcnBoU2hhcGVDbGFzc05hbWUpLnRyaW0oKSxcbiAgICAgICAgICAgIHN0eWxlOiBnZXRTdHlsZXMoJ21vcnBoU2hhcGUnKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnc3ZnJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIHZpZXdCb3g6ICcwIDAgMTAwIDgwMCcsXG4gICAgICAgICAgICAgIHByZXNlcnZlQXNwZWN0UmF0aW86ICdub25lJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdwYXRoJywgeyBkOiBzdHlsZXMuc3ZnLnBhdGhJbml0aWFsIH0pXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICgnYm0tbWVudSAnICsgcHJvcHMubWVudUNsYXNzTmFtZSkudHJpbSgpLFxuICAgICAgICAgICAgc3R5bGU6IGdldFN0eWxlcygnbWVudScpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChwcm9wcy5pdGVtTGlzdEVsZW1lbnQsIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogKCdibS1pdGVtLWxpc3QgJyArIHByb3BzLml0ZW1MaXN0Q2xhc3NOYW1lKS50cmltKCksXG4gICAgICAgICAgICBzdHlsZTogZ2V0U3R5bGVzKCdpdGVtTGlzdCcpXG4gICAgICAgICAgfSwgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm1hcChwcm9wcy5jaGlsZHJlbiwgZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICB2YXIgY2xhc3NMaXN0ID0gWydibS1pdGVtJywgcHJvcHMuaXRlbUNsYXNzTmFtZSwgaXRlbS5wcm9wcy5jbGFzc05hbWVdLmZpbHRlcihmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhY2xhc3NOYW1lO1xuICAgICAgICAgICAgICB9KS5qb2luKCcgJyk7XG4gICAgICAgICAgICAgIHZhciBleHRyYVByb3BzID0ge1xuICAgICAgICAgICAgICAgIGtleTogaW5kZXgsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc0xpc3QsXG4gICAgICAgICAgICAgICAgc3R5bGU6IGdldFN0eWxlcygnaXRlbScsIGluZGV4LCBpdGVtLnByb3BzLnN0eWxlKSxcbiAgICAgICAgICAgICAgICB0YWJJbmRleDogaXNPcGVuID8gMCA6IC0xXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY2xvbmVFbGVtZW50KGl0ZW0sIGV4dHJhUHJvcHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKVxuICAgICAgICApLFxuICAgICAgICBwcm9wcy5jdXN0b21Dcm9zc0ljb24gIT09IGZhbHNlICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgc3R5bGU6IGdldFN0eWxlcygnY2xvc2VCdXR0b24nKSB9LFxuICAgICAgICAgIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KF9jb21wb25lbnRzQ3Jvc3NJY29uMlsnZGVmYXVsdCddLCB7XG4gICAgICAgICAgICBvbkNsaWNrOiBjbG9zZSxcbiAgICAgICAgICAgIHN0eWxlczogcHJvcHMuc3R5bGVzLFxuICAgICAgICAgICAgY3VzdG9tSWNvbjogcHJvcHMuY3VzdG9tQ3Jvc3NJY29uLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jcm9zc0J1dHRvbkNsYXNzTmFtZSxcbiAgICAgICAgICAgIGNyb3NzQ2xhc3NOYW1lOiBwcm9wcy5jcm9zc0NsYXNzTmFtZSxcbiAgICAgICAgICAgIGlzT3BlbjogaXNPcGVuXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH07XG5cbiAgTWVudS5wcm9wVHlwZXMgPSB7XG4gICAgYm9keUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgYnVyZ2VyQmFyQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBidXJnZXJCdXR0b25DbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgY3Jvc3NCdXR0b25DbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGNyb3NzQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBjdXN0b21CdXJnZXJJY29uOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mVHlwZShbX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5lbGVtZW50LCBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mKFtmYWxzZV0pXSksXG4gICAgY3VzdG9tQ3Jvc3NJY29uOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mVHlwZShbX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5lbGVtZW50LCBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mKFtmYWxzZV0pXSksXG4gICAgY3VzdG9tT25LZXlEb3duOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmZ1bmMsXG4gICAgZGlzYWJsZUF1dG9Gb2N1czogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgIGRpc2FibGVDbG9zZU9uRXNjOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgZGlzYWJsZU92ZXJsYXlDbGljazogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vbmVPZlR5cGUoW19wcm9wVHlwZXMyWydkZWZhdWx0J10uYm9vbCwgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jXSksXG4gICAgaHRtbENsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgaWQ6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGlzT3BlbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgIGl0ZW1DbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGl0ZW1MaXN0Q2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICBpdGVtTGlzdEVsZW1lbnQ6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2YoWydkaXYnLCAnbmF2J10pLFxuICAgIG1lbnVDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIG1vcnBoU2hhcGVDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIG5vT3ZlcmxheTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgIG5vVHJhbnNpdGlvbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgIG9uQ2xvc2U6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZnVuYyxcbiAgICBvbkljb25Ib3ZlckNoYW5nZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jLFxuICAgIG9uT3BlbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jLFxuICAgIG9uU3RhdGVDaGFuZ2U6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZnVuYyxcbiAgICBvdXRlckNvbnRhaW5lcklkOiBzdHlsZXMgJiYgc3R5bGVzLm91dGVyQ29udGFpbmVyID8gX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcuaXNSZXF1aXJlZCA6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIG92ZXJsYXlDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIHBhZ2VXcmFwSWQ6IHN0eWxlcyAmJiBzdHlsZXMucGFnZVdyYXAgPyBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZy5pc1JlcXVpcmVkIDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgcmlnaHQ6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uYm9vbCxcbiAgICBzdHlsZXM6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub2JqZWN0LFxuICAgIHdpZHRoOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mVHlwZShbX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5udW1iZXIsIF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nXSlcbiAgfTtcblxuICBNZW51LmRlZmF1bHRQcm9wcyA9IHtcbiAgICBib2R5Q2xhc3NOYW1lOiAnJyxcbiAgICBidXJnZXJCYXJDbGFzc05hbWU6ICcnLFxuICAgIGJ1cmdlckJ1dHRvbkNsYXNzTmFtZTogJycsXG4gICAgY2xhc3NOYW1lOiAnJyxcbiAgICBjcm9zc0J1dHRvbkNsYXNzTmFtZTogJycsXG4gICAgY3Jvc3NDbGFzc05hbWU6ICcnLFxuICAgIGRpc2FibGVBdXRvRm9jdXM6IGZhbHNlLFxuICAgIGRpc2FibGVDbG9zZU9uRXNjOiBmYWxzZSxcbiAgICBodG1sQ2xhc3NOYW1lOiAnJyxcbiAgICBpZDogJycsXG4gICAgaXRlbUNsYXNzTmFtZTogJycsXG4gICAgaXRlbUxpc3RDbGFzc05hbWU6ICcnLFxuICAgIG1lbnVDbGFzc05hbWU6ICcnLFxuICAgIG1vcnBoU2hhcGVDbGFzc05hbWU6ICcnLFxuICAgIG5vT3ZlcmxheTogZmFsc2UsXG4gICAgbm9UcmFuc2l0aW9uOiBmYWxzZSxcbiAgICBvblN0YXRlQ2hhbmdlOiBmdW5jdGlvbiBvblN0YXRlQ2hhbmdlKCkge30sXG4gICAgb3V0ZXJDb250YWluZXJJZDogJycsXG4gICAgb3ZlcmxheUNsYXNzTmFtZTogJycsXG4gICAgcGFnZVdyYXBJZDogJycsXG4gICAgc3R5bGVzOiB7fSxcbiAgICB3aWR0aDogMzAwLFxuICAgIG9uSWNvbkhvdmVyQ2hhbmdlOiBmdW5jdGlvbiBvbkljb25Ib3ZlckNoYW5nZSgpIHt9LFxuICAgIGl0ZW1MaXN0RWxlbWVudDogJ25hdidcbiAgfTtcblxuICByZXR1cm4gTWVudTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9oZWxwZXJzU25hcHN2Z0ltcG9ydGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9zbmFwc3ZnSW1wb3J0ZXInKTtcblxudmFyIF9oZWxwZXJzU25hcHN2Z0ltcG9ydGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIpO1xuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBfaGVscGVyc1V0aWxzID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xuXG52YXIgQlVCQkxFX1dJRFRIID0gMTQwO1xuXG52YXIgc3R5bGVzID0ge1xuICBzdmc6IHtcbiAgICBsaWI6IF9oZWxwZXJzU25hcHN2Z0ltcG9ydGVyMlsnZGVmYXVsdCddLFxuICAgIHBhdGhJbml0aWFsOiAnTS03LjMxMiwwSDBjMCwwLDAsMTEzLjgzOSwwLDQwMGMwLDI2NC41MDYsMCw0MDAsMCw0MDBoLTcuMzEyVjB6JyxcbiAgICBwYXRoT3BlbjogJ00tNy4zMTIsMEgxNWMwLDAsNjYsMTEzLjMzOSw2NiwzOTkuNUM4MSw2NjQuMDA2LDE1LDgwMCwxNSw4MDBILTcuMzEyVjB6O00tNy4zMTIsMEgxMDBjMCwwLDAsMTEzLjgzOSwwLDQwMGMwLDI2NC41MDYsMCw0MDAsMCw0MDBILTcuMzEyVjB6JyxcbiAgICBhbmltYXRlOiBmdW5jdGlvbiBhbmltYXRlKHBhdGgpIHtcbiAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgdmFyIHN0ZXBzID0gdGhpcy5wYXRoT3Blbi5zcGxpdCgnOycpO1xuICAgICAgdmFyIHN0ZXBzVG90YWwgPSBzdGVwcy5sZW5ndGg7XG4gICAgICB2YXIgbWluYSA9IHdpbmRvdy5taW5hO1xuXG4gICAgICB2YXIgbmV4dFN0ZXAgPSBmdW5jdGlvbiBuZXh0U3RlcCgpIHtcbiAgICAgICAgaWYgKHBvcyA+IHN0ZXBzVG90YWwgLSAxKSByZXR1cm47XG5cbiAgICAgICAgcGF0aC5hbmltYXRlKHsgcGF0aDogc3RlcHNbcG9zXSB9LCBwb3MgPT09IDAgPyA0MDAgOiA1MDAsIHBvcyA9PT0gMCA/IG1pbmEuZWFzZWluIDogbWluYS5lbGFzdGljLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbmV4dFN0ZXAoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcG9zKys7XG4gICAgICB9O1xuXG4gICAgICBuZXh0U3RlcCgpO1xuICAgIH1cbiAgfSxcblxuICBtb3JwaFNoYXBlOiBmdW5jdGlvbiBtb3JwaFNoYXBlKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgcmlnaHQ6IHJpZ2h0ID8gJ2luaGVyaXQnIDogMCxcbiAgICAgIGxlZnQ6IHJpZ2h0ID8gMCA6ICdpbmhlcml0JyxcbiAgICAgIE1velRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgIE1zVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknLFxuICAgICAgT1RyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgIHRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJ1xuICAgIH07XG4gIH0sXG5cbiAgbWVudVdyYXA6IGZ1bmN0aW9uIG1lbnVXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAndHJhbnNmb3JtIDAuNHMgMHMnIDogJ3RyYW5zZm9ybSAwLjRzJ1xuICAgIH07XG4gIH0sXG5cbiAgbWVudTogZnVuY3Rpb24gbWVudShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHZhciBmaW5hbFdpZHRoID0gKDAsIF9oZWxwZXJzVXRpbHMucHhUb051bSkod2lkdGgpIC0gQlVCQkxFX1dJRFRIO1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ29wYWNpdHkgMC4xcyAwLjRzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpLCB0cmFuc2Zvcm0gMC4xcyAwLjRzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpJyA6ICdvcGFjaXR5IDBzIDAuM3MgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyksIHRyYW5zZm9ybSAwcyAwLjNzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpJyxcbiAgICAgIG9wYWNpdHk6IGlzT3BlbiA/IDEgOiAwXG4gICAgfTtcbiAgfSxcblxuICBpdGVtOiBmdW5jdGlvbiBpdGVtKGlzT3Blbiwgd2lkdGgsIHJpZ2h0LCBudGhDaGlsZCkge1xuICAgIHZhciBmaW5hbFdpZHRoID0gKDAsIF9oZWxwZXJzVXRpbHMucHhUb051bSkod2lkdGgpIC0gQlVCQkxFX1dJRFRIO1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAnb3BhY2l0eSAwLjNzIDAuNHMsIHRyYW5zZm9ybSAwLjNzIDAuNHMnIDogJ29wYWNpdHkgMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDBzIDAuM3MgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknLFxuICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDBcbiAgICB9O1xuICB9LFxuXG4gIGNsb3NlQnV0dG9uOiBmdW5jdGlvbiBjbG9zZUJ1dHRvbihpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHZhciBmaW5hbFdpZHRoID0gKDAsIF9oZWxwZXJzVXRpbHMucHhUb051bSkod2lkdGgpIC0gQlVCQkxFX1dJRFRIO1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyBmaW5hbFdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgZmluYWxXaWR0aCArICcsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgZmluYWxXaWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIGZpbmFsV2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAnb3BhY2l0eSAwLjNzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyksIHRyYW5zZm9ybSAwLjNzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknIDogJ29wYWNpdHkgMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDBzIDAuM3MgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknLFxuICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDBcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3NuYXBzdmdJbXBvcnRlcicpO1xuXG52YXIgX2hlbHBlcnNTbmFwc3ZnSW1wb3J0ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1NuYXBzdmdJbXBvcnRlcik7XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIF9oZWxwZXJzVXRpbHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3V0aWxzJyk7XG5cbnZhciBNT1JQSF9TSEFQRV9XSURUSCA9IDEyMDtcblxudmFyIHN0eWxlcyA9IHtcbiAgc3ZnOiB7XG4gICAgbGliOiBfaGVscGVyc1NuYXBzdmdJbXBvcnRlcjJbJ2RlZmF1bHQnXSxcbiAgICBwYXRoSW5pdGlhbDogJ00tMSwwaDEwMWMwLDAtOTcuODMzLDE1My42MDMtOTcuODMzLDM5Ni4xNjdDMi4xNjcsNjI3LjU3OSwxMDAsODAwLDEwMCw4MDBILTFWMHonLFxuICAgIHBhdGhPcGVuOiAnTS0xLDBoMTAxYzAsMCwwLTEsMCwzOTVjMCw0MDQsMCw0MDUsMCw0MDVILTFWMHonLFxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUocGF0aCkge1xuICAgICAgcGF0aC5hbmltYXRlKHsgcGF0aDogdGhpcy5wYXRoT3BlbiB9LCA0MDAsIHdpbmRvdy5taW5hLmVhc2Vpbm91dCk7XG4gICAgfVxuICB9LFxuXG4gIG1vcnBoU2hhcGU6IGZ1bmN0aW9uIG1vcnBoU2hhcGUoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogTU9SUEhfU0hBUEVfV0lEVEgsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIHJpZ2h0OiByaWdodCA/ICdpbmhlcml0JyA6IDAsXG4gICAgICBsZWZ0OiByaWdodCA/IDAgOiAnaW5oZXJpdCcsXG4gICAgICBNb3pUcmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAnJyxcbiAgICAgIE1zVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJycsXG4gICAgICBPVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJycsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAnJyxcbiAgICAgIHRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnXG4gICAgfTtcbiAgfSxcblxuICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4zcydcbiAgICB9O1xuICB9LFxuXG4gIG1lbnU6IGZ1bmN0aW9uIG1lbnUoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICByaWdodDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgd2lkdGg6ICgwLCBfaGVscGVyc1V0aWxzLnB4VG9OdW0pKHdpZHRoKSAtIE1PUlBIX1NIQVBFX1dJRFRILFxuICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgIG92ZXJmbG93OiAndmlzaWJsZSdcbiAgICB9O1xuICB9LFxuXG4gIGl0ZW1MaXN0OiBmdW5jdGlvbiBpdGVtTGlzdChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIGlmIChyaWdodCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgIGxlZnQ6ICctMTEwcHgnLFxuICAgICAgICB3aWR0aDogJzE3MCUnLFxuICAgICAgICBvdmVyZmxvdzogJ2F1dG8nXG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdhbGwgMC4zcycgOiAnYWxsIDAuM3MgMC4xcydcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzIGVhc2UtaW4tb3V0J1xuICAgIH07XG4gIH0sXG5cbiAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICB9O1xuICB9LFxuXG4gIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGVyc3BlY3RpdmU6ICcxNTAwcHgnLFxuICAgICAgcGVyc3BlY3RpdmVPcmlnaW46ICcwJSA1MCUnLFxuICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgfTtcbiAgfSxcblxuICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoaXNPcGVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgc3R5bGVzID0ge1xuICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKDE1ZGVnKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgtMTVkZWcpJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKDE1ZGVnKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgtMTVkZWcpJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKDE1ZGVnKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgtMTVkZWcpJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgxNWRlZyknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoLTE1ZGVnKScsXG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IHJpZ2h0ID8gJzEwMCUgNTAlJyA6ICcwJSA1MCUnLFxuICAgICAgdHJhbnNmb3JtU3R5bGU6ICdwcmVzZXJ2ZS0zZCcsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgfTtcbiAgfSxcblxuICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoaXNPcGVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBlcnNwZWN0aXZlOiAnMTUwMHB4JyxcbiAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgc3R5bGVzID0ge1xuICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgTXNUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgekluZGV4OiBpc09wZW4gPyAxMDAwIDogLTFcbiAgICB9O1xuICB9LFxuXG4gIG92ZXJsYXk6IGZ1bmN0aW9uIG92ZXJsYXkoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgekluZGV4OiAxNDAwLFxuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cycsXG4gICAgICB2aXNpYmlsaXR5OiBpc09wZW4gPyAndmlzaWJsZScgOiAnaGlkZGVuJ1xuICAgIH07XG4gIH0sXG5cbiAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cycsXG4gICAgICB6SW5kZXg6IDEyMDAsXG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgIH07XG4gIH0sXG5cbiAgYnVyZ2VySWNvbjogZnVuY3Rpb24gYnVyZ2VySWNvbihpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjFzJyxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgekluZGV4OiAxMzAwXG4gICAgfTtcbiAgfSxcblxuICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoaXNPcGVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgc3R5bGVzID0ge1xuICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIC0nICsgd2lkdGggKyAnKScsXG4gICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIC0nICsgd2lkdGggKyAnKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIC0nICsgd2lkdGggKyAnKScsXG4gICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIC0nICsgd2lkdGggKyAnKScsXG4gICAgICB0cmFuc2Zvcm1PcmlnaW46ICcxMDAlJyxcbiAgICAgIHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJ1xuICAgIH07XG4gIH0sXG5cbiAgb3V0ZXJDb250YWluZXI6IGZ1bmN0aW9uIG91dGVyQ29udGFpbmVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwZXJzcGVjdGl2ZTogJzE1MDBweCdcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcblxudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgIHJldHVybiB7XG4gICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoMjBkZWcpJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKC0yMGRlZyknLFxuICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoMjBkZWcpJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKC0yMGRlZyknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoMjBkZWcpJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKC0yMGRlZyknLFxuICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKDIwZGVnKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgtMjBkZWcpJyxcbiAgICAgIHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJyxcbiAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfSxcblxuICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoaXNPcGVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBlcnNwZWN0aXZlOiAnMTUwMHB4JyxcbiAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG5cbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xuXG52YXIgc3R5bGVzID0ge307XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xuXG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcblxudmFyIHN0eWxlcyA9IHtcbiAgbWVudVdyYXA6IGZ1bmN0aW9uIG1lbnVXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICd0cmFuc2Zvcm0gMC44cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJyA6ICd0cmFuc2Zvcm0gMC40cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJ1xuICAgIH07XG4gIH0sXG5cbiAgaXRlbTogZnVuY3Rpb24gaXRlbShpc09wZW4sIHdpZHRoLCByaWdodCwgbnRoQ2hpbGQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsICcgKyBudGhDaGlsZCAqIDUwMCArICdweCwgMCknLFxuICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgJyArIG50aENoaWxkICogNTAwICsgJ3B4LCAwKScsXG4gICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAndHJhbnNmb3JtIDAuOHMgY3ViaWMtYmV6aWVyKDAuNywgMCwgMC4zLCAxKScgOiAndHJhbnNmb3JtIDBzIDAuMnMgY3ViaWMtYmV6aWVyKDAuNywgMCwgMC4zLCAxKSdcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107Iiwid2luZG93LmV2ZSA9IHJlcXVpcmUoJ2V2ZScpXG5cbi8vIENvcHlyaWdodCAoYykgMjAxNyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbnZhciBtaW5hID0gKGZ1bmN0aW9uIChldmUpIHtcbiAgICB2YXIgYW5pbWF0aW9ucyA9IHt9LFxuICAgIHJlcXVlc3RBbmltRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAxNiwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgcmVxdWVzdElELFxuICAgIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXkgfHxcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgfSxcbiAgICBpZGdlbiA9IDAsXG4gICAgaWRwcmVmaXggPSBcIk1cIiArICgrbmV3IERhdGUpLnRvU3RyaW5nKDM2KSxcbiAgICBJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGlkcHJlZml4ICsgKGlkZ2VuKyspLnRvU3RyaW5nKDM2KTtcbiAgICB9LFxuICAgIGRpZmYgPSBmdW5jdGlvbiAoYSwgYiwgQSwgQikge1xuICAgICAgICBpZiAoaXNBcnJheShhKSkge1xuICAgICAgICAgICAgcmVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBhLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXNbaV0gPSBkaWZmKGFbaV0sIGIsIEFbaV0sIEIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlmID0gKEEgLSBhKSAvIChCIC0gYik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYmIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICsgZGlmICogKGJiIC0gYik7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICB0aW1lciA9IERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZTtcbiAgICB9LFxuICAgIHN0YSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgdmFyIGEgPSB0aGlzO1xuICAgICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRzID0gYS5zIC0gdmFsO1xuICAgICAgICBhLmIgKz0gYS5kdXIgKiBkcztcbiAgICAgICAgYS5CICs9IGEuZHVyICogZHM7XG4gICAgICAgIGEucyA9IHZhbDtcbiAgICB9LFxuICAgIHNwZWVkID0gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICB2YXIgYSA9IHRoaXM7XG4gICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGEuc3BkO1xuICAgICAgICB9XG4gICAgICAgIGEuc3BkID0gdmFsO1xuICAgIH0sXG4gICAgZHVyYXRpb24gPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHZhciBhID0gdGhpcztcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5kdXI7XG4gICAgICAgIH1cbiAgICAgICAgYS5zID0gYS5zICogdmFsIC8gYS5kdXI7XG4gICAgICAgIGEuZHVyID0gdmFsO1xuICAgIH0sXG4gICAgc3RvcGl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXM7XG4gICAgICAgIGRlbGV0ZSBhbmltYXRpb25zW2EuaWRdO1xuICAgICAgICBhLnVwZGF0ZSgpO1xuICAgICAgICBldmUoXCJtaW5hLnN0b3AuXCIgKyBhLmlkLCBhKTtcbiAgICB9LFxuICAgIHBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXM7XG4gICAgICAgIGlmIChhLnBkaWYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgYW5pbWF0aW9uc1thLmlkXTtcbiAgICAgICAgYS51cGRhdGUoKTtcbiAgICAgICAgYS5wZGlmID0gYS5nZXQoKSAtIGEuYjtcbiAgICB9LFxuICAgIHJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSB0aGlzO1xuICAgICAgICBpZiAoIWEucGRpZikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGEuYiA9IGEuZ2V0KCkgLSBhLnBkaWY7XG4gICAgICAgIGRlbGV0ZSBhLnBkaWY7XG4gICAgICAgIGFuaW1hdGlvbnNbYS5pZF0gPSBhO1xuICAgICAgICBmcmFtZSgpO1xuICAgIH0sXG4gICAgdXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXMsXG4gICAgICAgICAgICByZXM7XG4gICAgICAgIGlmIChpc0FycmF5KGEuc3RhcnQpKSB7XG4gICAgICAgICAgICByZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IGEuc3RhcnQubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgICAgICAgICAgIHJlc1tqXSA9ICthLnN0YXJ0W2pdICtcbiAgICAgICAgICAgICAgICAgICAgKGEuZW5kW2pdIC0gYS5zdGFydFtqXSkgKiBhLmVhc2luZyhhLnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gK2Euc3RhcnQgKyAoYS5lbmQgLSBhLnN0YXJ0KSAqIGEuZWFzaW5nKGEucyk7XG4gICAgICAgIH1cbiAgICAgICAgYS5zZXQocmVzKTtcbiAgICB9LFxuICAgIGZyYW1lID0gZnVuY3Rpb24gKHRpbWVTdGFtcCkge1xuICAgICAgICAvLyBNYW51YWwgaW52b2thdGlvbj9cbiAgICAgICAgaWYgKCF0aW1lU3RhbXApIHtcbiAgICAgICAgICAgIC8vIEZyYW1lIGxvb3Agc3RvcHBlZD9cbiAgICAgICAgICAgIGlmICghcmVxdWVzdElEKSB7XG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgZnJhbWUgbG9vcC4uLlxuICAgICAgICAgICAgICAgIHJlcXVlc3RJRCA9IHJlcXVlc3RBbmltRnJhbWUoZnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSAwO1xuICAgICAgICBmb3IgKHZhciBpIGluIGFuaW1hdGlvbnMpIGlmIChhbmltYXRpb25zLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICB2YXIgYSA9IGFuaW1hdGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgYiA9IGEuZ2V0KCksXG4gICAgICAgICAgICAgICAgcmVzO1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBhLnMgPSAoYiAtIGEuYikgLyAoYS5kdXIgLyBhLnNwZCk7XG4gICAgICAgICAgICBpZiAoYS5zID49IDEpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgYW5pbWF0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICBhLnMgPSAxO1xuICAgICAgICAgICAgICAgIGxlbi0tO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZShcIm1pbmEuZmluaXNoLlwiICsgYS5pZCwgYSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0oYSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0SUQgPSBsZW4gPyByZXF1ZXN0QW5pbUZyYW1lKGZyYW1lKSA6IGZhbHNlO1xuICAgIH0sXG4gICAgLypcXFxuICAgICAqIG1pbmFcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEdlbmVyaWMgYW5pbWF0aW9uIG9mIG51bWJlcnNcbiAgICAgKipcbiAgICAgLSBhIChudW1iZXIpIHN0YXJ0IF9zbGF2ZV8gbnVtYmVyXG4gICAgIC0gQSAobnVtYmVyKSBlbmQgX3NsYXZlXyBudW1iZXJcbiAgICAgLSBiIChudW1iZXIpIHN0YXJ0IF9tYXN0ZXJfIG51bWJlciAoc3RhcnQgdGltZSBpbiBnZW5lcmFsIGNhc2UpXG4gICAgIC0gQiAobnVtYmVyKSBlbmQgX21hc3Rlcl8gbnVtYmVyIChlbmQgdGltZSBpbiBnZW5lcmFsIGNhc2UpXG4gICAgIC0gZ2V0IChmdW5jdGlvbikgZ2V0dGVyIG9mIF9tYXN0ZXJfIG51bWJlciAoc2VlIEBtaW5hLnRpbWUpXG4gICAgIC0gc2V0IChmdW5jdGlvbikgc2V0dGVyIG9mIF9zbGF2ZV8gbnVtYmVyXG4gICAgIC0gZWFzaW5nIChmdW5jdGlvbikgI29wdGlvbmFsIGVhc2luZyBmdW5jdGlvbiwgZGVmYXVsdCBpcyBAbWluYS5saW5lYXJcbiAgICAgPSAob2JqZWN0KSBhbmltYXRpb24gZGVzY3JpcHRvclxuICAgICBvIHtcbiAgICAgbyAgICAgICAgIGlkIChzdHJpbmcpIGFuaW1hdGlvbiBpZCxcbiAgICAgbyAgICAgICAgIHN0YXJ0IChudW1iZXIpIHN0YXJ0IF9zbGF2ZV8gbnVtYmVyLFxuICAgICBvICAgICAgICAgZW5kIChudW1iZXIpIGVuZCBfc2xhdmVfIG51bWJlcixcbiAgICAgbyAgICAgICAgIGIgKG51bWJlcikgc3RhcnQgX21hc3Rlcl8gbnVtYmVyLFxuICAgICBvICAgICAgICAgcyAobnVtYmVyKSBhbmltYXRpb24gc3RhdHVzICgwLi4xKSxcbiAgICAgbyAgICAgICAgIGR1ciAobnVtYmVyKSBhbmltYXRpb24gZHVyYXRpb24sXG4gICAgIG8gICAgICAgICBzcGQgKG51bWJlcikgYW5pbWF0aW9uIHNwZWVkLFxuICAgICBvICAgICAgICAgZ2V0IChmdW5jdGlvbikgZ2V0dGVyIG9mIF9tYXN0ZXJfIG51bWJlciAoc2VlIEBtaW5hLnRpbWUpLFxuICAgICBvICAgICAgICAgc2V0IChmdW5jdGlvbikgc2V0dGVyIG9mIF9zbGF2ZV8gbnVtYmVyLFxuICAgICBvICAgICAgICAgZWFzaW5nIChmdW5jdGlvbikgZWFzaW5nIGZ1bmN0aW9uLCBkZWZhdWx0IGlzIEBtaW5hLmxpbmVhcixcbiAgICAgbyAgICAgICAgIHN0YXR1cyAoZnVuY3Rpb24pIHN0YXR1cyBnZXR0ZXIvc2V0dGVyLFxuICAgICBvICAgICAgICAgc3BlZWQgKGZ1bmN0aW9uKSBzcGVlZCBnZXR0ZXIvc2V0dGVyLFxuICAgICBvICAgICAgICAgZHVyYXRpb24gKGZ1bmN0aW9uKSBkdXJhdGlvbiBnZXR0ZXIvc2V0dGVyLFxuICAgICBvICAgICAgICAgc3RvcCAoZnVuY3Rpb24pIGFuaW1hdGlvbiBzdG9wcGVyXG4gICAgIG8gICAgICAgICBwYXVzZSAoZnVuY3Rpb24pIHBhdXNlcyB0aGUgYW5pbWF0aW9uXG4gICAgIG8gICAgICAgICByZXN1bWUgKGZ1bmN0aW9uKSByZXN1bWVzIHRoZSBhbmltYXRpb25cbiAgICAgbyAgICAgICAgIHVwZGF0ZSAoZnVuY3Rpb24pIGNhbGxlcyBzZXR0ZXIgd2l0aCB0aGUgcmlnaHQgdmFsdWUgb2YgdGhlIGFuaW1hdGlvblxuICAgICBvIH1cbiAgICBcXCovXG4gICAgbWluYSA9IGZ1bmN0aW9uIChhLCBBLCBiLCBCLCBnZXQsIHNldCwgZWFzaW5nKSB7XG4gICAgICAgIHZhciBhbmltID0ge1xuICAgICAgICAgICAgaWQ6IElEKCksXG4gICAgICAgICAgICBzdGFydDogYSxcbiAgICAgICAgICAgIGVuZDogQSxcbiAgICAgICAgICAgIGI6IGIsXG4gICAgICAgICAgICBzOiAwLFxuICAgICAgICAgICAgZHVyOiBCIC0gYixcbiAgICAgICAgICAgIHNwZDogMSxcbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgc2V0OiBzZXQsXG4gICAgICAgICAgICBlYXNpbmc6IGVhc2luZyB8fCBtaW5hLmxpbmVhcixcbiAgICAgICAgICAgIHN0YXR1czogc3RhLFxuICAgICAgICAgICAgc3BlZWQ6IHNwZWVkLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgc3RvcDogc3RvcGl0LFxuICAgICAgICAgICAgcGF1c2U6IHBhdXNlLFxuICAgICAgICAgICAgcmVzdW1lOiByZXN1bWUsXG4gICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgICAgICB9O1xuICAgICAgICBhbmltYXRpb25zW2FuaW0uaWRdID0gYW5pbTtcbiAgICAgICAgdmFyIGxlbiA9IDAsIGk7XG4gICAgICAgIGZvciAoaSBpbiBhbmltYXRpb25zKSBpZiAoYW5pbWF0aW9ucy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICBpZiAobGVuID09IDIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZW4gPT0gMSAmJiBmcmFtZSgpO1xuICAgICAgICByZXR1cm4gYW5pbTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLnRpbWVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZS4gRXF1aXZhbGVudCB0bzpcbiAgICAgfCBmdW5jdGlvbiAoKSB7XG4gICAgIHwgICAgIHJldHVybiAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICAgfCB9XG4gICAgXFwqL1xuICAgIG1pbmEudGltZSA9IHRpbWVyO1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmdldEJ5SWRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gYW5pbWF0aW9uIGJ5IGl0cyBpZFxuICAgICAtIGlkIChzdHJpbmcpIGFuaW1hdGlvbidzIGlkXG4gICAgID0gKG9iamVjdCkgU2VlIEBtaW5hXG4gICAgXFwqL1xuICAgIG1pbmEuZ2V0QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gYW5pbWF0aW9uc1tpZF0gfHwgbnVsbDtcbiAgICB9O1xuXG4gICAgLypcXFxuICAgICAqIG1pbmEubGluZWFyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBEZWZhdWx0IGxpbmVhciBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmxpbmVhciA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuZWFzZW91dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRWFzZW91dCBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmVhc2VvdXQgPSBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3cobiwgMS43KTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmVhc2VpblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRWFzZWluIGVhc2luZ1xuICAgICAtIG4gKG51bWJlcikgaW5wdXQgMC4uMVxuICAgICA9IChudW1iZXIpIG91dHB1dCAwLi4xXG4gICAgXFwqL1xuICAgIG1pbmEuZWFzZWluID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KG4sIC40OCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogbWluYS5lYXNlaW5vdXRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEVhc2Vpbm91dCBlYXNpbmdcbiAgICAgLSBuIChudW1iZXIpIGlucHV0IDAuLjFcbiAgICAgPSAobnVtYmVyKSBvdXRwdXQgMC4uMVxuICAgIFxcKi9cbiAgICBtaW5hLmVhc2Vpbm91dCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIGlmIChuID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBxID0gLjQ4IC0gbiAvIDEuMDQsXG4gICAgICAgICAgICBRID0gTWF0aC5zcXJ0KC4xNzM0ICsgcSAqIHEpLFxuICAgICAgICAgICAgeCA9IFEgLSBxLFxuICAgICAgICAgICAgWCA9IE1hdGgucG93KE1hdGguYWJzKHgpLCAxIC8gMykgKiAoeCA8IDAgPyAtMSA6IDEpLFxuICAgICAgICAgICAgeSA9IC1RIC0gcSxcbiAgICAgICAgICAgIFkgPSBNYXRoLnBvdyhNYXRoLmFicyh5KSwgMSAvIDMpICogKHkgPCAwID8gLTEgOiAxKSxcbiAgICAgICAgICAgIHQgPSBYICsgWSArIC41O1xuICAgICAgICByZXR1cm4gKDEgLSB0KSAqIDMgKiB0ICogdCArIHQgKiB0ICogdDtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmJhY2tpblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQmFja2luIGVhc2luZ1xuICAgICAtIG4gKG51bWJlcikgaW5wdXQgMC4uMVxuICAgICA9IChudW1iZXIpIG91dHB1dCAwLi4xXG4gICAgXFwqL1xuICAgIG1pbmEuYmFja2luID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgaWYgKG4gPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgICByZXR1cm4gbiAqIG4gKiAoKHMgKyAxKSAqIG4gLSBzKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmJhY2tvdXRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEJhY2tvdXQgZWFzaW5nXG4gICAgIC0gbiAobnVtYmVyKSBpbnB1dCAwLi4xXG4gICAgID0gKG51bWJlcikgb3V0cHV0IDAuLjFcbiAgICBcXCovXG4gICAgbWluYS5iYWNrb3V0ID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgaWYgKG4gPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgbiA9IG4gLSAxO1xuICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiBuICogbiAqICgocyArIDEpICogbiArIHMpICsgMTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBtaW5hLmVsYXN0aWNcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEVsYXN0aWMgZWFzaW5nXG4gICAgIC0gbiAobnVtYmVyKSBpbnB1dCAwLi4xXG4gICAgID0gKG51bWJlcikgb3V0cHV0IDAuLjFcbiAgICBcXCovXG4gICAgbWluYS5lbGFzdGljID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgaWYgKG4gPT0gISFuKSB7XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5wb3coMiwgLTEwICogbikgKiBNYXRoLnNpbigobiAtIC4wNzUpICpcbiAgICAgICAgICAgICgyICogTWF0aC5QSSkgLyAuMykgKyAxO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIG1pbmEuYm91bmNlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBCb3VuY2UgZWFzaW5nXG4gICAgIC0gbiAobnVtYmVyKSBpbnB1dCAwLi4xXG4gICAgID0gKG51bWJlcikgb3V0cHV0IDAuLjFcbiAgICBcXCovXG4gICAgbWluYS5ib3VuY2UgPSBmdW5jdGlvbiAobikge1xuICAgICAgICB2YXIgcyA9IDcuNTYyNSxcbiAgICAgICAgICAgIHAgPSAyLjc1LFxuICAgICAgICAgICAgbDtcbiAgICAgICAgaWYgKG4gPCAxIC8gcCkge1xuICAgICAgICAgICAgbCA9IHMgKiBuICogbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuIDwgMiAvIHApIHtcbiAgICAgICAgICAgICAgICBuIC09IDEuNSAvIHA7XG4gICAgICAgICAgICAgICAgbCA9IHMgKiBuICogbiArIC43NTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG4gPCAyLjUgLyBwKSB7XG4gICAgICAgICAgICAgICAgICAgIG4gLT0gMi4yNSAvIHA7XG4gICAgICAgICAgICAgICAgICAgIGwgPSBzICogbiAqIG4gKyAuOTM3NTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuIC09IDIuNjI1IC8gcDtcbiAgICAgICAgICAgICAgICAgICAgbCA9IHMgKiBuICogbiArIC45ODQzNzU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsO1xuICAgIH07XG4gICAgd2luZG93Lm1pbmEgPSBtaW5hO1xuICAgIHJldHVybiBtaW5hO1xufSkodHlwZW9mIGV2ZSA9PSBcInVuZGVmaW5lZFwiID8gZnVuY3Rpb24gKCkge30gOiBldmUpO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgLSAyMDE3IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG52YXIgU25hcCA9IChmdW5jdGlvbihyb290KSB7XG5TbmFwLnZlcnNpb24gPSBcIjAuNS4xXCI7XG4vKlxcXG4gKiBTbmFwXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDcmVhdGVzIGEgZHJhd2luZyBzdXJmYWNlIG9yIHdyYXBzIGV4aXN0aW5nIFNWRyBlbGVtZW50LlxuICoqXG4gLSB3aWR0aCAobnVtYmVyfHN0cmluZykgd2lkdGggb2Ygc3VyZmFjZVxuIC0gaGVpZ2h0IChudW1iZXJ8c3RyaW5nKSBoZWlnaHQgb2Ygc3VyZmFjZVxuICogb3JcbiAtIERPTSAoU1ZHRWxlbWVudCkgZWxlbWVudCB0byBiZSB3cmFwcGVkIGludG8gU25hcCBzdHJ1Y3R1cmVcbiAqIG9yXG4gLSBhcnJheSAoYXJyYXkpIGFycmF5IG9mIGVsZW1lbnRzICh3aWxsIHJldHVybiBzZXQgb2YgZWxlbWVudHMpXG4gKiBvclxuIC0gcXVlcnkgKHN0cmluZykgQ1NTIHF1ZXJ5IHNlbGVjdG9yXG4gPSAob2JqZWN0KSBARWxlbWVudFxuXFwqL1xuZnVuY3Rpb24gU25hcCh3LCBoKSB7XG4gICAgaWYgKHcpIHtcbiAgICAgICAgaWYgKHcubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKHcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpcyh3LCBcImFycmF5XCIpICYmIFNuYXAuc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gU25hcC5zZXQuYXBwbHkoU25hcCwgdyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHcgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHcgPSBnbG9iLmRvYy5xdWVyeVNlbGVjdG9yKFN0cmluZyh3KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXAodyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdyA9IHcgPT0gbnVsbCA/IFwiMTAwJVwiIDogdztcbiAgICBoID0gaCA9PSBudWxsID8gXCIxMDAlXCIgOiBoO1xuICAgIHJldHVybiBuZXcgUGFwZXIodywgaCk7XG59XG5TbmFwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIlNuYXAgdlwiICsgdGhpcy52ZXJzaW9uO1xufTtcblNuYXAuXyA9IHt9O1xudmFyIGdsb2IgPSB7XG4gICAgd2luOiByb290LndpbmRvdyxcbiAgICBkb2M6IHJvb3Qud2luZG93LmRvY3VtZW50XG59O1xuU25hcC5fLmdsb2IgPSBnbG9iO1xudmFyIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIixcbiAgICBTdHIgPSBTdHJpbmcsXG4gICAgdG9GbG9hdCA9IHBhcnNlRmxvYXQsXG4gICAgdG9JbnQgPSBwYXJzZUludCxcbiAgICBtYXRoID0gTWF0aCxcbiAgICBtbWF4ID0gbWF0aC5tYXgsXG4gICAgbW1pbiA9IG1hdGgubWluLFxuICAgIGFicyA9IG1hdGguYWJzLFxuICAgIHBvdyA9IG1hdGgucG93LFxuICAgIFBJID0gbWF0aC5QSSxcbiAgICByb3VuZCA9IG1hdGgucm91bmQsXG4gICAgRSA9IFwiXCIsXG4gICAgUyA9IFwiIFwiLFxuICAgIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBJU1VSTCA9IC9edXJsXFwoWydcIl0/KFteXFwpXSs/KVsnXCJdP1xcKSQvaSxcbiAgICBjb2xvdXJSZWdFeHAgPSAvXlxccyooKCNbYS1mXFxkXXs2fSl8KCNbYS1mXFxkXXszfSl8cmdiYT9cXChcXHMqKFtcXGRcXC5dKyU/XFxzKixcXHMqW1xcZFxcLl0rJT9cXHMqLFxccypbXFxkXFwuXSslPyg/OlxccyosXFxzKltcXGRcXC5dKyU/KT8pXFxzKlxcKXxoc2JhP1xcKFxccyooW1xcZFxcLl0rKD86ZGVnfFxceGIwfCUpP1xccyosXFxzKltcXGRcXC5dKyU/XFxzKixcXHMqW1xcZFxcLl0rKD86JT9cXHMqLFxccypbXFxkXFwuXSspPyU/KVxccypcXCl8aHNsYT9cXChcXHMqKFtcXGRcXC5dKyg/OmRlZ3xcXHhiMHwlKT9cXHMqLFxccypbXFxkXFwuXSslP1xccyosXFxzKltcXGRcXC5dKyg/OiU/XFxzKixcXHMqW1xcZFxcLl0rKT8lPylcXHMqXFwpKVxccyokL2ksXG4gICAgYmV6aWVycmcgPSAvXig/OmN1YmljLSk/YmV6aWVyXFwoKFteLF0rKSwoW14sXSspLChbXixdKyksKFteXFwpXSspXFwpLyxcbiAgICBzZXBhcmF0b3IgPSBTbmFwLl8uc2VwYXJhdG9yID0gL1ssXFxzXSsvLFxuICAgIHdoaXRlc3BhY2UgPSAvW1xcc10vZyxcbiAgICBjb21tYVNwYWNlcyA9IC9bXFxzXSosW1xcc10qLyxcbiAgICBoc3JnID0ge2hzOiAxLCByZzogMX0sXG4gICAgcGF0aENvbW1hbmQgPSAvKFthLXpdKVtcXHMsXSooKC0/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT9bXFxzXSosP1tcXHNdKikrKS9pZyxcbiAgICB0Q29tbWFuZCA9IC8oW3JzdG1dKVtcXHMsXSooKC0/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT9bXFxzXSosP1tcXHNdKikrKS9pZyxcbiAgICBwYXRoVmFsdWVzID0gLygtP1xcZCpcXC4/XFxkKig/OmVbXFwtK10/XFxkKyk/KVtcXHNdKiw/W1xcc10qL2lnLFxuICAgIGlkZ2VuID0gMCxcbiAgICBpZHByZWZpeCA9IFwiU1wiICsgKCtuZXcgRGF0ZSkudG9TdHJpbmcoMzYpLFxuICAgIElEID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHJldHVybiAoZWwgJiYgZWwudHlwZSA/IGVsLnR5cGUgOiBFKSArIGlkcHJlZml4ICsgKGlkZ2VuKyspLnRvU3RyaW5nKDM2KTtcbiAgICB9LFxuICAgIHhsaW5rID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gICAgeG1sbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgaHViID0ge30sXG4gICAgLypcXFxuICAgICAqIFNuYXAudXJsXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBXcmFwcyBwYXRoIGludG8gYFwidXJsKCc8cGF0aD4nKVwiYC5cbiAgICAgLSB2YWx1ZSAoc3RyaW5nKSBwYXRoXG4gICAgID0gKHN0cmluZykgd3JhcHBlZCBwYXRoXG4gICAgXFwqL1xuICAgIFVSTCA9IFNuYXAudXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICByZXR1cm4gXCJ1cmwoJyNcIiArIHVybCArIFwiJylcIjtcbiAgICB9O1xuXG5mdW5jdGlvbiAkKGVsLCBhdHRyKSB7XG4gICAgaWYgKGF0dHIpIHtcbiAgICAgICAgaWYgKGVsID09IFwiI3RleHRcIikge1xuICAgICAgICAgICAgZWwgPSBnbG9iLmRvYy5jcmVhdGVUZXh0Tm9kZShhdHRyLnRleHQgfHwgYXR0cltcIiN0ZXh0XCJdIHx8IFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbCA9PSBcIiNjb21tZW50XCIpIHtcbiAgICAgICAgICAgIGVsID0gZ2xvYi5kb2MuY3JlYXRlQ29tbWVudChhdHRyLnRleHQgfHwgYXR0cltcIiN0ZXh0XCJdIHx8IFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZWwgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZWwgPSAkKGVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGF0dHIgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKGVsLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0ci5zdWJzdHJpbmcoMCwgNikgPT0gXCJ4bGluazpcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlTlMoeGxpbmssIGF0dHIuc3Vic3RyaW5nKDYpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIuc3Vic3RyaW5nKDAsIDQpID09IFwieG1sOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGVOUyh4bWxucywgYXR0ci5zdWJzdHJpbmcoNCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhdHRyID09IFwidGV4dFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyKSBpZiAoYXR0cltoYXNdKGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gU3RyKGF0dHJba2V5XSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN1YnN0cmluZygwLCA2KSA9PSBcInhsaW5rOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGluaywga2V5LnN1YnN0cmluZyg2KSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkuc3Vic3RyaW5nKDAsIDQpID09IFwieG1sOlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bWxucywga2V5LnN1YnN0cmluZyg0KSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXCJ0ZXh0XCIgaW4gYXR0cikge1xuICAgICAgICAgICAgZWwubm9kZVZhbHVlID0gYXR0ci50ZXh0O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWwgPSBnbG9iLmRvYy5jcmVhdGVFbGVtZW50TlMoeG1sbnMsIGVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsO1xufVxuU25hcC5fLiQgPSAkO1xuU25hcC5fLmlkID0gSUQ7XG5mdW5jdGlvbiBnZXRBdHRycyhlbCkge1xuICAgIHZhciBhdHRycyA9IGVsLmF0dHJpYnV0ZXMsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG91dCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGF0dHJzW2ldLm5hbWVzcGFjZVVSSSA9PSB4bGluaykge1xuICAgICAgICAgICAgbmFtZSA9IFwieGxpbms6XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBuYW1lICs9IGF0dHJzW2ldLm5hbWU7XG4gICAgICAgIG91dFtuYW1lXSA9IGF0dHJzW2ldLnRleHRDb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuZnVuY3Rpb24gaXMobywgdHlwZSkge1xuICAgIHR5cGUgPSBTdHIucHJvdG90eXBlLnRvTG93ZXJDYXNlLmNhbGwodHlwZSk7XG4gICAgaWYgKHR5cGUgPT0gXCJmaW5pdGVcIikge1xuICAgICAgICByZXR1cm4gaXNGaW5pdGUobyk7XG4gICAgfVxuICAgIGlmICh0eXBlID09IFwiYXJyYXlcIiAmJlxuICAgICAgICAobyBpbnN0YW5jZW9mIEFycmF5IHx8IEFycmF5LmlzQXJyYXkgJiYgQXJyYXkuaXNBcnJheShvKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiAgdHlwZSA9PSBcIm51bGxcIiAmJiBvID09PSBudWxsIHx8XG4gICAgICAgICAgICB0eXBlID09IHR5cGVvZiBvICYmIG8gIT09IG51bGwgfHxcbiAgICAgICAgICAgIHR5cGUgPT0gXCJvYmplY3RcIiAmJiBvID09PSBPYmplY3QobykgfHxcbiAgICAgICAgICAgIG9iamVjdFRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkgPT0gdHlwZTtcbn1cbi8qXFxcbiAqIFNuYXAuZm9ybWF0XG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXBsYWNlcyBjb25zdHJ1Y3Rpb24gb2YgdHlwZSBgezxuYW1lPn1gIHRvIHRoZSBjb3JyZXNwb25kaW5nIGFyZ3VtZW50XG4gKipcbiAtIHRva2VuIChzdHJpbmcpIHN0cmluZyB0byBmb3JtYXRcbiAtIGpzb24gKG9iamVjdCkgb2JqZWN0IHdoaWNoIHByb3BlcnRpZXMgYXJlIHVzZWQgYXMgYSByZXBsYWNlbWVudFxuID0gKHN0cmluZykgZm9ybWF0dGVkIHN0cmluZ1xuID4gVXNhZ2VcbiB8IC8vIHRoaXMgZHJhd3MgYSByZWN0YW5ndWxhciBzaGFwZSBlcXVpdmFsZW50IHRvIFwiTTEwLDIwaDQwdjUwaC00MHpcIlxuIHwgcGFwZXIucGF0aChTbmFwLmZvcm1hdChcIk17eH0se3l9aHtkaW0ud2lkdGh9dntkaW0uaGVpZ2h0fWh7ZGltWyduZWdhdGl2ZSB3aWR0aCddfXpcIiwge1xuIHwgICAgIHg6IDEwLFxuIHwgICAgIHk6IDIwLFxuIHwgICAgIGRpbToge1xuIHwgICAgICAgICB3aWR0aDogNDAsXG4gfCAgICAgICAgIGhlaWdodDogNTAsXG4gfCAgICAgICAgIFwibmVnYXRpdmUgd2lkdGhcIjogLTQwXG4gfCAgICAgfVxuIHwgfSkpO1xuXFwqL1xuU25hcC5mb3JtYXQgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2tlblJlZ2V4ID0gL1xceyhbXlxcfV0rKVxcfS9nLFxuICAgICAgICBvYmpOb3RhdGlvblJlZ2V4ID0gLyg/Oig/Ol58XFwuKSguKz8pKD89XFxbfFxcLnwkfFxcKCl8XFxbKCd8XCIpKC4rPylcXDJcXF0pKFxcKFxcKSk/L2csIC8vIG1hdGNoZXMgLnh4eHh4IG9yIFtcInh4eHh4XCJdIHRvIHJ1biBvdmVyIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICAgIHJlcGxhY2VyID0gZnVuY3Rpb24gKGFsbCwga2V5LCBvYmopIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBvYmo7XG4gICAgICAgICAgICBrZXkucmVwbGFjZShvYmpOb3RhdGlvblJlZ2V4LCBmdW5jdGlvbiAoYWxsLCBuYW1lLCBxdW90ZSwgcXVvdGVkTmFtZSwgaXNGdW5jKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUgfHwgcXVvdGVkTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lIGluIHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiByZXMgPT0gXCJmdW5jdGlvblwiICYmIGlzRnVuYyAmJiAocmVzID0gcmVzKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzID0gKHJlcyA9PSBudWxsIHx8IHJlcyA9PSBvYmogPyBhbGwgOiByZXMpICsgXCJcIjtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdHIsIG9iaikge1xuICAgICAgICByZXR1cm4gU3RyKHN0cikucmVwbGFjZSh0b2tlblJlZ2V4LCBmdW5jdGlvbiAoYWxsLCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlcihhbGwsIGtleSwgb2JqKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pKCk7XG5mdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIgfHwgT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICB2YXIgcmVzID0gbmV3IG9iai5jb25zdHJ1Y3RvcjtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAob2JqW2hhc10oa2V5KSkge1xuICAgICAgICByZXNba2V5XSA9IGNsb25lKG9ialtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblNuYXAuXy5jbG9uZSA9IGNsb25lO1xuZnVuY3Rpb24gcmVwdXNoKGFycmF5LCBpdGVtKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYXJyYXkubGVuZ3RoOyBpIDwgaWk7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSB7XG4gICAgICAgIHJldHVybiBhcnJheS5wdXNoKGFycmF5LnNwbGljZShpLCAxKVswXSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2FjaGVyKGYsIHNjb3BlLCBwb3N0cHJvY2Vzc29yKSB7XG4gICAgZnVuY3Rpb24gbmV3ZigpIHtcbiAgICAgICAgdmFyIGFyZyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCksXG4gICAgICAgICAgICBhcmdzID0gYXJnLmpvaW4oXCJcXHUyNDAwXCIpLFxuICAgICAgICAgICAgY2FjaGUgPSBuZXdmLmNhY2hlID0gbmV3Zi5jYWNoZSB8fCB7fSxcbiAgICAgICAgICAgIGNvdW50ID0gbmV3Zi5jb3VudCA9IG5ld2YuY291bnQgfHwgW107XG4gICAgICAgIGlmIChjYWNoZVtoYXNdKGFyZ3MpKSB7XG4gICAgICAgICAgICByZXB1c2goY291bnQsIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3Rwcm9jZXNzb3IgPyBwb3N0cHJvY2Vzc29yKGNhY2hlW2FyZ3NdKSA6IGNhY2hlW2FyZ3NdO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50Lmxlbmd0aCA+PSAxZTMgJiYgZGVsZXRlIGNhY2hlW2NvdW50LnNoaWZ0KCldO1xuICAgICAgICBjb3VudC5wdXNoKGFyZ3MpO1xuICAgICAgICBjYWNoZVthcmdzXSA9IGYuYXBwbHkoc2NvcGUsIGFyZyk7XG4gICAgICAgIHJldHVybiBwb3N0cHJvY2Vzc29yID8gcG9zdHByb2Nlc3NvcihjYWNoZVthcmdzXSkgOiBjYWNoZVthcmdzXTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld2Y7XG59XG5TbmFwLl8uY2FjaGVyID0gY2FjaGVyO1xuZnVuY3Rpb24gYW5nbGUoeDEsIHkxLCB4MiwgeTIsIHgzLCB5Mykge1xuICAgIGlmICh4MyA9PSBudWxsKSB7XG4gICAgICAgIHZhciB4ID0geDEgLSB4MixcbiAgICAgICAgICAgIHkgPSB5MSAtIHkyO1xuICAgICAgICBpZiAoIXggJiYgIXkpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoMTgwICsgbWF0aC5hdGFuMigteSwgLXgpICogMTgwIC8gUEkgKyAzNjApICUgMzYwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhbmdsZSh4MSwgeTEsIHgzLCB5MykgLSBhbmdsZSh4MiwgeTIsIHgzLCB5Myk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmFkKGRlZykge1xuICAgIHJldHVybiBkZWcgJSAzNjAgKiBQSSAvIDE4MDtcbn1cbmZ1bmN0aW9uIGRlZyhyYWQpIHtcbiAgICByZXR1cm4gcmFkICogMTgwIC8gUEkgJSAzNjA7XG59XG5mdW5jdGlvbiB4X3koKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIFMgKyB0aGlzLnk7XG59XG5mdW5jdGlvbiB4X3lfd19oKCkge1xuICAgIHJldHVybiB0aGlzLnggKyBTICsgdGhpcy55ICsgUyArIHRoaXMud2lkdGggKyBcIiBcXHhkNyBcIiArIHRoaXMuaGVpZ2h0O1xufVxuXG4vKlxcXG4gKiBTbmFwLnJhZFxuIFsgbWV0aG9kIF1cbiAqKlxuICogVHJhbnNmb3JtIGFuZ2xlIHRvIHJhZGlhbnNcbiAtIGRlZyAobnVtYmVyKSBhbmdsZSBpbiBkZWdyZWVzXG4gPSAobnVtYmVyKSBhbmdsZSBpbiByYWRpYW5zXG5cXCovXG5TbmFwLnJhZCA9IHJhZDtcbi8qXFxcbiAqIFNuYXAuZGVnXG4gWyBtZXRob2QgXVxuICoqXG4gKiBUcmFuc2Zvcm0gYW5nbGUgdG8gZGVncmVlc1xuIC0gcmFkIChudW1iZXIpIGFuZ2xlIGluIHJhZGlhbnNcbiA9IChudW1iZXIpIGFuZ2xlIGluIGRlZ3JlZXNcblxcKi9cblNuYXAuZGVnID0gZGVnO1xuLypcXFxuICogU25hcC5zaW5cbiBbIG1ldGhvZCBdXG4gKipcbiAqIEVxdWl2YWxlbnQgdG8gYE1hdGguc2luKClgIG9ubHkgd29ya3Mgd2l0aCBkZWdyZWVzLCBub3QgcmFkaWFucy5cbiAtIGFuZ2xlIChudW1iZXIpIGFuZ2xlIGluIGRlZ3JlZXNcbiA9IChudW1iZXIpIHNpblxuXFwqL1xuU25hcC5zaW4gPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICByZXR1cm4gbWF0aC5zaW4oU25hcC5yYWQoYW5nbGUpKTtcbn07XG4vKlxcXG4gKiBTbmFwLnRhblxuIFsgbWV0aG9kIF1cbiAqKlxuICogRXF1aXZhbGVudCB0byBgTWF0aC50YW4oKWAgb25seSB3b3JrcyB3aXRoIGRlZ3JlZXMsIG5vdCByYWRpYW5zLlxuIC0gYW5nbGUgKG51bWJlcikgYW5nbGUgaW4gZGVncmVlc1xuID0gKG51bWJlcikgdGFuXG5cXCovXG5TbmFwLnRhbiA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICAgIHJldHVybiBtYXRoLnRhbihTbmFwLnJhZChhbmdsZSkpO1xufTtcbi8qXFxcbiAqIFNuYXAuY29zXG4gWyBtZXRob2QgXVxuICoqXG4gKiBFcXVpdmFsZW50IHRvIGBNYXRoLmNvcygpYCBvbmx5IHdvcmtzIHdpdGggZGVncmVlcywgbm90IHJhZGlhbnMuXG4gLSBhbmdsZSAobnVtYmVyKSBhbmdsZSBpbiBkZWdyZWVzXG4gPSAobnVtYmVyKSBjb3NcblxcKi9cblNuYXAuY29zID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgcmV0dXJuIG1hdGguY29zKFNuYXAucmFkKGFuZ2xlKSk7XG59O1xuLypcXFxuICogU25hcC5hc2luXG4gWyBtZXRob2QgXVxuICoqXG4gKiBFcXVpdmFsZW50IHRvIGBNYXRoLmFzaW4oKWAgb25seSB3b3JrcyB3aXRoIGRlZ3JlZXMsIG5vdCByYWRpYW5zLlxuIC0gbnVtIChudW1iZXIpIHZhbHVlXG4gPSAobnVtYmVyKSBhc2luIGluIGRlZ3JlZXNcblxcKi9cblNuYXAuYXNpbiA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICByZXR1cm4gU25hcC5kZWcobWF0aC5hc2luKG51bSkpO1xufTtcbi8qXFxcbiAqIFNuYXAuYWNvc1xuIFsgbWV0aG9kIF1cbiAqKlxuICogRXF1aXZhbGVudCB0byBgTWF0aC5hY29zKClgIG9ubHkgd29ya3Mgd2l0aCBkZWdyZWVzLCBub3QgcmFkaWFucy5cbiAtIG51bSAobnVtYmVyKSB2YWx1ZVxuID0gKG51bWJlcikgYWNvcyBpbiBkZWdyZWVzXG5cXCovXG5TbmFwLmFjb3MgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgcmV0dXJuIFNuYXAuZGVnKG1hdGguYWNvcyhudW0pKTtcbn07XG4vKlxcXG4gKiBTbmFwLmF0YW5cbiBbIG1ldGhvZCBdXG4gKipcbiAqIEVxdWl2YWxlbnQgdG8gYE1hdGguYXRhbigpYCBvbmx5IHdvcmtzIHdpdGggZGVncmVlcywgbm90IHJhZGlhbnMuXG4gLSBudW0gKG51bWJlcikgdmFsdWVcbiA9IChudW1iZXIpIGF0YW4gaW4gZGVncmVlc1xuXFwqL1xuU25hcC5hdGFuID0gZnVuY3Rpb24gKG51bSkge1xuICAgIHJldHVybiBTbmFwLmRlZyhtYXRoLmF0YW4obnVtKSk7XG59O1xuLypcXFxuICogU25hcC5hdGFuMlxuIFsgbWV0aG9kIF1cbiAqKlxuICogRXF1aXZhbGVudCB0byBgTWF0aC5hdGFuMigpYCBvbmx5IHdvcmtzIHdpdGggZGVncmVlcywgbm90IHJhZGlhbnMuXG4gLSBudW0gKG51bWJlcikgdmFsdWVcbiA9IChudW1iZXIpIGF0YW4yIGluIGRlZ3JlZXNcblxcKi9cblNuYXAuYXRhbjIgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgcmV0dXJuIFNuYXAuZGVnKG1hdGguYXRhbjIobnVtKSk7XG59O1xuLypcXFxuICogU25hcC5hbmdsZVxuIFsgbWV0aG9kIF1cbiAqKlxuICogUmV0dXJucyBhbiBhbmdsZSBiZXR3ZWVuIHR3byBvciB0aHJlZSBwb2ludHNcbiAtIHgxIChudW1iZXIpIHggY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHkxIChudW1iZXIpIHkgY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHgyIChudW1iZXIpIHggY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gLSB5MiAobnVtYmVyKSB5IGNvb3JkIG9mIHNlY29uZCBwb2ludFxuIC0geDMgKG51bWJlcikgI29wdGlvbmFsIHggY29vcmQgb2YgdGhpcmQgcG9pbnRcbiAtIHkzIChudW1iZXIpICNvcHRpb25hbCB5IGNvb3JkIG9mIHRoaXJkIHBvaW50XG4gPSAobnVtYmVyKSBhbmdsZSBpbiBkZWdyZWVzXG5cXCovXG5TbmFwLmFuZ2xlID0gYW5nbGU7XG4vKlxcXG4gKiBTbmFwLmxlblxuIFsgbWV0aG9kIF1cbiAqKlxuICogUmV0dXJucyBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAtIHgxIChudW1iZXIpIHggY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHkxIChudW1iZXIpIHkgY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHgyIChudW1iZXIpIHggY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gLSB5MiAobnVtYmVyKSB5IGNvb3JkIG9mIHNlY29uZCBwb2ludFxuID0gKG51bWJlcikgZGlzdGFuY2VcblxcKi9cblNuYXAubGVuID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydChTbmFwLmxlbjIoeDEsIHkxLCB4MiwgeTIpKTtcbn07XG4vKlxcXG4gKiBTbmFwLmxlbjJcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFJldHVybnMgc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAtIHgxIChudW1iZXIpIHggY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHkxIChudW1iZXIpIHkgY29vcmQgb2YgZmlyc3QgcG9pbnRcbiAtIHgyIChudW1iZXIpIHggY29vcmQgb2Ygc2Vjb25kIHBvaW50XG4gLSB5MiAobnVtYmVyKSB5IGNvb3JkIG9mIHNlY29uZCBwb2ludFxuID0gKG51bWJlcikgZGlzdGFuY2VcblxcKi9cblNuYXAubGVuMiA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiAoeDEgLSB4MikgKiAoeDEgLSB4MikgKyAoeTEgLSB5MikgKiAoeTEgLSB5Mik7XG59O1xuLypcXFxuICogU25hcC5jbG9zZXN0UG9pbnRcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFJldHVybnMgY2xvc2VzdCBwb2ludCB0byBhIGdpdmVuIG9uZSBvbiBhIGdpdmVuIHBhdGguXG4gLSBwYXRoIChFbGVtZW50KSBwYXRoIGVsZW1lbnRcbiAtIHggKG51bWJlcikgeCBjb29yZCBvZiBhIHBvaW50XG4gLSB5IChudW1iZXIpIHkgY29vcmQgb2YgYSBwb2ludFxuID0gKG9iamVjdCkgaW4gZm9ybWF0XG4ge1xuICAgIHggKG51bWJlcikgeCBjb29yZCBvZiB0aGUgcG9pbnQgb24gdGhlIHBhdGhcbiAgICB5IChudW1iZXIpIHkgY29vcmQgb2YgdGhlIHBvaW50IG9uIHRoZSBwYXRoXG4gICAgbGVuZ3RoIChudW1iZXIpIGxlbmd0aCBvZiB0aGUgcGF0aCB0byB0aGUgcG9pbnRcbiAgICBkaXN0YW5jZSAobnVtYmVyKSBkaXN0YW5jZSBmcm9tIHRoZSBnaXZlbiBwb2ludCB0byB0aGUgcGF0aFxuIH1cblxcKi9cbi8vIENvcGllZCBmcm9tIGh0dHA6Ly9ibC5vY2tzLm9yZy9tYm9zdG9jay84MDI3NjM3XG5TbmFwLmNsb3Nlc3RQb2ludCA9IGZ1bmN0aW9uIChwYXRoLCB4LCB5KSB7XG4gICAgZnVuY3Rpb24gZGlzdGFuY2UyKHApIHtcbiAgICAgICAgdmFyIGR4ID0gcC54IC0geCxcbiAgICAgICAgICAgIGR5ID0gcC55IC0geTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xuICAgIH1cbiAgICB2YXIgcGF0aE5vZGUgPSBwYXRoLm5vZGUsXG4gICAgICAgIHBhdGhMZW5ndGggPSBwYXRoTm9kZS5nZXRUb3RhbExlbmd0aCgpLFxuICAgICAgICBwcmVjaXNpb24gPSBwYXRoTGVuZ3RoIC8gcGF0aE5vZGUucGF0aFNlZ0xpc3QubnVtYmVyT2ZJdGVtcyAqIC4xMjUsXG4gICAgICAgIGJlc3QsXG4gICAgICAgIGJlc3RMZW5ndGgsXG4gICAgICAgIGJlc3REaXN0YW5jZSA9IEluZmluaXR5O1xuXG4gICAgLy8gbGluZWFyIHNjYW4gZm9yIGNvYXJzZSBhcHByb3hpbWF0aW9uXG4gICAgZm9yICh2YXIgc2Nhbiwgc2Nhbkxlbmd0aCA9IDAsIHNjYW5EaXN0YW5jZTsgc2Nhbkxlbmd0aCA8PSBwYXRoTGVuZ3RoOyBzY2FuTGVuZ3RoICs9IHByZWNpc2lvbikge1xuICAgICAgICBpZiAoKHNjYW5EaXN0YW5jZSA9IGRpc3RhbmNlMihzY2FuID0gcGF0aE5vZGUuZ2V0UG9pbnRBdExlbmd0aChzY2FuTGVuZ3RoKSkpIDwgYmVzdERpc3RhbmNlKSB7XG4gICAgICAgICAgICBiZXN0ID0gc2NhbjtcbiAgICAgICAgICAgIGJlc3RMZW5ndGggPSBzY2FuTGVuZ3RoO1xuICAgICAgICAgICAgYmVzdERpc3RhbmNlID0gc2NhbkRpc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYmluYXJ5IHNlYXJjaCBmb3IgcHJlY2lzZSBlc3RpbWF0ZVxuICAgIHByZWNpc2lvbiAqPSAuNTtcbiAgICB3aGlsZSAocHJlY2lzaW9uID4gLjUpIHtcbiAgICAgICAgdmFyIGJlZm9yZSxcbiAgICAgICAgICAgIGFmdGVyLFxuICAgICAgICAgICAgYmVmb3JlTGVuZ3RoLFxuICAgICAgICAgICAgYWZ0ZXJMZW5ndGgsXG4gICAgICAgICAgICBiZWZvcmVEaXN0YW5jZSxcbiAgICAgICAgICAgIGFmdGVyRGlzdGFuY2U7XG4gICAgICAgIGlmICgoYmVmb3JlTGVuZ3RoID0gYmVzdExlbmd0aCAtIHByZWNpc2lvbikgPj0gMCAmJiAoYmVmb3JlRGlzdGFuY2UgPSBkaXN0YW5jZTIoYmVmb3JlID0gcGF0aE5vZGUuZ2V0UG9pbnRBdExlbmd0aChiZWZvcmVMZW5ndGgpKSkgPCBiZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIGJlc3QgPSBiZWZvcmU7XG4gICAgICAgICAgICBiZXN0TGVuZ3RoID0gYmVmb3JlTGVuZ3RoO1xuICAgICAgICAgICAgYmVzdERpc3RhbmNlID0gYmVmb3JlRGlzdGFuY2U7XG4gICAgICAgIH0gZWxzZSBpZiAoKGFmdGVyTGVuZ3RoID0gYmVzdExlbmd0aCArIHByZWNpc2lvbikgPD0gcGF0aExlbmd0aCAmJiAoYWZ0ZXJEaXN0YW5jZSA9IGRpc3RhbmNlMihhZnRlciA9IHBhdGhOb2RlLmdldFBvaW50QXRMZW5ndGgoYWZ0ZXJMZW5ndGgpKSkgPCBiZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIGJlc3QgPSBhZnRlcjtcbiAgICAgICAgICAgIGJlc3RMZW5ndGggPSBhZnRlckxlbmd0aDtcbiAgICAgICAgICAgIGJlc3REaXN0YW5jZSA9IGFmdGVyRGlzdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gKj0gLjU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiZXN0ID0ge1xuICAgICAgICB4OiBiZXN0LngsXG4gICAgICAgIHk6IGJlc3QueSxcbiAgICAgICAgbGVuZ3RoOiBiZXN0TGVuZ3RoLFxuICAgICAgICBkaXN0YW5jZTogTWF0aC5zcXJ0KGJlc3REaXN0YW5jZSlcbiAgICB9O1xuICAgIHJldHVybiBiZXN0O1xufVxuLypcXFxuICogU25hcC5pc1xuIFsgbWV0aG9kIF1cbiAqKlxuICogSGFuZHkgcmVwbGFjZW1lbnQgZm9yIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuIC0gbyAo4oCmKSBhbnkgb2JqZWN0IG9yIHByaW1pdGl2ZVxuIC0gdHlwZSAoc3RyaW5nKSBuYW1lIG9mIHRoZSB0eXBlLCBlLmcuLCBgc3RyaW5nYCwgYGZ1bmN0aW9uYCwgYG51bWJlcmAsIGV0Yy5cbiA9IChib29sZWFuKSBgdHJ1ZWAgaWYgZ2l2ZW4gdmFsdWUgaXMgb2YgZ2l2ZW4gdHlwZVxuXFwqL1xuU25hcC5pcyA9IGlzO1xuLypcXFxuICogU25hcC5zbmFwVG9cbiBbIG1ldGhvZCBdXG4gKipcbiAqIFNuYXBzIGdpdmVuIHZhbHVlIHRvIGdpdmVuIGdyaWRcbiAtIHZhbHVlcyAoYXJyYXl8bnVtYmVyKSBnaXZlbiBhcnJheSBvZiB2YWx1ZXMgb3Igc3RlcCBvZiB0aGUgZ3JpZFxuIC0gdmFsdWUgKG51bWJlcikgdmFsdWUgdG8gYWRqdXN0XG4gLSB0b2xlcmFuY2UgKG51bWJlcikgI29wdGlvbmFsIG1heGltdW0gZGlzdGFuY2UgdG8gdGhlIHRhcmdldCB2YWx1ZSB0aGF0IHdvdWxkIHRyaWdnZXIgdGhlIHNuYXAuIERlZmF1bHQgaXMgYDEwYC5cbiA9IChudW1iZXIpIGFkanVzdGVkIHZhbHVlXG5cXCovXG5TbmFwLnNuYXBUbyA9IGZ1bmN0aW9uICh2YWx1ZXMsIHZhbHVlLCB0b2xlcmFuY2UpIHtcbiAgICB0b2xlcmFuY2UgPSBpcyh0b2xlcmFuY2UsIFwiZmluaXRlXCIpID8gdG9sZXJhbmNlIDogMTA7XG4gICAgaWYgKGlzKHZhbHVlcywgXCJhcnJheVwiKSkge1xuICAgICAgICB2YXIgaSA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIGlmIChhYnModmFsdWVzW2ldIC0gdmFsdWUpIDw9IHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1tpXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcyA9ICt2YWx1ZXM7XG4gICAgICAgIHZhciByZW0gPSB2YWx1ZSAlIHZhbHVlcztcbiAgICAgICAgaWYgKHJlbSA8IHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIC0gcmVtO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZW0gPiB2YWx1ZXMgLSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAtIHJlbSArIHZhbHVlcztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuLy8gQ29sb3VyXG4vKlxcXG4gKiBTbmFwLmdldFJHQlxuIFsgbWV0aG9kIF1cbiAqKlxuICogUGFyc2VzIGNvbG9yIHN0cmluZyBhcyBSR0Igb2JqZWN0XG4gLSBjb2xvciAoc3RyaW5nKSBjb2xvciBzdHJpbmcgaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0czpcbiAjIDx1bD5cbiAjICAgICA8bGk+Q29sb3IgbmFtZSAoPGNvZGU+cmVkPC9jb2RlPiwgPGNvZGU+Z3JlZW48L2NvZGU+LCA8Y29kZT5jb3JuZmxvd2VyYmx1ZTwvY29kZT4sIGV0Yyk8L2xpPlxuICMgICAgIDxsaT4j4oCi4oCi4oCiIOKAlCBzaG9ydGVuZWQgSFRNTCBjb2xvcjogKDxjb2RlPiMwMDA8L2NvZGU+LCA8Y29kZT4jZmMwPC9jb2RlPiwgZXRjLik8L2xpPlxuICMgICAgIDxsaT4j4oCi4oCi4oCi4oCi4oCi4oCiIOKAlCBmdWxsIGxlbmd0aCBIVE1MIGNvbG9yOiAoPGNvZGU+IzAwMDAwMDwvY29kZT4sIDxjb2RlPiNiZDIzMDA8L2NvZGU+KTwvbGk+XG4gIyAgICAgPGxpPnJnYijigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiKSDigJQgcmVkLCBncmVlbiBhbmQgYmx1ZSBjaGFubmVscyB2YWx1ZXM6ICg8Y29kZT5yZ2IoMjAwLCZuYnNwOzEwMCwmbmJzcDswKTwvY29kZT4pPC9saT5cbiAjICAgICA8bGk+cmdiYSjigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyAgICAgPGxpPnJnYijigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlKSDigJQgc2FtZSBhcyBhYm92ZSwgYnV0IGluICU6ICg8Y29kZT5yZ2IoMTAwJSwmbmJzcDsxNzUlLCZuYnNwOzAlKTwvY29kZT4pPC9saT5cbiAjICAgICA8bGk+cmdiYSjigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlKSDigJQgYWxzbyB3aXRoIG9wYWNpdHk8L2xpPlxuICMgICAgIDxsaT5oc2Io4oCi4oCi4oCiLCDigKLigKLigKIsIOKAouKAouKAoikg4oCUIGh1ZSwgc2F0dXJhdGlvbiBhbmQgYnJpZ2h0bmVzcyB2YWx1ZXM6ICg8Y29kZT5oc2IoMC41LCZuYnNwOzAuMjUsJm5ic3A7MSk8L2NvZGU+KTwvbGk+XG4gIyAgICAgPGxpPmhzYmEo4oCi4oCi4oCiLCDigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiKSDigJQgYWxzbyB3aXRoIG9wYWNpdHk8L2xpPlxuICMgICAgIDxsaT5oc2Io4oCi4oCi4oCiJSwg4oCi4oCi4oCiJSwg4oCi4oCi4oCiJSkg4oCUIHNhbWUgYXMgYWJvdmUsIGJ1dCBpbiAlPC9saT5cbiAjICAgICA8bGk+aHNiYSjigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlKSDigJQgYWxzbyB3aXRoIG9wYWNpdHk8L2xpPlxuICMgICAgIDxsaT5oc2wo4oCi4oCi4oCiLCDigKLigKLigKIsIOKAouKAouKAoikg4oCUIGh1ZSwgc2F0dXJhdGlvbiBhbmQgbHVtaW5vc2l0eSB2YWx1ZXM6ICg8Y29kZT5oc2IoMC41LCZuYnNwOzAuMjUsJm5ic3A7MC41KTwvY29kZT4pPC9saT5cbiAjICAgICA8bGk+aHNsYSjigKLigKLigKIsIOKAouKAouKAoiwg4oCi4oCi4oCiLCDigKLigKLigKIpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyAgICAgPGxpPmhzbCjigKLigKLigKIlLCDigKLigKLigKIlLCDigKLigKLigKIlKSDigJQgc2FtZSBhcyBhYm92ZSwgYnV0IGluICU8L2xpPlxuICMgICAgIDxsaT5oc2xhKOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUsIOKAouKAouKAoiUpIOKAlCBhbHNvIHdpdGggb3BhY2l0eTwvbGk+XG4gIyA8L3VsPlxuICogTm90ZSB0aGF0IGAlYCBjYW4gYmUgdXNlZCBhbnkgdGltZTogYHJnYigyMCUsIDI1NSwgNTAlKWAuXG4gPSAob2JqZWN0KSBSR0Igb2JqZWN0IGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuIG8ge1xuIG8gICAgIHIgKG51bWJlcikgcmVkLFxuIG8gICAgIGcgKG51bWJlcikgZ3JlZW4sXG4gbyAgICAgYiAobnVtYmVyKSBibHVlLFxuIG8gICAgIGhleCAoc3RyaW5nKSBjb2xvciBpbiBIVE1ML0NTUyBmb3JtYXQ6ICPigKLigKLigKLigKLigKLigKIsXG4gbyAgICAgZXJyb3IgKGJvb2xlYW4pIHRydWUgaWYgc3RyaW5nIGNhbid0IGJlIHBhcnNlZFxuIG8gfVxuXFwqL1xuU25hcC5nZXRSR0IgPSBjYWNoZXIoZnVuY3Rpb24gKGNvbG91cikge1xuICAgIGlmICghY29sb3VyIHx8ICEhKChjb2xvdXIgPSBTdHIoY29sb3VyKSkuaW5kZXhPZihcIi1cIikgKyAxKSkge1xuICAgICAgICByZXR1cm4ge3I6IC0xLCBnOiAtMSwgYjogLTEsIGhleDogXCJub25lXCIsIGVycm9yOiAxLCB0b1N0cmluZzogcmdidG9TdHJpbmd9O1xuICAgIH1cbiAgICBpZiAoY29sb3VyID09IFwibm9uZVwiKSB7XG4gICAgICAgIHJldHVybiB7cjogLTEsIGc6IC0xLCBiOiAtMSwgaGV4OiBcIm5vbmVcIiwgdG9TdHJpbmc6IHJnYnRvU3RyaW5nfTtcbiAgICB9XG4gICAgIShoc3JnW2hhc10oY29sb3VyLnRvTG93ZXJDYXNlKCkuc3Vic3RyaW5nKDAsIDIpKSB8fCBjb2xvdXIuY2hhckF0KCkgPT0gXCIjXCIpICYmIChjb2xvdXIgPSB0b0hleChjb2xvdXIpKTtcbiAgICBpZiAoIWNvbG91cikge1xuICAgICAgICByZXR1cm4ge3I6IC0xLCBnOiAtMSwgYjogLTEsIGhleDogXCJub25lXCIsIGVycm9yOiAxLCB0b1N0cmluZzogcmdidG9TdHJpbmd9O1xuICAgIH1cbiAgICB2YXIgcmVzLFxuICAgICAgICByZWQsXG4gICAgICAgIGdyZWVuLFxuICAgICAgICBibHVlLFxuICAgICAgICBvcGFjaXR5LFxuICAgICAgICB0LFxuICAgICAgICB2YWx1ZXMsXG4gICAgICAgIHJnYiA9IGNvbG91ci5tYXRjaChjb2xvdXJSZWdFeHApO1xuICAgIGlmIChyZ2IpIHtcbiAgICAgICAgaWYgKHJnYlsyXSkge1xuICAgICAgICAgICAgYmx1ZSA9IHRvSW50KHJnYlsyXS5zdWJzdHJpbmcoNSksIDE2KTtcbiAgICAgICAgICAgIGdyZWVuID0gdG9JbnQocmdiWzJdLnN1YnN0cmluZygzLCA1KSwgMTYpO1xuICAgICAgICAgICAgcmVkID0gdG9JbnQocmdiWzJdLnN1YnN0cmluZygxLCAzKSwgMTYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZ2JbM10pIHtcbiAgICAgICAgICAgIGJsdWUgPSB0b0ludCgodCA9IHJnYlszXS5jaGFyQXQoMykpICsgdCwgMTYpO1xuICAgICAgICAgICAgZ3JlZW4gPSB0b0ludCgodCA9IHJnYlszXS5jaGFyQXQoMikpICsgdCwgMTYpO1xuICAgICAgICAgICAgcmVkID0gdG9JbnQoKHQgPSByZ2JbM10uY2hhckF0KDEpKSArIHQsIDE2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmdiWzRdKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSByZ2JbNF0uc3BsaXQoY29tbWFTcGFjZXMpO1xuICAgICAgICAgICAgcmVkID0gdG9GbG9hdCh2YWx1ZXNbMF0pO1xuICAgICAgICAgICAgdmFsdWVzWzBdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAocmVkICo9IDIuNTUpO1xuICAgICAgICAgICAgZ3JlZW4gPSB0b0Zsb2F0KHZhbHVlc1sxXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMV0uc2xpY2UoLTEpID09IFwiJVwiICYmIChncmVlbiAqPSAyLjU1KTtcbiAgICAgICAgICAgIGJsdWUgPSB0b0Zsb2F0KHZhbHVlc1syXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMl0uc2xpY2UoLTEpID09IFwiJVwiICYmIChibHVlICo9IDIuNTUpO1xuICAgICAgICAgICAgcmdiWzFdLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgNCkgPT0gXCJyZ2JhXCIgJiYgKG9wYWNpdHkgPSB0b0Zsb2F0KHZhbHVlc1szXSkpO1xuICAgICAgICAgICAgdmFsdWVzWzNdICYmIHZhbHVlc1szXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKG9wYWNpdHkgLz0gMTAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmdiWzVdKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSByZ2JbNV0uc3BsaXQoY29tbWFTcGFjZXMpO1xuICAgICAgICAgICAgcmVkID0gdG9GbG9hdCh2YWx1ZXNbMF0pO1xuICAgICAgICAgICAgdmFsdWVzWzBdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAocmVkIC89IDEwMCk7XG4gICAgICAgICAgICBncmVlbiA9IHRvRmxvYXQodmFsdWVzWzFdKTtcbiAgICAgICAgICAgIHZhbHVlc1sxXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKGdyZWVuIC89IDEwMCk7XG4gICAgICAgICAgICBibHVlID0gdG9GbG9hdCh2YWx1ZXNbMl0pO1xuICAgICAgICAgICAgdmFsdWVzWzJdLnNsaWNlKC0xKSA9PSBcIiVcIiAmJiAoYmx1ZSAvPSAxMDApO1xuICAgICAgICAgICAgKHZhbHVlc1swXS5zbGljZSgtMykgPT0gXCJkZWdcIiB8fCB2YWx1ZXNbMF0uc2xpY2UoLTEpID09IFwiXFx4YjBcIikgJiYgKHJlZCAvPSAzNjApO1xuICAgICAgICAgICAgcmdiWzFdLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgNCkgPT0gXCJoc2JhXCIgJiYgKG9wYWNpdHkgPSB0b0Zsb2F0KHZhbHVlc1szXSkpO1xuICAgICAgICAgICAgdmFsdWVzWzNdICYmIHZhbHVlc1szXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKG9wYWNpdHkgLz0gMTAwKTtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLmhzYjJyZ2IocmVkLCBncmVlbiwgYmx1ZSwgb3BhY2l0eSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJnYls2XSkge1xuICAgICAgICAgICAgdmFsdWVzID0gcmdiWzZdLnNwbGl0KGNvbW1hU3BhY2VzKTtcbiAgICAgICAgICAgIHJlZCA9IHRvRmxvYXQodmFsdWVzWzBdKTtcbiAgICAgICAgICAgIHZhbHVlc1swXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKHJlZCAvPSAxMDApO1xuICAgICAgICAgICAgZ3JlZW4gPSB0b0Zsb2F0KHZhbHVlc1sxXSk7XG4gICAgICAgICAgICB2YWx1ZXNbMV0uc2xpY2UoLTEpID09IFwiJVwiICYmIChncmVlbiAvPSAxMDApO1xuICAgICAgICAgICAgYmx1ZSA9IHRvRmxvYXQodmFsdWVzWzJdKTtcbiAgICAgICAgICAgIHZhbHVlc1syXS5zbGljZSgtMSkgPT0gXCIlXCIgJiYgKGJsdWUgLz0gMTAwKTtcbiAgICAgICAgICAgICh2YWx1ZXNbMF0uc2xpY2UoLTMpID09IFwiZGVnXCIgfHwgdmFsdWVzWzBdLnNsaWNlKC0xKSA9PSBcIlxceGIwXCIpICYmIChyZWQgLz0gMzYwKTtcbiAgICAgICAgICAgIHJnYlsxXS50b0xvd2VyQ2FzZSgpLnNsaWNlKDAsIDQpID09IFwiaHNsYVwiICYmIChvcGFjaXR5ID0gdG9GbG9hdCh2YWx1ZXNbM10pKTtcbiAgICAgICAgICAgIHZhbHVlc1szXSAmJiB2YWx1ZXNbM10uc2xpY2UoLTEpID09IFwiJVwiICYmIChvcGFjaXR5IC89IDEwMCk7XG4gICAgICAgICAgICByZXR1cm4gU25hcC5oc2wycmdiKHJlZCwgZ3JlZW4sIGJsdWUsIG9wYWNpdHkpO1xuICAgICAgICB9XG4gICAgICAgIHJlZCA9IG1taW4obWF0aC5yb3VuZChyZWQpLCAyNTUpO1xuICAgICAgICBncmVlbiA9IG1taW4obWF0aC5yb3VuZChncmVlbiksIDI1NSk7XG4gICAgICAgIGJsdWUgPSBtbWluKG1hdGgucm91bmQoYmx1ZSksIDI1NSk7XG4gICAgICAgIG9wYWNpdHkgPSBtbWluKG1tYXgob3BhY2l0eSwgMCksIDEpO1xuICAgICAgICByZ2IgPSB7cjogcmVkLCBnOiBncmVlbiwgYjogYmx1ZSwgdG9TdHJpbmc6IHJnYnRvU3RyaW5nfTtcbiAgICAgICAgcmdiLmhleCA9IFwiI1wiICsgKDE2Nzc3MjE2IHwgYmx1ZSB8IGdyZWVuIDw8IDggfCByZWQgPDwgMTYpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbiAgICAgICAgcmdiLm9wYWNpdHkgPSBpcyhvcGFjaXR5LCBcImZpbml0ZVwiKSA/IG9wYWNpdHkgOiAxO1xuICAgICAgICByZXR1cm4gcmdiO1xuICAgIH1cbiAgICByZXR1cm4ge3I6IC0xLCBnOiAtMSwgYjogLTEsIGhleDogXCJub25lXCIsIGVycm9yOiAxLCB0b1N0cmluZzogcmdidG9TdHJpbmd9O1xufSwgU25hcCk7XG4vKlxcXG4gKiBTbmFwLmhzYlxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgSFNCIHZhbHVlcyB0byBhIGhleCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29sb3JcbiAtIGggKG51bWJlcikgaHVlXG4gLSBzIChudW1iZXIpIHNhdHVyYXRpb25cbiAtIGIgKG51bWJlcikgdmFsdWUgb3IgYnJpZ2h0bmVzc1xuID0gKHN0cmluZykgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xvclxuXFwqL1xuU25hcC5oc2IgPSBjYWNoZXIoZnVuY3Rpb24gKGgsIHMsIGIpIHtcbiAgICByZXR1cm4gU25hcC5oc2IycmdiKGgsIHMsIGIpLmhleDtcbn0pO1xuLypcXFxuICogU25hcC5oc2xcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENvbnZlcnRzIEhTTCB2YWx1ZXMgdG8gYSBoZXggcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbG9yXG4gLSBoIChudW1iZXIpIGh1ZVxuIC0gcyAobnVtYmVyKSBzYXR1cmF0aW9uXG4gLSBsIChudW1iZXIpIGx1bWlub3NpdHlcbiA9IChzdHJpbmcpIGhleCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29sb3JcblxcKi9cblNuYXAuaHNsID0gY2FjaGVyKGZ1bmN0aW9uIChoLCBzLCBsKSB7XG4gICAgcmV0dXJuIFNuYXAuaHNsMnJnYihoLCBzLCBsKS5oZXg7XG59KTtcbi8qXFxcbiAqIFNuYXAucmdiXG4gWyBtZXRob2QgXVxuICoqXG4gKiBDb252ZXJ0cyBSR0IgdmFsdWVzIHRvIGEgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xvclxuIC0gciAobnVtYmVyKSByZWRcbiAtIGcgKG51bWJlcikgZ3JlZW5cbiAtIGIgKG51bWJlcikgYmx1ZVxuID0gKHN0cmluZykgaGV4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb2xvclxuXFwqL1xuU25hcC5yZ2IgPSBjYWNoZXIoZnVuY3Rpb24gKHIsIGcsIGIsIG8pIHtcbiAgICBpZiAoaXMobywgXCJmaW5pdGVcIikpIHtcbiAgICAgICAgdmFyIHJvdW5kID0gbWF0aC5yb3VuZDtcbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIFtyb3VuZChyKSwgcm91bmQoZyksIHJvdW5kKGIpLCArby50b0ZpeGVkKDIpXSArIFwiKVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIjXCIgKyAoMTY3NzcyMTYgfCBiIHwgZyA8PCA4IHwgciA8PCAxNikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufSk7XG52YXIgdG9IZXggPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICB2YXIgaSA9IGdsb2IuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSB8fCBnbG9iLmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN2Z1wiKVswXSxcbiAgICAgICAgcmVkID0gXCJyZ2IoMjU1LCAwLCAwKVwiO1xuICAgIHRvSGV4ID0gY2FjaGVyKGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInJlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVkO1xuICAgICAgICB9XG4gICAgICAgIGkuc3R5bGUuY29sb3IgPSByZWQ7XG4gICAgICAgIGkuc3R5bGUuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdmFyIG91dCA9IGdsb2IuZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoaSwgRSkuZ2V0UHJvcGVydHlWYWx1ZShcImNvbG9yXCIpO1xuICAgICAgICByZXR1cm4gb3V0ID09IHJlZCA/IG51bGwgOiBvdXQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRvSGV4KGNvbG9yKTtcbn0sXG5oc2J0b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJoc2IoXCIgKyBbdGhpcy5oLCB0aGlzLnMsIHRoaXMuYl0gKyBcIilcIjtcbn0sXG5oc2x0b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJoc2woXCIgKyBbdGhpcy5oLCB0aGlzLnMsIHRoaXMubF0gKyBcIilcIjtcbn0sXG5yZ2J0b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5ID09IDEgfHwgdGhpcy5vcGFjaXR5ID09IG51bGwgP1xuICAgICAgICAgICAgdGhpcy5oZXggOlxuICAgICAgICAgICAgXCJyZ2JhKFwiICsgW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMub3BhY2l0eV0gKyBcIilcIjtcbn0sXG5wcmVwYXJlUkdCID0gZnVuY3Rpb24gKHIsIGcsIGIpIHtcbiAgICBpZiAoZyA9PSBudWxsICYmIGlzKHIsIFwib2JqZWN0XCIpICYmIFwiclwiIGluIHIgJiYgXCJnXCIgaW4gciAmJiBcImJcIiBpbiByKSB7XG4gICAgICAgIGIgPSByLmI7XG4gICAgICAgIGcgPSByLmc7XG4gICAgICAgIHIgPSByLnI7XG4gICAgfVxuICAgIGlmIChnID09IG51bGwgJiYgaXMociwgc3RyaW5nKSkge1xuICAgICAgICB2YXIgY2xyID0gU25hcC5nZXRSR0Iocik7XG4gICAgICAgIHIgPSBjbHIucjtcbiAgICAgICAgZyA9IGNsci5nO1xuICAgICAgICBiID0gY2xyLmI7XG4gICAgfVxuICAgIGlmIChyID4gMSB8fCBnID4gMSB8fCBiID4gMSkge1xuICAgICAgICByIC89IDI1NTtcbiAgICAgICAgZyAvPSAyNTU7XG4gICAgICAgIGIgLz0gMjU1O1xuICAgIH1cblxuICAgIHJldHVybiBbciwgZywgYl07XG59LFxucGFja2FnZVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiLCBvKSB7XG4gICAgciA9IG1hdGgucm91bmQociAqIDI1NSk7XG4gICAgZyA9IG1hdGgucm91bmQoZyAqIDI1NSk7XG4gICAgYiA9IG1hdGgucm91bmQoYiAqIDI1NSk7XG4gICAgdmFyIHJnYiA9IHtcbiAgICAgICAgcjogcixcbiAgICAgICAgZzogZyxcbiAgICAgICAgYjogYixcbiAgICAgICAgb3BhY2l0eTogaXMobywgXCJmaW5pdGVcIikgPyBvIDogMSxcbiAgICAgICAgaGV4OiBTbmFwLnJnYihyLCBnLCBiKSxcbiAgICAgICAgdG9TdHJpbmc6IHJnYnRvU3RyaW5nXG4gICAgfTtcbiAgICBpcyhvLCBcImZpbml0ZVwiKSAmJiAocmdiLm9wYWNpdHkgPSBvKTtcbiAgICByZXR1cm4gcmdiO1xufTtcbi8qXFxcbiAqIFNuYXAuY29sb3JcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFBhcnNlcyB0aGUgY29sb3Igc3RyaW5nIGFuZCByZXR1cm5zIGFuIG9iamVjdCBmZWF0dXJpbmcgdGhlIGNvbG9yJ3MgY29tcG9uZW50IHZhbHVlc1xuIC0gY2xyIChzdHJpbmcpIGNvbG9yIHN0cmluZyBpbiBvbmUgb2YgdGhlIHN1cHBvcnRlZCBmb3JtYXRzIChzZWUgQFNuYXAuZ2V0UkdCKVxuID0gKG9iamVjdCkgQ29tYmluZWQgUkdCL0hTQiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgciAobnVtYmVyKSByZWQsXG4gbyAgICAgZyAobnVtYmVyKSBncmVlbixcbiBvICAgICBiIChudW1iZXIpIGJsdWUsXG4gbyAgICAgaGV4IChzdHJpbmcpIGNvbG9yIGluIEhUTUwvQ1NTIGZvcm1hdDogI+KAouKAouKAouKAouKAouKAoixcbiBvICAgICBlcnJvciAoYm9vbGVhbikgYHRydWVgIGlmIHN0cmluZyBjYW4ndCBiZSBwYXJzZWQsXG4gbyAgICAgaCAobnVtYmVyKSBodWUsXG4gbyAgICAgcyAobnVtYmVyKSBzYXR1cmF0aW9uLFxuIG8gICAgIHYgKG51bWJlcikgdmFsdWUgKGJyaWdodG5lc3MpLFxuIG8gICAgIGwgKG51bWJlcikgbGlnaHRuZXNzXG4gbyB9XG5cXCovXG5TbmFwLmNvbG9yID0gZnVuY3Rpb24gKGNscikge1xuICAgIHZhciByZ2I7XG4gICAgaWYgKGlzKGNsciwgXCJvYmplY3RcIikgJiYgXCJoXCIgaW4gY2xyICYmIFwic1wiIGluIGNsciAmJiBcImJcIiBpbiBjbHIpIHtcbiAgICAgICAgcmdiID0gU25hcC5oc2IycmdiKGNscik7XG4gICAgICAgIGNsci5yID0gcmdiLnI7XG4gICAgICAgIGNsci5nID0gcmdiLmc7XG4gICAgICAgIGNsci5iID0gcmdiLmI7XG4gICAgICAgIGNsci5vcGFjaXR5ID0gMTtcbiAgICAgICAgY2xyLmhleCA9IHJnYi5oZXg7XG4gICAgfSBlbHNlIGlmIChpcyhjbHIsIFwib2JqZWN0XCIpICYmIFwiaFwiIGluIGNsciAmJiBcInNcIiBpbiBjbHIgJiYgXCJsXCIgaW4gY2xyKSB7XG4gICAgICAgIHJnYiA9IFNuYXAuaHNsMnJnYihjbHIpO1xuICAgICAgICBjbHIuciA9IHJnYi5yO1xuICAgICAgICBjbHIuZyA9IHJnYi5nO1xuICAgICAgICBjbHIuYiA9IHJnYi5iO1xuICAgICAgICBjbHIub3BhY2l0eSA9IDE7XG4gICAgICAgIGNsci5oZXggPSByZ2IuaGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpcyhjbHIsIFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICBjbHIgPSBTbmFwLmdldFJHQihjbHIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpcyhjbHIsIFwib2JqZWN0XCIpICYmIFwiclwiIGluIGNsciAmJiBcImdcIiBpbiBjbHIgJiYgXCJiXCIgaW4gY2xyICYmICEoXCJlcnJvclwiIGluIGNscikpIHtcbiAgICAgICAgICAgIHJnYiA9IFNuYXAucmdiMmhzbChjbHIpO1xuICAgICAgICAgICAgY2xyLmggPSByZ2IuaDtcbiAgICAgICAgICAgIGNsci5zID0gcmdiLnM7XG4gICAgICAgICAgICBjbHIubCA9IHJnYi5sO1xuICAgICAgICAgICAgcmdiID0gU25hcC5yZ2IyaHNiKGNscik7XG4gICAgICAgICAgICBjbHIudiA9IHJnYi5iO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xyID0ge2hleDogXCJub25lXCJ9O1xuICAgICAgICAgICAgY2xyLnIgPSBjbHIuZyA9IGNsci5iID0gY2xyLmggPSBjbHIucyA9IGNsci52ID0gY2xyLmwgPSAtMTtcbiAgICAgICAgICAgIGNsci5lcnJvciA9IDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xyLnRvU3RyaW5nID0gcmdidG9TdHJpbmc7XG4gICAgcmV0dXJuIGNscjtcbn07XG4vKlxcXG4gKiBTbmFwLmhzYjJyZ2JcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENvbnZlcnRzIEhTQiB2YWx1ZXMgdG8gYW4gUkdCIG9iamVjdFxuIC0gaCAobnVtYmVyKSBodWVcbiAtIHMgKG51bWJlcikgc2F0dXJhdGlvblxuIC0gdiAobnVtYmVyKSB2YWx1ZSBvciBicmlnaHRuZXNzXG4gPSAob2JqZWN0KSBSR0Igb2JqZWN0IGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuIG8ge1xuIG8gICAgIHIgKG51bWJlcikgcmVkLFxuIG8gICAgIGcgKG51bWJlcikgZ3JlZW4sXG4gbyAgICAgYiAobnVtYmVyKSBibHVlLFxuIG8gICAgIGhleCAoc3RyaW5nKSBjb2xvciBpbiBIVE1ML0NTUyBmb3JtYXQ6ICPigKLigKLigKLigKLigKLigKJcbiBvIH1cblxcKi9cblNuYXAuaHNiMnJnYiA9IGZ1bmN0aW9uIChoLCBzLCB2LCBvKSB7XG4gICAgaWYgKGlzKGgsIFwib2JqZWN0XCIpICYmIFwiaFwiIGluIGggJiYgXCJzXCIgaW4gaCAmJiBcImJcIiBpbiBoKSB7XG4gICAgICAgIHYgPSBoLmI7XG4gICAgICAgIHMgPSBoLnM7XG4gICAgICAgIG8gPSBoLm87XG4gICAgICAgIGggPSBoLmg7XG4gICAgfVxuICAgIGggKj0gMzYwO1xuICAgIHZhciBSLCBHLCBCLCBYLCBDO1xuICAgIGggPSBoICUgMzYwIC8gNjA7XG4gICAgQyA9IHYgKiBzO1xuICAgIFggPSBDICogKDEgLSBhYnMoaCAlIDIgLSAxKSk7XG4gICAgUiA9IEcgPSBCID0gdiAtIEM7XG5cbiAgICBoID0gfn5oO1xuICAgIFIgKz0gW0MsIFgsIDAsIDAsIFgsIENdW2hdO1xuICAgIEcgKz0gW1gsIEMsIEMsIFgsIDAsIDBdW2hdO1xuICAgIEIgKz0gWzAsIDAsIFgsIEMsIEMsIFhdW2hdO1xuICAgIHJldHVybiBwYWNrYWdlUkdCKFIsIEcsIEIsIG8pO1xufTtcbi8qXFxcbiAqIFNuYXAuaHNsMnJnYlxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgSFNMIHZhbHVlcyB0byBhbiBSR0Igb2JqZWN0XG4gLSBoIChudW1iZXIpIGh1ZVxuIC0gcyAobnVtYmVyKSBzYXR1cmF0aW9uXG4gLSBsIChudW1iZXIpIGx1bWlub3NpdHlcbiA9IChvYmplY3QpIFJHQiBvYmplY3QgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gbyB7XG4gbyAgICAgciAobnVtYmVyKSByZWQsXG4gbyAgICAgZyAobnVtYmVyKSBncmVlbixcbiBvICAgICBiIChudW1iZXIpIGJsdWUsXG4gbyAgICAgaGV4IChzdHJpbmcpIGNvbG9yIGluIEhUTUwvQ1NTIGZvcm1hdDogI+KAouKAouKAouKAouKAouKAolxuIG8gfVxuXFwqL1xuU25hcC5oc2wycmdiID0gZnVuY3Rpb24gKGgsIHMsIGwsIG8pIHtcbiAgICBpZiAoaXMoaCwgXCJvYmplY3RcIikgJiYgXCJoXCIgaW4gaCAmJiBcInNcIiBpbiBoICYmIFwibFwiIGluIGgpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICB9XG4gICAgaWYgKGggPiAxIHx8IHMgPiAxIHx8IGwgPiAxKSB7XG4gICAgICAgIGggLz0gMzYwO1xuICAgICAgICBzIC89IDEwMDtcbiAgICAgICAgbCAvPSAxMDA7XG4gICAgfVxuICAgIGggKj0gMzYwO1xuICAgIHZhciBSLCBHLCBCLCBYLCBDO1xuICAgIGggPSBoICUgMzYwIC8gNjA7XG4gICAgQyA9IDIgKiBzICogKGwgPCAuNSA/IGwgOiAxIC0gbCk7XG4gICAgWCA9IEMgKiAoMSAtIGFicyhoICUgMiAtIDEpKTtcbiAgICBSID0gRyA9IEIgPSBsIC0gQyAvIDI7XG5cbiAgICBoID0gfn5oO1xuICAgIFIgKz0gW0MsIFgsIDAsIDAsIFgsIENdW2hdO1xuICAgIEcgKz0gW1gsIEMsIEMsIFgsIDAsIDBdW2hdO1xuICAgIEIgKz0gWzAsIDAsIFgsIEMsIEMsIFhdW2hdO1xuICAgIHJldHVybiBwYWNrYWdlUkdCKFIsIEcsIEIsIG8pO1xufTtcbi8qXFxcbiAqIFNuYXAucmdiMmhzYlxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgUkdCIHZhbHVlcyB0byBhbiBIU0Igb2JqZWN0XG4gLSByIChudW1iZXIpIHJlZFxuIC0gZyAobnVtYmVyKSBncmVlblxuIC0gYiAobnVtYmVyKSBibHVlXG4gPSAob2JqZWN0KSBIU0Igb2JqZWN0IGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuIG8ge1xuIG8gICAgIGggKG51bWJlcikgaHVlLFxuIG8gICAgIHMgKG51bWJlcikgc2F0dXJhdGlvbixcbiBvICAgICBiIChudW1iZXIpIGJyaWdodG5lc3NcbiBvIH1cblxcKi9cblNuYXAucmdiMmhzYiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgYiA9IHByZXBhcmVSR0IociwgZywgYik7XG4gICAgciA9IGJbMF07XG4gICAgZyA9IGJbMV07XG4gICAgYiA9IGJbMl07XG5cbiAgICB2YXIgSCwgUywgViwgQztcbiAgICBWID0gbW1heChyLCBnLCBiKTtcbiAgICBDID0gViAtIG1taW4ociwgZywgYik7XG4gICAgSCA9IEMgPT0gMCA/IG51bGwgOlxuICAgICAgICBWID09IHIgPyAoZyAtIGIpIC8gQyA6XG4gICAgICAgIFYgPT0gZyA/IChiIC0gcikgLyBDICsgMiA6XG4gICAgICAgICAgICAgICAgIChyIC0gZykgLyBDICsgNDtcbiAgICBIID0gKEggKyAzNjApICUgNiAqIDYwIC8gMzYwO1xuICAgIFMgPSBDID09IDAgPyAwIDogQyAvIFY7XG4gICAgcmV0dXJuIHtoOiBILCBzOiBTLCBiOiBWLCB0b1N0cmluZzogaHNidG9TdHJpbmd9O1xufTtcbi8qXFxcbiAqIFNuYXAucmdiMmhzbFxuIFsgbWV0aG9kIF1cbiAqKlxuICogQ29udmVydHMgUkdCIHZhbHVlcyB0byBhbiBIU0wgb2JqZWN0XG4gLSByIChudW1iZXIpIHJlZFxuIC0gZyAobnVtYmVyKSBncmVlblxuIC0gYiAobnVtYmVyKSBibHVlXG4gPSAob2JqZWN0KSBIU0wgb2JqZWN0IGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuIG8ge1xuIG8gICAgIGggKG51bWJlcikgaHVlLFxuIG8gICAgIHMgKG51bWJlcikgc2F0dXJhdGlvbixcbiBvICAgICBsIChudW1iZXIpIGx1bWlub3NpdHlcbiBvIH1cblxcKi9cblNuYXAucmdiMmhzbCA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgYiA9IHByZXBhcmVSR0IociwgZywgYik7XG4gICAgciA9IGJbMF07XG4gICAgZyA9IGJbMV07XG4gICAgYiA9IGJbMl07XG5cbiAgICB2YXIgSCwgUywgTCwgTSwgbSwgQztcbiAgICBNID0gbW1heChyLCBnLCBiKTtcbiAgICBtID0gbW1pbihyLCBnLCBiKTtcbiAgICBDID0gTSAtIG07XG4gICAgSCA9IEMgPT0gMCA/IG51bGwgOlxuICAgICAgICBNID09IHIgPyAoZyAtIGIpIC8gQyA6XG4gICAgICAgIE0gPT0gZyA/IChiIC0gcikgLyBDICsgMiA6XG4gICAgICAgICAgICAgICAgIChyIC0gZykgLyBDICsgNDtcbiAgICBIID0gKEggKyAzNjApICUgNiAqIDYwIC8gMzYwO1xuICAgIEwgPSAoTSArIG0pIC8gMjtcbiAgICBTID0gQyA9PSAwID8gMCA6XG4gICAgICAgICBMIDwgLjUgPyBDIC8gKDIgKiBMKSA6XG4gICAgICAgICAgICAgICAgICBDIC8gKDIgLSAyICogTCk7XG4gICAgcmV0dXJuIHtoOiBILCBzOiBTLCBsOiBMLCB0b1N0cmluZzogaHNsdG9TdHJpbmd9O1xufTtcblxuLy8gVHJhbnNmb3JtYXRpb25zXG4vKlxcXG4gKiBTbmFwLnBhcnNlUGF0aFN0cmluZ1xuIFsgbWV0aG9kIF1cbiAqKlxuICogVXRpbGl0eSBtZXRob2RcbiAqKlxuICogUGFyc2VzIGdpdmVuIHBhdGggc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzIG9mIHBhdGggc2VnbWVudHNcbiAtIHBhdGhTdHJpbmcgKHN0cmluZ3xhcnJheSkgcGF0aCBzdHJpbmcgb3IgYXJyYXkgb2Ygc2VnbWVudHMgKGluIHRoZSBsYXN0IGNhc2UgaXQgaXMgcmV0dXJuZWQgc3RyYWlnaHQgYXdheSlcbiA9IChhcnJheSkgYXJyYXkgb2Ygc2VnbWVudHNcblxcKi9cblNuYXAucGFyc2VQYXRoU3RyaW5nID0gZnVuY3Rpb24gKHBhdGhTdHJpbmcpIHtcbiAgICBpZiAoIXBhdGhTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBwdGggPSBTbmFwLnBhdGgocGF0aFN0cmluZyk7XG4gICAgaWYgKHB0aC5hcnIpIHtcbiAgICAgICAgcmV0dXJuIFNuYXAucGF0aC5jbG9uZShwdGguYXJyKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1Db3VudHMgPSB7YTogNywgYzogNiwgbzogMiwgaDogMSwgbDogMiwgbTogMiwgcjogNCwgcTogNCwgczogNCwgdDogMiwgdjogMSwgdTogMywgejogMH0sXG4gICAgICAgIGRhdGEgPSBbXTtcbiAgICBpZiAoaXMocGF0aFN0cmluZywgXCJhcnJheVwiKSAmJiBpcyhwYXRoU3RyaW5nWzBdLCBcImFycmF5XCIpKSB7IC8vIHJvdWdoIGFzc3VtcHRpb25cbiAgICAgICAgZGF0YSA9IFNuYXAucGF0aC5jbG9uZShwYXRoU3RyaW5nKTtcbiAgICB9XG4gICAgaWYgKCFkYXRhLmxlbmd0aCkge1xuICAgICAgICBTdHIocGF0aFN0cmluZykucmVwbGFjZShwYXRoQ29tbWFuZCwgZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXSxcbiAgICAgICAgICAgICAgICBuYW1lID0gYi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgYy5yZXBsYWNlKHBhdGhWYWx1ZXMsIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgYiAmJiBwYXJhbXMucHVzaCgrYik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwibVwiICYmIHBhcmFtcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5wdXNoKFtiXS5jb25jYXQocGFyYW1zLnNwbGljZSgwLCAyKSkpO1xuICAgICAgICAgICAgICAgIG5hbWUgPSBcImxcIjtcbiAgICAgICAgICAgICAgICBiID0gYiA9PSBcIm1cIiA/IFwibFwiIDogXCJMXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcIm9cIiAmJiBwYXJhbXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goW2IsIHBhcmFtc1swXV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJyXCIpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goW2JdLmNvbmNhdChwYXJhbXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB3aGlsZSAocGFyYW1zLmxlbmd0aCA+PSBwYXJhbUNvdW50c1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChbYl0uY29uY2F0KHBhcmFtcy5zcGxpY2UoMCwgcGFyYW1Db3VudHNbbmFtZV0pKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJhbUNvdW50c1tuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkYXRhLnRvU3RyaW5nID0gU25hcC5wYXRoLnRvU3RyaW5nO1xuICAgIHB0aC5hcnIgPSBTbmFwLnBhdGguY2xvbmUoZGF0YSk7XG4gICAgcmV0dXJuIGRhdGE7XG59O1xuLypcXFxuICogU25hcC5wYXJzZVRyYW5zZm9ybVN0cmluZ1xuIFsgbWV0aG9kIF1cbiAqKlxuICogVXRpbGl0eSBtZXRob2RcbiAqKlxuICogUGFyc2VzIGdpdmVuIHRyYW5zZm9ybSBzdHJpbmcgaW50byBhbiBhcnJheSBvZiB0cmFuc2Zvcm1hdGlvbnNcbiAtIFRTdHJpbmcgKHN0cmluZ3xhcnJheSkgdHJhbnNmb3JtIHN0cmluZyBvciBhcnJheSBvZiB0cmFuc2Zvcm1hdGlvbnMgKGluIHRoZSBsYXN0IGNhc2UgaXQgaXMgcmV0dXJuZWQgc3RyYWlnaHQgYXdheSlcbiA9IChhcnJheSkgYXJyYXkgb2YgdHJhbnNmb3JtYXRpb25zXG5cXCovXG52YXIgcGFyc2VUcmFuc2Zvcm1TdHJpbmcgPSBTbmFwLnBhcnNlVHJhbnNmb3JtU3RyaW5nID0gZnVuY3Rpb24gKFRTdHJpbmcpIHtcbiAgICBpZiAoIVRTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBwYXJhbUNvdW50cyA9IHtyOiAzLCBzOiA0LCB0OiAyLCBtOiA2fSxcbiAgICAgICAgZGF0YSA9IFtdO1xuICAgIGlmIChpcyhUU3RyaW5nLCBcImFycmF5XCIpICYmIGlzKFRTdHJpbmdbMF0sIFwiYXJyYXlcIikpIHsgLy8gcm91Z2ggYXNzdW1wdGlvblxuICAgICAgICBkYXRhID0gU25hcC5wYXRoLmNsb25lKFRTdHJpbmcpO1xuICAgIH1cbiAgICBpZiAoIWRhdGEubGVuZ3RoKSB7XG4gICAgICAgIFN0cihUU3RyaW5nKS5yZXBsYWNlKHRDb21tYW5kLCBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdLFxuICAgICAgICAgICAgICAgIG5hbWUgPSBiLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjLnJlcGxhY2UocGF0aFZhbHVlcywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBiICYmIHBhcmFtcy5wdXNoKCtiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YS5wdXNoKFtiXS5jb25jYXQocGFyYW1zKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkYXRhLnRvU3RyaW5nID0gU25hcC5wYXRoLnRvU3RyaW5nO1xuICAgIHJldHVybiBkYXRhO1xufTtcbmZ1bmN0aW9uIHN2Z1RyYW5zZm9ybTJzdHJpbmcodHN0cikge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICB0c3RyID0gdHN0ci5yZXBsYWNlKC8oPzpefFxccykoXFx3KylcXCgoW14pXSspXFwpL2csIGZ1bmN0aW9uIChhbGwsIG5hbWUsIHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoL1xccyosXFxzKnxcXHMrLyk7XG4gICAgICAgIGlmIChuYW1lID09IFwicm90YXRlXCIgJiYgcGFyYW1zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBwYXJhbXMucHVzaCgwLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcInNjYWxlXCIpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zbGljZSgwLCAyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gocGFyYW1zWzBdLCAwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcInNrZXdYXCIpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtcIm1cIiwgMSwgMCwgbWF0aC50YW4ocmFkKHBhcmFtc1swXSkpLCAxLCAwLCAwXSk7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PSBcInNrZXdZXCIpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKFtcIm1cIiwgMSwgbWF0aC50YW4ocmFkKHBhcmFtc1swXSkpLCAwLCAxLCAwLCAwXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMucHVzaChbbmFtZS5jaGFyQXQoMCldLmNvbmNhdChwYXJhbXMpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG59XG5TbmFwLl8uc3ZnVHJhbnNmb3JtMnN0cmluZyA9IHN2Z1RyYW5zZm9ybTJzdHJpbmc7XG5TbmFwLl8ucmdUcmFuc2Zvcm0gPSAvXlthLXpdW1xcc10qLT9cXC4/XFxkL2k7XG5mdW5jdGlvbiB0cmFuc2Zvcm0ybWF0cml4KHRzdHIsIGJib3gpIHtcbiAgICB2YXIgdGRhdGEgPSBwYXJzZVRyYW5zZm9ybVN0cmluZyh0c3RyKSxcbiAgICAgICAgbSA9IG5ldyBTbmFwLk1hdHJpeDtcbiAgICBpZiAodGRhdGEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGRhdGEubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHQgPSB0ZGF0YVtpXSxcbiAgICAgICAgICAgICAgICB0bGVuID0gdC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY29tbWFuZCA9IFN0cih0WzBdKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgIGFic29sdXRlID0gdFswXSAhPSBjb21tYW5kLFxuICAgICAgICAgICAgICAgIGludmVyID0gYWJzb2x1dGUgPyBtLmludmVydCgpIDogMCxcbiAgICAgICAgICAgICAgICB4MSxcbiAgICAgICAgICAgICAgICB5MSxcbiAgICAgICAgICAgICAgICB4MixcbiAgICAgICAgICAgICAgICB5MixcbiAgICAgICAgICAgICAgICBiYjtcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09IFwidFwiICYmIHRsZW4gPT0gMil7XG4gICAgICAgICAgICAgICAgbS50cmFuc2xhdGUodFsxXSwgMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT0gXCJ0XCIgJiYgdGxlbiA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHgxID0gaW52ZXIueCgwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgeTEgPSBpbnZlci55KDAsIDApO1xuICAgICAgICAgICAgICAgICAgICB4MiA9IGludmVyLngodFsxXSwgdFsyXSk7XG4gICAgICAgICAgICAgICAgICAgIHkyID0gaW52ZXIueSh0WzFdLCB0WzJdKTtcbiAgICAgICAgICAgICAgICAgICAgbS50cmFuc2xhdGUoeDIgLSB4MSwgeTIgLSB5MSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbS50cmFuc2xhdGUodFsxXSwgdFsyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tYW5kID09IFwiclwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRsZW4gPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBiYiA9IGJiIHx8IGJib3g7XG4gICAgICAgICAgICAgICAgICAgIG0ucm90YXRlKHRbMV0sIGJiLnggKyBiYi53aWR0aCAvIDIsIGJiLnkgKyBiYi5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRsZW4gPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gaW52ZXIueCh0WzJdLCB0WzNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gaW52ZXIueSh0WzJdLCB0WzNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0ucm90YXRlKHRbMV0sIHgyLCB5Mik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtLnJvdGF0ZSh0WzFdLCB0WzJdLCB0WzNdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PSBcInNcIikge1xuICAgICAgICAgICAgICAgIGlmICh0bGVuID09IDIgfHwgdGxlbiA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGJiID0gYmIgfHwgYmJveDtcbiAgICAgICAgICAgICAgICAgICAgbS5zY2FsZSh0WzFdLCB0W3RsZW4gLSAxXSwgYmIueCArIGJiLndpZHRoIC8gMiwgYmIueSArIGJiLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGxlbiA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBpbnZlci54KHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBpbnZlci55KHRbMl0sIHRbM10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5zY2FsZSh0WzFdLCB0WzFdLCB4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5zY2FsZSh0WzFdLCB0WzFdLCB0WzJdLCB0WzNdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGxlbiA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBpbnZlci54KHRbM10sIHRbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBpbnZlci55KHRbM10sIHRbNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5zY2FsZSh0WzFdLCB0WzJdLCB4MiwgeTIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbS5zY2FsZSh0WzFdLCB0WzJdLCB0WzNdLCB0WzRdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWFuZCA9PSBcIm1cIiAmJiB0bGVuID09IDcpIHtcbiAgICAgICAgICAgICAgICBtLmFkZCh0WzFdLCB0WzJdLCB0WzNdLCB0WzRdLCB0WzVdLCB0WzZdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbTtcbn1cblNuYXAuXy50cmFuc2Zvcm0ybWF0cml4ID0gdHJhbnNmb3JtMm1hdHJpeDtcblNuYXAuX3VuaXQycHggPSB1bml0MnB4O1xudmFyIGNvbnRhaW5zID0gZ2xvYi5kb2MuY29udGFpbnMgfHwgZ2xvYi5kb2MuY29tcGFyZURvY3VtZW50UG9zaXRpb24gP1xuICAgIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHZhciBhZG93biA9IGEubm9kZVR5cGUgPT0gOSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcbiAgICAgICAgICAgIGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuICAgICAgICAgICAgcmV0dXJuIGEgPT0gYnVwIHx8ICEhKGJ1cCAmJiBidXAubm9kZVR5cGUgPT0gMSAmJiAoXG4gICAgICAgICAgICAgICAgYWRvd24uY29udGFpbnMgP1xuICAgICAgICAgICAgICAgICAgICBhZG93bi5jb250YWlucyhidXApIDpcbiAgICAgICAgICAgICAgICAgICAgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGJ1cCkgJiAxNlxuICAgICAgICAgICAgKSk7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgIHdoaWxlIChiKSB7XG4gICAgICAgICAgICAgICAgYiA9IGIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAoYiA9PSBhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbmZ1bmN0aW9uIGdldFNvbWVEZWZzKGVsKSB7XG4gICAgdmFyIHAgPSBlbC5ub2RlLm93bmVyU1ZHRWxlbWVudCAmJiB3cmFwKGVsLm5vZGUub3duZXJTVkdFbGVtZW50KSB8fFxuICAgICAgICAgICAgZWwubm9kZS5wYXJlbnROb2RlICYmIHdyYXAoZWwubm9kZS5wYXJlbnROb2RlKSB8fFxuICAgICAgICAgICAgU25hcC5zZWxlY3QoXCJzdmdcIikgfHxcbiAgICAgICAgICAgIFNuYXAoMCwgMCksXG4gICAgICAgIHBkZWZzID0gcC5zZWxlY3QoXCJkZWZzXCIpLFxuICAgICAgICBkZWZzICA9IHBkZWZzID09IG51bGwgPyBmYWxzZSA6IHBkZWZzLm5vZGU7XG4gICAgaWYgKCFkZWZzKSB7XG4gICAgICAgIGRlZnMgPSBtYWtlKFwiZGVmc1wiLCBwLm5vZGUpLm5vZGU7XG4gICAgfVxuICAgIHJldHVybiBkZWZzO1xufVxuZnVuY3Rpb24gZ2V0U29tZVNWRyhlbCkge1xuICAgIHJldHVybiBlbC5ub2RlLm93bmVyU1ZHRWxlbWVudCAmJiB3cmFwKGVsLm5vZGUub3duZXJTVkdFbGVtZW50KSB8fCBTbmFwLnNlbGVjdChcInN2Z1wiKTtcbn1cblNuYXAuXy5nZXRTb21lRGVmcyA9IGdldFNvbWVEZWZzO1xuU25hcC5fLmdldFNvbWVTVkcgPSBnZXRTb21lU1ZHO1xuZnVuY3Rpb24gdW5pdDJweChlbCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3ZnID0gZ2V0U29tZVNWRyhlbCkubm9kZSxcbiAgICAgICAgb3V0ID0ge30sXG4gICAgICAgIG1nciA9IHN2Zy5xdWVyeVNlbGVjdG9yKFwiLnN2Zy0tLW1nclwiKTtcbiAgICBpZiAoIW1ncikge1xuICAgICAgICBtZ3IgPSAkKFwicmVjdFwiKTtcbiAgICAgICAgJChtZ3IsIHt4OiAtOWU5LCB5OiAtOWU5LCB3aWR0aDogMTAsIGhlaWdodDogMTAsIFwiY2xhc3NcIjogXCJzdmctLS1tZ3JcIiwgZmlsbDogXCJub25lXCJ9KTtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKG1ncik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFcodmFsKSB7XG4gICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbCA9PSArdmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICAgICQobWdyLCB7d2lkdGg6IHZhbH0pO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1nci5nZXRCQm94KCkud2lkdGg7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEgodmFsKSB7XG4gICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbCA9PSArdmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgICAgICQobWdyLCB7aGVpZ2h0OiB2YWx9KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZ3IuZ2V0QkJveCgpLmhlaWdodDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0KG5hbSwgZikge1xuICAgICAgICBpZiAobmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBvdXRbbmFtXSA9IGYoZWwuYXR0cihuYW0pIHx8IDApO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbSA9PSBuYW1lKSB7XG4gICAgICAgICAgICBvdXQgPSBmKHZhbHVlID09IG51bGwgPyBlbC5hdHRyKG5hbSkgfHwgMCA6IHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzd2l0Y2ggKGVsLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJlY3RcIjpcbiAgICAgICAgICAgIHNldChcInJ4XCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwicnlcIiwgZ2V0SCk7XG4gICAgICAgIGNhc2UgXCJpbWFnZVwiOlxuICAgICAgICAgICAgc2V0KFwid2lkdGhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJoZWlnaHRcIiwgZ2V0SCk7XG4gICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgICBzZXQoXCJ4XCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwieVwiLCBnZXRIKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgICAgIHNldChcImN4XCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwiY3lcIiwgZ2V0SCk7XG4gICAgICAgICAgICBzZXQoXCJyXCIsIGdldFcpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVsbGlwc2VcIjpcbiAgICAgICAgICAgIHNldChcImN4XCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwiY3lcIiwgZ2V0SCk7XG4gICAgICAgICAgICBzZXQoXCJyeFwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcInJ5XCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxpbmVcIjpcbiAgICAgICAgICAgIHNldChcIngxXCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwieDJcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJ5MVwiLCBnZXRIKTtcbiAgICAgICAgICAgIHNldChcInkyXCIsIGdldEgpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1hcmtlclwiOlxuICAgICAgICAgICAgc2V0KFwicmVmWFwiLCBnZXRXKTtcbiAgICAgICAgICAgIHNldChcIm1hcmtlcldpZHRoXCIsIGdldFcpO1xuICAgICAgICAgICAgc2V0KFwicmVmWVwiLCBnZXRIKTtcbiAgICAgICAgICAgIHNldChcIm1hcmtlckhlaWdodFwiLCBnZXRIKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyYWRpYWxHcmFkaWVudFwiOlxuICAgICAgICAgICAgc2V0KFwiZnhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJmeVwiLCBnZXRIKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0c3BhblwiOlxuICAgICAgICAgICAgc2V0KFwiZHhcIiwgZ2V0Vyk7XG4gICAgICAgICAgICBzZXQoXCJkeVwiLCBnZXRIKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZXQobmFtZSwgZ2V0Vyk7XG4gICAgfVxuICAgIHN2Zy5yZW1vdmVDaGlsZChtZ3IpO1xuICAgIHJldHVybiBvdXQ7XG59XG4vKlxcXG4gKiBTbmFwLnNlbGVjdFxuIFsgbWV0aG9kIF1cbiAqKlxuICogV3JhcHMgYSBET00gZWxlbWVudCBzcGVjaWZpZWQgYnkgQ1NTIHNlbGVjdG9yIGFzIEBFbGVtZW50XG4gLSBxdWVyeSAoc3RyaW5nKSBDU1Mgc2VsZWN0b3Igb2YgdGhlIGVsZW1lbnRcbiA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG5cXCovXG5TbmFwLnNlbGVjdCA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gU3RyKHF1ZXJ5KS5yZXBsYWNlKC8oW15cXFxcXSk6L2csIFwiJDFcXFxcOlwiKTtcbiAgICByZXR1cm4gd3JhcChnbG9iLmRvYy5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSk7XG59O1xuLypcXFxuICogU25hcC5zZWxlY3RBbGxcbiBbIG1ldGhvZCBdXG4gKipcbiAqIFdyYXBzIERPTSBlbGVtZW50cyBzcGVjaWZpZWQgYnkgQ1NTIHNlbGVjdG9yIGFzIHNldCBvciBhcnJheSBvZiBARWxlbWVudFxuIC0gcXVlcnkgKHN0cmluZykgQ1NTIHNlbGVjdG9yIG9mIHRoZSBlbGVtZW50XG4gPSAoRWxlbWVudCkgdGhlIGN1cnJlbnQgZWxlbWVudFxuXFwqL1xuU25hcC5zZWxlY3RBbGwgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICB2YXIgbm9kZWxpc3QgPSBnbG9iLmRvYy5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSxcbiAgICAgICAgc2V0ID0gKFNuYXAuc2V0IHx8IEFycmF5KSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZWxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0LnB1c2god3JhcChub2RlbGlzdFtpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gc2V0O1xufTtcblxuZnVuY3Rpb24gYWRkMmdyb3VwKGxpc3QpIHtcbiAgICBpZiAoIWlzKGxpc3QsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgfVxuICAgIHZhciBpID0gMCxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgd2hpbGUgKHRoaXNbaV0pIGRlbGV0ZSB0aGlzW2krK107XG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGxpc3RbaV0udHlwZSA9PSBcInNldFwiKSB7XG4gICAgICAgICAgICBsaXN0W2ldLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChlbC5ub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChsaXN0W2ldLm5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpc1tqKytdID0gd3JhcChjaGlsZHJlbltpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuLy8gSHViIGdhcmJhZ2UgY29sbGVjdG9yIGV2ZXJ5IDEwc1xuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiBodWIpIGlmIChodWJbaGFzXShrZXkpKSB7XG4gICAgICAgIHZhciBlbCA9IGh1YltrZXldLFxuICAgICAgICAgICAgbm9kZSA9IGVsLm5vZGU7XG4gICAgICAgIGlmIChlbC50eXBlICE9IFwic3ZnXCIgJiYgIW5vZGUub3duZXJTVkdFbGVtZW50IHx8IGVsLnR5cGUgPT0gXCJzdmdcIiAmJiAoIW5vZGUucGFyZW50Tm9kZSB8fCBcIm93bmVyU1ZHRWxlbWVudFwiIGluIG5vZGUucGFyZW50Tm9kZSAmJiAhbm9kZS5vd25lclNWR0VsZW1lbnQpKSB7XG4gICAgICAgICAgICBkZWxldGUgaHViW2tleV07XG4gICAgICAgIH1cbiAgICB9XG59LCAxZTQpO1xuZnVuY3Rpb24gRWxlbWVudChlbCkge1xuICAgIGlmIChlbC5zbmFwIGluIGh1Yikge1xuICAgICAgICByZXR1cm4gaHViW2VsLnNuYXBdO1xuICAgIH1cbiAgICB2YXIgc3ZnO1xuICAgIHRyeSB7XG4gICAgICAgIHN2ZyA9IGVsLm93bmVyU1ZHRWxlbWVudDtcbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQubm9kZVxuICAgICBbIHByb3BlcnR5IChvYmplY3QpIF1cbiAgICAgKipcbiAgICAgKiBHaXZlcyB5b3UgYSByZWZlcmVuY2UgdG8gdGhlIERPTSBvYmplY3QsIHNvIHlvdSBjYW4gYXNzaWduIGV2ZW50IGhhbmRsZXJzIG9yIGp1c3QgbWVzcyBhcm91bmQuXG4gICAgID4gVXNhZ2VcbiAgICAgfCAvLyBkcmF3IGEgY2lyY2xlIGF0IGNvb3JkaW5hdGUgMTAsMTAgd2l0aCByYWRpdXMgb2YgMTBcbiAgICAgfCB2YXIgYyA9IHBhcGVyLmNpcmNsZSgxMCwgMTAsIDEwKTtcbiAgICAgfCBjLm5vZGUub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgfCAgICAgYy5hdHRyKFwiZmlsbFwiLCBcInJlZFwiKTtcbiAgICAgfCB9O1xuICAgIFxcKi9cbiAgICB0aGlzLm5vZGUgPSBlbDtcbiAgICBpZiAoc3ZnKSB7XG4gICAgICAgIHRoaXMucGFwZXIgPSBuZXcgUGFwZXIoc3ZnKTtcbiAgICB9XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudHlwZVxuICAgICBbIHByb3BlcnR5IChzdHJpbmcpIF1cbiAgICAgKipcbiAgICAgKiBTVkcgdGFnIG5hbWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgXFwqL1xuICAgIHRoaXMudHlwZSA9IGVsLnRhZ05hbWUgfHwgZWwubm9kZU5hbWU7XG4gICAgdmFyIGlkID0gdGhpcy5pZCA9IElEKHRoaXMpO1xuICAgIHRoaXMuYW5pbXMgPSB7fTtcbiAgICB0aGlzLl8gPSB7XG4gICAgICAgIHRyYW5zZm9ybTogW11cbiAgICB9O1xuICAgIGVsLnNuYXAgPSBpZDtcbiAgICBodWJbaWRdID0gdGhpcztcbiAgICBpZiAodGhpcy50eXBlID09IFwiZ1wiKSB7XG4gICAgICAgIHRoaXMuYWRkID0gYWRkMmdyb3VwO1xuICAgIH1cbiAgICBpZiAodGhpcy50eXBlIGluIHtnOiAxLCBtYXNrOiAxLCBwYXR0ZXJuOiAxLCBzeW1ib2w6IDF9KSB7XG4gICAgICAgIGZvciAodmFyIG1ldGhvZCBpbiBQYXBlci5wcm90b3R5cGUpIGlmIChQYXBlci5wcm90b3R5cGVbaGFzXShtZXRob2QpKSB7XG4gICAgICAgICAgICB0aGlzW21ldGhvZF0gPSBQYXBlci5wcm90b3R5cGVbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmF0dHJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEdldHMgb3Igc2V0cyBnaXZlbiBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50LlxuICAgICAqKlxuICAgICAtIHBhcmFtcyAob2JqZWN0KSBjb250YWlucyBrZXktdmFsdWUgcGFpcnMgb2YgYXR0cmlidXRlcyB5b3Ugd2FudCB0byBzZXRcbiAgICAgKiBvclxuICAgICAtIHBhcmFtIChzdHJpbmcpIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAgICA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICogb3JcbiAgICAgPSAoc3RyaW5nKSB2YWx1ZSBvZiBhdHRyaWJ1dGVcbiAgICAgPiBVc2FnZVxuICAgICB8IGVsLmF0dHIoe1xuICAgICB8ICAgICBmaWxsOiBcIiNmYzBcIixcbiAgICAgfCAgICAgc3Ryb2tlOiBcIiMwMDBcIixcbiAgICAgfCAgICAgc3Ryb2tlV2lkdGg6IDIsIC8vIENhbWVsQ2FzZS4uLlxuICAgICB8ICAgICBcImZpbGwtb3BhY2l0eVwiOiAwLjUsIC8vIG9yIGRhc2gtc2VwYXJhdGVkIG5hbWVzXG4gICAgIHwgICAgIHdpZHRoOiBcIio9MlwiIC8vIHByZWZpeGVkIHZhbHVlc1xuICAgICB8IH0pO1xuICAgICB8IGNvbnNvbGUubG9nKGVsLmF0dHIoXCJmaWxsXCIpKTsgLy8gI2ZjMFxuICAgICAqIFByZWZpeGVkIHZhbHVlcyBpbiBmb3JtYXQgYFwiKz0xMFwiYCBzdXBwb3J0ZWQuIEFsbCBmb3VyIG9wZXJhdGlvbnNcbiAgICAgKiAoYCtgLCBgLWAsIGAqYCBhbmQgYC9gKSBjb3VsZCBiZSB1c2VkLiBPcHRpb25hbGx5IHlvdSBjYW4gdXNlIHVuaXRzIGZvciBgK2BcbiAgICAgKiBhbmQgYC1gOiBgXCIrPTJlbVwiYC5cbiAgICBcXCovXG4gICAgRWxlbWVudC5wcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uIChwYXJhbXMsIHZhbHVlKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMsXG4gICAgICAgICAgICBub2RlID0gZWwubm9kZTtcbiAgICAgICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBub2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXR0ciA9IG5vZGUuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBvdXQgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGF0dHIubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dFthdHRyW2ldLm5vZGVOYW1lXSA9IGF0dHJbaV0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXMocGFyYW1zLCBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGpzb24gPSB7fTtcbiAgICAgICAgICAgICAgICBqc29uW3BhcmFtc10gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBqc29uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlKFwic25hcC51dGlsLmdldGF0dHIuXCIgKyBwYXJhbXMsIGVsKS5maXJzdERlZmluZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBhdHQgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW2hhc10oYXR0KSkge1xuICAgICAgICAgICAgICAgIGV2ZShcInNuYXAudXRpbC5hdHRyLlwiICsgYXR0LCBlbCwgcGFyYW1zW2F0dF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuLypcXFxuICogU25hcC5wYXJzZVxuIFsgbWV0aG9kIF1cbiAqKlxuICogUGFyc2VzIFNWRyBmcmFnbWVudCBhbmQgY29udmVydHMgaXQgaW50byBhIEBGcmFnbWVudFxuICoqXG4gLSBzdmcgKHN0cmluZykgU1ZHIHN0cmluZ1xuID0gKEZyYWdtZW50KSB0aGUgQEZyYWdtZW50XG5cXCovXG5TbmFwLnBhcnNlID0gZnVuY3Rpb24gKHN2Zykge1xuICAgIHZhciBmID0gZ2xvYi5kb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICBmdWxsID0gdHJ1ZSxcbiAgICAgICAgZGl2ID0gZ2xvYi5kb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBzdmcgPSBTdHIoc3ZnKTtcbiAgICBpZiAoIXN2Zy5tYXRjaCgvXlxccyo8XFxzKnN2Zyg/Olxcc3w+KS8pKSB7XG4gICAgICAgIHN2ZyA9IFwiPHN2Zz5cIiArIHN2ZyArIFwiPC9zdmc+XCI7XG4gICAgICAgIGZ1bGwgPSBmYWxzZTtcbiAgICB9XG4gICAgZGl2LmlubmVySFRNTCA9IHN2ZztcbiAgICBzdmcgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdmdcIilbMF07XG4gICAgaWYgKHN2Zykge1xuICAgICAgICBpZiAoZnVsbCkge1xuICAgICAgICAgICAgZiA9IHN2ZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChzdmcuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGYuYXBwZW5kQ2hpbGQoc3ZnLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgRnJhZ21lbnQoZik7XG59O1xuZnVuY3Rpb24gRnJhZ21lbnQoZnJhZykge1xuICAgIHRoaXMubm9kZSA9IGZyYWc7XG59XG4vKlxcXG4gKiBTbmFwLmZyYWdtZW50XG4gWyBtZXRob2QgXVxuICoqXG4gKiBDcmVhdGVzIGEgRE9NIGZyYWdtZW50IGZyb20gYSBnaXZlbiBsaXN0IG9mIGVsZW1lbnRzIG9yIHN0cmluZ3NcbiAqKlxuIC0gdmFyYXJncyAo4oCmKSBTVkcgc3RyaW5nXG4gPSAoRnJhZ21lbnQpIHRoZSBARnJhZ21lbnRcblxcKi9cblNuYXAuZnJhZ21lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApLFxuICAgICAgICBmID0gZ2xvYi5kb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGFyZ3MubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGFyZ3NbaV07XG4gICAgICAgIGlmIChpdGVtLm5vZGUgJiYgaXRlbS5ub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBmLmFwcGVuZENoaWxkKGl0ZW0ubm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGYuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGYuYXBwZW5kQ2hpbGQoU25hcC5wYXJzZShpdGVtKS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEZyYWdtZW50KGYpO1xufTtcblxuZnVuY3Rpb24gbWFrZShuYW1lLCBwYXJlbnQpIHtcbiAgICB2YXIgcmVzID0gJChuYW1lKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocmVzKTtcbiAgICB2YXIgZWwgPSB3cmFwKHJlcyk7XG4gICAgcmV0dXJuIGVsO1xufVxuZnVuY3Rpb24gUGFwZXIodywgaCkge1xuICAgIHZhciByZXMsXG4gICAgICAgIGRlc2MsXG4gICAgICAgIGRlZnMsXG4gICAgICAgIHByb3RvID0gUGFwZXIucHJvdG90eXBlO1xuICAgIGlmICh3ICYmIHcudGFnTmFtZSAmJiB3LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcInN2Z1wiKSB7XG4gICAgICAgIGlmICh3LnNuYXAgaW4gaHViKSB7XG4gICAgICAgICAgICByZXR1cm4gaHViW3cuc25hcF07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRvYyA9IHcub3duZXJEb2N1bWVudDtcbiAgICAgICAgcmVzID0gbmV3IEVsZW1lbnQodyk7XG4gICAgICAgIGRlc2MgPSB3LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGVzY1wiKVswXTtcbiAgICAgICAgZGVmcyA9IHcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZWZzXCIpWzBdO1xuICAgICAgICBpZiAoIWRlc2MpIHtcbiAgICAgICAgICAgIGRlc2MgPSAkKFwiZGVzY1wiKTtcbiAgICAgICAgICAgIGRlc2MuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKFwiQ3JlYXRlZCB3aXRoIFNuYXBcIikpO1xuICAgICAgICAgICAgcmVzLm5vZGUuYXBwZW5kQ2hpbGQoZGVzYyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWZzKSB7XG4gICAgICAgICAgICBkZWZzID0gJChcImRlZnNcIik7XG4gICAgICAgICAgICByZXMubm9kZS5hcHBlbmRDaGlsZChkZWZzKTtcbiAgICAgICAgfVxuICAgICAgICByZXMuZGVmcyA9IGRlZnM7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm90bykgaWYgKHByb3RvW2hhc10oa2V5KSkge1xuICAgICAgICAgICAgcmVzW2tleV0gPSBwcm90b1trZXldO1xuICAgICAgICB9XG4gICAgICAgIHJlcy5wYXBlciA9IHJlcy5yb290ID0gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcyA9IG1ha2UoXCJzdmdcIiwgZ2xvYi5kb2MuYm9keSk7XG4gICAgICAgICQocmVzLm5vZGUsIHtcbiAgICAgICAgICAgIGhlaWdodDogaCxcbiAgICAgICAgICAgIHZlcnNpb246IDEuMSxcbiAgICAgICAgICAgIHdpZHRoOiB3LFxuICAgICAgICAgICAgeG1sbnM6IHhtbG5zXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gd3JhcChkb20pIHtcbiAgICBpZiAoIWRvbSkge1xuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBpZiAoZG9tIGluc3RhbmNlb2YgRWxlbWVudCB8fCBkb20gaW5zdGFuY2VvZiBGcmFnbWVudCkge1xuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBpZiAoZG9tLnRhZ05hbWUgJiYgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcInN2Z1wiKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFwZXIoZG9tKTtcbiAgICB9XG4gICAgaWYgKGRvbS50YWdOYW1lICYmIGRvbS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJvYmplY3RcIiAmJiBkb20udHlwZSA9PSBcImltYWdlL3N2Zyt4bWxcIikge1xuICAgICAgICByZXR1cm4gbmV3IFBhcGVyKGRvbS5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdmdcIilbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEVsZW1lbnQoZG9tKTtcbn1cblxuU25hcC5fLm1ha2UgPSBtYWtlO1xuU25hcC5fLndyYXAgPSB3cmFwO1xuLypcXFxuICogUGFwZXIuZWxcbiBbIG1ldGhvZCBdXG4gKipcbiAqIENyZWF0ZXMgYW4gZWxlbWVudCBvbiBwYXBlciB3aXRoIGEgZ2l2ZW4gbmFtZSBhbmQgbm8gYXR0cmlidXRlc1xuICoqXG4gLSBuYW1lIChzdHJpbmcpIHRhZyBuYW1lXG4gLSBhdHRyIChvYmplY3QpIGF0dHJpYnV0ZXNcbiA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gPiBVc2FnZVxuIHwgdmFyIGMgPSBwYXBlci5jaXJjbGUoMTAsIDEwLCAxMCk7IC8vIGlzIHRoZSBzYW1lIGFzLi4uXG4gfCB2YXIgYyA9IHBhcGVyLmVsKFwiY2lyY2xlXCIpLmF0dHIoe1xuIHwgICAgIGN4OiAxMCxcbiB8ICAgICBjeTogMTAsXG4gfCAgICAgcjogMTBcbiB8IH0pO1xuIHwgLy8gYW5kIHRoZSBzYW1lIGFzXG4gfCB2YXIgYyA9IHBhcGVyLmVsKFwiY2lyY2xlXCIsIHtcbiB8ICAgICBjeDogMTAsXG4gfCAgICAgY3k6IDEwLFxuIHwgICAgIHI6IDEwXG4gfCB9KTtcblxcKi9cblBhcGVyLnByb3RvdHlwZS5lbCA9IGZ1bmN0aW9uIChuYW1lLCBhdHRyKSB7XG4gICAgdmFyIGVsID0gbWFrZShuYW1lLCB0aGlzLm5vZGUpO1xuICAgIGF0dHIgJiYgZWwuYXR0cihhdHRyKTtcbiAgICByZXR1cm4gZWw7XG59O1xuLypcXFxuICogRWxlbWVudC5jaGlsZHJlblxuIFsgbWV0aG9kIF1cbiAqKlxuICogUmV0dXJucyBhcnJheSBvZiBhbGwgdGhlIGNoaWxkcmVuIG9mIHRoZSBlbGVtZW50LlxuID0gKGFycmF5KSBhcnJheSBvZiBFbGVtZW50c1xuXFwqL1xuRWxlbWVudC5wcm90b3R5cGUuY2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG91dCA9IFtdLFxuICAgICAgICBjaCA9IHRoaXMubm9kZS5jaGlsZE5vZGVzO1xuICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGNoLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgb3V0W2ldID0gU25hcChjaFtpXSk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59O1xuZnVuY3Rpb24ganNvbkZpbGxlcihyb290LCBvKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcm9vdC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHJvb3RbaV0udHlwZSxcbiAgICAgICAgICAgICAgICBhdHRyOiByb290W2ldLmF0dHIoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoaWxkcmVuID0gcm9vdFtpXS5jaGlsZHJlbigpO1xuICAgICAgICBvLnB1c2goaXRlbSk7XG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGpzb25GaWxsZXIoY2hpbGRyZW4sIGl0ZW0uY2hpbGROb2RlcyA9IFtdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qXFxcbiAqIEVsZW1lbnQudG9KU09OXG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXR1cm5zIG9iamVjdCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZWxlbWVudCBhbmQgYWxsIGl0cyBjaGlsZHJlbi5cbiA9IChvYmplY3QpIGluIGZvcm1hdFxuIG8ge1xuIG8gICAgIHR5cGUgKHN0cmluZykgdGhpcy50eXBlLFxuIG8gICAgIGF0dHIgKG9iamVjdCkgYXR0cmlidXRlcyBtYXAsXG4gbyAgICAgY2hpbGROb2RlcyAoYXJyYXkpIG9wdGlvbmFsIGFycmF5IG9mIGNoaWxkcmVuIGluIHRoZSBzYW1lIGZvcm1hdFxuIG8gfVxuXFwqL1xuRWxlbWVudC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBqc29uRmlsbGVyKFt0aGlzXSwgb3V0KTtcbiAgICByZXR1cm4gb3V0WzBdO1xufTtcbi8vIGRlZmF1bHRcbmV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXR0ID0gZXZlLm50KCk7XG4gICAgYXR0ID0gYXR0LnN1YnN0cmluZyhhdHQubGFzdEluZGV4T2YoXCIuXCIpICsgMSk7XG4gICAgdmFyIGNzcyA9IGF0dC5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICAgIHJldHVybiBcIi1cIiArIGxldHRlci50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuICAgIGlmIChjc3NBdHRyW2hhc10oY3NzKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5vZGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoY3NzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJCh0aGlzLm5vZGUsIGF0dCk7XG4gICAgfVxufSk7XG52YXIgY3NzQXR0ciA9IHtcbiAgICBcImFsaWdubWVudC1iYXNlbGluZVwiOiAwLFxuICAgIFwiYmFzZWxpbmUtc2hpZnRcIjogMCxcbiAgICBcImNsaXBcIjogMCxcbiAgICBcImNsaXAtcGF0aFwiOiAwLFxuICAgIFwiY2xpcC1ydWxlXCI6IDAsXG4gICAgXCJjb2xvclwiOiAwLFxuICAgIFwiY29sb3ItaW50ZXJwb2xhdGlvblwiOiAwLFxuICAgIFwiY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzXCI6IDAsXG4gICAgXCJjb2xvci1wcm9maWxlXCI6IDAsXG4gICAgXCJjb2xvci1yZW5kZXJpbmdcIjogMCxcbiAgICBcImN1cnNvclwiOiAwLFxuICAgIFwiZGlyZWN0aW9uXCI6IDAsXG4gICAgXCJkaXNwbGF5XCI6IDAsXG4gICAgXCJkb21pbmFudC1iYXNlbGluZVwiOiAwLFxuICAgIFwiZW5hYmxlLWJhY2tncm91bmRcIjogMCxcbiAgICBcImZpbGxcIjogMCxcbiAgICBcImZpbGwtb3BhY2l0eVwiOiAwLFxuICAgIFwiZmlsbC1ydWxlXCI6IDAsXG4gICAgXCJmaWx0ZXJcIjogMCxcbiAgICBcImZsb29kLWNvbG9yXCI6IDAsXG4gICAgXCJmbG9vZC1vcGFjaXR5XCI6IDAsXG4gICAgXCJmb250XCI6IDAsXG4gICAgXCJmb250LWZhbWlseVwiOiAwLFxuICAgIFwiZm9udC1zaXplXCI6IDAsXG4gICAgXCJmb250LXNpemUtYWRqdXN0XCI6IDAsXG4gICAgXCJmb250LXN0cmV0Y2hcIjogMCxcbiAgICBcImZvbnQtc3R5bGVcIjogMCxcbiAgICBcImZvbnQtdmFyaWFudFwiOiAwLFxuICAgIFwiZm9udC13ZWlnaHRcIjogMCxcbiAgICBcImdseXBoLW9yaWVudGF0aW9uLWhvcml6b250YWxcIjogMCxcbiAgICBcImdseXBoLW9yaWVudGF0aW9uLXZlcnRpY2FsXCI6IDAsXG4gICAgXCJpbWFnZS1yZW5kZXJpbmdcIjogMCxcbiAgICBcImtlcm5pbmdcIjogMCxcbiAgICBcImxldHRlci1zcGFjaW5nXCI6IDAsXG4gICAgXCJsaWdodGluZy1jb2xvclwiOiAwLFxuICAgIFwibWFya2VyXCI6IDAsXG4gICAgXCJtYXJrZXItZW5kXCI6IDAsXG4gICAgXCJtYXJrZXItbWlkXCI6IDAsXG4gICAgXCJtYXJrZXItc3RhcnRcIjogMCxcbiAgICBcIm1hc2tcIjogMCxcbiAgICBcIm9wYWNpdHlcIjogMCxcbiAgICBcIm92ZXJmbG93XCI6IDAsXG4gICAgXCJwb2ludGVyLWV2ZW50c1wiOiAwLFxuICAgIFwic2hhcGUtcmVuZGVyaW5nXCI6IDAsXG4gICAgXCJzdG9wLWNvbG9yXCI6IDAsXG4gICAgXCJzdG9wLW9wYWNpdHlcIjogMCxcbiAgICBcInN0cm9rZVwiOiAwLFxuICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiAwLFxuICAgIFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogMCxcbiAgICBcInN0cm9rZS1saW5lY2FwXCI6IDAsXG4gICAgXCJzdHJva2UtbGluZWpvaW5cIjogMCxcbiAgICBcInN0cm9rZS1taXRlcmxpbWl0XCI6IDAsXG4gICAgXCJzdHJva2Utb3BhY2l0eVwiOiAwLFxuICAgIFwic3Ryb2tlLXdpZHRoXCI6IDAsXG4gICAgXCJ0ZXh0LWFuY2hvclwiOiAwLFxuICAgIFwidGV4dC1kZWNvcmF0aW9uXCI6IDAsXG4gICAgXCJ0ZXh0LXJlbmRlcmluZ1wiOiAwLFxuICAgIFwidW5pY29kZS1iaWRpXCI6IDAsXG4gICAgXCJ2aXNpYmlsaXR5XCI6IDAsXG4gICAgXCJ3b3JkLXNwYWNpbmdcIjogMCxcbiAgICBcIndyaXRpbmctbW9kZVwiOiAwXG59O1xuXG5ldmUub24oXCJzbmFwLnV0aWwuYXR0clwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgYXR0ID0gZXZlLm50KCksXG4gICAgICAgIGF0dHIgPSB7fTtcbiAgICBhdHQgPSBhdHQuc3Vic3RyaW5nKGF0dC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgICBhdHRyW2F0dF0gPSB2YWx1ZTtcbiAgICB2YXIgc3R5bGUgPSBhdHQucmVwbGFjZSgvLShcXHcpL2dpLCBmdW5jdGlvbiAoYWxsLCBsZXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfSksXG4gICAgICAgIGNzcyA9IGF0dC5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gXCItXCIgKyBsZXR0ZXIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgaWYgKGNzc0F0dHJbaGFzXShjc3MpKSB7XG4gICAgICAgIHRoaXMubm9kZS5zdHlsZVtzdHlsZV0gPSB2YWx1ZSA9PSBudWxsID8gRSA6IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5ub2RlLCBhdHRyKTtcbiAgICB9XG59KTtcbihmdW5jdGlvbiAocHJvdG8pIHt9KFBhcGVyLnByb3RvdHlwZSkpO1xuXG4vLyBzaW1wbGUgYWpheFxuLypcXFxuICogU25hcC5hamF4XG4gWyBtZXRob2QgXVxuICoqXG4gKiBTaW1wbGUgaW1wbGVtZW50YXRpb24gb2YgQWpheFxuICoqXG4gLSB1cmwgKHN0cmluZykgVVJMXG4gLSBwb3N0RGF0YSAob2JqZWN0fHN0cmluZykgZGF0YSBmb3IgcG9zdCByZXF1ZXN0XG4gLSBjYWxsYmFjayAoZnVuY3Rpb24pIGNhbGxiYWNrXG4gLSBzY29wZSAob2JqZWN0KSAjb3B0aW9uYWwgc2NvcGUgb2YgY2FsbGJhY2tcbiAqIG9yXG4gLSB1cmwgKHN0cmluZykgVVJMXG4gLSBjYWxsYmFjayAoZnVuY3Rpb24pIGNhbGxiYWNrXG4gLSBzY29wZSAob2JqZWN0KSAjb3B0aW9uYWwgc2NvcGUgb2YgY2FsbGJhY2tcbiA9IChYTUxIdHRwUmVxdWVzdCkgdGhlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCwganVzdCBpbiBjYXNlXG5cXCovXG5TbmFwLmFqYXggPSBmdW5jdGlvbiAodXJsLCBwb3N0RGF0YSwgY2FsbGJhY2ssIHNjb3BlKXtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0LFxuICAgICAgICBpZCA9IElEKCk7XG4gICAgaWYgKHJlcSkge1xuICAgICAgICBpZiAoaXMocG9zdERhdGEsIFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIHNjb3BlID0gY2FsbGJhY2s7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHBvc3REYXRhO1xuICAgICAgICAgICAgcG9zdERhdGEgPSBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGlzKHBvc3REYXRhLCBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgdmFyIHBkID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcG9zdERhdGEpIGlmIChwb3N0RGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcGQucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBvc3REYXRhW2tleV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3REYXRhID0gcGQuam9pbihcIiZcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxLm9wZW4ocG9zdERhdGEgPyBcIlBPU1RcIiA6IFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIGlmIChwb3N0RGF0YSkge1xuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGV2ZS5vbmNlKFwic25hcC5hamF4LlwiICsgaWQgKyBcIi4wXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGV2ZS5vbmNlKFwic25hcC5hamF4LlwiICsgaWQgKyBcIi4yMDBcIiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgZXZlLm9uY2UoXCJzbmFwLmFqYXguXCIgKyBpZCArIFwiLjMwNFwiLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcbiAgICAgICAgICAgIGV2ZShcInNuYXAuYWpheC5cIiArIGlkICsgXCIuXCIgKyByZXEuc3RhdHVzLCBzY29wZSwgcmVxKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH1cbiAgICAgICAgcmVxLnNlbmQocG9zdERhdGEpO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgIH1cbn07XG4vKlxcXG4gKiBTbmFwLmxvYWRcbiBbIG1ldGhvZCBdXG4gKipcbiAqIExvYWRzIGV4dGVybmFsIFNWRyBmaWxlIGFzIGEgQEZyYWdtZW50IChzZWUgQFNuYXAuYWpheCBmb3IgbW9yZSBhZHZhbmNlZCBBSkFYKVxuICoqXG4gLSB1cmwgKHN0cmluZykgVVJMXG4gLSBjYWxsYmFjayAoZnVuY3Rpb24pIGNhbGxiYWNrXG4gLSBzY29wZSAob2JqZWN0KSAjb3B0aW9uYWwgc2NvcGUgb2YgY2FsbGJhY2tcblxcKi9cblNuYXAubG9hZCA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrLCBzY29wZSkge1xuICAgIFNuYXAuYWpheCh1cmwsIGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAgdmFyIGYgPSBTbmFwLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBzY29wZSA/IGNhbGxiYWNrLmNhbGwoc2NvcGUsIGYpIDogY2FsbGJhY2soZik7XG4gICAgfSk7XG59O1xudmFyIGdldE9mZnNldCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgdmFyIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgIGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudCxcbiAgICAgICAgYm9keSA9IGRvYy5ib2R5LFxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgY2xpZW50VG9wID0gZG9jRWxlbS5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMCwgY2xpZW50TGVmdCA9IGRvY0VsZW0uY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMCxcbiAgICAgICAgdG9wICA9IGJveC50b3AgICsgKGcud2luLnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsVG9wIHx8IGJvZHkuc2Nyb2xsVG9wICkgLSBjbGllbnRUb3AsXG4gICAgICAgIGxlZnQgPSBib3gubGVmdCArIChnLndpbi5wYWdlWE9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbExlZnQgfHwgYm9keS5zY3JvbGxMZWZ0KSAtIGNsaWVudExlZnQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeTogdG9wLFxuICAgICAgICB4OiBsZWZ0XG4gICAgfTtcbn07XG4vKlxcXG4gKiBTbmFwLmdldEVsZW1lbnRCeVBvaW50XG4gWyBtZXRob2QgXVxuICoqXG4gKiBSZXR1cm5zIHlvdSB0b3Btb3N0IGVsZW1lbnQgdW5kZXIgZ2l2ZW4gcG9pbnQuXG4gKipcbiA9IChvYmplY3QpIFNuYXAgZWxlbWVudCBvYmplY3RcbiAtIHggKG51bWJlcikgeCBjb29yZGluYXRlIGZyb20gdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgd2luZG93XG4gLSB5IChudW1iZXIpIHkgY29vcmRpbmF0ZSBmcm9tIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgdGhlIHdpbmRvd1xuID4gVXNhZ2VcbiB8IFNuYXAuZ2V0RWxlbWVudEJ5UG9pbnQobW91c2VYLCBtb3VzZVkpLmF0dHIoe3N0cm9rZTogXCIjZjAwXCJ9KTtcblxcKi9cblNuYXAuZ2V0RWxlbWVudEJ5UG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHZhciBwYXBlciA9IHRoaXMsXG4gICAgICAgIHN2ZyA9IHBhcGVyLmNhbnZhcyxcbiAgICAgICAgdGFyZ2V0ID0gZ2xvYi5kb2MuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICBpZiAoZ2xvYi53aW4ub3BlcmEgJiYgdGFyZ2V0LnRhZ05hbWUgPT0gXCJzdmdcIikge1xuICAgICAgICB2YXIgc28gPSBnZXRPZmZzZXQodGFyZ2V0KSxcbiAgICAgICAgICAgIHNyID0gdGFyZ2V0LmNyZWF0ZVNWR1JlY3QoKTtcbiAgICAgICAgc3IueCA9IHggLSBzby54O1xuICAgICAgICBzci55ID0geSAtIHNvLnk7XG4gICAgICAgIHNyLndpZHRoID0gc3IuaGVpZ2h0ID0gMTtcbiAgICAgICAgdmFyIGhpdHMgPSB0YXJnZXQuZ2V0SW50ZXJzZWN0aW9uTGlzdChzciwgbnVsbCk7XG4gICAgICAgIGlmIChoaXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gaGl0c1toaXRzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcCh0YXJnZXQpO1xufTtcbi8qXFxcbiAqIFNuYXAucGx1Z2luXG4gWyBtZXRob2QgXVxuICoqXG4gKiBMZXQgeW91IHdyaXRlIHBsdWdpbnMuIFlvdSBwYXNzIGluIGEgZnVuY3Rpb24gd2l0aCBmaXZlIGFyZ3VtZW50cywgbGlrZSB0aGlzOlxuIHwgU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iYWwsIEZyYWdtZW50KSB7XG4gfCAgICAgU25hcC5uZXdtZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcbiB8ICAgICBFbGVtZW50LnByb3RvdHlwZS5uZXdtZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcbiB8ICAgICBQYXBlci5wcm90b3R5cGUubmV3bWV0aG9kID0gZnVuY3Rpb24gKCkge307XG4gfCB9KTtcbiAqIEluc2lkZSB0aGUgZnVuY3Rpb24geW91IGhhdmUgYWNjZXNzIHRvIGFsbCBtYWluIG9iamVjdHMgKGFuZCB0aGVpclxuICogcHJvdG90eXBlcykuIFRoaXMgYWxsb3cgeW91IHRvIGV4dGVuZCBhbnl0aGluZyB5b3Ugd2FudC5cbiAqKlxuIC0gZiAoZnVuY3Rpb24pIHlvdXIgcGx1Z2luIGJvZHlcblxcKi9cblNuYXAucGx1Z2luID0gZnVuY3Rpb24gKGYpIHtcbiAgICBmKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCk7XG59O1xuZ2xvYi53aW4uU25hcCA9IFNuYXA7XG5yZXR1cm4gU25hcDtcbn0od2luZG93IHx8IHRoaXMpKTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIGlzID0gU25hcC5pcyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICB1bml0MnB4ID0gU25hcC5fdW5pdDJweCxcbiAgICAgICAgJCA9IFNuYXAuXy4kLFxuICAgICAgICBtYWtlID0gU25hcC5fLm1ha2UsXG4gICAgICAgIGdldFNvbWVEZWZzID0gU25hcC5fLmdldFNvbWVEZWZzLFxuICAgICAgICBoYXMgPSBcImhhc093blByb3BlcnR5XCIsXG4gICAgICAgIHdyYXAgPSBTbmFwLl8ud3JhcDtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5nZXRCQm94XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBib3VuZGluZyBib3ggZGVzY3JpcHRvciBmb3IgdGhlIGdpdmVuIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSBib3VuZGluZyBib3ggZGVzY3JpcHRvcjpcbiAgICAgbyB7XG4gICAgIG8gICAgIGN4OiAobnVtYmVyKSB4IG9mIHRoZSBjZW50ZXIsXG4gICAgIG8gICAgIGN5OiAobnVtYmVyKSB4IG9mIHRoZSBjZW50ZXIsXG4gICAgIG8gICAgIGg6IChudW1iZXIpIGhlaWdodCxcbiAgICAgbyAgICAgaGVpZ2h0OiAobnVtYmVyKSBoZWlnaHQsXG4gICAgIG8gICAgIHBhdGg6IChzdHJpbmcpIHBhdGggY29tbWFuZCBmb3IgdGhlIGJveCxcbiAgICAgbyAgICAgcjA6IChudW1iZXIpIHJhZGl1cyBvZiBhIGNpcmNsZSB0aGF0IGZ1bGx5IGVuY2xvc2VzIHRoZSBib3gsXG4gICAgIG8gICAgIHIxOiAobnVtYmVyKSByYWRpdXMgb2YgdGhlIHNtYWxsZXN0IGNpcmNsZSB0aGF0IGNhbiBiZSBlbmNsb3NlZCxcbiAgICAgbyAgICAgcjI6IChudW1iZXIpIHJhZGl1cyBvZiB0aGUgbGFyZ2VzdCBjaXJjbGUgdGhhdCBjYW4gYmUgZW5jbG9zZWQsXG4gICAgIG8gICAgIHZiOiAoc3RyaW5nKSBib3ggYXMgYSB2aWV3Ym94IGNvbW1hbmQsXG4gICAgIG8gICAgIHc6IChudW1iZXIpIHdpZHRoLFxuICAgICBvICAgICB3aWR0aDogKG51bWJlcikgd2lkdGgsXG4gICAgIG8gICAgIHgyOiAobnVtYmVyKSB4IG9mIHRoZSByaWdodCBzaWRlLFxuICAgICBvICAgICB4OiAobnVtYmVyKSB4IG9mIHRoZSBsZWZ0IHNpZGUsXG4gICAgIG8gICAgIHkyOiAobnVtYmVyKSB5IG9mIHRoZSBib3R0b20gZWRnZSxcbiAgICAgbyAgICAgeTogKG51bWJlcikgeSBvZiB0aGUgdG9wIGVkZ2VcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIGVscHJvdG8uZ2V0QkJveCA9IGZ1bmN0aW9uIChpc1dpdGhvdXRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcInRzcGFuXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KHRoaXMubm9kZS5nZXRDbGllbnRSZWN0cygpLml0ZW0oMCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghU25hcC5NYXRyaXggfHwgIVNuYXAucGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRCQm94KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsID0gdGhpcyxcbiAgICAgICAgICAgIG0gPSBuZXcgU25hcC5NYXRyaXg7XG4gICAgICAgIGlmIChlbC5yZW1vdmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gU25hcC5fLmJveCgpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChlbC50eXBlID09IFwidXNlXCIpIHtcbiAgICAgICAgICAgIGlmICghaXNXaXRob3V0VHJhbnNmb3JtKSB7XG4gICAgICAgICAgICAgICAgbSA9IG0uYWRkKGVsLnRyYW5zZm9ybSgpLmxvY2FsTWF0cml4LnRyYW5zbGF0ZShlbC5hdHRyKFwieFwiKSB8fCAwLCBlbC5hdHRyKFwieVwiKSB8fCAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZWwub3JpZ2luYWwpIHtcbiAgICAgICAgICAgICAgICBlbCA9IGVsLm9yaWdpbmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGVsLmF0dHIoXCJ4bGluazpocmVmXCIpO1xuICAgICAgICAgICAgICAgIGVsID0gZWwub3JpZ2luYWwgPSBlbC5ub2RlLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHJlZi5zdWJzdHJpbmcoaHJlZi5pbmRleE9mKFwiI1wiKSArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgXyA9IGVsLl8sXG4gICAgICAgICAgICBwYXRoZmluZGVyID0gU25hcC5wYXRoLmdldFtlbC50eXBlXSB8fCBTbmFwLnBhdGguZ2V0LmRlZmx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGlzV2l0aG91dFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICAgIF8uYmJveHd0ID0gcGF0aGZpbmRlciA/IFNuYXAucGF0aC5nZXRCQm94KGVsLnJlYWxQYXRoID0gcGF0aGZpbmRlcihlbCkpIDogU25hcC5fLmJveChlbC5ub2RlLmdldEJCb3goKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNuYXAuXy5ib3goXy5iYm94d3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5yZWFsUGF0aCA9IHBhdGhmaW5kZXIoZWwpO1xuICAgICAgICAgICAgICAgIGVsLm1hdHJpeCA9IGVsLnRyYW5zZm9ybSgpLmxvY2FsTWF0cml4O1xuICAgICAgICAgICAgICAgIF8uYmJveCA9IFNuYXAucGF0aC5nZXRCQm94KFNuYXAucGF0aC5tYXAoZWwucmVhbFBhdGgsIG0uYWRkKGVsLm1hdHJpeCkpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gU25hcC5fLmJveChfLmJib3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IGRvZXNu4oCZdCBnaXZlIHlvdSBiYm94IG9mIGhpZGRlbiBlbGVtZW50XG4gICAgICAgICAgICByZXR1cm4gU25hcC5fLmJveCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcHJvcFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nO1xuICAgIH07XG4gICAgZnVuY3Rpb24gZXh0cmFjdFRyYW5zZm9ybShlbCwgdHN0cikge1xuICAgICAgICBpZiAodHN0ciA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZG9SZXR1cm4gPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGVsLnR5cGUgPT0gXCJsaW5lYXJHcmFkaWVudFwiIHx8IGVsLnR5cGUgPT0gXCJyYWRpYWxHcmFkaWVudFwiKSB7XG4gICAgICAgICAgICAgICAgdHN0ciA9IGVsLm5vZGUuZ2V0QXR0cmlidXRlKFwiZ3JhZGllbnRUcmFuc2Zvcm1cIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT0gXCJwYXR0ZXJuXCIpIHtcbiAgICAgICAgICAgICAgICB0c3RyID0gZWwubm9kZS5nZXRBdHRyaWJ1dGUoXCJwYXR0ZXJuVHJhbnNmb3JtXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0c3RyID0gZWwubm9kZS5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRzdHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNuYXAuTWF0cml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHN0ciA9IFNuYXAuXy5zdmdUcmFuc2Zvcm0yc3RyaW5nKHRzdHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFTbmFwLl8ucmdUcmFuc2Zvcm0udGVzdCh0c3RyKSkge1xuICAgICAgICAgICAgICAgIHRzdHIgPSBTbmFwLl8uc3ZnVHJhbnNmb3JtMnN0cmluZyh0c3RyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHN0ciA9IFN0cih0c3RyKS5yZXBsYWNlKC9cXC57M318XFx1MjAyNi9nLCBlbC5fLnRyYW5zZm9ybSB8fCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpcyh0c3RyLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICAgICAgdHN0ciA9IFNuYXAucGF0aCA/IFNuYXAucGF0aC50b1N0cmluZy5jYWxsKHRzdHIpIDogU3RyKHRzdHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwuXy50cmFuc2Zvcm0gPSB0c3RyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtID0gU25hcC5fLnRyYW5zZm9ybTJtYXRyaXgodHN0ciwgZWwuZ2V0QkJveCgxKSk7XG4gICAgICAgIGlmIChkb1JldHVybikge1xuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5tYXRyaXggPSBtO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRyYW5zZm9ybVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogR2V0cyBvciBzZXRzIHRyYW5zZm9ybWF0aW9uIG9mIHRoZSBlbGVtZW50XG4gICAgICoqXG4gICAgIC0gdHN0ciAoc3RyaW5nKSB0cmFuc2Zvcm0gc3RyaW5nIGluIFNuYXAgb3IgU1ZHIGZvcm1hdFxuICAgICA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICogb3JcbiAgICAgPSAob2JqZWN0KSB0cmFuc2Zvcm1hdGlvbiBkZXNjcmlwdG9yOlxuICAgICBvIHtcbiAgICAgbyAgICAgc3RyaW5nIChzdHJpbmcpIHRyYW5zZm9ybSBzdHJpbmcsXG4gICAgIG8gICAgIGdsb2JhbE1hdHJpeCAoTWF0cml4KSBtYXRyaXggb2YgYWxsIHRyYW5zZm9ybWF0aW9ucyBhcHBsaWVkIHRvIGVsZW1lbnQgb3IgaXRzIHBhcmVudHMsXG4gICAgIG8gICAgIGxvY2FsTWF0cml4IChNYXRyaXgpIG1hdHJpeCBvZiB0cmFuc2Zvcm1hdGlvbnMgYXBwbGllZCBvbmx5IHRvIHRoZSBlbGVtZW50LFxuICAgICBvICAgICBkaWZmTWF0cml4IChNYXRyaXgpIG1hdHJpeCBvZiBkaWZmZXJlbmNlIGJldHdlZW4gZ2xvYmFsIGFuZCBsb2NhbCB0cmFuc2Zvcm1hdGlvbnMsXG4gICAgIG8gICAgIGdsb2JhbCAoc3RyaW5nKSBnbG9iYWwgdHJhbnNmb3JtYXRpb24gYXMgc3RyaW5nLFxuICAgICBvICAgICBsb2NhbCAoc3RyaW5nKSBsb2NhbCB0cmFuc2Zvcm1hdGlvbiBhcyBzdHJpbmcsXG4gICAgIG8gICAgIHRvU3RyaW5nIChmdW5jdGlvbikgcmV0dXJucyBgc3RyaW5nYCBwcm9wZXJ0eVxuICAgICBvIH1cbiAgICBcXCovXG4gICAgZWxwcm90by50cmFuc2Zvcm0gPSBmdW5jdGlvbiAodHN0cikge1xuICAgICAgICB2YXIgXyA9IHRoaXMuXztcbiAgICAgICAgaWYgKHRzdHIgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHBhcGEgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGdsb2JhbCA9IG5ldyBTbmFwLk1hdHJpeCh0aGlzLm5vZGUuZ2V0Q1RNKCkpLFxuICAgICAgICAgICAgICAgIGxvY2FsID0gZXh0cmFjdFRyYW5zZm9ybSh0aGlzKSxcbiAgICAgICAgICAgICAgICBtcyA9IFtsb2NhbF0sXG4gICAgICAgICAgICAgICAgbSA9IG5ldyBTbmFwLk1hdHJpeCxcbiAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgIGxvY2FsU3RyaW5nID0gbG9jYWwudG9UcmFuc2Zvcm1TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBTdHIobG9jYWwpID09IFN0cih0aGlzLm1hdHJpeCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cihfLnRyYW5zZm9ybSkgOiBsb2NhbFN0cmluZztcbiAgICAgICAgICAgIHdoaWxlIChwYXBhLnR5cGUgIT0gXCJzdmdcIiAmJiAocGFwYSA9IHBhcGEucGFyZW50KCkpKSB7XG4gICAgICAgICAgICAgICAgbXMucHVzaChleHRyYWN0VHJhbnNmb3JtKHBhcGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgPSBtcy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgbS5hZGQobXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBnbG9iYWxNYXRyaXg6IGdsb2JhbCxcbiAgICAgICAgICAgICAgICB0b3RhbE1hdHJpeDogbSxcbiAgICAgICAgICAgICAgICBsb2NhbE1hdHJpeDogbG9jYWwsXG4gICAgICAgICAgICAgICAgZGlmZk1hdHJpeDogZ2xvYmFsLmNsb25lKCkuYWRkKGxvY2FsLmludmVydCgpKSxcbiAgICAgICAgICAgICAgICBnbG9iYWw6IGdsb2JhbC50b1RyYW5zZm9ybVN0cmluZygpLFxuICAgICAgICAgICAgICAgIHRvdGFsOiBtLnRvVHJhbnNmb3JtU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbG9jYWw6IGxvY2FsU3RyaW5nLFxuICAgICAgICAgICAgICAgIHRvU3RyaW5nOiBwcm9wU3RyaW5nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0c3RyIGluc3RhbmNlb2YgU25hcC5NYXRyaXgpIHtcbiAgICAgICAgICAgIHRoaXMubWF0cml4ID0gdHN0cjtcbiAgICAgICAgICAgIHRoaXMuXy50cmFuc2Zvcm0gPSB0c3RyLnRvVHJhbnNmb3JtU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRyYWN0VHJhbnNmb3JtKHRoaXMsIHRzdHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcImxpbmVhckdyYWRpZW50XCIgfHwgdGhpcy50eXBlID09IFwicmFkaWFsR3JhZGllbnRcIikge1xuICAgICAgICAgICAgICAgICQodGhpcy5ub2RlLCB7Z3JhZGllbnRUcmFuc2Zvcm06IHRoaXMubWF0cml4fSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PSBcInBhdHRlcm5cIikge1xuICAgICAgICAgICAgICAgICQodGhpcy5ub2RlLCB7cGF0dGVyblRyYW5zZm9ybTogdGhpcy5tYXRyaXh9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHt0cmFuc2Zvcm06IHRoaXMubWF0cml4fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnBhcmVudFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgZWxlbWVudCdzIHBhcmVudFxuICAgICAqKlxuICAgICA9IChFbGVtZW50KSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5wYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3cmFwKHRoaXMubm9kZS5wYXJlbnROb2RlKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFwcGVuZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQXBwZW5kcyB0aGUgZ2l2ZW4gZWxlbWVudCB0byBjdXJyZW50IG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50fFNldCkgZWxlbWVudCB0byBhcHBlbmRcbiAgICAgPSAoRWxlbWVudCkgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFkZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2VlIEBFbGVtZW50LmFwcGVuZFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmFwcGVuZCA9IGVscHJvdG8uYWRkID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgaWYgKGVsLnR5cGUgPT0gXCJzZXRcIikge1xuICAgICAgICAgICAgICAgIHZhciBpdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgZWwuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaXQuYWRkKGVsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoZWwubm9kZSk7XG4gICAgICAgICAgICBlbC5wYXBlciA9IHRoaXMucGFwZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5hcHBlbmRUb1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQXBwZW5kcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIHRoZSBnaXZlbiBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgcGFyZW50IGVsZW1lbnQgdG8gYXBwZW5kIHRvXG4gICAgID0gKEVsZW1lbnQpIHRoZSBjaGlsZCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uYXBwZW5kVG8gPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBlbCA9IHdyYXAoZWwpO1xuICAgICAgICAgICAgZWwuYXBwZW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucHJlcGVuZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUHJlcGVuZHMgdGhlIGdpdmVuIGVsZW1lbnQgdG8gdGhlIGN1cnJlbnQgb25lXG4gICAgICoqXG4gICAgIC0gZWwgKEVsZW1lbnQpIGVsZW1lbnQgdG8gcHJlcGVuZFxuICAgICA9IChFbGVtZW50KSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5wcmVwZW5kID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgaWYgKGVsLnR5cGUgPT0gXCJzZXRcIikge1xuICAgICAgICAgICAgICAgIHZhciBpdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0O1xuICAgICAgICAgICAgICAgIGVsLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QuYWZ0ZXIoZWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQucHJlcGVuZChlbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmlyc3QgPSBlbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50KCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKGVsLm5vZGUsIHRoaXMubm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIHRoaXMuYWRkICYmIHRoaXMuYWRkKCk7XG4gICAgICAgICAgICBlbC5wYXBlciA9IHRoaXMucGFwZXI7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCgpICYmIHRoaXMucGFyZW50KCkuYWRkKCk7XG4gICAgICAgICAgICBwYXJlbnQgJiYgcGFyZW50LmFkZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucHJlcGVuZFRvXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBQcmVwZW5kcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIHRoZSBnaXZlbiBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgcGFyZW50IGVsZW1lbnQgdG8gcHJlcGVuZCB0b1xuICAgICA9IChFbGVtZW50KSB0aGUgY2hpbGQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnByZXBlbmRUbyA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbCA9IHdyYXAoZWwpO1xuICAgICAgICBlbC5wcmVwZW5kKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmJlZm9yZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogSW5zZXJ0cyBnaXZlbiBlbGVtZW50IGJlZm9yZSB0aGUgY3VycmVudCBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgZWxlbWVudCB0byBpbnNlcnRcbiAgICAgPSAoRWxlbWVudCkgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uYmVmb3JlID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGlmIChlbC50eXBlID09IFwic2V0XCIpIHtcbiAgICAgICAgICAgIHZhciBpdCA9IHRoaXM7XG4gICAgICAgICAgICBlbC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICBpdC5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLm5vZGUsIGl0Lm5vZGUpO1xuICAgICAgICAgICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50KCkuYWRkKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBlbCA9IHdyYXAoZWwpO1xuICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbC5ub2RlLCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLnBhcmVudCgpICYmIHRoaXMucGFyZW50KCkuYWRkKCk7XG4gICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgIGVsLnBhcGVyID0gdGhpcy5wYXBlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5hZnRlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogSW5zZXJ0cyBnaXZlbiBlbGVtZW50IGFmdGVyIHRoZSBjdXJyZW50IG9uZVxuICAgICAqKlxuICAgICAtIGVsIChFbGVtZW50KSBlbGVtZW50IHRvIGluc2VydFxuICAgICA9IChFbGVtZW50KSB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5hZnRlciA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbCA9IHdyYXAoZWwpO1xuICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50KCk7XG4gICAgICAgIGlmICh0aGlzLm5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbC5ub2RlLCB0aGlzLm5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZWwubm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQoKSAmJiB0aGlzLnBhcmVudCgpLmFkZCgpO1xuICAgICAgICBwYXJlbnQgJiYgcGFyZW50LmFkZCgpO1xuICAgICAgICBlbC5wYXBlciA9IHRoaXMucGFwZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuaW5zZXJ0QmVmb3JlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBJbnNlcnRzIHRoZSBlbGVtZW50IGFmdGVyIHRoZSBnaXZlbiBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgZWxlbWVudCBuZXh0IHRvIHdob20gaW5zZXJ0IHRvXG4gICAgID0gKEVsZW1lbnQpIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmluc2VydEJlZm9yZSA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbCA9IHdyYXAoZWwpO1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQoKTtcbiAgICAgICAgZWwubm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLm5vZGUsIGVsLm5vZGUpO1xuICAgICAgICB0aGlzLnBhcGVyID0gZWwucGFwZXI7XG4gICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgIGVsLnBhcmVudCgpICYmIGVsLnBhcmVudCgpLmFkZCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50Lmluc2VydEFmdGVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBJbnNlcnRzIHRoZSBlbGVtZW50IGFmdGVyIHRoZSBnaXZlbiBvbmVcbiAgICAgKipcbiAgICAgLSBlbCAoRWxlbWVudCkgZWxlbWVudCBuZXh0IHRvIHdob20gaW5zZXJ0IHRvXG4gICAgID0gKEVsZW1lbnQpIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmluc2VydEFmdGVyID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsID0gd3JhcChlbCk7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCgpO1xuICAgICAgICBlbC5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubm9kZSwgZWwubm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgIHRoaXMucGFwZXIgPSBlbC5wYXBlcjtcbiAgICAgICAgcGFyZW50ICYmIHBhcmVudC5hZGQoKTtcbiAgICAgICAgZWwucGFyZW50KCkgJiYgZWwucGFyZW50KCkuYWRkKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucmVtb3ZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG4gICAgID0gKEVsZW1lbnQpIHRoZSBkZXRhY2hlZCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUgJiYgdGhpcy5ub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgZGVsZXRlIHRoaXMucGFwZXI7XG4gICAgICAgIHRoaXMucmVtb3ZlZCA9IHRydWU7XG4gICAgICAgIHBhcmVudCAmJiBwYXJlbnQuYWRkKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuc2VsZWN0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBHYXRoZXJzIHRoZSBuZXN0ZWQgQEVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHNldCBvZiBDU1Mgc2VsZWN0b3JzXG4gICAgICoqXG4gICAgIC0gcXVlcnkgKHN0cmluZykgQ1NTIHNlbGVjdG9yXG4gICAgID0gKEVsZW1lbnQpIHJlc3VsdCBvZiBxdWVyeSBzZWxlY3Rpb25cbiAgICBcXCovXG4gICAgZWxwcm90by5zZWxlY3QgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHdyYXAodGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IocXVlcnkpKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnNlbGVjdEFsbFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogR2F0aGVycyBuZXN0ZWQgQEVsZW1lbnQgb2JqZWN0cyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2V0IG9mIENTUyBzZWxlY3RvcnNcbiAgICAgKipcbiAgICAgLSBxdWVyeSAoc3RyaW5nKSBDU1Mgc2VsZWN0b3JcbiAgICAgPSAoU2V0fGFycmF5KSByZXN1bHQgb2YgcXVlcnkgc2VsZWN0aW9uXG4gICAgXFwqL1xuICAgIGVscHJvdG8uc2VsZWN0QWxsID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgICAgIHZhciBub2RlbGlzdCA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSxcbiAgICAgICAgICAgIHNldCA9IChTbmFwLnNldCB8fCBBcnJheSkoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2V0LnB1c2god3JhcChub2RlbGlzdFtpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5hc1BYXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGdpdmVuIGF0dHJpYnV0ZSBvZiB0aGUgZWxlbWVudCBhcyBhIGBweGAgdmFsdWUgKG5vdCAlLCBlbSwgZXRjLilcbiAgICAgKipcbiAgICAgLSBhdHRyIChzdHJpbmcpIGF0dHJpYnV0ZSBuYW1lXG4gICAgIC0gdmFsdWUgKHN0cmluZykgI29wdGlvbmFsIGF0dHJpYnV0ZSB2YWx1ZVxuICAgICA9IChFbGVtZW50KSByZXN1bHQgb2YgcXVlcnkgc2VsZWN0aW9uXG4gICAgXFwqL1xuICAgIGVscHJvdG8uYXNQWCA9IGZ1bmN0aW9uIChhdHRyLCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmF0dHIoYXR0cik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICt1bml0MnB4KHRoaXMsIGF0dHIsIHZhbHVlKTtcbiAgICB9O1xuICAgIC8vIFNJRVJSQSBFbGVtZW50LnVzZSgpOiBJIHN1Z2dlc3QgYWRkaW5nIGEgbm90ZSBhYm91dCBob3cgdG8gYWNjZXNzIHRoZSBvcmlnaW5hbCBlbGVtZW50IHRoZSByZXR1cm5lZCA8dXNlPiBpbnN0YW50aWF0ZXMuIEl0J3MgYSBwYXJ0IG9mIFNWRyB3aXRoIHdoaWNoIG9yZGluYXJ5IHdlYiBkZXZlbG9wZXJzIG1heSBiZSBsZWFzdCBmYW1pbGlhci5cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51c2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSBgPHVzZT5gIGVsZW1lbnQgbGlua2VkIHRvIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICAgKipcbiAgICAgPSAoRWxlbWVudCkgdGhlIGA8dXNlPmAgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVzZSxcbiAgICAgICAgICAgIGlkID0gdGhpcy5ub2RlLmlkO1xuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICAgICAkKHRoaXMubm9kZSwge1xuICAgICAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcImxpbmVhckdyYWRpZW50XCIgfHwgdGhpcy50eXBlID09IFwicmFkaWFsR3JhZGllbnRcIiB8fFxuICAgICAgICAgICAgdGhpcy50eXBlID09IFwicGF0dGVyblwiKSB7XG4gICAgICAgICAgICB1c2UgPSBtYWtlKHRoaXMudHlwZSwgdGhpcy5ub2RlLnBhcmVudE5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXNlID0gbWFrZShcInVzZVwiLCB0aGlzLm5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgJCh1c2Uubm9kZSwge1xuICAgICAgICAgICAgXCJ4bGluazpocmVmXCI6IFwiI1wiICsgaWRcbiAgICAgICAgfSk7XG4gICAgICAgIHVzZS5vcmlnaW5hbCA9IHRoaXM7XG4gICAgICAgIHJldHVybiB1c2U7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBmaXhpZHMoZWwpIHtcbiAgICAgICAgdmFyIGVscyA9IGVsLnNlbGVjdEFsbChcIipcIiksXG4gICAgICAgICAgICBpdCxcbiAgICAgICAgICAgIHVybCA9IC9eXFxzKnVybFxcKChcInwnfCkoLiopXFwxXFwpXFxzKiQvLFxuICAgICAgICAgICAgaWRzID0gW10sXG4gICAgICAgICAgICB1c2VzID0ge307XG4gICAgICAgIGZ1bmN0aW9uIHVybHRlc3QoaXQsIG5hbWUpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAkKGl0Lm5vZGUsIG5hbWUpO1xuICAgICAgICAgICAgdmFsID0gdmFsICYmIHZhbC5tYXRjaCh1cmwpO1xuICAgICAgICAgICAgdmFsID0gdmFsICYmIHZhbFsyXTtcbiAgICAgICAgICAgIGlmICh2YWwgJiYgdmFsLmNoYXJBdCgpID09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdmFsLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIHVzZXNbdmFsXSA9ICh1c2VzW3ZhbF0gfHwgW10pLmNvbmNhdChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cltuYW1lXSA9IFNuYXAudXJsKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgJChpdC5ub2RlLCBhdHRyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBsaW5rdGVzdChpdCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9ICQoaXQubm9kZSwgXCJ4bGluazpocmVmXCIpO1xuICAgICAgICAgICAgaWYgKHZhbCAmJiB2YWwuY2hhckF0KCkgPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgdXNlc1t2YWxdID0gKHVzZXNbdmFsXSB8fCBbXSkuY29uY2F0KGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5hdHRyKFwieGxpbms6aHJlZlwiLCBcIiNcIiArIGlkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBlbHMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgaXQgPSBlbHNbaV07XG4gICAgICAgICAgICB1cmx0ZXN0KGl0LCBcImZpbGxcIik7XG4gICAgICAgICAgICB1cmx0ZXN0KGl0LCBcInN0cm9rZVwiKTtcbiAgICAgICAgICAgIHVybHRlc3QoaXQsIFwiZmlsdGVyXCIpO1xuICAgICAgICAgICAgdXJsdGVzdChpdCwgXCJtYXNrXCIpO1xuICAgICAgICAgICAgdXJsdGVzdChpdCwgXCJjbGlwLXBhdGhcIik7XG4gICAgICAgICAgICBsaW5rdGVzdChpdCk7XG4gICAgICAgICAgICB2YXIgb2xkaWQgPSAkKGl0Lm5vZGUsIFwiaWRcIik7XG4gICAgICAgICAgICBpZiAob2xkaWQpIHtcbiAgICAgICAgICAgICAgICAkKGl0Lm5vZGUsIHtpZDogaXQuaWR9KTtcbiAgICAgICAgICAgICAgICBpZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG9sZDogb2xkaWQsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdC5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDAsIGlpID0gaWRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmcyA9IHVzZXNbaWRzW2ldLm9sZF07XG4gICAgICAgICAgICBpZiAoZnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamogPSBmcy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZzW2pdKGlkc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmNsb25lXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGVsZW1lbnQgYW5kIGluc2VydHMgaXQgYWZ0ZXIgdGhlIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPSAoRWxlbWVudCkgdGhlIGNsb25lXG4gICAgXFwqL1xuICAgIGVscHJvdG8uY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IHdyYXAodGhpcy5ub2RlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIGlmICgkKGNsb25lLm5vZGUsIFwiaWRcIikpIHtcbiAgICAgICAgICAgICQoY2xvbmUubm9kZSwge2lkOiBjbG9uZS5pZH0pO1xuICAgICAgICB9XG4gICAgICAgIGZpeGlkcyhjbG9uZSk7XG4gICAgICAgIGNsb25lLmluc2VydEFmdGVyKHRoaXMpO1xuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50b0RlZnNcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIE1vdmVzIGVsZW1lbnQgdG8gdGhlIHNoYXJlZCBgPGRlZnM+YCBhcmVhXG4gICAgICoqXG4gICAgID0gKEVsZW1lbnQpIHRoZSBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8udG9EZWZzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmcyA9IGdldFNvbWVEZWZzKHRoaXMpO1xuICAgICAgICBkZWZzLmFwcGVuZENoaWxkKHRoaXMubm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudG9QYXR0ZXJuXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgYDxwYXR0ZXJuPmAgZWxlbWVudCBmcm9tIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICAgKipcbiAgICAgKiBUbyBjcmVhdGUgYSBwYXR0ZXJuIHlvdSBoYXZlIHRvIHNwZWNpZnkgdGhlIHBhdHRlcm4gcmVjdDpcbiAgICAgLSB4IChzdHJpbmd8bnVtYmVyKVxuICAgICAtIHkgKHN0cmluZ3xudW1iZXIpXG4gICAgIC0gd2lkdGggKHN0cmluZ3xudW1iZXIpXG4gICAgIC0gaGVpZ2h0IChzdHJpbmd8bnVtYmVyKVxuICAgICA9IChFbGVtZW50KSB0aGUgYDxwYXR0ZXJuPmAgZWxlbWVudFxuICAgICAqIFlvdSBjYW4gdXNlIHBhdHRlcm4gbGF0ZXIgb24gYXMgYW4gYXJndW1lbnQgZm9yIGBmaWxsYCBhdHRyaWJ1dGU6XG4gICAgIHwgdmFyIHAgPSBwYXBlci5wYXRoKFwiTTEwLTUtMTAsMTVNMTUsMCwwLDE1TTAtNS0yMCwxNVwiKS5hdHRyKHtcbiAgICAgfCAgICAgICAgIGZpbGw6IFwibm9uZVwiLFxuICAgICB8ICAgICAgICAgc3Ryb2tlOiBcIiNiYWRhNTVcIixcbiAgICAgfCAgICAgICAgIHN0cm9rZVdpZHRoOiA1XG4gICAgIHwgICAgIH0pLnBhdHRlcm4oMCwgMCwgMTAsIDEwKSxcbiAgICAgfCAgICAgYyA9IHBhcGVyLmNpcmNsZSgyMDAsIDIwMCwgMTAwKTtcbiAgICAgfCBjLmF0dHIoe1xuICAgICB8ICAgICBmaWxsOiBwXG4gICAgIHwgfSk7XG4gICAgXFwqL1xuICAgIGVscHJvdG8ucGF0dGVybiA9IGVscHJvdG8udG9QYXR0ZXJuID0gZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHAgPSBtYWtlKFwicGF0dGVyblwiLCBnZXRTb21lRGVmcyh0aGlzKSk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHtcbiAgICAgICAgICAgIHggPSB0aGlzLmdldEJCb3goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXMoeCwgXCJvYmplY3RcIikgJiYgXCJ4XCIgaW4geCkge1xuICAgICAgICAgICAgeSA9IHgueTtcbiAgICAgICAgICAgIHdpZHRoID0geC53aWR0aDtcbiAgICAgICAgICAgIGhlaWdodCA9IHguaGVpZ2h0O1xuICAgICAgICAgICAgeCA9IHgueDtcbiAgICAgICAgfVxuICAgICAgICAkKHAubm9kZSwge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgIHBhdHRlcm5Vbml0czogXCJ1c2VyU3BhY2VPblVzZVwiLFxuICAgICAgICAgICAgaWQ6IHAuaWQsXG4gICAgICAgICAgICB2aWV3Qm94OiBbeCwgeSwgd2lkdGgsIGhlaWdodF0uam9pbihcIiBcIilcbiAgICAgICAgfSk7XG4gICAgICAgIHAubm9kZS5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9O1xuLy8gU0lFUlJBIEVsZW1lbnQubWFya2VyKCk6IGNsYXJpZnkgd2hhdCBhIHJlZmVyZW5jZSBwb2ludCBpcy4gRS5nLiwgaGVscHMgeW91IG9mZnNldCB0aGUgb2JqZWN0IGZyb20gaXRzIGVkZ2Ugc3VjaCBhcyB3aGVuIGNlbnRlcmluZyBpdCBvdmVyIGEgcGF0aC5cbi8vIFNJRVJSQSBFbGVtZW50Lm1hcmtlcigpOiBJIHN1Z2dlc3QgdGhlIG1ldGhvZCBzaG91bGQgYWNjZXB0IGRlZmF1bHQgcmVmZXJlbmNlIHBvaW50IHZhbHVlcy4gIFBlcmhhcHMgY2VudGVyZWQgd2l0aCAocmVmWCA9IHdpZHRoLzIpIGFuZCAocmVmWSA9IGhlaWdodC8yKT8gQWxzbywgY291bGRuJ3QgaXQgYXNzdW1lIHRoZSBlbGVtZW50J3MgY3VycmVudCBfd2lkdGhfIGFuZCBfaGVpZ2h0Xz8gQW5kIHBsZWFzZSBzcGVjaWZ5IHdoYXQgX3hfIGFuZCBfeV8gbWVhbjogb2Zmc2V0cz8gSWYgc28sIGZyb20gd2hlcmU/ICBDb3VsZG4ndCB0aGV5IGFsc28gYmUgYXNzaWduZWQgZGVmYXVsdCB2YWx1ZXM/XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQubWFya2VyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgYDxtYXJrZXI+YCBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgICAqKlxuICAgICAqIFRvIGNyZWF0ZSBhIG1hcmtlciB5b3UgaGF2ZSB0byBzcGVjaWZ5IHRoZSBib3VuZGluZyByZWN0IGFuZCByZWZlcmVuY2UgcG9pbnQ6XG4gICAgIC0geCAobnVtYmVyKVxuICAgICAtIHkgKG51bWJlcilcbiAgICAgLSB3aWR0aCAobnVtYmVyKVxuICAgICAtIGhlaWdodCAobnVtYmVyKVxuICAgICAtIHJlZlggKG51bWJlcilcbiAgICAgLSByZWZZIChudW1iZXIpXG4gICAgID0gKEVsZW1lbnQpIHRoZSBgPG1hcmtlcj5gIGVsZW1lbnRcbiAgICAgKiBZb3UgY2FuIHNwZWNpZnkgdGhlIG1hcmtlciBsYXRlciBhcyBhbiBhcmd1bWVudCBmb3IgYG1hcmtlci1zdGFydGAsIGBtYXJrZXItZW5kYCwgYG1hcmtlci1taWRgLCBhbmQgYG1hcmtlcmAgYXR0cmlidXRlcy4gVGhlIGBtYXJrZXJgIGF0dHJpYnV0ZSBwbGFjZXMgdGhlIG1hcmtlciBhdCBldmVyeSBwb2ludCBhbG9uZyB0aGUgcGF0aCwgYW5kIGBtYXJrZXItbWlkYCBwbGFjZXMgdGhlbSBhdCBldmVyeSBwb2ludCBleGNlcHQgdGhlIHN0YXJ0IGFuZCBlbmQuXG4gICAgXFwqL1xuICAgIC8vIFRPRE8gYWRkIHVzYWdlIGZvciBtYXJrZXJzXG4gICAgZWxwcm90by5tYXJrZXIgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgcmVmWCwgcmVmWSkge1xuICAgICAgICB2YXIgcCA9IG1ha2UoXCJtYXJrZXJcIiwgZ2V0U29tZURlZnModGhpcykpO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSB7XG4gICAgICAgICAgICB4ID0gdGhpcy5nZXRCQm94KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzKHgsIFwib2JqZWN0XCIpICYmIFwieFwiIGluIHgpIHtcbiAgICAgICAgICAgIHkgPSB4Lnk7XG4gICAgICAgICAgICB3aWR0aCA9IHgud2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSB4LmhlaWdodDtcbiAgICAgICAgICAgIHJlZlggPSB4LnJlZlggfHwgeC5jeDtcbiAgICAgICAgICAgIHJlZlkgPSB4LnJlZlkgfHwgeC5jeTtcbiAgICAgICAgICAgIHggPSB4Lng7XG4gICAgICAgIH1cbiAgICAgICAgJChwLm5vZGUsIHtcbiAgICAgICAgICAgIHZpZXdCb3g6IFt4LCB5LCB3aWR0aCwgaGVpZ2h0XS5qb2luKFwiIFwiKSxcbiAgICAgICAgICAgIG1hcmtlcldpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgIG1hcmtlckhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgb3JpZW50OiBcImF1dG9cIixcbiAgICAgICAgICAgIHJlZlg6IHJlZlggfHwgMCxcbiAgICAgICAgICAgIHJlZlk6IHJlZlkgfHwgMCxcbiAgICAgICAgICAgIGlkOiBwLmlkXG4gICAgICAgIH0pO1xuICAgICAgICBwLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5ub2RlKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICB2YXIgZWxkYXRhID0ge307XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZGF0YVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBvciByZXRyaWV2ZXMgZ2l2ZW4gdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGdpdmVuIGtleS4gKERvbuKAmXQgY29uZnVzZVxuICAgICAqIHdpdGggYGRhdGEtYCBhdHRyaWJ1dGVzKVxuICAgICAqXG4gICAgICogU2VlIGFsc28gQEVsZW1lbnQucmVtb3ZlRGF0YVxuICAgICAtIGtleSAoc3RyaW5nKSBrZXkgdG8gc3RvcmUgZGF0YVxuICAgICAtIHZhbHVlIChhbnkpICNvcHRpb25hbCB2YWx1ZSB0byBzdG9yZVxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgICogb3IsIGlmIHZhbHVlIGlzIG5vdCBzcGVjaWZpZWQ6XG4gICAgID0gKGFueSkgdmFsdWVcbiAgICAgPiBVc2FnZVxuICAgICB8IGZvciAodmFyIGkgPSAwLCBpIDwgNSwgaSsrKSB7XG4gICAgIHwgICAgIHBhcGVyLmNpcmNsZSgxMCArIDE1ICogaSwgMTAsIDEwKVxuICAgICB8ICAgICAgICAgIC5hdHRyKHtmaWxsOiBcIiMwMDBcIn0pXG4gICAgIHwgICAgICAgICAgLmRhdGEoXCJpXCIsIGkpXG4gICAgIHwgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgfCAgICAgICAgICAgICBhbGVydCh0aGlzLmRhdGEoXCJpXCIpKTtcbiAgICAgfCAgICAgICAgICB9KTtcbiAgICAgfCB9XG4gICAgXFwqL1xuICAgIGVscHJvdG8uZGF0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXRhID0gZWxkYXRhW3RoaXMuaWRdID0gZWxkYXRhW3RoaXMuaWRdIHx8IHt9O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIGV2ZShcInNuYXAuZGF0YS5nZXQuXCIgKyB0aGlzLmlkLCB0aGlzLCBkYXRhLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGlmIChTbmFwLmlzKGtleSwgXCJvYmplY3RcIikpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGtleSkgaWYgKGtleVtoYXNdKGkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YShpLCBrZXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZShcInNuYXAuZGF0YS5nZXQuXCIgKyB0aGlzLmlkLCB0aGlzLCBkYXRhW2tleV0sIGtleSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICBldmUoXCJzbmFwLmRhdGEuc2V0LlwiICsgdGhpcy5pZCwgdGhpcywgdmFsdWUsIGtleSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucmVtb3ZlRGF0YVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYW4gZWxlbWVudCBieSBnaXZlbiBrZXkuXG4gICAgICogSWYga2V5IGlzIG5vdCBwcm92aWRlZCwgcmVtb3ZlcyBhbGwgdGhlIGRhdGEgb2YgdGhlIGVsZW1lbnQuXG4gICAgIC0ga2V5IChzdHJpbmcpICNvcHRpb25hbCBrZXlcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnJlbW92ZURhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAgICAgICAgZWxkYXRhW3RoaXMuaWRdID0ge307XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGRhdGFbdGhpcy5pZF0gJiYgZGVsZXRlIGVsZGF0YVt0aGlzLmlkXVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQub3V0ZXJTVkdcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgU1ZHIGNvZGUgZm9yIHRoZSBlbGVtZW50LCBlcXVpdmFsZW50IHRvIEhUTUwncyBgb3V0ZXJIVE1MYC5cbiAgICAgKlxuICAgICAqIFNlZSBhbHNvIEBFbGVtZW50LmlubmVyU1ZHXG4gICAgID0gKHN0cmluZykgU1ZHIGNvZGUgZm9yIHRoZSBlbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvU3RyaW5nXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBTZWUgQEVsZW1lbnQub3V0ZXJTVkdcbiAgICBcXCovXG4gICAgZWxwcm90by5vdXRlclNWRyA9IGVscHJvdG8udG9TdHJpbmcgPSB0b1N0cmluZygxKTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5pbm5lclNWR1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBTVkcgY29kZSBmb3IgdGhlIGVsZW1lbnQncyBjb250ZW50cywgZXF1aXZhbGVudCB0byBIVE1MJ3MgYGlubmVySFRNTGBcbiAgICAgPSAoc3RyaW5nKSBTVkcgY29kZSBmb3IgdGhlIGVsZW1lbnRcbiAgICBcXCovXG4gICAgZWxwcm90by5pbm5lclNWRyA9IHRvU3RyaW5nKCk7XG4gICAgZnVuY3Rpb24gdG9TdHJpbmcodHlwZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IHR5cGUgPyBcIjxcIiArIHRoaXMudHlwZSA6IFwiXCIsXG4gICAgICAgICAgICAgICAgYXR0ciA9IHRoaXMubm9kZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIGNobGQgPSB0aGlzLm5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYXR0ci5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyArPSBcIiBcIiArIGF0dHJbaV0ubmFtZSArICc9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyW2ldLnZhbHVlLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNobGQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdHlwZSAmJiAocmVzICs9IFwiPlwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGNobGQubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hsZFtpXS5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gY2hsZFtpXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hsZFtpXS5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gd3JhcChjaGxkW2ldKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHR5cGUgJiYgKHJlcyArPSBcIjwvXCIgKyB0aGlzLnR5cGUgKyBcIj5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHR5cGUgJiYgKHJlcyArPSBcIi8+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxwcm90by50b0RhdGFVUkwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93LmJ0b2EpIHtcbiAgICAgICAgICAgIHZhciBiYiA9IHRoaXMuZ2V0QkJveCgpLFxuICAgICAgICAgICAgICAgIHN2ZyA9IFNuYXAuZm9ybWF0KCc8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgd2lkdGg9XCJ7d2lkdGh9XCIgaGVpZ2h0PVwie2hlaWdodH1cIiB2aWV3Qm94PVwie3h9IHt5fSB7d2lkdGh9IHtoZWlnaHR9XCI+e2NvbnRlbnRzfTwvc3ZnPicsIHtcbiAgICAgICAgICAgICAgICB4OiArYmIueC50b0ZpeGVkKDMpLFxuICAgICAgICAgICAgICAgIHk6ICtiYi55LnRvRml4ZWQoMyksXG4gICAgICAgICAgICAgICAgd2lkdGg6ICtiYi53aWR0aC50b0ZpeGVkKDMpLFxuICAgICAgICAgICAgICAgIGhlaWdodDogK2JiLmhlaWdodC50b0ZpeGVkKDMpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRzOiB0aGlzLm91dGVyU1ZHKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN2ZykpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLypcXFxuICAgICAqIEZyYWdtZW50LnNlbGVjdFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2VlIEBFbGVtZW50LnNlbGVjdFxuICAgIFxcKi9cbiAgICBGcmFnbWVudC5wcm90b3R5cGUuc2VsZWN0ID0gZWxwcm90by5zZWxlY3Q7XG4gICAgLypcXFxuICAgICAqIEZyYWdtZW50LnNlbGVjdEFsbFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogU2VlIEBFbGVtZW50LnNlbGVjdEFsbFxuICAgIFxcKi9cbiAgICBGcmFnbWVudC5wcm90b3R5cGUuc2VsZWN0QWxsID0gZWxwcm90by5zZWxlY3RBbGw7XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgIFN0ciA9IFN0cmluZyxcbiAgICAgICAgbWF0aCA9IE1hdGgsXG4gICAgICAgIEUgPSBcIlwiO1xuICAgIGZ1bmN0aW9uIE1hdHJpeChhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgICAgIGlmIChiID09IG51bGwgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbChhKSA9PSBcIltvYmplY3QgU1ZHTWF0cml4XVwiKSB7XG4gICAgICAgICAgICB0aGlzLmEgPSBhLmE7XG4gICAgICAgICAgICB0aGlzLmIgPSBhLmI7XG4gICAgICAgICAgICB0aGlzLmMgPSBhLmM7XG4gICAgICAgICAgICB0aGlzLmQgPSBhLmQ7XG4gICAgICAgICAgICB0aGlzLmUgPSBhLmU7XG4gICAgICAgICAgICB0aGlzLmYgPSBhLmY7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hID0gK2E7XG4gICAgICAgICAgICB0aGlzLmIgPSArYjtcbiAgICAgICAgICAgIHRoaXMuYyA9ICtjO1xuICAgICAgICAgICAgdGhpcy5kID0gK2Q7XG4gICAgICAgICAgICB0aGlzLmUgPSArZTtcbiAgICAgICAgICAgIHRoaXMuZiA9ICtmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hID0gMTtcbiAgICAgICAgICAgIHRoaXMuYiA9IDA7XG4gICAgICAgICAgICB0aGlzLmMgPSAwO1xuICAgICAgICAgICAgdGhpcy5kID0gMTtcbiAgICAgICAgICAgIHRoaXMuZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmYgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIChmdW5jdGlvbiAobWF0cml4cHJvdG8pIHtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguYWRkXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBBZGRzIHRoZSBnaXZlbiBtYXRyaXggdG8gZXhpc3Rpbmcgb25lXG4gICAgICAgICAtIGEgKG51bWJlcilcbiAgICAgICAgIC0gYiAobnVtYmVyKVxuICAgICAgICAgLSBjIChudW1iZXIpXG4gICAgICAgICAtIGQgKG51bWJlcilcbiAgICAgICAgIC0gZSAobnVtYmVyKVxuICAgICAgICAgLSBmIChudW1iZXIpXG4gICAgICAgICAqIG9yXG4gICAgICAgICAtIG1hdHJpeCAob2JqZWN0KSBATWF0cml4XG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uYWRkID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAgICAgICAgIGlmIChhICYmIGEgaW5zdGFuY2VvZiBNYXRyaXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoYS5hLCBhLmIsIGEuYywgYS5kLCBhLmUsIGEuZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYU5ldyA9IGEgKiB0aGlzLmEgKyBiICogdGhpcy5jLFxuICAgICAgICAgICAgICAgIGJOZXcgPSBhICogdGhpcy5iICsgYiAqIHRoaXMuZDtcbiAgICAgICAgICAgIHRoaXMuZSArPSBlICogdGhpcy5hICsgZiAqIHRoaXMuYztcbiAgICAgICAgICAgIHRoaXMuZiArPSBlICogdGhpcy5iICsgZiAqIHRoaXMuZDtcbiAgICAgICAgICAgIHRoaXMuYyA9IGMgKiB0aGlzLmEgKyBkICogdGhpcy5jO1xuICAgICAgICAgICAgdGhpcy5kID0gYyAqIHRoaXMuYiArIGQgKiB0aGlzLmQ7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IGFOZXc7XG4gICAgICAgICAgICB0aGlzLmIgPSBiTmV3O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4Lm11bHRMZWZ0XG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBNdWx0aXBsaWVzIGEgcGFzc2VkIGFmZmluZSB0cmFuc2Zvcm0gdG8gdGhlIGxlZnQ6IE0gKiB0aGlzLlxuICAgICAgICAgLSBhIChudW1iZXIpXG4gICAgICAgICAtIGIgKG51bWJlcilcbiAgICAgICAgIC0gYyAobnVtYmVyKVxuICAgICAgICAgLSBkIChudW1iZXIpXG4gICAgICAgICAtIGUgKG51bWJlcilcbiAgICAgICAgIC0gZiAobnVtYmVyKVxuICAgICAgICAgKiBvclxuICAgICAgICAgLSBtYXRyaXggKG9iamVjdCkgQE1hdHJpeFxuICAgICAgICBcXCovXG4gICAgICAgIE1hdHJpeC5wcm90b3R5cGUubXVsdExlZnQgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSwgZikge1xuICAgICAgICAgICAgaWYgKGEgJiYgYSBpbnN0YW5jZW9mIE1hdHJpeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRMZWZ0KGEuYSwgYS5iLCBhLmMsIGEuZCwgYS5lLCBhLmYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFOZXcgPSBhICogdGhpcy5hICsgYyAqIHRoaXMuYixcbiAgICAgICAgICAgICAgICBjTmV3ID0gYSAqIHRoaXMuYyArIGMgKiB0aGlzLmQsXG4gICAgICAgICAgICAgICAgZU5ldyA9IGEgKiB0aGlzLmUgKyBjICogdGhpcy5mICsgZTtcbiAgICAgICAgICAgIHRoaXMuYiA9IGIgKiB0aGlzLmEgKyBkICogdGhpcy5iO1xuICAgICAgICAgICAgdGhpcy5kID0gYiAqIHRoaXMuYyArIGQgKiB0aGlzLmQ7XG4gICAgICAgICAgICB0aGlzLmYgPSBiICogdGhpcy5lICsgZCAqIHRoaXMuZiArIGY7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IGFOZXc7XG4gICAgICAgICAgICB0aGlzLmMgPSBjTmV3O1xuICAgICAgICAgICAgdGhpcy5lID0gZU5ldztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC5pbnZlcnRcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJldHVybnMgYW4gaW52ZXJ0ZWQgdmVyc2lvbiBvZiB0aGUgbWF0cml4XG4gICAgICAgICA9IChvYmplY3QpIEBNYXRyaXhcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5pbnZlcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHggPSBtZS5hICogbWUuZCAtIG1lLmIgKiBtZS5jO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgobWUuZCAvIHgsIC1tZS5iIC8geCwgLW1lLmMgLyB4LCBtZS5hIC8geCwgKG1lLmMgKiBtZS5mIC0gbWUuZCAqIG1lLmUpIC8geCwgKG1lLmIgKiBtZS5lIC0gbWUuYSAqIG1lLmYpIC8geCk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LmNsb25lXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgbWF0cml4XG4gICAgICAgICA9IChvYmplY3QpIEBNYXRyaXhcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4KHRoaXMuYSwgdGhpcy5iLCB0aGlzLmMsIHRoaXMuZCwgdGhpcy5lLCB0aGlzLmYpO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC50cmFuc2xhdGVcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFRyYW5zbGF0ZSB0aGUgbWF0cml4XG4gICAgICAgICAtIHggKG51bWJlcikgaG9yaXpvbnRhbCBvZmZzZXQgZGlzdGFuY2VcbiAgICAgICAgIC0geSAobnVtYmVyKSB2ZXJ0aWNhbCBvZmZzZXQgZGlzdGFuY2VcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by50cmFuc2xhdGUgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgdGhpcy5lICs9IHggKiB0aGlzLmEgKyB5ICogdGhpcy5jO1xuICAgICAgICAgICAgdGhpcy5mICs9IHggKiB0aGlzLmIgKyB5ICogdGhpcy5kO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnNjYWxlXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBTY2FsZXMgdGhlIG1hdHJpeFxuICAgICAgICAgLSB4IChudW1iZXIpIGFtb3VudCB0byBiZSBzY2FsZWQsIHdpdGggYDFgIHJlc3VsdGluZyBpbiBubyBjaGFuZ2VcbiAgICAgICAgIC0geSAobnVtYmVyKSAjb3B0aW9uYWwgYW1vdW50IHRvIHNjYWxlIGFsb25nIHRoZSB2ZXJ0aWNhbCBheGlzLiAoT3RoZXJ3aXNlIGB4YCBhcHBsaWVzIHRvIGJvdGggYXhlcy4pXG4gICAgICAgICAtIGN4IChudW1iZXIpICNvcHRpb25hbCBob3Jpem9udGFsIG9yaWdpbiBwb2ludCBmcm9tIHdoaWNoIHRvIHNjYWxlXG4gICAgICAgICAtIGN5IChudW1iZXIpICNvcHRpb25hbCB2ZXJ0aWNhbCBvcmlnaW4gcG9pbnQgZnJvbSB3aGljaCB0byBzY2FsZVxuICAgICAgICAgKiBEZWZhdWx0IGN4LCBjeSBpcyB0aGUgbWlkZGxlIHBvaW50IG9mIHRoZSBlbGVtZW50LlxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnNjYWxlID0gZnVuY3Rpb24gKHgsIHksIGN4LCBjeSkge1xuICAgICAgICAgICAgeSA9PSBudWxsICYmICh5ID0geCk7XG4gICAgICAgICAgICAoY3ggfHwgY3kpICYmIHRoaXMudHJhbnNsYXRlKGN4LCBjeSk7XG4gICAgICAgICAgICB0aGlzLmEgKj0geDtcbiAgICAgICAgICAgIHRoaXMuYiAqPSB4O1xuICAgICAgICAgICAgdGhpcy5jICo9IHk7XG4gICAgICAgICAgICB0aGlzLmQgKj0geTtcbiAgICAgICAgICAgIChjeCB8fCBjeSkgJiYgdGhpcy50cmFuc2xhdGUoLWN4LCAtY3kpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnJvdGF0ZVxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUm90YXRlcyB0aGUgbWF0cml4XG4gICAgICAgICAtIGEgKG51bWJlcikgYW5nbGUgb2Ygcm90YXRpb24sIGluIGRlZ3JlZXNcbiAgICAgICAgIC0geCAobnVtYmVyKSBob3Jpem9udGFsIG9yaWdpbiBwb2ludCBmcm9tIHdoaWNoIHRvIHJvdGF0ZVxuICAgICAgICAgLSB5IChudW1iZXIpIHZlcnRpY2FsIG9yaWdpbiBwb2ludCBmcm9tIHdoaWNoIHRvIHJvdGF0ZVxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnJvdGF0ZSA9IGZ1bmN0aW9uIChhLCB4LCB5KSB7XG4gICAgICAgICAgICBhID0gU25hcC5yYWQoYSk7XG4gICAgICAgICAgICB4ID0geCB8fCAwO1xuICAgICAgICAgICAgeSA9IHkgfHwgMDtcbiAgICAgICAgICAgIHZhciBjb3MgPSArbWF0aC5jb3MoYSkudG9GaXhlZCg5KSxcbiAgICAgICAgICAgICAgICBzaW4gPSArbWF0aC5zaW4oYSkudG9GaXhlZCg5KTtcbiAgICAgICAgICAgIHRoaXMuYWRkKGNvcywgc2luLCAtc2luLCBjb3MsIHgsIHkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKDEsIDAsIDAsIDEsIC14LCAteSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnNrZXdYXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBTa2V3cyB0aGUgbWF0cml4IGFsb25nIHRoZSB4LWF4aXNcbiAgICAgICAgIC0geCAobnVtYmVyKSBBbmdsZSB0byBza2V3IGFsb25nIHRoZSB4LWF4aXMgKGluIGRlZ3JlZXMpLlxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnNrZXdYID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNrZXcoeCwgMCk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnNrZXdZXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBTa2V3cyB0aGUgbWF0cml4IGFsb25nIHRoZSB5LWF4aXNcbiAgICAgICAgIC0geSAobnVtYmVyKSBBbmdsZSB0byBza2V3IGFsb25nIHRoZSB5LWF4aXMgKGluIGRlZ3JlZXMpLlxuICAgICAgICBcXCovXG4gICAgICAgIG1hdHJpeHByb3RvLnNrZXdZID0gZnVuY3Rpb24gKHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNrZXcoMCwgeSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnNrZXdcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFNrZXdzIHRoZSBtYXRyaXhcbiAgICAgICAgIC0geSAobnVtYmVyKSBBbmdsZSB0byBza2V3IGFsb25nIHRoZSB5LWF4aXMgKGluIGRlZ3JlZXMpLlxuICAgICAgICAgLSB4IChudW1iZXIpIEFuZ2xlIHRvIHNrZXcgYWxvbmcgdGhlIHgtYXhpcyAoaW4gZGVncmVlcykuXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uc2tldyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICB4ID0geCB8fCAwO1xuICAgICAgICAgICAgeSA9IHkgfHwgMDtcbiAgICAgICAgICAgIHggPSBTbmFwLnJhZCh4KTtcbiAgICAgICAgICAgIHkgPSBTbmFwLnJhZCh5KTtcbiAgICAgICAgICAgIHZhciBjID0gbWF0aC50YW4oeCkudG9GaXhlZCg5KTtcbiAgICAgICAgICAgIHZhciBiID0gbWF0aC50YW4oeSkudG9GaXhlZCg5KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZCgxLCBiLCBjLCAxLCAwLCAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXgueFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUmV0dXJucyB4IGNvb3JkaW5hdGUgZm9yIGdpdmVuIHBvaW50IGFmdGVyIHRyYW5zZm9ybWF0aW9uIGRlc2NyaWJlZCBieSB0aGUgbWF0cml4LiBTZWUgYWxzbyBATWF0cml4LnlcbiAgICAgICAgIC0geCAobnVtYmVyKVxuICAgICAgICAgLSB5IChudW1iZXIpXG4gICAgICAgICA9IChudW1iZXIpIHhcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by54ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogdGhpcy5hICsgeSAqIHRoaXMuYyArIHRoaXMuZTtcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXgueVxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogUmV0dXJucyB5IGNvb3JkaW5hdGUgZm9yIGdpdmVuIHBvaW50IGFmdGVyIHRyYW5zZm9ybWF0aW9uIGRlc2NyaWJlZCBieSB0aGUgbWF0cml4LiBTZWUgYWxzbyBATWF0cml4LnhcbiAgICAgICAgIC0geCAobnVtYmVyKVxuICAgICAgICAgLSB5IChudW1iZXIpXG4gICAgICAgICA9IChudW1iZXIpIHlcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by55ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogdGhpcy5iICsgeSAqIHRoaXMuZCArIHRoaXMuZjtcbiAgICAgICAgfTtcbiAgICAgICAgbWF0cml4cHJvdG8uZ2V0ID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiArdGhpc1tTdHIuZnJvbUNoYXJDb2RlKDk3ICsgaSldLnRvRml4ZWQoNCk7XG4gICAgICAgIH07XG4gICAgICAgIG1hdHJpeHByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4KFwiICsgW3RoaXMuZ2V0KDApLCB0aGlzLmdldCgxKSwgdGhpcy5nZXQoMiksIHRoaXMuZ2V0KDMpLCB0aGlzLmdldCg0KSwgdGhpcy5nZXQoNSldLmpvaW4oKSArIFwiKVwiO1xuICAgICAgICB9O1xuICAgICAgICBtYXRyaXhwcm90by5vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuZS50b0ZpeGVkKDQpLCB0aGlzLmYudG9GaXhlZCg0KV07XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIG5vcm0oYSkge1xuICAgICAgICAgICAgcmV0dXJuIGFbMF0gKiBhWzBdICsgYVsxXSAqIGFbMV07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbm9ybWFsaXplKGEpIHtcbiAgICAgICAgICAgIHZhciBtYWcgPSBtYXRoLnNxcnQobm9ybShhKSk7XG4gICAgICAgICAgICBhWzBdICYmIChhWzBdIC89IG1hZyk7XG4gICAgICAgICAgICBhWzFdICYmIChhWzFdIC89IG1hZyk7XG4gICAgICAgIH1cbiAgICAgICAgLypcXFxuICAgICAgICAgKiBNYXRyaXguZGV0ZXJtaW5hbnRcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIEZpbmRzIGRldGVybWluYW50IG9mIHRoZSBnaXZlbiBtYXRyaXguXG4gICAgICAgICA9IChudW1iZXIpIGRldGVybWluYW50XG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8uZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hICogdGhpcy5kIC0gdGhpcy5iICogdGhpcy5jO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIE1hdHJpeC5zcGxpdFxuICAgICAgICAgWyBtZXRob2QgXVxuICAgICAgICAgKipcbiAgICAgICAgICogU3BsaXRzIG1hdHJpeCBpbnRvIHByaW1pdGl2ZSB0cmFuc2Zvcm1hdGlvbnNcbiAgICAgICAgID0gKG9iamVjdCkgaW4gZm9ybWF0OlxuICAgICAgICAgbyBkeCAobnVtYmVyKSB0cmFuc2xhdGlvbiBieSB4XG4gICAgICAgICBvIGR5IChudW1iZXIpIHRyYW5zbGF0aW9uIGJ5IHlcbiAgICAgICAgIG8gc2NhbGV4IChudW1iZXIpIHNjYWxlIGJ5IHhcbiAgICAgICAgIG8gc2NhbGV5IChudW1iZXIpIHNjYWxlIGJ5IHlcbiAgICAgICAgIG8gc2hlYXIgKG51bWJlcikgc2hlYXJcbiAgICAgICAgIG8gcm90YXRlIChudW1iZXIpIHJvdGF0aW9uIGluIGRlZ1xuICAgICAgICAgbyBpc1NpbXBsZSAoYm9vbGVhbikgY291bGQgaXQgYmUgcmVwcmVzZW50ZWQgdmlhIHNpbXBsZSB0cmFuc2Zvcm1hdGlvbnNcbiAgICAgICAgXFwqL1xuICAgICAgICBtYXRyaXhwcm90by5zcGxpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXQgPSB7fTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0aW9uXG4gICAgICAgICAgICBvdXQuZHggPSB0aGlzLmU7XG4gICAgICAgICAgICBvdXQuZHkgPSB0aGlzLmY7XG5cbiAgICAgICAgICAgIC8vIHNjYWxlIGFuZCBzaGVhclxuICAgICAgICAgICAgdmFyIHJvdyA9IFtbdGhpcy5hLCB0aGlzLmJdLCBbdGhpcy5jLCB0aGlzLmRdXTtcbiAgICAgICAgICAgIG91dC5zY2FsZXggPSBtYXRoLnNxcnQobm9ybShyb3dbMF0pKTtcbiAgICAgICAgICAgIG5vcm1hbGl6ZShyb3dbMF0pO1xuXG4gICAgICAgICAgICBvdXQuc2hlYXIgPSByb3dbMF1bMF0gKiByb3dbMV1bMF0gKyByb3dbMF1bMV0gKiByb3dbMV1bMV07XG4gICAgICAgICAgICByb3dbMV0gPSBbcm93WzFdWzBdIC0gcm93WzBdWzBdICogb3V0LnNoZWFyLCByb3dbMV1bMV0gLSByb3dbMF1bMV0gKiBvdXQuc2hlYXJdO1xuXG4gICAgICAgICAgICBvdXQuc2NhbGV5ID0gbWF0aC5zcXJ0KG5vcm0ocm93WzFdKSk7XG4gICAgICAgICAgICBub3JtYWxpemUocm93WzFdKTtcbiAgICAgICAgICAgIG91dC5zaGVhciAvPSBvdXQuc2NhbGV5O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kZXRlcm1pbmFudCgpIDwgMCkge1xuICAgICAgICAgICAgICAgIG91dC5zY2FsZXggPSAtb3V0LnNjYWxleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcm90YXRpb25cbiAgICAgICAgICAgIHZhciBzaW4gPSByb3dbMF1bMV0sXG4gICAgICAgICAgICAgICAgY29zID0gcm93WzFdWzFdO1xuICAgICAgICAgICAgaWYgKGNvcyA8IDApIHtcbiAgICAgICAgICAgICAgICBvdXQucm90YXRlID0gU25hcC5kZWcobWF0aC5hY29zKGNvcykpO1xuICAgICAgICAgICAgICAgIGlmIChzaW4gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5yb3RhdGUgPSAzNjAgLSBvdXQucm90YXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0LnJvdGF0ZSA9IFNuYXAuZGVnKG1hdGguYXNpbihzaW4pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0LmlzU2ltcGxlID0gIStvdXQuc2hlYXIudG9GaXhlZCg5KSAmJiAob3V0LnNjYWxleC50b0ZpeGVkKDkpID09IG91dC5zY2FsZXkudG9GaXhlZCg5KSB8fCAhb3V0LnJvdGF0ZSk7XG4gICAgICAgICAgICBvdXQuaXNTdXBlclNpbXBsZSA9ICErb3V0LnNoZWFyLnRvRml4ZWQoOSkgJiYgb3V0LnNjYWxleC50b0ZpeGVkKDkpID09IG91dC5zY2FsZXkudG9GaXhlZCg5KSAmJiAhb3V0LnJvdGF0ZTtcbiAgICAgICAgICAgIG91dC5ub1JvdGF0aW9uID0gIStvdXQuc2hlYXIudG9GaXhlZCg5KSAmJiAhb3V0LnJvdGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogTWF0cml4LnRvVHJhbnNmb3JtU3RyaW5nXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSZXR1cm5zIHRyYW5zZm9ybSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIGdpdmVuIG1hdHJpeFxuICAgICAgICAgPSAoc3RyaW5nKSB0cmFuc2Zvcm0gc3RyaW5nXG4gICAgICAgIFxcKi9cbiAgICAgICAgbWF0cml4cHJvdG8udG9UcmFuc2Zvcm1TdHJpbmcgPSBmdW5jdGlvbiAoc2hvcnRlcikge1xuICAgICAgICAgICAgdmFyIHMgPSBzaG9ydGVyIHx8IHRoaXMuc3BsaXQoKTtcbiAgICAgICAgICAgIGlmICghK3Muc2hlYXIudG9GaXhlZCg5KSkge1xuICAgICAgICAgICAgICAgIHMuc2NhbGV4ID0gK3Muc2NhbGV4LnRvRml4ZWQoNCk7XG4gICAgICAgICAgICAgICAgcy5zY2FsZXkgPSArcy5zY2FsZXkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICBzLnJvdGF0ZSA9ICtzLnJvdGF0ZS50b0ZpeGVkKDQpO1xuICAgICAgICAgICAgICAgIHJldHVybiAgKHMuZHggfHwgcy5keSA/IFwidFwiICsgWytzLmR4LnRvRml4ZWQoNCksICtzLmR5LnRvRml4ZWQoNCldIDogRSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHMucm90YXRlID8gXCJyXCIgKyBbK3Mucm90YXRlLnRvRml4ZWQoNCksIDAsIDBdIDogRSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHMuc2NhbGV4ICE9IDEgfHwgcy5zY2FsZXkgIT0gMSA/IFwic1wiICsgW3Muc2NhbGV4LCBzLnNjYWxleSwgMCwgMF0gOiBFKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibVwiICsgW3RoaXMuZ2V0KDApLCB0aGlzLmdldCgxKSwgdGhpcy5nZXQoMiksIHRoaXMuZ2V0KDMpLCB0aGlzLmdldCg0KSwgdGhpcy5nZXQoNSldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKE1hdHJpeC5wcm90b3R5cGUpO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLk1hdHJpeFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogTWF0cml4IGNvbnN0cnVjdG9yLCBleHRlbmQgb24geW91ciBvd24gcmlzay5cbiAgICAgKiBUbyBjcmVhdGUgbWF0cmljZXMgdXNlIEBTbmFwLm1hdHJpeC5cbiAgICBcXCovXG4gICAgU25hcC5NYXRyaXggPSBNYXRyaXg7XG4gICAgLypcXFxuICAgICAqIFNuYXAubWF0cml4XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIFJldHVybnMgYSBtYXRyaXggYmFzZWQgb24gdGhlIGdpdmVuIHBhcmFtZXRlcnNcbiAgICAgLSBhIChudW1iZXIpXG4gICAgIC0gYiAobnVtYmVyKVxuICAgICAtIGMgKG51bWJlcilcbiAgICAgLSBkIChudW1iZXIpXG4gICAgIC0gZSAobnVtYmVyKVxuICAgICAtIGYgKG51bWJlcilcbiAgICAgKiBvclxuICAgICAtIHN2Z01hdHJpeCAoU1ZHTWF0cml4KVxuICAgICA9IChvYmplY3QpIEBNYXRyaXhcbiAgICBcXCovXG4gICAgU25hcC5tYXRyaXggPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSwgZikge1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeChhLCBiLCBjLCBkLCBlLCBmKTtcbiAgICB9O1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYiwgRnJhZ21lbnQpIHtcbiAgICB2YXIgaGFzID0gXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgICAgICBtYWtlID0gU25hcC5fLm1ha2UsXG4gICAgICAgIHdyYXAgPSBTbmFwLl8ud3JhcCxcbiAgICAgICAgaXMgPSBTbmFwLmlzLFxuICAgICAgICBnZXRTb21lRGVmcyA9IFNuYXAuXy5nZXRTb21lRGVmcyxcbiAgICAgICAgcmVVUkxWYWx1ZSA9IC9edXJsXFwoKFsnXCJdPykoW14pXSspXFwxXFwpJC8sXG4gICAgICAgICQgPSBTbmFwLl8uJCxcbiAgICAgICAgVVJMID0gU25hcC51cmwsXG4gICAgICAgIFN0ciA9IFN0cmluZyxcbiAgICAgICAgc2VwYXJhdG9yID0gU25hcC5fLnNlcGFyYXRvcixcbiAgICAgICAgRSA9IFwiXCI7XG4gICAgLypcXFxuICAgICAqIFNuYXAuZGV1cmxcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFVud3JhcHMgcGF0aCBmcm9tIGBcInVybCg8cGF0aD4pXCJgLlxuICAgICAtIHZhbHVlIChzdHJpbmcpIHVybCBwYXRoXG4gICAgID0gKHN0cmluZykgdW53cmFwcGVkIHBhdGhcbiAgICBcXCovXG4gICAgU25hcC5kZXVybCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgcmVzID0gU3RyaW5nKHZhbHVlKS5tYXRjaChyZVVSTFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHJlcyA/IHJlc1syXSA6IHZhbHVlO1xuICAgIH1cbiAgICAvLyBBdHRyaWJ1dGVzIGV2ZW50IGhhbmRsZXJzXG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFza1wiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCB8fCB2YWx1ZSBpbnN0YW5jZW9mIEZyYWdtZW50KSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnJhZ21lbnQgJiYgdmFsdWUubm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgZ2V0U29tZURlZnModGhpcykuYXBwZW5kQ2hpbGQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PSBcIm1hc2tcIikge1xuICAgICAgICAgICAgICAgIHZhciBtYXNrID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hc2sgPSBtYWtlKFwibWFza1wiLCBnZXRTb21lRGVmcyh0aGlzKSk7XG4gICAgICAgICAgICAgICAgbWFzay5ub2RlLmFwcGVuZENoaWxkKHZhbHVlLm5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIW1hc2subm9kZS5pZCAmJiAkKG1hc2subm9kZSwge1xuICAgICAgICAgICAgICAgIGlkOiBtYXNrLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGhpcy5ub2RlLCB7XG4gICAgICAgICAgICAgICAgbWFzazogVVJMKG1hc2suaWQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIChmdW5jdGlvbiAoY2xpcEl0KSB7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmNsaXBcIiwgY2xpcEl0KTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuY2xpcC1wYXRoXCIsIGNsaXBJdCk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmNsaXBQYXRoXCIsIGNsaXBJdCk7XG4gICAgfShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCB8fCB2YWx1ZSBpbnN0YW5jZW9mIEZyYWdtZW50KSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgdmFyIGNsaXAsXG4gICAgICAgICAgICAgICAgbm9kZSA9IHZhbHVlLm5vZGU7XG4gICAgICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSBcImNsaXBQYXRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpcCA9IG5ldyBFbGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IFwic3ZnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNsaXApIHtcbiAgICAgICAgICAgICAgICBjbGlwID0gbWFrZShcImNsaXBQYXRoXCIsIGdldFNvbWVEZWZzKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBjbGlwLm5vZGUuYXBwZW5kQ2hpbGQodmFsdWUubm9kZSk7XG4gICAgICAgICAgICAgICAgIWNsaXAubm9kZS5pZCAmJiAkKGNsaXAubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICBpZDogY2xpcC5pZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzLm5vZGUsIHtcbiAgICAgICAgICAgICAgICBcImNsaXAtcGF0aFwiOiBVUkwoY2xpcC5ub2RlLmlkIHx8IGNsaXAuaWQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pKTtcbiAgICBmdW5jdGlvbiBmaWxsU3Ryb2tlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZyYWdtZW50ICYmIHZhbHVlLm5vZGUuY2hpbGROb2Rlcy5sZW5ndGggPT0gMSAmJlxuICAgICAgICAgICAgICAgICh2YWx1ZS5ub2RlLmZpcnN0Q2hpbGQudGFnTmFtZSA9PSBcInJhZGlhbEdyYWRpZW50XCIgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZS5ub2RlLmZpcnN0Q2hpbGQudGFnTmFtZSA9PSBcImxpbmVhckdyYWRpZW50XCIgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZS5ub2RlLmZpcnN0Q2hpbGQudGFnTmFtZSA9PSBcInBhdHRlcm5cIikpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICBnZXRTb21lRGVmcyh0aGlzKS5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PSBcInJhZGlhbEdyYWRpZW50XCIgfHwgdmFsdWUudHlwZSA9PSBcImxpbmVhckdyYWRpZW50XCJcbiAgICAgICAgICAgICAgICAgICB8fCB2YWx1ZS50eXBlID09IFwicGF0dGVyblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWUubm9kZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh2YWx1ZS5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHZhbHVlLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsbCA9IFVSTCh2YWx1ZS5ub2RlLmlkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxsID0gdmFsdWUuYXR0cihuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbGwgPSBTbmFwLmNvbG9yKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsbC5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhZCA9IFNuYXAoZ2V0U29tZURlZnModGhpcykub3duZXJTVkdFbGVtZW50KS5ncmFkaWVudCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncmFkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdyYWQubm9kZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZ3JhZC5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBncmFkLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsID0gVVJMKGdyYWQubm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxsID0gU3RyKGZpbGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhdHRycyA9IHt9O1xuICAgICAgICAgICAgYXR0cnNbbmFtZV0gPSBmaWxsO1xuICAgICAgICAgICAgJCh0aGlzLm5vZGUsIGF0dHJzKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zdHlsZVtuYW1lXSA9IEU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmZpbGxcIiwgZmlsbFN0cm9rZShcImZpbGxcIikpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLnN0cm9rZVwiLCBmaWxsU3Ryb2tlKFwic3Ryb2tlXCIpKTtcbiAgICB2YXIgZ3JhZHJnID0gL14oW2xyXSkoPzpcXCgoW14pXSopXFwpKT8oLiopJC9pO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5ncmFkLnBhcnNlXCIsIGZ1bmN0aW9uIHBhcnNlR3JhZChzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gU3RyKHN0cmluZyk7XG4gICAgICAgIHZhciB0b2tlbnMgPSBzdHJpbmcubWF0Y2goZ3JhZHJnKTtcbiAgICAgICAgaWYgKCF0b2tlbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gdG9rZW5zWzFdLFxuICAgICAgICAgICAgcGFyYW1zID0gdG9rZW5zWzJdLFxuICAgICAgICAgICAgc3RvcHMgPSB0b2tlbnNbM107XG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zcGxpdCgvXFxzKixcXHMqLykubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuICtlbCA9PSBlbCA/ICtlbCA6IGVsO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT0gMSAmJiBwYXJhbXNbMF0gPT0gMCkge1xuICAgICAgICAgICAgcGFyYW1zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc3RvcHMgPSBzdG9wcy5zcGxpdChcIi1cIik7XG4gICAgICAgIHN0b3BzID0gc3RvcHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwgPSBlbC5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICB2YXIgb3V0ID0ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBlbFswXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChlbFsxXSkge1xuICAgICAgICAgICAgICAgIG91dC5vZmZzZXQgPSBwYXJzZUZsb2F0KGVsWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbGVuID0gc3RvcHMubGVuZ3RoLFxuICAgICAgICAgICAgc3RhcnQgPSAwLFxuICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIHNlZWQoaSwgZW5kKSB7XG4gICAgICAgICAgICB2YXIgc3RlcCA9IChlbmQgLSBzdGFydCkgLyAoaSAtIGopO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IGo7IGsgPCBpOyBrKyspIHtcbiAgICAgICAgICAgICAgICBzdG9wc1trXS5vZmZzZXQgPSArKCtzdGFydCArIHN0ZXAgKiAoayAtIGopKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaiA9IGk7XG4gICAgICAgICAgICBzdGFydCA9IGVuZDtcbiAgICAgICAgfVxuICAgICAgICBsZW4tLTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgaWYgKFwib2Zmc2V0XCIgaW4gc3RvcHNbaV0pIHtcbiAgICAgICAgICAgIHNlZWQoaSwgc3RvcHNbaV0ub2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBzdG9wc1tsZW5dLm9mZnNldCA9IHN0b3BzW2xlbl0ub2Zmc2V0IHx8IDEwMDtcbiAgICAgICAgc2VlZChsZW4sIHN0b3BzW2xlbl0ub2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgIHN0b3BzOiBzdG9wc1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuZFwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgaWYgKGlzKHZhbHVlLCBcImFycmF5XCIpICYmIGlzKHZhbHVlWzBdLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFNuYXAucGF0aC50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IFN0cih2YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZS5tYXRjaCgvW3J1b10vaSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gU25hcC5wYXRoLnRvQWJzb2x1dGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5ub2RlLCB7ZDogdmFsdWV9KTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuI3RleHRcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHZhbHVlID0gU3RyKHZhbHVlKTtcbiAgICAgICAgdmFyIHR4dCA9IGdsb2IuZG9jLmNyZWF0ZVRleHROb2RlKHZhbHVlKTtcbiAgICAgICAgd2hpbGUgKHRoaXMubm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZCh0eHQpO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5wYXRoXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB0aGlzLmF0dHIoe2Q6IHZhbHVlfSk7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmNsYXNzXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB0aGlzLm5vZGUuY2xhc3NOYW1lLmJhc2VWYWwgPSB2YWx1ZTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIudmlld0JveFwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHZiO1xuICAgICAgICBpZiAoaXModmFsdWUsIFwib2JqZWN0XCIpICYmIFwieFwiIGluIHZhbHVlKSB7XG4gICAgICAgICAgICB2YiA9IFt2YWx1ZS54LCB2YWx1ZS55LCB2YWx1ZS53aWR0aCwgdmFsdWUuaGVpZ2h0XS5qb2luKFwiIFwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChpcyh2YWx1ZSwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgdmIgPSB2YWx1ZS5qb2luKFwiIFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZiID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLm5vZGUsIHtcbiAgICAgICAgICAgIHZpZXdCb3g6IHZiXG4gICAgICAgIH0pO1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci50cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKHZhbHVlKTtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuclwiLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcInJlY3RcIikge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgICQodGhpcy5ub2RlLCB7XG4gICAgICAgICAgICAgICAgcng6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHJ5OiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIudGV4dHBhdGhcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgICAgIHZhciBpZCwgdHAsIG5vZGU7XG4gICAgICAgICAgICBpZiAoIXZhbHVlICYmIHRoaXMudGV4dFBhdGgpIHtcbiAgICAgICAgICAgICAgICB0cCA9IHRoaXMudGV4dFBhdGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRwLm5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodHAubm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHAucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGV4dFBhdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzKHZhbHVlLCBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZzID0gZ2V0U29tZURlZnModGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSB3cmFwKGRlZnMucGFyZW50Tm9kZSkucGF0aCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZGVmcy5hcHBlbmRDaGlsZChwYXRoLm5vZGUpO1xuICAgICAgICAgICAgICAgIGlkID0gcGF0aC5pZDtcbiAgICAgICAgICAgICAgICBwYXRoLmF0dHIoe2lkOiBpZH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXAodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB2YWx1ZS5hdHRyKFwiaWRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gdmFsdWUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5hdHRyKHtpZDogaWR9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIHRwID0gdGhpcy50ZXh0UGF0aDtcbiAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgIGlmICh0cCkge1xuICAgICAgICAgICAgICAgICAgICB0cC5hdHRyKHtcInhsaW5rOmhyZWZcIjogXCIjXCIgKyBpZH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRwID0gJChcInRleHRQYXRoXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwieGxpbms6aHJlZlwiOiBcIiNcIiArIGlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAobm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cC5hcHBlbmRDaGlsZChub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQodHApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRQYXRoID0gd3JhcCh0cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLnRleHRcIiwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5ub2RlLFxuICAgICAgICAgICAgICAgIHR1bmVyID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvdXQgPSAkKFwidHNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpcyhjaHVuaywgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVuay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dC5hcHBlbmRDaGlsZCh0dW5lcihjaHVua1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0LmFwcGVuZENoaWxkKGdsb2IuZG9jLmNyZWF0ZVRleHROb2RlKGNodW5rKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0Lm5vcm1hbGl6ZSAmJiBvdXQubm9ybWFsaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHVuZWQgPSB0dW5lcih2YWx1ZSk7XG4gICAgICAgICAgICB3aGlsZSAodHVuZWQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQodHVuZWQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICB9KSgtMSk7XG4gICAgZnVuY3Rpb24gc2V0Rm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgaWYgKHZhbHVlID09ICt2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgKz0gXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZS5zdHlsZS5mb250U2l6ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBldmUub24oXCJzbmFwLnV0aWwuYXR0ci5mb250U2l6ZVwiLCBzZXRGb250U2l6ZSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLmZvbnQtc2l6ZVwiLCBzZXRGb250U2l6ZSkoLTEpO1xuXG5cbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci50cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oKTtcbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIudGV4dHBhdGhcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0UGF0aDtcbiAgICB9KSgtMSk7XG4gICAgLy8gTWFya2Vyc1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGdldHRlcihlbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBnbG9iLmRvYy5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcIm1hcmtlci1cIiArIGVuZCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlID09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU25hcChnbG9iLmRvYy5nZXRFbGVtZW50QnlJZChzdHlsZS5tYXRjaChyZVVSTFZhbHVlKVsxXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc2V0dGVyKGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBcIm1hcmtlclwiICsgZW5kLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZW5kLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJcIiB8fCAhdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnN0eWxlW25hbWVdID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnR5cGUgPT0gXCJtYXJrZXJcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB2YWx1ZS5ub2RlLmlkO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHZhbHVlLm5vZGUsIHtpZDogdmFsdWUuaWR9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc3R5bGVbbmFtZV0gPSBVUkwoaWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5tYXJrZXItZW5kXCIsIGdldHRlcihcImVuZFwiKSkoLTEpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5tYXJrZXJFbmRcIiwgZ2V0dGVyKFwiZW5kXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLm1hcmtlci1zdGFydFwiLCBnZXR0ZXIoXCJzdGFydFwiKSkoLTEpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5tYXJrZXJTdGFydFwiLCBnZXR0ZXIoXCJzdGFydFwiKSkoLTEpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5tYXJrZXItbWlkXCIsIGdldHRlcihcIm1pZFwiKSkoLTEpO1xuICAgICAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5tYXJrZXJNaWRcIiwgZ2V0dGVyKFwibWlkXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLm1hcmtlci1lbmRcIiwgc2V0dGVyKFwiZW5kXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLm1hcmtlckVuZFwiLCBzZXR0ZXIoXCJlbmRcIikpKC0xKTtcbiAgICAgICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIubWFya2VyLXN0YXJ0XCIsIHNldHRlcihcInN0YXJ0XCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLm1hcmtlclN0YXJ0XCIsIHNldHRlcihcInN0YXJ0XCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLm1hcmtlci1taWRcIiwgc2V0dGVyKFwibWlkXCIpKSgtMSk7XG4gICAgICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyLm1hcmtlck1pZFwiLCBzZXR0ZXIoXCJtaWRcIikpKC0xKTtcbiAgICB9KCkpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy50eXBlID09IFwicmVjdFwiICYmICQodGhpcy5ub2RlLCBcInJ4XCIpID09ICQodGhpcy5ub2RlLCBcInJ5XCIpKSB7XG4gICAgICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICAgICAgcmV0dXJuICQodGhpcy5ub2RlLCBcInJ4XCIpO1xuICAgICAgICB9XG4gICAgfSkoLTEpO1xuICAgIGZ1bmN0aW9uIHRleHRFeHRyYWN0KG5vZGUpIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGkgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGkubm9kZVR5cGUgPT0gMykge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKGNoaS5ub2RlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoaS50YWdOYW1lID09IFwidHNwYW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChjaGkuY2hpbGROb2Rlcy5sZW5ndGggPT0gMSAmJiBjaGkuZmlyc3RDaGlsZC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGNoaS5maXJzdENoaWxkLm5vZGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2godGV4dEV4dHJhY3QoY2hpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnRleHRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy50eXBlID09IFwidGV4dFwiIHx8IHRoaXMudHlwZSA9PSBcInRzcGFuXCIpIHtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICB2YXIgb3V0ID0gdGV4dEV4dHJhY3QodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQubGVuZ3RoID09IDEgPyBvdXRbMF0gOiBvdXQ7XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIuI3RleHRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLnRleHRDb250ZW50O1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5maWxsXCIsIGZ1bmN0aW9uIChpbnRlcm5hbCkge1xuICAgICAgICBpZiAoaW50ZXJuYWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB2YXIgdmFsdWUgPSBldmUoXCJzbmFwLnV0aWwuZ2V0YXR0ci5maWxsXCIsIHRoaXMsIHRydWUpLmZpcnN0RGVmaW5lZCgpO1xuICAgICAgICByZXR1cm4gU25hcChTbmFwLmRldXJsKHZhbHVlKSkgfHwgdmFsdWU7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnN0cm9rZVwiLCBmdW5jdGlvbiAoaW50ZXJuYWwpIHtcbiAgICAgICAgaWYgKGludGVybmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgdmFyIHZhbHVlID0gZXZlKFwic25hcC51dGlsLmdldGF0dHIuc3Ryb2tlXCIsIHRoaXMsIHRydWUpLmZpcnN0RGVmaW5lZCgpO1xuICAgICAgICByZXR1cm4gU25hcChTbmFwLmRldXJsKHZhbHVlKSkgfHwgdmFsdWU7XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnZpZXdCb3hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB2YXIgdmIgPSAkKHRoaXMubm9kZSwgXCJ2aWV3Qm94XCIpO1xuICAgICAgICBpZiAodmIpIHtcbiAgICAgICAgICAgIHZiID0gdmIuc3BsaXQoc2VwYXJhdG9yKTtcbiAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KCt2YlswXSwgK3ZiWzFdLCArdmJbMl0sICt2YlszXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KSgtMSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmdldGF0dHIucG9pbnRzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHAgPSAkKHRoaXMubm9kZSwgXCJwb2ludHNcIik7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIGlmIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gcC5zcGxpdChzZXBhcmF0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLnBhdGhcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcCA9ICQodGhpcy5ub2RlLCBcImRcIik7XG4gICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0pKC0xKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5jbGFzc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuY2xhc3NOYW1lLmJhc2VWYWw7XG4gICAgfSkoLTEpO1xuICAgIGZ1bmN0aW9uIGdldEZvbnRTaXplKCkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLnN0eWxlLmZvbnRTaXplO1xuICAgIH1cbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5mb250U2l6ZVwiLCBnZXRGb250U2l6ZSkoLTEpO1xuICAgIGV2ZS5vbihcInNuYXAudXRpbC5nZXRhdHRyLmZvbnQtc2l6ZVwiLCBnZXRGb250U2l6ZSkoLTEpO1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxNCBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYiwgRnJhZ21lbnQpIHtcbiAgICB2YXIgcmdOb3RTcGFjZSA9IC9cXFMrL2csXG4gICAgICAgIHJnQmFkU3BhY2UgPSAvW1xcdFxcclxcblxcZl0vZyxcbiAgICAgICAgcmdUcmltID0gLyheXFxzK3xcXHMrJCkvZyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYWRkQ2xhc3NcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgZ2l2ZW4gY2xhc3MgbmFtZSBvciBsaXN0IG9mIGNsYXNzIG5hbWVzIHRvIHRoZSBlbGVtZW50LlxuICAgICAtIHZhbHVlIChzdHJpbmcpIGNsYXNzIG5hbWUgb3Igc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICAgKipcbiAgICAgPSAoRWxlbWVudCkgb3JpZ2luYWwgZWxlbWVudC5cbiAgICBcXCovXG4gICAgZWxwcm90by5hZGRDbGFzcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IFN0cih2YWx1ZSB8fCBcIlwiKS5tYXRjaChyZ05vdFNwYWNlKSB8fCBbXSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLm5vZGUsXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5iYXNlVmFsLFxuICAgICAgICAgICAgY3VyQ2xhc3NlcyA9IGNsYXNzTmFtZS5tYXRjaChyZ05vdFNwYWNlKSB8fCBbXSxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBwb3MsXG4gICAgICAgICAgICBjbGF6eixcbiAgICAgICAgICAgIGZpbmFsVmFsdWU7XG5cbiAgICAgICAgaWYgKGNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjbGF6eiA9IGNsYXNzZXNbaisrXSkge1xuICAgICAgICAgICAgICAgIHBvcyA9IGN1ckNsYXNzZXMuaW5kZXhPZihjbGF6eik7XG4gICAgICAgICAgICAgICAgaWYgKCF+cG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ckNsYXNzZXMucHVzaChjbGF6eik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaW5hbFZhbHVlID0gY3VyQ2xhc3Nlcy5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgIT0gZmluYWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NOYW1lLmJhc2VWYWwgPSBmaW5hbFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQucmVtb3ZlQ2xhc3NcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgZ2l2ZW4gY2xhc3MgbmFtZSBvciBsaXN0IG9mIGNsYXNzIG5hbWVzIGZyb20gdGhlIGVsZW1lbnQuXG4gICAgIC0gdmFsdWUgKHN0cmluZykgY2xhc3MgbmFtZSBvciBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgICAqKlxuICAgICA9IChFbGVtZW50KSBvcmlnaW5hbCBlbGVtZW50LlxuICAgIFxcKi9cbiAgICBlbHByb3RvLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3RyKHZhbHVlIHx8IFwiXCIpLm1hdGNoKHJnTm90U3BhY2UpIHx8IFtdLFxuICAgICAgICAgICAgZWxlbSA9IHRoaXMubm9kZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLmJhc2VWYWwsXG4gICAgICAgICAgICBjdXJDbGFzc2VzID0gY2xhc3NOYW1lLm1hdGNoKHJnTm90U3BhY2UpIHx8IFtdLFxuICAgICAgICAgICAgaixcbiAgICAgICAgICAgIHBvcyxcbiAgICAgICAgICAgIGNsYXp6LFxuICAgICAgICAgICAgZmluYWxWYWx1ZTtcbiAgICAgICAgaWYgKGN1ckNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjbGF6eiA9IGNsYXNzZXNbaisrXSkge1xuICAgICAgICAgICAgICAgIHBvcyA9IGN1ckNsYXNzZXMuaW5kZXhPZihjbGF6eik7XG4gICAgICAgICAgICAgICAgaWYgKH5wb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2xhc3Nlcy5zcGxpY2UocG9zLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbmFsVmFsdWUgPSBjdXJDbGFzc2VzLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSAhPSBmaW5hbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUuYmFzZVZhbCA9IGZpbmFsVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5oYXNDbGFzc1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBlbGVtZW50IGhhcyBhIGdpdmVuIGNsYXNzIG5hbWUgaW4gdGhlIGxpc3Qgb2YgY2xhc3MgbmFtZXMgYXBwbGllZCB0byBpdC5cbiAgICAgLSB2YWx1ZSAoc3RyaW5nKSBjbGFzcyBuYW1lXG4gICAgICoqXG4gICAgID0gKGJvb2xlYW4pIGB0cnVlYCBpZiB0aGUgZWxlbWVudCBoYXMgZ2l2ZW4gY2xhc3NcbiAgICBcXCovXG4gICAgZWxwcm90by5oYXNDbGFzcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgZWxlbSA9IHRoaXMubm9kZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLmJhc2VWYWwsXG4gICAgICAgICAgICBjdXJDbGFzc2VzID0gY2xhc3NOYW1lLm1hdGNoKHJnTm90U3BhY2UpIHx8IFtdO1xuICAgICAgICByZXR1cm4gISF+Y3VyQ2xhc3Nlcy5pbmRleE9mKHZhbHVlKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvZ2dsZUNsYXNzXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGQgb3IgcmVtb3ZlIG9uZSBvciBtb3JlIGNsYXNzZXMgZnJvbSB0aGUgZWxlbWVudCwgZGVwZW5kaW5nIG9uIGVpdGhlclxuICAgICAqIHRoZSBjbGFzc+KAmXMgcHJlc2VuY2Ugb3IgdGhlIHZhbHVlIG9mIHRoZSBgZmxhZ2AgYXJndW1lbnQuXG4gICAgIC0gdmFsdWUgKHN0cmluZykgY2xhc3MgbmFtZSBvciBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgICAtIGZsYWcgKGJvb2xlYW4pIHZhbHVlIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBjbGFzcyBzaG91bGQgYmUgYWRkZWQgb3IgcmVtb3ZlZFxuICAgICAqKlxuICAgICA9IChFbGVtZW50KSBvcmlnaW5hbCBlbGVtZW50LlxuICAgIFxcKi9cbiAgICBlbHByb3RvLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gKHZhbHVlLCBmbGFnKSB7XG4gICAgICAgIGlmIChmbGFnICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQ2xhc3ModmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDbGFzcyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNsYXNzZXMgPSAodmFsdWUgfHwgXCJcIikubWF0Y2gocmdOb3RTcGFjZSkgfHwgW10sXG4gICAgICAgICAgICBlbGVtID0gdGhpcy5ub2RlLFxuICAgICAgICAgICAgY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUuYmFzZVZhbCxcbiAgICAgICAgICAgIGN1ckNsYXNzZXMgPSBjbGFzc05hbWUubWF0Y2gocmdOb3RTcGFjZSkgfHwgW10sXG4gICAgICAgICAgICBqLFxuICAgICAgICAgICAgcG9zLFxuICAgICAgICAgICAgY2xhenosXG4gICAgICAgICAgICBmaW5hbFZhbHVlO1xuICAgICAgICBqID0gMDtcbiAgICAgICAgd2hpbGUgKGNsYXp6ID0gY2xhc3Nlc1tqKytdKSB7XG4gICAgICAgICAgICBwb3MgPSBjdXJDbGFzc2VzLmluZGV4T2YoY2xhenopO1xuICAgICAgICAgICAgaWYgKH5wb3MpIHtcbiAgICAgICAgICAgICAgICBjdXJDbGFzc2VzLnNwbGljZShwb3MsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJDbGFzc2VzLnB1c2goY2xhenopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmluYWxWYWx1ZSA9IGN1ckNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgICAgIGlmIChjbGFzc05hbWUgIT0gZmluYWxWYWx1ZSkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUuYmFzZVZhbCA9IGZpbmFsVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IsIEZyYWdtZW50KSB7XG4gICAgdmFyIG9wZXJhdG9ycyA9IHtcbiAgICAgICAgICAgIFwiK1wiOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCArIHk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiLVwiOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCAtIHk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL1wiOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCAvIHk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiKlwiOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geCAqIHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBTdHIgPSBTdHJpbmcsXG4gICAgICAgIHJlVW5pdCA9IC9bYS16XSskL2ksXG4gICAgICAgIHJlQWRkb24gPSAvXlxccyooWytcXC1cXC8qXSlcXHMqPVxccyooW1xcZC5lRStcXC1dKylcXHMqKFteXFxkXFxzXSspP1xccyokLztcbiAgICBmdW5jdGlvbiBnZXROdW1iZXIodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFVuaXQodW5pdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuICt2YWwudG9GaXhlZCgzKSArIHVuaXQ7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGV2ZS5vbihcInNuYXAudXRpbC5hdHRyXCIsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgdmFyIHBsdXMgPSBTdHIodmFsKS5tYXRjaChyZUFkZG9uKTtcbiAgICAgICAgaWYgKHBsdXMpIHtcbiAgICAgICAgICAgIHZhciBldm50ID0gZXZlLm50KCksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGV2bnQuc3Vic3RyaW5nKGV2bnQubGFzdEluZGV4T2YoXCIuXCIpICsgMSksXG4gICAgICAgICAgICAgICAgYSA9IHRoaXMuYXR0cihuYW1lKSxcbiAgICAgICAgICAgICAgICBhdHIgPSB7fTtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICB2YXIgdW5pdCA9IHBsdXNbM10gfHwgXCJcIixcbiAgICAgICAgICAgICAgICBhVW5pdCA9IGEubWF0Y2gocmVVbml0KSxcbiAgICAgICAgICAgICAgICBvcCA9IG9wZXJhdG9yc1twbHVzWzFdXTtcbiAgICAgICAgICAgIGlmIChhVW5pdCAmJiBhVW5pdCA9PSB1bml0KSB7XG4gICAgICAgICAgICAgICAgdmFsID0gb3AocGFyc2VGbG9hdChhKSwgK3BsdXNbMl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhID0gdGhpcy5hc1BYKG5hbWUpO1xuICAgICAgICAgICAgICAgIHZhbCA9IG9wKHRoaXMuYXNQWChuYW1lKSwgdGhpcy5hc1BYKG5hbWUsIHBsdXNbMl0gKyB1bml0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOYU4oYSkgfHwgaXNOYU4odmFsKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0cltuYW1lXSA9IHZhbDtcbiAgICAgICAgICAgIHRoaXMuYXR0cihhdHIpO1xuICAgICAgICB9XG4gICAgfSkoLTEwKTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZXF1YWxcIiwgZnVuY3Rpb24gKG5hbWUsIGIpIHtcbiAgICAgICAgdmFyIEEsIEIsIGEgPSBTdHIodGhpcy5hdHRyKG5hbWUpIHx8IFwiXCIpLFxuICAgICAgICAgICAgZWwgPSB0aGlzLFxuICAgICAgICAgICAgYnBsdXMgPSBTdHIoYikubWF0Y2gocmVBZGRvbik7XG4gICAgICAgIGlmIChicGx1cykge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIHZhciB1bml0ID0gYnBsdXNbM10gfHwgXCJcIixcbiAgICAgICAgICAgICAgICBhVW5pdCA9IGEubWF0Y2gocmVVbml0KSxcbiAgICAgICAgICAgICAgICBvcCA9IG9wZXJhdG9yc1ticGx1c1sxXV07XG4gICAgICAgICAgICBpZiAoYVVuaXQgJiYgYVVuaXQgPT0gdW5pdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IHBhcnNlRmxvYXQoYSksXG4gICAgICAgICAgICAgICAgICAgIHRvOiBvcChwYXJzZUZsb2F0KGEpLCArYnBsdXNbMl0pLFxuICAgICAgICAgICAgICAgICAgICBmOiBnZXRVbml0KGFVbml0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGEgPSB0aGlzLmFzUFgobmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogYSxcbiAgICAgICAgICAgICAgICAgICAgdG86IG9wKGEsIHRoaXMuYXNQWChuYW1lLCBicGx1c1syXSArIHVuaXQpKSxcbiAgICAgICAgICAgICAgICAgICAgZjogZ2V0TnVtYmVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pKC0xMCk7XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBwcm90byA9IFBhcGVyLnByb3RvdHlwZSxcbiAgICAgICAgaXMgPSBTbmFwLmlzO1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5yZWN0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKlxuICAgICAqIERyYXdzIGEgcmVjdGFuZ2xlXG4gICAgICoqXG4gICAgIC0geCAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lclxuICAgICAtIHkgKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgLSB3aWR0aCAobnVtYmVyKSB3aWR0aFxuICAgICAtIGhlaWdodCAobnVtYmVyKSBoZWlnaHRcbiAgICAgLSByeCAobnVtYmVyKSAjb3B0aW9uYWwgaG9yaXpvbnRhbCByYWRpdXMgZm9yIHJvdW5kZWQgY29ybmVycywgZGVmYXVsdCBpcyAwXG4gICAgIC0gcnkgKG51bWJlcikgI29wdGlvbmFsIHZlcnRpY2FsIHJhZGl1cyBmb3Igcm91bmRlZCBjb3JuZXJzLCBkZWZhdWx0IGlzIHJ4IG9yIDBcbiAgICAgPSAob2JqZWN0KSB0aGUgYHJlY3RgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IC8vIHJlZ3VsYXIgcmVjdGFuZ2xlXG4gICAgIHwgdmFyIGMgPSBwYXBlci5yZWN0KDEwLCAxMCwgNTAsIDUwKTtcbiAgICAgfCAvLyByZWN0YW5nbGUgd2l0aCByb3VuZGVkIGNvcm5lcnNcbiAgICAgfCB2YXIgYyA9IHBhcGVyLnJlY3QoNDAsIDQwLCA1MCwgNTAsIDEwKTtcbiAgICBcXCovXG4gICAgcHJvdG8ucmVjdCA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoLCByeCwgcnkpIHtcbiAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgIGlmIChyeSA9PSBudWxsKSB7XG4gICAgICAgICAgICByeSA9IHJ4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpcyh4LCBcIm9iamVjdFwiKSAmJiB4ID09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgIGF0dHIgPSB4O1xuICAgICAgICB9IGVsc2UgaWYgKHggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ciA9IHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICAgICAgd2lkdGg6IHcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHJ4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRyLnJ4ID0gcng7XG4gICAgICAgICAgICAgICAgYXR0ci5yeSA9IHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwicmVjdFwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5jaXJjbGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIERyYXdzIGEgY2lyY2xlXG4gICAgICoqXG4gICAgIC0geCAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRyZVxuICAgICAtIHkgKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBjZW50cmVcbiAgICAgLSByIChudW1iZXIpIHJhZGl1c1xuICAgICA9IChvYmplY3QpIHRoZSBgY2lyY2xlYCBlbGVtZW50XG4gICAgICoqXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgYyA9IHBhcGVyLmNpcmNsZSg1MCwgNTAsIDQwKTtcbiAgICBcXCovXG4gICAgcHJvdG8uY2lyY2xlID0gZnVuY3Rpb24gKGN4LCBjeSwgcikge1xuICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgaWYgKGlzKGN4LCBcIm9iamVjdFwiKSAmJiBjeCA9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgICBhdHRyID0gY3g7XG4gICAgICAgIH0gZWxzZSBpZiAoY3ggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ciA9IHtcbiAgICAgICAgICAgICAgICBjeDogY3gsXG4gICAgICAgICAgICAgICAgY3k6IGN5LFxuICAgICAgICAgICAgICAgIHI6IHJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJjaXJjbGVcIiwgYXR0cik7XG4gICAgfTtcblxuICAgIHZhciBwcmVsb2FkID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gb25lcnJvcigpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHNyYywgZikge1xuICAgICAgICAgICAgdmFyIGltZyA9IGdsb2IuZG9jLmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksXG4gICAgICAgICAgICAgICAgYm9keSA9IGdsb2IuZG9jLmJvZHk7XG4gICAgICAgICAgICBpbWcuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246YWJzb2x1dGU7bGVmdDotOTk5OWVtO3RvcDotOTk5OWVtXCI7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGYuY2FsbChpbWcpO1xuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSBpbWcub25lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZChpbWcpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gb25lcnJvcjtcbiAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuICAgIC8qXFxcbiAgICAgKiBQYXBlci5pbWFnZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUGxhY2VzIGFuIGltYWdlIG9uIHRoZSBzdXJmYWNlXG4gICAgICoqXG4gICAgIC0gc3JjIChzdHJpbmcpIFVSSSBvZiB0aGUgc291cmNlIGltYWdlXG4gICAgIC0geCAobnVtYmVyKSB4IG9mZnNldCBwb3NpdGlvblxuICAgICAtIHkgKG51bWJlcikgeSBvZmZzZXQgcG9zaXRpb25cbiAgICAgLSB3aWR0aCAobnVtYmVyKSB3aWR0aCBvZiB0aGUgaW1hZ2VcbiAgICAgLSBoZWlnaHQgKG51bWJlcikgaGVpZ2h0IG9mIHRoZSBpbWFnZVxuICAgICA9IChvYmplY3QpIHRoZSBgaW1hZ2VgIGVsZW1lbnRcbiAgICAgKiBvclxuICAgICA9IChvYmplY3QpIFNuYXAgZWxlbWVudCBvYmplY3Qgd2l0aCB0eXBlIGBpbWFnZWBcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBjID0gcGFwZXIuaW1hZ2UoXCJhcHBsZS5wbmdcIiwgMTAsIDEwLCA4MCwgODApO1xuICAgIFxcKi9cbiAgICBwcm90by5pbWFnZSA9IGZ1bmN0aW9uIChzcmMsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbChcImltYWdlXCIpO1xuICAgICAgICBpZiAoaXMoc3JjLCBcIm9iamVjdFwiKSAmJiBcInNyY1wiIGluIHNyYykge1xuICAgICAgICAgICAgZWwuYXR0cihzcmMpO1xuICAgICAgICB9IGVsc2UgaWYgKHNyYyAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgc2V0ID0ge1xuICAgICAgICAgICAgICAgIFwieGxpbms6aHJlZlwiOiBzcmMsXG4gICAgICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbzogXCJub25lXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoeCAhPSBudWxsICYmIHkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNldC54ID0geDtcbiAgICAgICAgICAgICAgICBzZXQueSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2lkdGggIT0gbnVsbCAmJiBoZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNldC53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgICAgIHNldC5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZWxvYWQoc3JjLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIFNuYXAuXy4kKGVsLm5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFNuYXAuXy4kKGVsLm5vZGUsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLmVsbGlwc2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIERyYXdzIGFuIGVsbGlwc2VcbiAgICAgKipcbiAgICAgLSB4IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgY2VudHJlXG4gICAgIC0geSAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRyZVxuICAgICAtIHJ4IChudW1iZXIpIGhvcml6b250YWwgcmFkaXVzXG4gICAgIC0gcnkgKG51bWJlcikgdmVydGljYWwgcmFkaXVzXG4gICAgID0gKG9iamVjdCkgdGhlIGBlbGxpcHNlYCBlbGVtZW50XG4gICAgICoqXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgYyA9IHBhcGVyLmVsbGlwc2UoNTAsIDUwLCA0MCwgMjApO1xuICAgIFxcKi9cbiAgICBwcm90by5lbGxpcHNlID0gZnVuY3Rpb24gKGN4LCBjeSwgcngsIHJ5KSB7XG4gICAgICAgIHZhciBhdHRyO1xuICAgICAgICBpZiAoaXMoY3gsIFwib2JqZWN0XCIpICYmIGN4ID09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgIGF0dHIgPSBjeDtcbiAgICAgICAgfSBlbHNlIGlmIChjeCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyID17XG4gICAgICAgICAgICAgICAgY3g6IGN4LFxuICAgICAgICAgICAgICAgIGN5OiBjeSxcbiAgICAgICAgICAgICAgICByeDogcngsXG4gICAgICAgICAgICAgICAgcnk6IHJ5XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwiZWxsaXBzZVwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8vIFNJRVJSQSBQYXBlci5wYXRoKCk6IFVuY2xlYXIgZnJvbSB0aGUgbGluayB3aGF0IGEgQ2F0bXVsbC1Sb20gY3VydmV0byBpcywgYW5kIHdoeSBpdCB3b3VsZCBtYWtlIGxpZmUgYW55IGVhc2llci5cbiAgICAvKlxcXG4gICAgICogUGFwZXIucGF0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIGA8cGF0aD5gIGVsZW1lbnQgdXNpbmcgdGhlIGdpdmVuIHN0cmluZyBhcyB0aGUgcGF0aCdzIGRlZmluaXRpb25cbiAgICAgLSBwYXRoU3RyaW5nIChzdHJpbmcpICNvcHRpb25hbCBwYXRoIHN0cmluZyBpbiBTVkcgZm9ybWF0XG4gICAgICogUGF0aCBzdHJpbmcgY29uc2lzdHMgb2Ygb25lLWxldHRlciBjb21tYW5kcywgZm9sbG93ZWQgYnkgY29tbWEgc2VwcmFyYXRlZCBhcmd1bWVudHMgaW4gbnVtZXJpY2FsIGZvcm0uIEV4YW1wbGU6XG4gICAgIHwgXCJNMTAsMjBMMzAsNDBcIlxuICAgICAqIFRoaXMgZXhhbXBsZSBmZWF0dXJlcyB0d28gY29tbWFuZHM6IGBNYCwgd2l0aCBhcmd1bWVudHMgYCgxMCwgMjApYCBhbmQgYExgIHdpdGggYXJndW1lbnRzIGAoMzAsIDQwKWAuIFVwcGVyY2FzZSBsZXR0ZXIgY29tbWFuZHMgZXhwcmVzcyBjb29yZGluYXRlcyBpbiBhYnNvbHV0ZSB0ZXJtcywgd2hpbGUgbG93ZXJjYXNlIGNvbW1hbmRzIGV4cHJlc3MgdGhlbSBpbiByZWxhdGl2ZSB0ZXJtcyBmcm9tIHRoZSBtb3N0IHJlY2VudGx5IGRlY2xhcmVkIGNvb3JkaW5hdGVzLlxuICAgICAqXG4gICAgICMgPHA+SGVyZSBpcyBzaG9ydCBsaXN0IG9mIGNvbW1hbmRzIGF2YWlsYWJsZSwgZm9yIG1vcmUgZGV0YWlscyBzZWUgPGEgaHJlZj1cImh0dHA6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXCIgdGl0bGU9XCJEZXRhaWxzIG9mIGEgcGF0aCdzIGRhdGEgYXR0cmlidXRlJ3MgZm9ybWF0IGFyZSBkZXNjcmliZWQgaW4gdGhlIFNWRyBzcGVjaWZpY2F0aW9uLlwiPlNWRyBwYXRoIHN0cmluZyBmb3JtYXQ8L2E+IG9yIDxhIGhyZWY9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9TVkcvVHV0b3JpYWwvUGF0aHNcIj5hcnRpY2xlIGFib3V0IHBhdGggc3RyaW5ncyBhdCBNRE48L2E+LjwvcD5cbiAgICAgIyA8dGFibGU+PHRoZWFkPjx0cj48dGg+Q29tbWFuZDwvdGg+PHRoPk5hbWU8L3RoPjx0aD5QYXJhbWV0ZXJzPC90aD48L3RyPjwvdGhlYWQ+PHRib2R5PlxuICAgICAjIDx0cj48dGQ+TTwvdGQ+PHRkPm1vdmV0bzwvdGQ+PHRkPih4IHkpKzwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPlo8L3RkPjx0ZD5jbG9zZXBhdGg8L3RkPjx0ZD4obm9uZSk8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5MPC90ZD48dGQ+bGluZXRvPC90ZD48dGQ+KHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+SDwvdGQ+PHRkPmhvcml6b250YWwgbGluZXRvPC90ZD48dGQ+eCs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5WPC90ZD48dGQ+dmVydGljYWwgbGluZXRvPC90ZD48dGQ+eSs8L3RkPjwvdHI+XG4gICAgICMgPHRyPjx0ZD5DPC90ZD48dGQ+Y3VydmV0bzwvdGQ+PHRkPih4MSB5MSB4MiB5MiB4IHkpKzwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPlM8L3RkPjx0ZD5zbW9vdGggY3VydmV0bzwvdGQ+PHRkPih4MiB5MiB4IHkpKzwvdGQ+PC90cj5cbiAgICAgIyA8dHI+PHRkPlE8L3RkPjx0ZD5xdWFkcmF0aWMgQsOpemllciBjdXJ2ZXRvPC90ZD48dGQ+KHgxIHkxIHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+VDwvdGQ+PHRkPnNtb290aCBxdWFkcmF0aWMgQsOpemllciBjdXJ2ZXRvPC90ZD48dGQ+KHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+QTwvdGQ+PHRkPmVsbGlwdGljYWwgYXJjPC90ZD48dGQ+KHJ4IHJ5IHgtYXhpcy1yb3RhdGlvbiBsYXJnZS1hcmMtZmxhZyBzd2VlcC1mbGFnIHggeSkrPC90ZD48L3RyPlxuICAgICAjIDx0cj48dGQ+UjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NhdG11bGzigJNSb21fc3BsaW5lI0NhdG11bGwuRTIuODAuOTNSb21fc3BsaW5lXCI+Q2F0bXVsbC1Sb20gY3VydmV0bzwvYT4qPC90ZD48dGQ+eDEgeTEgKHggeSkrPC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT5cbiAgICAgKiAqIF9DYXRtdWxsLVJvbSBjdXJ2ZXRvXyBpcyBhIG5vdCBzdGFuZGFyZCBTVkcgY29tbWFuZCBhbmQgYWRkZWQgdG8gbWFrZSBsaWZlIGVhc2llci5cbiAgICAgKiBOb3RlOiB0aGVyZSBpcyBhIHNwZWNpYWwgY2FzZSB3aGVuIGEgcGF0aCBjb25zaXN0cyBvZiBvbmx5IHRocmVlIGNvbW1hbmRzOiBgTTEwLDEwUuKApnpgLiBJbiB0aGlzIGNhc2UgdGhlIHBhdGggY29ubmVjdHMgYmFjayB0byBpdHMgc3RhcnRpbmcgcG9pbnQuXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgYyA9IHBhcGVyLnBhdGgoXCJNMTAgMTBMOTAgOTBcIik7XG4gICAgIHwgLy8gZHJhdyBhIGRpYWdvbmFsIGxpbmU6XG4gICAgIHwgLy8gbW92ZSB0byAxMCwxMCwgbGluZSB0byA5MCw5MFxuICAgIFxcKi9cbiAgICBwcm90by5wYXRoID0gZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgIGlmIChpcyhkLCBcIm9iamVjdFwiKSAmJiAhaXMoZCwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgYXR0ciA9IGQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZCkge1xuICAgICAgICAgICAgYXR0ciA9IHtkOiBkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbChcInBhdGhcIiwgYXR0cik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIuZ1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIGdyb3VwIGVsZW1lbnRcbiAgICAgKipcbiAgICAgLSB2YXJhcmdzICjigKYpICNvcHRpb25hbCBlbGVtZW50cyB0byBuZXN0IHdpdGhpbiB0aGUgZ3JvdXBcbiAgICAgPSAob2JqZWN0KSB0aGUgYGdgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBjMSA9IHBhcGVyLmNpcmNsZSgpLFxuICAgICB8ICAgICBjMiA9IHBhcGVyLnJlY3QoKSxcbiAgICAgfCAgICAgZyA9IHBhcGVyLmcoYzIsIGMxKTsgLy8gbm90ZSB0aGF0IHRoZSBvcmRlciBvZiBlbGVtZW50cyBpcyBkaWZmZXJlbnRcbiAgICAgKiBvclxuICAgICB8IHZhciBjMSA9IHBhcGVyLmNpcmNsZSgpLFxuICAgICB8ICAgICBjMiA9IHBhcGVyLnJlY3QoKSxcbiAgICAgfCAgICAgZyA9IHBhcGVyLmcoKTtcbiAgICAgfCBnLmFkZChjMiwgYzEpO1xuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogUGFwZXIuZ3JvdXBcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFNlZSBAUGFwZXIuZ1xuICAgIFxcKi9cbiAgICBwcm90by5ncm91cCA9IHByb3RvLmcgPSBmdW5jdGlvbiAoZmlyc3QpIHtcbiAgICAgICAgdmFyIGF0dHIsXG4gICAgICAgICAgICBlbCA9IHRoaXMuZWwoXCJnXCIpO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIGZpcnN0ICYmICFmaXJzdC50eXBlKSB7XG4gICAgICAgICAgICBlbC5hdHRyKGZpcnN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbC5hZGQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLnN2Z1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIG5lc3RlZCBTVkcgZWxlbWVudC5cbiAgICAgLSB4IChudW1iZXIpIEBvcHRpb25hbCBYIG9mIHRoZSBlbGVtZW50XG4gICAgIC0geSAobnVtYmVyKSBAb3B0aW9uYWwgWSBvZiB0aGUgZWxlbWVudFxuICAgICAtIHdpZHRoIChudW1iZXIpIEBvcHRpb25hbCB3aWR0aCBvZiB0aGUgZWxlbWVudFxuICAgICAtIGhlaWdodCAobnVtYmVyKSBAb3B0aW9uYWwgaGVpZ2h0IG9mIHRoZSBlbGVtZW50XG4gICAgIC0gdmJ4IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IFhcbiAgICAgLSB2YnkgKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggWVxuICAgICAtIHZidyAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCB3aWR0aFxuICAgICAtIHZiaCAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBoZWlnaHRcbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSB0aGUgYHN2Z2AgZWxlbWVudFxuICAgICAqKlxuICAgIFxcKi9cbiAgICBwcm90by5zdmcgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgdmJ4LCB2YnksIHZidywgdmJoKSB7XG4gICAgICAgIHZhciBhdHRycyA9IHt9O1xuICAgICAgICBpZiAoaXMoeCwgXCJvYmplY3RcIikgJiYgeSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRycyA9IHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoeCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0cnMueCA9IHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXR0cnMueSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2lkdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHJzLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRycy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmJ4ICE9IG51bGwgJiYgdmJ5ICE9IG51bGwgJiYgdmJ3ICE9IG51bGwgJiYgdmJoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRycy52aWV3Qm94ID0gW3ZieCwgdmJ5LCB2YncsIHZiaF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWwoXCJzdmdcIiwgYXR0cnMpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLm1hc2tcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEVxdWl2YWxlbnQgaW4gYmVoYXZpb3VyIHRvIEBQYXBlci5nLCBleGNlcHQgaXTigJlzIGEgbWFzay5cbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSB0aGUgYG1hc2tgIGVsZW1lbnRcbiAgICAgKipcbiAgICBcXCovXG4gICAgcHJvdG8ubWFzayA9IGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgICB2YXIgYXR0cixcbiAgICAgICAgICAgIGVsID0gdGhpcy5lbChcIm1hc2tcIik7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEgJiYgZmlyc3QgJiYgIWZpcnN0LnR5cGUpIHtcbiAgICAgICAgICAgIGVsLmF0dHIoZmlyc3QpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsLmFkZChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIucHRyblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRXF1aXZhbGVudCBpbiBiZWhhdmlvdXIgdG8gQFBhcGVyLmcsIGV4Y2VwdCBpdOKAmXMgYSBwYXR0ZXJuLlxuICAgICAtIHggKG51bWJlcikgQG9wdGlvbmFsIFggb2YgdGhlIGVsZW1lbnRcbiAgICAgLSB5IChudW1iZXIpIEBvcHRpb25hbCBZIG9mIHRoZSBlbGVtZW50XG4gICAgIC0gd2lkdGggKG51bWJlcikgQG9wdGlvbmFsIHdpZHRoIG9mIHRoZSBlbGVtZW50XG4gICAgIC0gaGVpZ2h0IChudW1iZXIpIEBvcHRpb25hbCBoZWlnaHQgb2YgdGhlIGVsZW1lbnRcbiAgICAgLSB2YnggKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggWFxuICAgICAtIHZieSAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBZXG4gICAgIC0gdmJ3IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IHdpZHRoXG4gICAgIC0gdmJoIChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IGhlaWdodFxuICAgICAqKlxuICAgICA9IChvYmplY3QpIHRoZSBgcGF0dGVybmAgZWxlbWVudFxuICAgICAqKlxuICAgIFxcKi9cbiAgICBwcm90by5wdHJuID0gZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQsIHZ4LCB2eSwgdncsIHZoKSB7XG4gICAgICAgIGlmIChpcyh4LCBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ciA9IHtwYXR0ZXJuVW5pdHM6IFwidXNlclNwYWNlT25Vc2VcIn07XG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIGF0dHIueCA9IHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgICAgIGF0dHIueSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAod2lkdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHIud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGF0dHIuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZ4ICE9IG51bGwgJiYgdnkgIT0gbnVsbCAmJiB2dyAhPSBudWxsICYmIHZoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhdHRyLnZpZXdCb3ggPSBbdngsIHZ5LCB2dywgdmhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdHRyLnZpZXdCb3ggPSBbeCB8fCAwLCB5IHx8IDAsIHdpZHRoIHx8IDAsIGhlaWdodCB8fCAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbChcInBhdHRlcm5cIiwgYXR0cik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIudXNlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgPHVzZT4gZWxlbWVudC5cbiAgICAgLSBpZCAoc3RyaW5nKSBAb3B0aW9uYWwgaWQgb2YgZWxlbWVudCB0byBsaW5rXG4gICAgICogb3JcbiAgICAgLSBpZCAoRWxlbWVudCkgQG9wdGlvbmFsIGVsZW1lbnQgdG8gbGlua1xuICAgICAqKlxuICAgICA9IChvYmplY3QpIHRoZSBgdXNlYCBlbGVtZW50XG4gICAgICoqXG4gICAgXFwqL1xuICAgIHByb3RvLnVzZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGlkIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmICghaWQuYXR0cihcImlkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkLmF0dHIoe2lkOiBTbmFwLl8uaWQoaWQpfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkID0gaWQuYXR0cihcImlkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFN0cmluZyhpZCkuY2hhckF0KCkgPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsKFwidXNlXCIsIHtcInhsaW5rOmhyZWZcIjogXCIjXCIgKyBpZH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEVsZW1lbnQucHJvdG90eXBlLnVzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIuc3ltYm9sXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBDcmVhdGVzIGEgPHN5bWJvbD4gZWxlbWVudC5cbiAgICAgLSB2YnggKG51bWJlcikgQG9wdGlvbmFsIHZpZXdib3ggWFxuICAgICAtIHZieSAobnVtYmVyKSBAb3B0aW9uYWwgdmlld2JveCBZXG4gICAgIC0gdmJ3IChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IHdpZHRoXG4gICAgIC0gdmJoIChudW1iZXIpIEBvcHRpb25hbCB2aWV3Ym94IGhlaWdodFxuICAgICA9IChvYmplY3QpIHRoZSBgc3ltYm9sYCBlbGVtZW50XG4gICAgICoqXG4gICAgXFwqL1xuICAgIHByb3RvLnN5bWJvbCA9IGZ1bmN0aW9uICh2eCwgdnksIHZ3LCB2aCkge1xuICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICBpZiAodnggIT0gbnVsbCAmJiB2eSAhPSBudWxsICYmIHZ3ICE9IG51bGwgJiYgdmggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ci52aWV3Qm94ID0gW3Z4LCB2eSwgdncsIHZoXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwic3ltYm9sXCIsIGF0dHIpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFBhcGVyLnRleHRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIERyYXdzIGEgdGV4dCBzdHJpbmdcbiAgICAgKipcbiAgICAgLSB4IChudW1iZXIpIHggY29vcmRpbmF0ZSBwb3NpdGlvblxuICAgICAtIHkgKG51bWJlcikgeSBjb29yZGluYXRlIHBvc2l0aW9uXG4gICAgIC0gdGV4dCAoc3RyaW5nfGFycmF5KSBUaGUgdGV4dCBzdHJpbmcgdG8gZHJhdyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIG5lc3Qgd2l0aGluIHNlcGFyYXRlIGA8dHNwYW4+YCBlbGVtZW50c1xuICAgICA9IChvYmplY3QpIHRoZSBgdGV4dGAgZWxlbWVudFxuICAgICAqKlxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIHQxID0gcGFwZXIudGV4dCg1MCwgNTAsIFwiU25hcFwiKTtcbiAgICAgfCB2YXIgdDIgPSBwYXBlci50ZXh0KDUwLCA1MCwgW1wiU1wiLFwiblwiLFwiYVwiLFwicFwiXSk7XG4gICAgIHwgLy8gVGV4dCBwYXRoIHVzYWdlXG4gICAgIHwgdDEuYXR0cih7dGV4dHBhdGg6IFwiTTEwLDEwTDEwMCwxMDBcIn0pO1xuICAgICB8IC8vIG9yXG4gICAgIHwgdmFyIHB0aCA9IHBhcGVyLnBhdGgoXCJNMTAsMTBMMTAwLDEwMFwiKTtcbiAgICAgfCB0MS5hdHRyKHt0ZXh0cGF0aDogcHRofSk7XG4gICAgXFwqL1xuICAgIHByb3RvLnRleHQgPSBmdW5jdGlvbiAoeCwgeSwgdGV4dCkge1xuICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICBpZiAoaXMoeCwgXCJvYmplY3RcIikpIHtcbiAgICAgICAgICAgIGF0dHIgPSB4O1xuICAgICAgICB9IGVsc2UgaWYgKHggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0ciA9IHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dCB8fCBcIlwiXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwidGV4dFwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5saW5lXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBEcmF3cyBhIGxpbmVcbiAgICAgKipcbiAgICAgLSB4MSAobnVtYmVyKSB4IGNvb3JkaW5hdGUgcG9zaXRpb24gb2YgdGhlIHN0YXJ0XG4gICAgIC0geTEgKG51bWJlcikgeSBjb29yZGluYXRlIHBvc2l0aW9uIG9mIHRoZSBzdGFydFxuICAgICAtIHgyIChudW1iZXIpIHggY29vcmRpbmF0ZSBwb3NpdGlvbiBvZiB0aGUgZW5kXG4gICAgIC0geTIgKG51bWJlcikgeSBjb29yZGluYXRlIHBvc2l0aW9uIG9mIHRoZSBlbmRcbiAgICAgPSAob2JqZWN0KSB0aGUgYGxpbmVgIGVsZW1lbnRcbiAgICAgKipcbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciB0MSA9IHBhcGVyLmxpbmUoNTAsIDUwLCAxMDAsIDEwMCk7XG4gICAgXFwqL1xuICAgIHByb3RvLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgdmFyIGF0dHIgPSB7fTtcbiAgICAgICAgaWYgKGlzKHgxLCBcIm9iamVjdFwiKSkge1xuICAgICAgICAgICAgYXR0ciA9IHgxO1xuICAgICAgICB9IGVsc2UgaWYgKHgxICE9IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHIgPSB7XG4gICAgICAgICAgICAgICAgeDE6IHgxLFxuICAgICAgICAgICAgICAgIHgyOiB4MixcbiAgICAgICAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgICAgICAgeTI6IHkyXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwibGluZVwiLCBhdHRyKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBQYXBlci5wb2x5bGluZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRHJhd3MgYSBwb2x5bGluZVxuICAgICAqKlxuICAgICAtIHBvaW50cyAoYXJyYXkpIGFycmF5IG9mIHBvaW50c1xuICAgICAqIG9yXG4gICAgIC0gdmFyYXJncyAo4oCmKSBwb2ludHNcbiAgICAgPSAob2JqZWN0KSB0aGUgYHBvbHlsaW5lYCBlbGVtZW50XG4gICAgICoqXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgcDEgPSBwYXBlci5wb2x5bGluZShbMTAsIDEwLCAxMDAsIDEwMF0pO1xuICAgICB8IHZhciBwMiA9IHBhcGVyLnBvbHlsaW5lKDEwLCAxMCwgMTAwLCAxMDApO1xuICAgIFxcKi9cbiAgICBwcm90by5wb2x5bGluZSA9IGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBwb2ludHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhdHRyID0ge307XG4gICAgICAgIGlmIChpcyhwb2ludHMsIFwib2JqZWN0XCIpICYmICFpcyhwb2ludHMsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiAocG9pbnRzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHIgPSB7cG9pbnRzOiBwb2ludHN9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVsKFwicG9seWxpbmVcIiwgYXR0cik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogUGFwZXIucG9seWdvblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRHJhd3MgYSBwb2x5Z29uLiBTZWUgQFBhcGVyLnBvbHlsaW5lXG4gICAgXFwqL1xuICAgIHByb3RvLnBvbHlnb24gPSBmdW5jdGlvbiAocG9pbnRzKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcG9pbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICBpZiAoaXMocG9pbnRzLCBcIm9iamVjdFwiKSAmJiAhaXMocG9pbnRzLCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICBhdHRyID0gcG9pbnRzO1xuICAgICAgICB9IGVsc2UgaWYgKHBvaW50cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyID0ge3BvaW50czogcG9pbnRzfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lbChcInBvbHlnb25cIiwgYXR0cik7XG4gICAgfTtcbiAgICAvLyBncmFkaWVudHNcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJCA9IFNuYXAuXy4kO1xuICAgICAgICAvLyBncmFkaWVudHMnIGhlbHBlcnNcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBFbGVtZW50LnN0b3BzXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBPbmx5IGZvciBncmFkaWVudHMhXG4gICAgICAgICAqIFJldHVybnMgYXJyYXkgb2YgZ3JhZGllbnQgc3RvcHMgZWxlbWVudHMuXG4gICAgICAgICA9IChhcnJheSkgdGhlIHN0b3BzIGFycmF5LlxuICAgICAgICBcXCovXG4gICAgICAgIGZ1bmN0aW9uIEdzdG9wcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdEFsbChcInN0b3BcIik7XG4gICAgICAgIH1cbiAgICAgICAgLypcXFxuICAgICAgICAgKiBFbGVtZW50LmFkZFN0b3BcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIE9ubHkgZm9yIGdyYWRpZW50cyFcbiAgICAgICAgICogQWRkcyBhbm90aGVyIHN0b3AgdG8gdGhlIGdyYWRpZW50LlxuICAgICAgICAgLSBjb2xvciAoc3RyaW5nKSBzdG9wcyBjb2xvclxuICAgICAgICAgLSBvZmZzZXQgKG51bWJlcikgc3RvcHMgb2Zmc2V0IDAuLjEwMFxuICAgICAgICAgPSAob2JqZWN0KSBncmFkaWVudCBlbGVtZW50XG4gICAgICAgIFxcKi9cbiAgICAgICAgZnVuY3Rpb24gR2FkZFN0b3AoY29sb3IsIG9mZnNldCkge1xuICAgICAgICAgICAgdmFyIHN0b3AgPSAkKFwic3RvcFwiKSxcbiAgICAgICAgICAgICAgICBhdHRyID0ge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6ICtvZmZzZXQgKyBcIiVcIlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb2xvciA9IFNuYXAuY29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYXR0cltcInN0b3AtY29sb3JcIl0gPSBjb2xvci5oZXg7XG4gICAgICAgICAgICBpZiAoY29sb3Iub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgICAgICBhdHRyW1wic3RvcC1vcGFjaXR5XCJdID0gY29sb3Iub3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoc3RvcCwgYXR0cik7XG4gICAgICAgICAgICB2YXIgc3RvcHMgPSB0aGlzLnN0b3BzKCksXG4gICAgICAgICAgICAgICAgaW5zZXJ0ZWQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0b3BPZmZzZXQgPSBwYXJzZUZsb2F0KHN0b3BzW2ldLmF0dHIoXCJvZmZzZXRcIikpO1xuICAgICAgICAgICAgICAgIGlmIChzdG9wT2Zmc2V0ID4gb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5pbnNlcnRCZWZvcmUoc3RvcCwgc3RvcHNbaV0ubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGluc2VydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpbnNlcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChzdG9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIEdnZXRCQm94KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBcImxpbmVhckdyYWRpZW50XCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSAkKHRoaXMubm9kZSwgXCJ4MVwiKSB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB4MiA9ICQodGhpcy5ub2RlLCBcIngyXCIpIHx8IDEsXG4gICAgICAgICAgICAgICAgICAgIHkxID0gJCh0aGlzLm5vZGUsIFwieTFcIikgfHwgMCxcbiAgICAgICAgICAgICAgICAgICAgeTIgPSAkKHRoaXMubm9kZSwgXCJ5MlwiKSB8fCAwO1xuICAgICAgICAgICAgICAgIHJldHVybiBTbmFwLl8uYm94KHgxLCB5MSwgbWF0aC5hYnMoeDIgLSB4MSksIG1hdGguYWJzKHkyIC0geTEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGN4ID0gdGhpcy5ub2RlLmN4IHx8IC41LFxuICAgICAgICAgICAgICAgICAgICBjeSA9IHRoaXMubm9kZS5jeSB8fCAuNSxcbiAgICAgICAgICAgICAgICAgICAgciA9IHRoaXMubm9kZS5yIHx8IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNuYXAuXy5ib3goY3ggLSByLCBjeSAtIHIsIHIgKiAyLCByICogMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLypcXFxuICAgICAgICAgKiBFbGVtZW50LnNldFN0b3BzXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBPbmx5IGZvciBncmFkaWVudHMhXG4gICAgICAgICAqIFVwZGF0ZXMgc3RvcHMgb2YgdGhlIGdyYWRpZW50IGJhc2VkIG9uIHBhc3NlZCBncmFkaWVudCBkZXNjcmlwdG9yLiBTZWUgQFBwYWVyLmdyYWRpZW50XG4gICAgICAgICAtIHN0ciAoc3RyaW5nKSBncmFkaWVudCBkZXNjcmlwdG9yIHBhcnQgYWZ0ZXIgYCgpYC5cbiAgICAgICAgID0gKG9iamVjdCkgZ3JhZGllbnQgZWxlbWVudFxuICAgICAgICAgfCB2YXIgZyA9IHBhcGVyLmdyYWRpZW50KFwibCgwLCAwLCAxLCAxKSMwMDAtI2YwMC0jZmZmXCIpO1xuICAgICAgICAgfCBnLnNldFN0b3BzKFwiI2ZmZi0jMDAwLSNmMDAtI2ZjMFwiKTtcbiAgICAgICAgXFwqL1xuICAgICAgICBmdW5jdGlvbiBHc2V0U3RvcHMoc3RyKSB7XG4gICAgICAgICAgICB2YXIgZ3JhZCA9IHN0cixcbiAgICAgICAgICAgICAgICBzdG9wcyA9IHRoaXMuc3RvcHMoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RyID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBncmFkID0gZXZlKFwic25hcC51dGlsLmdyYWQucGFyc2VcIiwgbnVsbCwgXCJsKDAsMCwwLDEpXCIgKyBzdHIpLmZpcnN0RGVmaW5lZCgpLnN0b3BzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFTbmFwLmlzKGdyYWQsIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0b3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyYWRbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gU25hcC5jb2xvcihncmFkW2ldLmNvbG9yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgPSB7XCJvZmZzZXRcIjogZ3JhZFtpXS5vZmZzZXQgKyBcIiVcIn07XG4gICAgICAgICAgICAgICAgICAgIGF0dHJbXCJzdG9wLWNvbG9yXCJdID0gY29sb3IuaGV4O1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3Iub3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJbXCJzdG9wLW9wYWNpdHlcIl0gPSBjb2xvci5vcGFjaXR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0b3BzW2ldLmF0dHIoYXR0cik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcHNbaV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gc3RvcHMubGVuZ3RoOyBpIDwgZ3JhZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3RvcChncmFkW2ldLmNvbG9yLCBncmFkW2ldLm9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBncmFkaWVudChkZWZzLCBzdHIpIHtcbiAgICAgICAgICAgIHZhciBncmFkID0gZXZlKFwic25hcC51dGlsLmdyYWQucGFyc2VcIiwgbnVsbCwgc3RyKS5maXJzdERlZmluZWQoKSxcbiAgICAgICAgICAgICAgICBlbDtcbiAgICAgICAgICAgIGlmICghZ3JhZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JhZC5wYXJhbXMudW5zaGlmdChkZWZzKTtcbiAgICAgICAgICAgIGlmIChncmFkLnR5cGUudG9Mb3dlckNhc2UoKSA9PSBcImxcIikge1xuICAgICAgICAgICAgICAgIGVsID0gZ3JhZGllbnRMaW5lYXIuYXBwbHkoMCwgZ3JhZC5wYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbCA9IGdyYWRpZW50UmFkaWFsLmFwcGx5KDAsIGdyYWQucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChncmFkLnR5cGUgIT0gZ3JhZC50eXBlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAkKGVsLm5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnRVbml0czogXCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc3RvcHMgPSBncmFkLnN0b3BzLFxuICAgICAgICAgICAgICAgIGxlbiA9IHN0b3BzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RvcCA9IHN0b3BzW2ldO1xuICAgICAgICAgICAgICAgIGVsLmFkZFN0b3Aoc3RvcC5jb2xvciwgc3RvcC5vZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdyYWRpZW50TGluZWFyKGRlZnMsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBTbmFwLl8ubWFrZShcImxpbmVhckdyYWRpZW50XCIsIGRlZnMpO1xuICAgICAgICAgICAgZWwuc3RvcHMgPSBHc3RvcHM7XG4gICAgICAgICAgICBlbC5hZGRTdG9wID0gR2FkZFN0b3A7XG4gICAgICAgICAgICBlbC5nZXRCQm94ID0gR2dldEJCb3g7XG4gICAgICAgICAgICBlbC5zZXRTdG9wcyA9IEdzZXRTdG9wcztcbiAgICAgICAgICAgIGlmICh4MSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJChlbC5ub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgIHgxOiB4MSxcbiAgICAgICAgICAgICAgICAgICAgeTE6IHkxLFxuICAgICAgICAgICAgICAgICAgICB4MjogeDIsXG4gICAgICAgICAgICAgICAgICAgIHkyOiB5MlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdyYWRpZW50UmFkaWFsKGRlZnMsIGN4LCBjeSwgciwgZngsIGZ5KSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBTbmFwLl8ubWFrZShcInJhZGlhbEdyYWRpZW50XCIsIGRlZnMpO1xuICAgICAgICAgICAgZWwuc3RvcHMgPSBHc3RvcHM7XG4gICAgICAgICAgICBlbC5hZGRTdG9wID0gR2FkZFN0b3A7XG4gICAgICAgICAgICBlbC5nZXRCQm94ID0gR2dldEJCb3g7XG4gICAgICAgICAgICBpZiAoY3ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICQoZWwubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICBjeDogY3gsXG4gICAgICAgICAgICAgICAgICAgIGN5OiBjeSxcbiAgICAgICAgICAgICAgICAgICAgcjogclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZ4ICE9IG51bGwgJiYgZnkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICQoZWwubm9kZSwge1xuICAgICAgICAgICAgICAgICAgICBmeDogZngsXG4gICAgICAgICAgICAgICAgICAgIGZ5OiBmeVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogUGFwZXIuZ3JhZGllbnRcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBncmFkaWVudCBlbGVtZW50XG4gICAgICAgICAqKlxuICAgICAgICAgLSBncmFkaWVudCAoc3RyaW5nKSBncmFkaWVudCBkZXNjcmlwdG9yXG4gICAgICAgICA+IEdyYWRpZW50IERlc2NyaXB0b3JcbiAgICAgICAgICogVGhlIGdyYWRpZW50IGRlc2NyaXB0b3IgaXMgYW4gZXhwcmVzc2lvbiBmb3JtYXR0ZWQgYXNcbiAgICAgICAgICogZm9sbG93czogYDx0eXBlPig8Y29vcmRzPik8Y29sb3JzPmAuICBUaGUgYDx0eXBlPmAgY2FuIGJlXG4gICAgICAgICAqIGVpdGhlciBsaW5lYXIgb3IgcmFkaWFsLiAgVGhlIHVwcGVyY2FzZSBgTGAgb3IgYFJgIGxldHRlcnNcbiAgICAgICAgICogaW5kaWNhdGUgYWJzb2x1dGUgY29vcmRpbmF0ZXMgb2Zmc2V0IGZyb20gdGhlIFNWRyBzdXJmYWNlLlxuICAgICAgICAgKiBMb3dlcmNhc2UgYGxgIG9yIGByYCBsZXR0ZXJzIGluZGljYXRlIGNvb3JkaW5hdGVzXG4gICAgICAgICAqIGNhbGN1bGF0ZWQgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGdyYWRpZW50IGlzXG4gICAgICAgICAqIGFwcGxpZWQuICBDb29yZGluYXRlcyBzcGVjaWZ5IGEgbGluZWFyIGdyYWRpZW50IHZlY3RvciBhc1xuICAgICAgICAgKiBgeDFgLCBgeTFgLCBgeDJgLCBgeTJgLCBvciBhIHJhZGlhbCBncmFkaWVudCBhcyBgY3hgLCBgY3lgLFxuICAgICAgICAgKiBgcmAgYW5kIG9wdGlvbmFsIGBmeGAsIGBmeWAgc3BlY2lmeWluZyBhIGZvY2FsIHBvaW50IGF3YXlcbiAgICAgICAgICogZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUuIFNwZWNpZnkgYDxjb2xvcnM+YCBhcyBhIGxpc3RcbiAgICAgICAgICogb2YgZGFzaC1zZXBhcmF0ZWQgQ1NTIGNvbG9yIHZhbHVlcy4gIEVhY2ggY29sb3IgbWF5IGJlXG4gICAgICAgICAqIGZvbGxvd2VkIGJ5IGEgY3VzdG9tIG9mZnNldCB2YWx1ZSwgc2VwYXJhdGVkIHdpdGggYSBjb2xvblxuICAgICAgICAgKiBjaGFyYWN0ZXIuXG4gICAgICAgICA+IEV4YW1wbGVzXG4gICAgICAgICAqIExpbmVhciBncmFkaWVudCwgcmVsYXRpdmUgZnJvbSB0b3AtbGVmdCBjb3JuZXIgdG8gYm90dG9tLXJpZ2h0XG4gICAgICAgICAqIGNvcm5lciwgZnJvbSBibGFjayB0aHJvdWdoIHJlZCB0byB3aGl0ZTpcbiAgICAgICAgIHwgdmFyIGcgPSBwYXBlci5ncmFkaWVudChcImwoMCwgMCwgMSwgMSkjMDAwLSNmMDAtI2ZmZlwiKTtcbiAgICAgICAgICogTGluZWFyIGdyYWRpZW50LCBhYnNvbHV0ZSBmcm9tICgwLCAwKSB0byAoMTAwLCAxMDApLCBmcm9tIGJsYWNrXG4gICAgICAgICAqIHRocm91Z2ggcmVkIGF0IDI1JSB0byB3aGl0ZTpcbiAgICAgICAgIHwgdmFyIGcgPSBwYXBlci5ncmFkaWVudChcIkwoMCwgMCwgMTAwLCAxMDApIzAwMC0jZjAwOjI1LSNmZmZcIik7XG4gICAgICAgICAqIFJhZGlhbCBncmFkaWVudCwgcmVsYXRpdmUgZnJvbSB0aGUgY2VudGVyIG9mIHRoZSBlbGVtZW50IHdpdGggcmFkaXVzXG4gICAgICAgICAqIGhhbGYgdGhlIHdpZHRoLCBmcm9tIGJsYWNrIHRvIHdoaXRlOlxuICAgICAgICAgfCB2YXIgZyA9IHBhcGVyLmdyYWRpZW50KFwicigwLjUsIDAuNSwgMC41KSMwMDAtI2ZmZlwiKTtcbiAgICAgICAgICogVG8gYXBwbHkgdGhlIGdyYWRpZW50OlxuICAgICAgICAgfCBwYXBlci5jaXJjbGUoNTAsIDUwLCA0MCkuYXR0cih7XG4gICAgICAgICB8ICAgICBmaWxsOiBnXG4gICAgICAgICB8IH0pO1xuICAgICAgICAgPSAob2JqZWN0KSB0aGUgYGdyYWRpZW50YCBlbGVtZW50XG4gICAgICAgIFxcKi9cbiAgICAgICAgcHJvdG8uZ3JhZGllbnQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JhZGllbnQodGhpcy5kZWZzLCBzdHIpO1xuICAgICAgICB9O1xuICAgICAgICBwcm90by5ncmFkaWVudExpbmVhciA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICAgICAgcmV0dXJuIGdyYWRpZW50TGluZWFyKHRoaXMuZGVmcywgeDEsIHkxLCB4MiwgeTIpO1xuICAgICAgICB9O1xuICAgICAgICBwcm90by5ncmFkaWVudFJhZGlhbCA9IGZ1bmN0aW9uIChjeCwgY3ksIHIsIGZ4LCBmeSkge1xuICAgICAgICAgICAgcmV0dXJuIGdyYWRpZW50UmFkaWFsKHRoaXMuZGVmcywgY3gsIGN5LCByLCBmeCwgZnkpO1xuICAgICAgICB9O1xuICAgICAgICAvKlxcXG4gICAgICAgICAqIFBhcGVyLnRvU3RyaW5nXG4gICAgICAgICBbIG1ldGhvZCBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBSZXR1cm5zIFNWRyBjb2RlIGZvciB0aGUgQFBhcGVyXG4gICAgICAgICA9IChzdHJpbmcpIFNWRyBjb2RlIGZvciB0aGUgQFBhcGVyXG4gICAgICAgIFxcKi9cbiAgICAgICAgcHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZG9jID0gdGhpcy5ub2RlLm93bmVyRG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgZiA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgICAgICAgICAgZCA9IGRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICAgICAgICAgIHN2ZyA9IHRoaXMubm9kZS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICAgICAgcmVzO1xuICAgICAgICAgICAgZi5hcHBlbmRDaGlsZChkKTtcbiAgICAgICAgICAgIGQuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICAgICAgICAgIFNuYXAuXy4kKHN2Zywge3htbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJ9KTtcbiAgICAgICAgICAgIHJlcyA9IGQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgZi5yZW1vdmVDaGlsZChmLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICAgICAgLypcXFxuICAgICAgICAgKiBQYXBlci50b0RhdGFVUkxcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJldHVybnMgU1ZHIGNvZGUgZm9yIHRoZSBAUGFwZXIgYXMgRGF0YSBVUkkgc3RyaW5nLlxuICAgICAgICAgPSAoc3RyaW5nKSBEYXRhIFVSSSBzdHJpbmdcbiAgICAgICAgXFwqL1xuICAgICAgICBwcm90by50b0RhdGFVUkwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5idG9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qXFxcbiAgICAgICAgICogUGFwZXIuY2xlYXJcbiAgICAgICAgIFsgbWV0aG9kIF1cbiAgICAgICAgICoqXG4gICAgICAgICAqIFJlbW92ZXMgYWxsIGNoaWxkIG5vZGVzIG9mIHRoZSBwYXBlciwgZXhjZXB0IDxkZWZzPi5cbiAgICAgICAgXFwqL1xuICAgICAgICBwcm90by5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgbmV4dDtcbiAgICAgICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudGFnTmFtZSAhPSBcImRlZnNcIikge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG8uY2xlYXIuY2FsbCh7bm9kZTogbm9kZX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KCkpO1xufSk7XG5cbi8vIENvcHlyaWdodCAoYykgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblNuYXAucGx1Z2luKGZ1bmN0aW9uIChTbmFwLCBFbGVtZW50LCBQYXBlciwgZ2xvYikge1xuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIGlzID0gU25hcC5pcyxcbiAgICAgICAgY2xvbmUgPSBTbmFwLl8uY2xvbmUsXG4gICAgICAgIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIixcbiAgICAgICAgcDJzID0gLyw/KFthLXpdKSw/L2dpLFxuICAgICAgICB0b0Zsb2F0ID0gcGFyc2VGbG9hdCxcbiAgICAgICAgbWF0aCA9IE1hdGgsXG4gICAgICAgIFBJID0gbWF0aC5QSSxcbiAgICAgICAgbW1pbiA9IG1hdGgubWluLFxuICAgICAgICBtbWF4ID0gbWF0aC5tYXgsXG4gICAgICAgIHBvdyA9IG1hdGgucG93LFxuICAgICAgICBhYnMgPSBtYXRoLmFicztcbiAgICBmdW5jdGlvbiBwYXRocyhwcykge1xuICAgICAgICB2YXIgcCA9IHBhdGhzLnBzID0gcGF0aHMucHMgfHwge307XG4gICAgICAgIGlmIChwW3BzXSkge1xuICAgICAgICAgICAgcFtwc10uc2xlZXAgPSAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwW3BzXSA9IHtcbiAgICAgICAgICAgICAgICBzbGVlcDogMTAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHApIGlmIChwW2hhc10oa2V5KSAmJiBrZXkgIT0gcHMpIHtcbiAgICAgICAgICAgICAgICBwW2tleV0uc2xlZXAtLTtcbiAgICAgICAgICAgICAgICAhcFtrZXldLnNsZWVwICYmIGRlbGV0ZSBwW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcFtwc107XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJveCh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHtcbiAgICAgICAgICAgIHggPSB5ID0gd2lkdGggPSBoZWlnaHQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHkgPSB4Lnk7XG4gICAgICAgICAgICB3aWR0aCA9IHgud2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSB4LmhlaWdodDtcbiAgICAgICAgICAgIHggPSB4Lng7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgdzogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgIGg6IGhlaWdodCxcbiAgICAgICAgICAgIHgyOiB4ICsgd2lkdGgsXG4gICAgICAgICAgICB5MjogeSArIGhlaWdodCxcbiAgICAgICAgICAgIGN4OiB4ICsgd2lkdGggLyAyLFxuICAgICAgICAgICAgY3k6IHkgKyBoZWlnaHQgLyAyLFxuICAgICAgICAgICAgcjE6IG1hdGgubWluKHdpZHRoLCBoZWlnaHQpIC8gMixcbiAgICAgICAgICAgIHIyOiBtYXRoLm1heCh3aWR0aCwgaGVpZ2h0KSAvIDIsXG4gICAgICAgICAgICByMDogbWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpIC8gMixcbiAgICAgICAgICAgIHBhdGg6IHJlY3RQYXRoKHgsIHksIHdpZHRoLCBoZWlnaHQpLFxuICAgICAgICAgICAgdmI6IFt4LCB5LCB3aWR0aCwgaGVpZ2h0XS5qb2luKFwiIFwiKVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuam9pbihcIixcIikucmVwbGFjZShwMnMsIFwiJDFcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhdGhDbG9uZShwYXRoQXJyYXkpIHtcbiAgICAgICAgdmFyIHJlcyA9IGNsb25lKHBhdGhBcnJheSk7XG4gICAgICAgIHJlcy50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRQb2ludEF0U2VnbWVudExlbmd0aChwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeSwgbGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGJlemxlbihwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmluZERvdHNBdFNlZ21lbnQocDF4LCBwMXksIGMxeCwgYzF5LCBjMngsIGMyeSwgcDJ4LCBwMnksXG4gICAgICAgICAgICAgICAgZ2V0VG90TGVuKHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5LCBsZW5ndGgpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRMZW5ndGhGYWN0b3J5KGlzdG90YWwsIHN1YnBhdGgpIHtcbiAgICAgICAgZnVuY3Rpb24gTyh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiArKCt2YWwpLnRvRml4ZWQoMyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNuYXAuXy5jYWNoZXIoZnVuY3Rpb24gKHBhdGgsIGxlbmd0aCwgb25seXN0YXJ0KSB7XG4gICAgICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5hdHRyKFwiZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhdGggPSBwYXRoMmN1cnZlKHBhdGgpO1xuICAgICAgICAgICAgdmFyIHgsIHksIHAsIGwsIHNwID0gXCJcIiwgc3VicGF0aHMgPSB7fSwgcG9pbnQsXG4gICAgICAgICAgICAgICAgbGVuID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBhdGgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIHAgPSBwYXRoW2ldO1xuICAgICAgICAgICAgICAgIGlmIChwWzBdID09IFwiTVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSArcFsxXTtcbiAgICAgICAgICAgICAgICAgICAgeSA9ICtwWzJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGwgPSBnZXRQb2ludEF0U2VnbWVudExlbmd0aCh4LCB5LCBwWzFdLCBwWzJdLCBwWzNdLCBwWzRdLCBwWzVdLCBwWzZdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiArIGwgPiBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJwYXRoICYmICFzdWJwYXRocy5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ID0gZ2V0UG9pbnRBdFNlZ21lbnRMZW5ndGgoeCwgeSwgcFsxXSwgcFsyXSwgcFszXSwgcFs0XSwgcFs1XSwgcFs2XSwgbGVuZ3RoIC0gbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcCArPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ1wiICsgTyhwb2ludC5zdGFydC54KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC5zdGFydC55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC5tLngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50Lm0ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQueCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQueSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbmx5c3RhcnQpIHtyZXR1cm4gc3A7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnBhdGhzLnN0YXJ0ID0gc3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3AgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTVwiICsgTyhwb2ludC54KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwb2ludC55KSArIFwiQ1wiICsgTyhwb2ludC5uLngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50Lm4ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE8ocG9pbnQuZW5kLngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPKHBvaW50LmVuZC55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwWzVdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTyhwWzZdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbiArPSBsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSArcFs1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID0gK3BbNl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzdG90YWwgJiYgIXN1YnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludCA9IGdldFBvaW50QXRTZWdtZW50TGVuZ3RoKHgsIHksIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0sIHBbNl0sIGxlbmd0aCAtIGxlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxlbiArPSBsO1xuICAgICAgICAgICAgICAgICAgICB4ID0gK3BbNV07XG4gICAgICAgICAgICAgICAgICAgIHkgPSArcFs2XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3AgKz0gcC5zaGlmdCgpICsgcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnBhdGhzLmVuZCA9IHNwO1xuICAgICAgICAgICAgcG9pbnQgPSBpc3RvdGFsID8gbGVuIDogc3VicGF0aCA/IHN1YnBhdGhzIDogZmluZERvdHNBdFNlZ21lbnQoeCwgeSwgcFswXSwgcFsxXSwgcFsyXSwgcFszXSwgcFs0XSwgcFs1XSwgMSk7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgIH0sIG51bGwsIFNuYXAuXy5jbG9uZSk7XG4gICAgfVxuICAgIHZhciBnZXRUb3RhbExlbmd0aCA9IGdldExlbmd0aEZhY3RvcnkoMSksXG4gICAgICAgIGdldFBvaW50QXRMZW5ndGggPSBnZXRMZW5ndGhGYWN0b3J5KCksXG4gICAgICAgIGdldFN1YnBhdGhzQXRMZW5ndGggPSBnZXRMZW5ndGhGYWN0b3J5KDAsIDEpO1xuICAgIGZ1bmN0aW9uIGZpbmREb3RzQXRTZWdtZW50KHAxeCwgcDF5LCBjMXgsIGMxeSwgYzJ4LCBjMnksIHAyeCwgcDJ5LCB0KSB7XG4gICAgICAgIHZhciB0MSA9IDEgLSB0LFxuICAgICAgICAgICAgdDEzID0gcG93KHQxLCAzKSxcbiAgICAgICAgICAgIHQxMiA9IHBvdyh0MSwgMiksXG4gICAgICAgICAgICB0MiA9IHQgKiB0LFxuICAgICAgICAgICAgdDMgPSB0MiAqIHQsXG4gICAgICAgICAgICB4ID0gdDEzICogcDF4ICsgdDEyICogMyAqIHQgKiBjMXggKyB0MSAqIDMgKiB0ICogdCAqIGMyeCArIHQzICogcDJ4LFxuICAgICAgICAgICAgeSA9IHQxMyAqIHAxeSArIHQxMiAqIDMgKiB0ICogYzF5ICsgdDEgKiAzICogdCAqIHQgKiBjMnkgKyB0MyAqIHAyeSxcbiAgICAgICAgICAgIG14ID0gcDF4ICsgMiAqIHQgKiAoYzF4IC0gcDF4KSArIHQyICogKGMyeCAtIDIgKiBjMXggKyBwMXgpLFxuICAgICAgICAgICAgbXkgPSBwMXkgKyAyICogdCAqIChjMXkgLSBwMXkpICsgdDIgKiAoYzJ5IC0gMiAqIGMxeSArIHAxeSksXG4gICAgICAgICAgICBueCA9IGMxeCArIDIgKiB0ICogKGMyeCAtIGMxeCkgKyB0MiAqIChwMnggLSAyICogYzJ4ICsgYzF4KSxcbiAgICAgICAgICAgIG55ID0gYzF5ICsgMiAqIHQgKiAoYzJ5IC0gYzF5KSArIHQyICogKHAyeSAtIDIgKiBjMnkgKyBjMXkpLFxuICAgICAgICAgICAgYXggPSB0MSAqIHAxeCArIHQgKiBjMXgsXG4gICAgICAgICAgICBheSA9IHQxICogcDF5ICsgdCAqIGMxeSxcbiAgICAgICAgICAgIGN4ID0gdDEgKiBjMnggKyB0ICogcDJ4LFxuICAgICAgICAgICAgY3kgPSB0MSAqIGMyeSArIHQgKiBwMnksXG4gICAgICAgICAgICBhbHBoYSA9IDkwIC0gbWF0aC5hdGFuMihteCAtIG54LCBteSAtIG55KSAqIDE4MCAvIFBJO1xuICAgICAgICAvLyAobXggPiBueCB8fCBteSA8IG55KSAmJiAoYWxwaGEgKz0gMTgwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgbToge3g6IG14LCB5OiBteX0sXG4gICAgICAgICAgICBuOiB7eDogbngsIHk6IG55fSxcbiAgICAgICAgICAgIHN0YXJ0OiB7eDogYXgsIHk6IGF5fSxcbiAgICAgICAgICAgIGVuZDoge3g6IGN4LCB5OiBjeX0sXG4gICAgICAgICAgICBhbHBoYTogYWxwaGFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYmV6aWVyQkJveChwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeSkge1xuICAgICAgICBpZiAoIVNuYXAuaXMocDF4LCBcImFycmF5XCIpKSB7XG4gICAgICAgICAgICBwMXggPSBbcDF4LCBwMXksIGMxeCwgYzF5LCBjMngsIGMyeSwgcDJ4LCBwMnldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBiYm94ID0gY3VydmVEaW0uYXBwbHkobnVsbCwgcDF4KTtcbiAgICAgICAgcmV0dXJuIGJveChcbiAgICAgICAgICAgIGJib3gubWluLngsXG4gICAgICAgICAgICBiYm94Lm1pbi55LFxuICAgICAgICAgICAgYmJveC5tYXgueCAtIGJib3gubWluLngsXG4gICAgICAgICAgICBiYm94Lm1heC55IC0gYmJveC5taW4ueVxuICAgICAgICApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1BvaW50SW5zaWRlQkJveChiYm94LCB4LCB5KSB7XG4gICAgICAgIHJldHVybiAgeCA+PSBiYm94LnggJiZcbiAgICAgICAgICAgICAgICB4IDw9IGJib3gueCArIGJib3gud2lkdGggJiZcbiAgICAgICAgICAgICAgICB5ID49IGJib3gueSAmJlxuICAgICAgICAgICAgICAgIHkgPD0gYmJveC55ICsgYmJveC5oZWlnaHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzQkJveEludGVyc2VjdChiYm94MSwgYmJveDIpIHtcbiAgICAgICAgYmJveDEgPSBib3goYmJveDEpO1xuICAgICAgICBiYm94MiA9IGJveChiYm94Mik7XG4gICAgICAgIHJldHVybiBpc1BvaW50SW5zaWRlQkJveChiYm94MiwgYmJveDEueCwgYmJveDEueSlcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gyLCBiYm94MS54MiwgYmJveDEueSlcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gyLCBiYm94MS54LCBiYm94MS55MilcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gyLCBiYm94MS54MiwgYmJveDEueTIpXG4gICAgICAgICAgICB8fCBpc1BvaW50SW5zaWRlQkJveChiYm94MSwgYmJveDIueCwgYmJveDIueSlcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gxLCBiYm94Mi54MiwgYmJveDIueSlcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gxLCBiYm94Mi54LCBiYm94Mi55MilcbiAgICAgICAgICAgIHx8IGlzUG9pbnRJbnNpZGVCQm94KGJib3gxLCBiYm94Mi54MiwgYmJveDIueTIpXG4gICAgICAgICAgICB8fCAoYmJveDEueCA8IGJib3gyLngyICYmIGJib3gxLnggPiBiYm94Mi54XG4gICAgICAgICAgICAgICAgfHwgYmJveDIueCA8IGJib3gxLngyICYmIGJib3gyLnggPiBiYm94MS54KVxuICAgICAgICAgICAgJiYgKGJib3gxLnkgPCBiYm94Mi55MiAmJiBiYm94MS55ID4gYmJveDIueVxuICAgICAgICAgICAgICAgIHx8IGJib3gyLnkgPCBiYm94MS55MiAmJiBiYm94Mi55ID4gYmJveDEueSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJhc2UzKHQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgIHZhciB0MSA9IC0zICogcDEgKyA5ICogcDIgLSA5ICogcDMgKyAzICogcDQsXG4gICAgICAgICAgICB0MiA9IHQgKiB0MSArIDYgKiBwMSAtIDEyICogcDIgKyA2ICogcDM7XG4gICAgICAgIHJldHVybiB0ICogdDIgLSAzICogcDEgKyAzICogcDI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJlemxlbih4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQsIHopIHtcbiAgICAgICAgaWYgKHogPT0gbnVsbCkge1xuICAgICAgICAgICAgeiA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgeiA9IHogPiAxID8gMSA6IHogPCAwID8gMCA6IHo7XG4gICAgICAgIHZhciB6MiA9IHogLyAyLFxuICAgICAgICAgICAgbiA9IDEyLFxuICAgICAgICAgICAgVHZhbHVlcyA9IFstLjEyNTIsLjEyNTIsLS4zNjc4LC4zNjc4LC0uNTg3MywuNTg3MywtLjc2OTksLjc2OTksLS45MDQxLC45MDQxLC0uOTgxNiwuOTgxNl0sXG4gICAgICAgICAgICBDdmFsdWVzID0gWzAuMjQ5MSwwLjI0OTEsMC4yMzM1LDAuMjMzNSwwLjIwMzIsMC4yMDMyLDAuMTYwMSwwLjE2MDEsMC4xMDY5LDAuMTA2OSwwLjA0NzIsMC4wNDcyXSxcbiAgICAgICAgICAgIHN1bSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3QgPSB6MiAqIFR2YWx1ZXNbaV0gKyB6MixcbiAgICAgICAgICAgICAgICB4YmFzZSA9IGJhc2UzKGN0LCB4MSwgeDIsIHgzLCB4NCksXG4gICAgICAgICAgICAgICAgeWJhc2UgPSBiYXNlMyhjdCwgeTEsIHkyLCB5MywgeTQpLFxuICAgICAgICAgICAgICAgIGNvbWIgPSB4YmFzZSAqIHhiYXNlICsgeWJhc2UgKiB5YmFzZTtcbiAgICAgICAgICAgIHN1bSArPSBDdmFsdWVzW2ldICogbWF0aC5zcXJ0KGNvbWIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB6MiAqIHN1bTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VG90TGVuKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgbGwpIHtcbiAgICAgICAgaWYgKGxsIDwgMCB8fCBiZXpsZW4oeDEsIHkxLCB4MiwgeTIsIHgzLCB5MywgeDQsIHk0KSA8IGxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHQgPSAxLFxuICAgICAgICAgICAgc3RlcCA9IHQgLyAyLFxuICAgICAgICAgICAgdDIgPSB0IC0gc3RlcCxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBlID0gLjAxO1xuICAgICAgICBsID0gYmV6bGVuKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgdDIpO1xuICAgICAgICB3aGlsZSAoYWJzKGwgLSBsbCkgPiBlKSB7XG4gICAgICAgICAgICBzdGVwIC89IDI7XG4gICAgICAgICAgICB0MiArPSAobCA8IGxsID8gMSA6IC0xKSAqIHN0ZXA7XG4gICAgICAgICAgICBsID0gYmV6bGVuKHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCwgdDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0MjtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW50ZXJzZWN0KHgxLCB5MSwgeDIsIHkyLCB4MywgeTMsIHg0LCB5NCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBtbWF4KHgxLCB4MikgPCBtbWluKHgzLCB4NCkgfHxcbiAgICAgICAgICAgIG1taW4oeDEsIHgyKSA+IG1tYXgoeDMsIHg0KSB8fFxuICAgICAgICAgICAgbW1heCh5MSwgeTIpIDwgbW1pbih5MywgeTQpIHx8XG4gICAgICAgICAgICBtbWluKHkxLCB5MikgPiBtbWF4KHkzLCB5NClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG54ID0gKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCksXG4gICAgICAgICAgICBueSA9ICh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpLFxuICAgICAgICAgICAgZGVub21pbmF0b3IgPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XG5cbiAgICAgICAgaWYgKCFkZW5vbWluYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBweCA9IG54IC8gZGVub21pbmF0b3IsXG4gICAgICAgICAgICBweSA9IG55IC8gZGVub21pbmF0b3IsXG4gICAgICAgICAgICBweDIgPSArcHgudG9GaXhlZCgyKSxcbiAgICAgICAgICAgIHB5MiA9ICtweS50b0ZpeGVkKDIpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBweDIgPCArbW1pbih4MSwgeDIpLnRvRml4ZWQoMikgfHxcbiAgICAgICAgICAgIHB4MiA+ICttbWF4KHgxLCB4MikudG9GaXhlZCgyKSB8fFxuICAgICAgICAgICAgcHgyIDwgK21taW4oeDMsIHg0KS50b0ZpeGVkKDIpIHx8XG4gICAgICAgICAgICBweDIgPiArbW1heCh4MywgeDQpLnRvRml4ZWQoMikgfHxcbiAgICAgICAgICAgIHB5MiA8ICttbWluKHkxLCB5MikudG9GaXhlZCgyKSB8fFxuICAgICAgICAgICAgcHkyID4gK21tYXgoeTEsIHkyKS50b0ZpeGVkKDIpIHx8XG4gICAgICAgICAgICBweTIgPCArbW1pbih5MywgeTQpLnRvRml4ZWQoMikgfHxcbiAgICAgICAgICAgIHB5MiA+ICttbWF4KHkzLCB5NCkudG9GaXhlZCgyKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3g6IHB4LCB5OiBweX07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludGVyKGJlejEsIGJlejIpIHtcbiAgICAgICAgcmV0dXJuIGludGVySGVscGVyKGJlejEsIGJlejIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbnRlckNvdW50KGJlejEsIGJlejIpIHtcbiAgICAgICAgcmV0dXJuIGludGVySGVscGVyKGJlejEsIGJlejIsIDEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbnRlckhlbHBlcihiZXoxLCBiZXoyLCBqdXN0Q291bnQpIHtcbiAgICAgICAgdmFyIGJib3gxID0gYmV6aWVyQkJveChiZXoxKSxcbiAgICAgICAgICAgIGJib3gyID0gYmV6aWVyQkJveChiZXoyKTtcbiAgICAgICAgaWYgKCFpc0JCb3hJbnRlcnNlY3QoYmJveDEsIGJib3gyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGp1c3RDb3VudCA/IDAgOiBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbDEgPSBiZXpsZW4uYXBwbHkoMCwgYmV6MSksXG4gICAgICAgICAgICBsMiA9IGJlemxlbi5hcHBseSgwLCBiZXoyKSxcbiAgICAgICAgICAgIG4xID0gfn4obDEgLyA4KSxcbiAgICAgICAgICAgIG4yID0gfn4obDIgLyA4KSxcbiAgICAgICAgICAgIGRvdHMxID0gW10sXG4gICAgICAgICAgICBkb3RzMiA9IFtdLFxuICAgICAgICAgICAgeHkgPSB7fSxcbiAgICAgICAgICAgIHJlcyA9IGp1c3RDb3VudCA/IDAgOiBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuMSArIDE7IGkrKykge1xuICAgICAgICAgICAgdmFyIHAgPSBmaW5kRG90c0F0U2VnbWVudC5hcHBseSgwLCBiZXoxLmNvbmNhdChpIC8gbjEpKTtcbiAgICAgICAgICAgIGRvdHMxLnB1c2goe3g6IHAueCwgeTogcC55LCB0OiBpIC8gbjF9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjIgKyAxOyBpKyspIHtcbiAgICAgICAgICAgIHAgPSBmaW5kRG90c0F0U2VnbWVudC5hcHBseSgwLCBiZXoyLmNvbmNhdChpIC8gbjIpKTtcbiAgICAgICAgICAgIGRvdHMyLnB1c2goe3g6IHAueCwgeTogcC55LCB0OiBpIC8gbjJ9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjE7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpID0gZG90czFbaV0sXG4gICAgICAgICAgICAgICAgICAgIGRpMSA9IGRvdHMxW2kgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgZGogPSBkb3RzMltqXSxcbiAgICAgICAgICAgICAgICAgICAgZGoxID0gZG90czJbaiArIDFdLFxuICAgICAgICAgICAgICAgICAgICBjaSA9IGFicyhkaTEueCAtIGRpLngpIDwgLjAwMSA/IFwieVwiIDogXCJ4XCIsXG4gICAgICAgICAgICAgICAgICAgIGNqID0gYWJzKGRqMS54IC0gZGoueCkgPCAuMDAxID8gXCJ5XCIgOiBcInhcIixcbiAgICAgICAgICAgICAgICAgICAgaXMgPSBpbnRlcnNlY3QoZGkueCwgZGkueSwgZGkxLngsIGRpMS55LCBkai54LCBkai55LCBkajEueCwgZGoxLnkpO1xuICAgICAgICAgICAgICAgIGlmIChpcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeHlbaXMueC50b0ZpeGVkKDQpXSA9PSBpcy55LnRvRml4ZWQoNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHh5W2lzLngudG9GaXhlZCg0KV0gPSBpcy55LnRvRml4ZWQoNCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0MSA9IGRpLnQgKyBhYnMoKGlzW2NpXSAtIGRpW2NpXSkgLyAoZGkxW2NpXSAtIGRpW2NpXSkpICogKGRpMS50IC0gZGkudCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0MiA9IGRqLnQgKyBhYnMoKGlzW2NqXSAtIGRqW2NqXSkgLyAoZGoxW2NqXSAtIGRqW2NqXSkpICogKGRqMS50IC0gZGoudCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0MSA+PSAwICYmIHQxIDw9IDEgJiYgdDIgPj0gMCAmJiB0MiA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanVzdENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogaXMueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogaXMueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdDE6IHQxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0MjogdDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXRoSW50ZXJzZWN0aW9uKHBhdGgxLCBwYXRoMikge1xuICAgICAgICByZXR1cm4gaW50ZXJQYXRoSGVscGVyKHBhdGgxLCBwYXRoMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhdGhJbnRlcnNlY3Rpb25OdW1iZXIocGF0aDEsIHBhdGgyKSB7XG4gICAgICAgIHJldHVybiBpbnRlclBhdGhIZWxwZXIocGF0aDEsIHBhdGgyLCAxKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW50ZXJQYXRoSGVscGVyKHBhdGgxLCBwYXRoMiwganVzdENvdW50KSB7XG4gICAgICAgIHBhdGgxID0gcGF0aDJjdXJ2ZShwYXRoMSk7XG4gICAgICAgIHBhdGgyID0gcGF0aDJjdXJ2ZShwYXRoMik7XG4gICAgICAgIHZhciB4MSwgeTEsIHgyLCB5MiwgeDFtLCB5MW0sIHgybSwgeTJtLCBiZXoxLCBiZXoyLFxuICAgICAgICAgICAgcmVzID0ganVzdENvdW50ID8gMCA6IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwYXRoMS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGkgPSBwYXRoMVtpXTtcbiAgICAgICAgICAgIGlmIChwaVswXSA9PSBcIk1cIikge1xuICAgICAgICAgICAgICAgIHgxID0geDFtID0gcGlbMV07XG4gICAgICAgICAgICAgICAgeTEgPSB5MW0gPSBwaVsyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHBpWzBdID09IFwiQ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGJlejEgPSBbeDEsIHkxXS5jb25jYXQocGkuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICB4MSA9IGJlejFbNl07XG4gICAgICAgICAgICAgICAgICAgIHkxID0gYmV6MVs3XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiZXoxID0gW3gxLCB5MSwgeDEsIHkxLCB4MW0sIHkxbSwgeDFtLCB5MW1dO1xuICAgICAgICAgICAgICAgICAgICB4MSA9IHgxbTtcbiAgICAgICAgICAgICAgICAgICAgeTEgPSB5MW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHBhdGgyLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBqID0gcGF0aDJbal07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwalswXSA9PSBcIk1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSB4Mm0gPSBwalsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0geTJtID0gcGpbMl07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGpbMF0gPT0gXCJDXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZXoyID0gW3gyLCB5Ml0uY29uY2F0KHBqLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGJlejJbNl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBiZXoyWzddO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZXoyID0gW3gyLCB5MiwgeDIsIHkyLCB4Mm0sIHkybSwgeDJtLCB5Mm1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgyID0geDJtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkyID0geTJtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludHIgPSBpbnRlckhlbHBlcihiZXoxLCBiZXoyLCBqdXN0Q291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGp1c3RDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSBpbnRyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMCwga2sgPSBpbnRyLmxlbmd0aDsgayA8IGtrOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50cltrXS5zZWdtZW50MSA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludHJba10uc2VnbWVudDIgPSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRyW2tdLmJlejEgPSBiZXoxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRyW2tdLmJlejIgPSBiZXoyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGludHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzUG9pbnRJbnNpZGVQYXRoKHBhdGgsIHgsIHkpIHtcbiAgICAgICAgdmFyIGJib3ggPSBwYXRoQkJveChwYXRoKTtcbiAgICAgICAgcmV0dXJuIGlzUG9pbnRJbnNpZGVCQm94KGJib3gsIHgsIHkpICYmXG4gICAgICAgICAgICAgICBpbnRlclBhdGhIZWxwZXIocGF0aCwgW1tcIk1cIiwgeCwgeV0sIFtcIkhcIiwgYmJveC54MiArIDEwXV0sIDEpICUgMiA9PSAxO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXRoQkJveChwYXRoKSB7XG4gICAgICAgIHZhciBwdGggPSBwYXRocyhwYXRoKTtcbiAgICAgICAgaWYgKHB0aC5iYm94KSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmUocHRoLmJib3gpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGJveCgpO1xuICAgICAgICB9XG4gICAgICAgIHBhdGggPSBwYXRoMmN1cnZlKHBhdGgpO1xuICAgICAgICB2YXIgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMCxcbiAgICAgICAgICAgIFggPSBbXSxcbiAgICAgICAgICAgIFkgPSBbXSxcbiAgICAgICAgICAgIHA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBhdGgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgcCA9IHBhdGhbaV07XG4gICAgICAgICAgICBpZiAocFswXSA9PSBcIk1cIikge1xuICAgICAgICAgICAgICAgIHggPSBwWzFdO1xuICAgICAgICAgICAgICAgIHkgPSBwWzJdO1xuICAgICAgICAgICAgICAgIFgucHVzaCh4KTtcbiAgICAgICAgICAgICAgICBZLnB1c2goeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkaW0gPSBjdXJ2ZURpbSh4LCB5LCBwWzFdLCBwWzJdLCBwWzNdLCBwWzRdLCBwWzVdLCBwWzZdKTtcbiAgICAgICAgICAgICAgICBYID0gWC5jb25jYXQoZGltLm1pbi54LCBkaW0ubWF4LngpO1xuICAgICAgICAgICAgICAgIFkgPSBZLmNvbmNhdChkaW0ubWluLnksIGRpbS5tYXgueSk7XG4gICAgICAgICAgICAgICAgeCA9IHBbNV07XG4gICAgICAgICAgICAgICAgeSA9IHBbNl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHhtaW4gPSBtbWluLmFwcGx5KDAsIFgpLFxuICAgICAgICAgICAgeW1pbiA9IG1taW4uYXBwbHkoMCwgWSksXG4gICAgICAgICAgICB4bWF4ID0gbW1heC5hcHBseSgwLCBYKSxcbiAgICAgICAgICAgIHltYXggPSBtbWF4LmFwcGx5KDAsIFkpLFxuICAgICAgICAgICAgYmIgPSBib3goeG1pbiwgeW1pbiwgeG1heCAtIHhtaW4sIHltYXggLSB5bWluKTtcbiAgICAgICAgcHRoLmJib3ggPSBjbG9uZShiYik7XG4gICAgICAgIHJldHVybiBiYjtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjdFBhdGgoeCwgeSwgdywgaCwgcikge1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBbXCJNXCIsICt4ICsgK3IsIHldLFxuICAgICAgICAgICAgICAgIFtcImxcIiwgdyAtIHIgKiAyLCAwXSxcbiAgICAgICAgICAgICAgICBbXCJhXCIsIHIsIHIsIDAsIDAsIDEsIHIsIHJdLFxuICAgICAgICAgICAgICAgIFtcImxcIiwgMCwgaCAtIHIgKiAyXSxcbiAgICAgICAgICAgICAgICBbXCJhXCIsIHIsIHIsIDAsIDAsIDEsIC1yLCByXSxcbiAgICAgICAgICAgICAgICBbXCJsXCIsIHIgKiAyIC0gdywgMF0sXG4gICAgICAgICAgICAgICAgW1wiYVwiLCByLCByLCAwLCAwLCAxLCAtciwgLXJdLFxuICAgICAgICAgICAgICAgIFtcImxcIiwgMCwgciAqIDIgLSBoXSxcbiAgICAgICAgICAgICAgICBbXCJhXCIsIHIsIHIsIDAsIDAsIDEsIHIsIC1yXSxcbiAgICAgICAgICAgICAgICBbXCJ6XCJdXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXMgPSBbW1wiTVwiLCB4LCB5XSwgW1wibFwiLCB3LCAwXSwgW1wibFwiLCAwLCBoXSwgW1wibFwiLCAtdywgMF0sIFtcInpcIl1dO1xuICAgICAgICByZXMudG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gZWxsaXBzZVBhdGgoeCwgeSwgcngsIHJ5LCBhKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgJiYgcnkgPT0gbnVsbCkge1xuICAgICAgICAgICAgcnkgPSByeDtcbiAgICAgICAgfVxuICAgICAgICB4ID0gK3g7XG4gICAgICAgIHkgPSAreTtcbiAgICAgICAgcnggPSArcng7XG4gICAgICAgIHJ5ID0gK3J5O1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcmFkID0gTWF0aC5QSSAvIDE4MCxcbiAgICAgICAgICAgICAgICB4MSA9IHggKyByeCAqIE1hdGguY29zKC1yeSAqIHJhZCksXG4gICAgICAgICAgICAgICAgeDIgPSB4ICsgcnggKiBNYXRoLmNvcygtYSAqIHJhZCksXG4gICAgICAgICAgICAgICAgeTEgPSB5ICsgcnggKiBNYXRoLnNpbigtcnkgKiByYWQpLFxuICAgICAgICAgICAgICAgIHkyID0geSArIHJ4ICogTWF0aC5zaW4oLWEgKiByYWQpLFxuICAgICAgICAgICAgICAgIHJlcyA9IFtbXCJNXCIsIHgxLCB5MV0sIFtcIkFcIiwgcngsIHJ4LCAwLCArKGEgLSByeSA+IDE4MCksIDAsIHgyLCB5Ml1dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gW1xuICAgICAgICAgICAgICAgIFtcIk1cIiwgeCwgeV0sXG4gICAgICAgICAgICAgICAgW1wibVwiLCAwLCAtcnldLFxuICAgICAgICAgICAgICAgIFtcImFcIiwgcngsIHJ5LCAwLCAxLCAxLCAwLCAyICogcnldLFxuICAgICAgICAgICAgICAgIFtcImFcIiwgcngsIHJ5LCAwLCAxLCAxLCAwLCAtMiAqIHJ5XSxcbiAgICAgICAgICAgICAgICBbXCJ6XCJdXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJlcy50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICB2YXIgdW5pdDJweCA9IFNuYXAuX3VuaXQycHgsXG4gICAgICAgIGdldFBhdGggPSB7XG4gICAgICAgIHBhdGg6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmF0dHIoXCJwYXRoXCIpO1xuICAgICAgICB9LFxuICAgICAgICBjaXJjbGU6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSB1bml0MnB4KGVsKTtcbiAgICAgICAgICAgIHJldHVybiBlbGxpcHNlUGF0aChhdHRyLmN4LCBhdHRyLmN5LCBhdHRyLnIpO1xuICAgICAgICB9LFxuICAgICAgICBlbGxpcHNlOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gdW5pdDJweChlbCk7XG4gICAgICAgICAgICByZXR1cm4gZWxsaXBzZVBhdGgoYXR0ci5jeCB8fCAwLCBhdHRyLmN5IHx8IDAsIGF0dHIucngsIGF0dHIucnkpO1xuICAgICAgICB9LFxuICAgICAgICByZWN0OiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gdW5pdDJweChlbCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdFBhdGgoYXR0ci54IHx8IDAsIGF0dHIueSB8fCAwLCBhdHRyLndpZHRoLCBhdHRyLmhlaWdodCwgYXR0ci5yeCwgYXR0ci5yeSk7XG4gICAgICAgIH0sXG4gICAgICAgIGltYWdlOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gdW5pdDJweChlbCk7XG4gICAgICAgICAgICByZXR1cm4gcmVjdFBhdGgoYXR0ci54IHx8IDAsIGF0dHIueSB8fCAwLCBhdHRyLndpZHRoLCBhdHRyLmhlaWdodCk7XG4gICAgICAgIH0sXG4gICAgICAgIGxpbmU6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTVwiICsgW2VsLmF0dHIoXCJ4MVwiKSB8fCAwLCBlbC5hdHRyKFwieTFcIikgfHwgMCwgZWwuYXR0cihcIngyXCIpLCBlbC5hdHRyKFwieTJcIildO1xuICAgICAgICB9LFxuICAgICAgICBwb2x5bGluZTogZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBlbC5hdHRyKFwicG9pbnRzXCIpO1xuICAgICAgICB9LFxuICAgICAgICBwb2x5Z29uOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIk1cIiArIGVsLmF0dHIoXCJwb2ludHNcIikgKyBcInpcIjtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmbHQ6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmFyIGJib3ggPSBlbC5ub2RlLmdldEJCb3goKTtcbiAgICAgICAgICAgIHJldHVybiByZWN0UGF0aChiYm94LngsIGJib3gueSwgYmJveC53aWR0aCwgYmJveC5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBwYXRoVG9SZWxhdGl2ZShwYXRoQXJyYXkpIHtcbiAgICAgICAgdmFyIHB0aCA9IHBhdGhzKHBhdGhBcnJheSksXG4gICAgICAgICAgICBsb3dlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvTG93ZXJDYXNlO1xuICAgICAgICBpZiAocHRoLnJlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhDbG9uZShwdGgucmVsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIVNuYXAuaXMocGF0aEFycmF5LCBcImFycmF5XCIpIHx8ICFTbmFwLmlzKHBhdGhBcnJheSAmJiBwYXRoQXJyYXlbMF0sIFwiYXJyYXlcIikpIHtcbiAgICAgICAgICAgIHBhdGhBcnJheSA9IFNuYXAucGFyc2VQYXRoU3RyaW5nKHBhdGhBcnJheSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcyA9IFtdLFxuICAgICAgICAgICAgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMCxcbiAgICAgICAgICAgIG14ID0gMCxcbiAgICAgICAgICAgIG15ID0gMCxcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgaWYgKHBhdGhBcnJheVswXVswXSA9PSBcIk1cIikge1xuICAgICAgICAgICAgeCA9IHBhdGhBcnJheVswXVsxXTtcbiAgICAgICAgICAgIHkgPSBwYXRoQXJyYXlbMF1bMl07XG4gICAgICAgICAgICBteCA9IHg7XG4gICAgICAgICAgICBteSA9IHk7XG4gICAgICAgICAgICBzdGFydCsrO1xuICAgICAgICAgICAgcmVzLnB1c2goW1wiTVwiLCB4LCB5XSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0LCBpaSA9IHBhdGhBcnJheS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgciA9IHJlc1tpXSA9IFtdLFxuICAgICAgICAgICAgICAgIHBhID0gcGF0aEFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHBhWzBdICE9IGxvd2VyQ2FzZS5jYWxsKHBhWzBdKSkge1xuICAgICAgICAgICAgICAgIHJbMF0gPSBsb3dlckNhc2UuY2FsbChwYVswXSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChyWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByWzFdID0gcGFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzJdID0gcGFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzNdID0gcGFbM107XG4gICAgICAgICAgICAgICAgICAgICAgICByWzRdID0gcGFbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzVdID0gcGFbNV07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzZdID0gKyhwYVs2XSAtIHgpLnRvRml4ZWQoMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByWzddID0gKyhwYVs3XSAtIHkpLnRvRml4ZWQoMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbMV0gPSArKHBhWzFdIC0geSkudG9GaXhlZCgzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgbXggPSBwYVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15ID0gcGFbMl07XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMSwgamogPSBwYS5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcltqXSA9ICsocGFbal0gLSAoaiAlIDIgPyB4IDogeSkpLnRvRml4ZWQoMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByID0gcmVzW2ldID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHBhWzBdID09IFwibVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG14ID0gcGFbMV0gKyB4O1xuICAgICAgICAgICAgICAgICAgICBteSA9IHBhWzJdICsgeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDAsIGtrID0gcGEubGVuZ3RoOyBrIDwga2s7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICByZXNbaV1ba10gPSBwYVtrXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGVuID0gcmVzW2ldLmxlbmd0aDtcbiAgICAgICAgICAgIHN3aXRjaCAocmVzW2ldWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInpcIjpcbiAgICAgICAgICAgICAgICAgICAgeCA9IG14O1xuICAgICAgICAgICAgICAgICAgICB5ID0gbXk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJoXCI6XG4gICAgICAgICAgICAgICAgICAgIHggKz0gK3Jlc1tpXVtsZW4gLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZcIjpcbiAgICAgICAgICAgICAgICAgICAgeSArPSArcmVzW2ldW2xlbiAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB4ICs9ICtyZXNbaV1bbGVuIC0gMl07XG4gICAgICAgICAgICAgICAgICAgIHkgKz0gK3Jlc1tpXVtsZW4gLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMudG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICAgICAgcHRoLnJlbCA9IHBhdGhDbG9uZShyZXMpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXRoVG9BYnNvbHV0ZShwYXRoQXJyYXkpIHtcbiAgICAgICAgdmFyIHB0aCA9IHBhdGhzKHBhdGhBcnJheSk7XG4gICAgICAgIGlmIChwdGguYWJzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aENsb25lKHB0aC5hYnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXMocGF0aEFycmF5LCBcImFycmF5XCIpIHx8ICFpcyhwYXRoQXJyYXkgJiYgcGF0aEFycmF5WzBdLCBcImFycmF5XCIpKSB7IC8vIHJvdWdoIGFzc3VtcHRpb25cbiAgICAgICAgICAgIHBhdGhBcnJheSA9IFNuYXAucGFyc2VQYXRoU3RyaW5nKHBhdGhBcnJheSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXRoQXJyYXkgfHwgIXBhdGhBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBbW1wiTVwiLCAwLCAwXV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcyA9IFtdLFxuICAgICAgICAgICAgeCA9IDAsXG4gICAgICAgICAgICB5ID0gMCxcbiAgICAgICAgICAgIG14ID0gMCxcbiAgICAgICAgICAgIG15ID0gMCxcbiAgICAgICAgICAgIHN0YXJ0ID0gMCxcbiAgICAgICAgICAgIHBhMDtcbiAgICAgICAgaWYgKHBhdGhBcnJheVswXVswXSA9PSBcIk1cIikge1xuICAgICAgICAgICAgeCA9ICtwYXRoQXJyYXlbMF1bMV07XG4gICAgICAgICAgICB5ID0gK3BhdGhBcnJheVswXVsyXTtcbiAgICAgICAgICAgIG14ID0geDtcbiAgICAgICAgICAgIG15ID0geTtcbiAgICAgICAgICAgIHN0YXJ0Kys7XG4gICAgICAgICAgICByZXNbMF0gPSBbXCJNXCIsIHgsIHldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjcnogPSBwYXRoQXJyYXkubGVuZ3RoID09IDMgJiZcbiAgICAgICAgICAgIHBhdGhBcnJheVswXVswXSA9PSBcIk1cIiAmJlxuICAgICAgICAgICAgcGF0aEFycmF5WzFdWzBdLnRvVXBwZXJDYXNlKCkgPT0gXCJSXCIgJiZcbiAgICAgICAgICAgIHBhdGhBcnJheVsyXVswXS50b1VwcGVyQ2FzZSgpID09IFwiWlwiO1xuICAgICAgICBmb3IgKHZhciByLCBwYSwgaSA9IHN0YXJ0LCBpaSA9IHBhdGhBcnJheS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICByZXMucHVzaChyID0gW10pO1xuICAgICAgICAgICAgcGEgPSBwYXRoQXJyYXlbaV07XG4gICAgICAgICAgICBwYTAgPSBwYVswXTtcbiAgICAgICAgICAgIGlmIChwYTAgIT0gcGEwLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICByWzBdID0gcGEwLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChyWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByWzFdID0gcGFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzJdID0gcGFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzNdID0gcGFbM107XG4gICAgICAgICAgICAgICAgICAgICAgICByWzRdID0gcGFbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzVdID0gcGFbNV07XG4gICAgICAgICAgICAgICAgICAgICAgICByWzZdID0gK3BhWzZdICsgeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJbN10gPSArcGFbN10gKyB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJWXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICByWzFdID0gK3BhWzFdICsgeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgclsxXSA9ICtwYVsxXSArIHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkb3RzID0gW3gsIHldLmNvbmNhdChwYS5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMiwgamogPSBkb3RzLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb3RzW2pdID0gK2RvdHNbal0gKyB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvdHNbKytqXSA9ICtkb3RzW2pdICsgeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoY2F0bXVsbFJvbTJiZXppZXIoZG90cywgY3J6KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHMgPSBlbGxpcHNlUGF0aCh4LCB5LCBwYVsxXSwgcGFbMl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG90cy5wdXNoKGRvdHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdChkb3RzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdChlbGxpcHNlUGF0aCh4LCB5LCBwYVsxXSwgcGFbMl0sIHBhWzNdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByID0gW1wiVVwiXS5jb25jYXQocmVzW3Jlcy5sZW5ndGggLSAxXS5zbGljZSgtMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBteCA9ICtwYVsxXSArIHg7XG4gICAgICAgICAgICAgICAgICAgICAgICBteSA9ICtwYVsyXSArIHk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAxLCBqaiA9IHBhLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByW2pdID0gK3BhW2pdICsgKGogJSAyID8geCA6IHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGEwID09IFwiUlwiKSB7XG4gICAgICAgICAgICAgICAgZG90cyA9IFt4LCB5XS5jb25jYXQocGEuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgIHJlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGNhdG11bGxSb20yYmV6aWVyKGRvdHMsIGNyeikpO1xuICAgICAgICAgICAgICAgIHIgPSBbXCJSXCJdLmNvbmNhdChwYS5zbGljZSgtMikpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYTAgPT0gXCJPXCIpIHtcbiAgICAgICAgICAgICAgICByZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgZG90cyA9IGVsbGlwc2VQYXRoKHgsIHksIHBhWzFdLCBwYVsyXSk7XG4gICAgICAgICAgICAgICAgZG90cy5wdXNoKGRvdHNbMF0pO1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoZG90cyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhMCA9PSBcIlVcIikge1xuICAgICAgICAgICAgICAgIHJlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGVsbGlwc2VQYXRoKHgsIHksIHBhWzFdLCBwYVsyXSwgcGFbM10pKTtcbiAgICAgICAgICAgICAgICByID0gW1wiVVwiXS5jb25jYXQocmVzW3Jlcy5sZW5ndGggLSAxXS5zbGljZSgtMikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMCwga2sgPSBwYS5sZW5ndGg7IGsgPCBrazsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJba10gPSBwYVtrXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYTAgPSBwYTAudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChwYTAgIT0gXCJPXCIpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlpcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSArbXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gK215O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gclsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHJbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIk1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG14ID0gcltyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXkgPSByW3IubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gcltyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHJbci5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4gICAgICAgIHB0aC5hYnMgPSBwYXRoQ2xvbmUocmVzKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gbDJjKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIHJldHVybiBbeDEsIHkxLCB4MiwgeTIsIHgyLCB5Ml07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHEyYyh4MSwgeTEsIGF4LCBheSwgeDIsIHkyKSB7XG4gICAgICAgIHZhciBfMTMgPSAxIC8gMyxcbiAgICAgICAgICAgIF8yMyA9IDIgLyAzO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIF8xMyAqIHgxICsgXzIzICogYXgsXG4gICAgICAgICAgICAgICAgXzEzICogeTEgKyBfMjMgKiBheSxcbiAgICAgICAgICAgICAgICBfMTMgKiB4MiArIF8yMyAqIGF4LFxuICAgICAgICAgICAgICAgIF8xMyAqIHkyICsgXzIzICogYXksXG4gICAgICAgICAgICAgICAgeDIsXG4gICAgICAgICAgICAgICAgeTJcbiAgICAgICAgICAgIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGEyYyh4MSwgeTEsIHJ4LCByeSwgYW5nbGUsIGxhcmdlX2FyY19mbGFnLCBzd2VlcF9mbGFnLCB4MiwgeTIsIHJlY3Vyc2l2ZSkge1xuICAgICAgICAvLyBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvZiB3aGVyZSB0aGlzIG1hdGggY2FtZSBmcm9tIHZpc2l0OlxuICAgICAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9pbXBsbm90ZS5odG1sI0FyY0ltcGxlbWVudGF0aW9uTm90ZXNcbiAgICAgICAgdmFyIF8xMjAgPSBQSSAqIDEyMCAvIDE4MCxcbiAgICAgICAgICAgIHJhZCA9IFBJIC8gMTgwICogKCthbmdsZSB8fCAwKSxcbiAgICAgICAgICAgIHJlcyA9IFtdLFxuICAgICAgICAgICAgeHksXG4gICAgICAgICAgICByb3RhdGUgPSBTbmFwLl8uY2FjaGVyKGZ1bmN0aW9uICh4LCB5LCByYWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgWCA9IHggKiBtYXRoLmNvcyhyYWQpIC0geSAqIG1hdGguc2luKHJhZCksXG4gICAgICAgICAgICAgICAgICAgIFkgPSB4ICogbWF0aC5zaW4ocmFkKSArIHkgKiBtYXRoLmNvcyhyYWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7eDogWCwgeTogWX07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFyeCB8fCAhcnkpIHtcbiAgICAgICAgICAgIHJldHVybiBbeDEsIHkxLCB4MiwgeTIsIHgyLCB5Ml07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZWN1cnNpdmUpIHtcbiAgICAgICAgICAgIHh5ID0gcm90YXRlKHgxLCB5MSwgLXJhZCk7XG4gICAgICAgICAgICB4MSA9IHh5Lng7XG4gICAgICAgICAgICB5MSA9IHh5Lnk7XG4gICAgICAgICAgICB4eSA9IHJvdGF0ZSh4MiwgeTIsIC1yYWQpO1xuICAgICAgICAgICAgeDIgPSB4eS54O1xuICAgICAgICAgICAgeTIgPSB4eS55O1xuICAgICAgICAgICAgdmFyIGNvcyA9IG1hdGguY29zKFBJIC8gMTgwICogYW5nbGUpLFxuICAgICAgICAgICAgICAgIHNpbiA9IG1hdGguc2luKFBJIC8gMTgwICogYW5nbGUpLFxuICAgICAgICAgICAgICAgIHggPSAoeDEgLSB4MikgLyAyLFxuICAgICAgICAgICAgICAgIHkgPSAoeTEgLSB5MikgLyAyO1xuICAgICAgICAgICAgdmFyIGggPSB4ICogeCAvIChyeCAqIHJ4KSArIHkgKiB5IC8gKHJ5ICogcnkpO1xuICAgICAgICAgICAgaWYgKGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaCA9IG1hdGguc3FydChoKTtcbiAgICAgICAgICAgICAgICByeCA9IGggKiByeDtcbiAgICAgICAgICAgICAgICByeSA9IGggKiByeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByeDIgPSByeCAqIHJ4LFxuICAgICAgICAgICAgICAgIHJ5MiA9IHJ5ICogcnksXG4gICAgICAgICAgICAgICAgayA9IChsYXJnZV9hcmNfZmxhZyA9PSBzd2VlcF9mbGFnID8gLTEgOiAxKSAqXG4gICAgICAgICAgICAgICAgICAgIG1hdGguc3FydChhYnMoKHJ4MiAqIHJ5MiAtIHJ4MiAqIHkgKiB5IC0gcnkyICogeCAqIHgpIC8gKHJ4MiAqIHkgKiB5ICsgcnkyICogeCAqIHgpKSksXG4gICAgICAgICAgICAgICAgY3ggPSBrICogcnggKiB5IC8gcnkgKyAoeDEgKyB4MikgLyAyLFxuICAgICAgICAgICAgICAgIGN5ID0gayAqIC1yeSAqIHggLyByeCArICh5MSArIHkyKSAvIDIsXG4gICAgICAgICAgICAgICAgZjEgPSBtYXRoLmFzaW4oKCh5MSAtIGN5KSAvIHJ5KS50b0ZpeGVkKDkpKSxcbiAgICAgICAgICAgICAgICBmMiA9IG1hdGguYXNpbigoKHkyIC0gY3kpIC8gcnkpLnRvRml4ZWQoOSkpO1xuXG4gICAgICAgICAgICBmMSA9IHgxIDwgY3ggPyBQSSAtIGYxIDogZjE7XG4gICAgICAgICAgICBmMiA9IHgyIDwgY3ggPyBQSSAtIGYyIDogZjI7XG4gICAgICAgICAgICBmMSA8IDAgJiYgKGYxID0gUEkgKiAyICsgZjEpO1xuICAgICAgICAgICAgZjIgPCAwICYmIChmMiA9IFBJICogMiArIGYyKTtcbiAgICAgICAgICAgIGlmIChzd2VlcF9mbGFnICYmIGYxID4gZjIpIHtcbiAgICAgICAgICAgICAgICBmMSA9IGYxIC0gUEkgKiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzd2VlcF9mbGFnICYmIGYyID4gZjEpIHtcbiAgICAgICAgICAgICAgICBmMiA9IGYyIC0gUEkgKiAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZjEgPSByZWN1cnNpdmVbMF07XG4gICAgICAgICAgICBmMiA9IHJlY3Vyc2l2ZVsxXTtcbiAgICAgICAgICAgIGN4ID0gcmVjdXJzaXZlWzJdO1xuICAgICAgICAgICAgY3kgPSByZWN1cnNpdmVbM107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRmID0gZjIgLSBmMTtcbiAgICAgICAgaWYgKGFicyhkZikgPiBfMTIwKSB7XG4gICAgICAgICAgICB2YXIgZjJvbGQgPSBmMixcbiAgICAgICAgICAgICAgICB4Mm9sZCA9IHgyLFxuICAgICAgICAgICAgICAgIHkyb2xkID0geTI7XG4gICAgICAgICAgICBmMiA9IGYxICsgXzEyMCAqIChzd2VlcF9mbGFnICYmIGYyID4gZjEgPyAxIDogLTEpO1xuICAgICAgICAgICAgeDIgPSBjeCArIHJ4ICogbWF0aC5jb3MoZjIpO1xuICAgICAgICAgICAgeTIgPSBjeSArIHJ5ICogbWF0aC5zaW4oZjIpO1xuICAgICAgICAgICAgcmVzID0gYTJjKHgyLCB5MiwgcngsIHJ5LCBhbmdsZSwgMCwgc3dlZXBfZmxhZywgeDJvbGQsIHkyb2xkLCBbZjIsIGYyb2xkLCBjeCwgY3ldKTtcbiAgICAgICAgfVxuICAgICAgICBkZiA9IGYyIC0gZjE7XG4gICAgICAgIHZhciBjMSA9IG1hdGguY29zKGYxKSxcbiAgICAgICAgICAgIHMxID0gbWF0aC5zaW4oZjEpLFxuICAgICAgICAgICAgYzIgPSBtYXRoLmNvcyhmMiksXG4gICAgICAgICAgICBzMiA9IG1hdGguc2luKGYyKSxcbiAgICAgICAgICAgIHQgPSBtYXRoLnRhbihkZiAvIDQpLFxuICAgICAgICAgICAgaHggPSA0IC8gMyAqIHJ4ICogdCxcbiAgICAgICAgICAgIGh5ID0gNCAvIDMgKiByeSAqIHQsXG4gICAgICAgICAgICBtMSA9IFt4MSwgeTFdLFxuICAgICAgICAgICAgbTIgPSBbeDEgKyBoeCAqIHMxLCB5MSAtIGh5ICogYzFdLFxuICAgICAgICAgICAgbTMgPSBbeDIgKyBoeCAqIHMyLCB5MiAtIGh5ICogYzJdLFxuICAgICAgICAgICAgbTQgPSBbeDIsIHkyXTtcbiAgICAgICAgbTJbMF0gPSAyICogbTFbMF0gLSBtMlswXTtcbiAgICAgICAgbTJbMV0gPSAyICogbTFbMV0gLSBtMlsxXTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFttMiwgbTMsIG00XS5jb25jYXQocmVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IFttMiwgbTMsIG00XS5jb25jYXQocmVzKS5qb2luKCkuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgdmFyIG5ld3JlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcmVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBuZXdyZXNbaV0gPSBpICUgMiA/IHJvdGF0ZShyZXNbaSAtIDFdLCByZXNbaV0sIHJhZCkueSA6IHJvdGF0ZShyZXNbaV0sIHJlc1tpICsgMV0sIHJhZCkueDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdyZXM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZERvdEF0U2VnbWVudChwMXgsIHAxeSwgYzF4LCBjMXksIGMyeCwgYzJ5LCBwMngsIHAyeSwgdCkge1xuICAgICAgICB2YXIgdDEgPSAxIC0gdDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHBvdyh0MSwgMykgKiBwMXggKyBwb3codDEsIDIpICogMyAqIHQgKiBjMXggKyB0MSAqIDMgKiB0ICogdCAqIGMyeCArIHBvdyh0LCAzKSAqIHAyeCxcbiAgICAgICAgICAgIHk6IHBvdyh0MSwgMykgKiBwMXkgKyBwb3codDEsIDIpICogMyAqIHQgKiBjMXkgKyB0MSAqIDMgKiB0ICogdCAqIGMyeSArIHBvdyh0LCAzKSAqIHAyeVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgYm91bmRpbmcgYm94IG9mIGN1YmljIGJlemllciBjdXJ2ZS5cbiAgICAvLyBTb3VyY2U6IGh0dHA6Ly9ibG9nLmhhY2tlcnMtY2FmZS5uZXQvMjAwOS8wNi9ob3ctdG8tY2FsY3VsYXRlLWJlemllci1jdXJ2ZXMtYm91bmRpbmcuaHRtbFxuICAgIC8vIE9yaWdpbmFsIHZlcnNpb246IE5JU0hJTyBIaXJva2F6dVxuICAgIC8vIE1vZGlmaWNhdGlvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS90aW1vMjIzNDVcbiAgICBmdW5jdGlvbiBjdXJ2ZURpbSh4MCwgeTAsIHgxLCB5MSwgeDIsIHkyLCB4MywgeTMpIHtcbiAgICAgICAgdmFyIHR2YWx1ZXMgPSBbXSxcbiAgICAgICAgICAgIGJvdW5kcyA9IFtbXSwgW11dLFxuICAgICAgICAgICAgYSwgYiwgYywgdCwgdDEsIHQyLCBiMmFjLCBzcXJ0YjJhYztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICBiID0gNiAqIHgwIC0gMTIgKiB4MSArIDYgKiB4MjtcbiAgICAgICAgICAgICAgICBhID0gLTMgKiB4MCArIDkgKiB4MSAtIDkgKiB4MiArIDMgKiB4MztcbiAgICAgICAgICAgICAgICBjID0gMyAqIHgxIC0gMyAqIHgwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiID0gNiAqIHkwIC0gMTIgKiB5MSArIDYgKiB5MjtcbiAgICAgICAgICAgICAgICBhID0gLTMgKiB5MCArIDkgKiB5MSAtIDkgKiB5MiArIDMgKiB5MztcbiAgICAgICAgICAgICAgICBjID0gMyAqIHkxIC0gMyAqIHkwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFicyhhKSA8IDFlLTEyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFicyhiKSA8IDFlLTEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ID0gLWMgLyBiO1xuICAgICAgICAgICAgICAgIGlmICgwIDwgdCAmJiB0IDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0dmFsdWVzLnB1c2godCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYjJhYyA9IGIgKiBiIC0gNCAqIGMgKiBhO1xuICAgICAgICAgICAgc3FydGIyYWMgPSBtYXRoLnNxcnQoYjJhYyk7XG4gICAgICAgICAgICBpZiAoYjJhYyA8IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQxID0gKC1iICsgc3FydGIyYWMpIC8gKDIgKiBhKTtcbiAgICAgICAgICAgIGlmICgwIDwgdDEgJiYgdDEgPCAxKSB7XG4gICAgICAgICAgICAgICAgdHZhbHVlcy5wdXNoKHQxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQyID0gKC1iIC0gc3FydGIyYWMpIC8gKDIgKiBhKTtcbiAgICAgICAgICAgIGlmICgwIDwgdDIgJiYgdDIgPCAxKSB7XG4gICAgICAgICAgICAgICAgdHZhbHVlcy5wdXNoKHQyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4LCB5LCBqID0gdHZhbHVlcy5sZW5ndGgsXG4gICAgICAgICAgICBqbGVuID0gaixcbiAgICAgICAgICAgIG10O1xuICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgICB0ID0gdHZhbHVlc1tqXTtcbiAgICAgICAgICAgIG10ID0gMSAtIHQ7XG4gICAgICAgICAgICBib3VuZHNbMF1bal0gPSBtdCAqIG10ICogbXQgKiB4MCArIDMgKiBtdCAqIG10ICogdCAqIHgxICsgMyAqIG10ICogdCAqIHQgKiB4MiArIHQgKiB0ICogdCAqIHgzO1xuICAgICAgICAgICAgYm91bmRzWzFdW2pdID0gbXQgKiBtdCAqIG10ICogeTAgKyAzICogbXQgKiBtdCAqIHQgKiB5MSArIDMgKiBtdCAqIHQgKiB0ICogeTIgKyB0ICogdCAqIHQgKiB5MztcbiAgICAgICAgfVxuXG4gICAgICAgIGJvdW5kc1swXVtqbGVuXSA9IHgwO1xuICAgICAgICBib3VuZHNbMV1bamxlbl0gPSB5MDtcbiAgICAgICAgYm91bmRzWzBdW2psZW4gKyAxXSA9IHgzO1xuICAgICAgICBib3VuZHNbMV1bamxlbiArIDFdID0geTM7XG4gICAgICAgIGJvdW5kc1swXS5sZW5ndGggPSBib3VuZHNbMV0ubGVuZ3RoID0gamxlbiArIDI7XG5cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG1pbjoge3g6IG1taW4uYXBwbHkoMCwgYm91bmRzWzBdKSwgeTogbW1pbi5hcHBseSgwLCBib3VuZHNbMV0pfSxcbiAgICAgICAgICBtYXg6IHt4OiBtbWF4LmFwcGx5KDAsIGJvdW5kc1swXSksIHk6IG1tYXguYXBwbHkoMCwgYm91bmRzWzFdKX1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXRoMmN1cnZlKHBhdGgsIHBhdGgyKSB7XG4gICAgICAgIHZhciBwdGggPSAhcGF0aDIgJiYgcGF0aHMocGF0aCk7XG4gICAgICAgIGlmICghcGF0aDIgJiYgcHRoLmN1cnZlKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aENsb25lKHB0aC5jdXJ2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBwYXRoVG9BYnNvbHV0ZShwYXRoKSxcbiAgICAgICAgICAgIHAyID0gcGF0aDIgJiYgcGF0aFRvQWJzb2x1dGUocGF0aDIpLFxuICAgICAgICAgICAgYXR0cnMgPSB7eDogMCwgeTogMCwgYng6IDAsIGJ5OiAwLCBYOiAwLCBZOiAwLCBxeDogbnVsbCwgcXk6IG51bGx9LFxuICAgICAgICAgICAgYXR0cnMyID0ge3g6IDAsIHk6IDAsIGJ4OiAwLCBieTogMCwgWDogMCwgWTogMCwgcXg6IG51bGwsIHF5OiBudWxsfSxcbiAgICAgICAgICAgIHByb2Nlc3NQYXRoID0gZnVuY3Rpb24gKHBhdGgsIGQsIHBjb20pIHtcbiAgICAgICAgICAgICAgICB2YXIgbngsIG55O1xuICAgICAgICAgICAgICAgIGlmICghcGF0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiQ1wiLCBkLngsIGQueSwgZC54LCBkLnksIGQueCwgZC55XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIShwYXRoWzBdIGluIHtUOiAxLCBROiAxfSkgJiYgKGQucXggPSBkLnF5ID0gbnVsbCk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwYXRoWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBkLlggPSBwYXRoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZC5ZID0gcGF0aFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KGEyYy5hcHBseSgwLCBbZC54LCBkLnldLmNvbmNhdChwYXRoLnNsaWNlKDEpKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGNvbSA9PSBcIkNcIiB8fCBwY29tID09IFwiU1wiKSB7IC8vIEluIFwiU1wiIGNhc2Ugd2UgaGF2ZSB0byB0YWtlIGludG8gYWNjb3VudCwgaWYgdGhlIHByZXZpb3VzIGNvbW1hbmQgaXMgQy9TLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG54ID0gZC54ICogMiAtIGQuYng7ICAgICAgICAgIC8vIEFuZCByZWZsZWN0IHRoZSBwcmV2aW91c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG55ID0gZC55ICogMiAtIGQuYnk7ICAgICAgICAgIC8vIGNvbW1hbmQncyBjb250cm9sIHBvaW50IHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHBvaW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIHNvbWUgZWxzZSBvciBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnggPSBkLng7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnkgPSBkLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gW1wiQ1wiLCBueCwgbnldLmNvbmNhdChwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBjb20gPT0gXCJRXCIgfHwgcGNvbSA9PSBcIlRcIikgeyAvLyBJbiBcIlRcIiBjYXNlIHdlIGhhdmUgdG8gdGFrZSBpbnRvIGFjY291bnQsIGlmIHRoZSBwcmV2aW91cyBjb21tYW5kIGlzIFEvVC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnF4ID0gZC54ICogMiAtIGQucXg7ICAgICAgICAvLyBBbmQgbWFrZSBhIHJlZmxlY3Rpb24gc2ltaWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucXkgPSBkLnkgKiAyIC0gZC5xeTsgICAgICAgIC8vIHRvIGNhc2UgXCJTXCIuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3Igc29tZXRoaW5nIGVsc2Ugb3Igbm90aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucXggPSBkLng7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5xeSA9IGQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBbXCJDXCJdLmNvbmNhdChxMmMoZC54LCBkLnksIGQucXgsIGQucXksIHBhdGhbMV0sIHBhdGhbMl0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiUVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgZC5xeCA9IHBhdGhbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBkLnF5ID0gcGF0aFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBbXCJDXCJdLmNvbmNhdChxMmMoZC54LCBkLnksIHBhdGhbMV0sIHBhdGhbMl0sIHBhdGhbM10sIHBhdGhbNF0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiTFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KGwyYyhkLngsIGQueSwgcGF0aFsxXSwgcGF0aFsyXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gW1wiQ1wiXS5jb25jYXQobDJjKGQueCwgZC55LCBwYXRoWzFdLCBkLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiVlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFtcIkNcIl0uY29uY2F0KGwyYyhkLngsIGQueSwgZC54LCBwYXRoWzFdKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlpcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSBbXCJDXCJdLmNvbmNhdChsMmMoZC54LCBkLnksIGQuWCwgZC5ZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZml4QXJjID0gZnVuY3Rpb24gKHBwLCBpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBwW2ldLmxlbmd0aCA+IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHBbaV0uc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBpID0gcHBbaV07XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwaS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBjb21zMVtpXSA9IFwiQVwiOyAvLyBpZiBjcmVhdGVkIG11bHRpcGxlIEM6cywgdGhlaXIgb3JpZ2luYWwgc2VnIGlzIHNhdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICBwMiAmJiAocGNvbXMyW2ldID0gXCJBXCIpOyAvLyB0aGUgc2FtZSBhcyBhYm92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcHAuc3BsaWNlKGkrKywgMCwgW1wiQ1wiXS5jb25jYXQocGkuc3BsaWNlKDAsIDYpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHAuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpaSA9IG1tYXgocC5sZW5ndGgsIHAyICYmIHAyLmxlbmd0aCB8fCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZml4TSA9IGZ1bmN0aW9uIChwYXRoMSwgcGF0aDIsIGExLCBhMiwgaSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXRoMSAmJiBwYXRoMiAmJiBwYXRoMVtpXVswXSA9PSBcIk1cIiAmJiBwYXRoMltpXVswXSAhPSBcIk1cIikge1xuICAgICAgICAgICAgICAgICAgICBwYXRoMi5zcGxpY2UoaSwgMCwgW1wiTVwiLCBhMi54LCBhMi55XSk7XG4gICAgICAgICAgICAgICAgICAgIGExLmJ4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYTEuYnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBhMS54ID0gcGF0aDFbaV1bMV07XG4gICAgICAgICAgICAgICAgICAgIGExLnkgPSBwYXRoMVtpXVsyXTtcbiAgICAgICAgICAgICAgICAgICAgaWkgPSBtbWF4KHAubGVuZ3RoLCBwMiAmJiBwMi5sZW5ndGggfHwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBjb21zMSA9IFtdLCAvLyBwYXRoIGNvbW1hbmRzIG9mIG9yaWdpbmFsIHBhdGggcFxuICAgICAgICAgICAgcGNvbXMyID0gW10sIC8vIHBhdGggY29tbWFuZHMgb2Ygb3JpZ2luYWwgcGF0aCBwMlxuICAgICAgICAgICAgcGZpcnN0ID0gXCJcIiwgLy8gdGVtcG9yYXJ5IGhvbGRlciBmb3Igb3JpZ2luYWwgcGF0aCBjb21tYW5kXG4gICAgICAgICAgICBwY29tID0gXCJcIjsgLy8gaG9sZGVyIGZvciBwcmV2aW91cyBwYXRoIGNvbW1hbmQgb2Ygb3JpZ2luYWwgcGF0aFxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBtbWF4KHAubGVuZ3RoLCBwMiAmJiBwMi5sZW5ndGggfHwgMCk7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBwW2ldICYmIChwZmlyc3QgPSBwW2ldWzBdKTsgLy8gc2F2ZSBjdXJyZW50IHBhdGggY29tbWFuZFxuXG4gICAgICAgICAgICBpZiAocGZpcnN0ICE9IFwiQ1wiKSAvLyBDIGlzIG5vdCBzYXZlZCB5ZXQsIGJlY2F1c2UgaXQgbWF5IGJlIHJlc3VsdCBvZiBjb252ZXJzaW9uXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGNvbXMxW2ldID0gcGZpcnN0OyAvLyBTYXZlIGN1cnJlbnQgcGF0aCBjb21tYW5kXG4gICAgICAgICAgICAgICAgaSAmJiAoIHBjb20gPSBwY29tczFbaSAtIDFdKTsgLy8gR2V0IHByZXZpb3VzIHBhdGggY29tbWFuZCBwY29tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwW2ldID0gcHJvY2Vzc1BhdGgocFtpXSwgYXR0cnMsIHBjb20pOyAvLyBQcmV2aW91cyBwYXRoIGNvbW1hbmQgaXMgaW5wdXR0ZWQgdG8gcHJvY2Vzc1BhdGhcblxuICAgICAgICAgICAgaWYgKHBjb21zMVtpXSAhPSBcIkFcIiAmJiBwZmlyc3QgPT0gXCJDXCIpIHBjb21zMVtpXSA9IFwiQ1wiOyAvLyBBIGlzIHRoZSBvbmx5IGNvbW1hbmRcbiAgICAgICAgICAgIC8vIHdoaWNoIG1heSBwcm9kdWNlIG11bHRpcGxlIEM6c1xuICAgICAgICAgICAgLy8gc28gd2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCBDIGlzIGFsc28gQyBpbiBvcmlnaW5hbCBwYXRoXG5cbiAgICAgICAgICAgIGZpeEFyYyhwLCBpKTsgLy8gZml4QXJjIGFkZHMgYWxzbyB0aGUgcmlnaHQgYW1vdW50IG9mIEE6cyB0byBwY29tczFcblxuICAgICAgICAgICAgaWYgKHAyKSB7IC8vIHRoZSBzYW1lIHByb2NlZHVyZXMgaXMgZG9uZSB0byBwMlxuICAgICAgICAgICAgICAgIHAyW2ldICYmIChwZmlyc3QgPSBwMltpXVswXSk7XG4gICAgICAgICAgICAgICAgaWYgKHBmaXJzdCAhPSBcIkNcIikge1xuICAgICAgICAgICAgICAgICAgICBwY29tczJbaV0gPSBwZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgIGkgJiYgKHBjb20gPSBwY29tczJbaSAtIDFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcDJbaV0gPSBwcm9jZXNzUGF0aChwMltpXSwgYXR0cnMyLCBwY29tKTtcblxuICAgICAgICAgICAgICAgIGlmIChwY29tczJbaV0gIT0gXCJBXCIgJiYgcGZpcnN0ID09IFwiQ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBjb21zMltpXSA9IFwiQ1wiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZpeEFyYyhwMiwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaXhNKHAsIHAyLCBhdHRycywgYXR0cnMyLCBpKTtcbiAgICAgICAgICAgIGZpeE0ocDIsIHAsIGF0dHJzMiwgYXR0cnMsIGkpO1xuICAgICAgICAgICAgdmFyIHNlZyA9IHBbaV0sXG4gICAgICAgICAgICAgICAgc2VnMiA9IHAyICYmIHAyW2ldLFxuICAgICAgICAgICAgICAgIHNlZ2xlbiA9IHNlZy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgc2VnMmxlbiA9IHAyICYmIHNlZzIubGVuZ3RoO1xuICAgICAgICAgICAgYXR0cnMueCA9IHNlZ1tzZWdsZW4gLSAyXTtcbiAgICAgICAgICAgIGF0dHJzLnkgPSBzZWdbc2VnbGVuIC0gMV07XG4gICAgICAgICAgICBhdHRycy5ieCA9IHRvRmxvYXQoc2VnW3NlZ2xlbiAtIDRdKSB8fCBhdHRycy54O1xuICAgICAgICAgICAgYXR0cnMuYnkgPSB0b0Zsb2F0KHNlZ1tzZWdsZW4gLSAzXSkgfHwgYXR0cnMueTtcbiAgICAgICAgICAgIGF0dHJzMi5ieCA9IHAyICYmICh0b0Zsb2F0KHNlZzJbc2VnMmxlbiAtIDRdKSB8fCBhdHRyczIueCk7XG4gICAgICAgICAgICBhdHRyczIuYnkgPSBwMiAmJiAodG9GbG9hdChzZWcyW3NlZzJsZW4gLSAzXSkgfHwgYXR0cnMyLnkpO1xuICAgICAgICAgICAgYXR0cnMyLnggPSBwMiAmJiBzZWcyW3NlZzJsZW4gLSAyXTtcbiAgICAgICAgICAgIGF0dHJzMi55ID0gcDIgJiYgc2VnMltzZWcybGVuIC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwMikge1xuICAgICAgICAgICAgcHRoLmN1cnZlID0gcGF0aENsb25lKHApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwMiA/IFtwLCBwMl0gOiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYXBQYXRoKHBhdGgsIG1hdHJpeCkge1xuICAgICAgICBpZiAoIW1hdHJpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHgsIHksIGksIGosIGlpLCBqaiwgcGF0aGk7XG4gICAgICAgIHBhdGggPSBwYXRoMmN1cnZlKHBhdGgpO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IHBhdGgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgcGF0aGkgPSBwYXRoW2ldO1xuICAgICAgICAgICAgZm9yIChqID0gMSwgamogPSBwYXRoaS5sZW5ndGg7IGogPCBqajsgaiArPSAyKSB7XG4gICAgICAgICAgICAgICAgeCA9IG1hdHJpeC54KHBhdGhpW2pdLCBwYXRoaVtqICsgMV0pO1xuICAgICAgICAgICAgICAgIHkgPSBtYXRyaXgueShwYXRoaVtqXSwgcGF0aGlbaiArIDFdKTtcbiAgICAgICAgICAgICAgICBwYXRoaVtqXSA9IHg7XG4gICAgICAgICAgICAgICAgcGF0aGlbaiArIDFdID0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vc2NoZXBlcnMuY2MvZ2V0dGluZy10by10aGUtcG9pbnRcbiAgICBmdW5jdGlvbiBjYXRtdWxsUm9tMmJlemllcihjcnAsIHopIHtcbiAgICAgICAgdmFyIGQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSBjcnAubGVuZ3RoOyBpTGVuIC0gMiAqICF6ID4gaTsgaSArPSAyKSB7XG4gICAgICAgICAgICB2YXIgcCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHt4OiArY3JwW2kgLSAyXSwgeTogK2NycFtpIC0gMV19LFxuICAgICAgICAgICAgICAgICAgICAgICAge3g6ICtjcnBbaV0sICAgICB5OiArY3JwW2kgKyAxXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7eDogK2NycFtpICsgMl0sIHk6ICtjcnBbaSArIDNdfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt4OiArY3JwW2kgKyA0XSwgeTogK2NycFtpICsgNV19XG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoeikge1xuICAgICAgICAgICAgICAgIGlmICghaSkge1xuICAgICAgICAgICAgICAgICAgICBwWzBdID0ge3g6ICtjcnBbaUxlbiAtIDJdLCB5OiArY3JwW2lMZW4gLSAxXX07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpTGVuIC0gNCA9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBbM10gPSB7eDogK2NycFswXSwgeTogK2NycFsxXX07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpTGVuIC0gMiA9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBbMl0gPSB7eDogK2NycFswXSwgeTogK2NycFsxXX07XG4gICAgICAgICAgICAgICAgICAgIHBbM10gPSB7eDogK2NycFsyXSwgeTogK2NycFszXX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaUxlbiAtIDQgPT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBwWzNdID0gcFsyXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBbMF0gPSB7eDogK2NycFtpXSwgeTogK2NycFtpICsgMV19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGQucHVzaChbXCJDXCIsXG4gICAgICAgICAgICAgICAgICAoLXBbMF0ueCArIDYgKiBwWzFdLnggKyBwWzJdLngpIC8gNixcbiAgICAgICAgICAgICAgICAgICgtcFswXS55ICsgNiAqIHBbMV0ueSArIHBbMl0ueSkgLyA2LFxuICAgICAgICAgICAgICAgICAgKHBbMV0ueCArIDYgKiBwWzJdLnggLSBwWzNdLngpIC8gNixcbiAgICAgICAgICAgICAgICAgIChwWzFdLnkgKyA2KnBbMl0ueSAtIHBbM10ueSkgLyA2LFxuICAgICAgICAgICAgICAgICAgcFsyXS54LFxuICAgICAgICAgICAgICAgICAgcFsyXS55XG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkO1xuICAgIH1cblxuICAgIC8vIGV4cG9ydFxuICAgIFNuYXAucGF0aCA9IHBhdGhzO1xuXG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5nZXRUb3RhbExlbmd0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBnaXZlbiBwYXRoIGluIHBpeGVsc1xuICAgICAqKlxuICAgICAtIHBhdGggKHN0cmluZykgU1ZHIHBhdGggc3RyaW5nXG4gICAgICoqXG4gICAgID0gKG51bWJlcikgbGVuZ3RoXG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5nZXRUb3RhbExlbmd0aCA9IGdldFRvdGFsTGVuZ3RoO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguZ2V0UG9pbnRBdExlbmd0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50IGxvY2F0ZWQgYXQgdGhlIGdpdmVuIGxlbmd0aCBhbG9uZyB0aGUgZ2l2ZW4gcGF0aFxuICAgICAqKlxuICAgICAtIHBhdGggKHN0cmluZykgU1ZHIHBhdGggc3RyaW5nXG4gICAgIC0gbGVuZ3RoIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCwgZXhjbHVkaW5nIG5vbi1yZW5kZXJpbmcganVtcHNcbiAgICAgKipcbiAgICAgPSAob2JqZWN0KSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcG9pbnQ6XG4gICAgIG8ge1xuICAgICBvICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUsXG4gICAgIG8gICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSxcbiAgICAgbyAgICAgYWxwaGE6IChudW1iZXIpIGFuZ2xlIG9mIGRlcml2YXRpdmVcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5nZXRQb2ludEF0TGVuZ3RoID0gZ2V0UG9pbnRBdExlbmd0aDtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmdldFN1YnBhdGhcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgdGhlIHN1YnBhdGggb2YgYSBnaXZlbiBwYXRoIGJldHdlZW4gZ2l2ZW4gc3RhcnQgYW5kIGVuZCBsZW5ndGhzXG4gICAgICoqXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBTVkcgcGF0aCBzdHJpbmdcbiAgICAgLSBmcm9tIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCB0byB0aGUgc3RhcnQgb2YgdGhlIHNlZ21lbnRcbiAgICAgLSB0byAobnVtYmVyKSBsZW5ndGgsIGluIHBpeGVscywgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHBhdGggdG8gdGhlIGVuZCBvZiB0aGUgc2VnbWVudFxuICAgICAqKlxuICAgICA9IChzdHJpbmcpIHBhdGggc3RyaW5nIGRlZmluaXRpb24gZm9yIHRoZSBzZWdtZW50XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5nZXRTdWJwYXRoID0gZnVuY3Rpb24gKHBhdGgsIGZyb20sIHRvKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFRvdGFsTGVuZ3RoKHBhdGgpIC0gdG8gPCAxZS02KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3VicGF0aHNBdExlbmd0aChwYXRoLCBmcm9tKS5lbmQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBnZXRTdWJwYXRoc0F0TGVuZ3RoKHBhdGgsIHRvLCAxKTtcbiAgICAgICAgcmV0dXJuIGZyb20gPyBnZXRTdWJwYXRoc0F0TGVuZ3RoKGEsIGZyb20pLmVuZCA6IGE7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5nZXRUb3RhbExlbmd0aFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBwYXRoIGluIHBpeGVscyAob25seSB3b3JrcyBmb3IgYHBhdGhgIGVsZW1lbnRzKVxuICAgICA9IChudW1iZXIpIGxlbmd0aFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmdldFRvdGFsTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlLmdldFRvdGFsTGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIFNJRVJSQSBFbGVtZW50LmdldFBvaW50QXRMZW5ndGgoKS9FbGVtZW50LmdldFRvdGFsTGVuZ3RoKCk6IElmIGEgPHBhdGg+IGlzIGJyb2tlbiBpbnRvIGRpZmZlcmVudCBzZWdtZW50cywgaXMgdGhlIGp1bXAgZGlzdGFuY2UgdG8gdGhlIG5ldyBjb29yZGluYXRlcyBzZXQgYnkgdGhlIF9NXyBvciBfbV8gY29tbWFuZHMgY2FsY3VsYXRlZCBhcyBwYXJ0IG9mIHRoZSBwYXRoJ3MgdG90YWwgbGVuZ3RoP1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmdldFBvaW50QXRMZW5ndGhcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50IGxvY2F0ZWQgYXQgdGhlIGdpdmVuIGxlbmd0aCBvbiB0aGUgZ2l2ZW4gcGF0aCAob25seSB3b3JrcyBmb3IgYHBhdGhgIGVsZW1lbnRzKVxuICAgICAqKlxuICAgICAtIGxlbmd0aCAobnVtYmVyKSBsZW5ndGgsIGluIHBpeGVscywgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHBhdGgsIGV4Y2x1ZGluZyBub24tcmVuZGVyaW5nIGp1bXBzXG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHBvaW50OlxuICAgICBvIHtcbiAgICAgbyAgICAgeDogKG51bWJlcikgeCBjb29yZGluYXRlLFxuICAgICBvICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUsXG4gICAgIG8gICAgIGFscGhhOiAobnVtYmVyKSBhbmdsZSBvZiBkZXJpdmF0aXZlXG4gICAgIG8gfVxuICAgIFxcKi9cbiAgICBlbHByb3RvLmdldFBvaW50QXRMZW5ndGggPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBnZXRQb2ludEF0TGVuZ3RoKHRoaXMuYXR0cihcImRcIiksIGxlbmd0aCk7XG4gICAgfTtcbiAgICAvLyBTSUVSUkEgRWxlbWVudC5nZXRTdWJwYXRoKCk6IFNpbWlsYXIgdG8gdGhlIHByb2JsZW0gZm9yIEVsZW1lbnQuZ2V0UG9pbnRBdExlbmd0aCgpLiBVbmNsZWFyIGhvdyB0aGlzIHdvdWxkIHdvcmsgZm9yIGEgc2VnbWVudGVkIHBhdGguIE92ZXJhbGwsIHRoZSBjb25jZXB0IG9mIF9zdWJwYXRoXyBhbmQgd2hhdCBJJ20gY2FsbGluZyBhIF9zZWdtZW50XyAoc2VyaWVzIG9mIG5vbi1fTV8gb3IgX1pfIGNvbW1hbmRzKSBpcyB1bmNsZWFyLlxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmdldFN1YnBhdGhcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgc3VicGF0aCBvZiBhIGdpdmVuIGVsZW1lbnQgZnJvbSBnaXZlbiBzdGFydCBhbmQgZW5kIGxlbmd0aHMgKG9ubHkgd29ya3MgZm9yIGBwYXRoYCBlbGVtZW50cylcbiAgICAgKipcbiAgICAgLSBmcm9tIChudW1iZXIpIGxlbmd0aCwgaW4gcGl4ZWxzLCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgcGF0aCB0byB0aGUgc3RhcnQgb2YgdGhlIHNlZ21lbnRcbiAgICAgLSB0byAobnVtYmVyKSBsZW5ndGgsIGluIHBpeGVscywgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHBhdGggdG8gdGhlIGVuZCBvZiB0aGUgc2VnbWVudFxuICAgICAqKlxuICAgICA9IChzdHJpbmcpIHBhdGggc3RyaW5nIGRlZmluaXRpb24gZm9yIHRoZSBzZWdtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uZ2V0U3VicGF0aCA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgICByZXR1cm4gU25hcC5wYXRoLmdldFN1YnBhdGgodGhpcy5hdHRyKFwiZFwiKSwgZnJvbSwgdG8pO1xuICAgIH07XG4gICAgU25hcC5fLmJveCA9IGJveDtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmZpbmREb3RzQXRTZWdtZW50XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIEZpbmRzIGRvdCBjb29yZGluYXRlcyBvbiB0aGUgZ2l2ZW4gY3ViaWMgYmV6acOpciBjdXJ2ZSBhdCB0aGUgZ2l2ZW4gdFxuICAgICAtIHAxeCAobnVtYmVyKSB4IG9mIHRoZSBmaXJzdCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSBwMXkgKG51bWJlcikgeSBvZiB0aGUgZmlyc3QgcG9pbnQgb2YgdGhlIGN1cnZlXG4gICAgIC0gYzF4IChudW1iZXIpIHggb2YgdGhlIGZpcnN0IGFuY2hvciBvZiB0aGUgY3VydmVcbiAgICAgLSBjMXkgKG51bWJlcikgeSBvZiB0aGUgZmlyc3QgYW5jaG9yIG9mIHRoZSBjdXJ2ZVxuICAgICAtIGMyeCAobnVtYmVyKSB4IG9mIHRoZSBzZWNvbmQgYW5jaG9yIG9mIHRoZSBjdXJ2ZVxuICAgICAtIGMyeSAobnVtYmVyKSB5IG9mIHRoZSBzZWNvbmQgYW5jaG9yIG9mIHRoZSBjdXJ2ZVxuICAgICAtIHAyeCAobnVtYmVyKSB4IG9mIHRoZSBzZWNvbmQgcG9pbnQgb2YgdGhlIGN1cnZlXG4gICAgIC0gcDJ5IChudW1iZXIpIHkgb2YgdGhlIHNlY29uZCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSB0IChudW1iZXIpIHBvc2l0aW9uIG9uIHRoZSBjdXJ2ZSAoMC4uMSlcbiAgICAgPSAob2JqZWN0KSBwb2ludCBpbmZvcm1hdGlvbiBpbiBmb3JtYXQ6XG4gICAgIG8ge1xuICAgICBvICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LFxuICAgICBvICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LFxuICAgICBvICAgICBtOiB7XG4gICAgIG8gICAgICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgYW5jaG9yLFxuICAgICBvICAgICAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IGFuY2hvclxuICAgICBvICAgICB9LFxuICAgICBvICAgICBuOiB7XG4gICAgIG8gICAgICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IGFuY2hvcixcbiAgICAgbyAgICAgICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgYW5jaG9yXG4gICAgIG8gICAgIH0sXG4gICAgIG8gICAgIHN0YXJ0OiB7XG4gICAgIG8gICAgICAgICB4OiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHN0YXJ0IG9mIHRoZSBjdXJ2ZSxcbiAgICAgbyAgICAgICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgc3RhcnQgb2YgdGhlIGN1cnZlXG4gICAgIG8gICAgIH0sXG4gICAgIG8gICAgIGVuZDoge1xuICAgICBvICAgICAgICAgeDogKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSBlbmQgb2YgdGhlIGN1cnZlLFxuICAgICBvICAgICAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBlbmQgb2YgdGhlIGN1cnZlXG4gICAgIG8gICAgIH0sXG4gICAgIG8gICAgIGFscGhhOiAobnVtYmVyKSBhbmdsZSBvZiB0aGUgY3VydmUgZGVyaXZhdGl2ZSBhdCB0aGUgcG9pbnRcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5maW5kRG90c0F0U2VnbWVudCA9IGZpbmREb3RzQXRTZWdtZW50O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguYmV6aWVyQkJveFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIHRoZSBib3VuZGluZyBib3ggb2YgYSBnaXZlbiBjdWJpYyBiZXppw6lyIGN1cnZlXG4gICAgIC0gcDF4IChudW1iZXIpIHggb2YgdGhlIGZpcnN0IHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAtIHAxeSAobnVtYmVyKSB5IG9mIHRoZSBmaXJzdCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSBjMXggKG51bWJlcikgeCBvZiB0aGUgZmlyc3QgYW5jaG9yIG9mIHRoZSBjdXJ2ZVxuICAgICAtIGMxeSAobnVtYmVyKSB5IG9mIHRoZSBmaXJzdCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gYzJ4IChudW1iZXIpIHggb2YgdGhlIHNlY29uZCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gYzJ5IChudW1iZXIpIHkgb2YgdGhlIHNlY29uZCBhbmNob3Igb2YgdGhlIGN1cnZlXG4gICAgIC0gcDJ4IChudW1iZXIpIHggb2YgdGhlIHNlY29uZCBwb2ludCBvZiB0aGUgY3VydmVcbiAgICAgLSBwMnkgKG51bWJlcikgeSBvZiB0aGUgc2Vjb25kIHBvaW50IG9mIHRoZSBjdXJ2ZVxuICAgICAqIG9yXG4gICAgIC0gYmV6IChhcnJheSkgYXJyYXkgb2Ygc2l4IHBvaW50cyBmb3IgYmV6acOpciBjdXJ2ZVxuICAgICA9IChvYmplY3QpIGJvdW5kaW5nIGJveFxuICAgICBvIHtcbiAgICAgbyAgICAgeDogKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IHRvcCBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB5OiAobnVtYmVyKSB5IGNvb3JkaW5hdGUgb2YgdGhlIGxlZnQgdG9wIHBvaW50IG9mIHRoZSBib3gsXG4gICAgIG8gICAgIHgyOiAobnVtYmVyKSB4IGNvb3JkaW5hdGUgb2YgdGhlIHJpZ2h0IGJvdHRvbSBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB5MjogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSByaWdodCBib3R0b20gcG9pbnQgb2YgdGhlIGJveCxcbiAgICAgbyAgICAgd2lkdGg6IChudW1iZXIpIHdpZHRoIG9mIHRoZSBib3gsXG4gICAgIG8gICAgIGhlaWdodDogKG51bWJlcikgaGVpZ2h0IG9mIHRoZSBib3hcbiAgICAgbyB9XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5iZXppZXJCQm94ID0gYmV6aWVyQkJveDtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmlzUG9pbnRJbnNpZGVCQm94XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIHBvaW50IGlzIGluc2lkZSBib3VuZGluZyBib3hcbiAgICAgLSBiYm94IChzdHJpbmcpIGJvdW5kaW5nIGJveFxuICAgICAtIHggKHN0cmluZykgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxuICAgICAtIHkgKHN0cmluZykgeSBjb29yZGluYXRlIG9mIHRoZSBwb2ludFxuICAgICA9IChib29sZWFuKSBgdHJ1ZWAgaWYgcG9pbnQgaXMgaW5zaWRlXG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5pc1BvaW50SW5zaWRlQkJveCA9IGlzUG9pbnRJbnNpZGVCQm94O1xuICAgIFNuYXAuY2xvc2VzdCA9IGZ1bmN0aW9uICh4LCB5LCBYLCBZKSB7XG4gICAgICAgIHZhciByID0gMTAwLFxuICAgICAgICAgICAgYiA9IGJveCh4IC0gciAvIDIsIHkgLSByIC8gMiwgciwgciksXG4gICAgICAgICAgICBpbnNpZGUgPSBbXSxcbiAgICAgICAgICAgIGdldHRlciA9IFhbMF0uaGFzT3duUHJvcGVydHkoXCJ4XCIpID8gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBYW2ldLngsXG4gICAgICAgICAgICAgICAgICAgIHk6IFhbaV0ueVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IDogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB4OiBYW2ldLFxuICAgICAgICAgICAgICAgICAgICB5OiBZW2ldXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3VuZCA9IDA7XG4gICAgICAgIHdoaWxlIChyIDw9IDFlNiAmJiAhZm91bmQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IFgubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB4eSA9IGdldHRlcihpKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQb2ludEluc2lkZUJCb3goYiwgeHkueCwgeHkueSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQrKztcbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlLnB1c2goeHkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgciAqPSAyO1xuICAgICAgICAgICAgICAgIGIgPSBib3goeCAtIHIgLyAyLCB5IC0gciAvIDIsIHIsIHIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIgPT0gMWU2KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgcmVzO1xuICAgICAgICBmb3IgKGkgPSAwLCBpaSA9IGluc2lkZS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbCA9IFNuYXAubGVuKHgsIHksIGluc2lkZVtpXS54LCBpbnNpZGVbaV0ueSk7XG4gICAgICAgICAgICBpZiAobGVuID4gbCkge1xuICAgICAgICAgICAgICAgIGxlbiA9IGw7XG4gICAgICAgICAgICAgICAgaW5zaWRlW2ldLmxlbiA9IGw7XG4gICAgICAgICAgICAgICAgcmVzID0gaW5zaWRlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmlzQkJveEludGVyc2VjdFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0d28gYm91bmRpbmcgYm94ZXMgaW50ZXJzZWN0XG4gICAgIC0gYmJveDEgKHN0cmluZykgZmlyc3QgYm91bmRpbmcgYm94XG4gICAgIC0gYmJveDIgKHN0cmluZykgc2Vjb25kIGJvdW5kaW5nIGJveFxuICAgICA9IChib29sZWFuKSBgdHJ1ZWAgaWYgYm91bmRpbmcgYm94ZXMgaW50ZXJzZWN0XG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5pc0JCb3hJbnRlcnNlY3QgPSBpc0JCb3hJbnRlcnNlY3Q7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC5pbnRlcnNlY3Rpb25cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogRmluZHMgaW50ZXJzZWN0aW9ucyBvZiB0d28gcGF0aHNcbiAgICAgLSBwYXRoMSAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICAtIHBhdGgyIChzdHJpbmcpIHBhdGggc3RyaW5nXG4gICAgID0gKGFycmF5KSBkb3RzIG9mIGludGVyc2VjdGlvblxuICAgICBvIFtcbiAgICAgbyAgICAge1xuICAgICBvICAgICAgICAgeDogKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCxcbiAgICAgbyAgICAgICAgIHk6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQsXG4gICAgIG8gICAgICAgICB0MTogKG51bWJlcikgdCB2YWx1ZSBmb3Igc2VnbWVudCBvZiBwYXRoMSxcbiAgICAgbyAgICAgICAgIHQyOiAobnVtYmVyKSB0IHZhbHVlIGZvciBzZWdtZW50IG9mIHBhdGgyLFxuICAgICBvICAgICAgICAgc2VnbWVudDE6IChudW1iZXIpIG9yZGVyIG51bWJlciBmb3Igc2VnbWVudCBvZiBwYXRoMSxcbiAgICAgbyAgICAgICAgIHNlZ21lbnQyOiAobnVtYmVyKSBvcmRlciBudW1iZXIgZm9yIHNlZ21lbnQgb2YgcGF0aDIsXG4gICAgIG8gICAgICAgICBiZXoxOiAoYXJyYXkpIGVpZ2h0IGNvb3JkaW5hdGVzIHJlcHJlc2VudGluZyBiZXppw6lyIGN1cnZlIGZvciB0aGUgc2VnbWVudCBvZiBwYXRoMSxcbiAgICAgbyAgICAgICAgIGJlejI6IChhcnJheSkgZWlnaHQgY29vcmRpbmF0ZXMgcmVwcmVzZW50aW5nIGJlemnDqXIgY3VydmUgZm9yIHRoZSBzZWdtZW50IG9mIHBhdGgyXG4gICAgIG8gICAgIH1cbiAgICAgbyBdXG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC5pbnRlcnNlY3Rpb24gPSBwYXRoSW50ZXJzZWN0aW9uO1xuICAgIFNuYXAucGF0aC5pbnRlcnNlY3Rpb25OdW1iZXIgPSBwYXRoSW50ZXJzZWN0aW9uTnVtYmVyO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGguaXNQb2ludEluc2lkZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBnaXZlbiBwb2ludCBpcyBpbnNpZGUgYSBnaXZlbiBjbG9zZWQgcGF0aC5cbiAgICAgKlxuICAgICAqIE5vdGU6IGZpbGwgbW9kZSBkb2VzbuKAmXQgYWZmZWN0IHRoZSByZXN1bHQgb2YgdGhpcyBtZXRob2QuXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICAtIHggKG51bWJlcikgeCBvZiB0aGUgcG9pbnRcbiAgICAgLSB5IChudW1iZXIpIHkgb2YgdGhlIHBvaW50XG4gICAgID0gKGJvb2xlYW4pIGB0cnVlYCBpZiBwb2ludCBpcyBpbnNpZGUgdGhlIHBhdGhcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLmlzUG9pbnRJbnNpZGUgPSBpc1BvaW50SW5zaWRlUGF0aDtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLmdldEJCb3hcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogUmV0dXJucyB0aGUgYm91bmRpbmcgYm94IG9mIGEgZ2l2ZW4gcGF0aFxuICAgICAtIHBhdGggKHN0cmluZykgcGF0aCBzdHJpbmdcbiAgICAgPSAob2JqZWN0KSBib3VuZGluZyBib3hcbiAgICAgbyB7XG4gICAgIG8gICAgIHg6IChudW1iZXIpIHggY29vcmRpbmF0ZSBvZiB0aGUgbGVmdCB0b3AgcG9pbnQgb2YgdGhlIGJveCxcbiAgICAgbyAgICAgeTogKG51bWJlcikgeSBjb29yZGluYXRlIG9mIHRoZSBsZWZ0IHRvcCBwb2ludCBvZiB0aGUgYm94LFxuICAgICBvICAgICB4MjogKG51bWJlcikgeCBjb29yZGluYXRlIG9mIHRoZSByaWdodCBib3R0b20gcG9pbnQgb2YgdGhlIGJveCxcbiAgICAgbyAgICAgeTI6IChudW1iZXIpIHkgY29vcmRpbmF0ZSBvZiB0aGUgcmlnaHQgYm90dG9tIHBvaW50IG9mIHRoZSBib3gsXG4gICAgIG8gICAgIHdpZHRoOiAobnVtYmVyKSB3aWR0aCBvZiB0aGUgYm94LFxuICAgICBvICAgICBoZWlnaHQ6IChudW1iZXIpIGhlaWdodCBvZiB0aGUgYm94XG4gICAgIG8gfVxuICAgIFxcKi9cbiAgICBTbmFwLnBhdGguZ2V0QkJveCA9IHBhdGhCQm94O1xuICAgIFNuYXAucGF0aC5nZXQgPSBnZXRQYXRoO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGgudG9SZWxhdGl2ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogVXRpbGl0eSBtZXRob2RcbiAgICAgKipcbiAgICAgKiBDb252ZXJ0cyBwYXRoIGNvb3JkaW5hdGVzIGludG8gcmVsYXRpdmUgdmFsdWVzXG4gICAgIC0gcGF0aCAoc3RyaW5nKSBwYXRoIHN0cmluZ1xuICAgICA9IChhcnJheSkgcGF0aCBzdHJpbmdcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLnRvUmVsYXRpdmUgPSBwYXRoVG9SZWxhdGl2ZTtcbiAgICAvKlxcXG4gICAgICogU25hcC5wYXRoLnRvQWJzb2x1dGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFV0aWxpdHkgbWV0aG9kXG4gICAgICoqXG4gICAgICogQ29udmVydHMgcGF0aCBjb29yZGluYXRlcyBpbnRvIGFic29sdXRlIHZhbHVlc1xuICAgICAtIHBhdGggKHN0cmluZykgcGF0aCBzdHJpbmdcbiAgICAgPSAoYXJyYXkpIHBhdGggc3RyaW5nXG4gICAgXFwqL1xuICAgIFNuYXAucGF0aC50b0Fic29sdXRlID0gcGF0aFRvQWJzb2x1dGU7XG4gICAgLypcXFxuICAgICAqIFNuYXAucGF0aC50b0N1YmljXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVdGlsaXR5IG1ldGhvZFxuICAgICAqKlxuICAgICAqIENvbnZlcnRzIHBhdGggdG8gYSBuZXcgcGF0aCB3aGVyZSBhbGwgc2VnbWVudHMgYXJlIGN1YmljIGJlemnDqXIgY3VydmVzXG4gICAgIC0gcGF0aFN0cmluZyAoc3RyaW5nfGFycmF5KSBwYXRoIHN0cmluZyBvciBhcnJheSBvZiBzZWdtZW50c1xuICAgICA9IChhcnJheSkgYXJyYXkgb2Ygc2VnbWVudHNcbiAgICBcXCovXG4gICAgU25hcC5wYXRoLnRvQ3ViaWMgPSBwYXRoMmN1cnZlO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLnBhdGgubWFwXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBUcmFuc2Zvcm0gdGhlIHBhdGggc3RyaW5nIHdpdGggdGhlIGdpdmVuIG1hdHJpeFxuICAgICAtIHBhdGggKHN0cmluZykgcGF0aCBzdHJpbmdcbiAgICAgLSBtYXRyaXggKG9iamVjdCkgc2VlIEBNYXRyaXhcbiAgICAgPSAoc3RyaW5nKSB0cmFuc2Zvcm1lZCBwYXRoIHN0cmluZ1xuICAgIFxcKi9cbiAgICBTbmFwLnBhdGgubWFwID0gbWFwUGF0aDtcbiAgICBTbmFwLnBhdGgudG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICBTbmFwLnBhdGguY2xvbmUgPSBwYXRoQ2xvbmU7XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XG4gICAgdmFyIG1tYXggPSBNYXRoLm1heCxcbiAgICAgICAgbW1pbiA9IE1hdGgubWluO1xuXG4gICAgLy8gU2V0XG4gICAgdmFyIFNldCA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG5cdHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLnR5cGUgPSBcInNldFwiO1xuICAgICAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGl0ZW1zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1t0aGlzLml0ZW1zLmxlbmd0aF0gPSB0aGlzLml0ZW1zW3RoaXMuaXRlbXMubGVuZ3RoXSA9IGl0ZW1zW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0cHJvdG8gPSBTZXQucHJvdG90eXBlO1xuICAgIC8qXFxcbiAgICAgKiBTZXQucHVzaFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBlYWNoIGFyZ3VtZW50IHRvIHRoZSBjdXJyZW50IHNldFxuICAgICA9IChvYmplY3QpIG9yaWdpbmFsIGVsZW1lbnRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8ucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW0sXG4gICAgICAgICAgICBsZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzW2xlbl0gPSB0aGlzLml0ZW1zW2xlbl0gPSBpdGVtO1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LnBvcFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBsYXN0IGVsZW1lbnQgYW5kIHJldHVybnMgaXRcbiAgICAgPSAob2JqZWN0KSBlbGVtZW50XG4gICAgXFwqL1xuICAgIHNldHByb3RvLnBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggJiYgZGVsZXRlIHRoaXNbdGhpcy5sZW5ndGgtLV07XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLnBvcCgpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5mb3JFYWNoXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBFeGVjdXRlcyBnaXZlbiBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXRcbiAgICAgKlxuICAgICAqIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGBmYWxzZWAsIHRoZSBsb29wIHN0b3BzIHJ1bm5pbmcuXG4gICAgICoqXG4gICAgIC0gY2FsbGJhY2sgKGZ1bmN0aW9uKSBmdW5jdGlvbiB0byBydW5cbiAgICAgLSB0aGlzQXJnIChvYmplY3QpIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgY2FsbGJhY2tcbiAgICAgPSAob2JqZWN0KSBTZXQgb2JqZWN0XG4gICAgXFwqL1xuICAgIHNldHByb3RvLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5pdGVtcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLml0ZW1zW2ldLCBpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTZXQuYW5pbWF0ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQW5pbWF0ZXMgZWFjaCBlbGVtZW50IGluIHNldCBpbiBzeW5jLlxuICAgICAqXG4gICAgICoqXG4gICAgIC0gYXR0cnMgKG9iamVjdCkga2V5LXZhbHVlIHBhaXJzIG9mIGRlc3RpbmF0aW9uIGF0dHJpYnV0ZXNcbiAgICAgLSBkdXJhdGlvbiAobnVtYmVyKSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kc1xuICAgICAtIGVhc2luZyAoZnVuY3Rpb24pICNvcHRpb25hbCBlYXNpbmcgZnVuY3Rpb24gZnJvbSBAbWluYSBvciBjdXN0b21cbiAgICAgLSBjYWxsYmFjayAoZnVuY3Rpb24pICNvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGV4ZWN1dGVzIHdoZW4gdGhlIGFuaW1hdGlvbiBlbmRzXG4gICAgICogb3JcbiAgICAgLSBhbmltYXRpb24gKGFycmF5KSBhcnJheSBvZiBhbmltYXRpb24gcGFyYW1ldGVyIGZvciBlYWNoIGVsZW1lbnQgaW4gc2V0IGluIGZvcm1hdCBgW2F0dHJzLCBkdXJhdGlvbiwgZWFzaW5nLCBjYWxsYmFja11gXG4gICAgID4gVXNhZ2VcbiAgICAgfCAvLyBhbmltYXRlIGFsbCBlbGVtZW50cyBpbiBzZXQgdG8gcmFkaXVzIDEwXG4gICAgIHwgc2V0LmFuaW1hdGUoe3I6IDEwfSwgNTAwLCBtaW5hLmVhc2Vpbik7XG4gICAgIHwgLy8gb3JcbiAgICAgfCAvLyBhbmltYXRlIGZpcnN0IGVsZW1lbnQgdG8gcmFkaXVzIDEwLCBidXQgc2Vjb25kIHRvIHJhZGl1cyAyMCBhbmQgaW4gZGlmZmVyZW50IHRpbWVcbiAgICAgfCBzZXQuYW5pbWF0ZShbe3I6IDEwfSwgNTAwLCBtaW5hLmVhc2Vpbl0sIFt7cjogMjB9LCAxNTAwLCBtaW5hLmVhc2Vpbl0pO1xuICAgICA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIHNldHByb3RvLmFuaW1hdGUgPSBmdW5jdGlvbiAoYXR0cnMsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWFzaW5nID09IFwiZnVuY3Rpb25cIiAmJiAhZWFzaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBlYXNpbmc7XG4gICAgICAgICAgICBlYXNpbmcgPSBtaW5hLmxpbmVhcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cnMgaW5zdGFuY2VvZiBTbmFwLl8uQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGF0dHJzLmNhbGxiYWNrO1xuICAgICAgICAgICAgZWFzaW5nID0gYXR0cnMuZWFzaW5nO1xuICAgICAgICAgICAgbXMgPSBlYXNpbmcuZHVyO1xuICAgICAgICAgICAgYXR0cnMgPSBhdHRycy5hdHRyO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAoU25hcC5pcyhhdHRycywgXCJhcnJheVwiKSAmJiBTbmFwLmlzKGFyZ3NbYXJncy5sZW5ndGggLSAxXSwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgdmFyIGVhY2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBiZWdpbixcbiAgICAgICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJlZ2luKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYiA9IGJlZ2luO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luID0gdGhpcy5iO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYiA9IDAsXG4gICAgICAgICAgICBzZXQgPSB0aGlzLFxuICAgICAgICAgICAgY2FsbGJhY2tlciA9IGNhbGxiYWNrICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoKytjYiA9PSBzZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGkpIHtcbiAgICAgICAgICAgIGV2ZS5vbmNlKFwic25hcC5hbmltY3JlYXRlZC5cIiArIGVsLmlkLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIGlmIChlYWNoKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tpXSAmJiBlbC5hbmltYXRlLmFwcGx5KGVsLCBhcmdzW2ldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwuYW5pbWF0ZShhdHRycywgbXMsIGVhc2luZywgY2FsbGJhY2tlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5yZW1vdmVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYWxsIGNoaWxkcmVuIG9mIHRoZSBzZXQuXG4gICAgICpcbiAgICAgPSAob2JqZWN0KSBTZXQgb2JqZWN0XG4gICAgXFwqL1xuICAgIHNldHByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcCgpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5iaW5kXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBTcGVjaWZpZXMgaG93IHRvIGhhbmRsZSBhIHNwZWNpZmljIGF0dHJpYnV0ZSB3aGVuIGFwcGxpZWRcbiAgICAgKiB0byBhIHNldC5cbiAgICAgKlxuICAgICAqKlxuICAgICAtIGF0dHIgKHN0cmluZykgYXR0cmlidXRlIG5hbWVcbiAgICAgLSBjYWxsYmFjayAoZnVuY3Rpb24pIGZ1bmN0aW9uIHRvIHJ1blxuICAgICAqIG9yXG4gICAgIC0gYXR0ciAoc3RyaW5nKSBhdHRyaWJ1dGUgbmFtZVxuICAgICAtIGVsZW1lbnQgKEVsZW1lbnQpIHNwZWNpZmljIGVsZW1lbnQgaW4gdGhlIHNldCB0byBhcHBseSB0aGUgYXR0cmlidXRlIHRvXG4gICAgICogb3JcbiAgICAgLSBhdHRyIChzdHJpbmcpIGF0dHJpYnV0ZSBuYW1lXG4gICAgIC0gZWxlbWVudCAoRWxlbWVudCkgc3BlY2lmaWMgZWxlbWVudCBpbiB0aGUgc2V0IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGUgdG9cbiAgICAgLSBlYXR0ciAoc3RyaW5nKSBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQgdG8gYmluZCB0aGUgYXR0cmlidXRlIHRvXG4gICAgID0gKG9iamVjdCkgU2V0IG9iamVjdFxuICAgIFxcKi9cbiAgICBzZXRwcm90by5iaW5kID0gZnVuY3Rpb24gKGF0dHIsIGEsIGIpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy5iaW5kaW5nc1thdHRyXSA9IGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYW5hbWUgPSBiIHx8IGF0dHI7XG4gICAgICAgICAgICB0aGlzLmJpbmRpbmdzW2F0dHJdID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2FuYW1lXSA9IHY7XG4gICAgICAgICAgICAgICAgYS5hdHRyKGRhdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTZXQuYXR0clxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogRXF1aXZhbGVudCBvZiBARWxlbWVudC5hdHRyLlxuICAgICA9IChvYmplY3QpIFNldCBvYmplY3RcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uYXR0ciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgdW5ib3VuZCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kaW5nc1trXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZGluZ3Nba10odmFsdWVba10pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bmJvdW5kW2tdID0gdmFsdWVba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5pdGVtcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zW2ldLmF0dHIodW5ib3VuZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU2V0LmNsZWFyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBzZXRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5zcGxpY2VcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgcmFuZ2Ugb2YgZWxlbWVudHMgZnJvbSB0aGUgc2V0XG4gICAgICoqXG4gICAgIC0gaW5kZXggKG51bWJlcikgcG9zaXRpb24gb2YgdGhlIGRlbGV0aW9uXG4gICAgIC0gY291bnQgKG51bWJlcikgbnVtYmVyIG9mIGVsZW1lbnQgdG8gcmVtb3ZlXG4gICAgIC0gaW5zZXJ0aW9u4oCmIChvYmplY3QpICNvcHRpb25hbCBlbGVtZW50cyB0byBpbnNlcnRcbiAgICAgPSAob2JqZWN0KSBzZXQgZWxlbWVudHMgdGhhdCB3ZXJlIGRlbGV0ZWRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uc3BsaWNlID0gZnVuY3Rpb24gKGluZGV4LCBjb3VudCwgaW5zZXJ0aW9uKSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXggPCAwID8gbW1heCh0aGlzLmxlbmd0aCArIGluZGV4LCAwKSA6IGluZGV4O1xuICAgICAgICBjb3VudCA9IG1tYXgoMCwgbW1pbih0aGlzLmxlbmd0aCAtIGluZGV4LCBjb3VudCkpO1xuICAgICAgICB2YXIgdGFpbCA9IFtdLFxuICAgICAgICAgICAgdG9kZWwgPSBbXSxcbiAgICAgICAgICAgIGFyZ3MgPSBbXSxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB0b2RlbC5wdXNoKHRoaXNbaW5kZXggKyBpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLmxlbmd0aCAtIGluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIHRhaWwucHVzaCh0aGlzW2luZGV4ICsgaV0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmdzLmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ2xlbiArIHRhaWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNbaW5kZXggKyBpXSA9IHRoaXNbaW5kZXggKyBpXSA9IGkgPCBhcmdsZW4gPyBhcmdzW2ldIDogdGFpbFtpIC0gYXJnbGVuXTtcbiAgICAgICAgfVxuICAgICAgICBpID0gdGhpcy5pdGVtcy5sZW5ndGggPSB0aGlzLmxlbmd0aCAtPSBjb3VudCAtIGFyZ2xlbjtcbiAgICAgICAgd2hpbGUgKHRoaXNbaV0pIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzW2krK107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTZXQodG9kZWwpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5leGNsdWRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGdpdmVuIGVsZW1lbnQgZnJvbSB0aGUgc2V0XG4gICAgICoqXG4gICAgIC0gZWxlbWVudCAob2JqZWN0KSBlbGVtZW50IHRvIHJlbW92ZVxuICAgICA9IChib29sZWFuKSBgdHJ1ZWAgaWYgb2JqZWN0IHdhcyBmb3VuZCBhbmQgcmVtb3ZlZCBmcm9tIHRoZSBzZXRcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uZXhjbHVkZSA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB0aGlzLmxlbmd0aDsgaSA8IGlpOyBpKyspIGlmICh0aGlzW2ldID09IGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTZXQuaW5zZXJ0QWZ0ZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEluc2VydHMgc2V0IGVsZW1lbnRzIGFmdGVyIGdpdmVuIGVsZW1lbnQuXG4gICAgICoqXG4gICAgIC0gZWxlbWVudCAob2JqZWN0KSBzZXQgd2lsbCBiZSBpbnNlcnRlZCBhZnRlciB0aGlzIGVsZW1lbnRcbiAgICAgPSAob2JqZWN0KSBTZXQgb2JqZWN0XG4gICAgXFwqL1xuICAgIHNldHByb3RvLmluc2VydEFmdGVyID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNbaV0uaW5zZXJ0QWZ0ZXIoZWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5nZXRCQm94XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBVbmlvbiBvZiBhbGwgYmJveGVzIG9mIHRoZSBzZXQuIFNlZSBARWxlbWVudC5nZXRCQm94LlxuICAgICA9IChvYmplY3QpIGJvdW5kaW5nIGJveCBkZXNjcmlwdG9yLiBTZWUgQEVsZW1lbnQuZ2V0QkJveC5cbiAgICBcXCovXG4gICAgc2V0cHJvdG8uZ2V0QkJveCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHggPSBbXSxcbiAgICAgICAgICAgIHkgPSBbXSxcbiAgICAgICAgICAgIHgyID0gW10sXG4gICAgICAgICAgICB5MiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5pdGVtcy5sZW5ndGg7IGktLTspIGlmICghdGhpcy5pdGVtc1tpXS5yZW1vdmVkKSB7XG4gICAgICAgICAgICB2YXIgYm94ID0gdGhpcy5pdGVtc1tpXS5nZXRCQm94KCk7XG4gICAgICAgICAgICB4LnB1c2goYm94LngpO1xuICAgICAgICAgICAgeS5wdXNoKGJveC55KTtcbiAgICAgICAgICAgIHgyLnB1c2goYm94LnggKyBib3gud2lkdGgpO1xuICAgICAgICAgICAgeTIucHVzaChib3gueSArIGJveC5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHggPSBtbWluLmFwcGx5KDAsIHgpO1xuICAgICAgICB5ID0gbW1pbi5hcHBseSgwLCB5KTtcbiAgICAgICAgeDIgPSBtbWF4LmFwcGx5KDAsIHgyKTtcbiAgICAgICAgeTIgPSBtbWF4LmFwcGx5KDAsIHkyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgeDI6IHgyLFxuICAgICAgICAgICAgeTI6IHkyLFxuICAgICAgICAgICAgd2lkdGg6IHgyIC0geCxcbiAgICAgICAgICAgIGhlaWdodDogeTIgLSB5LFxuICAgICAgICAgICAgY3g6IHggKyAoeDIgLSB4KSAvIDIsXG4gICAgICAgICAgICBjeTogeSArICh5MiAtIHkpIC8gMlxuICAgICAgICB9O1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNldC5pbnNlcnRBZnRlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBzZXQuXG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgTmV3IFNldCBvYmplY3RcbiAgICBcXCovXG4gICAgc2V0cHJvdG8uY2xvbmUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBzID0gbmV3IFNldDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5pdGVtcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBzLnB1c2godGhpcy5pdGVtc1tpXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9O1xuICAgIHNldHByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJTbmFwXFx1MjAxOHMgc2V0XCI7XG4gICAgfTtcbiAgICBzZXRwcm90by50eXBlID0gXCJzZXRcIjtcbiAgICAvLyBleHBvcnRcbiAgICAvKlxcXG4gICAgICogU25hcC5TZXRcbiAgICAgWyBwcm9wZXJ0eSBdXG4gICAgICoqXG4gICAgICogU2V0IGNvbnN0cnVjdG9yLlxuICAgIFxcKi9cbiAgICBTbmFwLlNldCA9IFNldDtcbiAgICAvKlxcXG4gICAgICogU25hcC5zZXRcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIENyZWF0ZXMgYSBzZXQgYW5kIGZpbGxzIGl0IHdpdGggbGlzdCBvZiBhcmd1bWVudHMuXG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgTmV3IFNldCBvYmplY3RcbiAgICAgfCB2YXIgciA9IHBhcGVyLnJlY3QoMCwgMCwgMTAsIDEwKSxcbiAgICAgfCAgICAgczEgPSBTbmFwLnNldCgpLCAvLyBlbXB0eSBzZXRcbiAgICAgfCAgICAgczIgPSBTbmFwLnNldChyLCBwYXBlci5jaXJjbGUoMTAwLCAxMDAsIDIwKSk7IC8vIHByZWZpbGxlZCBzZXRcbiAgICBcXCovXG4gICAgU25hcC5zZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgc2V0LnB1c2guYXBwbHkoc2V0LCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0O1xuICAgIH07XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDEzIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XG4gICAgdmFyIG5hbWVzID0ge30sXG4gICAgICAgIHJlVW5pdCA9IC9bJWEtel0rJC9pLFxuICAgICAgICBTdHIgPSBTdHJpbmc7XG4gICAgbmFtZXMuc3Ryb2tlID0gbmFtZXMuZmlsbCA9IFwiY29sb3VyXCI7XG4gICAgZnVuY3Rpb24gZ2V0RW1wdHkoaXRlbSkge1xuICAgICAgICB2YXIgbCA9IGl0ZW1bMF07XG4gICAgICAgIHN3aXRjaCAobC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwidFwiOiByZXR1cm4gW2wsIDAsIDBdO1xuICAgICAgICAgICAgY2FzZSBcIm1cIjogcmV0dXJuIFtsLCAxLCAwLCAwLCAxLCAwLCAwXTtcbiAgICAgICAgICAgIGNhc2UgXCJyXCI6IGlmIChpdGVtLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsLCAwLCBpdGVtWzJdLCBpdGVtWzNdXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsLCAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJzXCI6IGlmIChpdGVtLmxlbmd0aCA9PSA1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsLCAxLCAxLCBpdGVtWzNdLCBpdGVtWzRdXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5sZW5ndGggPT0gMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbCwgMSwgMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbCwgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZXF1YWxpc2VUcmFuc2Zvcm0odDEsIHQyLCBnZXRCQm94KSB7XG4gICAgICAgIHQxID0gdDEgfHwgbmV3IFNuYXAuTWF0cml4O1xuICAgICAgICB0MiA9IHQyIHx8IG5ldyBTbmFwLk1hdHJpeDtcbiAgICAgICAgdDEgPSBTbmFwLnBhcnNlVHJhbnNmb3JtU3RyaW5nKHQxLnRvVHJhbnNmb3JtU3RyaW5nKCkpIHx8IFtdO1xuICAgICAgICB0MiA9IFNuYXAucGFyc2VUcmFuc2Zvcm1TdHJpbmcodDIudG9UcmFuc2Zvcm1TdHJpbmcoKSkgfHwgW107XG4gICAgICAgIHZhciBtYXhsZW5ndGggPSBNYXRoLm1heCh0MS5sZW5ndGgsIHQyLmxlbmd0aCksXG4gICAgICAgICAgICBmcm9tID0gW10sXG4gICAgICAgICAgICB0byA9IFtdLFxuICAgICAgICAgICAgaSA9IDAsIGosIGpqLFxuICAgICAgICAgICAgdHQxLCB0dDI7XG4gICAgICAgIGZvciAoOyBpIDwgbWF4bGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHR0MSA9IHQxW2ldIHx8IGdldEVtcHR5KHQyW2ldKTtcbiAgICAgICAgICAgIHR0MiA9IHQyW2ldIHx8IGdldEVtcHR5KHR0MSk7XG4gICAgICAgICAgICBpZiAodHQxWzBdICE9IHR0MlswXSB8fFxuICAgICAgICAgICAgICAgIHR0MVswXS50b0xvd2VyQ2FzZSgpID09IFwiclwiICYmICh0dDFbMl0gIT0gdHQyWzJdIHx8IHR0MVszXSAhPSB0dDJbM10pIHx8XG4gICAgICAgICAgICAgICAgdHQxWzBdLnRvTG93ZXJDYXNlKCkgPT0gXCJzXCIgJiYgKHR0MVszXSAhPSB0dDJbM10gfHwgdHQxWzRdICE9IHR0Mls0XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdDEgPSBTbmFwLl8udHJhbnNmb3JtMm1hdHJpeCh0MSwgZ2V0QkJveCgpKTtcbiAgICAgICAgICAgICAgICAgICAgdDIgPSBTbmFwLl8udHJhbnNmb3JtMm1hdHJpeCh0MiwgZ2V0QkJveCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9IFtbXCJtXCIsIHQxLmEsIHQxLmIsIHQxLmMsIHQxLmQsIHQxLmUsIHQxLmZdXTtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBbW1wibVwiLCB0Mi5hLCB0Mi5iLCB0Mi5jLCB0Mi5kLCB0Mi5lLCB0Mi5mXV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJvbVtpXSA9IFtdO1xuICAgICAgICAgICAgdG9baV0gPSBbXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGpqID0gTWF0aC5tYXgodHQxLmxlbmd0aCwgdHQyLmxlbmd0aCk7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICAgICAgaiBpbiB0dDEgJiYgKGZyb21baV1bal0gPSB0dDFbal0pO1xuICAgICAgICAgICAgICAgIGogaW4gdHQyICYmICh0b1tpXVtqXSA9IHR0MltqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZyb206IHBhdGgyYXJyYXkoZnJvbSksXG4gICAgICAgICAgICB0bzogcGF0aDJhcnJheSh0byksXG4gICAgICAgICAgICBmOiBnZXRQYXRoKGZyb20pXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE51bWJlcih2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VW5pdCh1bml0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gK3ZhbC50b0ZpeGVkKDMpICsgdW5pdDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Vmlld0JveCh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5qb2luKFwiIFwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Q29sb3VyKGNscikge1xuICAgICAgICByZXR1cm4gU25hcC5yZ2IoY2xyWzBdLCBjbHJbMV0sIGNsclsyXSwgY2xyWzNdKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0UGF0aChwYXRoKSB7XG4gICAgICAgIHZhciBrID0gMCwgaSwgaWksIGosIGpqLCBvdXQsIGEsIGIgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgaWkgPSBwYXRoLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIG91dCA9IFwiW1wiO1xuICAgICAgICAgICAgYSA9IFsnXCInICsgcGF0aFtpXVswXSArICdcIiddO1xuICAgICAgICAgICAgZm9yIChqID0gMSwgamogPSBwYXRoW2ldLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhW2pdID0gXCJ2YWxbXCIgKyBrKysgKyBcIl1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSBhICsgXCJdXCI7XG4gICAgICAgICAgICBiW2ldID0gb3V0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGdW5jdGlvbihcInZhbFwiLCBcInJldHVybiBTbmFwLnBhdGgudG9TdHJpbmcuY2FsbChbXCIgKyBiICsgXCJdKVwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGF0aDJhcnJheShwYXRoKSB7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcGF0aC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMSwgamogPSBwYXRoW2ldLmxlbmd0aDsgaiA8IGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgICBvdXQucHVzaChwYXRoW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc051bWVyaWMob2JqKSB7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZShvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhcnJheUVxdWFsKGFycjEsIGFycjIpIHtcbiAgICAgICAgaWYgKCFTbmFwLmlzKGFycjEsIFwiYXJyYXlcIikgfHwgIVNuYXAuaXMoYXJyMiwgXCJhcnJheVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnIxLnRvU3RyaW5nKCkgPT0gYXJyMi50b1N0cmluZygpO1xuICAgIH1cbiAgICBFbGVtZW50LnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uIChuYW1lLCBiKSB7XG4gICAgICAgIHJldHVybiBldmUoXCJzbmFwLnV0aWwuZXF1YWxcIiwgdGhpcywgbmFtZSwgYikuZmlyc3REZWZpbmVkKCk7XG4gICAgfTtcbiAgICBldmUub24oXCJzbmFwLnV0aWwuZXF1YWxcIiwgZnVuY3Rpb24gKG5hbWUsIGIpIHtcbiAgICAgICAgdmFyIEEsIEIsIGEgPSBTdHIodGhpcy5hdHRyKG5hbWUpIHx8IFwiXCIpLFxuICAgICAgICAgICAgZWwgPSB0aGlzO1xuICAgICAgICBpZiAobmFtZXNbbmFtZV0gPT0gXCJjb2xvdXJcIikge1xuICAgICAgICAgICAgQSA9IFNuYXAuY29sb3IoYSk7XG4gICAgICAgICAgICBCID0gU25hcC5jb2xvcihiKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnJvbTogW0EuciwgQS5nLCBBLmIsIEEub3BhY2l0eV0sXG4gICAgICAgICAgICAgICAgdG86IFtCLnIsIEIuZywgQi5iLCBCLm9wYWNpdHldLFxuICAgICAgICAgICAgICAgIGY6IGdldENvbG91clxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcInZpZXdCb3hcIikge1xuICAgICAgICAgICAgQSA9IHRoaXMuYXR0cihuYW1lKS52Yi5zcGxpdChcIiBcIikubWFwKE51bWJlcik7XG4gICAgICAgICAgICBCID0gYi5zcGxpdChcIiBcIikubWFwKE51bWJlcik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZyb206IEEsXG4gICAgICAgICAgICAgICAgdG86IEIsXG4gICAgICAgICAgICAgICAgZjogZ2V0Vmlld0JveFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcInRyYW5zZm9ybVwiIHx8IG5hbWUgPT0gXCJncmFkaWVudFRyYW5zZm9ybVwiIHx8IG5hbWUgPT0gXCJwYXR0ZXJuVHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYiA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgYiA9IFN0cihiKS5yZXBsYWNlKC9cXC57M318XFx1MjAyNi9nLCBhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGEgPSB0aGlzLm1hdHJpeDtcbiAgICAgICAgICAgIGlmICghU25hcC5fLnJnVHJhbnNmb3JtLnRlc3QoYikpIHtcbiAgICAgICAgICAgICAgICBiID0gU25hcC5fLnRyYW5zZm9ybTJtYXRyaXgoU25hcC5fLnN2Z1RyYW5zZm9ybTJzdHJpbmcoYiksIHRoaXMuZ2V0QkJveCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYiA9IFNuYXAuXy50cmFuc2Zvcm0ybWF0cml4KGIsIHRoaXMuZ2V0QkJveCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlcXVhbGlzZVRyYW5zZm9ybShhLCBiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmdldEJCb3goMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcImRcIiB8fCBuYW1lID09IFwicGF0aFwiKSB7XG4gICAgICAgICAgICBBID0gU25hcC5wYXRoLnRvQ3ViaWMoYSwgYik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZyb206IHBhdGgyYXJyYXkoQVswXSksXG4gICAgICAgICAgICAgICAgdG86IHBhdGgyYXJyYXkoQVsxXSksXG4gICAgICAgICAgICAgICAgZjogZ2V0UGF0aChBWzBdKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50c1wiKSB7XG4gICAgICAgICAgICBBID0gU3RyKGEpLnNwbGl0KFNuYXAuXy5zZXBhcmF0b3IpO1xuICAgICAgICAgICAgQiA9IFN0cihiKS5zcGxpdChTbmFwLl8uc2VwYXJhdG9yKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnJvbTogQSxcbiAgICAgICAgICAgICAgICB0bzogQixcbiAgICAgICAgICAgICAgICBmOiBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWw7IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTnVtZXJpYyhhKSAmJiBpc051bWVyaWMoYikpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnJvbTogcGFyc2VGbG9hdChhKSxcbiAgICAgICAgICAgICAgICB0bzogcGFyc2VGbG9hdChiKSxcbiAgICAgICAgICAgICAgICBmOiBnZXROdW1iZXJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFVbml0ID0gYS5tYXRjaChyZVVuaXQpLFxuICAgICAgICAgICAgYlVuaXQgPSBTdHIoYikubWF0Y2gocmVVbml0KTtcbiAgICAgICAgaWYgKGFVbml0ICYmIGFycmF5RXF1YWwoYVVuaXQsIGJVbml0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmcm9tOiBwYXJzZUZsb2F0KGEpLFxuICAgICAgICAgICAgICAgIHRvOiBwYXJzZUZsb2F0KGIpLFxuICAgICAgICAgICAgICAgIGY6IGdldFVuaXQoYVVuaXQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmcm9tOiB0aGlzLmFzUFgobmFtZSksXG4gICAgICAgICAgICAgICAgdG86IHRoaXMuYXNQWChuYW1lLCBiKSxcbiAgICAgICAgICAgICAgICBmOiBnZXROdW1iZXJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBcbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vIFxuLy8gaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLyBcbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlLFxuICAgIGhhcyA9IFwiaGFzT3duUHJvcGVydHlcIixcbiAgICBzdXBwb3J0c1RvdWNoID0gXCJjcmVhdGVUb3VjaFwiIGluIGdsb2IuZG9jLFxuICAgIGV2ZW50cyA9IFtcbiAgICAgICAgXCJjbGlja1wiLCBcImRibGNsaWNrXCIsIFwibW91c2Vkb3duXCIsIFwibW91c2Vtb3ZlXCIsIFwibW91c2VvdXRcIixcbiAgICAgICAgXCJtb3VzZW92ZXJcIiwgXCJtb3VzZXVwXCIsIFwidG91Y2hzdGFydFwiLCBcInRvdWNobW92ZVwiLCBcInRvdWNoZW5kXCIsXG4gICAgICAgIFwidG91Y2hjYW5jZWxcIlxuICAgIF0sXG4gICAgdG91Y2hNYXAgPSB7XG4gICAgICAgIG1vdXNlZG93bjogXCJ0b3VjaHN0YXJ0XCIsXG4gICAgICAgIG1vdXNlbW92ZTogXCJ0b3VjaG1vdmVcIixcbiAgICAgICAgbW91c2V1cDogXCJ0b3VjaGVuZFwiXG4gICAgfSxcbiAgICBnZXRTY3JvbGwgPSBmdW5jdGlvbiAoeHksIGVsKSB7XG4gICAgICAgIHZhciBuYW1lID0geHkgPT0gXCJ5XCIgPyBcInNjcm9sbFRvcFwiIDogXCJzY3JvbGxMZWZ0XCIsXG4gICAgICAgICAgICBkb2MgPSBlbCAmJiBlbC5ub2RlID8gZWwubm9kZS5vd25lckRvY3VtZW50IDogZ2xvYi5kb2M7XG4gICAgICAgIHJldHVybiBkb2NbbmFtZSBpbiBkb2MuZG9jdW1lbnRFbGVtZW50ID8gXCJkb2N1bWVudEVsZW1lbnRcIiA6IFwiYm9keVwiXVtuYW1lXTtcbiAgICB9LFxuICAgIHByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgfSxcbiAgICBwcmV2ZW50VG91Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9LFxuICAgIHN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgIH0sXG4gICAgc3RvcFRvdWNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG4gICAgYWRkRXZlbnQgPSBmdW5jdGlvbiAob2JqLCB0eXBlLCBmbiwgZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVhbE5hbWUgPSBzdXBwb3J0c1RvdWNoICYmIHRvdWNoTWFwW3R5cGVdID8gdG91Y2hNYXBbdHlwZV0gOiB0eXBlLFxuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbFkgPSBnZXRTY3JvbGwoXCJ5XCIsIGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxYID0gZ2V0U2Nyb2xsKFwieFwiLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoc3VwcG9ydHNUb3VjaCAmJiB0b3VjaE1hcFtoYXNdKHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGUudGFyZ2V0VG91Y2hlcyAmJiBlLnRhcmdldFRvdWNoZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0VG91Y2hlc1tpXS50YXJnZXQgPT0gb2JqIHx8IG9iai5jb250YWlucyhlLnRhcmdldFRvdWNoZXNbaV0udGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRlID0gZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlID0gZS50YXJnZXRUb3VjaGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUub3JpZ2luYWxFdmVudCA9IG9sZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA9IHByZXZlbnRUb3VjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbiA9IHN0b3BUb3VjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeCA9IGUuY2xpZW50WCArIHNjcm9sbFgsXG4gICAgICAgICAgICAgICAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxZO1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKGVsZW1lbnQsIGUsIHgsIHkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZSAhPT0gcmVhbE5hbWUpIHtcbiAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGYsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHJlYWxOYW1lLCBmLCBmYWxzZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSByZWFsTmFtZSkge1xuICAgICAgICAgICAgICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGYsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIocmVhbE5hbWUsIGYsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgZHJhZyA9IFtdLFxuICAgIGRyYWdNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHggPSBlLmNsaWVudFgsXG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZLFxuICAgICAgICAgICAgc2Nyb2xsWSA9IGdldFNjcm9sbChcInlcIiksXG4gICAgICAgICAgICBzY3JvbGxYID0gZ2V0U2Nyb2xsKFwieFwiKSxcbiAgICAgICAgICAgIGRyYWdpLFxuICAgICAgICAgICAgaiA9IGRyYWcubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgICBkcmFnaSA9IGRyYWdbal07XG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNUb3VjaCkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3VjaC5pZGVudGlmaWVyID09IGRyYWdpLmVsLl9kcmFnLmlkIHx8IGRyYWdpLmVsLm5vZGUuY29udGFpbnModG91Y2gudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gdG91Y2guY2xpZW50WTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChlLm9yaWdpbmFsRXZlbnQgPyBlLm9yaWdpbmFsRXZlbnQgOiBlKS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub2RlID0gZHJhZ2kuZWwubm9kZSxcbiAgICAgICAgICAgICAgICBvLFxuICAgICAgICAgICAgICAgIG5leHQgPSBub2RlLm5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICAgIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5ID0gbm9kZS5zdHlsZS5kaXNwbGF5O1xuICAgICAgICAgICAgLy8gZ2xvYi53aW4ub3BlcmEgJiYgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICAgICAgLy8gbm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAvLyBvID0gZHJhZ2kuZWwucGFwZXIuZ2V0RWxlbWVudEJ5UG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAvLyBub2RlLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgICAgICAgICAgLy8gZ2xvYi53aW4ub3BlcmEgJiYgKG5leHQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpIDogcGFyZW50LmFwcGVuZENoaWxkKG5vZGUpKTtcbiAgICAgICAgICAgIC8vIG8gJiYgZXZlKFwic25hcC5kcmFnLm92ZXIuXCIgKyBkcmFnaS5lbC5pZCwgZHJhZ2kuZWwsIG8pO1xuICAgICAgICAgICAgeCArPSBzY3JvbGxYO1xuICAgICAgICAgICAgeSArPSBzY3JvbGxZO1xuICAgICAgICAgICAgZXZlKFwic25hcC5kcmFnLm1vdmUuXCIgKyBkcmFnaS5lbC5pZCwgZHJhZ2kubW92ZV9zY29wZSB8fCBkcmFnaS5lbCwgeCAtIGRyYWdpLmVsLl9kcmFnLngsIHkgLSBkcmFnaS5lbC5fZHJhZy55LCB4LCB5LCBlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ1VwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgU25hcC51bm1vdXNlbW92ZShkcmFnTW92ZSkudW5tb3VzZXVwKGRyYWdVcCk7XG4gICAgICAgIHZhciBpID0gZHJhZy5sZW5ndGgsXG4gICAgICAgICAgICBkcmFnaTtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgZHJhZ2kgPSBkcmFnW2ldO1xuICAgICAgICAgICAgZHJhZ2kuZWwuX2RyYWcgPSB7fTtcbiAgICAgICAgICAgIGV2ZShcInNuYXAuZHJhZy5lbmQuXCIgKyBkcmFnaS5lbC5pZCwgZHJhZ2kuZW5kX3Njb3BlIHx8IGRyYWdpLnN0YXJ0X3Njb3BlIHx8IGRyYWdpLm1vdmVfc2NvcGUgfHwgZHJhZ2kuZWwsIGUpO1xuICAgICAgICAgICAgZXZlLm9mZihcInNuYXAuZHJhZy4qLlwiICsgZHJhZ2kuZWwuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGRyYWcgPSBbXTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmNsaWNrXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgY2xpY2sgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bmNsaWNrXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgY2xpY2sgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmRibGNsaWNrXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgZG91YmxlIGNsaWNrIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW5kYmxjbGlja1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIGRvdWJsZSBjbGljayBldmVudCBoYW5kbGVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQubW91c2Vkb3duXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgbW91c2Vkb3duIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW5tb3VzZWRvd25cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYSBtb3VzZWRvd24gZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50Lm1vdXNlbW92ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIG1vdXNlbW92ZSBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVubW91c2Vtb3ZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgbW91c2Vtb3ZlIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5tb3VzZW91dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIG1vdXNlb3V0IGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW5tb3VzZW91dFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIG1vdXNlb3V0IGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5tb3VzZW92ZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIEFkZHMgYSBtb3VzZW92ZXIgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bm1vdXNlb3ZlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIG1vdXNlb3ZlciBldmVudCBoYW5kbGVyIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQubW91c2V1cFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIG1vdXNldXAgZXZlbnQgaGFuZGxlciB0byB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bm1vdXNldXBcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYSBtb3VzZXVwIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50b3VjaHN0YXJ0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBZGRzIGEgdG91Y2hzdGFydCBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVudG91Y2hzdGFydFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIHRvdWNoc3RhcnQgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIFxuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnRvdWNobW92ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIHRvdWNobW92ZSBldmVudCBoYW5kbGVyIHRvIHRoZSBlbGVtZW50XG4gICAgIC0gaGFuZGxlciAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIHRoZSBldmVudFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnVudG91Y2htb3ZlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGEgdG91Y2htb3ZlIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50b3VjaGVuZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIHRvdWNoZW5kIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW50b3VjaGVuZFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIHRvdWNoZW5kIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC50b3VjaGNhbmNlbFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBhIHRvdWNoY2FuY2VsIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGVsZW1lbnRcbiAgICAgLSBoYW5kbGVyIChmdW5jdGlvbikgaGFuZGxlciBmb3IgdGhlIGV2ZW50XG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICBcXCovXG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQudW50b3VjaGNhbmNlbFxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmVtb3ZlcyBhIHRvdWNoY2FuY2VsIGV2ZW50IGhhbmRsZXIgZnJvbSB0aGUgZWxlbWVudFxuICAgICAtIGhhbmRsZXIgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciB0aGUgZXZlbnRcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBmb3IgKHZhciBpID0gZXZlbnRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAoZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgU25hcFtldmVudE5hbWVdID0gZWxwcm90b1tldmVudE5hbWVdID0gZnVuY3Rpb24gKGZuLCBzY29wZSkge1xuICAgICAgICAgICAgICAgIGlmIChTbmFwLmlzKGZuLCBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZjogZm4sXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmJpbmQ6IGFkZEV2ZW50KHRoaXMubm9kZSB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBmbiwgc2NvcGUgfHwgdGhpcylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gdGhpcy5ldmVudHMubGVuZ3RoOyBpIDwgaWk7IGkrKykgaWYgKHRoaXMuZXZlbnRzW2ldLm5hbWUgPT0gZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2ldLmYuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgU25hcFtcInVuXCIgKyBldmVudE5hbWVdID1cbiAgICAgICAgICAgIGVscHJvdG9bXCJ1blwiICsgZXZlbnROYW1lXSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIHZhciBldmVudHMgPSB0aGlzLmV2ZW50cyB8fCBbXSxcbiAgICAgICAgICAgICAgICAgICAgbCA9IGV2ZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGwtLSkgaWYgKGV2ZW50c1tsXS5uYW1lID09IGV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChldmVudHNbbF0uZiA9PSBmbiB8fCAhZm4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50c1tsXS51bmJpbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzLnNwbGljZShsLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgIWV2ZW50cy5sZW5ndGggJiYgZGVsZXRlIHRoaXMuZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShldmVudHNbaV0pO1xuICAgIH1cbiAgICAvKlxcXG4gICAgICogRWxlbWVudC5ob3ZlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBob3ZlciBldmVudCBoYW5kbGVycyB0byB0aGUgZWxlbWVudFxuICAgICAtIGZfaW4gKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBob3ZlciBpblxuICAgICAtIGZfb3V0IChmdW5jdGlvbikgaGFuZGxlciBmb3IgaG92ZXIgb3V0XG4gICAgIC0gaWNvbnRleHQgKG9iamVjdCkgI29wdGlvbmFsIGNvbnRleHQgZm9yIGhvdmVyIGluIGhhbmRsZXJcbiAgICAgLSBvY29udGV4dCAob2JqZWN0KSAjb3B0aW9uYWwgY29udGV4dCBmb3IgaG92ZXIgb3V0IGhhbmRsZXJcbiAgICAgPSAob2JqZWN0KSBARWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmhvdmVyID0gZnVuY3Rpb24gKGZfaW4sIGZfb3V0LCBzY29wZV9pbiwgc2NvcGVfb3V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdXNlb3ZlcihmX2luLCBzY29wZV9pbikubW91c2VvdXQoZl9vdXQsIHNjb3BlX291dCB8fCBzY29wZV9pbik7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bmhvdmVyXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZW1vdmVzIGhvdmVyIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIGVsZW1lbnRcbiAgICAgLSBmX2luIChmdW5jdGlvbikgaGFuZGxlciBmb3IgaG92ZXIgaW5cbiAgICAgLSBmX291dCAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIGhvdmVyIG91dFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8udW5ob3ZlciA9IGZ1bmN0aW9uIChmX2luLCBmX291dCkge1xuICAgICAgICByZXR1cm4gdGhpcy51bm1vdXNlb3ZlcihmX2luKS51bm1vdXNlb3V0KGZfb3V0KTtcbiAgICB9O1xuICAgIHZhciBkcmFnZ2FibGUgPSBbXTtcbiAgICAvLyBTSUVSUkEgdW5jbGVhciB3aGF0IF9jb250ZXh0XyByZWZlcnMgdG8gZm9yIHN0YXJ0aW5nLCBlbmRpbmcsIG1vdmluZyB0aGUgZHJhZyBnZXN0dXJlLlxuICAgIC8vIFNJRVJSQSBFbGVtZW50LmRyYWcoKTogX3ggcG9zaXRpb24gb2YgdGhlIG1vdXNlXzogV2hlcmUgYXJlIHRoZSB4L3kgdmFsdWVzIG9mZnNldCBmcm9tP1xuICAgIC8vIFNJRVJSQSBFbGVtZW50LmRyYWcoKTogbXVjaCBvZiB0aGlzIG1lbWJlcidzIGRvYyBhcHBlYXJzIHRvIGJlIGR1cGxpY2F0ZWQgZm9yIHNvbWUgcmVhc29uLlxuICAgIC8vIFNJRVJSQSBVbmNsZWFyIGFib3V0IHRoaXMgc2VudGVuY2U6IF9BZGRpdGlvbmFsbHkgZm9sbG93aW5nIGRyYWcgZXZlbnRzIHdpbGwgYmUgdHJpZ2dlcmVkOiBkcmFnLnN0YXJ0LjxpZD4gb24gc3RhcnQsIGRyYWcuZW5kLjxpZD4gb24gZW5kIGFuZCBkcmFnLm1vdmUuPGlkPiBvbiBldmVyeSBtb3ZlLl8gSXMgdGhlcmUgYSBnbG9iYWwgX2RyYWdfIG9iamVjdCB0byB3aGljaCB5b3UgY2FuIGFzc2lnbiBoYW5kbGVycyBrZXllZCBieSBhbiBlbGVtZW50J3MgSUQ/XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZHJhZ1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQWRkcyBldmVudCBoYW5kbGVycyBmb3IgYW4gZWxlbWVudCdzIGRyYWcgZ2VzdHVyZVxuICAgICAqKlxuICAgICAtIG9ubW92ZSAoZnVuY3Rpb24pIGhhbmRsZXIgZm9yIG1vdmluZ1xuICAgICAtIG9uc3RhcnQgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBkcmFnIHN0YXJ0XG4gICAgIC0gb25lbmQgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBkcmFnIGVuZFxuICAgICAtIG1jb250ZXh0IChvYmplY3QpICNvcHRpb25hbCBjb250ZXh0IGZvciBtb3ZpbmcgaGFuZGxlclxuICAgICAtIHNjb250ZXh0IChvYmplY3QpICNvcHRpb25hbCBjb250ZXh0IGZvciBkcmFnIHN0YXJ0IGhhbmRsZXJcbiAgICAgLSBlY29udGV4dCAob2JqZWN0KSAjb3B0aW9uYWwgY29udGV4dCBmb3IgZHJhZyBlbmQgaGFuZGxlclxuICAgICAqIEFkZGl0aW9uYWx5IGZvbGxvd2luZyBgZHJhZ2AgZXZlbnRzIGFyZSB0cmlnZ2VyZWQ6IGBkcmFnLnN0YXJ0LjxpZD5gIG9uIHN0YXJ0LCBcbiAgICAgKiBgZHJhZy5lbmQuPGlkPmAgb24gZW5kIGFuZCBgZHJhZy5tb3ZlLjxpZD5gIG9uIGV2ZXJ5IG1vdmUuIFdoZW4gZWxlbWVudCBpcyBkcmFnZ2VkIG92ZXIgYW5vdGhlciBlbGVtZW50IFxuICAgICAqIGBkcmFnLm92ZXIuPGlkPmAgZmlyZXMgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIFN0YXJ0IGV2ZW50IGFuZCBzdGFydCBoYW5kbGVyIGFyZSBjYWxsZWQgaW4gc3BlY2lmaWVkIGNvbnRleHQgb3IgaW4gY29udGV4dCBvZiB0aGUgZWxlbWVudCB3aXRoIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgICBvIHggKG51bWJlcikgeCBwb3NpdGlvbiBvZiB0aGUgbW91c2VcbiAgICAgbyB5IChudW1iZXIpIHkgcG9zaXRpb24gb2YgdGhlIG1vdXNlXG4gICAgIG8gZXZlbnQgKG9iamVjdCkgRE9NIGV2ZW50IG9iamVjdFxuICAgICAqIE1vdmUgZXZlbnQgYW5kIG1vdmUgaGFuZGxlciBhcmUgY2FsbGVkIGluIHNwZWNpZmllZCBjb250ZXh0IG9yIGluIGNvbnRleHQgb2YgdGhlIGVsZW1lbnQgd2l0aCBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICAgbyBkeCAobnVtYmVyKSBzaGlmdCBieSB4IGZyb20gdGhlIHN0YXJ0IHBvaW50XG4gICAgIG8gZHkgKG51bWJlcikgc2hpZnQgYnkgeSBmcm9tIHRoZSBzdGFydCBwb2ludFxuICAgICBvIHggKG51bWJlcikgeCBwb3NpdGlvbiBvZiB0aGUgbW91c2VcbiAgICAgbyB5IChudW1iZXIpIHkgcG9zaXRpb24gb2YgdGhlIG1vdXNlXG4gICAgIG8gZXZlbnQgKG9iamVjdCkgRE9NIGV2ZW50IG9iamVjdFxuICAgICAqIEVuZCBldmVudCBhbmQgZW5kIGhhbmRsZXIgYXJlIGNhbGxlZCBpbiBzcGVjaWZpZWQgY29udGV4dCBvciBpbiBjb250ZXh0IG9mIHRoZSBlbGVtZW50IHdpdGggZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAgIG8gZXZlbnQgKG9iamVjdCkgRE9NIGV2ZW50IG9iamVjdFxuICAgICA9IChvYmplY3QpIEBFbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uZHJhZyA9IGZ1bmN0aW9uIChvbm1vdmUsIG9uc3RhcnQsIG9uZW5kLCBtb3ZlX3Njb3BlLCBzdGFydF9zY29wZSwgZW5kX3Njb3BlKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXM7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIG9yaWdUcmFuc2Zvcm07XG4gICAgICAgICAgICByZXR1cm4gZWwuZHJhZyhmdW5jdGlvbiAoZHgsIGR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBvcmlnVHJhbnNmb3JtICsgKG9yaWdUcmFuc2Zvcm0gPyBcIlRcIiA6IFwidFwiKSArIFtkeCwgZHldXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgb3JpZ1RyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtKCkubG9jYWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzdGFydChlLCB4LCB5KSB7XG4gICAgICAgICAgICAoZS5vcmlnaW5hbEV2ZW50IHx8IGUpLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlbC5fZHJhZy54ID0geDtcbiAgICAgICAgICAgIGVsLl9kcmFnLnkgPSB5O1xuICAgICAgICAgICAgZWwuX2RyYWcuaWQgPSBlLmlkZW50aWZpZXI7XG4gICAgICAgICAgICAhZHJhZy5sZW5ndGggJiYgU25hcC5tb3VzZW1vdmUoZHJhZ01vdmUpLm1vdXNldXAoZHJhZ1VwKTtcbiAgICAgICAgICAgIGRyYWcucHVzaCh7ZWw6IGVsLCBtb3ZlX3Njb3BlOiBtb3ZlX3Njb3BlLCBzdGFydF9zY29wZTogc3RhcnRfc2NvcGUsIGVuZF9zY29wZTogZW5kX3Njb3BlfSk7XG4gICAgICAgICAgICBvbnN0YXJ0ICYmIGV2ZS5vbihcInNuYXAuZHJhZy5zdGFydC5cIiArIGVsLmlkLCBvbnN0YXJ0KTtcbiAgICAgICAgICAgIG9ubW92ZSAmJiBldmUub24oXCJzbmFwLmRyYWcubW92ZS5cIiArIGVsLmlkLCBvbm1vdmUpO1xuICAgICAgICAgICAgb25lbmQgJiYgZXZlLm9uKFwic25hcC5kcmFnLmVuZC5cIiArIGVsLmlkLCBvbmVuZCk7XG4gICAgICAgICAgICBldmUoXCJzbmFwLmRyYWcuc3RhcnQuXCIgKyBlbC5pZCwgc3RhcnRfc2NvcGUgfHwgbW92ZV9zY29wZSB8fCBlbCwgeCwgeSwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5pdChlLCB4LCB5KSB7XG4gICAgICAgICAgICBldmUoXCJzbmFwLmRyYWdpbml0LlwiICsgZWwuaWQsIGVsLCBlLCB4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBldmUub24oXCJzbmFwLmRyYWdpbml0LlwiICsgZWwuaWQsIHN0YXJ0KTtcbiAgICAgICAgZWwuX2RyYWcgPSB7fTtcbiAgICAgICAgZHJhZ2dhYmxlLnB1c2goe2VsOiBlbCwgc3RhcnQ6IHN0YXJ0LCBpbml0OiBpbml0fSk7XG4gICAgICAgIGVsLm1vdXNlZG93bihpbml0KTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgLypcbiAgICAgKiBFbGVtZW50Lm9uRHJhZ092ZXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFNob3J0Y3V0IHRvIGFzc2lnbiBldmVudCBoYW5kbGVyIGZvciBgZHJhZy5vdmVyLjxpZD5gIGV2ZW50LCB3aGVyZSBgaWRgIGlzIHRoZSBlbGVtZW50J3MgYGlkYCAoc2VlIEBFbGVtZW50LmlkKVxuICAgICAtIGYgKGZ1bmN0aW9uKSBoYW5kbGVyIGZvciBldmVudCwgZmlyc3QgYXJndW1lbnQgd291bGQgYmUgdGhlIGVsZW1lbnQgeW91IGFyZSBkcmFnZ2luZyBvdmVyXG4gICAgXFwqL1xuICAgIC8vIGVscHJvdG8ub25EcmFnT3ZlciA9IGZ1bmN0aW9uIChmKSB7XG4gICAgLy8gICAgIGYgPyBldmUub24oXCJzbmFwLmRyYWcub3Zlci5cIiArIHRoaXMuaWQsIGYpIDogZXZlLnVuYmluZChcInNuYXAuZHJhZy5vdmVyLlwiICsgdGhpcy5pZCk7XG4gICAgLy8gfTtcbiAgICAvKlxcXG4gICAgICogRWxlbWVudC51bmRyYWdcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJlbW92ZXMgYWxsIGRyYWcgZXZlbnQgaGFuZGxlcnMgZnJvbSB0aGUgZ2l2ZW4gZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLnVuZHJhZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGkgPSBkcmFnZ2FibGUubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSBpZiAoZHJhZ2dhYmxlW2ldLmVsID09IHRoaXMpIHtcbiAgICAgICAgICAgIHRoaXMudW5tb3VzZWRvd24oZHJhZ2dhYmxlW2ldLmluaXQpO1xuICAgICAgICAgICAgZHJhZ2dhYmxlLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGV2ZS51bmJpbmQoXCJzbmFwLmRyYWcuKi5cIiArIHRoaXMuaWQpO1xuICAgICAgICAgICAgZXZlLnVuYmluZChcInNuYXAuZHJhZ2luaXQuXCIgKyB0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICAhZHJhZ2dhYmxlLmxlbmd0aCAmJiBTbmFwLnVubW91c2Vtb3ZlKGRyYWdNb3ZlKS51bm1vdXNldXAoZHJhZ1VwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn0pO1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTMgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcbiAgICB2YXIgZWxwcm90byA9IEVsZW1lbnQucHJvdG90eXBlLFxuICAgICAgICBwcHJvdG8gPSBQYXBlci5wcm90b3R5cGUsXG4gICAgICAgIHJndXJsID0gL15cXHMqdXJsXFwoKC4rKVxcKS8sXG4gICAgICAgIFN0ciA9IFN0cmluZyxcbiAgICAgICAgJCA9IFNuYXAuXy4kO1xuICAgIFNuYXAuZmlsdGVyID0ge307XG4gICAgLypcXFxuICAgICAqIFBhcGVyLmZpbHRlclxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhIGA8ZmlsdGVyPmAgZWxlbWVudFxuICAgICAqKlxuICAgICAtIGZpbHN0ciAoc3RyaW5nKSBTVkcgZnJhZ21lbnQgb2YgZmlsdGVyIHByb3ZpZGVkIGFzIGEgc3RyaW5nXG4gICAgID0gKG9iamVjdCkgQEVsZW1lbnRcbiAgICAgKiBOb3RlOiBJdCBpcyByZWNvbW1lbmRlZCB0byB1c2UgZmlsdGVycyBlbWJlZGRlZCBpbnRvIHRoZSBwYWdlIGluc2lkZSBhbiBlbXB0eSBTVkcgZWxlbWVudC5cbiAgICAgPiBVc2FnZVxuICAgICB8IHZhciBmID0gcGFwZXIuZmlsdGVyKCc8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwiMlwiLz4nKSxcbiAgICAgfCAgICAgYyA9IHBhcGVyLmNpcmNsZSgxMCwgMTAsIDEwKS5hdHRyKHtcbiAgICAgfCAgICAgICAgIGZpbHRlcjogZlxuICAgICB8ICAgICB9KTtcbiAgICBcXCovXG4gICAgcHByb3RvLmZpbHRlciA9IGZ1bmN0aW9uIChmaWxzdHIpIHtcbiAgICAgICAgdmFyIHBhcGVyID0gdGhpcztcbiAgICAgICAgaWYgKHBhcGVyLnR5cGUgIT0gXCJzdmdcIikge1xuICAgICAgICAgICAgcGFwZXIgPSBwYXBlci5wYXBlcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZiA9IFNuYXAucGFyc2UoU3RyKGZpbHN0cikpLFxuICAgICAgICAgICAgaWQgPSBTbmFwLl8uaWQoKSxcbiAgICAgICAgICAgIHdpZHRoID0gcGFwZXIubm9kZS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodCA9IHBhcGVyLm5vZGUub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgZmlsdGVyID0gJChcImZpbHRlclwiKTtcbiAgICAgICAgJChmaWx0ZXIsIHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGZpbHRlclVuaXRzOiBcInVzZXJTcGFjZU9uVXNlXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlci5hcHBlbmRDaGlsZChmLm5vZGUpO1xuICAgICAgICBwYXBlci5kZWZzLmFwcGVuZENoaWxkKGZpbHRlcik7XG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudChmaWx0ZXIpO1xuICAgIH07XG5cbiAgICBldmUub24oXCJzbmFwLnV0aWwuZ2V0YXR0ci5maWx0ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBldmUuc3RvcCgpO1xuICAgICAgICB2YXIgcCA9ICQodGhpcy5ub2RlLCBcImZpbHRlclwiKTtcbiAgICAgICAgaWYgKHApIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IFN0cihwKS5tYXRjaChyZ3VybCk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2ggJiYgU25hcC5zZWxlY3QobWF0Y2hbMV0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZXZlLm9uKFwic25hcC51dGlsLmF0dHIuZmlsdGVyXCIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIHZhbHVlLnR5cGUgPT0gXCJmaWx0ZXJcIikge1xuICAgICAgICAgICAgZXZlLnN0b3AoKTtcbiAgICAgICAgICAgIHZhciBpZCA9IHZhbHVlLm5vZGUuaWQ7XG4gICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgJCh2YWx1ZS5ub2RlLCB7aWQ6IHZhbHVlLmlkfSk7XG4gICAgICAgICAgICAgICAgaWQgPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQodGhpcy5ub2RlLCB7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiBTbmFwLnVybChpZClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGV2ZS5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLmJsdXJcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBibHVyIGZpbHRlclxuICAgICAqKlxuICAgICAtIHggKG51bWJlcikgYW1vdW50IG9mIGhvcml6b250YWwgYmx1ciwgaW4gcGl4ZWxzXG4gICAgIC0geSAobnVtYmVyKSAjb3B0aW9uYWwgYW1vdW50IG9mIHZlcnRpY2FsIGJsdXIsIGluIHBpeGVsc1xuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgICA+IFVzYWdlXG4gICAgIHwgdmFyIGYgPSBwYXBlci5maWx0ZXIoU25hcC5maWx0ZXIuYmx1cig1LCAxMCkpLFxuICAgICB8ICAgICBjID0gcGFwZXIuY2lyY2xlKDEwLCAxMCwgMTApLmF0dHIoe1xuICAgICB8ICAgICAgICAgZmlsdGVyOiBmXG4gICAgIHwgICAgIH0pO1xuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5ibHVyID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkge1xuICAgICAgICAgICAgeCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZiA9IHkgPT0gbnVsbCA/IHggOiBbeCwgeV07XG4gICAgICAgIHJldHVybiBTbmFwLmZvcm1hdCgnXFw8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPVwie2RlZn1cIi8+Jywge1xuICAgICAgICAgICAgZGVmOiBkZWZcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTbmFwLmZpbHRlci5ibHVyLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLnNoYWRvd1xuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBTVkcgbWFya3VwIHN0cmluZyBmb3IgdGhlIHNoYWRvdyBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBkeCAobnVtYmVyKSAjb3B0aW9uYWwgaG9yaXpvbnRhbCBzaGlmdCBvZiB0aGUgc2hhZG93LCBpbiBwaXhlbHNcbiAgICAgLSBkeSAobnVtYmVyKSAjb3B0aW9uYWwgdmVydGljYWwgc2hpZnQgb2YgdGhlIHNoYWRvdywgaW4gcGl4ZWxzXG4gICAgIC0gYmx1ciAobnVtYmVyKSAjb3B0aW9uYWwgYW1vdW50IG9mIGJsdXJcbiAgICAgLSBjb2xvciAoc3RyaW5nKSAjb3B0aW9uYWwgY29sb3Igb2YgdGhlIHNoYWRvd1xuICAgICAtIG9wYWNpdHkgKG51bWJlcikgI29wdGlvbmFsIGAwLi4xYCBvcGFjaXR5IG9mIHRoZSBzaGFkb3dcbiAgICAgKiBvclxuICAgICAtIGR4IChudW1iZXIpICNvcHRpb25hbCBob3Jpem9udGFsIHNoaWZ0IG9mIHRoZSBzaGFkb3csIGluIHBpeGVsc1xuICAgICAtIGR5IChudW1iZXIpICNvcHRpb25hbCB2ZXJ0aWNhbCBzaGlmdCBvZiB0aGUgc2hhZG93LCBpbiBwaXhlbHNcbiAgICAgLSBjb2xvciAoc3RyaW5nKSAjb3B0aW9uYWwgY29sb3Igb2YgdGhlIHNoYWRvd1xuICAgICAtIG9wYWNpdHkgKG51bWJlcikgI29wdGlvbmFsIGAwLi4xYCBvcGFjaXR5IG9mIHRoZSBzaGFkb3dcbiAgICAgKiB3aGljaCBtYWtlcyBibHVyIGRlZmF1bHQgdG8gYDRgLiBPclxuICAgICAtIGR4IChudW1iZXIpICNvcHRpb25hbCBob3Jpem9udGFsIHNoaWZ0IG9mIHRoZSBzaGFkb3csIGluIHBpeGVsc1xuICAgICAtIGR5IChudW1iZXIpICNvcHRpb25hbCB2ZXJ0aWNhbCBzaGlmdCBvZiB0aGUgc2hhZG93LCBpbiBwaXhlbHNcbiAgICAgLSBvcGFjaXR5IChudW1iZXIpICNvcHRpb25hbCBgMC4uMWAgb3BhY2l0eSBvZiB0aGUgc2hhZG93XG4gICAgID0gKHN0cmluZykgZmlsdGVyIHJlcHJlc2VudGF0aW9uXG4gICAgID4gVXNhZ2VcbiAgICAgfCB2YXIgZiA9IHBhcGVyLmZpbHRlcihTbmFwLmZpbHRlci5zaGFkb3coMCwgMiwgLjMpKSxcbiAgICAgfCAgICAgYyA9IHBhcGVyLmNpcmNsZSgxMCwgMTAsIDEwKS5hdHRyKHtcbiAgICAgfCAgICAgICAgIGZpbHRlcjogZlxuICAgICB8ICAgICB9KTtcbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuc2hhZG93ID0gZnVuY3Rpb24gKGR4LCBkeSwgYmx1ciwgY29sb3IsIG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gYmx1cjtcbiAgICAgICAgICAgICAgICBibHVyID0gNDtcbiAgICAgICAgICAgICAgICBjb2xvciA9IFwiIzAwMFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gY29sb3I7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBibHVyO1xuICAgICAgICAgICAgICAgIGJsdXIgPSA0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChibHVyID09IG51bGwpIHtcbiAgICAgICAgICAgIGJsdXIgPSA0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGFjaXR5ID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeCA9PSBudWxsKSB7XG4gICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICBkeSA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5ID09IG51bGwpIHtcbiAgICAgICAgICAgIGR5ID0gZHg7XG4gICAgICAgIH1cbiAgICAgICAgY29sb3IgPSBTbmFwLmNvbG9yKGNvbG9yKTtcbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVHYXVzc2lhbkJsdXIgaW49XCJTb3VyY2VBbHBoYVwiIHN0ZERldmlhdGlvbj1cIntibHVyfVwiLz48ZmVPZmZzZXQgZHg9XCJ7ZHh9XCIgZHk9XCJ7ZHl9XCIgcmVzdWx0PVwib2Zmc2V0Ymx1clwiLz48ZmVGbG9vZCBmbG9vZC1jb2xvcj1cIntjb2xvcn1cIi8+PGZlQ29tcG9zaXRlIGluMj1cIm9mZnNldGJsdXJcIiBvcGVyYXRvcj1cImluXCIvPjxmZUNvbXBvbmVudFRyYW5zZmVyPjxmZUZ1bmNBIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cIntvcGFjaXR5fVwiLz48L2ZlQ29tcG9uZW50VHJhbnNmZXI+PGZlTWVyZ2U+PGZlTWVyZ2VOb2RlLz48ZmVNZXJnZU5vZGUgaW49XCJTb3VyY2VHcmFwaGljXCIvPjwvZmVNZXJnZT4nLCB7XG4gICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICBkeDogZHgsXG4gICAgICAgICAgICBkeTogZHksXG4gICAgICAgICAgICBibHVyOiBibHVyLFxuICAgICAgICAgICAgb3BhY2l0eTogb3BhY2l0eVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLnNoYWRvdy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMoKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmZpbHRlci5ncmF5c2NhbGVcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgYW4gU1ZHIG1hcmt1cCBzdHJpbmcgZm9yIHRoZSBncmF5c2NhbGUgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW1vdW50IChudW1iZXIpIGFtb3VudCBvZiBmaWx0ZXIgKGAwLi4xYClcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuZ3JheXNjYWxlID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGFtb3VudCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVDb2xvck1hdHJpeCB0eXBlPVwibWF0cml4XCIgdmFsdWVzPVwie2F9IHtifSB7Y30gMCAwIHtkfSB7ZX0ge2Z9IDAgMCB7Z30ge2J9IHtofSAwIDAgMCAwIDAgMSAwXCIvPicsIHtcbiAgICAgICAgICAgIGE6IDAuMjEyNiArIDAuNzg3NCAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGI6IDAuNzE1MiAtIDAuNzE1MiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGM6IDAuMDcyMiAtIDAuMDcyMiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGQ6IDAuMjEyNiAtIDAuMjEyNiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGU6IDAuNzE1MiArIDAuMjg0OCAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGY6IDAuMDcyMiAtIDAuMDcyMiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGc6IDAuMjEyNiAtIDAuMjEyNiAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGg6IDAuMDcyMiArIDAuOTI3OCAqICgxIC0gYW1vdW50KVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmdyYXlzY2FsZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMoKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmZpbHRlci5zZXBpYVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBTVkcgbWFya3VwIHN0cmluZyBmb3IgdGhlIHNlcGlhIGZpbHRlclxuICAgICAqKlxuICAgICAtIGFtb3VudCAobnVtYmVyKSBhbW91bnQgb2YgZmlsdGVyIChgMC4uMWApXG4gICAgID0gKHN0cmluZykgZmlsdGVyIHJlcHJlc2VudGF0aW9uXG4gICAgXFwqL1xuICAgIFNuYXAuZmlsdGVyLnNlcGlhID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGFtb3VudCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVDb2xvck1hdHJpeCB0eXBlPVwibWF0cml4XCIgdmFsdWVzPVwie2F9IHtifSB7Y30gMCAwIHtkfSB7ZX0ge2Z9IDAgMCB7Z30ge2h9IHtpfSAwIDAgMCAwIDAgMSAwXCIvPicsIHtcbiAgICAgICAgICAgIGE6IDAuMzkzICsgMC42MDcgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBiOiAwLjc2OSAtIDAuNzY5ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgYzogMC4xODkgLSAwLjE4OSAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGQ6IDAuMzQ5IC0gMC4zNDkgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBlOiAwLjY4NiArIDAuMzE0ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgZjogMC4xNjggLSAwLjE2OCAqICgxIC0gYW1vdW50KSxcbiAgICAgICAgICAgIGc6IDAuMjcyIC0gMC4yNzIgKiAoMSAtIGFtb3VudCksXG4gICAgICAgICAgICBoOiAwLjUzNCAtIDAuNTM0ICogKDEgLSBhbW91bnQpLFxuICAgICAgICAgICAgaTogMC4xMzEgKyAwLjg2OSAqICgxIC0gYW1vdW50KVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLnNlcGlhLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLnNhdHVyYXRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgc2F0dXJhdGUgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW1vdW50IChudW1iZXIpIGFtb3VudCBvZiBmaWx0ZXIgKGAwLi4xYClcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuc2F0dXJhdGUgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbG9yTWF0cml4IHR5cGU9XCJzYXR1cmF0ZVwiIHZhbHVlcz1cInthbW91bnR9XCIvPicsIHtcbiAgICAgICAgICAgIGFtb3VudDogMSAtIGFtb3VudFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLnNhdHVyYXRlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLmh1ZVJvdGF0ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhbiBTVkcgbWFya3VwIHN0cmluZyBmb3IgdGhlIGh1ZS1yb3RhdGUgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW5nbGUgKG51bWJlcikgYW5nbGUgb2Ygcm90YXRpb25cbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuaHVlUm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgICAgIGFuZ2xlID0gYW5nbGUgfHwgMDtcbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVDb2xvck1hdHJpeCB0eXBlPVwiaHVlUm90YXRlXCIgdmFsdWVzPVwie2FuZ2xlfVwiLz4nLCB7XG4gICAgICAgICAgICBhbmdsZTogYW5nbGVcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTbmFwLmZpbHRlci5odWVSb3RhdGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzKCk7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5maWx0ZXIuaW52ZXJ0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgaW52ZXJ0IGZpbHRlclxuICAgICAqKlxuICAgICAtIGFtb3VudCAobnVtYmVyKSBhbW91bnQgb2YgZmlsdGVyIChgMC4uMWApXG4gICAgID0gKHN0cmluZykgZmlsdGVyIHJlcHJlc2VudGF0aW9uXG4gICAgXFwqL1xuICAgIFNuYXAuZmlsdGVyLmludmVydCA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBhbW91bnQgPSAxO1xuICAgICAgICB9XG4vLyAgICAgICAgPGZlQ29sb3JNYXRyaXggdHlwZT1cIm1hdHJpeFwiIHZhbHVlcz1cIi0xIDAgMCAwIDEgIDAgLTEgMCAwIDEgIDAgMCAtMSAwIDEgIDAgMCAwIDEgMFwiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz1cInNSR0JcIi8+XG4gICAgICAgIHJldHVybiBTbmFwLmZvcm1hdCgnPGZlQ29tcG9uZW50VHJhbnNmZXI+PGZlRnVuY1IgdHlwZT1cInRhYmxlXCIgdGFibGVWYWx1ZXM9XCJ7YW1vdW50fSB7YW1vdW50Mn1cIi8+PGZlRnVuY0cgdHlwZT1cInRhYmxlXCIgdGFibGVWYWx1ZXM9XCJ7YW1vdW50fSB7YW1vdW50Mn1cIi8+PGZlRnVuY0IgdHlwZT1cInRhYmxlXCIgdGFibGVWYWx1ZXM9XCJ7YW1vdW50fSB7YW1vdW50Mn1cIi8+PC9mZUNvbXBvbmVudFRyYW5zZmVyPicsIHtcbiAgICAgICAgICAgIGFtb3VudDogYW1vdW50LFxuICAgICAgICAgICAgYW1vdW50MjogMSAtIGFtb3VudFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmludmVydC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMoKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmZpbHRlci5icmlnaHRuZXNzXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgYnJpZ2h0bmVzcyBmaWx0ZXJcbiAgICAgKipcbiAgICAgLSBhbW91bnQgKG51bWJlcikgYW1vdW50IG9mIGZpbHRlciAoYDAuLjFgKVxuICAgICA9IChzdHJpbmcpIGZpbHRlciByZXByZXNlbnRhdGlvblxuICAgIFxcKi9cbiAgICBTbmFwLmZpbHRlci5icmlnaHRuZXNzID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGFtb3VudCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNuYXAuZm9ybWF0KCc8ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPVwibGluZWFyXCIgc2xvcGU9XCJ7YW1vdW50fVwiLz48ZmVGdW5jRyB0eXBlPVwibGluZWFyXCIgc2xvcGU9XCJ7YW1vdW50fVwiLz48ZmVGdW5jQiB0eXBlPVwibGluZWFyXCIgc2xvcGU9XCJ7YW1vdW50fVwiLz48L2ZlQ29tcG9uZW50VHJhbnNmZXI+Jywge1xuICAgICAgICAgICAgYW1vdW50OiBhbW91bnRcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTbmFwLmZpbHRlci5icmlnaHRuZXNzLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIFNuYXAuZmlsdGVyLmNvbnRyYXN0XG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSZXR1cm5zIGFuIFNWRyBtYXJrdXAgc3RyaW5nIGZvciB0aGUgY29udHJhc3QgZmlsdGVyXG4gICAgICoqXG4gICAgIC0gYW1vdW50IChudW1iZXIpIGFtb3VudCBvZiBmaWx0ZXIgKGAwLi4xYClcbiAgICAgPSAoc3RyaW5nKSBmaWx0ZXIgcmVwcmVzZW50YXRpb25cbiAgICBcXCovXG4gICAgU25hcC5maWx0ZXIuY29udHJhc3QgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgYW1vdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU25hcC5mb3JtYXQoJzxmZUNvbXBvbmVudFRyYW5zZmVyPjxmZUZ1bmNSIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIgaW50ZXJjZXB0PVwie2Ftb3VudDJ9XCIvPjxmZUZ1bmNHIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIgaW50ZXJjZXB0PVwie2Ftb3VudDJ9XCIvPjxmZUZ1bmNCIHR5cGU9XCJsaW5lYXJcIiBzbG9wZT1cInthbW91bnR9XCIgaW50ZXJjZXB0PVwie2Ftb3VudDJ9XCIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj4nLCB7XG4gICAgICAgICAgICBhbW91bnQ6IGFtb3VudCxcbiAgICAgICAgICAgIGFtb3VudDI6IC41IC0gYW1vdW50IC8gMlxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNuYXAuZmlsdGVyLmNvbnRyYXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcygpO1xuICAgIH07XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE0IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBib3ggPSBTbmFwLl8uYm94LFxuICAgICAgICBpcyA9IFNuYXAuaXMsXG4gICAgICAgIGZpcnN0TGV0dGVyID0gL15bXmEtel0qKFt0Ym1scmNdKS9pLFxuICAgICAgICB0b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlRcIiArIHRoaXMuZHggKyBcIixcIiArIHRoaXMuZHk7XG4gICAgICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuZ2V0QWxpZ25cbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFJldHVybnMgc2hpZnQgbmVlZGVkIHRvIGFsaWduIHRoZSBlbGVtZW50IHJlbGF0aXZlbHkgdG8gZ2l2ZW4gZWxlbWVudC5cbiAgICAgKiBJZiBubyBlbGVtZW50cyBzcGVjaWZpZWQsIHBhcmVudCBgPHN2Zz5gIGNvbnRhaW5lciB3aWxsIGJlIHVzZWQuXG4gICAgIC0gZWwgKG9iamVjdCkgQG9wdGlvbmFsIGFsaWdubWVudCBlbGVtZW50XG4gICAgIC0gd2F5IChzdHJpbmcpIG9uZSBvZiBzaXggdmFsdWVzOiBgXCJ0b3BcImAsIGBcIm1pZGRsZVwiYCwgYFwiYm90dG9tXCJgLCBgXCJsZWZ0XCJgLCBgXCJjZW50ZXJcImAsIGBcInJpZ2h0XCJgXG4gICAgID0gKG9iamVjdHxzdHJpbmcpIE9iamVjdCBpbiBmb3JtYXQgYHtkeDogLCBkeTogfWAgYWxzbyBoYXMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gYXMgYSB0cmFuc2Zvcm1hdGlvbiBzdHJpbmdcbiAgICAgPiBVc2FnZVxuICAgICB8IGVsLnRyYW5zZm9ybShlbC5nZXRBbGlnbihlbDIsIFwidG9wXCIpKTtcbiAgICAgKiBvclxuICAgICB8IHZhciBkeSA9IGVsLmdldEFsaWduKGVsMiwgXCJ0b3BcIikuZHk7XG4gICAgXFwqL1xuICAgIEVsZW1lbnQucHJvdG90eXBlLmdldEFsaWduID0gZnVuY3Rpb24gKGVsLCB3YXkpIHtcbiAgICAgICAgaWYgKHdheSA9PSBudWxsICYmIGlzKGVsLCBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgd2F5ID0gZWw7XG4gICAgICAgICAgICBlbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWwgPSBlbCB8fCB0aGlzLnBhcGVyO1xuICAgICAgICB2YXIgYnggPSBlbC5nZXRCQm94ID8gZWwuZ2V0QkJveCgpIDogYm94KGVsKSxcbiAgICAgICAgICAgIGJiID0gdGhpcy5nZXRCQm94KCksXG4gICAgICAgICAgICBvdXQgPSB7fTtcbiAgICAgICAgd2F5ID0gd2F5ICYmIHdheS5tYXRjaChmaXJzdExldHRlcik7XG4gICAgICAgIHdheSA9IHdheSA/IHdheVsxXS50b0xvd2VyQ2FzZSgpIDogXCJjXCI7XG4gICAgICAgIHN3aXRjaCAod2F5KSB7XG4gICAgICAgICAgICBjYXNlIFwidFwiOlxuICAgICAgICAgICAgICAgIG91dC5keCA9IDA7XG4gICAgICAgICAgICAgICAgb3V0LmR5ID0gYngueSAtIGJiLnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJiXCI6XG4gICAgICAgICAgICAgICAgb3V0LmR4ID0gMDtcbiAgICAgICAgICAgICAgICBvdXQuZHkgPSBieC55MiAtIGJiLnkyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibVwiOlxuICAgICAgICAgICAgICAgIG91dC5keCA9IDA7XG4gICAgICAgICAgICAgICAgb3V0LmR5ID0gYnguY3kgLSBiYi5jeTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImxcIjpcbiAgICAgICAgICAgICAgICBvdXQuZHggPSBieC54IC0gYmIueDtcbiAgICAgICAgICAgICAgICBvdXQuZHkgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiclwiOlxuICAgICAgICAgICAgICAgIG91dC5keCA9IGJ4LngyIC0gYmIueDI7XG4gICAgICAgICAgICAgICAgb3V0LmR5ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBvdXQuZHggPSBieC5jeCAtIGJiLmN4O1xuICAgICAgICAgICAgICAgIG91dC5keSA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBvdXQudG9TdHJpbmcgPSB0b1N0cmluZztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmFsaWduXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBBbGlnbnMgdGhlIGVsZW1lbnQgcmVsYXRpdmVseSB0byBnaXZlbiBvbmUgdmlhIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIElmIG5vIGVsZW1lbnRzIHNwZWNpZmllZCwgcGFyZW50IGA8c3ZnPmAgY29udGFpbmVyIHdpbGwgYmUgdXNlZC5cbiAgICAgLSBlbCAob2JqZWN0KSBAb3B0aW9uYWwgYWxpZ25tZW50IGVsZW1lbnRcbiAgICAgLSB3YXkgKHN0cmluZykgb25lIG9mIHNpeCB2YWx1ZXM6IGBcInRvcFwiYCwgYFwibWlkZGxlXCJgLCBgXCJib3R0b21cImAsIGBcImxlZnRcImAsIGBcImNlbnRlclwiYCwgYFwicmlnaHRcImBcbiAgICAgPSAob2JqZWN0KSB0aGlzIGVsZW1lbnRcbiAgICAgPiBVc2FnZVxuICAgICB8IGVsLmFsaWduKGVsMiwgXCJ0b3BcIik7XG4gICAgICogb3JcbiAgICAgfCBlbC5hbGlnbihcIm1pZGRsZVwiKTtcbiAgICBcXCovXG4gICAgRWxlbWVudC5wcm90b3R5cGUuYWxpZ24gPSBmdW5jdGlvbiAoZWwsIHdheSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oXCIuLi5cIiArIHRoaXMuZ2V0QWxpZ24oZWwsIHdheSkpO1xuICAgIH07XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE2IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iLCBGcmFnbWVudCkge1xuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIGlzID0gU25hcC5pcyxcbiAgICAgICAgU3RyID0gU3RyaW5nLFxuICAgICAgICBoYXMgPSBcImhhc093blByb3BlcnR5XCI7XG4gICAgZnVuY3Rpb24gc2xpY2UoZnJvbSwgdG8sIGYpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBhcnIuc2xpY2UoZnJvbSwgdG8pO1xuICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmID8gZihyZXMpIDogcmVzO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgQW5pbWF0aW9uID0gZnVuY3Rpb24gKGF0dHIsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWFzaW5nID09IFwiZnVuY3Rpb25cIiAmJiAhZWFzaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBlYXNpbmc7XG4gICAgICAgICAgICBlYXNpbmcgPSBtaW5hLmxpbmVhcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHIgPSBhdHRyO1xuICAgICAgICB0aGlzLmR1ciA9IG1zO1xuICAgICAgICBlYXNpbmcgJiYgKHRoaXMuZWFzaW5nID0gZWFzaW5nKTtcbiAgICAgICAgY2FsbGJhY2sgJiYgKHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjayk7XG4gICAgfTtcbiAgICBTbmFwLl8uQW5pbWF0aW9uID0gQW5pbWF0aW9uO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLmFuaW1hdGlvblxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQ3JlYXRlcyBhbiBhbmltYXRpb24gb2JqZWN0XG4gICAgICoqXG4gICAgIC0gYXR0ciAob2JqZWN0KSBhdHRyaWJ1dGVzIG9mIGZpbmFsIGRlc3RpbmF0aW9uXG4gICAgIC0gZHVyYXRpb24gKG51bWJlcikgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiwgaW4gbWlsbGlzZWNvbmRzXG4gICAgIC0gZWFzaW5nIChmdW5jdGlvbikgI29wdGlvbmFsIG9uZSBvZiBlYXNpbmcgZnVuY3Rpb25zIG9mIEBtaW5hIG9yIGN1c3RvbSBvbmVcbiAgICAgLSBjYWxsYmFjayAoZnVuY3Rpb24pICNvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGZpcmVzIHdoZW4gYW5pbWF0aW9uIGVuZHNcbiAgICAgPSAob2JqZWN0KSBhbmltYXRpb24gb2JqZWN0XG4gICAgXFwqL1xuICAgIFNuYXAuYW5pbWF0aW9uID0gZnVuY3Rpb24gKGF0dHIsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKGF0dHIsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LmluQW5pbVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogUmV0dXJucyBhIHNldCBvZiBhbmltYXRpb25zIHRoYXQgbWF5IGJlIGFibGUgdG8gbWFuaXB1bGF0ZSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICoqXG4gICAgID0gKG9iamVjdCkgaW4gZm9ybWF0OlxuICAgICBvIHtcbiAgICAgbyAgICAgYW5pbSAob2JqZWN0KSBhbmltYXRpb24gb2JqZWN0LFxuICAgICBvICAgICBtaW5hIChvYmplY3QpIEBtaW5hIG9iamVjdCxcbiAgICAgbyAgICAgY3VyU3RhdHVzIChudW1iZXIpIDAuLjEg4oCUIHN0YXR1cyBvZiB0aGUgYW5pbWF0aW9uOiAwIOKAlCBqdXN0IHN0YXJ0ZWQsIDEg4oCUIGp1c3QgZmluaXNoZWQsXG4gICAgIG8gICAgIHN0YXR1cyAoZnVuY3Rpb24pIGdldHMgb3Igc2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBhbmltYXRpb24sXG4gICAgIG8gICAgIHN0b3AgKGZ1bmN0aW9uKSBzdG9wcyB0aGUgYW5pbWF0aW9uXG4gICAgIG8gfVxuICAgIFxcKi9cbiAgICBlbHByb3RvLmluQW5pbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcyxcbiAgICAgICAgICAgIHJlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpZCBpbiBlbC5hbmltcykgaWYgKGVsLmFuaW1zW2hhc10oaWQpKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGFuaW06IG5ldyBBbmltYXRpb24oYS5fYXR0cnMsIGEuZHVyLCBhLmVhc2luZywgYS5fY2FsbGJhY2spLFxuICAgICAgICAgICAgICAgICAgICBtaW5hOiBhLFxuICAgICAgICAgICAgICAgICAgICBjdXJTdGF0dXM6IGEuc3RhdHVzKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuc3RhdHVzKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KGVsLmFuaW1zW2lkXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgICAvKlxcXG4gICAgICogU25hcC5hbmltYXRlXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBSdW5zIGdlbmVyaWMgYW5pbWF0aW9uIG9mIG9uZSBudW1iZXIgaW50byBhbm90aGVyIHdpdGggYSBjYXJpbmcgZnVuY3Rpb25cbiAgICAgKipcbiAgICAgLSBmcm9tIChudW1iZXJ8YXJyYXkpIG51bWJlciBvciBhcnJheSBvZiBudW1iZXJzXG4gICAgIC0gdG8gKG51bWJlcnxhcnJheSkgbnVtYmVyIG9yIGFycmF5IG9mIG51bWJlcnNcbiAgICAgLSBzZXR0ZXIgKGZ1bmN0aW9uKSBjYXJpbmcgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIG9uZSBudW1iZXIgYXJndW1lbnRcbiAgICAgLSBkdXJhdGlvbiAobnVtYmVyKSBkdXJhdGlvbiwgaW4gbWlsbGlzZWNvbmRzXG4gICAgIC0gZWFzaW5nIChmdW5jdGlvbikgI29wdGlvbmFsIGVhc2luZyBmdW5jdGlvbiBmcm9tIEBtaW5hIG9yIGN1c3RvbVxuICAgICAtIGNhbGxiYWNrIChmdW5jdGlvbikgI29wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBhbmltYXRpb24gZW5kc1xuICAgICA9IChvYmplY3QpIGFuaW1hdGlvbiBvYmplY3QgaW4gQG1pbmEgZm9ybWF0XG4gICAgIG8ge1xuICAgICBvICAgICBpZCAoc3RyaW5nKSBhbmltYXRpb24gaWQsIGNvbnNpZGVyIGl0IHJlYWQtb25seSxcbiAgICAgbyAgICAgZHVyYXRpb24gKGZ1bmN0aW9uKSBnZXRzIG9yIHNldHMgdGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24sXG4gICAgIG8gICAgIGVhc2luZyAoZnVuY3Rpb24pIGVhc2luZyxcbiAgICAgbyAgICAgc3BlZWQgKGZ1bmN0aW9uKSBnZXRzIG9yIHNldHMgdGhlIHNwZWVkIG9mIHRoZSBhbmltYXRpb24sXG4gICAgIG8gICAgIHN0YXR1cyAoZnVuY3Rpb24pIGdldHMgb3Igc2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBhbmltYXRpb24sXG4gICAgIG8gICAgIHN0b3AgKGZ1bmN0aW9uKSBzdG9wcyB0aGUgYW5pbWF0aW9uXG4gICAgIG8gfVxuICAgICB8IHZhciByZWN0ID0gU25hcCgpLnJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgfCBTbmFwLmFuaW1hdGUoMCwgMTAsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgfCAgICAgcmVjdC5hdHRyKHtcbiAgICAgfCAgICAgICAgIHg6IHZhbFxuICAgICB8ICAgICB9KTtcbiAgICAgfCB9LCAxMDAwKTtcbiAgICAgfCAvLyBpbiBnaXZlbiBjb250ZXh0IGlzIGVxdWl2YWxlbnQgdG9cbiAgICAgfCByZWN0LmFuaW1hdGUoe3g6IDEwfSwgMTAwMCk7XG4gICAgXFwqL1xuICAgIFNuYXAuYW5pbWF0ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bywgc2V0dGVyLCBtcywgZWFzaW5nLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGVhc2luZyA9PSBcImZ1bmN0aW9uXCIgJiYgIWVhc2luZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZWFzaW5nO1xuICAgICAgICAgICAgZWFzaW5nID0gbWluYS5saW5lYXI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vdyA9IG1pbmEudGltZSgpLFxuICAgICAgICAgICAgYW5pbSA9IG1pbmEoZnJvbSwgdG8sIG5vdywgbm93ICsgbXMsIG1pbmEudGltZSwgc2V0dGVyLCBlYXNpbmcpO1xuICAgICAgICBjYWxsYmFjayAmJiBldmUub25jZShcIm1pbmEuZmluaXNoLlwiICsgYW5pbS5pZCwgY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gYW5pbTtcbiAgICB9O1xuICAgIC8qXFxcbiAgICAgKiBFbGVtZW50LnN0b3BcbiAgICAgWyBtZXRob2QgXVxuICAgICAqKlxuICAgICAqIFN0b3BzIGFsbCB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgICAqKlxuICAgICA9IChFbGVtZW50KSB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgXFwqL1xuICAgIGVscHJvdG8uc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuaW1zID0gdGhpcy5pbkFuaW0oKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYW5pbXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgYW5pbXNbaV0uc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLypcXFxuICAgICAqIEVsZW1lbnQuYW5pbWF0ZVxuICAgICBbIG1ldGhvZCBdXG4gICAgICoqXG4gICAgICogQW5pbWF0ZXMgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcbiAgICAgKipcbiAgICAgLSBhdHRycyAob2JqZWN0KSBrZXktdmFsdWUgcGFpcnMgb2YgZGVzdGluYXRpb24gYXR0cmlidXRlc1xuICAgICAtIGR1cmF0aW9uIChudW1iZXIpIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzXG4gICAgIC0gZWFzaW5nIChmdW5jdGlvbikgI29wdGlvbmFsIGVhc2luZyBmdW5jdGlvbiBmcm9tIEBtaW5hIG9yIGN1c3RvbVxuICAgICAtIGNhbGxiYWNrIChmdW5jdGlvbikgI29wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgd2hlbiB0aGUgYW5pbWF0aW9uIGVuZHNcbiAgICAgPSAoRWxlbWVudCkgdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgIFxcKi9cbiAgICBlbHByb3RvLmFuaW1hdGUgPSBmdW5jdGlvbiAoYXR0cnMsIG1zLCBlYXNpbmcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWFzaW5nID09IFwiZnVuY3Rpb25cIiAmJiAhZWFzaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBlYXNpbmc7XG4gICAgICAgICAgICBlYXNpbmcgPSBtaW5hLmxpbmVhcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cnMgaW5zdGFuY2VvZiBBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gYXR0cnMuY2FsbGJhY2s7XG4gICAgICAgICAgICBlYXNpbmcgPSBhdHRycy5lYXNpbmc7XG4gICAgICAgICAgICBtcyA9IGF0dHJzLmR1cjtcbiAgICAgICAgICAgIGF0dHJzID0gYXR0cnMuYXR0cjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmtleXMgPSBbXSwgdGtleXMgPSBbXSwga2V5cyA9IHt9LCBmcm9tLCB0bywgZiwgZXEsXG4gICAgICAgICAgICBlbCA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykgaWYgKGF0dHJzW2hhc10oa2V5KSkge1xuICAgICAgICAgICAgaWYgKGVsLmVxdWFsKSB7XG4gICAgICAgICAgICAgICAgZXEgPSBlbC5lcXVhbChrZXksIFN0cihhdHRyc1trZXldKSk7XG4gICAgICAgICAgICAgICAgZnJvbSA9IGVxLmZyb207XG4gICAgICAgICAgICAgICAgdG8gPSBlcS50bztcbiAgICAgICAgICAgICAgICBmID0gZXEuZjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9ICtlbC5hdHRyKGtleSk7XG4gICAgICAgICAgICAgICAgdG8gPSArYXR0cnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsZW4gPSBpcyhmcm9tLCBcImFycmF5XCIpID8gZnJvbS5sZW5ndGggOiAxO1xuICAgICAgICAgICAga2V5c1trZXldID0gc2xpY2UoZmtleXMubGVuZ3RoLCBma2V5cy5sZW5ndGggKyBsZW4sIGYpO1xuICAgICAgICAgICAgZmtleXMgPSBma2V5cy5jb25jYXQoZnJvbSk7XG4gICAgICAgICAgICB0a2V5cyA9IHRrZXlzLmNvbmNhdCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vdyA9IG1pbmEudGltZSgpLFxuICAgICAgICAgICAgYW5pbSA9IG1pbmEoZmtleXMsIHRrZXlzLCBub3csIG5vdyArIG1zLCBtaW5hLnRpbWUsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSBpZiAoa2V5c1toYXNdKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cltrZXldID0ga2V5c1trZXldKHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsLmF0dHIoYXR0cik7XG4gICAgICAgICAgICB9LCBlYXNpbmcpO1xuICAgICAgICBlbC5hbmltc1thbmltLmlkXSA9IGFuaW07XG4gICAgICAgIGFuaW0uX2F0dHJzID0gYXR0cnM7XG4gICAgICAgIGFuaW0uX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIGV2ZShcInNuYXAuYW5pbWNyZWF0ZWQuXCIgKyBlbC5pZCwgYW5pbSk7XG4gICAgICAgIGV2ZS5vbmNlKFwibWluYS5maW5pc2guXCIgKyBhbmltLmlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBldmUub2ZmKFwibWluYS4qLlwiICsgYW5pbS5pZCk7XG4gICAgICAgICAgICBkZWxldGUgZWwuYW5pbXNbYW5pbS5pZF07XG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGV2ZS5vbmNlKFwibWluYS5zdG9wLlwiICsgYW5pbS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXZlLm9mZihcIm1pbmEuKi5cIiArIGFuaW0uaWQpO1xuICAgICAgICAgICAgZGVsZXRlIGVsLmFuaW1zW2FuaW0uaWRdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG59KTtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE3IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuU25hcC5wbHVnaW4oZnVuY3Rpb24gKFNuYXAsIEVsZW1lbnQsIFBhcGVyLCBnbG9iKSB7XG4gICAgLy8gQ29sb3VycyBhcmUgZnJvbSBodHRwczovL3d3dy5tYXRlcmlhbHVpLmNvXG4gICAgdmFyIHJlZCAgICAgICAgID0gXCIjZmZlYmVlI2ZmY2RkMiNlZjlhOWEjZTU3MzczI2VmNTM1MCNmNDQzMzYjZTUzOTM1I2QzMmYyZiNjNjI4MjgjYjcxYzFjI2ZmOGE4MCNmZjUyNTIjZmYxNzQ0I2Q1MDAwMFwiLFxuICAgICAgICBwaW5rICAgICAgICA9IFwiI0ZDRTRFQyNGOEJCRDAjRjQ4RkIxI0YwNjI5MiNFQzQwN0EjRTkxRTYzI0Q4MUI2MCNDMjE4NUIjQUQxNDU3Izg4MEU0RiNGRjgwQUIjRkY0MDgxI0Y1MDA1NyNDNTExNjJcIixcbiAgICAgICAgcHVycGxlICAgICAgPSBcIiNGM0U1RjUjRTFCRUU3I0NFOTNEOCNCQTY4QzgjQUI0N0JDIzlDMjdCMCM4RTI0QUEjN0IxRkEyIzZBMUI5QSM0QTE0OEMjRUE4MEZDI0UwNDBGQiNENTAwRjkjQUEwMEZGXCIsXG4gICAgICAgIGRlZXBwdXJwbGUgID0gXCIjRURFN0Y2I0QxQzRFOSNCMzlEREIjOTU3NUNEIzdFNTdDMiM2NzNBQjcjNUUzNUIxIzUxMkRBOCM0NTI3QTAjMzExQjkyI0IzODhGRiM3QzRERkYjNjUxRkZGIzYyMDBFQVwiLFxuICAgICAgICBpbmRpZ28gICAgICA9IFwiI0U4RUFGNiNDNUNBRTkjOUZBOERBIzc5ODZDQiM1QzZCQzAjM0Y1MUI1IzM5NDlBQiMzMDNGOUYjMjgzNTkzIzFBMjM3RSM4QzlFRkYjNTM2REZFIzNENUFGRSMzMDRGRkVcIixcbiAgICAgICAgYmx1ZSAgICAgICAgPSBcIiNFM0YyRkQjQkJERUZCIzkwQ0FGOSM2NEI1RjYjNjRCNUY2IzIxOTZGMyMxRTg4RTUjMTk3NkQyIzE1NjVDMCMwRDQ3QTEjODJCMUZGIzQ0OEFGRiMyOTc5RkYjMjk2MkZGXCIsXG4gICAgICAgIGxpZ2h0Ymx1ZSAgID0gXCIjRTFGNUZFI0IzRTVGQyM4MUQ0RkEjNEZDM0Y3IzI5QjZGNiMwM0E5RjQjMDM5QkU1IzAyODhEMSMwMjc3QkQjMDE1NzlCIzgwRDhGRiM0MEM0RkYjMDBCMEZGIzAwOTFFQVwiLFxuICAgICAgICBjeWFuICAgICAgICA9IFwiI0UwRjdGQSNCMkVCRjIjODBERUVBIzRERDBFMSMyNkM2REEjMDBCQ0Q0IzAwQUNDMSMwMDk3QTcjMDA4MzhGIzAwNjA2NCM4NEZGRkYjMThGRkZGIzAwRTVGRiMwMEI4RDRcIixcbiAgICAgICAgdGVhbCAgICAgICAgPSBcIiNFMEYyRjEjQjJERkRCIzgwQ0JDNCM0REI2QUMjMjZBNjlBIzAwOTY4OCMwMDg5N0IjMDA3OTZCIzAwNjk1QyMwMDRENDAjQTdGRkVCIzY0RkZEQSMxREU5QjYjMDBCRkE1XCIsXG4gICAgICAgIGdyZWVuICAgICAgID0gXCIjRThGNUU5I0M4RTZDOSNBNUQ2QTcjODFDNzg0IzY2QkI2QSM0Q0FGNTAjNDNBMDQ3IzM4OEUzQyMyRTdEMzIjMUI1RTIwI0I5RjZDQSM2OUYwQUUjMDBFNjc2IzAwQzg1M1wiLFxuICAgICAgICBsaWdodGdyZWVuICA9IFwiI0YxRjhFOSNEQ0VEQzgjQzVFMUE1I0FFRDU4MSM5Q0NDNjUjOEJDMzRBIzdDQjM0MiM2ODlGMzgjNTU4QjJGIzMzNjkxRSNDQ0ZGOTAjQjJGRjU5Izc2RkYwMyM2NEREMTdcIixcbiAgICAgICAgbGltZSAgICAgICAgPSBcIiNGOUZCRTcjRjBGNEMzI0U2RUU5QyNEQ0U3NzUjRDRFMTU3I0NEREMzOSNDMENBMzMjQUZCNDJCIzlFOUQyNCM4Mjc3MTcjRjRGRjgxI0VFRkY0MSNDNkZGMDAjQUVFQTAwXCIsXG4gICAgICAgIHllbGxvdyAgICAgID0gXCIjRkZGREU3I0ZGRjlDNCNGRkY1OUQjRkZGMTc2I0ZGRUU1OCNGRkVCM0IjRkREODM1I0ZCQzAyRCNGOUE4MjUjRjU3RjE3I0ZGRkY4RCNGRkZGMDAjRkZFQTAwI0ZGRDYwMFwiLFxuICAgICAgICBhbWJlciAgICAgICA9IFwiI0ZGRjhFMSNGRkVDQjMjRkZFMDgyI0ZGRDU0RiNGRkNBMjgjRkZDMTA3I0ZGQjMwMCNGRkEwMDAjRkY4RjAwI0ZGNkYwMCNGRkU1N0YjRkZENzQwI0ZGQzQwMCNGRkFCMDBcIixcbiAgICAgICAgb3JhbmdlICAgICAgPSBcIiNGRkYzRTAjRkZFMEIyI0ZGQ0M4MCNGRkI3NEQjRkZBNzI2I0ZGOTgwMCNGQjhDMDAjRjU3QzAwI0VGNkMwMCNFNjUxMDAjRkZEMTgwI0ZGQUI0MCNGRjkxMDAjRkY2RDAwXCIsXG4gICAgICAgIGRlZXBvcmFuZ2UgID0gXCIjRkJFOUU3I0ZGQ0NCQyNGRkFCOTEjRkY4QTY1I0ZGNzA0MyNGRjU3MjIjRjQ1MTFFI0U2NEExOSNEODQzMTUjQkYzNjBDI0ZGOUU4MCNGRjZFNDAjRkYzRDAwI0REMkMwMFwiLFxuICAgICAgICBicm93biAgICAgICA9IFwiI0VGRUJFOSNEN0NDQzgjQkNBQUE0I0ExODg3RiM4RDZFNjMjNzk1NTQ4IzZENEM0MSM1RDQwMzcjNEUzNDJFIzNFMjcyM1wiLFxuICAgICAgICBncmV5ICAgICAgICA9IFwiI0ZBRkFGQSNGNUY1RjUjRUVFRUVFI0UwRTBFMCNCREJEQkQjOUU5RTlFIzc1NzU3NSM2MTYxNjEjNDI0MjQyIzIxMjEyMVwiLFxuICAgICAgICBibHVlZ3JleSAgICA9IFwiI0VDRUZGMSNDRkQ4REMjQjBCRUM1IzkwQTRBRSM3ODkwOUMjNjA3RDhCIzU0NkU3QSM0NTVBNjQjMzc0NzRGIzI2MzIzOFwiO1xuICAgIC8qXFxcbiAgICAgKiBTbmFwLm11aVxuICAgICBbIHByb3BlcnR5IF1cbiAgICAgKipcbiAgICAgKiBDb250YWluIE1hdGVyaWFsIFVJIGNvbG91cnMuXG4gICAgIHwgU25hcCgpLnJlY3QoMCwgMCwgMTAsIDEwKS5hdHRyKHtmaWxsOiBTbmFwLm11aS5kZWVwcHVycGxlLCBzdHJva2U6IFNuYXAubXVpLmFtYmVyWzYwMF19KTtcbiAgICAgIyBGb3IgY29sb3VyIHJlZmVyZW5jZTogPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY29cIj5odHRwczovL3d3dy5tYXRlcmlhbHVpLmNvPC9hPi5cbiAgICBcXCovXG4gICAgU25hcC5tdWkgPSB7fTtcbiAgICAvKlxcXG4gICAgICogU25hcC5mbGF0XG4gICAgIFsgcHJvcGVydHkgXVxuICAgICAqKlxuICAgICAqIENvbnRhaW4gRmxhdCBVSSBjb2xvdXJzLlxuICAgICB8IFNuYXAoKS5yZWN0KDAsIDAsIDEwLCAxMCkuYXR0cih7ZmlsbDogU25hcC5mbGF0LmNhcnJvdCwgc3Ryb2tlOiBTbmFwLmZsYXQud2V0YXNwaGFsdH0pO1xuICAgICAjIEZvciBjb2xvdXIgcmVmZXJlbmNlOiA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWF0ZXJpYWx1aS5jb1wiPmh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY288L2E+LlxuICAgIFxcKi9cbiAgICBTbmFwLmZsYXQgPSB7fTtcbiAgICBmdW5jdGlvbiBzYXZlQ29sb3IoY29sb3JzKSB7XG4gICAgICAgIGNvbG9ycyA9IGNvbG9ycy5zcGxpdCgvKD89IykvKTtcbiAgICAgICAgdmFyIGNvbG9yID0gbmV3IFN0cmluZyhjb2xvcnNbNV0pO1xuICAgICAgICBjb2xvcls1MF0gPSBjb2xvcnNbMF07XG4gICAgICAgIGNvbG9yWzEwMF0gPSBjb2xvcnNbMV07XG4gICAgICAgIGNvbG9yWzIwMF0gPSBjb2xvcnNbMl07XG4gICAgICAgIGNvbG9yWzMwMF0gPSBjb2xvcnNbM107XG4gICAgICAgIGNvbG9yWzQwMF0gPSBjb2xvcnNbNF07XG4gICAgICAgIGNvbG9yWzUwMF0gPSBjb2xvcnNbNV07XG4gICAgICAgIGNvbG9yWzYwMF0gPSBjb2xvcnNbNl07XG4gICAgICAgIGNvbG9yWzcwMF0gPSBjb2xvcnNbN107XG4gICAgICAgIGNvbG9yWzgwMF0gPSBjb2xvcnNbOF07XG4gICAgICAgIGNvbG9yWzkwMF0gPSBjb2xvcnNbOV07XG4gICAgICAgIGlmIChjb2xvcnNbMTBdKSB7XG4gICAgICAgICAgICBjb2xvci5BMTAwID0gY29sb3JzWzEwXTtcbiAgICAgICAgICAgIGNvbG9yLkEyMDAgPSBjb2xvcnNbMTFdO1xuICAgICAgICAgICAgY29sb3IuQTQwMCA9IGNvbG9yc1sxMl07XG4gICAgICAgICAgICBjb2xvci5BNzAwID0gY29sb3JzWzEzXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICAgIFNuYXAubXVpLnJlZCA9IHNhdmVDb2xvcihyZWQpO1xuICAgIFNuYXAubXVpLnBpbmsgPSBzYXZlQ29sb3IocGluayk7XG4gICAgU25hcC5tdWkucHVycGxlID0gc2F2ZUNvbG9yKHB1cnBsZSk7XG4gICAgU25hcC5tdWkuZGVlcHB1cnBsZSA9IHNhdmVDb2xvcihkZWVwcHVycGxlKTtcbiAgICBTbmFwLm11aS5pbmRpZ28gPSBzYXZlQ29sb3IoaW5kaWdvKTtcbiAgICBTbmFwLm11aS5ibHVlID0gc2F2ZUNvbG9yKGJsdWUpO1xuICAgIFNuYXAubXVpLmxpZ2h0Ymx1ZSA9IHNhdmVDb2xvcihsaWdodGJsdWUpO1xuICAgIFNuYXAubXVpLmN5YW4gPSBzYXZlQ29sb3IoY3lhbik7XG4gICAgU25hcC5tdWkudGVhbCA9IHNhdmVDb2xvcih0ZWFsKTtcbiAgICBTbmFwLm11aS5ncmVlbiA9IHNhdmVDb2xvcihncmVlbik7XG4gICAgU25hcC5tdWkubGlnaHRncmVlbiA9IHNhdmVDb2xvcihsaWdodGdyZWVuKTtcbiAgICBTbmFwLm11aS5saW1lID0gc2F2ZUNvbG9yKGxpbWUpO1xuICAgIFNuYXAubXVpLnllbGxvdyA9IHNhdmVDb2xvcih5ZWxsb3cpO1xuICAgIFNuYXAubXVpLmFtYmVyID0gc2F2ZUNvbG9yKGFtYmVyKTtcbiAgICBTbmFwLm11aS5vcmFuZ2UgPSBzYXZlQ29sb3Iob3JhbmdlKTtcbiAgICBTbmFwLm11aS5kZWVwb3JhbmdlID0gc2F2ZUNvbG9yKGRlZXBvcmFuZ2UpO1xuICAgIFNuYXAubXVpLmJyb3duID0gc2F2ZUNvbG9yKGJyb3duKTtcbiAgICBTbmFwLm11aS5ncmV5ID0gc2F2ZUNvbG9yKGdyZXkpO1xuICAgIFNuYXAubXVpLmJsdWVncmV5ID0gc2F2ZUNvbG9yKGJsdWVncmV5KTtcbiAgICBTbmFwLmZsYXQudHVycXVvaXNlID0gXCIjMWFiYzljXCI7XG4gICAgU25hcC5mbGF0LmdyZWVuc2VhID0gXCIjMTZhMDg1XCI7XG4gICAgU25hcC5mbGF0LnN1bmZsb3dlciA9IFwiI2YxYzQwZlwiO1xuICAgIFNuYXAuZmxhdC5vcmFuZ2UgPSBcIiNmMzljMTJcIjtcbiAgICBTbmFwLmZsYXQuZW1lcmxhbmQgPSBcIiMyZWNjNzFcIjtcbiAgICBTbmFwLmZsYXQubmVwaHJpdGlzID0gXCIjMjdhZTYwXCI7XG4gICAgU25hcC5mbGF0LmNhcnJvdCA9IFwiI2U2N2UyMlwiO1xuICAgIFNuYXAuZmxhdC5wdW1wa2luID0gXCIjZDM1NDAwXCI7XG4gICAgU25hcC5mbGF0LnBldGVycml2ZXIgPSBcIiMzNDk4ZGJcIjtcbiAgICBTbmFwLmZsYXQuYmVsaXplaG9sZSA9IFwiIzI5ODBiOVwiO1xuICAgIFNuYXAuZmxhdC5hbGl6YXJpbiA9IFwiI2U3NGMzY1wiO1xuICAgIFNuYXAuZmxhdC5wb21lZ3JhbmF0ZSA9IFwiI2MwMzkyYlwiO1xuICAgIFNuYXAuZmxhdC5hbWV0aHlzdCA9IFwiIzliNTliNlwiO1xuICAgIFNuYXAuZmxhdC53aXN0ZXJpYSA9IFwiIzhlNDRhZFwiO1xuICAgIFNuYXAuZmxhdC5jbG91ZHMgPSBcIiNlY2YwZjFcIjtcbiAgICBTbmFwLmZsYXQuc2lsdmVyID0gXCIjYmRjM2M3XCI7XG4gICAgU25hcC5mbGF0LndldGFzcGhhbHQgPSBcIiMzNDQ5NWVcIjtcbiAgICBTbmFwLmZsYXQubWlkbmlnaHRibHVlID0gXCIjMmMzZTUwXCI7XG4gICAgU25hcC5mbGF0LmNvbmNyZXRlID0gXCIjOTVhNWE2XCI7XG4gICAgU25hcC5mbGF0LmFzYmVzdG9zID0gXCIjN2Y4YzhkXCI7XG4gICAgLypcXFxuICAgICAqIFNuYXAuaW1wb3J0TVVJQ29sb3JzXG4gICAgIFsgbWV0aG9kIF1cbiAgICAgKipcbiAgICAgKiBJbXBvcnRzIE1hdGVyaWFsIFVJIGNvbG91cnMgaW50byBnbG9iYWwgb2JqZWN0LlxuICAgICB8IFNuYXAuaW1wb3J0TVVJQ29sb3JzKCk7XG4gICAgIHwgU25hcCgpLnJlY3QoMCwgMCwgMTAsIDEwKS5hdHRyKHtmaWxsOiBkZWVwcHVycGxlLCBzdHJva2U6IGFtYmVyWzYwMF19KTtcbiAgICAgIyBGb3IgY29sb3VyIHJlZmVyZW5jZTogPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hdGVyaWFsdWkuY29cIj5odHRwczovL3d3dy5tYXRlcmlhbHVpLmNvPC9hPi5cbiAgICBcXCovXG4gICAgU25hcC5pbXBvcnRNVUlDb2xvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGNvbG9yIGluIFNuYXAubXVpKSB7XG4gICAgICAgICAgICBpZiAoU25hcC5tdWkuaGFzT3duUHJvcGVydHkoY29sb3IpKSB7XG4gICAgICAgICAgICAgICAgd2luZG93W2NvbG9yXSA9IFNuYXAubXVpW2NvbG9yXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTbmFwXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgc2xpZGUgYXMgTWVudSB9IGZyb20gJ3JlYWN0LWJ1cmdlci1tZW51J1xuXG5cblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkJhcih7IGlkLCBzZXRQcm9wcyB9KSB7XG5cbiAgcmV0dXJuIChcbiAgICA8TWVudT5cbiAgICAgIDxhIGlkPVwiaG9tZVwiIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGhyZWY9XCIvXCI+SG9tZTwvYT5cbiAgICAgICAgPGEgaWQ9XCJhYm91dFwiIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGhyZWY9XCIvYWJvdXRcIj5BYm91dDwvYT5cbiAgICAgICAgPGEgaWQ9XCJjb250YWN0XCIgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgaHJlZj1cIi9jb250YWN0XCI+Q29udGFjdDwvYT5cbiAgICA8L01lbnU+XG4gICk7XG59XG5cbk5hdkJhci5kZWZhdWx0UHJvcHMgPSB7XG59O1xuXG5OYXZCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogRGFzaC1hc3NpZ25lZCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgdG8gcmVwb3J0IHByb3BlcnR5IGNoYW5nZXNcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0UHJvcHM6IFByb3BUeXBlcy5mdW5jLFxuXG5cbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0ICovXG5pbXBvcnQgU2VhcmNoQmFyIGZyb20gJy4vY29tcG9uZW50cy9TZWFyY2hCYXIucmVhY3QnO1xuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvQWNjb3JkaW9uLnJlYWN0JztcbmltcG9ydCBUcmVlbWFwIGZyb20gJy4vY29tcG9uZW50cy9UcmVlbWFwLnJlYWN0JztcbmltcG9ydCBOYXZCYXIgZnJvbSBcIi4vY29tcG9uZW50cy9OYXZCYXIucmVhY3RcIlxuXG5cbmV4cG9ydCB7U2VhcmNoQmFyLCBBY2NvcmRpb24sIFRyZWVtYXAsIE5hdkJhcn07XG4iXSwic291cmNlUm9vdCI6IiJ9