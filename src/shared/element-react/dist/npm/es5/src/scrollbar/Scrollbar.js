'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollbar = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _libs = require('../../libs');

var _resizeEvent = require('../../libs/utils/resize-event');

var _scrollbarWidth = require('./scrollbar-width');

var _Bar = require('./Bar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scrollbar = exports.Scrollbar = function (_Component) {
  (0, _inherits3.default)(Scrollbar, _Component);

  function Scrollbar(props) {
    (0, _classCallCheck3.default)(this, Scrollbar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scrollbar.__proto__ || Object.getPrototypeOf(Scrollbar)).call(this, props));

    _this.state = {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
    return _this;
  }

  (0, _createClass3.default)(Scrollbar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.native) return;
      var handler = this.update.bind(this);
      var rafId = requestAnimationFrame(handler);
      this.cleanRAF = function () {
        cancelAnimationFrame(rafId);
      };
      if (!this.props.noresize) {
        (0, _resizeEvent.addResizeListener)(this.refs.resize, handler);
        this.cleanResize = function () {
          (0, _resizeEvent.removeResizeListener)(_this2.refs.resize, handler);
        };
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.cleanRAF();
      this.cleanResize && this.cleanResize();
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      var wrap = this.wrap;
      this.setState({
        moveY: wrap.scrollTop * 100 / wrap.clientHeight,
        moveX: wrap.scrollLeft * 100 / wrap.clientWidth
      });
    }
  }, {
    key: 'update',
    value: function update() {
      var heightPercentage = void 0,
          widthPercentage = void 0;
      var wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;

      var sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
      var sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';

      this.setState({ sizeHeight: sizeHeight, sizeWidth: sizeWidth });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      /* eslint-disable */
      var _props = this.props,
          native = _props.native,
          viewStyle = _props.viewStyle,
          wrapStyle = _props.wrapStyle,
          viewClass = _props.viewClass,
          children = _props.children,
          viewComponent = _props.viewComponent,
          wrapClass = _props.wrapClass,
          noresize = _props.noresize,
          className = _props.className,
          others = (0, _objectWithoutProperties3.default)(_props, ['native', 'viewStyle', 'wrapStyle', 'viewClass', 'children', 'viewComponent', 'wrapClass', 'noresize', 'className']);
      var _state = this.state,
          moveX = _state.moveX,
          moveY = _state.moveY,
          sizeWidth = _state.sizeWidth,
          sizeHeight = _state.sizeHeight;
      /* eslint-enable */

      var style = wrapStyle;
      var gutter = (0, _scrollbarWidth.getScrollBarWidth)();
      if (gutter) {
        var gutterWith = '-' + gutter + 'px';
        if (Array.isArray(wrapStyle)) {
          style = Object.assign.apply(null, [].concat((0, _toConsumableArray3.default)(wrapStyle), [{ marginRight: gutterWith, marginBottom: gutterWith }]));
        } else {
          style = Object.assign({}, wrapStyle, { marginRight: gutterWith, marginBottom: gutterWith });
        }
      }

      var view = _react2.default.createElement(viewComponent, {
        className: this.classNames('el-scrollbar__view', viewClass),
        style: viewStyle,
        ref: 'resize'
      }, children);

      var nodes = void 0;
      if (!native) {
        var wrap = _react2.default.createElement(
          'div',
          { ref: 'wrap',
            key: 0,
            style: style,
            onScroll: this.handleScroll.bind(this),
            className: this.classNames(wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default')
          },
          view
        );
        nodes = [wrap, _react2.default.createElement(_Bar.Bar, { key: 1, move: moveX, size: sizeWidth, getParentWrap: function getParentWrap() {
            return _this3.wrap;
          } }), _react2.default.createElement(_Bar.Bar, { key: 2, move: moveY, size: sizeHeight, getParentWrap: function getParentWrap() {
            return _this3.wrap;
          }, vertical: true })];
      } else {
        nodes = [_react2.default.createElement(
          'div',
          { key: 0, ref: 'wrap', className: this.classNames(wrapClass, 'el-scrollbar__wrap'), style: style },
          view
        )];
      }

      return _react2.default.createElement('div', { className: this.classNames('el-scrollbar', className) }, nodes);
    }
  }, {
    key: 'wrap',
    get: function get() {
      return this.refs.wrap;
    }
  }]);
  return Scrollbar;
}(_libs.Component);

Scrollbar.propTypes = {
  native: _libs.PropTypes.bool,
  wrapStyle: _libs.PropTypes.object,
  wrapClass: _libs.PropTypes.oneOfType([_libs.PropTypes.string, _libs.PropTypes.object]),
  viewClass: _libs.PropTypes.oneOfType([_libs.PropTypes.string, _libs.PropTypes.object]),
  viewStyle: _libs.PropTypes.object,
  className: _libs.PropTypes.string,
  viewComponent: _libs.PropTypes.oneOfType([_libs.PropTypes.string, _libs.PropTypes.element]),
  noresize: _libs.PropTypes.bool
};

Scrollbar.defaultProps = {
  viewComponent: 'div'
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Scrollbar, 'Scrollbar', 'src/scrollbar/Scrollbar.jsx');
}();

;