'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _ajax = require('./ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _Cover = require('./Cover');

var _Cover2 = _interopRequireDefault(_Cover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AjaxUpload = function (_Component) {
  (0, _inherits3.default)(AjaxUpload, _Component);

  function AjaxUpload(props) {
    (0, _classCallCheck3.default)(this, AjaxUpload);
    return (0, _possibleConstructorReturn3.default)(this, (AjaxUpload.__proto__ || Object.getPrototypeOf(AjaxUpload)).call(this, props));
  }

  (0, _createClass3.default)(AjaxUpload, [{
    key: 'isImage',
    value: function isImage(str) {
      return str.indexOf('image') !== -1;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      if (e.target instanceof HTMLInputElement) {
        var files = e.target.files;
        if (!files) {
          return;
        }
        this.uploadFiles(files);
        this.refs.input.value = null;
      }
    }
  }, {
    key: 'uploadFiles',
    value: function uploadFiles(files) {
      var _this2 = this;

      var multiple = this.props.multiple;

      var postFiles = Array.prototype.slice.call(files);
      if (postFiles.length === 0) {
        return;
      }
      if (!multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      postFiles.forEach(function (file) {
        _this2.props.onStart(file);
        if (_this2.props.autoUpload) _this2.upload(file);
      });
    }
  }, {
    key: 'upload',
    value: function upload(rawFile, file) {
      var _this3 = this;

      var beforeUpload = this.props.beforeUpload;

      if (!beforeUpload) {
        return this.post(rawFile);
      }
      var before = beforeUpload(rawFile);
      if (before && before.then) {
        before.then(function (processedFile) {
          if (Object.prototype.toString.call(processedFile) === '[object File]') {
            _this3.post(processedFile);
          } else {
            _this3.post(rawFile);
          }
        }, function () {
          if (file) _this3.onRemove(file);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        if (file) this.onRemove(file);
      }
    }
  }, {
    key: 'post',
    value: function post(file) {
      var _props = this.props,
          filename = _props.name,
          headers = _props.headers,
          withCredentials = _props.withCredentials,
          data = _props.data,
          action = _props.action,
          _onProgress = _props.onProgress,
          _onSuccess = _props.onSuccess,
          _onError = _props.onError;

      (0, _ajax2.default)({
        headers: headers,
        withCredentials: withCredentials,
        file: file,
        data: data,
        filename: filename,
        action: action,
        onProgress: function onProgress(e) {
          return _onProgress(e, file);
        },
        onSuccess: function onSuccess(res) {
          return _onSuccess(res, file);
        },
        onError: function onError(err) {
          return _onError(err, file);
        }
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      this.refs.input.click();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          drag = _props2.drag,
          multiple = _props2.multiple,
          accept = _props2.accept,
          listType = _props2.listType;

      return _react2.default.createElement(
        'div',
        {
          className: this.classNames((0, _defineProperty3.default)({
            'el-upload': true
          }, 'el-upload--' + listType, true)),
          onClick: function onClick() {
            return _this4.handleClick();
          }
        },
        drag ? _react2.default.createElement(
          _Cover2.default,
          { onFile: function onFile(file) {
              return _this4.uploadFiles(file);
            } },
          this.props.children
        ) : this.props.children,
        _react2.default.createElement('input', {
          className: 'el-upload__input',
          type: 'file',
          ref: 'input',
          onChange: function onChange(e) {
            return _this4.handleChange(e);
          },
          multiple: multiple,
          accept: accept
        })
      );
    }
  }]);
  return AjaxUpload;
}(_libs.Component);

AjaxUpload.defaultProps = {
  name: 'file'
};
var _default = AjaxUpload;
exports.default = _default;


AjaxUpload.propTypes = {
  drag: _libs.PropTypes.bool,
  data: _libs.PropTypes.object,
  action: _libs.PropTypes.string.isRequired,
  name: _libs.PropTypes.string,
  accept: _libs.PropTypes.string,
  headers: _libs.PropTypes.object,
  withCredentials: _libs.PropTypes.bool,
  multiple: _libs.PropTypes.bool,
  onStart: _libs.PropTypes.func,
  onProgress: _libs.PropTypes.func,
  onSuccess: _libs.PropTypes.func,
  onError: _libs.PropTypes.func,
  beforeUpload: _libs.PropTypes.func,
  autoUpload: _libs.PropTypes.bool,
  listType: _libs.PropTypes.string,
  fileList: _libs.PropTypes.array
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(AjaxUpload, 'AjaxUpload', 'src/upload/AjaxUpload.jsx');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/upload/AjaxUpload.jsx');
}();

;