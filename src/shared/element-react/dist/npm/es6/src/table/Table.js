import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import { Component, PropTypes } from '../../libs';
import { enhanceColumns, calculateFixedWidth, scheduleLayout as _scheduleLayout } from './mixins';
import { getScrollBarWidth } from './utils';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import i18n from '../locale';

var tableIdSeed = 1;

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table(props, context) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.tableId = tableIdSeed++;

    var _this$props = _this.props,
        columns = _this$props.columns,
        data = _this$props.data;

    var enhCols = enhanceColumns(columns, _this.tableId);

    _this.state = {
      columns: columns, //用户原始columns配置
      _columns: enhCols.columns, //补充后的列配置
      fixedLeftColumns: enhCols.fixedLeftColumns,
      fixedRightColumns: enhCols.fixedRightColumns,
      data: data,
      sortList: null,
      filterList: null,

      bodyWidth: '',
      bodyHeight: '',
      headerHeight: '',
      realTableHeaderHeight: '',
      realTableHeight: '',
      realTableWidth: '',
      resizeProxyVisible: false,

      scrollY: false, //表格竖Y轴是否有滚动条,
      scrollX: false
    };
    return _this;
  }

  Table.prototype.getChildContext = function getChildContext() {
    return {
      $owerTable: this,
      stripe: this.props.stripe
    };
  };

  Table.prototype.componentDidMount = function componentDidMount() {
    this.initLayout();

    var des = {
      get: this._filterContainer.bind(this)
    };
    Object.defineProperty(this, 'filterContainer', des);
  };

  Table.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this._filterContainer instanceof HTMLElement) {
      var body = document.body || document;
      ReactDOM.unmountComponentAtNode(this.filterContainer);
      body.removeChild(this.filterContainer);
    }
  };

  Table.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    if (nextProps.data != this.props.data) {
      this.setState({ data: nextProps.data }, function () {
        _this2.initLayout();
      });
    }

    if (nextProps.height != this.props.height) {
      this.initLayout();
    }
  };

  Table.prototype._filterContainer = function _filterContainer() {
    if (!this._filterCon) {
      this._filterCon = document.createElement('div');
      this._filterCon.style.cssText = "position:absolute;left:0;top:0";
      this._filterCon.id = "__filter__" + Math.random().toString().slice(2);
      var body = document.body || document.createElement('body');
      body.appendChild(this._filterCon);
    }

    return this._filterCon;
  };

  Table.prototype.initLayout = function initLayout() {
    var _this3 = this;

    var _props = this.props,
        height = _props.height,
        fit = _props.fit,
        maxHeight = _props.maxHeight;


    var rootComputedStyle = window.getComputedStyle(this.refs.root);
    var headerComputedStyle = window.getComputedStyle(this.refs.headerWrapper);
    var thisTableWidth = parseFloat(headerComputedStyle.getPropertyValue('width'));
    var realTableHeight = parseFloat(rootComputedStyle.getPropertyValue('height'));
    var bodyWidth = _scheduleLayout(this.state._columns, thisTableWidth, 0, fit).bodyWidth;
    var headerHeight = this.refs.headerWrapper.offsetHeight;
    var bodyHeight = void 0;

    if (height) {
      bodyHeight = height - headerHeight;
    } else if (maxHeight && maxHeight < realTableHeight) {
      //流体布局
      realTableHeight = maxHeight;
      bodyHeight = maxHeight - headerHeight;
    } else {
      bodyHeight = '';
    }

    this.setState({
      bodyWidth: bodyWidth,
      bodyHeight: bodyHeight,
      headerHeight: headerHeight,
      realTableHeaderHeight: headerHeight,
      realTableWidth: thisTableWidth,
      realTableHeight: this.props.height || realTableHeight || ''
    }, function () {
      _this3.adjustScrollState();
    });
  };

  Table.prototype.scheduleLayout = function scheduleLayout() {
    var _this4 = this;

    var _state = this.state,
        _columns = _state._columns,
        realTableWidth = _state.realTableWidth,
        scrollY = _state.scrollY;


    var layout = _scheduleLayout(_columns, realTableWidth, Number(scrollY), this.props.fit);
    this.setState({
      bodyWidth: layout.bodyWidth
    }, function () {
      _this4.onScrollBodyWrapper();
      _this4.adjustScrollState();
    });
  };

  Table.prototype.adjustScrollState = function adjustScrollState() {
    var scrollY = this.refs.mainBody.isScrollY();
    this.setState({
      scrollX: this.refs.mainBody.isScrollX(),
      scrollY: scrollY,
      bodyWidth: _scheduleLayout(this.state._columns, this.state.realTableWidth, scrollY, this.props.fit).bodyWidth
    });
  };

  Table.prototype.getBodyWrapperStyle = function getBodyWrapperStyle() {
    var bodyHeight = this.state.bodyHeight;

    var style = {};

    style.height = bodyHeight;
    return style;
  };

  Table.prototype.onScrollBodyWrapper = function onScrollBodyWrapper() {
    var target = arguments[0] ? arguments[0].target : this.refs.bodyWrapper;
    var headerWrapper = this.refs.headerWrapper;
    var fixedBodyWrapper = this.refs.fixedBodyWrapper;
    var rightFixedBodyWrapper = this.refs.rightFixedBodyWrapper;

    if (target instanceof HTMLDivElement) {
      headerWrapper.scrollLeft = target.scrollLeft;
      fixedBodyWrapper && (fixedBodyWrapper.scrollTop = target.scrollTop);
      rightFixedBodyWrapper && (rightFixedBodyWrapper.scrollTop = target.scrollTop);
    }
  };

  Table.prototype.sortBy = function sortBy(sort, prop, compare) {
    var data = this.state.filterList || this.state.data;
    var sortList = data.slice(0);

    if (sort === 0) {
      this.setState({ sortList: null });
    } else {
      var defaultCompare = function defaultCompare(a, b) {
        if (sort == 2) {
          var t = b;b = a;a = t;
        }
        return a[prop] > b[prop] ? 1 : -1;
      };
      sortList.sort(compare ? compare : defaultCompare);
      this.setState({ sortList: sortList });
    }
  };

  Table.prototype.filterBy = function filterBy(column, filteCondi) {
    var data = this.state.sortList || this.state.data;

    var filterList = data.filter(function (d) {
      var defaultFilterMethod = function defaultFilterMethod(c) {
        return d[column.property] == c.value;
      };
      return !!filteCondi.filter(column.filterMethod || defaultFilterMethod).length;
    });

    this.setState({
      filterList: filteCondi && filteCondi.length ? filterList : data
    });
  };

  Table.prototype.flattenHeaderColumn = function flattenHeaderColumn() {
    var _columns = this.state._columns;

    var headerLevelColumns = [];
    var leafColumns = [];

    var rescurveColumns = function rescurveColumns(list) {
      list.forEach(function (item) {
        headerLevelColumns[item.level] = headerLevelColumns[item.level] || [];
        headerLevelColumns[item.level].push(item);
        if (item.subColumns instanceof Array) {
          rescurveColumns(item.subColumns);
        } else {
          leafColumns.push(item);
        }
      });
    };
    rescurveColumns(_columns);

    return { headerLevelColumns: headerLevelColumns, leafColumns: leafColumns };
  };

  Table.prototype.clearSelection = function clearSelection() {
    this.refs.mainBody.clearSelect();
    this.refs.header.cancelAllChecked();
  };

  Table.prototype.render = function render() {
    var _props2 = this.props,
        fit = _props2.fit,
        stripe = _props2.stripe,
        border = _props2.border,
        highlightCurrentRow = _props2.highlightCurrentRow,
        showSummary = _props2.showSummary,
        sumText = _props2.sumText,
        getSummaries = _props2.getSummaries,
        emptyText = _props2.emptyText;
    var _state2 = this.state,
        bodyWidth = _state2.bodyWidth,
        bodyHeight = _state2.bodyHeight,
        _columns = _state2._columns,
        data = _state2.data,
        fixedLeftColumns = _state2.fixedLeftColumns,
        fixedRightColumns = _state2.fixedRightColumns,
        realTableHeight = _state2.realTableHeight,
        realTableHeaderHeight = _state2.realTableHeaderHeight,
        scrollY = _state2.scrollY,
        scrollX = _state2.scrollX,
        sortList = _state2.sortList,
        filterList = _state2.filterList;


    var rootClassName = this.classNames('el-table', {
      'el-table--enable-row-hover': !fixedLeftColumns.length && !fixedRightColumns.length,
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border
    });

    var scrollYWiddth = scrollX ? getScrollBarWidth() : 0;

    data = filterList || sortList || data;

    var flattenColumns = this.flattenHeaderColumn();
    var leafColumns = flattenColumns.leafColumns;


    return React.createElement(
      'div',
      {
        ref: 'root',
        style: this.style(),
        className: this.className(rootClassName) },
      React.createElement(
        'div',
        {
          ref: 'headerWrapper',
          className: 'el-table__header-wrapper' },
        React.createElement(TableHeader, {
          ref: 'header',
          isScrollY: scrollY,
          style: { width: bodyWidth },
          flattenColumns: flattenColumns,
          columns: _columns })
      ),
      React.createElement(
        'div',
        {
          style: this.getBodyWrapperStyle(),
          className: 'el-table__body-wrapper',
          onScroll: this.onScrollBodyWrapper.bind(this),
          ref: 'bodyWrapper' },
        React.createElement(TableBody, {
          ref: 'mainBody',
          style: { width: bodyWidth },
          rowClassName: this.props.rowClassName,
          columns: _columns,
          flattenColumns: flattenColumns,
          highlightCurrentRow: highlightCurrentRow,
          data: data })
      ),
      !!fixedLeftColumns.length && React.createElement(
        'div',
        {
          className: 'el-table__fixed',
          ref: 'fixedWrapper',
          style: { width: calculateFixedWidth(fixedLeftColumns), height: realTableHeight ? realTableHeight - scrollYWiddth : '' } },
        React.createElement(
          'div',
          { className: 'el-table__fixed-header-wrapper', ref: 'fixedHeaderWrapper' },
          React.createElement(TableHeader, {
            fixed: 'left',
            border: 'border',
            columns: _columns,
            flattenColumns: flattenColumns,
            style: { width: '100%', height: '100%' } })
        ),
        React.createElement(
          'div',
          {
            className: 'el-table__fixed-body-wrapper',
            ref: 'fixedBodyWrapper',
            style: { top: realTableHeaderHeight, height: bodyHeight ? bodyHeight - scrollYWiddth : '' } },
          data && data.length && React.createElement(TableBody, {
            ref: 'fixedLeftBody',
            fixed: 'left',
            rowClassName: this.props.rowClassName,
            columns: _columns,
            data: data,
            flattenColumns: flattenColumns,
            highlightCurrentRow: highlightCurrentRow,
            style: { width: bodyWidth } }),
          (!data || data.length === 0) && React.createElement(
            'div',
            { style: { width: bodyWidth }, className: 'el-table__empty-block' },
            React.createElement(
              'span',
              { className: 'el-table__empty-text' },
              emptyText || i18n.t('el.table.emptyText')
            )
          )
        )
      ),
      React.createElement(
        'div',
        {
          className: 'el-table__fixed-right',
          ref: 'rightFixedWrapper',
          style: { width: calculateFixedWidth(fixedRightColumns), height: realTableHeight ? realTableHeight - scrollYWiddth : '', right: scrollY ? getScrollBarWidth() : 0 } },
        React.createElement(
          'div',
          {
            className: 'el-table__fixed-header-wrapper',
            ref: 'rightFixedHeaderWrapper' },
          React.createElement(TableHeader, {
            fixed: 'right',
            border: 'border',
            columns: _columns,
            flattenColumns: flattenColumns,
            style: { width: '100%', height: '100%' } })
        ),
        React.createElement(
          'div',
          {
            className: 'el-table__fixed-body-wrapper',
            ref: 'rightFixedBodyWrapper',
            style: { top: realTableHeaderHeight, height: bodyHeight ? bodyHeight - scrollYWiddth : '' } },
          React.createElement(TableBody, {
            ref: 'fixedRightBody',
            fixed: 'right',
            rowClassName: this.props.rowClassName,
            columns: _columns,
            data: data,
            flattenColumns: flattenColumns,
            highlightCurrentRow: highlightCurrentRow,
            style: { width: bodyWidth } })
        )
      ),
      showSummary && React.createElement(TableFooter, {
        leafColumns: leafColumns,
        sumText: sumText,
        getSummaries: getSummaries,
        data: data }),
      React.createElement('div', {
        style: { display: this.state.resizeProxyVisible ? "block" : "none" },
        className: 'el-table__column-resize-proxy',
        ref: 'resizeProxy' }),
      React.createElement(
        'div',
        { className: 'el-table__body-scroller' },
        React.createElement('div', null)
      )
    );
  };

  return Table;
}(Component);

export default Table;


Table.childContextTypes = {
  $owerTable: PropTypes.object,
  stripe: PropTypes.bool
};

Table.defaultProps = {
  columns: [],
  data: [],
  stripe: false,
  border: false,
  fit: true,
  showSummary: false,
  highlightCurrentRow: false
};