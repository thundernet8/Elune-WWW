'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var View = function (_Component) {
  (0, _inherits3.default)(View, _Component);

  function View() {
    (0, _classCallCheck3.default)(this, View);
    return (0, _possibleConstructorReturn3.default)(this, (View.__proto__ || Object.getPrototypeOf(View)).apply(this, arguments));
  }

  (0, _createClass3.default)(View, [{
    key: 'render',
    value: function render() {
      var style = this.props.hasOwnProperty('show') && !this.props.show && {
        display: 'none'
      };

      if (_react2.default.Children.count(this.props.children) > 1) {
        return _react2.default.createElement(this.props.component, {
          style: Object.assign({}, this.props.style, style),
          className: this.props.className
        }, this.props.children);
      } else {
        return _react2.default.cloneElement(this.props.children, {
          style: Object.assign({}, this.props.children.props.style, style)
        });
      }
    }
  }]);
  return View;
}(_react.Component);

/* eslint-disable */


var _default = View;
exports.default = _default;
View.propTypes = {
  show: _propTypes2.default.any,
  component: _propTypes2.default.string,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object
};
/* eslint-enable */

View.defaultProps = {
  component: 'span'
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(View, 'View', 'libs/view/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'libs/view/index.js');
}();

;