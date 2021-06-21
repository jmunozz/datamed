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
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, child);
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, child);
  }));
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
    "class": "b-link",
    href: "https://github.com/mblode/burger",
    target: "_blank"
  }, "Analyses th\xE9matiques"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    "class": "b-link",
    href: "https://github.com/mblode",
    target: "_blank"
  }, "Explorer"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    "class": "b-link",
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CustomNavbar"
  }, menu);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJCUkVBS1BPSU5UX1RBQkxFVCIsIkJSRUFLUE9JTlRfTU9CSUxFIiwiQnVyZ2VySWNvbiIsIm9wZW4iLCJvbkNsaWNrIiwiY3VycmVudENsYXNzIiwiQnVyZ2VyTmF2aWdhdGlvbiIsImNoaWxkcmVuIiwiUmVhY3QiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkIiwiQnVyZ2VyIiwidXNlU3RhdGUiLCJpc09wZW4iLCJzZXRJc09wZW4iLCJoYW5kbGVCdXJnZXJDbGljayIsIkNsYXNzaWNOYXZpZ2F0aW9uIiwiTmF2QmFyIiwiaWQiLCJzZXRQcm9wcyIsImdldFdpbmRvd0RpbWVuc2lvbnMiLCJoZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsIndpZHRoIiwiaW5uZXJXaWR0aCIsImdldE1vZGVGcm9tV2luZG93RGltZW5zaW9ucyIsIm1vZGUiLCJzZXRNb2RlIiwibWVudUl0ZW1zIiwid2luZG93SGFzUmVzaXplZCIsIm5leHRNb2RlIiwiY29uc29sZSIsImxvZyIsInVzZUVmZmVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibWVudSIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUlBLElBQU1BLGlCQUFpQixHQUFHLEdBQTFCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsR0FBMUI7O0FBR0EsU0FBU0MsVUFBVCxPQUF1QztBQUFBLE1BQWpCQyxJQUFpQixRQUFqQkEsSUFBaUI7QUFBQSxNQUFYQyxPQUFXLFFBQVhBLE9BQVc7QUFFckMsTUFBTUMsWUFBWSxHQUFHRixJQUFJLEdBQUcsTUFBSCxHQUFZLEVB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QTNELG1CQUZVLENBQWxCOztBQU9BLE1BQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsR0FBTTtBQUM3QixRQUFNQyxRQUFRLEdBQUdMLDJCQUEyQixFQUE1Qzs7QUFDQSxRQUFLSyxRQUFRLEtBQUtKLElBQWxCLEVBQXdCO0FBQ3RCSyxhQUFPLENBQUNDLEdBQVIsc0JBQTBCRixRQUExQixtQkFBK0NKLElBQS9DO0FBQ0FDLGFBQU8sQ0FBQ0csUUFBRCxDQUFQO0FBQ0Q7QUFDRixHQU5EOztBQVFBeEIsOENBQUssQ0FBQzJCLFNBQU4sQ0FBZ0IsWUFBTTtBQUNwQlosVUFBTSxDQUFDYSxnQkFBUCxDQUF3QixRQUF4QixFQUFrQ0wsZ0JBQWxDO0FBQ0EsV0FBTyxZQUFNO0FBQ1hSLFlBQU0sQ0FBQ2MsbUJBQVAsQ0FBMkIsUUFBM0IsRUFBcUNOLGdCQUFyQztBQUNELEtBRkQ7QUFHRCxHQUxEO0FBT0EsTUFBTU8sSUFBSSxHQUFHVixJQUFJLEtBQUssUUFBVCxnQkFBb0IsMkRBQUMsaUJBQUQsUUFBb0JFLFNBQXBCLENBQXBCLGdCQUF5RSwyREFBQyxNQUFELFFBQVNBLFNBQVQsQ0FBdEY7QUFFQSxzQkFDRTtBQUFLLGFBQVMsRUFBQztBQUFmLEtBQ0dRLElBREgsQ0FERjtBQU1EO0FBRURwQixNQUFNLENBQUNxQixZQUFQLEdBQXNCLEVBQXRCO0FBR0FyQixNQUFNLENBQUNzQixTQUFQLEdBQW1CO0FBQ2Y7QUFDSjtBQUNBO0FBQ0lyQixJQUFFLEVBQUVzQixpREFBUyxDQUFDQyxNQUpDOztBQU1mO0FBQ0o7QUFDQTtBQUNBO0FBQ0l0QixVQUFRLEVBQUVxQixpREFBUyxDQUFDRTtBQVZMLENBQW5CLEMiLCJmaWxlIjoiYTAzMjFlNi1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IFwiLi9uYXZiYXIuc2Nzc1wiXG5cblxuXG5jb25zdCBCUkVBS1BPSU5UX1RBQkxFVCA9IDYwMDtcbmNvbnN0IEJSRUFLUE9JTlRfTU9CSUxFID0gMzIwO1xuXG5cbmZ1bmN0aW9uIEJ1cmdlckljb24oeyBvcGVuLCBvbkNsaWNrIH0pIHtcbiAgXG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG9wZW4gPyBcIm9wZW5cIiA6IFwiXCI7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3M9e2Ake2N1cnJlbnRDbGFzc30gYi1jb250YWluZXJgfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiLW1lbnVcIm9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLXRvcFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLW1pZFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYi1idW4gYi1idW4tLWJvdHRvbVwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxufSBcblxuZnVuY3Rpb24gQnVyZ2VyTmF2aWdhdGlvbih7IG9wZW4sIGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBjdXJyZW50Q2xhc3MgPSBvcGVuID8gXCJvcGVuXCIgOiBcIlwiO1xuXG4gIHJldHVybiAoPGRpdiBjbGFzcz17YCR7Y3VycmVudENsYXNzfSBiLW5hdmB9PlxuICAgICAgICAgIHtSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICByZXR1cm4gPGxpPntjaGlsZH08L2xpPlxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj4pXG59XG5cbmZ1bmN0aW9uIEJ1cmdlcih7IGNoaWxkcmVuIH0pIHtcblxuICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW4gXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVCdXJnZXJDbGljayA9ICgpID0+IHtcbiAgICBzZXRJc09wZW4oIWlzT3BlbilcbiAgfVxuXG4gIHJldHVybiA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAgICA8QnVyZ2VySWNvbiBvcGVuPXtpc09wZW59IG9uQ2xpY2s9e2hhbmRsZUJ1cmdlckNsaWNrfSAvPixcbiAgICAgICAgICAgIDxCdXJnZXJOYXZpZ2F0aW9uIG9wZW49e2lzT3Blbn0+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgIDwvQnVyZ2VyTmF2aWdhdGlvbj5cbiAgPC9SZWFjdC5GcmFnbWVudD5cblxufVxuXG5mdW5jdGlvbiBDbGFzc2ljTmF2aWdhdGlvbih7IGNoaWxkcmVuIH0pIHtcbiAgcmV0dXJuIDx1bD5cbiAgICB7UmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgIHJldHVybiA8bGk+e2NoaWxkfTwvbGk+XG4gICAgfSl9XG4gIDwvdWw+XG59XG5cbi8qKlxuICogRXhhbXBsZUNvbXBvbmVudCBpcyBhbiBleGFtcGxlIGNvbXBvbmVudC5cbiAqIEl0IHRha2VzIGEgcHJvcGVydHksIGBsYWJlbGAsIGFuZFxuICogZGlzcGxheXMgaXQuXG4gKiBJdCByZW5kZXJzIGFuIGlucHV0IHdpdGggdGhlIHByb3BlcnR5IGB2YWx1ZWBcbiAqIHdoaWNoIGlzIGVkaXRhYmxlIGJ5IHRoZSB1c2VyLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOYXZCYXIoeyBpZCwgc2V0UHJvcHMgfSkge1xuXG4gICAgY29uc3QgZ2V0V2luZG93RGltZW5zaW9ucyA9ICgpID0+IHtcbiAgICByZXR1cm4geyBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCwgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoIH07XG4gIH1cblxuICBjb25zdCBnZXRNb2RlRnJvbVdpbmRvd0RpbWVuc2lvbnMgPSAoKSA9PiB7XG4gICAgY29uc3Qgd2lkdGggPSBnZXRXaW5kb3dEaW1lbnNpb25zKCkud2lkdGg7XG4gICAgaWYgKHdpZHRoICA8IEJSRUFLUE9JTlRfTU9CSUxFKSByZXR1cm4gXCJNT0JJTEVcIjtcbiAgICBlbHNlIGlmICh3aWR0aCA8IEJSRUFLUE9JTlRfVEFCTEVUKSByZXR1cm4gXCJUQUJMRVRcIjtcbiAgICBlbHNlIHJldHVybiBcIk5PUk1BTFwiXG4gIH1cblxuICBjb25zdCBbbW9kZSwgc2V0TW9kZV0gPSB1c2VTdGF0ZShnZXRNb2RlRnJvbVdpbmRvd0RpbWVuc2lvbnMoKSlcblxuICBjb25zdCBtZW51SXRlbXMgPSBbICAgICAgICAgIDxhIGNsYXNzPVwiYi1saW5rXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYmxvZGUvYnVyZ2VyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QW5hbHlzZXMgdGjDqW1hdGlxdWVzPC9hPixcbiAgICAgICAgICA8YSBjbGFzcz1cImItbGlua1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWJsb2RlXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RXhwbG9yZXI8L2E+LFxuICAgICAgICAgIDxhIGNsYXNzPVwiYi1saW5rXCIgaHJlZj1cImh0dHBzOi8vY29kZXBlbi5pby9tYmxvZGUvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+w4AgcHJvcG9zPC9hPl1cblxuXG4gICAgICBcblxuICBjb25zdCB3aW5kb3dIYXNSZXNpemVkID0gKCkgPT4ge1xuICAgIGNvbnN0IG5leHRNb2RlID0gZ2V0TW9kZUZyb21XaW5kb3dEaW1lbnNpb25zKClcbiAgICBpZiAoIG5leHRNb2RlICE9PSBtb2RlKSB7XG4gICAgICBjb25zb2xlLmxvZyhgbmV4dCBtb2RlOiAke25leHRNb2RlfWAsIGBtb2RlOiAke21vZGV9YClcbiAgICAgIHNldE1vZGUobmV4dE1vZGUpO1xuICAgIH1cbiAgfVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgd2luZG93SGFzUmVzaXplZClcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgd2luZG93SGFzUmVzaXplZClcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgbWVudSA9IG1vZGUgPT09IFwiTk9STUFMXCIgPyA8Q2xhc3NpY05hdmlnYXRpb24+e21lbnVJdGVtc308L0NsYXNzaWNOYXZpZ2F0aW9uPiA6IDxCdXJnZXI+e21lbnVJdGVtc308L0J1cmdlcj5cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiQ3VzdG9tTmF2YmFyXCI+XG4gICAgICB7bWVudX1cbiAgICA8L2Rpdj5cblxuICApO1xufVxuXG5OYXZCYXIuZGVmYXVsdFByb3BzID0ge1xufTtcblxuTmF2QmFyLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==