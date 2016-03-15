export function saveConfig(config, key, org, inst) {
    config.stat = {};
    config.key =  key || "";
    config.org = org || "";
    config.instance = inst || "";
    localStorage.current = JSON.stringify(config); 
}
 
export function saveCache(url, data) {
    localStorage.setItem(url, JSON.stringify(data || {})); 
}
    
export function loadCache(url) {
    return JSON.parse(localStorage.getItem(url)); 
}
    
    //global helper functions
    function GooglelogOut(mess) {
        if (!isExtension && !confirm("Do you want to stay logged in Google account?")) {
            var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
            document.location.href = MobileSite + "login.html".addUrlParam("f",mess);
        }
        else
            window.location = "login.html" + mess;
    }

export function getInfo4Extension()
{
    if (isExtension)
    {
        var loginStr = "login?t=" + localStorage.getItem("userKey") +
            "&o=" + localStorage.getItem('userOrgKey') +
            "&i=" + localStorage.getItem('userInstanceKey'); 
        window.top.postMessage(loginStr,"*");
    }
}

export function fullapplink (classn, urlString){
    if (isPhonegap) {
        //alert("gap!");
        $("."+classn).on('click', function (e) {
            e.preventDefault();
            openURLsystem(urlString);});
    } else if (isExtension) {

        $("."+classn).on('click', function (e) {
            e.preventDefault();
            //alert('Please register in new window and reopen Sherpadesk extension again.');
            var origOpenFunc = window.__proto__.open;
            origOpenFunc.apply(window, [urlString, "_blank"]); 
        });
    }
    else
    {
        $("."+classn).attr("target", "_blank");
        $("."+classn).attr("href", urlString);
    }

    return urlString;
}

//HTML encode
export function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;amp;')
        .replace(/&quot;/g, '&amp;quot;')
        .replace(/&apos;/g, '&amp;apos;')
        .replace(/&lt;/g, '&amp;lt;')
        .replace(/&gt;/g, '&amp;gt;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    //.replace(/\n/g, "<br />")
    ;
}

//HTML decode
export function symbolEscape(str) {
    return String(str)
    //.replace(/&lt;/g, '<')
    // .replace(/&gt;/g, '>')
    // .replace(/&quot;/g, '"')
    // .replace(/&apos;/g, "'")
    // .replace(/&/g, '&amp;')
        .replace(/&lt;br&gt;/gi, "\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/\n/g, "<p></p>");

}
 
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
