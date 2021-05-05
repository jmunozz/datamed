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







var optsPropType = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.objectOf({
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
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          opts = _this$props.opts,
          isOpen = _this$props.isOpen;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "search-dropdown-menu",
        style: {
          display: isOpen ? true : 'none'
        }
      }, opts.map(function (opt) {
        return _this2.buildItem(opt.label, opt.value, opt.type);
      }));
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

  function SearchBar() {
    var _this3;

    _classCallCheck(this, SearchBar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _super2.call.apply(_super2, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this3), "state", initialState);

    _defineProperty(_assertThisInitialized(_this3), "handleDropDown", function (_ref) {
      var label = _ref.label,
          value = _ref.value,
          type = _ref.type;

      _this3.setState({
        inputValue: label,
        isDropDownOpen: false,
        submitValue: {
          value: value,
          type: type
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this3), "handleInput", function (event) {
      var inputValue = event.target.value;

      _this3.setState({
        inputValue: inputValue,
        isDropDownOpen: Boolean(inputValue)
      });
    });

    _defineProperty(_assertThisInitialized(_this3), "handleSubmit", function (event) {
      var submitValue = _this3.state.submitValue;

      if (event.key === 'Enter' && Boolean(submitValue)) {
        _this3.props.setProps({
          search_value: submitValue
        });

        _this3.clearState();
      }
    });

    return _this3;
  }

  _createClass(SearchBar, [{
    key: "clearState",
    value: function clearState() {
      this.setState(initialState);
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
      var selectOpts = opts.filter(function (opt) {
        return opt.label.startsWith(inputValue);
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id,
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('search-bar-wrapper', className)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["InputGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: _search_icon_svg__WEBPACK_IMPORTED_MODULE_5__["default"]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(reactstrap__WEBPACK_IMPORTED_MODULE_2__["Input"], {
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
  opts: optsPropType
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1NlYXJjaEJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJvcHRzUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwib2JqZWN0T2YiLCJsYWJlbCIsInN0cmluZyIsInZhbHVlIiwiYW55IiwidHlwZSIsIlNlYXJjaERyb3BEb3duIiwicHJvcHMiLCJvblNlbGVjdCIsIm9wdHMiLCJpc09wZW4iLCJkaXNwbGF5IiwibWFwIiwib3B0IiwiYnVpbGRJdGVtIiwiQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiZnVuYyIsImJvb2wiLCJpbml0aWFsU3RhdGUiLCJpbnB1dFZhbHVlIiwiaXNEcm9wRG93bk9wZW4iLCJzdWJtaXRWYWx1ZSIsIlNlYXJjaEJhciIsInNldFN0YXRlIiwiZXZlbnQiLCJ0YXJnZXQiLCJCb29sZWFuIiwic3RhdGUiLCJrZXkiLCJzZXRQcm9wcyIsInNlYXJjaF92YWx1ZSIsImNsZWFyU3RhdGUiLCJpZCIsImNsYXNzTmFtZSIsInNlbGVjdE9wdHMiLCJmaWx0ZXIiLCJzdGFydHNXaXRoIiwiY2xhc3NOYW1lcyIsInNlYXJjaEljb24iLCJoYW5kbGVJbnB1dCIsImhhbmRsZVN1Ym1pdCIsImhhbmRsZURyb3BEb3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQyxpREFBUyxDQUFDQyxPQUFWLENBQ2pCRCxpREFBUyxDQUFDRSxRQUFWLENBQW1CO0FBQ2ZDLE9BQUssRUFBRUgsaURBQVMsQ0FBQ0ksTUFERjtBQUVmQyxPQUFLLEVBQUVMLGlEQUFTLENBQUNNLEdBRkY7QUFHZkMsTUFBSSxFQUFFUCxpREFBUyxDQUFDSTtBQUhELENBQW5CLENBRGlCLENBQXJC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QU1sQjtBQUNKO0FBQ0E7QUFDQTtBQUNJNkIsVUFBUSxFQUFFakMsaURBQVMsQ0FBQ29CLElBVkY7QUFZbEJULE1BQUksRUFBRVo7QUFaWSxDQUF0QixDIiwiZmlsZSI6IjE2NmEzYTMtbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtJbnB1dEdyb3VwLCBJbnB1dH0gZnJvbSAncmVhY3RzdHJhcCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0ICcuL3NlYXJjaF9iYXIuY3NzJztcbmltcG9ydCBzZWFyY2hJY29uIGZyb20gJy4vc2VhcmNoX2ljb24uc3ZnJztcblxuY29uc3Qgb3B0c1Byb3BUeXBlID0gUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgUHJvcFR5cGVzLm9iamVjdE9mKHtcbiAgICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMuYW55LFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pXG4pO1xuXG5jbGFzcyBTZWFyY2hEcm9wRG93biBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgIH1cblxuICAgIGJ1aWxkSXRlbShsYWJlbCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uU2VsZWN0KHtsYWJlbCwgdmFsdWUsIHR5cGV9KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbS1sYWJlbFwiPntsYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1kcm9wZG93bi1pdGVtLWNhcHRpb25cIj57dHlwZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge29wdHMsIGlzT3Blbn0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlYXJjaC1kcm9wZG93bi1tZW51XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6IGlzT3BlbiA/IHRydWUgOiAnbm9uZSd9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtvcHRzLm1hcCgob3B0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkSXRlbShvcHQubGFiZWwsIG9wdC52YWx1ZSwgb3B0LnR5cGUpO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5TZWFyY2hEcm9wRG93bi5kZWZhdWx0UHJvcHMgPSB7fTtcblNlYXJjaERyb3BEb3duLnByb3BUeXBlcyA9IHtcbiAgICBvcHRzOiBvcHRzUHJvcFR5cGUsXG4gICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG59O1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgaW5wdXRWYWx1ZTogJycsXG4gICAgaXNEcm9wRG93bk9wZW46IGZhbHNlLFxuICAgIHN1Ym1pdFZhbHVlOiBudWxsLFxufTtcblxuLyoqXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxuICogSXQgdGFrZXMgYSBwcm9wZXJ0eSwgYGxhYmVsYCwgYW5kXG4gKiBkaXNwbGF5cyBpdC5cbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxuICogd2hpY2ggaXMgZWRpdGFibGUgYnkgdGhlIHVzZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaEJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gICAgaGFuZGxlRHJvcERvd24gPSAoe2xhYmVsLCB2YWx1ZSwgdHlwZX0pID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFZhbHVlOiBsYWJlbCxcbiAgICAgICAgICAgIGlzRHJvcERvd25PcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Ym1pdFZhbHVlOiB7dmFsdWUsIHR5cGV9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlSW5wdXQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW5wdXRWYWx1ZSwgaXNEcm9wRG93bk9wZW46IEJvb2xlYW4oaW5wdXRWYWx1ZSl9KTtcbiAgICB9O1xuXG4gICAgY2xlYXJTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShpbml0aWFsU3RhdGUpO1xuICAgIH1cblxuICAgIGhhbmRsZVN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJtaXRWYWx1ZSA9IHRoaXMuc3RhdGUuc3VibWl0VmFsdWU7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgJiYgQm9vbGVhbihzdWJtaXRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0UHJvcHMoe3NlYXJjaF92YWx1ZTogc3VibWl0VmFsdWV9KTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge2lkLCBjbGFzc05hbWUsIG9wdHN9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3Qge2lzRHJvcERvd25PcGVuLCBpbnB1dFZhbHVlfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHNlbGVjdE9wdHMgPSBvcHRzLmZpbHRlcigob3B0KSA9PlxuICAgICAgICAgICAgb3B0LmxhYmVsLnN0YXJ0c1dpdGgoaW5wdXRWYWx1ZSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ3NlYXJjaC1iYXItd3JhcHBlcicsIGNsYXNzTmFtZSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPElucHV0R3JvdXA+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtzZWFyY2hJY29ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0fVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJzcGVjaWFsaXTDqSwgc3Vic3RhbmNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTdWJtaXR9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9JbnB1dEdyb3VwPlxuICAgICAgICAgICAgICAgIDxTZWFyY2hEcm9wRG93blxuICAgICAgICAgICAgICAgICAgICBpc09wZW49e2lzRHJvcERvd25PcGVufVxuICAgICAgICAgICAgICAgICAgICBvcHRzPXtzZWxlY3RPcHRzfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5oYW5kbGVEcm9wRG93bn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5TZWFyY2hCYXIuZGVmYXVsdFByb3BzID0ge1xuICAgIG9wdHM6IFtdLFxufTtcblxuU2VhcmNoQmFyLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIG9wdHM6IG9wdHNQcm9wVHlwZSxcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9