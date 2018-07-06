"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = require("../providers/config");
function saveCache(url, data) {
    localStorage.setItem(url, JSON.stringify(data || {}));
}
exports.saveCache = saveCache;
function loadCache(url) {
    return JSON.parse(localStorage.getItem(url));
}
exports.loadCache = loadCache;
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
exports.getParameterByName = getParameterByName;
function cleanQuerystring(param, value) {
    var url = addp(location.origin + location.pathname, param, value);
    try {
        window.history.replaceState({}, '', url);
    }
    catch (err) { }
}
exports.cleanQuerystring = cleanQuerystring;
function GooglelogOut(mess) {
    var isExtension = false;
    if (!isExtension && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + Config.MobileSite;
    }
    else
        ;
}
exports.GooglelogOut = GooglelogOut;
function parseXml(xmlStr) {
    if (!xmlStr || xmlStr.length < 9)
        return null;
    if (typeof window.DOMParser != "undefined") {
        return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
    }
    else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    }
    else {
        console.log("No XML parser found");
        return null;
    }
}
exports.parseXml = parseXml;
function addp(url, param, value) {
    if (!url || !value || !param)
        return url;
    var pos = url.indexOf(param + '=');
    if (pos != -1)
        return url.slice(0, pos + param.length) + '=' + value;
    var ch = url.indexOf('?') > 0 ? '&' : '?';
    return url + ch + param + '=' + value;
}
exports.addp = addp;
function fullapplink(site, ticketkey, inst, org) {
    var url = Config.AppSite;
    if (ticketkey)
        url = addp(url, "tkt", ticketkey);
    url = addp(url, "dept", inst);
    url = addp(url, "org", org);
    openURLsystem(url);
}
exports.fullapplink = fullapplink;
function mailtolink(ticketkey, inst, org) {
    var url = "mailto:r." + org + "." + inst + "." + ticketkey + "@app.sherpadesk.com";
    openURLsystem(url);
}
exports.mailtolink = mailtolink;
function htmlEscape(str) {
    return String(str)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
exports.htmlEscape = htmlEscape;
function linebreaks(value, args) {
    value = (value || "").trim();
    var is_edit = args;
    if (value.length)
        value = value
            .replace(/&lt;br&gt;/gi, "\n")
            .replace(/<br\s*[\/]?>/gi, "\n")
            .replace(/\r/g, '')
            .replace(/\n\n/g, is_edit ? "\n" : "<br>");
    return value;
}
exports.linebreaks = linebreaks;
exports.FileUrlHelper = {
    isPhonegap: function () { return localStorage.getItem("isPhonegap") === "true"; },
    ReplaceAll: function (note, find, replace) {
        return note.split(find).join(replace);
    },
    checkURL: function (url) {
        if (!url)
            return false;
        return (url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) !== null);
    },
    matchKey: function (search, array) {
        for (var key in array) {
            if (key.indexOf(search) != -1) {
                return key;
            }
        }
        return "";
    },
    addUrls: function (note, files) {
        var length = files.length;
        var filearray = {};
        if (length) {
            var inlineImg = note.match(/\[cid:[^\[\]]*]/g);
            for (var i = 0; i < length; i++) {
                var name = files[i].name;
                note = exports.FileUrlHelper.ReplaceAll(note, " " + name, files[i].is_deleted ? "" : exports.FileUrlHelper.getFileLink(files[i].url, name));
                filearray['"' + name.substring(0, name.lastIndexOf(".")) + '"'] = files[i].url;
            }
            if (inlineImg) {
                for (var j = 0; j < inlineImg.length; j++) {
                    var filename = inlineImg[j].slice(5, -1);
                    if (filename.indexOf("_link_") >= 0) {
                        filename = filename.replace("_link_", "");
                    }
                    else {
                        filename = exports.FileUrlHelper.matchKey(filename.slice(0, -3), filearray);
                        if (filename && typeof (filearray[filename]) !== 'undefined') {
                            filename = filearray[filename];
                        }
                        else
                            filename = "";
                    }
                    if (filename.length)
                        note = exports.FileUrlHelper.ReplaceAll(note, inlineImg[j], exports.FileUrlHelper.getFileLink(filename, inlineImg[j].slice(5, -1)));
                }
            }
            if (length > 1) {
                note = exports.FileUrlHelper.ReplaceAll(note, "a>,", "a>");
            }
            note = exports.FileUrlHelper.ReplaceAll(note, "a>.", "a>");
        }
        return note;
    },
    getFileLink: function (file, name) {
        var img = "";
        if (exports.FileUrlHelper.checkURL(file) || exports.FileUrlHelper.checkURL(name))
            img = "<img class=\"attachment\" src=\"" + file + "\">";
        else
            img = "<ion-icon name=\"md-document\" role=img dark class=\"button_circle ion-md-document\" aria-label=\"md-document\"></ion-icon>&nbsp;<span class=\"decoration width100 color\">" + (name || decodeURIComponent(file.split("/").slice(-1))) + "</span><p></p>";
        return "<p/><a class=\"comment_image_link files-tkts color margin-right_10\"" +
            (exports.FileUrlHelper.isPhonegap() ? (" href=# onclick='window.open(\"" + file + "\", \"_blank\", \"location=no,EnableViewPortScale=yes\")'>" + img + "</a>") :
                (" target=\"_blank\" href=\"" + file + "\">" + img + "</a>"));
    }
};
function openURL(urlString) {
    return window.open(urlString, '_blank', 'location=no,EnableViewPortScale=yes');
}
exports.openURL = openURL;
function openURLsystem(urlString) {
    if (localStorage.getItem("isPhonegap") === "true" && device) {
        if (device.platform.toUpperCase() === 'ANDROID') {
            return navigator.app.loadUrl(urlString, { openExternal: true });
        }
        else if (device.platform.toUpperCase() === 'IOS') {
            return window.open(urlString, '_system');
        }
    }
    return window.open(urlString, '_blank');
}
exports.openURLsystem = openURLsystem;
function symbolEscape(str) {
    return String(str)
        .replace(/&lt;br&gt;/gi, "\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/\n/g, "<p></p>");
}
exports.symbolEscape = symbolEscape;
function getPickerDateTimeFormat(showmonth, istime) {
    var format = "";
    if (!showmonth)
        format = localStorage.getItem("dateformat") !== "1" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    else
        format = localStorage.getItem("dateformat") !== "1" ? "MMM DD / YYYY" : "DD MMM YYYY";
    return format + (istime ? (localStorage.getItem("timeformat") !== "1" ? " hh:mm A" : " HH:mm") : "");
}
exports.getPickerDateTimeFormat = getPickerDateTimeFormat;
function getDateTimeFormat(showmonth, istime) {
    var format = "";
    if (!showmonth)
        format = localStorage.getItem("dateformat") !== "1" ? "m/d/yy" : "d/m/yy";
    else
        format = localStorage.getItem("dateformat") !== "1" ? "mmm d / yyyy" : "d mmm yyyy";
    return format + (istime ? (localStorage.getItem("timeformat") !== "1" ? " hh:MM TT" : " HH:MM") : "");
}
function getDateTime(date, showmonth, istime) {
    return dateFormat(date, getDateTimeFormat(showmonth, istime));
}
exports.getDateTime = getDateTime;
function getCurrency(value) {
    return localStorage.getItem("currency") + Number(value || "0").toFixed(2).toString();
}
exports.getCurrency = getCurrency;
function getFullName(firstname, lastname, email, name) {
    var fname = "";
    if (name)
        fname = name + " ";
    if (lastname)
        fname += lastname + " ";
    if (firstname)
        fname += firstname + " ";
    if (email && email.indexOf("@") > 0) {
        if (!fname.trim())
            fname = email;
        else if (name)
            fname += " (" + email + ")";
    }
    return fname || "NoName";
}
exports.getFullName = getFullName;
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
exports.toTitleCase = toTitleCase;
function getappTrackConversion(id) {
    var r = document.referrer;
    var h = window.location.href;
    var p = '1';
    var e = id || '';
    var listing_id = '102459';
    var a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.src = 'https://www.getapp.com/conversion/' + encodeURIComponent(listing_id) +
        '/r.js?p=' + encodeURIComponent(p) + '&h=' + encodeURIComponent(h) +
        '&r=' + encodeURIComponent(r) + '&e=' + encodeURIComponent(e);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
}
exports.getappTrackConversion = getappTrackConversion;
function spicePixelTrackConversion() {
    var img = new Image();
    var div = document.getElementsByTagName('body')[0];
    img.onload = function () {
        div.appendChild(img);
    };
    img.src = 'http://px.spiceworks.com/px/8oxz';
    var SWPX = SWPX || {};
    SWPX.cmd = SWPX.cmd || [];
    SWPX.cmd.push(function () {
        SWPX.pixel.setPixel('8oxz');
        SWPX.pixel.setIdentifier('121806');
        SWPX.pixel.fire();
    });
}
exports.spicePixelTrackConversion = spicePixelTrackConversion;
var dateFormat = function (date, mask, utc) {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len)
            val = "0" + val;
        return val;
    };
    return function (date, mask, utc) {
        var dF = dateFormat;
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
            throw SyntaxError("invalid date");
        mask = String(dF.masks[mask] || mask || dF.masks["default"]);
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
            d: d,
            dd: pad(d),
            ddd: dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            tt: H < 12 ? "am" : "pm",
            T: H < 12 ? "A" : "P",
            TT: H < 12 ? "AM" : "PM",
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : Number(d % 100 - d % 10 != 10) * d % 10]
        };
        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};
