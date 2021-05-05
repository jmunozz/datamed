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
        console.log("prout");
        var submitValue = _this3.state.submitValue;

        if (Boolean(submitValue)) {
          _this3.props.setProps({
            value: submitValue
          });

          _this3.clearState();
        }
      }
    });

    _this3.state = initialState;
    _this3.inputRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this3;
  }

  _createClass(SearchBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.inputRef.current.focus();
    }
  }, {
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
  })
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1NlYXJjaEJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJvcHRzUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwic2hhcGUiLCJsYWJlbCIsInN0cmluZyIsInZhbHVlIiwiYW55IiwidHlwZSIsIlNlYXJjaERyb3BEb3duIiwicHJvcHMiLCJvblNlbGVjdCIsIm9wdHMiLCJpc09wZW4iLCJpdGVtcyIsImxlbmd0aCIsIm1hcCIsIm9wdCIsImJ1aWxkSXRlbSIsImJ1aWxkTm9SZXN1bHRJdGVtIiwiZGlzcGxheSIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsImZ1bmMiLCJib29sIiwiaW5pdGlhbFN0YXRlIiwiaW5wdXRWYWx1ZSIsImlzRHJvcERvd25PcGVuIiwic3VibWl0VmFsdWUiLCJTZWFyY2hCYXIiLCJzZXRTdGF0ZSIsImlucHV0IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZm9jdXMiLCJldmVudCIsInRhcmdldCIsIkJvb2xlYW4iLCJrZXkiLCJjb25zb2xlIiwibG9nIiwic3RhdGUiLCJzZXRQcm9wcyIsImNsZWFyU3RhdGUiLCJpbnB1dFJlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiY3VycmVudCIsImlkIiwiY2xhc3NOYW1lIiwic2VsZWN0T3B0cyIsImZpbHRlciIsInN0YXJ0c1dpdGgiLCJjbGFzc05hbWVzIiwic2VhcmNoSWNvbiIsImhhbmRsZUlucHV0IiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlRHJvcERvd24iLCJvbmVPZlR5cGUiLCJudW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdDLGlEQUFTLENBQUNDLE9BQVYsQ0FDakJELGlE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RFk7QUFFbkJwRCxRQUFJLEVBQUVQLGlEQUFTLENBQUNJO0FBRkcsR0FBaEI7QUFkVyxDQUF0QixDIiwiZmlsZSI6IjVhMWYxMTUtbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtJbnB1dEdyb3VwLCBJbnB1dH0gZnJvbSAncmVhY3RzdHJhcCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0ICcuL3NlYXJjaF9iYXIuY3NzJztcbmltcG9ydCBzZWFyY2hJY29uIGZyb20gJy4vc2VhcmNoX2ljb24uc3ZnJztcblxuY29uc3Qgb3B0c1Byb3BUeXBlID0gUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMuYW55LFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIH0pXG4pO1xuXG5jbGFzcyBTZWFyY2hEcm9wRG93biBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgIH1cblxuICAgIGJ1aWxkSXRlbShsYWJlbCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uU2VsZWN0KHtsYWJlbCwgdmFsdWUsIHR5cGV9KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbS1sYWJlbFwiPntsYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1kcm9wZG93bi1pdGVtLWNhcHRpb25cIj57dHlwZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGJ1aWxkTm9SZXN1bHRJdGVtKCkge1xuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24taXRlbVwiPlBhcyBkZSByw6lzdWx0YXQ8L2Rpdj47XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7b3B0cywgaXNPcGVufSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gb3B0cy5sZW5ndGhcbiAgICAgICAgICAgID8gb3B0cy5tYXAoKG9wdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRJdGVtKG9wdC5sYWJlbCwgb3B0LnZhbHVlLCBvcHQudHlwZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA6IHRoaXMuYnVpbGROb1Jlc3VsdEl0ZW0oKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzZWFyY2gtZHJvcGRvd24tbWVudVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiBpc09wZW4gPyB0cnVlIDogJ25vbmUnfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aXRlbXN9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblNlYXJjaERyb3BEb3duLmRlZmF1bHRQcm9wcyA9IHt9O1xuU2VhcmNoRHJvcERvd24ucHJvcFR5cGVzID0ge1xuICAgIG9wdHM6IG9wdHNQcm9wVHlwZSxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbn07XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICBpc0Ryb3BEb3duT3BlbjogZmFsc2UsXG4gICAgc3VibWl0VmFsdWU6IG51bGwsXG59O1xuXG4vKipcbiAqIEV4YW1wbGVDb21wb25lbnQgaXMgYW4gZXhhbXBsZSBjb21wb25lbnQuXG4gKiBJdCB0YWtlcyBhIHByb3BlcnR5LCBgbGFiZWxgLCBhbmRcbiAqIGRpc3BsYXlzIGl0LlxuICogSXQgcmVuZGVycyBhbiBpbnB1dCB3aXRoIHRoZSBwcm9wZXJ0eSBgdmFsdWVgXG4gKiB3aGljaCBpcyBlZGl0YWJsZSBieSB0aGUgdXNlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcbiAgICAgICAgdGhpcy5zdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgICAgICAgdGhpcy5pbnB1dFJlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgICAgIHRoaXMuaW5wdXRSZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIGhhbmRsZURyb3BEb3duID0gKHtsYWJlbCwgdmFsdWUsIHR5cGV9KSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRWYWx1ZTogbGFiZWwsXG4gICAgICAgICAgICBpc0Ryb3BEb3duT3BlbjogZmFsc2UsXG4gICAgICAgICAgICBzdWJtaXRWYWx1ZToge3ZhbHVlLCB0eXBlfSxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vdGhpcyBpcyBub3Qgd29ya2luZyB1c2UgZGlydHkgZml4Li4uXG4gICAgICAgIC8vdGhpcy5pbnB1dFJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2gtYmFyLXdyYXBwZXIgaW5wdXQuZm9ybS1jb250cm9sXCIpO1xuICAgICAgICBpbnB1dC5mb2N1cygpOyAgXG4gICAgfTtcblxuICAgIGhhbmRsZUlucHV0ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lucHV0VmFsdWUsIGlzRHJvcERvd25PcGVuOiBCb29sZWFuKGlucHV0VmFsdWUpfSk7XG4gICAgfTtcblxuICAgIGNsZWFyU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoaW5pdGlhbFN0YXRlKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm91dFwiKVxuICAgICAgICAgICAgY29uc3Qgc3VibWl0VmFsdWUgPSB0aGlzLnN0YXRlLnN1Ym1pdFZhbHVlO1xuICAgICAgICAgICAgaWYgKEJvb2xlYW4oc3VibWl0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRQcm9wcyh7dmFsdWU6IHN1Ym1pdFZhbHVlfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7aWQsIGNsYXNzTmFtZSwgb3B0c30gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7aXNEcm9wRG93bk9wZW4sIGlucHV0VmFsdWV9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgY29uc3Qgc2VsZWN0T3B0cyA9IG9wdHMuZmlsdGVyKChvcHQpID0+XG4gICAgICAgICAgICBvcHQubGFiZWwuc3RhcnRzV2l0aChpbnB1dFZhbHVlKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnc2VhcmNoLWJhci13cmFwcGVyJywgY2xhc3NOYW1lKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SW5wdXRHcm91cD5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e3NlYXJjaEljb259IC8+XG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmPXt0aGlzLmlucHV0UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlSW5wdXR9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInNwZWNpYWxpdMOpLCBzdWJzdGFuY2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2lucHV0VmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVN1Ym1pdH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0lucHV0R3JvdXA+XG4gICAgICAgICAgICAgICAgPFNlYXJjaERyb3BEb3duXG4gICAgICAgICAgICAgICAgICAgIGlzT3Blbj17aXNEcm9wRG93bk9wZW59XG4gICAgICAgICAgICAgICAgICAgIG9wdHM9e3NlbGVjdE9wdHN9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLmhhbmRsZURyb3BEb3dufVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblNlYXJjaEJhci5kZWZhdWx0UHJvcHMgPSB7XG4gICAgb3B0czogW10sXG59O1xuXG5TZWFyY2hCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogRGFzaC1hc3NpZ25lZCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgdG8gcmVwb3J0IHByb3BlcnR5IGNoYW5nZXNcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0UHJvcHM6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgb3B0czogb3B0c1Byb3BUeXBlLFxuXG4gICAgdmFsdWU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMubnVtYmVyXSksXG4gICAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSksXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==