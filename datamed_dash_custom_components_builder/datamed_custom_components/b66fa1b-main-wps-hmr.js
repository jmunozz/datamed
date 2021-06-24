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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiT3ZlcmxheSIsIm9uQ2xpY2siLCJyb290IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVsIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJCdXJnZXJJY29uIiwib3BlbiIsImN1cnJlbnRDbGFzcyIsIkJ1cmdlck5hdmlnYXRpb24iLCJjaGlsZHJlbiIsIlJlYWN0IiwiQ2hpbGRyZW4iLCJtYXAiLCJjaGlsZCIsIkJ1cmdlciIsInVzZVN0YXRlIiwiaXNPcGVuIiwic2V0SXNPcGVuIiwiaGFuZGxlQnVyZ2VyQ2xpY2siLCJDbGFzc2ljTmF2aWdhdGlvbiIsInVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjbGFzc05hbWUiLCJpbmNsdWRlcyIsInByb3BzIiwiaHJlZiIsInB1c2giLCJqb2luIiwiTG9nbyIsImxvZ29BTlNNIiwiU2VhcmNoQmFyQ29udGFpbmVyIiwib3B0cyIsIlNlYXJjaEljb24iLCJoYW5kbGVDbGljayIsInNlYXJjaEljb24iLCJOYXZCYXIiLCJpZCIsInNldFByb3BzIiwiZ2V0V2luZG93RGltZW5zaW9ucyIsImhlaWdodCIsImlubmVySGVpZ2h0Iiwid2lkdGgiLCJpbm5lcldpZHRoIiwiZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zIiwiZSIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwibW9kZSIsInNldE1vZGUiLCJpdGVtcyIsImxhYmVsIiwibWVudUl0ZW1zIiwiaSIsIndpbmRvd0hhc1Jlc2l6ZWQiLCJuZXh0TW9kZSIsImdldE1lbnUiLCJnZXRTZWFyY2hCYXIiLCJnZXROYXZCYXJFbGVtcyIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLElBQU1BLGlCQUFpQixHQUFHLEdBQTFCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsR0FBMUI7O0FBR0EsU0FBU0MsT0FBVCxPQUE4QjtBQUFBLE1BQVhDLE9BQVcsUUFBWEEsT0FBVztBQUM1QixNQUFNQyxJQUFJLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixtQkFBeEIsQ0FBYjtBQUNBLE1BQU1DLEVBQUUsZ0JBQUc7QUFBSyxXQUFPLEVBQUVKLE9BQWQ7QUFBdUIsYUFBUyxFQUFDO0FBQWpDLElBQVg7QUFDQSxzQkFBT0ssZ0RBQVEsQ0FBQ0MsWUFBVCxDQUFzQkYsRUFBdEIsRUFBMEJILElBQTFCLENBQVA7QUFDRDs7QUFHRCxTQUFTTSxVQUFULFFBQXVDO0FBQUEsTUFBakJDLElBQWlCLFNBQWpCQSxJQUFpQjtBQUFBLE1BQVhSLE9BQVcsU0FBWEEsT0FBVztBQUVyQyxNQUFNUyxZQUFZLEdBQUdELElBQUksR0FBRyxNQUFILEdBQVksRUFBckM7QUFFQSxzQkFBTztBQUFLLGFBQVMsWUFBS0MsWUFBTDtBQUFkLGtCQUNHO0FBQUssYUFBUyxFQUFDLFFBQWY7QUFBdUIsV0FBTyxFQUFFVDtBQUFoQyxrQkFDRTtBQUFLLGFBQVMsRUFBQztBQUFmLElBREYsZUFFRTtBQUFLLGFBQVMsRUFBQztBQUFmLElBRkYsZUFHRTtBQUFLLGFBQVMsRUFBQztBQUFmLElBSEYsQ0FESCxDQUFQO0FBT0Q7O0FBRUQsU0FBU1UsZ0JBQVQsUUFBOEM7QUFBQSxNQUFsQkYsSUFBa0IsU0FBbEJBLElBQWtCO0FBQUEsTUFBWkcsUUFBWSxTQUFaQSxRQUFZO0FBRTVDLE1BQU1GLFlBQVksR0FBR0QsSUFBSSxHQUFHLE1BQUgsR0FBWSxF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QUlBLElBQUksS0FBSyxRQUFiLEVBQXVCO0FBQzVCLDBCQUFPO0FBQUssaUJBQVMsRUFBQztBQUFmLFNBQ0ZRLE9BQU8sQ0FBQ1IsSUFBRCxDQURMLGVBRUgsMkRBQUMsSUFBRCxPQUZHLEVBR0ZTLFlBQVksQ0FBQ1QsSUFBRCxDQUhWLENBQVA7QUFLRCxLQU5NLE1BT0g7QUFDRiwwQkFBTztBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNGUSxPQUFPLENBQUNSLElBQUQsQ0FETCxlQUVILDJEQUFDLElBQUQsT0FGRyxFQUdGUyxZQUFZLENBQUNULElBQUQsQ0FIVixDQUFQO0FBS0Q7QUFDRixHQXJCRDs7QUF1QkF2Qyw4Q0FBSyxDQUFDa0QsU0FBTixDQUFnQixZQUFNO0FBQ3BCdkMsVUFBTSxDQUFDd0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0NOLGdCQUFsQztBQUNBLFdBQU8sWUFBTTtBQUNYbEMsWUFBTSxDQUFDeUMsbUJBQVAsQ0FBMkIsUUFBM0IsRUFBcUNQLGdCQUFyQztBQUNELEtBRkQ7QUFHRCxHQUxEO0FBT0EsU0FBT0ksY0FBYyxDQUFDVixJQUFELENBQXJCO0FBRUQ7QUFFRFosTUFBTSxDQUFDMEIsWUFBUCxHQUFzQixFQUF0QjtBQUdBMUIsTUFBTSxDQUFDMkIsU0FBUCxHQUFtQjtBQUNmO0FBQ0o7QUFDQTtBQUNJMUIsSUFBRSxFQUFFMkIsaURBQVMsQ0FBQ0MsTUFKQzs7QUFNZjtBQUNKO0FBQ0E7QUFDQTtBQUNJM0IsVUFBUSxFQUFFMEIsaURBQVMsQ0FBQ0UsSUFWTDtBQVlmL0MsS0FBRyxFQUFFNkMsaURBQVMsQ0FBQ0M7QUFaQSxDQUFuQixDIiwiZmlsZSI6ImI2NmZhMWItbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBTZWFyY2hCYXIgZnJvbSBcIi4vU2VhcmNoQmFyLnJlYWN0XCJcbmltcG9ydCBcIi4vbmF2YmFyLnNjc3NcIlxuaW1wb3J0IGxvZ29BTlNNIGZyb20gXCIuL2xvZ28uc3ZnXCJcbmltcG9ydCBzZWFyY2hJY29uIGZyb20gXCIuL3NlYXJjaF9pY29uLnN2Z1wiXG5cblxuY29uc3QgQlJFQUtQT0lOVF9UQUJMRVQgPSA4NDA7XG5jb25zdCBCUkVBS1BPSU5UX01PQklMRSA9IDM0MDtcblxuXG5mdW5jdGlvbiBPdmVybGF5KHsgb25DbGljayB9KSB7XG4gIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlYWN0LWVudHJ5LXBvaW50XCIpXG4gIGNvbnN0IGVsID0gPGRpdiBvbkNsaWNrPXtvbkNsaWNrfSBjbGFzc05hbWU9XCJPdmVybGF5XCI+PC9kaXY+XG4gIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoZWwsIHJvb3QpXG59XG5cblxuZnVuY3Rpb24gQnVyZ2VySWNvbih7IG9wZW4sIG9uQ2xpY2sgfSkge1xuICBcbiAgY29uc3QgY3VycmVudENsYXNzID0gb3BlbiA/IFwib3BlblwiIDogXCJcIjtcblxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2Ake2N1cnJlbnRDbGFzc30gYi1jb250YWluZXJgfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYi1tZW51XCJvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiLWJ1biBiLWJ1bi0tdG9wXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYi1idW4gYi1idW4tLW1pZFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImItYnVuIGItYnVuLS1ib3R0b21cIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbn0gXG5cbmZ1bmN0aW9uIEJ1cmdlck5hdmlnYXRpb24oeyBvcGVuLCBjaGlsZHJlbiB9KSB7XG5cbiAgY29uc3QgY3VycmVudENsYXNzID0gb3BlbiA/IFwib3BlblwiIDogXCJcIjtcblxuICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXtgJHtjdXJyZW50Q2xhc3N9IGItbmF2YH0+XG4gICAgICAgICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwiYi1saW5rXCI+e2NoaWxkfTwvbGk+XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2Pilcbn1cblxuZnVuY3Rpb24gQnVyZ2VyKHsgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3BlbiBdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGhhbmRsZUJ1cmdlckNsaWNrID0gKCkgPT4ge1xuICAgIHNldElzT3BlbighaXNPcGVuKVxuICB9XG5cbiAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgIDxCdXJnZXJJY29uIG9wZW49e2lzT3Blbn0gb25DbGljaz17aGFuZGxlQnVyZ2VyQ2xpY2t9IC8+XG4gICAgICAgICAgICA8QnVyZ2VyTmF2aWdhdGlvbiBvcGVuPXtpc09wZW59PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L0J1cmdlck5hdmlnYXRpb24+XG4gIDwvUmVhY3QuRnJhZ21lbnQ+XG5cbn1cblxuZnVuY3Rpb24gQ2xhc3NpY05hdmlnYXRpb24oeyBjaGlsZHJlbiB9KSB7XG5cbiAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG4gIHJldHVybiA8dWwgY2xhc3NOYW1lPVwiTmF2YmFyTmF2aWdhdGlvblwiPlxuICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IFtcIk5hdmJhck5hdmlnYXRpb25JdGVtXCJdXG4gICAgICBpZiAodXJsLmluY2x1ZGVzKGNoaWxkLnByb3BzLmhyZWYpKSB7XG4gICAgICAgIGNsYXNzTmFtZS5wdXNoKFwiTmF2YmFyTmF2aWdhdGlvbkl0ZW0taXNDdXJyZW50XCIpXG4gICAgICB9XG4gICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT17Y2xhc3NOYW1lLmpvaW4oXCIgXCIpfT57Y2hpbGR9PC9saT5cbiAgICB9KX1cbiAgPC91bD5cbn1cblxuZnVuY3Rpb24gTG9nbygpIHtcbiAgcmV0dXJuIDxpbWcgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyTG9nb1wiIHNyYz17bG9nb0FOU019PjwvaW1nPlxufSBcblxuZnVuY3Rpb24gU2VhcmNoQmFyQ29udGFpbmVyKHsgb3B0cyB9KSB7XG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhclNlYXJjaEJhckNvbnRhaW5lclwiPlxuICAgIDxTZWFyY2hCYXIgb3B0cz17b3B0c30gLz5cbiAgPC9kaXY+XG59XG5cbmZ1bmN0aW9uIFNlYXJjaEljb24oKSB7XG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgc2V0SXNPcGVuKCFpc09wZW4pXG4gIH1cbiAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiU2VhcmNoSWNvblwiIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfT5cbiAgICAgICAgPGltZyBzcmM9e3NlYXJjaEljb259IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtpc09wZW4gJiYgPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJTZWFyY2hCYXJDb250YWluZXItaXNNb2JpbGVcIj4gXG4gICAgICAgIDxTZWFyY2hCYXIgb3B0cz17W119PjwvU2VhcmNoQmFyPlxuICAgICAgICA8T3ZlcmxheSBvbkNsaWNrPXtoYW5kbGVDbGlja30gLz5cbiAgICAgIDwvZGl2Pn1cbiAgICA8L1JlYWN0LkZyYWdtZW50PlxufVxuXG4vKipcbiAqIEV4YW1wbGVDb21wb25lbnQgaXMgYW4gZXhhbXBsZSBjb21wb25lbnQuXG4gKiBJdCB0YWtlcyBhIHByb3BlcnR5LCBgbGFiZWxgLCBhbmRcbiAqIGRpc3BsYXlzIGl0LlxuICogSXQgcmVuZGVycyBhbiBpbnB1dCB3aXRoIHRoZSBwcm9wZXJ0eSBgdmFsdWVgXG4gKiB3aGljaCBpcyBlZGl0YWJsZSBieSB0aGUgdXNlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2QmFyKHsgaWQsIHNldFByb3BzIH0pIHtcblxuICAgIGNvbnN0IGdldFdpbmRvd0RpbWVuc2lvbnMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCB9O1xuICB9XG5cbiAgY29uc3QgZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgIGNvbnN0IHdpZHRoID0gZ2V0V2luZG93RGltZW5zaW9ucygpLndpZHRoO1xuICAgIGlmICh3aWR0aCAgPCBCUkVBS1BPSU5UX01PQklMRSkgcmV0dXJuIFwiTU9CSUxFXCI7XG4gICAgZWxzZSBpZiAod2lkdGggPCBCUkVBS1BPSU5UX1RBQkxFVCkgcmV0dXJuIFwiVEFCTEVUXCI7XG4gICAgZWxzZSByZXR1cm4gXCJOT1JNQUxcIlxuICB9XG5cbiAgICBjb25zdCBoYW5kbGVDbGljayA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzZXRQcm9wcyh7dXJsOiBlLnRhcmdldC5ocmVmfSlcbiAgfVxuICAgICAgXG5cbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGUoZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zKCkpXG5cbiAgY29uc3QgaXRlbXMgPSBbe2xhYmVsOiBcIkFuYWx5c2VzIHRow6ltYXRpcXVlc1wiLCBocmVmOiBcIiNcIn0sIHsgbGFiZWw6IFwiRXhwbG9yZXJcIiwgaHJlZjogXCIvYXBwcy9leHBsb3JlclwifSwgeyBsYWJlbDogXCLDgCBwcm9wb3NcIiwgaHJlZjogXCIvYXBwcy9hX3Byb3Bvc1wiIH1dXG4gIGNvbnN0IG1lbnVJdGVtcyA9IGl0ZW1zLm1hcChpID0+IHtcbiAgICByZXR1cm4gPGEgaHJlZj17aS5ocmVmfSBvbkNsaWNrPXtoYW5kbGVDbGlja30+e2kubGFiZWx9PC9hPlxuICB9KVxuICBjb25zdCBvcHRzID0gW107XG5cblxuXG5cbiAgY29uc3Qgd2luZG93SGFzUmVzaXplZCA9ICgpID0+IHtcbiAgICBjb25zdCBuZXh0TW9kZSA9IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpXG4gICAgaWYgKCBuZXh0TW9kZSAhPT0gbW9kZSkge1xuICAgICAgc2V0TW9kZShuZXh0TW9kZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0TWVudSA9IChtb2RlKSA9PiB7XG4gICAgaWYgKG1vZGUgPT09IFwiTk9STUFMXCIpIHtcbiAgICAgIHJldHVybiA8Q2xhc3NpY05hdmlnYXRpb24+e21lbnVJdGVtc308L0NsYXNzaWNOYXZpZ2F0aW9uPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxCdXJnZXI+e21lbnVJdGVtc308L0J1cmdlcj47XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0U2VhcmNoQmFyID0gKG1vZGUpID0+IHtcbiAgICBpZiAobW9kZSA9PT0gXCJOT1JNQUxcIiB8fCBtb2RlID09PSBcIlRBQkxFVFwiKSB7XG4gICAgICByZXR1cm4gPFNlYXJjaEJhckNvbnRhaW5lciBvcHRzPXtvcHRzfT48L1NlYXJjaEJhckNvbnRhaW5lcj5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxTZWFyY2hJY29uIC8+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0TmF2QmFyRWxlbXMgPSAobW9kZSkgPT4ge1xuICAgIGlmIChtb2RlID09PSBcIk5PUk1BTFwiKSB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJcIj5cbiAgICAgICAgICA8TG9nbyAvPlxuICAgICAgICAgIHtnZXRNZW51KG1vZGUpfVxuICAgICAgICAgIHtnZXRTZWFyY2hCYXIobW9kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gXCJUQUJMRVRcIikge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyXCI+XG4gICAgICAgICAge2dldE1lbnUobW9kZSl9XG4gICAgICAgICAgPExvZ28gLz5cbiAgICAgICAgICB7Z2V0U2VhcmNoQmFyKG1vZGUpfVxuICAgICAgPC9kaXY+O1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyIEN1c3RvbU5hdmJhci1pc01vYmlsZVwiPlxuICAgICAgICAgIHtnZXRNZW51KG1vZGUpfVxuICAgICAgICAgIDxMb2dvIC8+XG4gICAgICAgICAge2dldFNlYXJjaEJhcihtb2RlKX1cbiAgICAgIDwvZGl2PjtcbiAgICB9XG4gIH1cblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHdpbmRvd0hhc1Jlc2l6ZWQpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHdpbmRvd0hhc1Jlc2l6ZWQpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBnZXROYXZCYXJFbGVtcyhtb2RlKVxuXG59XG5cbk5hdkJhci5kZWZhdWx0UHJvcHMgPSB7XG59O1xuXG5OYXZCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogRGFzaC1hc3NpZ25lZCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgdG8gcmVwb3J0IHByb3BlcnR5IGNoYW5nZXNcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0UHJvcHM6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nXG5cblxufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=