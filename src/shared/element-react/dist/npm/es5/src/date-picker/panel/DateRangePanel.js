'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libs = require('../../../libs');

var _locale = require('../../locale');

var _locale2 = _interopRequireDefault(_locale);

var _utils = require('../utils');

var _basic = require('../basic');

var _PopperBase2 = require('./PopperBase');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _prevYear = function _prevYear(date) {
  var d = (0, _utils.toDate)(date);
  d.setFullYear(date.getFullYear() - 1);
  return d;
};

var _nextYear = function _nextYear(date) {
  var d = (0, _utils.toDate)(date);
  d.setFullYear(date.getFullYear() + 1);
  return d;
};

var mapPropsToState = function mapPropsToState(props) {
  var value = props.value;

  var state = {
    rangeState: {
      endDate: null,
      selecting: false
    }
  };
  if (!value) {
    state = {
      minDate: null,
      maxDate: null,
      date: new Date()
    };
  } else {
    if (value[0] && value[1]) {
      state.minDate = (0, _utils.toDate)(value[0]);
      state.maxDate = (0, _utils.toDate)(value[1]);
    }
    if (value[0]) {
      state.date = (0, _utils.toDate)(value[0]);
    } else {
      state.date = new Date();
    }
  }

  return state;
};

var DateRangePanel = function (_PopperBase) {
  (0, _inherits3.default)(DateRangePanel, _PopperBase);
  (0, _createClass3.default)(DateRangePanel, null, [{
    key: 'propTypes',
    get: function get() {
      return Object.assign({
        // user picked date value
        /*
        value: null | [Date, null | false]
        */
        value: _libs.PropTypes.any,
        // ([value1, value2]|null, isKeepPanel)=>()
        onPick: _libs.PropTypes.func.isRequired,
        showTime: _libs.PropTypes.bool,
        // Array[{text: String, onClick: (picker)=>()}]
        shortcuts: _libs.PropTypes.arrayOf(_libs.PropTypes.shape({
          text: _libs.PropTypes.string.isRequired,
          // ()=>()
          onClick: _libs.PropTypes.func.isRequired
        })),
        // (Date)=>bool, if true, disabled
        disabledDate: _libs.PropTypes.func,
        firstDayOfWeek: _libs.PropTypes.range(0, 6),
        //()=>HtmlElement
        getPopperRefElement: _libs.PropTypes.func,
        popperMixinOption: _libs.PropTypes.object
      }, _PopperBase2.PopperBase.propTypes);
    }
  }]);

  function DateRangePanel(props) {
    (0, _classCallCheck3.default)(this, DateRangePanel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DateRangePanel.__proto__ || Object.getPrototypeOf(DateRangePanel)).call(this, props));

    _this.state = {};
    _this.state = Object.assign(_this.state, mapPropsToState(props));
    return _this;
  }

  (0, _createClass3.default)(DateRangePanel, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(mapPropsToState(nextProps));
    }
  }, {
    key: 'handleRangePick',
    value: function handleRangePick(_ref, isClose) {
      var minDate = _ref.minDate,
          maxDate = _ref.maxDate;
      var _props = this.props,
          showTime = _props.showTime,
          onPick = _props.onPick;

      this.setState({ minDate: minDate, maxDate: maxDate });
      if (!isClose) return;
      if (!showTime) {
        onPick([minDate, maxDate], false);
      }
    }
  }, {
    key: 'prevYear',
    value: function prevYear() {
      var date = this.state.date;

      this.setState({
        date: _prevYear(date)
      });
    }
  }, {
    key: 'nextYear',
    value: function nextYear() {
      var date = this.state.date;

      this.setState({
        date: _nextYear(date)
      });
    }
  }, {
    key: 'prevMonth',
    value: function prevMonth() {
      this.setState({
        date: (0, _utils.prevMonth)(this.state.date)
      });
    }
  }, {
    key: 'nextMonth',
    value: function nextMonth() {
      this.setState({
        date: (0, _utils.nextMonth)(this.state.date)
      });
    }
  }, {
    key: 'handleChangeRange',


    //todo: wired way to do sth like this? try to come up with a better option
    value: function handleChangeRange(_ref2) {
      var endDate = _ref2.endDate;
      var _state = this.state,
          rangeState = _state.rangeState,
          minDate = _state.minDate;

      if (endDate <= minDate) endDate = null;

      rangeState.endDate = endDate;
      this.setState({
        maxDate: endDate
      });
    }
  }, {
    key: 'handleShortcutClick',
    value: function handleShortcutClick(shortcut) {
      shortcut.onClick();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          shortcuts = _props2.shortcuts,
          showTime = _props2.showTime,
          disabledDate = _props2.disabledDate,
          firstDayOfWeek = _props2.firstDayOfWeek;
      var _state2 = this.state,
          date = _state2.date,
          rangeState = _state2.rangeState,
          minDate = _state2.minDate,
          maxDate = _state2.maxDate;

      var rightDate = this.rightDate;

      var t = _locale2.default.t;
      var leftLabel = date.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (date.getMonth() + 1));
      var rightLabel = rightDate.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (rightDate.getMonth() + 1));

      return _react2.default.createElement(
        'div',
        {
          ref: 'root',
          className: this.classNames('el-picker-panel el-date-range-picker', {
            'has-sidebar': shortcuts,
            'has-time': showTime
          })
        },
        _react2.default.createElement(
          'div',
          { className: 'el-picker-panel__body-wrapper' },
          Array.isArray(shortcuts) && _react2.default.createElement(
            'div',
            { className: 'el-picker-panel__sidebar' },
            shortcuts.map(function (e, idx) {
              return _react2.default.createElement(
                'button',
                {
                  key: idx,
                  type: 'button',
                  className: 'el-picker-panel__shortcut',
                  onClick: function onClick() {
                    return _this2.handleShortcutClick(e);
                  } },
                e.text
              );
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'el-picker-panel__body' },
            _react2.default.createElement(
              'div',
              { className: 'el-picker-panel__content el-date-range-picker__content is-left' },
              _react2.default.createElement(
                'div',
                { className: 'el-date-range-picker__header' },
                _react2.default.createElement('button', {
                  type: 'button',
                  onClick: this.prevYear.bind(this),
                  className: 'el-picker-panel__icon-btn el-icon-d-arrow-left' }),
                _react2.default.createElement('button', {
                  type: 'button',
                  onClick: this.prevMonth.bind(this),
                  className: 'el-picker-panel__icon-btn el-icon-arrow-left' }),
                _react2.default.createElement(
                  'div',
                  null,
                  leftLabel
                )
              ),
              _react2.default.createElement(_basic.DateTable, {
                selectionMode: _utils.SELECTION_MODES.RANGE,
                date: date,
                value: minDate,
                minDate: minDate,
                maxDate: maxDate,
                rangeState: rangeState,
                disabledDate: disabledDate,
                onChangeRange: this.handleChangeRange.bind(this),
                onPick: this.handleRangePick.bind(this),
                firstDayOfWeek: firstDayOfWeek
              })
            ),
            _react2.default.createElement(
              'div',
              { className: 'el-picker-panel__content el-date-range-picker__content is-right' },
              _react2.default.createElement(
                'div',
                { className: 'el-date-range-picker__header' },
                _react2.default.createElement('button', {
                  type: 'button',
                  onClick: this.nextYear.bind(this),
                  className: 'el-picker-panel__icon-btn el-icon-d-arrow-right' }),
                _react2.default.createElement('button', {
                  type: 'button',
                  onClick: this.nextMonth.bind(this),
                  className: 'el-picker-panel__icon-btn el-icon-arrow-right' }),
                _react2.default.createElement(
                  'div',
                  null,
                  rightLabel
                )
              ),
              _react2.default.createElement(_basic.DateTable, {
                selectionMode: _utils.SELECTION_MODES.RANGE,
                date: rightDate,
                value: maxDate,
                minDate: minDate,
                maxDate: maxDate,
                rangeState: rangeState,
                disabledDate: disabledDate,
                onChangeRange: this.handleChangeRange.bind(this),
                onPick: this.handleRangePick.bind(this),
                firstDayOfWeek: firstDayOfWeek
              })
            )
          )
        )
      );
    }
  }, {
    key: 'rightDate',
    get: function get() {
      return (0, _utils.nextMonth)(this.state.date);
    }
  }]);
  return DateRangePanel;
}(_PopperBase2.PopperBase);

var _default = DateRangePanel;
exports.default = _default;


DateRangePanel.defaultProps = {};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_prevYear, 'prevYear', 'src/date-picker/panel/DateRangePanel.jsx');

  __REACT_HOT_LOADER__.register(_nextYear, 'nextYear', 'src/date-picker/panel/DateRangePanel.jsx');

  __REACT_HOT_LOADER__.register(mapPropsToState, 'mapPropsToState', 'src/date-picker/panel/DateRangePanel.jsx');

  __REACT_HOT_LOADER__.register(DateRangePanel, 'DateRangePanel', 'src/date-picker/panel/DateRangePanel.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/date-picker/panel/DateRangePanel.jsx');
}();

;