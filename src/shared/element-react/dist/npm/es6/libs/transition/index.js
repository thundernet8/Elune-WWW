import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

var Transition = function (_Component) {
  _inherits(Transition, _Component);

  function Transition() {
    _classCallCheck(this, Transition);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Transition.prototype.render = function render() {
    return React.createElement(ReactCSSTransitionGroup, {
      transitionName: this.props.name,
      transitionEnterTimeout: Number(this.props.duration),
      transitionLeaveTimeout: Number(this.props.duration),
      component: this.props.component,
      className: this.props.className,
      style: this.props.style
    }, this.props.children);
  };

  return Transition;
}(Component);

export default Transition;


Transition.propTypes = {
  name: PropTypes.string.isRequired,
  duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  component: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

Transition.defaultProps = {
  duration: 300
};