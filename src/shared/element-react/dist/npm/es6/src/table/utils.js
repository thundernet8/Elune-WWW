var scrollBarWidth = void 0;

export var getScrollBarWidth = function getScrollBarWidth() {
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  var outer = document.createElement('div');
  var body = document.body || outer;

  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  var inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;
  var outerParent = outer.parentNode || body;
  outerParent.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};