webpackHotUpdatedatamed_custom_components("main",{

/***/ "./src/lib/components/SearchBar.react.js":
/*!***********************************************!*\
  !*** ./src/lib/components/SearchBar.react.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SearchBar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactstrap */ "./node_modules/reactstrap/es/index.js");
!(function webpackMissingModule() { var e = new Error("Cannot find module '../search_bar.css'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */

var SearchBar = /*#__PURE__*/function (_Component) {
  _inherits(SearchBar, _Component);

  var _super = _createSuper(SearchBar);

  function SearchBar() {
    _classCallCheck(this, SearchBar);

    return _super.apply(this, arguments);
  }

  _createClass(SearchBar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          label = _this$props.label,
          setProps = _this$props.setProps,
          value = _this$props.value;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["InputGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["InputGroupAddon"], {
        addonType: "prepend"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["InputGroupText"], null, "?")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["Input"], {
        placeholder: "specialit\xE9, substance"
      })));
    }
  }]);

  return SearchBar;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);


SearchBar.defaultProps = {};
SearchBar.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * A label that will be printed when this component is rendered.
   */
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,

  /**
   * The value displayed in the input.
   */
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1NlYXJjaEJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJTZWFyY2hCYXIiLCJwcm9wcyIsImlkIiwibGFiZWwiLCJzZXRQcm9wcyIsInZhbHVlIiwiQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztJQUNxQkEsUzs7Ozs7Ozs7Ozs7OztXQUNqQixrQkFBUztBQUNMLHdCQUFxQyxLQUFLQyxLQUExQztBQUFBLFVBQU9DLEVBQVAsZUFBT0EsRUFBUDtBQUFBLFVBQVdDLEtBQVgsZUFBV0EsS0FBWDtBQUFBLFVBQWtCQyxRQUFsQixlQUFrQkEsUUFBbEI7QUFBQSxVQUE0QkMsS0FBNUIsZUFBNEJBLEtBQTVCO0FBRUEsMEJBQ0k7QUFBSyxVQUFFLEVBQUVIO0FBQVQsc0JBQ0ksMkRBQUMscURBQUQscUJBQ0ksMkRBQUMsMERBQUQ7QUFBaUIsaUJBQVMsRUFBQztBQUEzQixzQkFDSSwyREFBQyx5REFBRCxZQURKLENBREosZUFJSSwyREFBQyxnREFBRDtBQUFPLG1CQUFXLEVBQUM7QUFBbkIsUUFKSixDQURKLENBREo7QUFVSDs7OztFQWRrQ0ksK0M7OztBQWlCdkNOLFNBQVMsQ0FBQ08sWUFBVixHQUF5QixFQUF6QjtBQUVBUCxTQUFTLENBQUNRLFNBQVYsR0FBc0I7QUFDbEI7QUFDSjtBQUNBO0FBQ0lOLElBQUUsRUFBRU8saURBQVMsQ0FBQ0MsTUFKSTs7QUFNbEI7QUFDSjtBQUNBO0FBQ0lQLE9BQUssRUFBRU0saURBQVMsQ0FBQ0MsTUFBVixDQUFpQkMsVUFUTjs7QUFXbEI7QUFDSjtBQUNBO0FBQ0lOLE9BQUssRUFBRUksaURBQVMsQ0FBQ0MsTUFkQzs7QUFnQmxCO0FBQ0o7QUFDQTtBQUNBO0FBQ0lOLFVBQVEsRUFBRUssaURBQVMsQ0FBQ0c7QUFwQkYsQ0FBdEIsQyIsImZpbGUiOiI5NTA2MGQwLW1haW4td3BzLWhtci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7SW5wdXRHcm91cCwgSW5wdXQsIElucHV0R3JvdXBBZGRvbiwgSW5wdXRHcm91cFRleHR9IGZyb20gJ3JlYWN0c3RyYXAnO1xuXG5pbXBvcnQgJy4uL3NlYXJjaF9iYXIuY3NzJztcblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaEJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7aWQsIGxhYmVsLCBzZXRQcm9wcywgdmFsdWV9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17aWR9PlxuICAgICAgICAgICAgICAgIDxJbnB1dEdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8SW5wdXRHcm91cEFkZG9uIGFkZG9uVHlwZT1cInByZXBlbmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dEdyb3VwVGV4dD4/PC9JbnB1dEdyb3VwVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9JbnB1dEdyb3VwQWRkb24+XG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCBwbGFjZWhvbGRlcj1cInNwZWNpYWxpdMOpLCBzdWJzdGFuY2VcIj48L0lucHV0PlxuICAgICAgICAgICAgICAgIDwvSW5wdXRHcm91cD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuU2VhcmNoQmFyLmRlZmF1bHRQcm9wcyA9IHt9O1xuXG5TZWFyY2hCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQSBsYWJlbCB0aGF0IHdpbGwgYmUgcHJpbnRlZCB3aGVuIHRoaXMgY29tcG9uZW50IGlzIHJlbmRlcmVkLlxuICAgICAqL1xuICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgZGlzcGxheWVkIGluIHRoZSBpbnB1dC5cbiAgICAgKi9cbiAgICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9