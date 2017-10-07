import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import enhanceWithClickOutside from 'react-click-outside';
import { Component, PropTypes } from '../../libs';
import Popper from '../../libs/utils/popper';
import Checkbox from '../checkbox';

var Filter = function (_Component) {
  _inherits(Filter, _Component);

  function Filter(props, context) {
    _classCallCheck(this, Filter);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

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

  Filter.prototype.componentDidMount = function componentDidMount() {
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
  };

  Filter.prototype.componentDidUpdate = function componentDidUpdate() {
    this.initPopper();
  };

  Filter.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && !nextProps.visible) {
      this.close();
    }
  };

  Filter.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.popperJS) {
      this.popperJS.destroy();
    }
  };

  Filter.prototype.initPopper = function initPopper() {
    var visible = this.state.visible;


    if (visible) {
      if (this.popperJS) {
        this.popperJS.update();
      } else {
        this.popperJS = new Popper(this.props.popper, this.refs.root, {
          gpuAcceleration: false
        });
      }
    } else {
      if (this.popperJS) {
        this.popperJS.destroy();
      }

      delete this.popperJS;
    }
  };

  Filter.prototype.handleClickOutside = function handleClickOutside(e) {
    var className = e.target.className;
    if (className.indexOf('el-icon-arrow-down') > -1) return;
    this.close();
  };

  Filter.prototype.close = function close() {
    var _props = this.props,
        ower = _props.ower,
        onClose = _props.onClose;

    var rootEl = this.refs.root;
    rootEl.className = this.classNames('el-table-filter', 'el-zoom-in-top-leave el-zoom-in-top-leave-active');

    setTimeout(function () {
      ReactDOM.unmountComponentAtNode(ower.filterContainer);
    }, 300);
    onClose && onClose();
  };

  Filter.prototype.onFilterChange = function onFilterChange(checkedValues) {
    this.setState({
      checked: checkedValues
    });
  };

  Filter.prototype.filterAction = function filterAction() {
    var onFilter = this.props.onFilter;
    var checked = this.state.checked;


    onFilter && onFilter(checked);
    this.close();
  };

  Filter.prototype.resetFilter = function resetFilter() {
    var onFilter = this.props.onFilter;


    this.setState({
      checked: []
    });

    onFilter && onFilter([]);
    this.close();
  };

  Filter.prototype.render = function render() {
    var _this2 = this;

    var _props2 = this.props,
        filters = _props2.filters,
        defaultCondi = _props2.defaultCondi;
    var _state = this.state,
        defaultStyle = _state.defaultStyle,
        checked = _state.checked;


    return React.createElement(
      'div',
      {
        ref: 'root',
        className: this.classNames('el-table-filter'),
        style: defaultStyle },
      React.createElement(
        'div',
        { className: 'el-table-filter__content' },
        React.createElement(
          Checkbox.Group,
          {
            value: defaultCondi ? defaultCondi : checked,
            onChange: function onChange(opts) {
              _this2.onFilterChange(opts);
            },
            className: 'el-table-filter__checkbox-group' },
          filters.map(function (item, idx) {
            return React.createElement(Checkbox, {
              key: idx,
              value: item,
              label: item.text });
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'el-table-filter__bottom' },
        React.createElement(
          'button',
          {
            onClick: function onClick() {
              _this2.filterAction();
            },
            disabled: !checked.length,
            className: !checked.length ? 'is-disabled' : '' },
          '\u7B5B\u9009'
        ),
        React.createElement(
          'button',
          { onClick: function onClick() {
              _this2.resetFilter();
            } },
          '\u91CD\u7F6E'
        )
      )
    );
  };

  return Filter;
}(Component);

Filter.defaultProps = {
  filters: [],
  onFilter: function onFilter() {}
};

Filter.contextTypes = {
  $owerTable: PropTypes.object
};

export default enhanceWithClickOutside(Filter);