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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactClickOutside = require('react-click-outside');

var _reactClickOutside2 = _interopRequireDefault(_reactClickOutside);

var _libs = require('../../libs');

var _popper = require('../../libs/utils/popper');

var _popper2 = _interopRequireDefault(_popper);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filter = function (_Component) {
  (0, _inherits3.default)(Filter, _Component);

  function Filter(props, context) {
    (0, _classCallCheck3.default)(this, Filter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props, context));

    _this.state = {
      visible: _this.props.visible,
      defaultStyle: {
        position: 'absolute',
        transformOrigin: 'center top 0px',
        zIndex: 2000
      },
      checked: props.defaultCondi ? props.defaultCondi : []
    };
    return _this;
  }

  (0, _createClass3.default)(Filter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var root = this.refs.root;
      var position = this.props.position;
      var style = root.style;


      style.left = position.x - root.offsetWidth + 'px';
      style.top = position.y + 'px';
      var originClassName = root.className;

      root.className = this.classNames(originClassName, 'el-zoom-in-top-enter');

      root.clientHeight; //触发重新计算， 否则动画不会产生
      root.className = this.classNames(originClassName, 'el-zoom-in-top-enter-active');

      this.initPopper();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.initPopper();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.visible != this.props.visible && !nextProps.visible) {
        this.close();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.popperJS) {
        this.popperJS.destroy();
      }
    }
  }, {
    key: 'initPopper',
    value: function initPopper() {
      var visible = this.state.visible;


      if (visible) {
        if (this.popperJS) {
          this.popperJS.update();
        } else {
          this.popperJS = new _popper2.default(this.props.popper, this.refs.root, {
            gpuAcceleration: false
          });
        }
      } else {
        if (this.popperJS) {
          this.popperJS.destroy();
        }

        delete this.popperJS;
      }
    }
  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside(e) {
      var className = e.target.className;
      if (className.indexOf('el-icon-arrow-down') > -1) return;
      this.close();
    }
  }, {
    key: 'close',
    value: function close() {
      var _props = this.props,
          ower = _props.ower,
          onClose = _props.onClose;

      var rootEl = this.refs.root;
      rootEl.className = this.classNames('el-table-filter', 'el-zoom-in-top-leave el-zoom-in-top-leave-active');

      setTimeout(function () {
        _reactDom2.default.unmountComponentAtNode(ower.filterContainer);
      }, 300);
      onClose && onClose();
    }
  }, {
    key: 'onFilterChange',
    value: function onFilterChange(checkedValues) {
      this.setState({
        checked: checkedValues
      });
    }
  }, {
    key: 'filterAction',
    value: function filterAction() {
      var onFilter = this.props.onFilter;
      var checked = this.state.checked;


      onFilter && onFilter(checked);
      this.close();
    }
  }, {
    key: 'resetFilter',
    value: function resetFilter() {
      var onFilter = this.props.onFilter;


      this.setState({
        checked: []
      });

      onFilter && onFilter([]);
      this.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          filters = _props2.filters,
          defaultCondi = _props2.defaultCondi;
      var _state = this.state,
          defaultStyle = _state.defaultStyle,
          checked = _state.checked;


      return _react2.default.createElement(
        'div',
        {
          ref: 'root',
          className: this.classNames('el-table-filter'),
          style: defaultStyle },
        _react2.default.createElement(
          'div',
          { className: 'el-table-filter__content' },
          _react2.default.createElement(
            _checkbox2.default.Group,
            {
              value: defaultCondi ? defaultCondi : checked,
              onChange: function onChange(opts) {
                _this2.onFilterChange(opts);
              },
              className: 'el-table-filter__checkbox-group' },
            filters.map(function (item, idx) {
              return _react2.default.createElement(_checkbox2.default, {
                key: idx,
                value: item,
                label: item.text });
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'el-table-filter__bottom' },
          _react2.default.createElement(
            'button',
            {
              onClick: function onClick() {
                _this2.filterAction();
              },
              disabled: !checked.length,
              className: !checked.length ? 'is-disabled' : '' },
            '\u7B5B\u9009'
          ),
          _react2.default.createElement(
            'button',
            { onClick: function onClick() {
                _this2.resetFilter();
              } },
            '\u91CD\u7F6E'
          )
        )
      );
    }
  }]);
  return Filter;
}(_libs.Component);

Filter.defaultProps = {
  filters: [],
  onFilter: function onFilter() {}
};

Filter.contextTypes = {
  $owerTable: _libs.PropTypes.object
};

var _default = (0, _reactClickOutside2.default)(Filter);

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Filter, 'Filter', 'src/table/filter.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/table/filter.jsx');
}();

;