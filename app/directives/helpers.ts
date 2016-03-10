export function getCurrency(value, currency) {
    if (!value)
        value = "0";
    return currency + Number(value).toFixed(2).toString();
}
    
    //get the full name of the following options:firstname, lastname, email,name
export function getFullName (firstname,lastname,email,name) {
        var fname = "";
        if (name)
            fname = name + " ";
        if (lastname)
            fname += lastname + " ";
        if (firstname)
            fname += firstname + " ";
        if (email && email.indexOf("@") > 0){
            if (!fname.trim())
                fname = email;
            else if (name)
                fname += " (" + email + ")";
        }
        return fname || "NoName";
    }

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

export function hasScrollbar() {

  if (typeof window.top.innerWidth === 'number') {
    return window.top.innerWidth > window.top.document.documentElement.clientWidth;
  }

  // rootElem for quirksmode
  var rootElem = window.top.document.documentElement || window.top.document.body;

  // Check overflow style property on body for fauxscrollbars
  var overflowStyle;

  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowStyle = rootElem.currentStyle.overflow;
  }

  overflowStyle = overflowStyle || window.top.getComputedStyle(rootElem, '').overflow;

  // Also need to check the Y axis overflow
  var overflowYStyle;

  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowYStyle = rootElem.currentStyle.overflowY;
  }

  overflowYStyle = overflowYStyle || window.top.getComputedStyle(rootElem, '').overflowY;

  var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
  var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
  var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

  return (contentOverflows && overflowShown) || (alwaysShowScroll)
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
