import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

var View = function (_Component) {
  _inherits(View, _Component);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  View.prototype.render = function render() {
    var style = this.props.hasOwnProperty('show') && !this.props.show && {
      display: 'none'
    };

    if (React.Children.count(this.props.children) > 1) {
      return React.createElement(this.props.component, {
        style: Object.assign({}, this.props.style, style),
        className: this.props.className
      }, this.props.children);
    } else {
      return React.cloneElement(this.props.children, {
        style: Object.assign({}, this.props.children.props.style, style)
      });
    }
  };

  return View;
}(Component);

/* eslint-disable */


export default View;
View.propTypes = {
  show: PropTypes.any,
  component: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};
/* eslint-enable */

View.defaultProps = {
  component: 'span'
};