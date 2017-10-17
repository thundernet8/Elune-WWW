import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _createClass from 'babel-runtime/helpers/createClass';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

import { PropTypes } from '../../../libs';
import Locale from '../../locale';

import { SELECTION_MODES, toDate, prevMonth as _prevMonth, nextMonth as _nextMonth } from '../utils';
import { DateTable } from '../basic';

import { PopperBase } from './PopperBase';

var _prevYear = function _prevYear(date) {
  var d = toDate(date);
  d.setFullYear(date.getFullYear() - 1);
  return d;
};

var _nextYear = function _nextYear(date) {
  var d = toDate(date);
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
      state.minDate = toDate(value[0]);
      state.maxDate = toDate(value[1]);
    }
    if (value[0]) {
      state.date = toDate(value[0]);
    } else {
      state.date = new Date();
    }
  }

  return state;
};

var DateRangePanel = function (_PopperBase) {
  _inherits(DateRangePanel, _PopperBase);

  _createClass(DateRangePanel, null, [{
    key: 'propTypes',
    get: function get() {
      return Object.assign({
        // user picked date value
        /*
        value: null | [Date, null | false]
        */
        value: PropTypes.any,
        // ([value1, value2]|null, isKeepPanel)=>()
        onPick: PropTypes.func.isRequired,
        showTime: PropTypes.bool,
        // Array[{text: String, onClick: (picker)=>()}]
        shortcuts: PropTypes.arrayOf(PropTypes.shape({
          text: PropTypes.string.isRequired,
          // ()=>()
          onClick: PropTypes.func.isRequired
        })),
        // (Date)=>bool, if true, disabled
        disabledDate: PropTypes.func,
        firstDayOfWeek: PropTypes.range(0, 6),
        //()=>HtmlElement
        getPopperRefElement: PropTypes.func,
        popperMixinOption: PropTypes.object
      }, PopperBase.propTypes);
    }
  }]);

  function DateRangePanel(props) {
    _classCallCheck(this, DateRangePanel);

    var _this = _possibleConstructorReturn(this, _PopperBase.call(this, props));

    _this.state = {};
    _this.state = Object.assign(_this.state, mapPropsToState(props));
    return _this;
  }

  DateRangePanel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(mapPropsToState(nextProps));
  };

  DateRangePanel.prototype.handleRangePick = function handleRangePick(_ref, isClose) {
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
  };

  DateRangePanel.prototype.prevYear = function prevYear() {
    var date = this.state.date;

    this.setState({
      date: _prevYear(date)
    });
  };

  DateRangePanel.prototype.nextYear = function nextYear() {
    var date = this.state.date;

    this.setState({
      date: _nextYear(date)
    });
  };

  DateRangePanel.prototype.prevMonth = function prevMonth() {
    this.setState({
      date: _prevMonth(this.state.date)
    });
  };

  DateRangePanel.prototype.nextMonth = function nextMonth() {
    this.setState({
      date: _nextMonth(this.state.date)
    });
  };

  //todo: wired way to do sth like this? try to come up with a better option
  DateRangePanel.prototype.handleChangeRange = function handleChangeRange(_ref2) {
    var endDate = _ref2.endDate;
    var _state = this.state,
        rangeState = _state.rangeState,
        minDate = _state.minDate;

    if (endDate <= minDate) endDate = null;

    rangeState.endDate = endDate;
    this.setState({
      maxDate: endDate
    });
  };

  DateRangePanel.prototype.handleShortcutClick = function handleShortcutClick(shortcut) {
    shortcut.onClick();
  };

  DateRangePanel.prototype.render = function render() {
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

    var t = Locale.t;
    var leftLabel = date.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (date.getMonth() + 1));
    var rightLabel = rightDate.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (rightDate.getMonth() + 1));

    return React.createElement(
      'div',
      {
        ref: 'root',
        className: this.classNames('el-picker-panel el-date-range-picker', {
          'has-sidebar': shortcuts,
          'has-time': showTime
        })
      },
      React.createElement(
        'div',
        { className: 'el-picker-panel__body-wrapper' },
        Array.isArray(shortcuts) && React.createElement(
          'div',
          { className: 'el-picker-panel__sidebar' },
          shortcuts.map(function (e, idx) {
            return React.createElement(
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
        React.createElement(
          'div',
          { className: 'el-picker-panel__body' },
          React.createElement(
            'div',
            { className: 'el-picker-panel__content el-date-range-picker__content is-left' },
            React.createElement(
              'div',
              { className: 'el-date-range-picker__header' },
              React.createElement('button', {
                type: 'button',
                onClick: this.prevYear.bind(this),
                className: 'el-picker-panel__icon-btn el-icon-d-arrow-left' }),
              React.createElement('button', {
                type: 'button',
                onClick: this.prevMonth.bind(this),
                className: 'el-picker-panel__icon-btn el-icon-arrow-left' }),
              React.createElement(
                'div',
                null,
                leftLabel
              )
            ),
            React.createElement(DateTable, {
              selectionMode: SELECTION_MODES.RANGE,
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
          React.createElement(
            'div',
            { className: 'el-picker-panel__content el-date-range-picker__content is-right' },
            React.createElement(
              'div',
              { className: 'el-date-range-picker__header' },
              React.createElement('button', {
                type: 'button',
                onClick: this.nextYear.bind(this),
                className: 'el-picker-panel__icon-btn el-icon-d-arrow-right' }),
              React.createElement('button', {
                type: 'button',
                onClick: this.nextMonth.bind(this),
                className: 'el-picker-panel__icon-btn el-icon-arrow-right' }),
              React.createElement(
                'div',
                null,
                rightLabel
              )
            ),
            React.createElement(DateTable, {
              selectionMode: SELECTION_MODES.RANGE,
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
  };

  _createClass(DateRangePanel, [{
    key: 'rightDate',
    get: function get() {
      return _nextMonth(this.state.date);
    }
  }]);

  return DateRangePanel;
}(PopperBase);

export default DateRangePanel;


DateRangePanel.defaultProps = {};