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
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _search_bar_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./search_bar.css */ "./src/lib/components/search_bar.css");
/* harmony import */ var _search_bar_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_search_bar_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _search_icon_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./search_icon.svg */ "./src/lib/components/search_icon.svg");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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







var optsPropType = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.any,
  type: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
}));

var SearchDropDown = /*#__PURE__*/function (_Component) {
  _inherits(SearchDropDown, _Component);

  var _super = _createSuper(SearchDropDown);

  function SearchDropDown(props) {
    _classCallCheck(this, SearchDropDown);

    return _super.call(this, props);
  }

  _createClass(SearchDropDown, [{
    key: "buildItem",
    value: function buildItem(label, value, type) {
      var _this = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        onClick: function onClick() {
          return _this.props.onSelect({
            label: label,
            value: value,
            type: type
          });
        },
        className: "search-dropdown-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "search-dropdown-item-label"
      }, label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "search-dropdown-item-caption"
      }, type));
    }
  }, {
    key: "buildNoResultItem",
    value: function buildNoResultItem() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "search-dropdown-item"
      }, "Pas de r\xE9sultat");
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          opts = _this$props.opts,
          isOpen = _this$props.isOpen;
      var items = opts.length ? opts.map(function (opt) {
        return _this2.buildItem(opt.label, opt.value, opt.type);
      }) : this.buildNoResultItem();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "search-dropdown-menu",
        style: {
          display: isOpen ? true : 'none'
        }
      }, items);
    }
  }]);

  return SearchDropDown;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

SearchDropDown.defaultProps = {};
SearchDropDown.propTypes = {
  opts: optsPropType,
  onSelect: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  isOpen: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool
};
var initialState = {
  inputValue: '',
  isDropDownOpen: false,
  submitValue: null
};
/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */

var SearchBar = /*#__PURE__*/function (_Component2) {
  _inherits(SearchBar, _Component2);

  var _super2 = _createSuper(SearchBar);

  function SearchBar(props) {
    var _this3;

    _classCallCheck(this, SearchBar);

    _this3 = _super2.call(this, props);

    _defineProperty(_assertThisInitialized(_this3), "handleDropDown", function (_ref) {
      var label = _ref.label,
          value = _ref.value,
          type = _ref.type;

      if (_this3.props.fireOnSelect) {
        _this3.fire({
          value: value,
          type: type
        });
      } else {
        _this3.setState({
          inputValue: label,
          isDropDownOpen: false,
          submitValue: {
            value: value,
            type: type
          }
        }); //this is not working use dirty fix...
        //this.inputRef.current.focus();


        var input = document.querySelector(".search-bar-wrapper input.form-control");
        input.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_this3), "handleInput", function (event) {
      var inputValue = event.target.value;

      _this3.setState({
        inputValue: inputValue,
        isDropDownOpen: Boolean(inputValue)
      });
    });

    _defineProperty(_assertThisInitialized(_this3), "handleSubmit", function (event) {
      if (event.key === 'Enter') {
        var submitValue = _this3.state.submitValue;

        if (submitValue) {
          _this3.fire(submitValue);
        }
      }
    });

    _this3.state = initialState;
    _this3.inputRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this3;
  }

  _createClass(SearchBar, [{
    key: "clearState",
    value: function clearState() {
      this.setState(initialState);
    }
  }, {
    key: "fire",
    value: function fire(val) {
      this.props.setProps({
        value: val
      });
      this.clearState();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          id = _this$props2.id,
          className = _this$props2.className,
          opts = _this$props2.opts;
      var _this$state = this.state,
          isDropDownOpen = _this$state.isDropDownOpen,
          inputValue = _this$state.inputValue;
      var selectOpts = inputValue ? opts.filter(function (opt) {
        return opt.label.startsWith(inputValue);
      }).slice(0, 100) : [];
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id,
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('search-bar-wrapper', className)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["InputGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: _search_icon_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["Input"], {
        type: "text",
        ref: this.inputRef,
        onChange: this.handleInput,
        placeholder: "specialit\xE9, substance",
        value: inputValue,
        onKeyPress: this.handleSubmit
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SearchDropDown, {
        isOpen: isDropDownOpen,
        opts: selectOpts,
        onSelect: this.handleDropDown
      }));
    }
  }]);

  return SearchBar;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);


SearchBar.defaultProps = {
  opts: []
};
SearchBar.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  opts: optsPropType,
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string, prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number]),
    type: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
  }),
  fireOnSelect: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1NlYXJjaEJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJvcHRzUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwic2hhcGUiLCJsYWJlbCIsInN0cmluZyIsInZhbHVlIiwiYW55IiwidHlwZSIsIlNlYXJjaERyb3BEb3duIiwicHJvcHMiLCJvblNlbGVjdCIsIm9wdHMiLCJpc09wZW4iLCJpdGVtcyIsImxlbmd0aCIsIm1hcCIsIm9wdCIsImJ1aWxkSXRlbSIsImJ1aWxkTm9SZXN1bHRJdGVtIiwiZGlzcGxheSIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsImZ1bmMiLCJib29sIiwiaW5pdGlhbFN0YXRlIiwiaW5wdXRWYWx1ZSIsImlzRHJvcERvd25PcGVuIiwic3VibWl0VmFsdWUiLCJTZWFyY2hCYXIiLCJmaXJlT25TZWxlY3QiLCJmaXJlIiwic2V0U3RhdGUiLCJpbnB1dCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImZvY3VzIiwiZXZlbnQiLCJ0YXJnZXQiLCJCb29sZWFuIiwia2V5Iiwic3RhdGUiLCJpbnB1dFJlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwidmFsIiwic2V0UHJvcHMiLCJjbGVhclN0YXRlIiwiaWQiLCJjbGFzc05hbWUiLCJzZWxlY3RPcHRzIiwiZmlsdGVyIiwic3RhcnRzV2l0aCIsInNsaWNlIiwiY2xhc3NOYW1lcyIsInNlYXJjaEljb24iLCJoYW5kbGVJbnB1dCIsImhhbmRsZVN1Ym1pdCIsImhhbmRsZURyb3BEb3duIiwib25lT2ZUeXBlIiwibnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQyxpREFBUyxDQUFDQyxPQUFW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Wlk7QUFjbEJNLE9BQUssRUFBRUwsaURBQVMsQ0FBQ0UsS0FBVixDQUFnQjtBQUNuQkcsU0FBSyxFQUFFTCxpREFBUyxDQUFDMkQsU0FBVixDQUFvQixDQUFDM0QsaURBQVMsQ0FBQ0ksTUFBWCxFQUFtQkosaURBQVMsQ0FBQzRELE1BQTdCLENBQXBCLENBRFk7QUFFbkJyRCxRQUFJLEVBQUVQLGlEQUFTLENBQUNJO0FBRkcsR0FBaEIsQ0FkVztBQW1CbEIwQixjQUFZLEVBQUU5QixpREFBUyxDQUFDd0I7QUFuQk4sQ0FBdEIsQyIsImZpbGUiOiJkNTkzM2VkLW1haW4td3BzLWhtci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7SW5wdXRHcm91cCwgSW5wdXR9IGZyb20gJ3JlYWN0c3RyYXAnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCAnLi9zZWFyY2hfYmFyLmNzcyc7XG5pbXBvcnQgc2VhcmNoSWNvbiBmcm9tICcuL3NlYXJjaF9pY29uLnN2Zyc7XG5cbmNvbnN0IG9wdHNQcm9wVHlwZSA9IFByb3BUeXBlcy5hcnJheU9mKFxuICAgIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLmFueSxcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB9KVxuKTtcblxuY2xhc3MgU2VhcmNoRHJvcERvd24gZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICB9XG5cbiAgICBidWlsZEl0ZW0obGFiZWwsIHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vblNlbGVjdCh7bGFiZWwsIHZhbHVlLCB0eXBlfSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLWl0ZW1cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLWl0ZW0tbGFiZWxcIj57bGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbS1jYXB0aW9uXCI+e3R5cGV9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBidWlsZE5vUmVzdWx0SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLWl0ZW1cIj5QYXMgZGUgcsOpc3VsdGF0PC9kaXY+O1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge29wdHMsIGlzT3Blbn0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCBpdGVtcyA9IG9wdHMubGVuZ3RoXG4gICAgICAgICAgICA/IG9wdHMubWFwKChvcHQpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkSXRlbShvcHQubGFiZWwsIG9wdC52YWx1ZSwgb3B0LnR5cGUpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgOiB0aGlzLmJ1aWxkTm9SZXN1bHRJdGVtKCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLW1lbnVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogaXNPcGVuID8gdHJ1ZSA6ICdub25lJ319XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5TZWFyY2hEcm9wRG93bi5kZWZhdWx0UHJvcHMgPSB7fTtcblNlYXJjaERyb3BEb3duLnByb3BUeXBlcyA9IHtcbiAgICBvcHRzOiBvcHRzUHJvcFR5cGUsXG4gICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgaW5wdXRWYWx1ZTogJycsXG4gICAgaXNEcm9wRG93bk9wZW46IGZhbHNlLFxuICAgIHN1Ym1pdFZhbHVlOiBudWxsLFxufTtcblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaEJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG4gICAgICAgIHRoaXMuc3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gICAgICAgIHRoaXMuaW5wdXRSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVEcm9wRG93biA9ICh7bGFiZWwsIHZhbHVlLCB0eXBlfSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maXJlT25TZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZmlyZSh7IHZhbHVlLCB0eXBlIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlOiBsYWJlbCxcbiAgICAgICAgICAgICAgICBpc0Ryb3BEb3duT3BlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3VibWl0VmFsdWU6IHt2YWx1ZSwgdHlwZX0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vdGhpcyBpcyBub3Qgd29ya2luZyB1c2UgZGlydHkgZml4Li4uXG4gICAgICAgICAgICAvL3RoaXMuaW5wdXRSZWYuY3VycmVudC5mb2N1cygpO1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1iYXItd3JhcHBlciBpbnB1dC5mb3JtLWNvbnRyb2xcIik7XG4gICAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGhhbmRsZUlucHV0ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lucHV0VmFsdWUsIGlzRHJvcERvd25PcGVuOiBCb29sZWFuKGlucHV0VmFsdWUpfSk7XG4gICAgfTtcblxuICAgIGNsZWFyU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoaW5pdGlhbFN0YXRlKTtcbiAgICB9XG5cbiAgICBmaXJlKHZhbCkge1xuICAgICAgICB0aGlzLnByb3BzLnNldFByb3BzKHt2YWx1ZTogdmFsfSk7XG4gICAgICAgIHRoaXMuY2xlYXJTdGF0ZSgpO1xuICAgIH1cblxuICAgIGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJtaXRWYWx1ZSA9IHRoaXMuc3RhdGUuc3VibWl0VmFsdWU7XG4gICAgICAgICAgICBpZiAoc3VibWl0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoc3VibWl0VmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7aWQsIGNsYXNzTmFtZSwgb3B0c30gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7aXNEcm9wRG93bk9wZW4sIGlucHV0VmFsdWV9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0T3B0cyA9IGlucHV0VmFsdWUgPyBvcHRzLmZpbHRlcigob3B0KSA9PlxuICAgICAgICAgICAgb3B0LmxhYmVsLnN0YXJ0c1dpdGgoaW5wdXRWYWx1ZSlcbiAgICAgICAgKS5zbGljZSgwLCAxMDApIDogW107XG5cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ3NlYXJjaC1iYXItd3JhcHBlcicsIGNsYXNzTmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPElucHV0R3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtzZWFyY2hJY29ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZj17dGhpcy5pbnB1dFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0fVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJzcGVjaWFsaXTDqSwgc3Vic3RhbmNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTdWJtaXR9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9JbnB1dEdyb3VwPlxuICAgICAgICAgICAgICAgIDxTZWFyY2hEcm9wRG93blxuICAgICAgICAgICAgICAgICAgICBpc09wZW49e2lzRHJvcERvd25PcGVufVxuICAgICAgICAgICAgICAgICAgICBvcHRzPXtzZWxlY3RPcHRzfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5oYW5kbGVEcm9wRG93bn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5TZWFyY2hCYXIuZGVmYXVsdFByb3BzID0ge1xuICAgIG9wdHM6IFtdLFxufTtcblxuU2VhcmNoQmFyLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIG9wdHM6IG9wdHNQcm9wVHlwZSxcblxuICAgIHZhbHVlOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLm51bWJlcl0pLFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pLFxuXG4gICAgZmlyZU9uU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9