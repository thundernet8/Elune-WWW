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

var _libs = require('../../libs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableFooter = function (_Component) {
  (0, _inherits3.default)(TableFooter, _Component);

  function TableFooter(props, context) {
    (0, _classCallCheck3.default)(this, TableFooter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TableFooter.__proto__ || Object.getPrototypeOf(TableFooter)).call(this, props, context));

    _this.state = {
      dataList: []
    };
    return _this;
  }

  (0, _createClass3.default)(TableFooter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          leafColumns = _props2.leafColumns,
          sumText = _props2.sumText;


      return _react2.default.createElement(
        'div',
        { className: 'el-table__footer-wrapper' },
        _react2.default.createElement(
          'table',
          { cellPadding: 0, cellSpacing: 0 },
          _react2.default.createElement(
            'colgroup',
            null,
            leafColumns.map(function (item, idx) {
              return _react2.default.createElement('col', { key: idx, style: { width: item.width } });
            })
          ),
          _react2.default.createElement(
            'tbody',
            null,
            _react2.default.createElement(
              'tr',
              null,
              leafColumns.map(function (column, idx) {
                if (idx == 0) {
                  return _react2.default.createElement(
                    'td',
                    { key: idx, style: { width: column.realWidth } },
                    _react2.default.createElement(
                      'div',
                      { className: 'cell' },
                      sumText || "合计"
                    )
                  );
                }

                return _react2.default.createElement(
                  'td',
                  { key: idx, style: { width: column.realWidth } },
                  _react2.default.createElement(
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
    }
  }]);
  return TableFooter;
}(_libs.Component);

var _default = TableFooter;
exports.default = _default;


TableFooter.contextTypes = {
  $owerTable: _libs.PropTypes.object
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableFooter, 'TableFooter', 'src/table/TableFooter.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/table/TableFooter.jsx');
}();

;