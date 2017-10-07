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

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Transition = function (_Component) {
  (0, _inherits3.default)(Transition, _Component);

  function Transition() {
    (0, _classCallCheck3.default)(this, Transition);
    return (0, _possibleConstructorReturn3.default)(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).apply(this, arguments));
  }

  (0, _createClass3.default)(Transition, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_CSSTransitionGroup2.default, {
        transitionName: this.props.name,
        transitionEnterTimeout: Number(this.props.duration),
        transitionLeaveTimeout: Number(this.props.duration),
        component: this.props.component,
        className: this.props.className,
        style: this.props.style
      }, this.props.children);
    }
  }]);
  return Transition;
}(_react.Component);

var _default = Transition;
exports.default = _default;


Transition.propTypes = {
  name: _propTypes2.default.string.isRequired,
  duration: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  component: _propTypes2.default.string,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object
};

Transition.defaultProps = {
  duration: 300
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Transition, 'Transition', 'libs/transition/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'libs/transition/index.js');
}();

;