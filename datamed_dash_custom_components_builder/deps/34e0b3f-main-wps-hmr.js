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

function Logo() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
    className: "CustomNavbarLogo",
    src: _logo_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
  });
}

function SearchBarContainer(_ref6) {
  var opts = _ref6.opts;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CustomNavbarSearchBarContainer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SearchBar_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    opts: opts
  }));
}

function SearchIcon() {
  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isOpen = _useState4[0],
      setIsOpen = _useState4[1];

  var handleClick = function handleClick() {
    setIsOpen(!isOpen);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "SearchIcon",
    onClick: handleClick
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
    src: _search_icon_svg__WEBPACK_IMPORTED_MODULE_6__["default"]
  })), isOpen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CustomNavbarSearchBarContainer-isMobile"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SearchBar_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    opts: []
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


function NavBar(_ref7) {
  var id = _ref7.id,
      setProps = _ref7.setProps;

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
      onClick: handleClick
    }, i.label);
  });
  var opts = [];

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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchBarContainer, {
        opts: opts
      });
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchIcon, null);
    }
  };

  var getNavBarElems = function getNavBarElems(mode) {
    if (mode === "NORMAL") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbar"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, null), getMenu(mode), getSearchBar(mode));
    } else if (mode === "TABLET") {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbar"
      }, getMenu(mode), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, null), getSearchBar(mode));
    } else {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "CustomNavbar CustomNavbar-isMobile"
      }, getMenu(mode), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, null), getSearchBar(mode));
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
  url: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiT3ZlcmxheSIsIm9uQ2xpY2siLCJyb290IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVsIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJCdXJnZXJJY29uIiwib3BlbiIsImN1cnJlbnRDbGFzcyIsIkJ1cmdlck5hdmlnYXRpb24iLCJjaGlsZHJlbiIsIlJlYWN0IiwiQ2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsIkJ1cmdlciIsInVzZVN0YXRlIiwiaXNPcGVuIiwic2V0SXNPcGVuIiwiaGFuZGxlQnVyZ2VyQ2xpY2siLCJDbGFzc2ljTmF2aWdhdGlvbiIsInVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjbGFzc05hbWUiLCJjb25zb2xlIiwibG9nIiwicHJvcHMiLCJocmVmIiwiaW5jbHVkZXMiLCJwdXNoIiwiam9pbiIsIkxvZ28iLCJsb2dvQU5TTSIsIlNlYXJjaEJhckNvbnRhaW5lciIsIm9wdHMiLCJTZWFyY2hJY29uIiwiaGFuZGxlQ2xpY2siLCJzZWFyY2hJY29uIiwiTmF2QmFyIiwiaWQiLCJzZXRQcm9wcyIsImdldFdpbmRvd0RpbWVuc2lvbnMiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRhcmdldCIsIm1vZGUiLCJzZXRNb2RlIiwiaXRlbXMiLCJsYWJlbCIsIm1lbnVJdGVtcyIsImkiLCJ3aW5kb3dIYXNSZXNpemVkIiwibmV4dE1vZGUiLCJnZXRNZW51IiwiZ2V0U2VhcmNoQmFyIiwiZ2V0TmF2QmFyRWxlbXMiLCJ1c2VFZmZlY3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQSxJQUFNQSxpQkFBaUIsR0FBRyxHQUExQjtBQUNBLElBQU1DLGlCQUFpQixHQUFHLEdBQTFCOztBQUdBLFNBQVNDLE9BQVQsT0FBOEI7QUFBQSxNQUFYQyxPQUFXLFFBQVhBLE9BQVc7QUFDNUIsTUFBTUMsSUFBSSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsbUJBQXhCLENBQWI7QUFDQSxNQUFNQyxFQUFFLGdCQUFHO0FBQUssV0FBTyxFQUFFSixPQUFkO0FBQXVCLGFBQVMsRUFBQztBQUFqQyxJQUFYO0FBQ0Esc0JBQU9LLGdEQUFRLENBQUNDLFlBQVQsQ0FBc0JGLEVBQXRCLEVBQTBCSCxJQUExQixDQUFQO0FBQ0Q7O0FBR0QsU0FBU00sVUFBVCxRQUF1QztBQUFBLE1BQWpCQyxJQUFpQixTQUFqQkEsSUFBaUI7QUFBQSxNQUFYUixPQUFXLFNBQVhBLE9BQVc7QUFFckMsTUFBTVMsWUFBWSxHQUFHRCxJQUFJLEdBQUcsTUFBSCxHQUFZLEVBQXJDO0FBRUEsc0JBQU87QUFBSyxhQUFTLFlBQUtDLFlBQUw7QUFBZCxrQkFDRztBQUFLLGFBQVMsRUFBQyxRQUFmO0FBQXVCLFdBQU8sRUFBRVQ7QUFBaEMsa0JBQ0U7QUFBSyxhQUFTLEVBQUM7QUFBZixJQURGLGVBRUU7QUFBSyxhQUFTLEVBQUM7QUFBZixJQUZGLGVBR0U7QUFBSyxhQUFTLEVBQUM7QUFBZixJQUhGLENBREgsQ0FBUDtBQU9EOztBQUVELFNBQVNVLGdCQUFULFFBQThDO0FBQUEsTUFBbEJGLElBQWtCLFNBQWxCQSxJQUFrQjtBQUFBLE1BQVpHLFFBQVksU0FBWkEsUUFBWTtBQUU1QyxNQUFNRixZQUFZLEdBQUdELElBQUks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QUFELE9BREcsRUFFRlEsT0FBTyxDQUFDUixJQUFELENBRkwsRUFHRlMsWUFBWSxDQUFDVCxJQUFELENBSFYsQ0FBUDtBQUtELEtBTkQsTUFNTyxJQUFJQSxJQUFJLEtBQUssUUFBYixFQUF1QjtBQUM1QiwwQkFBTztBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNGUSxPQUFPLENBQUNSLElBQUQsQ0FETCxlQUVILDJEQUFDLElBQUQsT0FGRyxFQUdGUyxZQUFZLENBQUNULElBQUQsQ0FIVixDQUFQO0FBS0QsS0FOTSxNQU9IO0FBQ0YsMEJBQU87QUFBSyxpQkFBUyxFQUFDO0FBQWYsU0FDRlEsT0FBTyxDQUFDUixJQUFELENBREwsZUFFSCwyREFBQyxJQUFELE9BRkcsRUFHRlMsWUFBWSxDQUFDVCxJQUFELENBSFYsQ0FBUDtBQUtEO0FBQ0YsR0FyQkQ7O0FBdUJBekMsOENBQUssQ0FBQ29ELFNBQU4sQ0FBZ0IsWUFBTTtBQUNwQnpDLFVBQU0sQ0FBQzBDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDTixnQkFBbEM7QUFDQSxXQUFPLFlBQU07QUFDWHBDLFlBQU0sQ0FBQzJDLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDUCxnQkFBckM7QUFDRCxLQUZEO0FBR0QsR0FMRDtBQU9BLFNBQU9JLGNBQWMsQ0FBQ1YsSUFBRCxDQUFyQjtBQUVEO0FBRURaLE1BQU0sQ0FBQzBCLFlBQVAsR0FBc0IsRUFBdEI7QUFHQTFCLE1BQU0sQ0FBQzJCLFNBQVAsR0FBbUI7QUFDZjtBQUNKO0FBQ0E7QUFDSTFCLElBQUUsRUFBRTJCLGlEQUFTLENBQUNDLE1BSkM7O0FBTWY7QUFDSjtBQUNBO0FBQ0E7QUFDSTNCLFVBQVEsRUFBRTBCLGlEQUFTLENBQUNFLElBVkw7QUFZZmpELEtBQUcsRUFBRStDLGlEQUFTLENBQUNDO0FBWkEsQ0FBbkIsQyIsImZpbGUiOiIzNGUwYjNmLW1haW4td3BzLWhtci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgU2VhcmNoQmFyIGZyb20gXCIuL1NlYXJjaEJhci5yZWFjdFwiXG5pbXBvcnQgXCIuL25hdmJhci5zY3NzXCJcbmltcG9ydCBsb2dvQU5TTSBmcm9tIFwiLi9sb2dvLnN2Z1wiXG5pbXBvcnQgc2VhcmNoSWNvbiBmcm9tIFwiLi9zZWFyY2hfaWNvbi5zdmdcIlxuXG5cbmNvbnN0IEJSRUFLUE9JTlRfVEFCTEVUID0gODQwO1xuY29uc3QgQlJFQUtQT0lOVF9NT0JJTEUgPSAzNDA7XG5cblxuZnVuY3Rpb24gT3ZlcmxheSh7IG9uQ2xpY2sgfSkge1xuICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWFjdC1lbnRyeS1wb2ludFwiKVxuICBjb25zdCBlbCA9IDxkaXYgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPVwiT3ZlcmxheVwiPjwvZGl2PlxuICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKGVsLCByb290KVxufVxuXG5cbmZ1bmN0aW9uIEJ1cmdlckljb24oeyBvcGVuLCBvbkNsaWNrIH0pIHtcbiAgXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgJHtjdXJyZW50Q2xhc3N9IGItY29udGFpbmVyYH0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImItbWVudVwib25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYi1idW4gYi1idW4tLXRvcFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImItYnVuIGItYnVuLS1taWRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiLWJ1biBiLWJ1bi0tYm90dG9tXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG59IFxuXG5mdW5jdGlvbiBCdXJnZXJOYXZpZ2F0aW9uKHsgb3BlbiwgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17YCR7Y3VycmVudENsYXNzfSBiLW5hdmB9PlxuICAgICAgICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImItbGlua1wiPntjaGlsZH08L2xpPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4pXG59XG5cbmZ1bmN0aW9uIEJ1cmdlcih7IGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW4gXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVCdXJnZXJDbGljayA9ICgpID0+IHtcbiAgICBzZXRJc09wZW4oIWlzT3BlbilcbiAgfVxuXG4gIHJldHVybiA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICA8QnVyZ2VySWNvbiBvcGVuPXtpc09wZW59IG9uQ2xpY2s9e2hhbmRsZUJ1cmdlckNsaWNrfSAvPlxuICAgICAgICAgICAgPEJ1cmdlck5hdmlnYXRpb24gb3Blbj17aXNPcGVufT5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9CdXJnZXJOYXZpZ2F0aW9uPlxuICA8L1JlYWN0LkZyYWdtZW50PlxuXG59XG5cbmZ1bmN0aW9uIENsYXNzaWNOYXZpZ2F0aW9uKHsgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICByZXR1cm4gPHVsIGNsYXNzTmFtZT1cIk5hdmJhck5hdmlnYXRpb25cIj5cbiAgICB7UmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgIGxldCBjbGFzc05hbWUgPSBbXCJOYXZiYXJOYXZpZ2F0aW9uSXRlbVwiXVxuICAgICAgY29uc29sZS5sb2codXJsLCBjaGlsZC5wcm9wcy5ocmVmKVxuICAgICAgaWYgKHVybC5pbmNsdWRlcyhjaGlsZC5wcm9wcy5ocmVmKSkge1xuICAgICAgICBjbGFzc05hbWUucHVzaChcIk5hdmJhck5hdmlnYXRpb25JdGVtLWlzQ3VycmVudFwiKVxuICAgICAgfVxuICAgICAgcmV0dXJuIDxsaSBjbGFzc05hbWU9e2NsYXNzTmFtZS5qb2luKFwiIFwiKX0+e2NoaWxkfTwvbGk+XG4gICAgfSl9XG4gIDwvdWw+XG59XG5cbmZ1bmN0aW9uIExvZ28oKSB7XG4gIHJldHVybiA8aW1nIGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhckxvZ29cIiBzcmM9e2xvZ29BTlNNfT48L2ltZz5cbn0gXG5cbmZ1bmN0aW9uIFNlYXJjaEJhckNvbnRhaW5lcih7IG9wdHMgfSkge1xuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJTZWFyY2hCYXJDb250YWluZXJcIj5cbiAgICA8U2VhcmNoQmFyIG9wdHM9e29wdHN9IC8+XG4gIDwvZGl2PlxufVxuXG5mdW5jdGlvbiBTZWFyY2hJY29uKCkge1xuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xuICAgIHNldElzT3BlbighaXNPcGVuKVxuICB9XG4gIHJldHVybiA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlNlYXJjaEljb25cIiBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgICAgIDxpbWcgc3JjPXtzZWFyY2hJY29ufSAvPlxuICAgICAgPC9kaXY+XG4gICAgICB7aXNPcGVuICYmIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyU2VhcmNoQmFyQ29udGFpbmVyLWlzTW9iaWxlXCI+IFxuICAgICAgICA8U2VhcmNoQmFyIG9wdHM9e1tdfT48L1NlYXJjaEJhcj5cbiAgICAgICAgPE92ZXJsYXkgb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+XG4gICAgICA8L2Rpdj59XG4gICAgPC9SZWFjdC5GcmFnbWVudD5cbn1cblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkJhcih7IGlkLCBzZXRQcm9wcyB9KSB7XG5cbiAgICBjb25zdCBnZXRXaW5kb3dEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgIHJldHVybiB7IGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LCB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfTtcbiAgfVxuXG4gIGNvbnN0IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyA9ICgpID0+IHtcbiAgICBjb25zdCB3aWR0aCA9IGdldFdpbmRvd0RpbWVuc2lvbnMoKS53aWR0aDtcbiAgICBpZiAod2lkdGggIDwgQlJFQUtQT0lOVF9NT0JJTEUpIHJldHVybiBcIk1PQklMRVwiO1xuICAgIGVsc2UgaWYgKHdpZHRoIDwgQlJFQUtQT0lOVF9UQUJMRVQpIHJldHVybiBcIlRBQkxFVFwiO1xuICAgIGVsc2UgcmV0dXJuIFwiTk9STUFMXCJcbiAgfVxuXG4gICAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2V0UHJvcHMoe3VybDogZS50YXJnZXQuaHJlZn0pXG4gIH1cbiAgICAgIFxuXG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVN0YXRlKGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpKVxuXG4gIGNvbnN0IGl0ZW1zID0gW3tsYWJlbDogXCJBbmFseXNlcyB0aMOpbWF0aXF1ZXNcIiwgaHJlZjogXCIjXCJ9LCB7IGxhYmVsOiBcIkV4cGxvcmVyXCIsIGhyZWY6IFwiL2FwcHMvZXhwbG9yZXJcIn0sIHsgbGFiZWw6IFwiw4AgcHJvcG9zXCIsIGhyZWY6IFwiL2FwcHMvYV9wcm9wb3NcIiB9XVxuICBjb25zdCBtZW51SXRlbXMgPSBpdGVtcy5tYXAoaSA9PiB7XG4gICAgcmV0dXJuIDxhIGhyZWY9e2kuaHJlZn0gb25DbGljaz17aGFuZGxlQ2xpY2t9PntpLmxhYmVsfTwvYT5cbiAgfSlcbiAgY29uc3Qgb3B0cyA9IFtdO1xuXG5cblxuXG4gIGNvbnN0IHdpbmRvd0hhc1Jlc2l6ZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV4dE1vZGUgPSBnZXRNb2RlRnJvbVdpbmRvd0RpbWVuc2lvbnMoKVxuICAgIGlmICggbmV4dE1vZGUgIT09IG1vZGUpIHtcbiAgICAgIHNldE1vZGUobmV4dE1vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldE1lbnUgPSAobW9kZSkgPT4ge1xuICAgIGlmIChtb2RlID09PSBcIk5PUk1BTFwiKSB7XG4gICAgICByZXR1cm4gPENsYXNzaWNOYXZpZ2F0aW9uPnttZW51SXRlbXN9PC9DbGFzc2ljTmF2aWdhdGlvbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8QnVyZ2VyPnttZW51SXRlbXN9PC9CdXJnZXI+O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldFNlYXJjaEJhciA9IChtb2RlKSA9PiB7XG4gICAgaWYgKG1vZGUgPT09IFwiTk9STUFMXCIgfHwgbW9kZSA9PT0gXCJUQUJMRVRcIikge1xuICAgICAgcmV0dXJuIDxTZWFyY2hCYXJDb250YWluZXIgb3B0cz17b3B0c30+PC9TZWFyY2hCYXJDb250YWluZXI+XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8U2VhcmNoSWNvbiAvPlxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldE5hdkJhckVsZW1zID0gKG1vZGUpID0+IHtcbiAgICBpZiAobW9kZSA9PT0gXCJOT1JNQUxcIikge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyXCI+XG4gICAgICAgICAgPExvZ28gLz5cbiAgICAgICAgICB7Z2V0TWVudShtb2RlKX1cbiAgICAgICAgICB7Z2V0U2VhcmNoQmFyKG1vZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFwiVEFCTEVUXCIpIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhclwiPlxuICAgICAgICAgIHtnZXRNZW51KG1vZGUpfVxuICAgICAgICAgIDxMb2dvIC8+XG4gICAgICAgICAge2dldFNlYXJjaEJhcihtb2RlKX1cbiAgICAgIDwvZGl2PjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhciBDdXN0b21OYXZiYXItaXNNb2JpbGVcIj5cbiAgICAgICAgICB7Z2V0TWVudShtb2RlKX1cbiAgICAgICAgICA8TG9nbyAvPlxuICAgICAgICAgIHtnZXRTZWFyY2hCYXIobW9kZSl9XG4gICAgICA8L2Rpdj47XG4gICAgfVxuICB9XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dIYXNSZXNpemVkKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dIYXNSZXNpemVkKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gZ2V0TmF2QmFyRWxlbXMobW9kZSlcblxufVxuXG5OYXZCYXIuZGVmYXVsdFByb3BzID0ge1xufTtcblxuTmF2QmFyLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIHVybDogUHJvcFR5cGVzLnN0cmluZ1xuXG5cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9