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

var _libs = require('../../libs');

var _mixins = require('./mixins');

var _utils = require('./utils');

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableBody = require('./TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _TableFooter = require('./TableFooter');

var _TableFooter2 = _interopRequireDefault(_TableFooter);

var _locale = require('../locale');

var _locale2 = _interopRequireDefault(_locale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tableIdSeed = 1;

var Table = function (_Component) {
  (0, _inherits3.default)(Table, _Component);

  function Table(props, context) {
    (0, _classCallCheck3.default)(this, Table);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props, context));

    _this.tableId = tableIdSeed++;

    var _this$props = _this.props,
        columns = _this$props.columns,
        data = _this$props.data;

    var enhCols = (0, _mixins.enhanceColumns)(columns, _this.tableId);

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

  (0, _createClass3.default)(Table, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        $owerTable: this,
        stripe: this.props.stripe
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initLayout();

      var des = {
        get: this._filterContainer.bind(this)
      };
      Object.defineProperty(this, 'filterContainer', des);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._filterContainer instanceof HTMLElement) {
        var body = document.body || document;
        _reactDom2.default.unmountComponentAtNode(this.filterContainer);
        body.removeChild(this.filterContainer);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (nextProps.data != this.props.data) {
        this.setState({ data: nextProps.data }, function () {
          _this2.initLayout();
        });
      }

      if (nextProps.height != this.props.height) {
        this.initLayout();
      }
    }
  }, {
    key: '_filterContainer',
    value: function _filterContainer() {
      if (!this._filterCon) {
        this._filterCon = document.createElement('div');
        this._filterCon.style.cssText = "position:absolute;left:0;top:0";
        this._filterCon.id = "__filter__" + Math.random().toString().slice(2);
        var body = document.body || document.createElement('body');
        body.appendChild(this._filterCon);
      }

      return this._filterCon;
    }
  }, {
    key: 'initLayout',
    value: function initLayout() {
      var _this3 = this;

      var _props = this.props,
          height = _props.height,
          fit = _props.fit,
          maxHeight = _props.maxHeight;


      var rootComputedStyle = window.getComputedStyle(this.refs.root);
      var headerComputedStyle = window.getComputedStyle(this.refs.headerWrapper);
      var thisTableWidth = parseFloat(headerComputedStyle.getPropertyValue('width'));
      var realTableHeight = parseFloat(rootComputedStyle.getPropertyValue('height'));
      var bodyWidth = (0, _mixins.scheduleLayout)(this.state._columns, thisTableWidth, 0, fit).bodyWidth;
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
    }
  }, {
    key: 'scheduleLayout',
    value: function scheduleLayout() {
      var _this4 = this;

      var _state = this.state,
          _columns = _state._columns,
          realTableWidth = _state.realTableWidth,
          scrollY = _state.scrollY;


      var layout = (0, _mixins.scheduleLayout)(_columns, realTableWidth, Number(scrollY), this.props.fit);
      this.setState({
        bodyWidth: layout.bodyWidth
      }, function () {
        _this4.onScrollBodyWrapper();
        _this4.adjustScrollState();
      });
    }
  }, {
    key: 'adjustScrollState',
    value: function adjustScrollState() {
      var scrollY = this.refs.mainBody.isScrollY();
      this.setState({
        scrollX: this.refs.mainBody.isScrollX(),
        scrollY: scrollY,
        bodyWidth: (0, _mixins.scheduleLayout)(this.state._columns, this.state.realTableWidth, scrollY, this.props.fit).bodyWidth
      });
    }
  }, {
    key: 'getBodyWrapperStyle',
    value: function getBodyWrapperStyle() {
      var bodyHeight = this.state.bodyHeight;

      var style = {};

      style.height = bodyHeight;
      return style;
    }
  }, {
    key: 'onScrollBodyWrapper',
    value: function onScrollBodyWrapper() {
      var target = arguments[0] ? arguments[0].target : this.refs.bodyWrapper;
      var headerWrapper = this.refs.headerWrapper;
      var fixedBodyWrapper = this.refs.fixedBodyWrapper;
      var rightFixedBodyWrapper = this.refs.rightFixedBodyWrapper;

      if (target instanceof HTMLDivElement) {
        headerWrapper.scrollLeft = target.scrollLeft;
        fixedBodyWrapper && (fixedBodyWrapper.scrollTop = target.scrollTop);
        rightFixedBodyWrapper && (rightFixedBodyWrapper.scrollTop = target.scrollTop);
      }
    }
  }, {
    key: 'sortBy',
    value: function sortBy(sort, prop, compare) {
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
    }
  }, {
    key: 'filterBy',
    value: function filterBy(column, filteCondi) {
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
    }
  }, {
    key: 'flattenHeaderColumn',
    value: function flattenHeaderColumn() {
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
    }
  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.refs.mainBody.clearSelect();
      this.refs.header.cancelAllChecked();
    }
  }, {
    key: 'render',
    value: function render() {
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

      var scrollYWiddth = scrollX ? (0, _utils.getScrollBarWidth)() : 0;

      data = filterList || sortList || data;

      var flattenColumns = this.flattenHeaderColumn();
      var leafColumns = flattenColumns.leafColumns;


      return _react2.default.createElement(
        'div',
        {
          ref: 'root',
          style: this.style(),
          className: this.className(rootClassName) },
        _react2.default.createElement(
          'div',
          {
            ref: 'headerWrapper',
            className: 'el-table__header-wrapper' },
          _react2.default.createElement(_TableHeader2.default, {
            ref: 'header',
            isScrollY: scrollY,
            style: { width: bodyWidth },
            flattenColumns: flattenColumns,
            columns: _columns })
        ),
        _react2.default.createElement(
          'div',
          {
            style: this.getBodyWrapperStyle(),
            className: 'el-table__body-wrapper',
            onScroll: this.onScrollBodyWrapper.bind(this),
            ref: 'bodyWrapper' },
          _react2.default.createElement(_TableBody2.default, {
            ref: 'mainBody',
            style: { width: bodyWidth },
            rowClassName: this.props.rowClassName,
            columns: _columns,
            flattenColumns: flattenColumns,
            highlightCurrentRow: highlightCurrentRow,
            data: data })
        ),
        !!fixedLeftColumns.length && _react2.default.createElement(
          'div',
          {
            className: 'el-table__fixed',
            ref: 'fixedWrapper',
            style: { width: (0, _mixins.calculateFixedWidth)(fixedLeftColumns), height: realTableHeight ? realTableHeight - scrollYWiddth : '' } },
          _react2.default.createElement(
            'div',
            { className: 'el-table__fixed-header-wrapper', ref: 'fixedHeaderWrapper' },
            _react2.default.createElement(_TableHeader2.default, {
              fixed: 'left',
              border: 'border',
              columns: _columns,
              flattenColumns: flattenColumns,
              style: { width: '100%', height: '100%' } })
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'el-table__fixed-body-wrapper',
              ref: 'fixedBodyWrapper',
              style: { top: realTableHeaderHeight, height: bodyHeight ? bodyHeight - scrollYWiddth : '' } },
            data && data.length && _react2.default.createElement(_TableBody2.default, {
              ref: 'fixedLeftBody',
              fixed: 'left',
              rowClassName: this.props.rowClassName,
              columns: _columns,
              data: data,
              flattenColumns: flattenColumns,
              highlightCurrentRow: highlightCurrentRow,
              style: { width: bodyWidth } }),
            (!data || data.length === 0) && _react2.default.createElement(
              'div',
              { style: { width: bodyWidth }, className: 'el-table__empty-block' },
              _react2.default.createElement(
                'span',
                { className: 'el-table__empty-text' },
                emptyText || _locale2.default.t('el.table.emptyText')
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'el-table__fixed-right',
            ref: 'rightFixedWrapper',
            style: { width: (0, _mixins.calculateFixedWidth)(fixedRightColumns), height: realTableHeight ? realTableHeight - scrollYWiddth : '', right: scrollY ? (0, _utils.getScrollBarWidth)() : 0 } },
          _react2.default.createElement(
            'div',
            {
              className: 'el-table__fixed-header-wrapper',
              ref: 'rightFixedHeaderWrapper' },
            _react2.default.createElement(_TableHeader2.default, {
              fixed: 'right',
              border: 'border',
              columns: _columns,
              flattenColumns: flattenColumns,
              style: { width: '100%', height: '100%' } })
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'el-table__fixed-body-wrapper',
              ref: 'rightFixedBodyWrapper',
              style: { top: realTableHeaderHeight, height: bodyHeight ? bodyHeight - scrollYWiddth : '' } },
            _react2.default.createElement(_TableBody2.default, {
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
        showSummary && _react2.default.createElement(_TableFooter2.default, {
          leafColumns: leafColumns,
          sumText: sumText,
          getSummaries: getSummaries,
          data: data }),
        _react2.default.createElement('div', {
          style: { display: this.state.resizeProxyVisible ? "block" : "none" },
          className: 'el-table__column-resize-proxy',
          ref: 'resizeProxy' }),
        _react2.default.createElement(
          'div',
          { className: 'el-table__body-scroller' },
          _react2.default.createElement('div', null)
        )
      );
    }
  }]);
  return Table;
}(_libs.Component);

var _default = Table;
exports.default = _default;


Table.childContextTypes = {
  $owerTable: _libs.PropTypes.object,
  stripe: _libs.PropTypes.bool
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
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(tableIdSeed, 'tableIdSeed', 'src/table/Table.jsx');

  __REACT_HOT_LOADER__.register(Table, 'Table', 'src/table/Table.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/table/Table.jsx');
}();

;