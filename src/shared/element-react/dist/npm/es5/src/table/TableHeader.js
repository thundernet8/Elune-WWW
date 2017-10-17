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

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _libs = require('../../libs');

var _utils = require('./utils');

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableHeader = function (_Component) {
  (0, _inherits3.default)(TableHeader, _Component);

  function TableHeader(props, context) {
    (0, _classCallCheck3.default)(this, TableHeader);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).call(this, props, context));

    _this.$ower = context.$owerTable;

    _this.state = {
      allChecked: false,
      dragging: false,
      dragState: {},
      sortStatus: 0, //0：没有排序 1：升序 2：降序
      sortPropertyName: '',
      filterParams: { column: null, condi: null //存储当前的过滤条件
      } };
    return _this;
  }

  (0, _createClass3.default)(TableHeader, [{
    key: 'handleMouseMove',
    value: function handleMouseMove(event, column) {
      var target = event.target;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }

      if (!column || !this.$ower.props.border || column.type == 'selection' || column.type == 'index' || typeof column.resizable != 'undefined' && column.resizable) {
        return;
      }

      if (!this.dragging) {
        var rect = target.getBoundingClientRect();
        var body = document.body || target;
        var bodyStyle = body.style;

        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize';
          this.draggingColumn = column;
        } else if (!this.dragging) {
          bodyStyle.cursor = '';
          this.draggingColumn = null;
        }
      }
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(event, column) {
      var _this2 = this;

      if (this.draggingColumn && this.$ower.props.border) {
        this.dragging = true;

        var columnEl = event.target;
        var body = document.body || columnEl;

        while (columnEl && columnEl.tagName !== 'TH') {
          columnEl = columnEl.parentNode;
        }

        this.$ower.setState({ resizeProxyVisible: true });

        var tableEl = _reactDom2.default.findDOMNode(this.context.$owerTable);
        var pos = tableEl.getBoundingClientRect() || { left: 0 };
        var tableLeft = pos.left;
        var columnRect = columnEl.getBoundingClientRect();
        var minLeft = columnRect.left - tableLeft + 30;

        columnEl.classList.add('noclick');

        this.state.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft: tableLeft
        };

        var resizeProxy = this.context.$owerTable.refs.resizeProxy;
        resizeProxy.style.left = this.state.dragState.startLeft + 'px';

        var preventFunc = function preventFunc() {
          return false;
        };
        var handleMouseMove = function handleMouseMove(event) {
          var deltaLeft = event.clientX - _this2.state.dragState.startMouseLeft;
          var proxyLeft = _this2.state.dragState.startLeft + deltaLeft;

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
        };

        var handleMouseUp = function handleMouseUp() {
          if (_this2.dragging) {
            var finalLeft = parseInt(resizeProxy.style.left, 10);
            var columnWidth = finalLeft - _this2.state.dragState.startColumnLeft;
            //width本应为配置的高度， 如果改变过宽度， realWidth 与 width永远保持一致
            //这列不再参与宽度的自动重新分配
            column.realWidth = column.width = column.minWidth > columnWidth ? column.minWidth : columnWidth;

            _this2.context.$owerTable.scheduleLayout();

            body.style.cursor = '';
            _this2.dragging = false;
            _this2.draggingColumn = null;
            _this2.dragState = {};

            _this2.context.$owerTable.setState({ resizeProxyVisible: false });
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('selectstart', preventFunc);
          document.removeEventListener('dragstart', preventFunc);

          setTimeout(function () {
            columnEl.classList.remove('noclick');
          }, 0);
        };

        document.addEventListener('selectstart', preventFunc);
        document.addEventListener('dragstart', preventFunc);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    }
  }, {
    key: 'onAllChecked',
    value: function onAllChecked(checked) {
      var mainBody = this.context.$owerTable.refs.mainBody;

      this.setState({ allChecked: checked });
      mainBody.selectAll(checked);
    }
  }, {
    key: 'onSort',
    value: function onSort(column) {
      var sortStatus = this.state.sortStatus;
      var $owerTable = this.context.$owerTable;

      var nextStatus = void 0;

      switch (sortStatus) {
        case 0:
          nextStatus = 1;break;
        case 1:
          nextStatus = 2;break;
        case 2:
          nextStatus = 0;break;
      }

      this.setState({
        sortStatus: nextStatus,
        sortPropertyName: column.property
      });
      $owerTable.sortBy(nextStatus, column.property, column.sortMethod);
    }
  }, {
    key: 'onFilter',
    value: function onFilter(e, filters, columnData) {
      var filterParams = this.state.filterParams;


      e.stopPropagation();

      var column = e.target.parentNode;
      var ower = this.context.$owerTable;
      var arrow = void 0,
          pos = void 0;

      while (column.tagName.toLowerCase() != 'th') {
        column = column.parentNode;
      }

      pos = this.getPosByEle(column);

      arrow = column.querySelector('.el-icon-arrow-down');
      pos.x = this.getPosByEle(arrow).x + arrow.offsetWidth;
      pos.y = pos.y + column.offsetHeight - 3;

      var visible = void 0;
      if (arrow.className.indexOf('el-icon-arrow-up') > -1) {
        arrow.className = arrow.className.replace('el-icon-arrow-up', '');
        visible = false;
      } else {
        arrow.className = arrow.className + ' el-icon-arrow-up';
        visible = true;
      }

      var onClose = function onClose() {
        arrow.className = arrow.className.replace('el-icon-arrow-up', '');
      };

      _reactDom2.default.render(_react2.default.createElement(_filter2.default, {
        defaultCondi: filterParams.column == columnData ? filterParams.condi : null,
        onFilter: this.onFilterAction.bind(this, columnData),
        popper: this.refs.popper,
        visible: visible,
        onClose: onClose,
        filters: filters,
        position: pos,
        ower: ower }), ower.filterContainer);
    }
  }, {
    key: 'onFilterAction',
    value: function onFilterAction(column, filterCondi) {
      var filterParams = this.state.filterParams;


      filterParams.column = filterCondi && filterCondi.length ? column : null;
      filterParams.condi = filterCondi && filterCondi.length ? filterCondi : null;
      this.context.$owerTable.filterBy(column, filterCondi);
    }
  }, {
    key: 'getPosByEle',
    value: function getPosByEle(el) {
      var y = el.offsetTop;
      var x = el.offsetLeft;

      while (el == el.offsetParent) {
        y += el.offsetTop;
        x += el.offsetLeft;
      }

      return { x: x, y: y };
    }
  }, {
    key: 'cancelAllChecked',
    value: function cancelAllChecked() {
      this.setState({ allChecked: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          style = _props.style,
          isScrollY = _props.isScrollY,
          fixed = _props.fixed,
          flattenColumns = _props.flattenColumns;
      var _state = this.state,
          sortPropertyName = _state.sortPropertyName,
          sortStatus = _state.sortStatus;
      var leafColumns = flattenColumns.leafColumns,
          headerLevelColumns = flattenColumns.headerLevelColumns;


      return _react2.default.createElement(
        'table',
        {
          style: style,
          className: this.classNames('el-table__header'),
          cellPadding: 0,
          cellSpacing: 0 },
        _react2.default.createElement(
          'colgroup',
          null,
          leafColumns.map(function (item, idx) {
            return _react2.default.createElement('col', { key: idx, style: { width: item.width } });
          })
        ),
        _react2.default.createElement(
          'thead',
          null,
          headerLevelColumns.map(function (item, index) {
            var columnList = item;
            return _react2.default.createElement(
              'tr',
              { key: index },
              columnList.map(function (column, idx) {
                var className = _this3.classNames({
                  'is-center': column.align == 'center',
                  'is-right': column.align == 'right',
                  'is-hidden': !_this3.props.fixed && column.fixed,
                  'ascending': sortPropertyName == column.property && sortStatus == 1,
                  'descending': sortPropertyName == column.property && sortStatus == 2
                });

                return _react2.default.createElement(
                  'th',
                  {
                    key: idx,
                    rowSpan: column.rowSpan,
                    colSpan: column.colSpan,
                    className: className,
                    onMouseMove: function onMouseMove(e) {
                      return _this3.handleMouseMove(e, column);
                    },
                    onMouseDown: function onMouseDown(e) {
                      return _this3.handleMouseDown(e, column);
                    },
                    style: column.colSpan ? {} : { width: column.realWidth } },
                  column.type == 'selection' && _react2.default.createElement(
                    'div',
                    { className: 'cell' },
                    _react2.default.createElement(_checkbox2.default, {
                      checked: _this3.state.allChecked,
                      onChange: function onChange(checked) {
                        return _this3.onAllChecked(checked);
                      } })
                  ),
                  column.type == 'index' && _react2.default.createElement(
                    'div',
                    { className: 'cell' },
                    '#'
                  ),
                  column.type != 'selection' && column.type != 'index' && _react2.default.createElement(
                    'div',
                    { className: 'cell' },
                    column.label,
                    column.sortable ? _react2.default.createElement(
                      'span',
                      { className: 'caret-wrapper', onClick: function onClick() {
                          _this3.onSort(column);
                        } },
                      _react2.default.createElement('i', { className: 'sort-caret ascending' }),
                      _react2.default.createElement('i', { className: 'sort-caret descending' })
                    ) : '',
                    column.filterable ? _react2.default.createElement(
                      'span',
                      {
                        ref: 'popper',
                        className: 'el-table__column-filter-trigger',
                        onClick: function onClick(e) {
                          return _this3.onFilter(e, column.filters, column);
                        } },
                      _react2.default.createElement('i', { className: 'el-icon-arrow-down' })
                    ) : ''
                  )
                );
              }),
              !fixed && isScrollY && _react2.default.createElement('th', { className: 'gutter', style: { width: (0, _utils.getScrollBarWidth)() } })
            );
          })
        )
      );
    }
  }]);
  return TableHeader;
}(_libs.Component);

var _default = TableHeader;
exports.default = _default;


TableHeader.contextTypes = {
  $owerTable: _libs.PropTypes.object
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableHeader, 'TableHeader', 'src/table/TableHeader.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/table/TableHeader.jsx');
}();

;