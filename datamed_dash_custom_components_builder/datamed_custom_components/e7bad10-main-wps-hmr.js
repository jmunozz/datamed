webpackHotUpdatedatamed_custom_components("main",{

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
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SearchBar_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SearchBar.react */ "./src/lib/components/SearchBar.react.js");
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navbar.scss */ "./src/lib/components/navbar.scss");
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_navbar_scss__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _logo_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./logo.svg */ "./src/lib/components/logo.svg");
/* harmony import */ var _search_icon_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./search_icon.svg */ "./src/lib/components/search_icon.svg");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var BREAKPOINT_TABLET = 840;
var BREAKPOINT_MOBILE = 340;

function Overlay(_ref) {
  var onClick = _ref.onClick;
  var root = document.getElementById("react-entry-point");
  var el = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    onClick: onClick,
    className: "Overlay"
  });
  return /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.createPortal(el, root);
}

function BurgerIcon(_ref2) {
  var open = _ref2.open,
      onClick = _ref2.onClick;
  var currentClass = open ? "open" : "";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "".concat(currentClass, " b-container")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "b-menu",
    onClick: onClick
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "b-bun b-bun--top"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "b-bun b-bun--mid"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "b-bun b-bun--bottom"
  })));
}

function BurgerNavigation(_ref3) {
  var open = _ref3.open,
      children = _ref3.children;
  var currentClass = open ? "open" : "";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "".concat(currentClass, " b-nav")
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "b-link"
    }, child);
  }));
}

function Burger(_ref4) {
  var children = _ref4.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var handleBurgerClick = function handleBurgerClick() {
    setIsOpen(!isOpen);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BurgerIcon, {
    open: isOpen,
    onClick: handleBurgerClick
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BurgerNavigation, {
    open: isOpen
  }, children));
}

function ClassicNavigation(_ref5) {
  var children = _ref5.children;
  var url = window.location.pathname;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
    className: "NavbarNavigation"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
    var className = ["NavbarNavigationItem"];
    console.log(url, child.props.href);

    if (url.includes(child.props.href)) {
      className.push("NavbarNavigationItem-isCurrent");
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: className.join(" ")
    }, child);
  }));
}

function Logo(_ref6) {
  var onClick = _ref6.onClick;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/",
    onClick: onClick
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
    className: "CustomNavbarLogo",
    src: _logo_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
  }));
}

function SearchIcon(_ref7) {
  var opts = _ref7.opts,
      fireOnSelect = _ref7.fireOnSelect,
      setProps = _ref7.setProps;

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isOpen = _useState4[0],
      setIsOpen = _useState4[1];

  var handleClick = function handleClick() {
    setIsOpen(!isOpen);
  };

  var handleSelect = function handleSelect(props) {
    setIsOpen(false);
    setProps(props);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "SearchIcon",
    onClick: handleClick
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
    src: _search_icon_svg__WEBPACK_IMPORTED_MODULE_6__["default"]
  })), isOpen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CustomNavbarSearchBarContainer-isMobile"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SearchBar_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    opts: opts,
    fireOnSelect: fireOnSelect,
    setProps: handleSelect
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Overlay, {
    onClick: handleClick
  })));
}
/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */


function NavBar(_ref8) {
  var id = _ref8.id,
      setProps = _ref8.setProps,
      fireOnSelect = _ref8.fireOnSelect,
      opts = _ref8.opts;

  var getWindowDimensions = function getWindowDimensions() {
    return {
      height: window.innerHeight,
      width: window.innerWidth
    };
  };

  var getModeFromWindowDimensions = function getModeFromWindowDimensions() {
    var width = getWindowDimensions().width;
    if (width < BREAKPOINT_MOBILE) return "MOBILE";else if (width < BREAKPOINT_TABLET) return "TABLET";else return "NORMAL";
  };

  var handleClick = function handleClick(e) {
    e.preventDefault();
    setProps({
      url: e.target.href
    });
  };

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(getModeFromWindowDimensions()),
      _useState6 = _slicedToArray(_useState5, 2),
      mode = _useState6[0],
      setMode = _useState6[1];

  var items = [{
    label: "Analyses thématiques",
    href: "#"
  }, {
    label: "Explorer",
    href: "/apps/explorer"
  }, {
    label: "À propos",
    href: "/apps/a_propos"
  }];
  var menuItems = items.map(function (i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: i.href,
      onClick: handleClick,
      style: {
        color: "inherit"
      }
    }, i.label);
  });

  var windowHasResized = function windowHasResized() {
    var nextMode = getModeFromWindowDimensions();

    if (nextMode !== mode) {
      setMode(nextMode);
    }
  };

  var getMenu = function getMenu(mode) {
    if (mode === "NORMAL") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ClassicNavigation, null, menuItems);
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Burger, null, menuItems);
    }
  };

  var getSearchBar = function getSearchBar(mode) {
    if (mode === "NORMAL" || mode === "TABLET") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbarSearchBarContainer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SearchBar_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
        opts: opts,
        fireOnSelect: fireOnSelect,
        setProps: setProps
      }));
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchIcon, {
        opts: opts,
        fireOnSelect: fireOnSelect,
        setProps: setProps
      });
    }
  };

  var getNavBarElems = function getNavBarElems(mode) {
    if (mode === "NORMAL") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbar"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, {
        onClick: handleClick
      }), getMenu(mode), getSearchBar(mode));
    } else if (mode === "TABLET") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbar"
      }, getMenu(mode), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, {
        onClick: handleClick
      }), getSearchBar(mode));
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id,
        className: "CustomNavbar CustomNavbar-isMobile"
      }, getMenu(mode), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, {
        onClick: handleClick
      }), getSearchBar(mode));
    }
  };

  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(function () {
    window.addEventListener("resize", windowHasResized);
    return function () {
      window.removeEventListener("resize", windowHasResized);
    };
  });
  return getNavBarElems(mode);
}
NavBar.defaultProps = {};
var optsPropType = prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.shape({
  label: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.any,
  type: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
}));
NavBar.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func,
  url: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string,
  opts: optsPropType,
  value: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.shape({
    value: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number]),
    type: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
  }),
  fireOnSelect: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiT3ZlcmxheSIsIm9uQ2xpY2siLCJyb290IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVsIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJCdXJnZXJJY29uIiwib3BlbiIsImN1cnJlbnRDbGFzcyIsIkJ1cmdlck5hdmlnYXRpb24iLCJjaGlsZHJlbiIsIlJlYWN0IiwiQ2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsIkJ1cmdlciIsInVzZVN0YXRlIiwiaXNPcGVuIiwic2V0SXNPcGVuIiwiaGFuZGxlQnVyZ2VyQ2xpY2siLCJDbGFzc2ljTmF2aWdhdGlvbiIsInVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjbGFzc05hbWUiLCJjb25zb2xlIiwibG9nIiwicHJvcHMiLCJocmVmIiwiaW5jbHVkZXMiLCJwdXNoIiwiam9pbiIsIkxvZ28iLCJsb2dvQU5TTSIsIlNlYXJjaEljb24iLCJvcHRzIiwiZmlyZU9uU2VsZWN0Iiwic2V0UHJvcHMiLCJoYW5kbGVDbGljayIsImhhbmRsZVNlbGVjdCIsInNlYXJjaEljb24iLCJOYXZCYXIiLCJpZCIsImdldFdpbmRvd0RpbWVuc2lvbnMiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRhcmdldCIsIm1vZGUiLCJzZXRNb2RlIiwiaXRlbXMiLCJsYWJlbCIsIm1lbnVJdGVtcyIsImkiLCJjb2xvciIsIndpbmRvd0hhc1Jlc2l6ZWQiLCJuZXh0TW9kZSIsImdldE1lbnUiLCJnZXRTZWFyY2hCYXIiLCJnZXROYXZCYXJFbGVtcyIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGVmYXVsdFByb3BzIiwib3B0c1Byb3BUeXBlIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwic3RyaW5nIiwidmFsdWUiLCJhbnkiLCJ0eXBlIiwicHJvcFR5cGVzIiwiZnVuYyIsIm9uZU9mVHlwZSIsIm51bWJlciIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFNQSxpQkFBaUIsR0FBRyxHQUExQjtBQUNBLElBQU1DLGlCQUFpQixHQUFHLEdBQTFCOztBQUdBLFNBQVNDLE9BQVQsT0FBOEI7QUFBQSxNQUFYQyxPQUFXLFFBQVhBLE9BQVc7QUFDNUIsTUFBTUMsSUFBSSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsbUJBQXhCLENBQWI7QUFDQSxNQUFNQyxFQUFFLGdCQUFHO0FBQUssV0FBTyxFQUFFSixPQUFkO0FBQXVCLGFBQVMsRUFBQztBQUFqQyxJQUFYO0FBQ0Esc0JBQU9LLGdEQUFRLENBQUNDLFlBQVQsQ0FBc0JGLEVBQXRCLEVBQTBCSCxJQUExQixDQUFQO0FBQ0Q7O0FBR0QsU0FBU00sVUFBVCxRQUF1QztBQUFBLE1BQWpCQyxJQUFpQixTQUFqQkEsSUFBaUI7QUFBQSxNQUFYUixPQUFXLFNBQVhBLE9BQVc7QUFFckMsTUFBTVMsWUFBWSxHQUFHRCxJQUFJLEdBQUcsTUFBSCxHQUFZLEVBQXJDO0FBRUEsc0JBQU87QUFBSyxhQUFTLFlBQUtDLFlBQUw7QUFBZCxrQkFDRztBQUFLLGFBQVMsRUFBQyxRQUFmO0FBQXVCLFdBQU8sRUFBRVQ7QUFBaEMsa0JBQ0U7QUFBSyxhQUFTLEVBQUM7QUFBZixJQURGLGVBRUU7QUFBSyxhQUFTLEVBQUM7QUFBZixJQUZGLGVBR0U7QUFBSyxhQUFTLEVBQUM7QUFBZixJQUhGLENBREgsQ0FBUDtBQU9EOztBQUVELFNBQVNVLGdCQUFULFFBQThDO0FBQUEsTUFBbEJGLElBQWtCLFNBQWxCQSxJQUFrQjtBQUFBLE1BQVpHLFFBQVksU0FBWkEsUUFBWTtBQUU1QyxNQUFNRixZQUFZLEdBQUdELElBQUksR0FBRyxNQUFILEdBQVksRUFBckM7QUFFQSxzQkFBUTtBQUFLLGFBQVMsWUFBS0MsWUFBTDtBQUFkLEtBQ0NHLDRDQUFLLENBQUNDLFFBQU4sQ0FBZUMsR0FBZixDQUFtQkgsUUFBbkIsRUFBNkIsVUFBQ0ksS0FBRCxFQUFXO0FBQ3hDLHdCQUFPO0FBQUksZUFBUyxFQUFDO0FBQWQsT0FBd0JBLEtBQXhCLENBQVA7QUFDQSxHQUZBLENBREQsQ0FBUjtBQUtEOztBQUVELFNBQVNDLE1BQVQsUUFBOEI7QUFBQSxNQUFaTCxRQUFZLFNBQVpBLFFBQVk7O0FBRTVCLGtCQUE2Qk0sc0RBQVEsQ0FBQyxLQUFELENBQXJDO0FBQUE7QUFBQSxNQUFPQyxNQUFQO0FBQUEsTUFBZUMsU0FBZjs7QUFDQSxNQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLEdBQU07QUFDOUJELGFBQVMsQ0FBQyxDQUFDRCxNQUFGLENBQVQ7QUFDRCxHQUZEOztBQUlBLHNCQUFPLDJEQUFDLDRDQUFELENBQU8sUUFBUCxxQkFDRywyREFBQyxVQUFEO0FBQVksUUFBSSxFQUFFQSxNQUFsQjtBQUEwQixXQUFPLEVBQUVFO0FBQW5DLElBREgsZUFFRywyREFBQyxnQkFBRDtBQUFrQixRQUFJLEVBQUVGO0FBQXhCLEtBQ0dQLFFBREgsQ0FGSCxDQUFQO0FBT0Q7O0FBRUQsU0FBU1UsaUJBQVQsUUFBeUM7QUFBQSxNQUFaVixRQUFZLFNBQVpBLFFBQVk7QUFFdkMsTUFBTVcsR0FBRyxHQUFHQyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLFFBQTVCO0FBRUEsc0JBQU87QUFBSSxhQUFTLEVBQUM7QUFBZCxLQUNKYiw0Q0FBSyxDQUFDQyxRQUFOLENBQWVDLEdBQWYsQ0FBbUJILFFBQW5CLEVBQTZCLFVBQUNJLEtBQUQsRUFBVztBQUN2QyxRQUFJVyxTQUFTLEdBQUcsQ0FBQyxzQkFBRCxDQUFoQjtBQUNBQyxXQUFPLENBQUNDLEdBQVIsQ0FBWU4sR0FBWixFQUFpQlAsS0FBSyxDQUFDYyxLQUFOLENBQVlDLElBQTdCOztBQUNBLFFBQUlSLEdBQUcsQ0FBQ1MsUUFBSixDQUFhaEIsS0FBSyxDQUFDYyxLQUFOLENBQVlDLElBQXpCLENBQUosRUFBb0M7QUFDbENKLGVBQVMsQ0FBQ00sSUFBVixDQUFlLGdDQUFmO0FBQ0Q7O0FBQ0Qsd0JBQU87QUFBSSxlQUFTLEVBQUVOLFNBQVMsQ0FBQ08sSUFBVixDQUFlLEdBQWY7QUFBZixPQUFxQ2xCLEtBQXJDLENBQVA7QUFDRCxHQVBBLENBREksQ0FBUDtBQVVEOztBQUVELFNBQVNtQixJQUFULFFBQTJCO0FBQUEsTUFBWGxDLE9BQVcsU0FBWEEsT0FBVztBQUN6QixzQkFBTztBQUFHLFFBQUksRUFBQyxHQUFSO0FBQVksV0FBTyxFQUFFQTtBQUFyQixrQkFBOEI7QUFBSyxhQUFTLEVBQUMsa0JBQWY7QUFBa0MsT0FBRyxFQUFFbUMsaURBQVFBO0FBQS9DLElBQTlCLENBQVA7QUFDRDs7QUFLRCxTQUFTQyxVQUFULFFBQXNEO0FBQUEsTUFBaENDLElBQWdDLFNBQWhDQSxJQUFnQztBQUFBLE1BQTFCQyxZQUEwQixTQUExQkEsWUFBMEI7QUFBQSxNQUFaQyxRQUFZLFNBQVpBLFFBQVk7O0FBQ3BELG1CQUE0QnRCLHNEQUFRLENBQUMsS0FBRCxDQUFwQztBQUFBO0FBQUEsTUFBT0MsTUFBUDtBQUFBLE1BQWVDLFNBQWY7O0FBRUEsTUFBTXFCLFdBQVcsR0FBRyxTQUFkQSxXQUFjLEdBQU07QUFDeEJyQixhQUFTLENBQUMsQ0FBQ0QsTUFBRixDQUFUO0FBQ0QsR0FGRDs7QUFJQSxNQUFNdUIsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ1osS0FBRCxFQUFXO0FBQzlCVixhQUFTLENBQUMsS0FBRCxDQUFUO0FBQ0FvQixZQUFRLENBQUNWLEtBQUQsQ0FBUjtBQUNELEdBSEQ7O0FBS0Esc0JBQU8sMkRBQUMsNENBQUQsQ0FBTyxRQUFQLHFCQUNIO0FBQUssYUFBUyxFQUFDLFlBQWY7QUFBNEIsV0FBTyxFQUFFVztBQUFyQyxrQkFDRTtBQUFLLE9BQUcsRUFBRUUsd0RBQVVBO0FBQXBCLElBREYsQ0FERyxFQUlGeEIsTUFBTSxpQkFBSTtBQUFLLGFBQVMsRUFBQztBQUFmLGtCQUNULDJEQUFDLHdEQUFEO0FBQVcsUUFBSSxFQUFFbUIsSUFBakI7QUFBdUIsZ0JBQVksRUFBRUMsWUFBckM7QUFBbUQsWUFBUSxFQUFFRztBQUE3RCxJQURTLGVBRVQsMkRBQUMsT0FBRDtBQUFTLFdBQU8sRUFBRUQ7QUFBbEIsSUFGUyxDQUpSLENBQVA7QUFTRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDZSxTQUFTRyxNQUFULFFBQXNEO0FBQUEsTUFBcENDLEVBQW9DLFNBQXBDQSxFQUFvQztBQUFBLE1BQWhDTCxRQUFnQyxTQUFoQ0EsUUFBZ0M7QUFBQSxNQUF0QkQsWUFBc0IsU0FBdEJBLFlBQXNCO0FBQUEsTUFBUkQsSUFBUSxTQUFSQSxJQUFROztBQUVqRSxNQUFNUSxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLEdBQU07QUFDbEMsV0FBTztBQUFFQyxZQUFNLEVBQUV2QixNQUFNLENBQUN3QixXQUFqQjtBQUE4QkMsV0FBSyxFQUFFekIsTUFBTSxDQUFDMEI7QUFBNUMsS0FBUDtBQUNELEdBRkM7O0FBSUYsTUFBTUMsMkJBQTJCLEdBQUcsU0FBOUJBLDJCQUE4QixHQUFNO0FBQ3hDLFFBQU1GLEtBQUssR0FBR0gsbUJBQW1CLEdBQUdHLEtBQXBDO0FBQ0EsUUFBSUEsS0FBSyxHQUFJbEQsaUJBQWIsRUFBZ0MsT0FBTyxRQUFQLENBQWhDLEtBQ0ssSUFBSWtELEtBQUssR0FBR25ELGlCQUFaLEVBQStCLE9BQU8sUUFBUCxDQUEvQixLQUNBLE9BQU8sUUFBUDtBQUNOLEdBTEQ7O0FBT0UsTUFBTTJDLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNXLENBQUQsRUFBTztBQUN6QkEsS0FBQyxDQUFDQyxjQUFGO0FBQ0FiLFlBQVEsQ0FBQztBQUFDakIsU0FBRyxFQUFFNkIsQ0FBQyxDQUFDRSxNQUFGLENBQVN2QjtBQUFmLEtBQUQsQ0FBUjtBQUNILEdBSEM7O0FBTUYsbUJBQXdCYixzREFBUSxDQUFDaUMsMkJBQTJCLEVBQTVCLENBQWhDO0FBQUE7QUFBQSxNQUFPSSxJQUFQO0FBQUEsTUFBYUMsT0FBYjs7QUFFQSxNQUFNQyxLQUFLLEdBQUcsQ0FBQztBQUFDQyxTQUFLLEVBQUUsc0JBQVI7QUFBZ0MzQixRQUFJLEVBQUU7QUFBdEMsR0FBRCxFQUE2QztBQUFFMkIsU0FBSyxFQUFFLFVBQVQ7QUFBcUIzQixRQUFJLEVBQUU7QUFBM0IsR0FBN0MsRUFBMkY7QUFBRTJCLFNBQUssRUFBRSxVQUFUO0FBQXFCM0IsUUFBSSxFQUFFO0FBQTNCLEdBQTNGLENBQWQ7QUFDQSxNQUFNNEIsU0FBUyxHQUFHRixLQUFLLENBQUMxQyxHQUFOLENBQVUsVUFBQTZDLENBQUMsRUFBSTtBQUMvQix3QkFBTztBQUFHLFVBQUksRUFBRUEsQ0FBQyxDQUFDN0IsSUFBWDtBQUFpQixhQUFPLEVBQUVVLFdBQTFCO0FBQXVDLFdBQUssRUFBRTtBQUFDb0IsYUFBSyxFQUFFO0FBQVI7QUFBOUMsT0FBbUVELENBQUMsQ0FBQ0YsS0FBckUsQ0FBUDtBQUNELEdBRmlCLENBQWxCOztBQUtBLE1BQU1JLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsR0FBTTtBQUM3QixRQUFNQyxRQUFRLEdBQUdaLDJCQUEyQixFQUE1Qzs7QUFDQSxRQUFLWSxRQUFRLEtBQUtSLElBQWxCLEVBQXdCO0FBQ3RCQyxhQUFPLENBQUNPLFFBQUQsQ0FBUDtBQUNEO0FBQ0YsR0FMRDs7QUFPQSxNQUFNQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDVCxJQUFELEVBQVU7QUFDeEIsUUFBSUEsSUFBSSxLQUFLLFFBQWIsRUFBdUI7QUFDckIsMEJBQU8sMkRBQUMsaUJBQUQsUUFBb0JJLFNBQXBCLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCwwQkFBTywyREFBQyxNQUFELFFBQVNBLFNBQVQsQ0FBUDtBQUNEO0FBQ0YsR0FORDs7QUFRQSxNQUFNTSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDVixJQUFELEVBQVU7QUFDN0IsUUFBSUEsSUFBSSxLQUFLLFFBQVQsSUFBcUJBLElBQUksS0FBSyxRQUFsQyxFQUE0QztBQUMxQywwQkFBTztBQUFLLGlCQUFTLEVBQUM7QUFBZixzQkFDTCwyREFBQyx3REFBRDtBQUFXLFlBQUksRUFBRWpCLElBQWpCO0FBQXVCLG9CQUFZLEVBQUVDLFlBQXJDO0FBQW1ELGdCQUFRLEVBQUVDO0FBQTdELFFBREssQ0FBUDtBQUdELEtBSkQsTUFJTztBQUNMLDBCQUFPLDJEQUFDLFVBQUQ7QUFBWSxZQUFJLEVBQUVGLElBQWxCO0FBQXdCLG9CQUFZLEVBQUVDLFlBQXRDO0FBQW9ELGdCQUFRLEVBQUVDO0FBQTlELFFBQVA7QUFDRDtBQUNGLEdBUkQ7O0FBVUEsTUFBTTBCLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQ1gsSUFBRCxFQUFVO0FBQy9CLFFBQUlBLElBQUksS0FBSyxRQUFiLEVBQXVCO0FBQ3JCLDBCQUFPO0FBQUssaUJBQVMsRUFBQztBQUFmLHNCQUNILDJEQUFDLElBQUQ7QUFBTSxlQUFPLEVBQUVkO0FBQWYsUUFERyxFQUVGdUIsT0FBTyxDQUFDVCxJQUFELENBRkwsRUFHRlUsWUFBWSxDQUFDVixJQUFELENBSFYsQ0FBUDtBQUtELEtBTkQsTUFNTyxJQUFJQSxJQUFJLEtBQUssUUFBYixFQUF1QjtBQUM1QiwwQkFBTztBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNGUyxPQUFPLENBQUNULElBQUQsQ0FETCxlQUVILDJEQUFDLElBQUQ7QUFBTSxlQUFPLEVBQUVkO0FBQWYsUUFGRyxFQUdGd0IsWUFBWSxDQUFDVixJQUFELENBSFYsQ0FBUDtBQUtELEtBTk0sTUFPSDtBQUNGLDBCQUFPO0FBQUssVUFBRSxFQUFFVixFQUFUO0FBQWEsaUJBQVMsRUFBQztBQUF2QixTQUNGbUIsT0FBTyxDQUFDVCxJQUFELENBREwsZUFFSCwyREFBQyxJQUFEO0FBQU0sZUFBTyxFQUFFZDtBQUFmLFFBRkcsRUFHRndCLFlBQVksQ0FBQ1YsSUFBRCxDQUhWLENBQVA7QUFLRDtBQUNGLEdBckJEOztBQXVCQTFDLDhDQUFLLENBQUNzRCxTQUFOLENBQWdCLFlBQU07QUFDcEIzQyxVQUFNLENBQUM0QyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQ04sZ0JBQWxDO0FBQ0EsV0FBTyxZQUFNO0FBQ1h0QyxZQUFNLENBQUM2QyxtQkFBUCxDQUEyQixRQUEzQixFQUFxQ1AsZ0JBQXJDO0FBQ0QsS0FGRDtBQUdELEdBTEQ7QUFPQSxTQUFPSSxjQUFjLENBQUNYLElBQUQsQ0FBckI7QUFFRDtBQUVEWCxNQUFNLENBQUMwQixZQUFQLEdBQXNCLEVBQXRCO0FBR0EsSUFBTUMsWUFBWSxHQUFHQyxpREFBUyxDQUFDQyxPQUFWLENBQ2pCRCxpREFBUyxDQUFDRSxLQUFWLENBQWdCO0FBQ1poQixPQUFLLEVBQUVjLGlEQUFTLENBQUNHLE1BREw7QUFFWkMsT0FBSyxFQUFFSixpREFBUyxDQUFDSyxHQUZMO0FBR1pDLE1BQUksRUFBRU4saURBQVMsQ0FBQ0c7QUFISixDQUFoQixDQURpQixDQUFyQjtBQVNBL0IsTUFBTSxDQUFDbUMsU0FBUCxHQUFtQjtBQUNmO0FBQ0o7QUFDQTtBQUNJbEMsSUFBRSxFQUFFMkIsaURBQVMsQ0FBQ0csTUFKQzs7QUFNZjtBQUNKO0FBQ0E7QUFDQTtBQUNJbkMsVUFBUSxFQUFFZ0MsaURBQVMsQ0FBQ1EsSUFWTDtBQVlmekQsS0FBRyxFQUFFaUQsaURBQVMsQ0FBQ0csTUFaQTtBQWVmckMsTUFBSSxFQUFFaUMsWUFmUztBQWlCZkssT0FBSyxFQUFFSixpREFBUyxDQUFDRSxLQUFWLENBQWdCO0FBQ25CRSxTQUFLLEVBQUVKLGlEQUFTLENBQUNTLFNBQVYsQ0FBb0IsQ0FBQ1QsaURBQVMsQ0FBQ0csTUFBWCxFQUFtQkgsaURBQVMsQ0FBQ1UsTUFBN0IsQ0FBcEIsQ0FEWTtBQUVuQkosUUFBSSxFQUFFTixpREFBUyxDQUFDRztBQUZHLEdBQWhCLENBakJRO0FBc0JmcEMsY0FBWSxFQUFFaUMsaURBQVMsQ0FBQ1c7QUF0QlQsQ0FBbkIsQyIsImZpbGUiOiJlN2JhZDEwLW1haW4td3BzLWhtci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgU2VhcmNoQmFyIGZyb20gXCIuL1NlYXJjaEJhci5yZWFjdFwiXG5pbXBvcnQgXCIuL25hdmJhci5zY3NzXCJcbmltcG9ydCBsb2dvQU5TTSBmcm9tIFwiLi9sb2dvLnN2Z1wiXG5pbXBvcnQgc2VhcmNoSWNvbiBmcm9tIFwiLi9zZWFyY2hfaWNvbi5zdmdcIlxuXG5cbmNvbnN0IEJSRUFLUE9JTlRfVEFCTEVUID0gODQwO1xuY29uc3QgQlJFQUtQT0lOVF9NT0JJTEUgPSAzNDA7XG5cblxuZnVuY3Rpb24gT3ZlcmxheSh7IG9uQ2xpY2sgfSkge1xuICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWFjdC1lbnRyeS1wb2ludFwiKVxuICBjb25zdCBlbCA9IDxkaXYgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPVwiT3ZlcmxheVwiPjwvZGl2PlxuICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKGVsLCByb290KVxufVxuXG5cbmZ1bmN0aW9uIEJ1cmdlckljb24oeyBvcGVuLCBvbkNsaWNrIH0pIHtcbiAgXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgJHtjdXJyZW50Q2xhc3N9IGItY29udGFpbmVyYH0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImItbWVudVwib25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYi1idW4gYi1idW4tLXRvcFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImItYnVuIGItYnVuLS1taWRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiLWJ1biBiLWJ1bi0tYm90dG9tXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG59IFxuXG5mdW5jdGlvbiBCdXJnZXJOYXZpZ2F0aW9uKHsgb3BlbiwgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7Y3VycmVudENsYXNzfSBiLW5hdmB9PlxuICAgICAgICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImItbGlua1wiPntjaGlsZH08L2xpPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4pXG59XG5cbmZ1bmN0aW9uIEJ1cmdlcih7IGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW4gXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVCdXJnZXJDbGljayA9ICgpID0+IHtcbiAgICBzZXRJc09wZW4oIWlzT3BlbilcbiAgfVxuXG4gIHJldHVybiA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICA8QnVyZ2VySWNvbiBvcGVuPXtpc09wZW59IG9uQ2xpY2s9e2hhbmRsZUJ1cmdlckNsaWNrfSAvPlxuICAgICAgICAgICAgPEJ1cmdlck5hdmlnYXRpb24gb3Blbj17aXNPcGVufT5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9CdXJnZXJOYXZpZ2F0aW9uPlxuICA8L1JlYWN0LkZyYWdtZW50PlxuXG59XG5cbmZ1bmN0aW9uIENsYXNzaWNOYXZpZ2F0aW9uKHsgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cIk5hdmJhck5hdmlnYXRpb25cIj5cbiAgICB7UmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgIGxldCBjbGFzc05hbWUgPSBbXCJOYXZiYXJOYXZpZ2F0aW9uSXRlbVwiXVxuICAgICAgY29uc29sZS5sb2codXJsLCBjaGlsZC5wcm9wcy5ocmVmKVxuICAgICAgaWYgKHVybC5pbmNsdWRlcyhjaGlsZC5wcm9wcy5ocmVmKSkge1xuICAgICAgICBjbGFzc05hbWUucHVzaChcIk5hdmJhck5hdmlnYXRpb25JdGVtLWlzQ3VycmVudFwiKVxuICAgICAgfVxuICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZS5qb2luKFwiIFwiKX0+e2NoaWxkfTwvbGk+XG4gICAgfSl9XG4gIDwvdWw+XG59XG5cbmZ1bmN0aW9uIExvZ28oeyBvbkNsaWNrIH0pIHtcbiAgcmV0dXJuIDxhIGhyZWY9XCIvXCIgb25DbGljaz17b25DbGlja30+PGltZyBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJMb2dvXCIgc3JjPXtsb2dvQU5TTX0+PC9pbWc+PC9hPlxufSBcblxuXG5cblxuZnVuY3Rpb24gU2VhcmNoSWNvbih7IG9wdHMsIGZpcmVPblNlbGVjdCwgc2V0UHJvcHMgfSkge1xuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgIHNldElzT3BlbighaXNPcGVuKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2VsZWN0ID0gKHByb3BzKSA9PiB7XG4gICAgc2V0SXNPcGVuKGZhbHNlKTtcbiAgICBzZXRQcm9wcyhwcm9wcyk7XG4gIH1cblxuICByZXR1cm4gPFJlYWN0LkZyYWdtZW50PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTZWFyY2hJY29uXCIgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgICAgICA8aW1nIHNyYz17c2VhcmNoSWNvbn0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAge2lzT3BlbiAmJiA8ZGl2IGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhclNlYXJjaEJhckNvbnRhaW5lci1pc01vYmlsZVwiPiBcbiAgICAgICAgPFNlYXJjaEJhciBvcHRzPXtvcHRzfSBmaXJlT25TZWxlY3Q9e2ZpcmVPblNlbGVjdH0gc2V0UHJvcHM9e2hhbmRsZVNlbGVjdH0+PC9TZWFyY2hCYXI+XG4gICAgICAgIDxPdmVybGF5IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSAvPlxuICAgICAgPC9kaXY+fVxuICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG59XG5cbi8qKlxuICogRXhhbXBsZUNvbXBvbmVudCBpcyBhbiBleGFtcGxlIGNvbXBvbmVudC5cbiAqIEl0IHRha2VzIGEgcHJvcGVydHksIGBsYWJlbGAsIGFuZFxuICogZGlzcGxheXMgaXQuXG4gKiBJdCByZW5kZXJzIGFuIGlucHV0IHdpdGggdGhlIHByb3BlcnR5IGB2YWx1ZWBcbiAqIHdoaWNoIGlzIGVkaXRhYmxlIGJ5IHRoZSB1c2VyLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZCYXIoeyBpZCwgc2V0UHJvcHMsIGZpcmVPblNlbGVjdCwgb3B0cyB9KSB7XG5cbiAgICBjb25zdCBnZXRXaW5kb3dEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgIHJldHVybiB7IGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LCB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfTtcbiAgfVxuXG4gIGNvbnN0IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyA9ICgpID0+IHtcbiAgICBjb25zdCB3aWR0aCA9IGdldFdpbmRvd0RpbWVuc2lvbnMoKS53aWR0aDtcbiAgICBpZiAod2lkdGggIDwgQlJFQUtQT0lOVF9NT0JJTEUpIHJldHVybiBcIk1PQklMRVwiO1xuICAgIGVsc2UgaWYgKHdpZHRoIDwgQlJFQUtQT0lOVF9UQUJMRVQpIHJldHVybiBcIlRBQkxFVFwiO1xuICAgIGVsc2UgcmV0dXJuIFwiTk9STUFMXCJcbiAgfVxuXG4gICAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2V0UHJvcHMoe3VybDogZS50YXJnZXQuaHJlZn0pXG4gIH1cbiAgICAgIFxuXG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVN0YXRlKGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpKVxuXG4gIGNvbnN0IGl0ZW1zID0gW3tsYWJlbDogXCJBbmFseXNlcyB0aMOpbWF0aXF1ZXNcIiwgaHJlZjogXCIjXCJ9LCB7IGxhYmVsOiBcIkV4cGxvcmVyXCIsIGhyZWY6IFwiL2FwcHMvZXhwbG9yZXJcIn0sIHsgbGFiZWw6IFwiw4AgcHJvcG9zXCIsIGhyZWY6IFwiL2FwcHMvYV9wcm9wb3NcIiB9XVxuICBjb25zdCBtZW51SXRlbXMgPSBpdGVtcy5tYXAoaSA9PiB7XG4gICAgcmV0dXJuIDxhIGhyZWY9e2kuaHJlZn0gb25DbGljaz17aGFuZGxlQ2xpY2t9IHN0eWxlPXt7Y29sb3I6IFwiaW5oZXJpdFwifX0+e2kubGFiZWx9PC9hPlxuICB9KVxuXG5cbiAgY29uc3Qgd2luZG93SGFzUmVzaXplZCA9ICgpID0+IHtcbiAgICBjb25zdCBuZXh0TW9kZSA9IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpXG4gICAgaWYgKCBuZXh0TW9kZSAhPT0gbW9kZSkge1xuICAgICAgc2V0TW9kZShuZXh0TW9kZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0TWVudSA9IChtb2RlKSA9PiB7XG4gICAgaWYgKG1vZGUgPT09IFwiTk9STUFMXCIpIHtcbiAgICAgIHJldHVybiA8Q2xhc3NpY05hdmlnYXRpb24+e21lbnVJdGVtc308L0NsYXNzaWNOYXZpZ2F0aW9uPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxCdXJnZXI+e21lbnVJdGVtc308L0J1cmdlcj47XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0U2VhcmNoQmFyID0gKG1vZGUpID0+IHtcbiAgICBpZiAobW9kZSA9PT0gXCJOT1JNQUxcIiB8fCBtb2RlID09PSBcIlRBQkxFVFwiKSB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJTZWFyY2hCYXJDb250YWluZXJcIj5cbiAgICAgICAgPFNlYXJjaEJhciBvcHRzPXtvcHRzfSBmaXJlT25TZWxlY3Q9e2ZpcmVPblNlbGVjdH0gc2V0UHJvcHM9e3NldFByb3BzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8U2VhcmNoSWNvbiBvcHRzPXtvcHRzfSBmaXJlT25TZWxlY3Q9e2ZpcmVPblNlbGVjdH0gc2V0UHJvcHM9e3NldFByb3BzfS8+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0TmF2QmFyRWxlbXMgPSAobW9kZSkgPT4ge1xuICAgIGlmIChtb2RlID09PSBcIk5PUk1BTFwiKSB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJcIj5cbiAgICAgICAgICA8TG9nbyBvbkNsaWNrPXtoYW5kbGVDbGlja30vPlxuICAgICAgICAgIHtnZXRNZW51KG1vZGUpfVxuICAgICAgICAgIHtnZXRTZWFyY2hCYXIobW9kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gXCJUQUJMRVRcIikge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyXCI+XG4gICAgICAgICAge2dldE1lbnUobW9kZSl9XG4gICAgICAgICAgPExvZ28gb25DbGljaz17aGFuZGxlQ2xpY2t9Lz5cbiAgICAgICAgICB7Z2V0U2VhcmNoQmFyKG1vZGUpfVxuICAgICAgPC9kaXY+O1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIDxkaXYgaWQ9e2lkfSBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXIgQ3VzdG9tTmF2YmFyLWlzTW9iaWxlXCI+XG4gICAgICAgICAge2dldE1lbnUobW9kZSl9XG4gICAgICAgICAgPExvZ28gb25DbGljaz17aGFuZGxlQ2xpY2t9Lz5cbiAgICAgICAgICB7Z2V0U2VhcmNoQmFyKG1vZGUpfVxuICAgICAgPC9kaXY+O1xuICAgIH1cbiAgfVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgd2luZG93SGFzUmVzaXplZClcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgd2luZG93SGFzUmVzaXplZClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGdldE5hdkJhckVsZW1zKG1vZGUpXG5cbn1cblxuTmF2QmFyLmRlZmF1bHRQcm9wcyA9IHtcbn07XG5cbmNvbnN0IG9wdHNQcm9wVHlwZSA9IFByb3BUeXBlcy5hcnJheU9mKFxuICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLmFueSxcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KVxuKTtcblxuXG5OYXZCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogRGFzaC1hc3NpZ25lZCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgdG8gcmVwb3J0IHByb3BlcnR5IGNoYW5nZXNcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0UHJvcHM6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG5cbiAgICBvcHRzOiBvcHRzUHJvcFR5cGUsXG5cbiAgICB2YWx1ZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgdmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5udW1iZXJdKSxcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KSxcblxuICAgIGZpcmVPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG5cblxufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=