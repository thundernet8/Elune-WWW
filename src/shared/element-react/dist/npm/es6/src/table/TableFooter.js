import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Component, PropTypes } from '../../libs';

var TableFooter = function (_Component) {
  _inherits(TableFooter, _Component);

  function TableFooter(props, context) {
    _classCallCheck(this, TableFooter);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {
      dataList: []
    };
    return _this;
  }

  TableFooter.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        _props$data = _props.data,
        data = _props$data === undefined ? [] : _props$data,
        leafColumns = _props.leafColumns;

    if (this.props.getSummaries) {
      var tableRow = this.props.getSummaries(leafColumns, data);
      this.setState({
        dataList: tableRow instanceof Array ? tableRow : []
      });
    } else {
      for (var i = 0; i < leafColumns.length; i++) {
        var total = 0;
        for (var j = 0; j < data.length; j++) {
          var value = data[j][leafColumns[i]['property']];

          if (isNaN(value)) {
            total = 'N/A';
            break;
          } else {
            total += parseFloat(value);
          }
        }
        this.state.dataList[i] = total;
      }
    }
  };

  TableFooter.prototype.render = function render() {
    var _this2 = this;

    var _props2 = this.props,
        leafColumns = _props2.leafColumns,
        sumText = _props2.sumText;


    return React.createElement(
      'div',
      { className: 'el-table__footer-wrapper' },
      React.createElement(
        'table',
        { cellPadding: 0, cellSpacing: 0 },
        React.createElement(
          'colgroup',
          null,
          leafColumns.map(function (item, idx) {
            return React.createElement('col', { key: idx, style: { width: item.width } });
          })
        ),
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            leafColumns.map(function (column, idx) {
              if (idx == 0) {
                return React.createElement(
                  'td',
                  { key: idx, style: { width: column.realWidth } },
                  React.createElement(
                    'div',
                    { className: 'cell' },
                    sumText || "合计"
                  )
                );
              }

              return React.createElement(
                'td',
                { key: idx, style: { width: column.realWidth } },
                React.createElement(
                  'div',
                  { className: 'cell' },
                  _this2.state.dataList[idx]
                )
              );
            })
          )
        )
      )
    );
  };

  return TableFooter;
}(Component);

export default TableFooter;


TableFooter.contextTypes = {
  $owerTable: PropTypes.object
};