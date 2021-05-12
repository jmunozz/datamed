webpackHotUpdatedatamed_custom_components("main",{

/***/ "./src/lib/components/Treemap.react.js":
/*!*********************************************!*\
  !*** ./src/lib/components/Treemap.react.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Treemap; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _treemap_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./treemap.css */ "./src/lib/components/treemap.css");
/* harmony import */ var _treemap_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_treemap_css__WEBPACK_IMPORTED_MODULE_3__);




/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */

function Treemap(_ref) {
  var data = _ref.data,
      width = _ref.width,
      height = _ref.height;
  var svgRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(null);

  function renderTreemap() {
    var svg = d3__WEBPACK_IMPORTED_MODULE_2__["select"](svgRef.current);
    svg.attr('width', width).attr('height', height);
    var root = d3__WEBPACK_IMPORTED_MODULE_2__["hierarchy"](data).sum(function (d) {
      return d.value;
    }).sort(function (a, b) {
      return b.value - a.value;
    });
    var treemapRoot = d3__WEBPACK_IMPORTED_MODULE_2__["treemap"]().size([width, height]).padding(1)(root);
    console.log(treemapRoot.leaves());
    var nodes = svg.selectAll('g').data(treemapRoot.leaves()).join('g').attr('transform', function (d) {
      return "translate(".concat(d.x0, ",").concat(d.y0, ")");
    });

    var fader = function fader(color) {
      return d3__WEBPACK_IMPORTED_MODULE_2__["interpolateRgb"](color, '#fff')(0.3);
    };

    var colorScale = d3__WEBPACK_IMPORTED_MODULE_2__["scaleOrdinal"](d3__WEBPACK_IMPORTED_MODULE_2__["schemeCategory10"].map(fader));
    nodes.append('rect').attr('width', function (d) {
      return d.x1 - d.x0;
    }).attr('height', function (d) {
      return d.y1 - d.y0;
    }).attr('fill', function (d) {
      return colorScale(d.data.category);
    });
  }

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    renderTreemap();
  }, [data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", {
    ref: svgRef
  }));
}
Treemap.defaultProps = {};
Treemap.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  data: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.any,
  width: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  height: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRhbWVkX2N1c3RvbV9jb21wb25lbnRzLy4vc3JjL2xpYi9jb21wb25lbnRzL1RyZWVtYXAucmVhY3QuanMiXSwibmFtZXMiOlsiVHJlZW1hcCIsImRhdGEiLCJ3aWR0aCIsImhlaWdodCIsInN2Z1JlZiIsInVzZVJlZiIsInJlbmRlclRyZWVtYXAiLCJzdmciLCJkMyIsImN1cnJlbnQiLCJhdHRyIiwicm9vdCIsInN1bSIsImQiLCJ2YWx1ZSIsInNvcnQiLCJhIiwiYiIsInRyZWVtYXBSb290Iiwic2l6ZSIsInBhZGRpbmciLCJjb25zb2xlIiwibG9nIiwibGVhdmVzIiwibm9kZXMiLCJzZWxlY3RBbGwiLCJqb2luIiwieDAiLCJ5MCIsImZhZGVyIiwiY29sb3IiLCJjb2xvclNjYWxlIiwibWFwIiwiYXBwZW5kIiwieDEiLCJ5MSIsImNhdGVnb3J5IiwidXNlRWZmZWN0IiwiZGVmYXVsdFByb3BzIiwicHJvcFR5cGVzIiwiaWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJzZXRQcm9wcyIsImZ1bmMiLCJhbnkiLCJudW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNlLFNBQVNBLE9BQVQsT0FBMEM7QUFBQSxNQUF2QkMsSUFBdUIsUUFBdkJBLElBQXVCO0FBQUEsTUFBakJDLEtBQWlCLFFBQWpCQSxLQUFpQjtBQUFBLE1BQVZDLE1BQVUsUUFBVkEsTUFBVTtBQUN2RCxNQUFNQyxNQUFNLEdBQUdDLG9EQUFNLENBQUMsSUFBRCxDQUFyQjs7QUFFQSxXQUFTQyxhQUFULEdBQXlCO0FBQ3ZCLFFBQU1DLEdBQUcsR0FBR0MseUNBQUEsQ0FBVUosTUFBTSxDQUFDSyxPQUFqQixDQUFaO0FBRUFGLE9BQUcsQ0FBQ0csSUFBSixDQUFTLE9BQVQsRUFBa0JSLEtBQWxCLEVBQXlCUSxJQUF6QixDQUE4QixRQUE5QixFQUF3Q1AsTUFBeEM7QUFFQSxRQUFNUSxJQUFJLEdBQUdILDRDQUFBLENBQ0FQLElBREEsRUFFVlcsR0FGVSxDQUVOLFVBQUNDLENBQUQ7QUFBQSxhQUFPQSxDQUFDLENBQUNDLEtBQVQ7QUFBQSxLQUZNLEVBR1ZDLElBSFUsQ0FHTCxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFVQSxDQUFDLENBQUNILEtBQUYsR0FBVUUsQ0FBQyxDQUFDRixLQUF0QjtBQUFBLEtBSEssQ0FBYjtBQUtBLFFBQU1JLFdBQVcsR0FBR1YsMENBQUEsR0FBYVcsSUFBYixDQUFrQixDQUFDakIsS0FBRCxFQUFRQyxNQUFSLENBQWxCLEVBQW1DaUIsT0FBbkMsQ0FBMkMsQ0FBM0MsRUFBOENULElBQTlDLENBQXBCO0FBRUFVLFdBQU8sQ0FBQ0MsR0FBUixDQUFZSixXQUFXLENBQUNLLE1BQVosRUFBWjtBQUVBLFFBQU1DLEtBQUssR0FBR2pCLEdBQUcsQ0FDZGtCLFNBRFcsQ0FDRCxHQURDLEVBRVh4QixJQUZXLENBRU5pQixXQUFXLENBQUNLLE1BQVosRUFGTSxFQUdYRyxJQUhXLENBR04sR0FITSxFQUlYaEIsSUFKVyxDQUlOLFdBSk0sRUFJTyxVQUFDRyxDQUFEO0FBQUEsaUNBQW9CQSxDQUFDLENBQUNjLEVBQXRCLGNBQTRCZCxDQUFDLENBQUNlLEVBQTlCO0FBQUEsS0FKUCxDQUFkOztBQU1BLFFBQU1DLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLEtBQUQ7QUFBQSxhQUFXdEIsaURBQUEsQ0FBa0JzQixLQUFsQixFQUF5QixNQUF6QixFQUFpQyxHQUFqQyxDQUFYO0FBQUEsS0FBZDs7QUFDQSxRQUFNQyxVQUFVLEdBQUd2QiwrQ0FBQSxDQUFnQkEsbURBQUEsQ0FBb0J3QixHQUFwQixDQUF3QkgsS0FBeEIsQ0FBaEIsQ0FBbkI7QUFFQUwsU0FBSyxDQUNGUyxNQURILENBQ1UsTUFEVixFQUVHdkIsSUFGSCxDQUVRLE9BRlIsRUFFaUIsVUFBQ0csQ0FBRDtBQUFBLGFBQU9BLENBQUMsQ0FBQ3FCLEVBQUYsR0FBT3JCLENBQUMsQ0FBQ2MsRUFBaEI7QUFBQSxLQUZqQixFQUdHakIsSUFISCxDQUdRLFFBSFIsRUFHa0IsVUFBQ0csQ0FBRDtBQUFBLGFBQU9BLENBQUMsQ0FBQ3NCLEVBQUYsR0FBT3RCLENBQUMsQ0FBQ2UsRUFBaEI7QUFBQSxLQUhsQixFQUlHbEIsSUFKSCxDQUlRLE1BSlIsRUFJZ0IsVUFBQ0csQ0FBRDtBQUFBLGFBQU9rQixVQUFVLENBQUNsQixDQUFDLENBQUNaLElBQUYsQ0FBT21DLFFBQVIsQ0FBakI7QUFBQSxLQUpoQjtBQUtEOztBQUVEQyx5REFBUyxDQUFDLFlBQU07QUFDZC9CLGlCQUFhO0FBQ2QsR0FGUSxFQUVOLENBQUNMLElBQUQsQ0FGTSxDQUFUO0FBSUEsc0JBQ0UscUZBQ0U7QUFBSyxPQUFHLEVBQUVHO0FBQVYsSUFERixDQURGO0FBS0Q7QUFFREosT0FBTyxDQUFDc0MsWUFBUixHQUF1QixFQUF2QjtBQUdBdEMsT0FBTyxDQUFDdUMsU0FBUixHQUFvQjtBQUNoQjtBQUNKO0FBQ0E7QUFDSUMsSUFBRSxFQUFFQyxpREFBUyxDQUFDQyxNQUpFOztBQU1oQjtBQUNKO0FBQ0E7QUFDQTtBQUNJQyxVQUFRLEVBQUVGLGlEQUFTLENBQUNHLElBVko7QUFZaEIzQyxNQUFJLEVBQUV3QyxpREFBUyxDQUFDSSxHQVpBO0FBY2hCM0MsT0FBSyxFQUFFdUMsaURBQVMsQ0FBQ0ssTUFkRDtBQWdCaEIzQyxRQUFNLEVBQUVzQyxpREFBUyxDQUFDSztBQWhCRixDQUFwQixDIiwiZmlsZSI6IjI3YTc2ODctbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcblxuaW1wb3J0ICcuL3RyZWVtYXAuY3NzJztcblxuXG5cbi8qKlxuICogRXhhbXBsZUNvbXBvbmVudCBpcyBhbiBleGFtcGxlIGNvbXBvbmVudC5cbiAqIEl0IHRha2VzIGEgcHJvcGVydHksIGBsYWJlbGAsIGFuZFxuICogZGlzcGxheXMgaXQuXG4gKiBJdCByZW5kZXJzIGFuIGlucHV0IHdpdGggdGhlIHByb3BlcnR5IGB2YWx1ZWBcbiAqIHdoaWNoIGlzIGVkaXRhYmxlIGJ5IHRoZSB1c2VyLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUcmVlbWFwKHsgZGF0YSwgd2lkdGgsIGhlaWdodCB9KSB7XG4gIGNvbnN0IHN2Z1JlZiA9IHVzZVJlZihudWxsKTtcblxuICBmdW5jdGlvbiByZW5kZXJUcmVlbWFwKCkge1xuICAgIGNvbnN0IHN2ZyA9IGQzLnNlbGVjdChzdmdSZWYuY3VycmVudCk7XG5cbiAgICBzdmcuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KTtcblxuICAgIGNvbnN0IHJvb3QgPSBkM1xuICAgICAgLmhpZXJhcmNoeShkYXRhKVxuICAgICAgLnN1bSgoZCkgPT4gZC52YWx1ZSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnZhbHVlIC0gYS52YWx1ZSk7XG5cbiAgICBjb25zdCB0cmVlbWFwUm9vdCA9IGQzLnRyZWVtYXAoKS5zaXplKFt3aWR0aCwgaGVpZ2h0XSkucGFkZGluZygxKShyb290KTtcblxuICAgIGNvbnNvbGUubG9nKHRyZWVtYXBSb290LmxlYXZlcygpKVxuICAgIFxuICAgIGNvbnN0IG5vZGVzID0gc3ZnXG4gICAgICAuc2VsZWN0QWxsKCdnJylcbiAgICAgIC5kYXRhKHRyZWVtYXBSb290LmxlYXZlcygpKVxuICAgICAgLmpvaW4oJ2cnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiBgdHJhbnNsYXRlKCR7ZC54MH0sJHtkLnkwfSlgKTtcblxuICAgIGNvbnN0IGZhZGVyID0gKGNvbG9yKSA9PiBkMy5pbnRlcnBvbGF0ZVJnYihjb2xvciwgJyNmZmYnKSgwLjMpO1xuICAgIGNvbnN0IGNvbG9yU2NhbGUgPSBkMy5zY2FsZU9yZGluYWwoZDMuc2NoZW1lQ2F0ZWdvcnkxMC5tYXAoZmFkZXIpKTtcblxuICAgIG5vZGVzXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiBkLngxIC0gZC54MClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZCkgPT4gZC55MSAtIGQueTApXG4gICAgICAuYXR0cignZmlsbCcsIChkKSA9PiBjb2xvclNjYWxlKGQuZGF0YS5jYXRlZ29yeSkpO1xuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZW5kZXJUcmVlbWFwKCk7XG4gIH0sIFtkYXRhXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPHN2ZyByZWY9e3N2Z1JlZn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuVHJlZW1hcC5kZWZhdWx0UHJvcHMgPSB7XG59O1xuXG5UcmVlbWFwLnByb3BUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgdXNlZCB0byBpZGVudGlmeSB0aGlzIGNvbXBvbmVudCBpbiBEYXNoIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAgICogdG8gRGFzaCwgdG8gbWFrZSB0aGVtIGF2YWlsYWJsZSBmb3IgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgIGRhdGE6IFByb3BUeXBlcy5hbnksXG5cbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcblxuICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlclxuXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==