webpackHotUpdatedatamed_custom_components("main",{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/NavBar.scss":
false,

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/navbar.scss":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/navbar.scss ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nTypeError: this.getOptions is not a function\n    at Object.loader (/Users/ledjodje/projects/datamed/datamed_dash_custom_components_builder/node_modules/sass-loader/dist/index.js:25:24)");

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
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./navbar.scss */ "./src/lib/components/navbar.scss");
/* harmony import */ var _navbar_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_navbar_scss__WEBPACK_IMPORTED_MODULE_3__);




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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "CusotmNavBar"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_burger_menu__WEBPACK_IMPORTED_MODULE_2__["slide"], {
    width: "100%"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
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
  }, "Contact")));
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

/***/ "./src/lib/components/NavBar.scss":
false,

/***/ "./src/lib/components/navbar.scss":
/*!****************************************!*\
  !*** ./src/lib/components/navbar.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./navbar.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/navbar.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./navbar.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/navbar.scss", function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./navbar.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/lib/components/navbar.scss");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL05hdkJhci5yZWFjdC5qcyIsIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL25hdmJhci5zY3NzIl0sIm5hbWVzIjpbIk5hdkJhciIsImlkIiwic2V0UHJvcHMiLCJkZWZhdWx0UHJvcHMiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ2UsU0FBU0EsTUFBVCxPQUFrQztBQUFBLE1BQWhCQyxFQUFnQixRQUFoQkEsRUFBZ0I7QUFBQSxNQUFaQyxRQUFZLFFBQVpBLFFBQVk7QUFFL0Msc0JBQ0U7QUFBSyxhQUFTLEVBQUM7QUFBZixrQkFDRSwyREFBQyx1REFBRDtBQUFNLFNBQUssRUFBQztBQUFaLGtCQUNFO0FBQUcsTUFBRSxFQUFDLE1BQU47QUFBYSxhQUFTLEVBQUMsV0FBdkI7QUFBbUMsUUFBSSxFQUFDO0FBQXhDLFlBREYsZUFFSTtBQUFHLE1BQUUsRUFBQyxPQUFOO0FBQWMsYUFBUyxFQUFDLFdBQXhCO0FBQW9DLFFBQUksRUFBQztBQUF6QyxhQUZKLGVBR0k7QUFBRyxNQUFFLEVBQUMsU0FBTjtBQUFnQixhQUFTLEVBQUMsV0FBMUI7QUFBc0MsUUFBSSxFQUFDO0FBQTNDLGVBSEosQ0FERixDQURGO0FBVUQ7QUFFREYsTUFBTSxDQUFDRyxZQUFQLEdBQXNCLEVBQXRCO0FBR0FILE1BQU0sQ0FBQ0ksU0FBUCxHQUFtQjtBQUNmO0FBQ0o7QUFDQTtBQUNJSCxJQUFFLEVBQUVJLGlEQUFTLENBQUNDLE1BSkM7O0FBTWY7QUFDSjtBQUNBO0FBQ0E7QUFDSUosVUFBUSxFQUFFRyxpREFBUyxDQUFDRTtBQVZMLENBQW5CLEM7Ozs7Ozs7Ozs7Ozs7OztBQzdCQSxjQUFjLG1CQUFPLENBQUMsZ09BQTRHOztBQUVsSSw0Q0FBNEMsUUFBUzs7QUFFckQ7QUFDQTs7OztBQUlBLGVBQWU7O0FBRWY7QUFDQTs7QUFFQSxhQUFhLG1CQUFPLENBQUMseUdBQXNEOztBQUUzRTs7QUFFQSxHQUFHLElBQVU7QUFDYixtQkFBbUIsZ09BQTRHO0FBQy9ILG1CQUFtQixtQkFBTyxDQUFDLGdPQUE0Rzs7QUFFdkksb0RBQW9ELFFBQVM7O0FBRTdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0EsRUFBRTs7QUFFRixnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEMiLCJmaWxlIjoiNzYwZWYwZi1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgc2xpZGUgYXMgTWVudSB9IGZyb20gJ3JlYWN0LWJ1cmdlci1tZW51J1xuXG5pbXBvcnQgXCIuL25hdmJhci5zY3NzXCJcblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5hdkJhcih7IGlkLCBzZXRQcm9wcyB9KSB7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIkN1c290bU5hdkJhclwiPlxuICAgICAgPE1lbnUgd2lkdGg9XCIxMDAlXCI+XG4gICAgICAgIDxhIGlkPVwiaG9tZVwiIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGhyZWY9XCIvXCI+SG9tZTwvYT5cbiAgICAgICAgICA8YSBpZD1cImFib3V0XCIgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgaHJlZj1cIi9hYm91dFwiPkFib3V0PC9hPlxuICAgICAgICAgIDxhIGlkPVwiY29udGFjdFwiIGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIGhyZWY9XCIvY29udGFjdFwiPkNvbnRhY3Q8L2E+XG4gICAgICA8L01lbnU+XG4gICAgPC9kaXY+XG5cbiAgKTtcbn1cblxuTmF2QmFyLmRlZmF1bHRQcm9wcyA9IHtcbn07XG5cbk5hdkJhci5wcm9wVHlwZXMgPSB7XG4gICAgLyoqXG4gICAgICogVGhlIElEIHVzZWQgdG8gaWRlbnRpZnkgdGhpcyBjb21wb25lbnQgaW4gRGFzaCBjYWxsYmFja3MuXG4gICAgICovXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBEYXNoLWFzc2lnbmVkIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB0byByZXBvcnQgcHJvcGVydHkgY2hhbmdlc1xuICAgICAqIHRvIERhc2gsIHRvIG1ha2UgdGhlbSBhdmFpbGFibGUgZm9yIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBzZXRQcm9wczogUHJvcFR5cGVzLmZ1bmMsXG5cblxufTtcbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9uYXZiYXIuc2Nzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbmF2YmFyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9uYXZiYXIuc2Nzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=