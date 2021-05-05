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

    _defineProperty(_assertThisInitialized(_this3), "state", {
      inputValue: '',
      isDropDownOpen: false,
      submitValue: null
    });

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
      console.log(event.key);
    });

    return _this3;
  }

  _createClass(SearchBar, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          id = _this$props2.id,
          className = _this$props2.className,
          opts = _this$props2.opts;
      var _this$state = this.state,
          isDropDownOpen = _this$state.isDropDownOpen,
          inputValue = _this$state.inputValue;
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
        opts: opts,
        onSelect: this.handleDropDown
      }));
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
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  opts: optsPropType
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1NlYXJjaEJhci5yZWFjdC5qcyJdLCJuYW1lcyI6WyJvcHRzUHJvcFR5cGUiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwib2JqZWN0T2YiLCJsYWJlbCIsInN0cmluZyIsInZhbHVlIiwiYW55IiwidHlwZSIsIlNlYXJjaERyb3BEb3duIiwicHJvcHMiLCJvblNlbGVjdCIsIm9wdHMiLCJpc09wZW4iLCJkaXNwbGF5IiwibWFwIiwib3B0IiwiYnVpbGRJdGVtIiwiQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiZnVuYyIsImJvb2wiLCJTZWFyY2hCYXIiLCJpbnB1dFZhbHVlIiwiaXNEcm9wRG93bk9wZW4iLCJzdWJtaXRWYWx1ZSIsInNldFN0YXRlIiwiZXZlbnQiLCJ0YXJnZXQiLCJCb29sZWFuIiwiY29uc29sZSIsImxvZyIsImtleSIsImlkIiwiY2xhc3NOYW1lIiwic3RhdGUiLCJjbGFzc05hbWVzIiwic2VhcmNoSWNvbiIsImhhbmRsZUlucHV0IiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlRHJvcERvd24iLCJzZXRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0MsaURBQVMsQ0FBQ0MsT0FBVixDQUNqQkQsaURBQVMsQ0FBQ0UsUUFBVixDQUFtQjtBQUNmQyxPQUFLLEVBQUVILGlEQUFTLENBQUNJLE1BREY7QUFFZkMsT0FBSyxFQUFFTCxpREFBUyxDQUFDTSxHQUZGO0FBR2ZDLE1BQUksRUFBRVAsaURBQVMsQ0FBQ0k7QUFIRCxDQUFuQixDQURpQixDQUFyQjs7SUFRTUksYzs7Ozs7QUFDRiwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDZCQUNUQSxLQURTO0FB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LG9CQUFELEVBQXVCRixTQUF2QjtBQUZ6QixzQkFJSSwyREFBQyxxREFBRCxxQkFDSTtBQUFLLFdBQUcsRUFBRUcsd0RBQVVBO0FBQXBCLFFBREosZUFFSSwyREFBQyxnREFBRDtBQUNJLGdCQUFRLEVBQUUsS0FBS0MsV0FEbkI7QUFFSSxtQkFBVyxFQUFDLDBCQUZoQjtBQUdJLGFBQUssRUFBRWYsVUFIWDtBQUlJLGtCQUFVLEVBQUUsS0FBS2dCO0FBSnJCLFFBRkosQ0FKSixlQWFJLDJEQUFDLGNBQUQ7QUFDSSxjQUFNLEVBQUVmLGNBRFo7QUFFSSxZQUFJLEVBQUViLElBRlY7QUFHSSxnQkFBUSxFQUFFLEtBQUs2QjtBQUhuQixRQWJKLENBREo7QUFxQkg7Ozs7RUFqRGtDdkIsK0M7OztBQW9EdkNLLFNBQVMsQ0FBQ0osWUFBVixHQUF5QixFQUF6QjtBQUVBSSxTQUFTLENBQUNILFNBQVYsR0FBc0I7QUFDbEI7QUFDSjtBQUNBO0FBQ0ljLElBQUUsRUFBRWpDLGlEQUFTLENBQUNJLE1BSkk7O0FBTWxCO0FBQ0o7QUFDQTtBQUNBO0FBQ0lxQyxVQUFRLEVBQUV6QyxpREFBUyxDQUFDb0IsSUFWRjtBQVlsQlQsTUFBSSxFQUFFWjtBQVpZLENBQXRCLEMiLCJmaWxlIjoiZGE2YzM5MS1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge0lucHV0R3JvdXAsIElucHV0fSBmcm9tICdyZWFjdHN0cmFwJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgJy4vc2VhcmNoX2Jhci5jc3MnO1xuaW1wb3J0IHNlYXJjaEljb24gZnJvbSAnLi9zZWFyY2hfaWNvbi5zdmcnO1xuXG5jb25zdCBvcHRzUHJvcFR5cGUgPSBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICBQcm9wVHlwZXMub2JqZWN0T2Yoe1xuICAgICAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdmFsdWU6IFByb3BUeXBlcy5hbnksXG4gICAgICAgIHR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSlcbik7XG5cbmNsYXNzIFNlYXJjaERyb3BEb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgfVxuXG4gICAgYnVpbGRJdGVtKGxhYmVsLCB2YWx1ZSwgdHlwZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25TZWxlY3Qoe2xhYmVsLCB2YWx1ZSwgdHlwZX0pfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNlYXJjaC1kcm9wZG93bi1pdGVtXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1kcm9wZG93bi1pdGVtLWxhYmVsXCI+e2xhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLWl0ZW0tY2FwdGlvblwiPnt0eXBlfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7b3B0cywgaXNPcGVufSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2VhcmNoLWRyb3Bkb3duLW1lbnVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogaXNPcGVuID8gdHJ1ZSA6ICdub25lJ319XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge29wdHMubWFwKChvcHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRJdGVtKG9wdC5sYWJlbCwgb3B0LnZhbHVlLCBvcHQudHlwZSk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblNlYXJjaERyb3BEb3duLmRlZmF1bHRQcm9wcyA9IHt9O1xuU2VhcmNoRHJvcERvd24ucHJvcFR5cGVzID0ge1xuICAgIG9wdHM6IG9wdHNQcm9wVHlwZSxcbiAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbn07XG5cbi8qKlxuICogRXhhbXBsZUNvbXBvbmVudCBpcyBhbiBleGFtcGxlIGNvbXBvbmVudC5cbiAqIEl0IHRha2VzIGEgcHJvcGVydHksIGBsYWJlbGAsIGFuZFxuICogZGlzcGxheXMgaXQuXG4gKiBJdCByZW5kZXJzIGFuIGlucHV0IHdpdGggdGhlIHByb3BlcnR5IGB2YWx1ZWBcbiAqIHdoaWNoIGlzIGVkaXRhYmxlIGJ5IHRoZSB1c2VyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hCYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRlID0ge1xuICAgICAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICAgICAgaXNEcm9wRG93bk9wZW46IGZhbHNlLFxuICAgICAgICBzdWJtaXRWYWx1ZTogbnVsbCxcbiAgICB9O1xuXG4gICAgaGFuZGxlRHJvcERvd24gPSAoe2xhYmVsLCB2YWx1ZSwgdHlwZX0pID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFZhbHVlOiBsYWJlbCxcbiAgICAgICAgICAgIGlzRHJvcERvd25PcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Ym1pdFZhbHVlOiB7dmFsdWUsIHR5cGV9LFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlSW5wdXQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW5wdXRWYWx1ZSwgaXNEcm9wRG93bk9wZW46IEJvb2xlYW4oaW5wdXRWYWx1ZSl9KTtcbiAgICB9O1xuXG4gICAgaGFuZGxlU3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmtleSk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge2lkLCBjbGFzc05hbWUsIG9wdHN9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3Qge2lzRHJvcERvd25PcGVuLCBpbnB1dFZhbHVlfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdzZWFyY2gtYmFyLXdyYXBwZXInLCBjbGFzc05hbWUpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxJbnB1dEdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17c2VhcmNoSWNvbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwic3BlY2lhbGl0w6ksIHN1YnN0YW5jZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU3VibWl0fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvSW5wdXRHcm91cD5cbiAgICAgICAgICAgICAgICA8U2VhcmNoRHJvcERvd25cbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuPXtpc0Ryb3BEb3duT3Blbn1cbiAgICAgICAgICAgICAgICAgICAgb3B0cz17b3B0c31cbiAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMuaGFuZGxlRHJvcERvd259XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuU2VhcmNoQmFyLmRlZmF1bHRQcm9wcyA9IHt9O1xuXG5TZWFyY2hCYXIucHJvcFR5cGVzID0ge1xuICAgIC8qKlxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogRGFzaC1hc3NpZ25lZCBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBjYWxsZWQgdG8gcmVwb3J0IHByb3BlcnR5IGNoYW5nZXNcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXG4gICAgICovXG4gICAgc2V0UHJvcHM6IFByb3BUeXBlcy5mdW5jLFxuXG4gICAgb3B0czogb3B0c1Byb3BUeXBlLFxufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=