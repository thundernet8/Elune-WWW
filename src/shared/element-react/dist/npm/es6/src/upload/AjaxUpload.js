import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Component, PropTypes } from '../../libs';
import ajax from './ajax';
import Cover from './Cover';

var AjaxUpload = function (_Component) {
  _inherits(AjaxUpload, _Component);

  function AjaxUpload(props) {
    _classCallCheck(this, AjaxUpload);

    return _possibleConstructorReturn(this, _Component.call(this, props));
  }

  AjaxUpload.prototype.isImage = function isImage(str) {
    return str.indexOf('image') !== -1;
  };

  AjaxUpload.prototype.handleChange = function handleChange(e) {
    if (e.target instanceof HTMLInputElement) {
      var files = e.target.files;
      if (!files) {
        return;
      }
      this.uploadFiles(files);
      this.refs.input.value = null;
    }
  };

  AjaxUpload.prototype.uploadFiles = function uploadFiles(files) {
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
  };

  AjaxUpload.prototype.upload = function upload(rawFile, file) {
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
  };

  AjaxUpload.prototype.post = function post(file) {
    var _props = this.props,
        filename = _props.name,
        headers = _props.headers,
        withCredentials = _props.withCredentials,
        data = _props.data,
        action = _props.action,
        _onProgress = _props.onProgress,
        _onSuccess = _props.onSuccess,
        _onError = _props.onError;

    ajax({
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
  };

  AjaxUpload.prototype.handleClick = function handleClick() {
    this.refs.input.click();
  };

  AjaxUpload.prototype.render = function render() {
    var _classNames,
        _this4 = this;

    var _props2 = this.props,
        drag = _props2.drag,
        multiple = _props2.multiple,
        accept = _props2.accept,
        listType = _props2.listType;

    return React.createElement(
      'div',
      {
        className: this.classNames((_classNames = {
          'el-upload': true
        }, _classNames['el-upload--' + listType] = true, _classNames)),
        onClick: function onClick() {
          return _this4.handleClick();
        }
      },
      drag ? React.createElement(
        Cover,
        { onFile: function onFile(file) {
            return _this4.uploadFiles(file);
          } },
        this.props.children
      ) : this.props.children,
      React.createElement('input', {
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
  };

  return AjaxUpload;
}(Component);

AjaxUpload.defaultProps = {
  name: 'file'
};
export default AjaxUpload;


AjaxUpload.propTypes = {
  drag: PropTypes.bool,
  data: PropTypes.object,
  action: PropTypes.string.isRequired,
  name: PropTypes.string,
  accept: PropTypes.string,
  headers: PropTypes.object,
  withCredentials: PropTypes.bool,
  multiple: PropTypes.bool,
  onStart: PropTypes.func,
  onProgress: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  beforeUpload: PropTypes.func,
  autoUpload: PropTypes.bool,
  listType: PropTypes.string,
  fileList: PropTypes.array
};