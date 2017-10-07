import React from 'react';
import ReactDOM from 'react-dom';

import Notification from './Notification';

export default function NotificationCenter() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var type = arguments[1];

  var div = document.createElement('div'),
      className = 'el-notification';

  document.body.appendChild(div);

  if (typeof props === 'string' || React.isValidElement(props)) {
    props = {
      message: props
    };
  }

  if (type) {
    props.type = type;
  }

  var instances = document.getElementsByClassName(className);

  props.top = props.offset || 0;

  for (var i = 0, len = instances.length; i < len; i++) {
    props.top += instances[i].offsetHeight + 16;
  }

  props.top += 16;

  var component = React.createElement(Notification, Object.assign({}, props, {
    willUnmount: function willUnmount() {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);

      setTimeout(function () {
        var instances = document.querySelectorAll('.el-notification');

        for (var _i = 0, _len = instances.length; _i < _len; _i++) {
          var element = instances[_i];

          if (element.offsetTop > props.offsetHeight) {
            element.style.top = element.offsetTop - props.offsetHeight - 16 + 'px';
          }
        }
      });

      if (props.onClose instanceof Function) {
        props.onClose();
      }
    }
  }));

  ReactDOM.render(component, div, function () {
    setTimeout(function () {
      props.offsetHeight = div.getElementsByClassName(className)[0].offsetHeight;
    });
  });
}

/* eslint-disable */
['success', 'warning', 'info', 'error'].forEach(function (type) {
  NotificationCenter[type] = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return NotificationCenter(options, type);
  };
});
/* eslint-enable */