import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import { Component, PropTypes } from '../../libs';
import { getScrollBarWidth } from './utils';
import Checkbox from '../checkbox';

var BodyItem = function (_Component) {
  _inherits(BodyItem, _Component);

  function BodyItem(props, context) {
    _classCallCheck(this, BodyItem);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      hover: false,
      expand: false
    };
    return _this;
  }

  BodyItem.prototype.onMouseState = function onMouseState(hover) {
    var _context$$owerTable$r = this.context.$owerTable.refs,
        fixedLeftBody = _context$$owerTable$r.fixedLeftBody,
        mainBody = _context$$owerTable$r.mainBody,
        fixedRightBody = _context$$owerTable$r.fixedRightBody;


    fixedLeftBody && fixedLeftBody.hoverRowItem(this.props.rowIndex, hover);
    mainBody && mainBody.hoverRowItem(this.props.rowIndex, hover);
    fixedRightBody && fixedRightBody.hoverRowItem(this.props.rowIndex, hover);
  };

  BodyItem.prototype.setHoverState = function setHoverState(hover) {
    this.setState({
      hover: hover
    });
  };

  BodyItem.prototype.onToggleSelectedRow = function onToggleSelectedRow(isHiglight, dataItem) {
    var _context$$owerTable$r2 = this.context.$owerTable.refs,
        fixedLeftBody = _context$$owerTable$r2.fixedLeftBody,
        mainBody = _context$$owerTable$r2.mainBody,
        fixedRightBody = _context$$owerTable$r2.fixedRightBody;


    fixedLeftBody && fixedLeftBody.toggleSelectedRow(isHiglight, dataItem);
    mainBody && mainBody.toggleSelectedRow(isHiglight, dataItem);
    fixedRightBody && fixedRightBody.toggleSelectedRow(isHiglight, dataItem);

    var tableProps = this.context.$owerTable.props;
    tableProps.highlightCurrentRow && tableProps.onCurrentChange && tableProps.onCurrentChange(dataItem);
  };

  BodyItem.prototype.onChange = function onChange(checked) {
    var _props = this.props,
        onSelected = _props.onSelected,
        itemData = _props.itemData;

    onSelected && onSelected(checked, itemData);
  };

  BodyItem.prototype.onExpand = function onExpand() {
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

      ReactDOM.render(this.props.columns[0].expandPannel(this.props.itemData), td);
    } else {
      root.parentNode.removeChild(root.nextElementSibling);
    }
  };

  BodyItem.prototype.render = function render() {
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

    return React.createElement(
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
        return React.createElement(
          'td',
          {
            key: idx,
            className: className,
            style: { width: column.realWidth } },
          column.type == 'selection' && React.createElement(
            'div',
            { className: 'cell' },
            React.createElement(Checkbox, {
              checked: selected,
              onChange: function onChange(e) {
                return _this2.onChange(e);
              } })
          ),
          column.type == 'index' && React.createElement(
            'div',
            { className: 'cell' },
            rowIndex + 1
          ),
          column.type == 'expand' && React.createElement(
            'div',
            { className: 'cell' },
            React.createElement(
              'div',
              {
                ref: 'expand',
                className: epxandClass,
                onClick: _this2.onExpand.bind(_this2) },
              React.createElement('i', { className: 'el-icon el-icon-arrow-right' })
            )
          ),
          column.type != 'selection' && column.type != 'index' && column.type != 'expand' && React.createElement(
            'div',
            { className: 'cell' },
            content
          )
        );
      })
    );
  };

  return BodyItem;
}(Component);

BodyItem.contextTypes = {
  $owerTable: PropTypes.object,
  stripe: PropTypes.bool
};

var TableBody = function (_Component2) {
  _inherits(TableBody, _Component2);

  function TableBody(props, context) {
    _classCallCheck(this, TableBody);

    var _this3 = _possibleConstructorReturn(this, _Component2.call(this, props, context));

    _this3.rowPrefix = props.fixed + 'TableRow';

    _this3.state = {
      highlightRows: [],
      selected: []
    };
    return _this3;
  }

  TableBody.prototype.toggleSelectedRow = function toggleSelectedRow(isHiglight, rowData) {
    var highlightCurrentRow = this.props.highlightCurrentRow;

    if (!highlightCurrentRow) {
      return;
    }
    this.setState({
      highlightRows: isHiglight ? [rowData] : []
    });
  };

  TableBody.prototype.hoverRowItem = function hoverRowItem(rowIndex, hover) {
    var rcRowElement = this.refs[this.rowPrefix + rowIndex];
    rcRowElement.setHoverState(hover);
  };

  TableBody.prototype.isScrollY = function isScrollY() {
    var tableBodyWrapper = this.context.$owerTable.refs.bodyWrapper;
    var contentHeight = tableBodyWrapper.offsetHeight - (this.isScrollX() ? getScrollBarWidth() : 0);
    return contentHeight < this.refs.root.offsetHeight;
  };

  TableBody.prototype.isScrollX = function isScrollX() {
    var tableBodyWrapper = this.context.$owerTable.refs.bodyWrapper;
    return tableBodyWrapper.offsetWidth < this.refs.root.offsetWidth;
  };

  TableBody.prototype.onSelected = function onSelected(checked, data) {
    var selected = this.state.selected;

    var dataList = this.props.data;
    var onSelectChange = this.context.$owerTable.props.onSelectChange;


    checked ? selected.push(data) : selected.splice(selected.indexOf(data), 1);

    this.context.$owerTable.refs.header.setState({ allChecked: dataList.length == selected.length });
    this.setState({ selected: selected });

    onSelectChange && onSelectChange(data, checked);
  };

  TableBody.prototype.selectAll = function selectAll(checked) {
    var data = this.props.data;
    var onSelectAll = this.context.$owerTable.props.onSelectAll;


    this.setState({ selected: checked ? data.slice(0) : [] });
    onSelectAll && onSelectAll(checked ? data : [], checked);
  };

  TableBody.prototype.clearSelect = function clearSelect() {
    this.setState({ selected: [] });
  };

  TableBody.prototype.render = function render() {
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


    return React.createElement(
      'table',
      {
        ref: 'root',
        style: this.style(),
        className: this.classNames('el-table__body'),
        cellPadding: 0,
        cellSpacing: 0
      },
      React.createElement(
        'tbody',
        null,
        data.map(function (dataItem, dataIdx) {
          var refId = rowPrefix + dataIdx;
          var isHiglight = highlightRows[0] == dataItem;
          return React.createElement(BodyItem, {
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
  };

  return TableBody;
}(Component);

export default TableBody;


TableBody.contextTypes = {
  $owerTable: PropTypes.object
};