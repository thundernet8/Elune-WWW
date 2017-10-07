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

var _utils = require('./utils');

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BodyItem = function (_Component) {
  (0, _inherits3.default)(BodyItem, _Component);

  function BodyItem(props, context) {
    (0, _classCallCheck3.default)(this, BodyItem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BodyItem.__proto__ || Object.getPrototypeOf(BodyItem)).call(this, props, context));

    _this.state = {
      hover: false,
      expand: false
    };
    return _this;
  }

  (0, _createClass3.default)(BodyItem, [{
    key: 'onMouseState',
    value: function onMouseState(hover) {
      var _context$$owerTable$r = this.context.$owerTable.refs,
          fixedLeftBody = _context$$owerTable$r.fixedLeftBody,
          mainBody = _context$$owerTable$r.mainBody,
          fixedRightBody = _context$$owerTable$r.fixedRightBody;


      fixedLeftBody && fixedLeftBody.hoverRowItem(this.props.rowIndex, hover);
      mainBody && mainBody.hoverRowItem(this.props.rowIndex, hover);
      fixedRightBody && fixedRightBody.hoverRowItem(this.props.rowIndex, hover);
    }
  }, {
    key: 'setHoverState',
    value: function setHoverState(hover) {
      this.setState({
        hover: hover
      });
    }
  }, {
    key: 'onToggleSelectedRow',
    value: function onToggleSelectedRow(isHiglight, dataItem) {
      var _context$$owerTable$r2 = this.context.$owerTable.refs,
          fixedLeftBody = _context$$owerTable$r2.fixedLeftBody,
          mainBody = _context$$owerTable$r2.mainBody,
          fixedRightBody = _context$$owerTable$r2.fixedRightBody;


      fixedLeftBody && fixedLeftBody.toggleSelectedRow(isHiglight, dataItem);
      mainBody && mainBody.toggleSelectedRow(isHiglight, dataItem);
      fixedRightBody && fixedRightBody.toggleSelectedRow(isHiglight, dataItem);

      var tableProps = this.context.$owerTable.props;
      tableProps.highlightCurrentRow && tableProps.onCurrentChange && tableProps.onCurrentChange(dataItem);
    }
  }, {
    key: 'onChange',
    value: function onChange(checked) {
      var _props = this.props,
          onSelected = _props.onSelected,
          itemData = _props.itemData;

      onSelected && onSelected(checked, itemData);
    }
  }, {
    key: 'onExpand',
    value: function onExpand() {
      var expand = this.state.expand;
      var root = this.refs.root;


      this.setState({
        expand: !expand
      });

      if (!expand) {
        var table = root.parentNode.parentNode;
        var index = Array.prototype.slice.apply(root.parentNode.childNodes, [0, root.parentNode.childNodes.length]).indexOf(root);
        var row = table.insertRow(index + 1);
        var td = document.createElement('td');

        td.colSpan = this.props.columns.length;
        td.className = 'el-table__expanded-cell';
        row.appendChild(td);

        _reactDom2.default.render(this.props.columns[0].expandPannel(this.props.itemData), td);
      } else {
        root.parentNode.removeChild(root.nextElementSibling);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          itemData = _props2.itemData,
          rowIndex = _props2.rowIndex,
          rowClassName = _props2.rowClassName,
          isHiglight = _props2.isHiglight,
          selected = _props2.selected,
          leafColumns = _props2.leafColumns;


      var classSet = {
        'hover-row': this.state.hover,
        'current-row': isHiglight,
        'el-table__row--striped': this.context.stripe && rowIndex % 2 !== 0
      };

      if (rowClassName) {
        var clasName = rowClassName(itemData, rowIndex);
        classSet[clasName] = true;
      }

      var rootClassName = this.classNames(classSet);
      var epxandClass = this.classNames({
        'el-table__expand-icon': true,
        'el-table__expand-icon--expanded': this.state.expand
      });

      return _react2.default.createElement(
        'tr',
        {
          ref: 'root',
          onClick: function onClick() {
            _this2.onToggleSelectedRow(!isHiglight, itemData);
          },
          className: rootClassName,
          onMouseEnter: function onMouseEnter() {
            _this2.onMouseState(true);
          },
          onMouseLeave: function onMouseLeave() {
            _this2.onMouseState(false);
          } },
        leafColumns.map(function (column, idx) {
          var content = void 0;
          if (column.render) {
            content = column.render(itemData, column);
          } else {
            content = itemData[column.property];
          }
          var className = _this2.classNames({
            'is-hidden': !_this2.props.fixed && column.fixed,
            'is-center': column.align == 'center',
            'is-right': column.align == 'right'
          });
          return _react2.default.createElement(
            'td',
            {
              key: idx,
              className: className,
              style: { width: column.realWidth } },
            column.type == 'selection' && _react2.default.createElement(
              'div',
              { className: 'cell' },
              _react2.default.createElement(_checkbox2.default, {
                checked: selected,
                onChange: function onChange(e) {
                  return _this2.onChange(e);
                } })
            ),
            column.type == 'index' && _react2.default.createElement(
              'div',
              { className: 'cell' },
              rowIndex + 1
            ),
            column.type == 'expand' && _react2.default.createElement(
              'div',
              { className: 'cell' },
              _react2.default.createElement(
                'div',
                {
                  ref: 'expand',
                  className: epxandClass,
                  onClick: _this2.onExpand.bind(_this2) },
                _react2.default.createElement('i', { className: 'el-icon el-icon-arrow-right' })
              )
            ),
            column.type != 'selection' && column.type != 'index' && column.type != 'expand' && _react2.default.createElement(
              'div',
              { className: 'cell' },
              content
            )
          );
        })
      );
    }
  }]);
  return BodyItem;
}(_libs.Component);

BodyItem.contextTypes = {
  $owerTable: _libs.PropTypes.object,
  stripe: _libs.PropTypes.bool
};

var TableBody = function (_Component2) {
  (0, _inherits3.default)(TableBody, _Component2);

  function TableBody(props, context) {
    (0, _classCallCheck3.default)(this, TableBody);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (TableBody.__proto__ || Object.getPrototypeOf(TableBody)).call(this, props, context));

    _this3.rowPrefix = props.fixed + 'TableRow';

    _this3.state = {
      highlightRows: [],
      selected: []
    };
    return _this3;
  }

  (0, _createClass3.default)(TableBody, [{
    key: 'toggleSelectedRow',
    value: function toggleSelectedRow(isHiglight, rowData) {
      var highlightCurrentRow = this.props.highlightCurrentRow;

      if (!highlightCurrentRow) {
        return;
      }
      this.setState({
        highlightRows: isHiglight ? [rowData] : []
      });
    }
  }, {
    key: 'hoverRowItem',
    value: function hoverRowItem(rowIndex, hover) {
      var rcRowElement = this.refs[this.rowPrefix + rowIndex];
      rcRowElement.setHoverState(hover);
    }
  }, {
    key: 'isScrollY',
    value: function isScrollY() {
      var tableBodyWrapper = this.context.$owerTable.refs.bodyWrapper;
      var contentHeight = tableBodyWrapper.offsetHeight - (this.isScrollX() ? (0, _utils.getScrollBarWidth)() : 0);
      return contentHeight < this.refs.root.offsetHeight;
    }
  }, {
    key: 'isScrollX',
    value: function isScrollX() {
      var tableBodyWrapper = this.context.$owerTable.refs.bodyWrapper;
      return tableBodyWrapper.offsetWidth < this.refs.root.offsetWidth;
    }
  }, {
    key: 'onSelected',
    value: function onSelected(checked, data) {
      var selected = this.state.selected;

      var dataList = this.props.data;
      var onSelectChange = this.context.$owerTable.props.onSelectChange;


      checked ? selected.push(data) : selected.splice(selected.indexOf(data), 1);

      this.context.$owerTable.refs.header.setState({ allChecked: dataList.length == selected.length });
      this.setState({ selected: selected });

      onSelectChange && onSelectChange(data, checked);
    }
  }, {
    key: 'selectAll',
    value: function selectAll(checked) {
      var data = this.props.data;
      var onSelectAll = this.context.$owerTable.props.onSelectAll;


      this.setState({ selected: checked ? data.slice(0) : [] });
      onSelectAll && onSelectAll(checked ? data : [], checked);
    }
  }, {
    key: 'clearSelect',
    value: function clearSelect() {
      this.setState({ selected: [] });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props3 = this.props,
          columns = _props3.columns,
          data = _props3.data,
          rowClassName = _props3.rowClassName,
          fixed = _props3.fixed,
          flattenColumns = _props3.flattenColumns;
      var _state = this.state,
          highlightRows = _state.highlightRows,
          selected = _state.selected;

      var rowPrefix = this.rowPrefix;
      var leafColumns = flattenColumns.leafColumns;


      return _react2.default.createElement(
        'table',
        {
          ref: 'root',
          style: this.style(),
          className: this.classNames('el-table__body'),
          cellPadding: 0,
          cellSpacing: 0
        },
        _react2.default.createElement(
          'tbody',
          null,
          data.map(function (dataItem, dataIdx) {
            var refId = rowPrefix + dataIdx;
            var isHiglight = highlightRows[0] == dataItem;
            return _react2.default.createElement(BodyItem, {
              fixed: fixed,
              onSelected: function onSelected(c, d) {
                _this4.onSelected(c, d);
              },
              selected: selected.indexOf(dataItem) > -1,
              key: dataIdx,
              ref: refId,
              isHiglight: isHiglight,
              rowIndex: dataIdx,
              rowClassName: rowClassName,
              itemData: dataItem,
              leafColumns: leafColumns,
              columns: columns
            });
          })
        )
      );
    }
  }]);
  return TableBody;
}(_libs.Component);

var _default = TableBody;
exports.default = _default;


TableBody.contextTypes = {
  $owerTable: _libs.PropTypes.object
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(BodyItem, 'BodyItem', 'src/table/TableBody.jsx');

  __REACT_HOT_LOADER__.register(TableBody, 'TableBody', 'src/table/TableBody.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/table/TableBody.jsx');
}();

;