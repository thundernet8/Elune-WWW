import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Component, PropTypes } from '../../libs';

import calcTextareaHeight from './calcTextareaHeight';

var Input = function (_Component) {
  _inherits(Input, _Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      textareaStyle: null
    };
    return _this;
  }

  Input.prototype.componentDidMount = function componentDidMount() {
    this.resizeTextarea();
  };

  /* <Instance Methods */

  Input.prototype.focus = function focus() {
    var _this2 = this;

    setTimeout(function () {
      (_this2.refs.input || _this2.refs.textarea).focus();
    });
  };

  Input.prototype.blur = function blur() {
    var _this3 = this;

    setTimeout(function () {
      (_this3.refs.input || _this3.refs.textarea).blur();
    });
  };

  /* Instance Methods> */

  Input.prototype.fixControlledValue = function fixControlledValue(value) {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  };

  Input.prototype.handleChange = function handleChange(e) {
    var onChange = this.props.onChange;


    if (onChange) {
      onChange(e.target.value);
    }

    this.resizeTextarea();
  };

  Input.prototype.handleFocus = function handleFocus(e) {
    var onFocus = this.props.onFocus;

    if (onFocus) onFocus(e);
  };

  Input.prototype.handleBlur = function handleBlur(e) {
    var onBlur = this.props.onBlur;

    if (onBlur) onBlur(e);
  };

  Input.prototype.handleIconClick = function handleIconClick() {
    if (this.props.onIconClick) {
      this.props.onIconClick();
    }
  };

  Input.prototype.resizeTextarea = function resizeTextarea() {
    var _props = this.props,
        autosize = _props.autosize,
        type = _props.type;


    if (!autosize || type !== 'textarea') {
      return;
    }

    var minRows = autosize.minRows;
    var maxRows = autosize.maxRows;

    this.setState({
      textareaStyle: calcTextareaHeight(this.refs.textarea, minRows, maxRows)
    });
  };

  Input.prototype.render = function render() {
    var _props2 = this.props,
        type = _props2.type,
        size = _props2.size,
        prepend = _props2.prepend,
        append = _props2.append,
        icon = _props2.icon,
        autoComplete = _props2.autoComplete,
        validating = _props2.validating,
        rows = _props2.rows,
        onMouseEnter = _props2.onMouseEnter,
        onMouseLeave = _props2.onMouseLeave,
        otherProps = _objectWithoutProperties(_props2, ['type', 'size', 'prepend', 'append', 'icon', 'autoComplete', 'validating', 'rows', 'onMouseEnter', 'onMouseLeave']);

    var classname = this.classNames(type === 'textarea' ? 'el-textarea' : 'el-input', size && 'el-input--' + size, {
      'is-disabled': this.props.disabled,
      'el-input-group': prepend || append,
      'el-input-group--append': !!append,
      'el-input-group--prepend': !!prepend
    });

    if ('value' in this.props) {
      otherProps.value = this.fixControlledValue(this.props.value);

      delete otherProps.defaultValue;
    }

    delete otherProps.style;
    delete otherProps.autosize;
    delete otherProps.onIconClick;

    if (type === 'textarea') {
      return React.createElement(
        'div',
        { style: this.style(), className: this.className(classname) },
        React.createElement('textarea', _extends({}, otherProps, {
          ref: 'textarea',
          className: 'el-textarea__inner',
          style: this.state.textareaStyle,
          rows: rows,
          onChange: this.handleChange.bind(this),
          onFocus: this.handleFocus.bind(this),
          onBlur: this.handleBlur.bind(this)
        }))
      );
    } else {
      return React.createElement(
        'div',
        { style: this.style(), className: this.className(classname), onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        prepend && React.createElement(
          'div',
          { className: 'el-input-group__prepend' },
          prepend
        ),
        typeof icon === 'string' ? React.createElement(
          'i',
          { className: 'el-input__icon el-icon-' + icon, onClick: this.handleIconClick.bind(this) },
          prepend
        ) : icon,
        React.createElement('input', _extends({}, otherProps, {
          ref: 'input',
          type: type,
          className: 'el-input__inner',
          autoComplete: autoComplete,
          onChange: this.handleChange.bind(this),
          onFocus: this.handleFocus.bind(this),
          onBlur: this.handleBlur.bind(this)
        })),
        validating && React.createElement('i', { className: 'el-input__icon el-icon-loading' }),
        append && React.createElement(
          'div',
          { className: 'el-input-group__append' },
          append
        )
      );
    }
  };

  return Input;
}(Component);

Input.defaultProps = {
  type: 'text',
  autosize: false,
  rows: 2,
  autoComplete: 'off'
};
export default Input;


Input.propTypes = {
  // base
  type: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  defaultValue: PropTypes.any,
  value: PropTypes.any,

  // type !== 'textarea'
  size: PropTypes.oneOf(['large', 'small', 'mini']),
  prepend: PropTypes.node,
  append: PropTypes.node,

  // type === 'textarea'
  autosize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  rows: PropTypes.number,

  // event
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onIconClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,

  // autoComplete
  autoComplete: PropTypes.string,
  inputSelect: PropTypes.func,

  // form related
  form: PropTypes.string,
  validating: PropTypes.bool
};