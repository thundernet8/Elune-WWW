import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Component, View, PropTypes } from '../../libs';

var Dialog = function (_Component) {
  _inherits(Dialog, _Component);

  function Dialog(props) {
    _classCallCheck(this, Dialog);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      bodyOverflow: ''
    };
    return _this;
  }

  Dialog.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

    if (this.willOpen(this.props, nextProps)) {
      if (this.props.lockScroll && document.body && document.body.style) {
        if (!this.state.bodyOverflow) {
          this.setState({
            bodyOverflow: document.body.style.overflow
          });
        }
        document.body.style.overflow = 'hidden';
      }
    }

    if (this.willClose(this.props, nextProps) && this.props.lockScroll) {
      if (this.props.modal && this.state.bodyOverflow !== 'hidden' && document.body && document.body.style) {
        document.body.style.overflow = this.state.bodyOverflow;
      }
    }
  };

  Dialog.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.willOpen(prevProps, this.props)) {
      this.refs.wrap.focus();
    }
  };

  Dialog.prototype.componentWillUnmount = function componentWillUnmount() {
    if (document.body && document.body.style) document.body.style.removeProperty('overflow');
  };

  Dialog.prototype.onKeyDown = function onKeyDown(e) {
    if (this.props.closeOnPressEscape && e.keyCode === 27) {
      this.close(e);
    }
  };

  Dialog.prototype.handleWrapperClick = function handleWrapperClick(e) {
    if (e.target instanceof HTMLDivElement) {
      if (this.props.closeOnClickModal && e.target === e.currentTarget) {
        this.close(e);
      }
    }
  };

  Dialog.prototype.close = function close(e) {
    this.props.onCancel(e);
  };

  Dialog.prototype.willOpen = function willOpen(prevProps, nextProps) {
    return !prevProps.visible && nextProps.visible;
  };

  Dialog.prototype.willClose = function willClose(prevProps, nextProps) {
    return prevProps.visible && !nextProps.visible;
  };

  Dialog.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        visible = _props.visible,
        title = _props.title,
        size = _props.size,
        top = _props.top,
        modal = _props.modal,
        customClass = _props.customClass;


    return React.createElement(
      View,
      { show: visible },
      React.createElement(
        'div',
        {
          style: this.style({ zIndex: 1013 }),
          className: this.className('el-dialog__wrapper'),
          onClick: function onClick(e) {
            return _this2.handleWrapperClick(e);
          },
          ref: 'wrap',
          tabIndex: -1,
          onKeyDown: function onKeyDown(e) {
            return _this2.onKeyDown(e);
          }
        },
        React.createElement(
          'div',
          {
            ref: 'dialog',
            className: this.classNames("el-dialog", 'el-dialog--' + size, customClass),
            style: size === 'full' ? {} : { 'marginBottom': '50px', 'top': top }
          },
          React.createElement(
            'div',
            { className: 'el-dialog__header' },
            React.createElement(
              'span',
              { className: 'el-dialog__title' },
              title
            ),
            React.createElement(
              'div',
              { className: 'el-dialog__headerbtn' },
              React.createElement('i', { className: 'el-dialog__close el-icon el-icon-close', onClick: function onClick(e) {
                  return _this2.close(e);
                } })
            )
          ),
          this.props.children
        )
      ),
      React.createElement(
        View,
        { show: modal, transition: 'v-modal', transitionKey: 'dialog-v-modal' },
        React.createElement('div', { className: 'v-modal', style: { zIndex: 1012 } })
      )
    );
  };

  return Dialog;
}(Component);

Dialog.defaultProps = {
  visible: false,
  title: '',
  size: 'small',
  top: '15%',
  modal: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true
};
export default Dialog;


Dialog.propTypes = {
  // 控制对话框是否可见
  visible: PropTypes.bool.isRequired,
  // 标题
  title: PropTypes.string,
  // 大小 (tiny/small/large/full)
  size: PropTypes.string,
  // top 值（仅在 size 不为 full 时有效）
  top: PropTypes.string,
  // 控制遮罩层展示
  modal: PropTypes.bool,
  // Dialog 的自定义类名
  customClass: PropTypes.string,
  // 是否在 Dialog 出现时将 body 滚动锁定
  lockScroll: PropTypes.bool,
  // 是否可以通过点击 modal 关闭 Dialog
  closeOnClickModal: PropTypes.bool,
  // 是否可以通过按下 ESC 关闭 Dialog
  closeOnPressEscape: PropTypes.bool,
  // 点击遮罩层或右上角叉或取消按钮的回调
  onCancel: PropTypes.func.isRequired
};