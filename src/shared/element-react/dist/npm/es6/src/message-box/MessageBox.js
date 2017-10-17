import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Component, PropTypes, Transition, View } from '../../libs';
import Button from '../button';
import Input from '../input';
import i18n from '../locale';

var typeMap = {
  success: 'circle-check',
  info: 'information',
  warning: 'warning',
  error: 'circle-cross'
};

var MessageBox = function (_Component) {
  _inherits(MessageBox, _Component);

  function MessageBox(props) {
    _classCallCheck(this, MessageBox);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      visible: false
    };
    return _this;
  }

  MessageBox.prototype.componentDidMount = function componentDidMount() {
    this.setState({
      visible: true
    });
  };

  MessageBox.prototype.confirmButtonText = function confirmButtonText() {
    return this.props.confirmButtonText || i18n.t('el.messagebox.confirm');
  };

  MessageBox.prototype.cancelButtonText = function cancelButtonText() {
    return this.props.cancelButtonText || i18n.t('el.messagebox.cancel');
  };

  MessageBox.prototype.onChange = function onChange(value) {
    this.validate(value);
  };

  MessageBox.prototype.typeClass = function typeClass() {
    return this.props.type && typeMap[this.props.type] && 'el-icon-' + typeMap[this.props.type];
  };

  MessageBox.prototype.validate = function validate(value) {
    var _props = this.props,
        inputPattern = _props.inputPattern,
        inputValidator = _props.inputValidator,
        inputErrorMessage = _props.inputErrorMessage;

    var editorErrorMessage = void 0;

    if (inputPattern && !inputPattern.test(value)) {
      editorErrorMessage = inputErrorMessage || i18n.t('el.messagebox.error');
    }

    if (typeof inputValidator === 'function') {
      var validateResult = inputValidator(value);

      if (validateResult === false) {
        editorErrorMessage = inputErrorMessage || i18n.t('el.messagebox.error');
      }

      if (typeof validateResult === 'string') {
        editorErrorMessage = validateResult;
      }
    }

    this.inputValue = value;
    this.setState({ editorErrorMessage: editorErrorMessage });

    return !editorErrorMessage;
  };

  MessageBox.prototype.handleAction = function handleAction(action) {
    var _props2 = this.props,
        modal = _props2.modal,
        promise = _props2.promise,
        showInput = _props2.showInput;


    if (modal) {
      switch (action) {
        case 'cancel':
          promise.reject();
          break;
        case 'confirm':
          if (modal === 'prompt') {
            if (this.validate(this.inputValue)) {
              if (showInput) {
                promise.resolve({ value: this.inputValue, action: action });
              } else {
                promise.resolve(action);
              }
            } else {
              return;
            }
          } else {
            promise.resolve();
          }
          break;
        default:
          break;
      }
    } else {
      promise.resolve(action);
    }

    this.close();
  };

  MessageBox.prototype.close = function close() {
    var _this2 = this;

    this.setState({
      visible: false
    });

    setTimeout(function () {
      _this2.props.onClose();
    }, 200);
  };

  MessageBox.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: { position: 'absolute', zIndex: 2001 } },
        React.createElement(
          Transition,
          { name: 'msgbox-fade', duration: '300' },
          React.createElement(
            View,
            { key: this.state.visible, show: this.state.visible },
            React.createElement(
              'div',
              { className: 'el-message-box__wrapper' },
              React.createElement(
                'div',
                { className: 'el-message-box' },
                this.props.title && React.createElement(
                  'div',
                  { className: 'el-message-box__header' },
                  React.createElement(
                    'div',
                    { className: 'el-message-box__title' },
                    this.props.title
                  ),
                  this.props.showClose && React.createElement(
                    'button',
                    { type: 'button', className: 'el-message-box__headerbtn', 'aria-label': 'Close', onClick: this.handleAction.bind(this, 'cancel') },
                    React.createElement('i', { className: 'el-message-box__close el-icon-close' })
                  )
                ),
                this.props.message && React.createElement(
                  'div',
                  { className: 'el-message-box__content' },
                  React.createElement('div', { className: this.classNames('el-message-box__status', this.typeClass()) }),
                  React.createElement(
                    'div',
                    { className: 'el-message-box__message', style: { marginLeft: this.typeClass() ? '50px' : '0' } },
                    React.createElement(
                      'p',
                      null,
                      this.props.message
                    )
                  ),
                  React.createElement(
                    View,
                    { show: this.props.showInput },
                    React.createElement(
                      'div',
                      { className: 'el-message-box__input' },
                      React.createElement(Input, {
                        className: this.classNames({
                          'invalid': this.state.editorErrorMessage
                        }),
                        placeholder: this.props.inputPlaceholder,
                        onChange: this.onChange.bind(this)
                      }),
                      React.createElement(
                        'div',
                        { className: 'el-message-box__errormsg', style: {
                            visibility: this.state.editorErrorMessage ? 'visible' : 'hidden'
                          } },
                        this.state.editorErrorMessage
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'el-message-box__btns' },
                  React.createElement(
                    View,
                    { show: this.props.showCancelButton },
                    React.createElement(
                      Button,
                      { className: this.props.cancelButtonClass, onClick: this.handleAction.bind(this, 'cancel') },
                      this.cancelButtonText()
                    )
                  ),
                  React.createElement(
                    View,
                    { show: this.props.showConfirmButton },
                    React.createElement(
                      Button,
                      { className: this.classNames('el-button--primary', this.props.confirmButtonClass), onClick: this.handleAction.bind(this, 'confirm') },
                      this.confirmButtonText()
                    )
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement(
        Transition,
        { name: 'v-modal', duration: '200' },
        React.createElement(
          View,
          { key: this.state.visible, show: this.state.visible },
          React.createElement('div', { className: 'v-modal', style: { zIndex: 1006 } })
        )
      )
    );
  };

  return MessageBox;
}(Component);

export default MessageBox;


MessageBox.propTypes = {
  modal: PropTypes.oneOf(['alert', 'confirm', 'prompt']),
  type: PropTypes.oneOf(['success', 'warning', 'info', 'error']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showInput: PropTypes.bool,
  showClose: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  cancelButtonClass: PropTypes.string,
  confirmButtonClass: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputPattern: PropTypes.regex,
  inputValidator: PropTypes.func,
  inputErrorMessage: PropTypes.string,
  promise: PropTypes.object,
  onClose: PropTypes.func
};

MessageBox.defaultProps = {
  title: '提示',
  showClose: true,
  showConfirmButton: true
};