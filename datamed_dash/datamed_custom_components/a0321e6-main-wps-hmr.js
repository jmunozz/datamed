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
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BurgerNavigation, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiQnVyZ2VySWNvbiIsIm9wZW4iLCJvbkNsaWNrIiwiY3VycmVudENsYXNzIiwiQnVyZ2VyTmF2aWdhdGlvbiIsImNoaWxkcmVuIiwiUmVhY3QiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkIiwiQnVyZ2VyIiwidXNlU3RhdGUiLCJpc09wZW4iLCJzZXRJc09wZW4iLCJoYW5kbGVCdXJnZXJDbGljayIsIkNsYXNzaWNOYXZpZ2F0aW9uIiwiTG9nbyIsImxvZ29BTlNNIiwiTmF2QmFyIiwiaWQiLCJzZXRQcm9wcyIsImdldFdpbmRvd0RpbWVuc2lvbnMiLCJoZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyIsIm1vZGUiLCJzZXRNb2RlIiwibWVudUl0ZW1zIiwid2luZG93SGFzUmVzaXplZCIsIm5leHRNb2RlIiwiY29uc29sZSIsImxvZyIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibWVudSIsImVsZW1zIiwicmV2ZXJzZSIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUdBLElBQU1BLGlCQUFpQixHQUFHLEdBQTFCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsR0FBMUI7O0FBR0EsU0FBU0MsVUFBVCxPQUF1QztBQUFBLE1BQWpCQyxJQUFpQixRQUFqQkEsSUFBaUI7QUFBQSxNQUFYQyxPQUFXLFFBQVhBLE9BQVc7QUFF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QixpREFBUyxDQUFDQyxNQUpDOztBQU1mO0FBQ0o7QUFDQTtBQUNBO0FBQ0l4QixVQUFRLEVBQUV1QixpREFBUyxDQUFDRTtBQVZMLENBQW5CLEMiLCJmaWxlIjoiYTAzMjFlNi1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IFwiLi9uYXZiYXIuc2Nzc1wiXG5pbXBvcnQgbG9nb0FOU00gZnJvbSBcIi4vbG9nby5zdmdcIlxuXG5cbmNvbnN0IEJSRUFLUE9JTlRfVEFCTEVUID0gNjAwO1xuY29uc3QgQlJFQUtQT0lOVF9NT0JJTEUgPSAzMjA7XG5cblxuZnVuY3Rpb24gQnVyZ2VySWNvbih7IG9wZW4sIG9uQ2xpY2sgfSkge1xuICBcbiAgY29uc3QgY3VycmVudENsYXNzID0gb3BlbiA/IFwib3BlblwiIDogXCJcIjtcblxuICByZXR1cm4gPGRpdiBjbGFzcz17YCR7Y3VycmVudENsYXNzfSBiLWNvbnRhaW5lcmB9PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImItbWVudVwib25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiLWJ1biBiLWJ1bi0tdG9wXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiLWJ1biBiLWJ1bi0tbWlkXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiLWJ1biBiLWJ1bi0tYm90dG9tXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG59IFxuXG5mdW5jdGlvbiBCdXJnZXJOYXZpZ2F0aW9uKHsgb3BlbiwgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuICg8ZGl2IGNsYXNzPXtgJHtjdXJyZW50Q2xhc3N9IGItbmF2YH0+XG4gICAgICAgICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICAgICAgIHJldHVybiA8bGkgY2xhc3NOYW1lPVwiYi1saW5rXCI+e2NoaWxkfTwvbGk+XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2Pilcbn1cblxuZnVuY3Rpb24gQnVyZ2VyKHsgY2hpbGRyZW4gfSkge1xuXG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3BlbiBdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGhhbmRsZUJ1cmdlckNsaWNrID0gKCkgPT4ge1xuICAgIHNldElzT3BlbighaXNPcGVuKVxuICB9XG5cbiAgcmV0dXJuIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgIDxCdXJnZXJJY29uIG9wZW49e2lzT3Blbn0gb25DbGljaz17aGFuZGxlQnVyZ2VyQ2xpY2t9IC8+XG4gICAgICAgICAgICA8QnVyZ2VyTmF2aWdhdGlvbiBvcGVuPXtpc09wZW59PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L0J1cmdlck5hdmlnYXRpb24+XG4gIDwvUmVhY3QuRnJhZ21lbnQ+XG5cbn1cblxuZnVuY3Rpb24gQ2xhc3NpY05hdmlnYXRpb24oeyBjaGlsZHJlbiB9KSB7XG4gIHJldHVybiA8dWwgY2xhc3NOYW1lPVwiTmF2YmFyTmF2aWdhdGlvblwiPlxuICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIDxsaT57Y2hpbGR9PC9saT5cbiAgICB9KX1cbiAgPC91bD5cbn1cblxuZnVuY3Rpb24gTG9nbygpIHtcbiAgcmV0dXJuIDxpbWcgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyTG9nb1wiIHNyYz17bG9nb0FOU019PjwvaW1nPlxufSBcblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkJhcih7IGlkLCBzZXRQcm9wcyB9KSB7XG5cbiAgICBjb25zdCBnZXRXaW5kb3dEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgIHJldHVybiB7IGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LCB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfTtcbiAgfVxuXG4gIGNvbnN0IGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyA9ICgpID0+IHtcbiAgICBjb25zdCB3aWR0aCA9IGdldFdpbmRvd0RpbWVuc2lvbnMoKS53aWR0aDtcbiAgICBpZiAod2lkdGggIDwgQlJFQUtQT0lOVF9NT0JJTEUpIHJldHVybiBcIk1PQklMRVwiO1xuICAgIGVsc2UgaWYgKHdpZHRoIDwgQlJFQUtQT0lOVF9UQUJMRVQpIHJldHVybiBcIlRBQkxFVFwiO1xuICAgIGVsc2UgcmV0dXJuIFwiTk9STUFMXCJcbiAgfVxuXG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVN0YXRlKGdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucygpKVxuXG4gIGNvbnN0IG1lbnVJdGVtcyA9IFsgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYmxvZGUvYnVyZ2VyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QW5hbHlzZXMgdGjDqW1hdGlxdWVzPC9hPixcbiAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21ibG9kZVwiIHRhcmdldD1cIl9ibGFua1wiPkV4cGxvcmVyPC9hPixcbiAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9jb2RlcGVuLmlvL21ibG9kZS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj7DgCBwcm9wb3M8L2E+XVxuXG5cbiAgICAgIFxuXG4gIGNvbnN0IHdpbmRvd0hhc1Jlc2l6ZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV4dE1vZGUgPSBnZXRNb2RlRnJvbVdpbmRvd0RpbWVuc2lvbnMoKVxuICAgIGlmICggbmV4dE1vZGUgIT09IG1vZGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBuZXh0IG1vZGU6ICR7bmV4dE1vZGV9YCwgYG1vZGU6ICR7bW9kZX1gKVxuICAgICAgc2V0TW9kZShuZXh0TW9kZSk7XG4gICAgfVxuICB9XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dIYXNSZXNpemVkKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dIYXNSZXNpemVkKVxuICAgIH1cbiAgfSlcblxuICBjb25zdCBtZW51ID0gbW9kZSA9PT0gXCJOT1JNQUxcIiA/IDxDbGFzc2ljTmF2aWdhdGlvbj57bWVudUl0ZW1zfTwvQ2xhc3NpY05hdmlnYXRpb24+IDogPEJ1cmdlcj57bWVudUl0ZW1zfTwvQnVyZ2VyPlxuICBjb25zdCBlbGVtcyA9IFs8TG9nbyAvPiwgbWVudV1cbiAgaWYgKG1vZGUgIT09IFwiTk9STUFMXCIpIHtcbiAgICBlbGVtcy5yZXZlcnNlKClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJDdXN0b21OYXZiYXJcIj5cbiAgICB7ZWxlbXN9XG4gICAgPC9kaXY+XG5cbiAgKTtcbn1cblxuTmF2QmFyLmRlZmF1bHRQcm9wcyA9IHtcbn07XG5cbk5hdkJhci5wcm9wVHlwZXMgPSB7XG4gICAgLyoqXG4gICAgICogVGhlIElEIHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBjb21wb25lbnQgaW4gRGFzaCBjYWxsYmFja3MuXG4gICAgICovXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBEYXNoLWFzc2lnbmVkIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB0byByZXBvcnQgcHJvcGVydHkgY2hhbmdlc1xuICAgICAqIHRvIERhc2gsIHRvIG1ha2UgdGhlbSBhdmFpbGFibGUgZm9yIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBzZXRQcm9wczogUHJvcFR5cGVzLmZ1bmMsXG5cblxufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=