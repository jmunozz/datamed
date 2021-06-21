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
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navbar.scss */ "./src/lib/components/navbar.scss");
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_navbar_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _logo_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logo.svg */ "./src/lib/components/logo.svg");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var BREAKPOINT_TABLET = 600;
var BREAKPOINT_MOBILE = 320;

function BurgerIcon(_ref) {
  var open = _ref.open,
      onClick = _ref.onClick;
  var currentClass = open ? "open" : "";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "".concat(currentClass, " b-container")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "b-menu",
    onClick: onClick
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "b-bun b-bun--top"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "b-bun b-bun--mid"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "b-bun b-bun--bottom"
  })));
}

function BurgerNavigation(_ref2) {
  var open = _ref2.open,
      children = _ref2.children;
  var currentClass = open ? "open" : "";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    "class": "".concat(currentClass, " b-nav")
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "b-link"
    }, child);
  }));
}

function Burger(_ref3) {
  var children = _ref3.children;

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
  }), ",", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BurgerNavigation, {
    open: isOpen
  }, children));
}

function ClassicNavigation(_ref4) {
  var children = _ref4.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
    className: "NavbarNavigation"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, child);
  }));
}

function Logo() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
    className: "CustomNavbarLogo",
    src: _logo_svg__WEBPACK_IMPORTED_MODULE_3__["default"]
  });
}
/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */


function NavBar(_ref5) {
  var id = _ref5.id,
      setProps = _ref5.setProps;

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

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(getModeFromWindowDimensions()),
      _useState4 = _slicedToArray(_useState3, 2),
      mode = _useState4[0],
      setMode = _useState4[1];

  var menuItems = [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "https://github.com/mblode/burger",
    target: "_blank"
  }, "Analyses th\xE9matiques"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "https://github.com/mblode",
    target: "_blank"
  }, "Explorer"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "https://codepen.io/mblode/",
    target: "_blank"
  }, "\xC0 propos")];

  var windowHasResized = function windowHasResized() {
    var nextMode = getModeFromWindowDimensions();

    if (nextMode !== mode) {
      console.log("next mode: ".concat(nextMode), "mode: ".concat(mode));
      setMode(nextMode);
    }
  };

  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(function () {
    window.addEventListener("resize", windowHasResized);
    return function () {
      window.removeEventListener("resize", windowHasResized);
    };
  });
  var menu = mode === "NORMAL" ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ClassicNavigation, null, menuItems) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Burger, null, menuItems);
  var elems = [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Logo, null), menu];

  if (mode !== "NORMAL") {
    elems.reverse();
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CustomNavbar"
  }, elems);
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

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiQnVyZ2VySWNvbiIsIm9wZW4iLCJvbkNsaWNrIiwiY3VycmVudENsYXNzIiwiQnVyZ2VyTmF2aWdhdGlvbiIsImNoaWxkcmVuIiwiUmVhY3QiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkIiwiQnVyZ2VyIiwidXNlU3RhdGUiLCJpc09wZW4iLCJzZXRJc09wZW4iLCJoYW5kbGVCdXJnZXJDbGljayIsIkNsYXNzaWNOYXZpZ2F0aW9uIiwiTG9nbyIsImxvZ29BTlNNIiwiTmF2QmFyIiwiaWQiLCJzZXRQcm9wcyIsImdldFdpbmRvd0RpbWVuc2lvbnMiLCJoZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyIsIm1vZGUiLCJzZXRNb2RlIiwibWVudUl0ZW1zIiwid2luZG93SGFzUmVzaXplZCIsIm5leHRNb2RlIiwiY29uc29sZSIsImxvZyIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibWVudSIsImVsZW1zIiwicmV2ZXJzZSIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUdBLElBQU1BLGlCQUFpQixHQUFHLEdBQTFCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsR0FBMUI7O0FBR0EsU0FBU0MsVUFBVCxPQUF1QztBQUFBLE1BQWpCQyxJQUFpQixRQUFqQkEsSUFBaUI7QUFBQSxNQUFYQyxPQUFXLFFBQVhBLE9BQVc7QUFF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d0IsaURBQVMsQ0FBQ0MsTUFKQzs7QUFNZjtBQUNKO0FBQ0E7QUFDQTtBQUNJeEIsVUFBUSxFQUFFdUIsaURBQVMsQ0FBQ0U7QUFWTCxDQUFuQixDIiwiZmlsZSI6ImEwMzIxZTYtbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBcIi4vbmF2YmFyLnNjc3NcIlxuaW1wb3J0IGxvZ29BTlNNIGZyb20gXCIuL2xvZ28uc3ZnXCJcblxuXG5jb25zdCBCUkVBS1BPSU5UX1RBQkxFVCA9IDYwMDtcbmNvbnN0IEJSRUFLUE9JTlRfTU9CSUxFID0gMzIwO1xuXG5cbmZ1bmN0aW9uIEJ1cmdlckljb24oeyBvcGVuLCBvbkNsaWNrIH0pIHtcbiAgXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3M9e2Ake2N1cnJlbnRDbGFzc30gYi1jb250YWluZXJgfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiLW1lbnVcIm9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLXRvcFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLW1pZFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLWJvdHRvbVwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxufSBcblxuZnVuY3Rpb24gQnVyZ2VyTmF2aWdhdGlvbih7IG9wZW4sIGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBjdXJyZW50Q2xhc3MgPSBvcGVuID8gXCJvcGVuXCIgOiBcIlwiO1xuXG4gIHJldHVybiAoPGRpdiBjbGFzcz17YCR7Y3VycmVudENsYXNzfSBiLW5hdmB9PlxuICAgICAgICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICByZXR1cm4gPGxpIGNsYXNzTmFtZT1cImItbGlua1wiPntjaGlsZH08L2xpPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4pXG59XG5cbmZ1bmN0aW9uIEJ1cmdlcih7IGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW4gXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVCdXJnZXJDbGljayA9ICgpID0+IHtcbiAgICBzZXRJc09wZW4oIWlzT3BlbilcbiAgfVxuXG4gIHJldHVybiA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICA8QnVyZ2VySWNvbiBvcGVuPXtpc09wZW59IG9uQ2xpY2s9e2hhbmRsZUJ1cmdlckNsaWNrfSAvPixcbiAgICAgICAgICAgIDxCdXJnZXJOYXZpZ2F0aW9uIG9wZW49e2lzT3Blbn0+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgIDwvQnVyZ2VyTmF2aWdhdGlvbj5cbiAgPC9SZWFjdC5GcmFnbWVudD5cblxufVxuXG5mdW5jdGlvbiBDbGFzc2ljTmF2aWdhdGlvbih7IGNoaWxkcmVuIH0pIHtcbiAgcmV0dXJuIDx1bCBjbGFzc05hbWU9XCJOYXZiYXJOYXZpZ2F0aW9uXCI+XG4gICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gPGxpPntjaGlsZH08L2xpPlxuICAgIH0pfVxuICA8L3VsPlxufVxuXG5mdW5jdGlvbiBMb2dvKCkge1xuICByZXR1cm4gPGltZyBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJMb2dvXCIgc3JjPXtsb2dvQU5TTX0+PC9pbWc+XG59IFxuXG4vKipcbiAqIEV4YW1wbGVDb21wb25lbnQgaXMgYW4gZXhhbXBsZSBjb21wb25lbnQuXG4gKiBJdCB0YWtlcyBhIHByb3BlcnR5LCBgbGFiZWxgLCBhbmRcbiAqIGRpc3BsYXlzIGl0LlxuICogSXQgcmVuZGVycyBhbiBpbnB1dCB3aXRoIHRoZSBwcm9wZXJ0eSBgdmFsdWVgXG4gKiB3aGljaCBpcyBlZGl0YWJsZSBieSB0aGUgdXNlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2QmFyKHsgaWQsIHNldFByb3BzIH0pIHtcblxuICAgIGNvbnN0IGdldFdpbmRvd0RpbWVuc2lvbnMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCB9O1xuICB9XG5cbiAgY29uc3QgZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgIGNvbnN0IHdpZHRoID0gZ2V0V2luZG93RGltZW5zaW9ucygpLndpZHRoO1xuICAgIGlmICh3aWR0aCAgPCBCUkVBS1BPSU5UX01PQklMRSkgcmV0dXJuIFwiTU9CSUxFXCI7XG4gICAgZWxzZSBpZiAod2lkdGggPCBCUkVBS1BPSU5UX1RBQkxFVCkgcmV0dXJuIFwiVEFCTEVUXCI7XG4gICAgZWxzZSByZXR1cm4gXCJOT1JNQUxcIlxuICB9XG5cbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGUoZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zKCkpXG5cbiAgY29uc3QgbWVudUl0ZW1zID0gWyAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21ibG9kZS9idXJnZXJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BbmFseXNlcyB0aMOpbWF0aXF1ZXM8L2E+LFxuICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWJsb2RlXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RXhwbG9yZXI8L2E+LFxuICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL2NvZGVwZW4uaW8vbWJsb2RlL1wiIHRhcmdldD1cIl9ibGFua1wiPsOAIHByb3BvczwvYT5dXG5cblxuICAgICAgXG5cbiAgY29uc3Qgd2luZG93SGFzUmVzaXplZCA9ICgpID0+IHtcbiAgICBjb25zdCBuZXh0TW9kZSA9IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpXG4gICAgaWYgKCBuZXh0TW9kZSAhPT0gbW9kZSkge1xuICAgICAgY29uc29sZS5sb2coYG5leHQgbW9kZTogJHtuZXh0TW9kZX1gLCBgbW9kZTogJHttb2RlfWApXG4gICAgICBzZXRNb2RlKG5leHRNb2RlKTtcbiAgICB9XG4gIH1cblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHdpbmRvd0hhc1Jlc2l6ZWQpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHdpbmRvd0hhc1Jlc2l6ZWQpXG4gICAgfVxuICB9KVxuXG4gIGNvbnN0IG1lbnUgPSBtb2RlID09PSBcIk5PUk1BTFwiID8gPENsYXNzaWNOYXZpZ2F0aW9uPnttZW51SXRlbXN9PC9DbGFzc2ljTmF2aWdhdGlvbj4gOiA8QnVyZ2VyPnttZW51SXRlbXN9PC9CdXJnZXI+XG4gIGNvbnN0IGVsZW1zID0gWzxMb2dvIC8+LCBtZW51XVxuICBpZiAobW9kZSAhPT0gXCJOT1JNQUxcIikge1xuICAgIGVsZW1zLnJldmVyc2UoKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIkN1c3RvbU5hdmJhclwiPlxuICAgIHtlbGVtc31cbiAgICA8L2Rpdj5cblxuICApO1xufVxuXG5OYXZCYXIuZGVmYXVsdFByb3BzID0ge1xufTtcblxuTmF2QmFyLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==