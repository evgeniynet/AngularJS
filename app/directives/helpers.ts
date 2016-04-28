import * as Config from '../providers/config';
 
export function saveCache(url, data) {
    localStorage.setItem(url, JSON.stringify(data || {})); 
}
    
export function loadCache(url) {
    return JSON.parse(localStorage.getItem(url)); 
}
    
    //global helper functions
export function GooglelogOut(mess) {
    var isExtension = false;
    if (!isExtension && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + Config.MobileSite;
        //document.location.href = Config.MobileSite + addp("login.html","f",mess);
    }
    else
        ;//window.location = "login.html" + mess;
    }
    
export function parseXml(xmlStr) {
    if (!xmlStr || xmlStr.length < 9)
        return null;
    if (typeof window.DOMParser != "undefined") {
         return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
    } else {
        console.log("No XML parser found");
        return null;
    }
}

export function getInfo4Extension()
{
    var isExtension = false;
    if (isExtension)
    {
        var loginStr = "login?t=" + localStorage.getItem("userKey") +
            "&o=" + localStorage.getItem('userOrgKey') +
            "&i=" + localStorage.getItem('userInstanceKey'); 
        window.top.postMessage(loginStr,"*");
    }
}

export function addp (url: string, param: string, value?: any) {
        if (!url || !value || !param)
            return url;
        var pos = url.indexOf(param + '=');
        //if parameter exists
        if (pos != -1)
            return url.slice(0, pos + param.length) + '=' + value;
        var ch = url.indexOf('?') > 0 ? '&' : '?';
        return url + ch + param + '=' + value;
 }

    export function fullapplink (site, ticketkey, inst,org){
        let url = Config.AppSite;
        url = addp(url, "tkt", ticketkey);
        url = addp(url, "dept", inst);
        return addp(url, "org", org);
        /*
    if (isPhonegap) {
        //alert("gap!");
        $("."+classn).on('click', function (e) {
            openURLsystem(urlString);});
    } else if (isExtension) {

        $("."+classn).on('click', function (e) {
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
    */
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
    
export const FileUrlHelper = {
        isPhonegap : function () {return Config.isPhonegap;},
        ReplaceAll : function (note, find, replace) {
            return note.split(find).join(replace);
        },

        checkURL : function (url) {
            if(!url) return false;
            return(url.trim().match(/(jpeg|jpg|gif|png)$/i) !== null);
        },

        matchKey : function (search, array){
            for(var key in array) {
                if(key.indexOf(search) != -1) {
                    return key;
                }
            }
            return "";
        },

        addUrls : function (note, files)
        {
            var length = files.length;
            var filearray = {};
            if (length)
            {
                var inlineImg = note.match(/\[cid:[^\[\]]*]/g);
                for(var i = 0; i < length; i++){
                    var name = files[i].name;
                    note = FileUrlHelper.ReplaceAll(note, " "+name, files[i].is_deleted ? "" :  FileUrlHelper.getFileLink(files[i].url,name));
                    filearray['"'+name.substring(0, name.lastIndexOf("."))+'"'] = files[i].url;
                }
                if (inlineImg)
                {
                    for(var j = 0; j < inlineImg.length; j++){
                        var filename = inlineImg[j].slice(5, -1); 
                        if (filename.indexOf("_link_") >= 0)
                        {
                            filename = filename.replace("_link_", "");
                        }
                        else
                        {
                            filename = FileUrlHelper.matchKey(filename.slice(0, -3), filearray);
                            if(filename && typeof(filearray[filename]) !== 'undefined' ) {
                                filename = filearray[filename];
                            }
                            else
                                filename = "";
                        }
                        if (filename.length)
                            note = FileUrlHelper.ReplaceAll(note, inlineImg[j], FileUrlHelper.getFileLink(filename,inlineImg[j].slice(5, -1)));
                    }
                }
                //note = note.replaceAll("Following file was ", "");
                if (length > 1) {
                    //note = note.replaceAll("Following files were ", "");
                    note = FileUrlHelper.ReplaceAll(note, "a>,", "a>");
                }
                //note = note.replaceAll("uploaded:", "");
                note = FileUrlHelper.ReplaceAll(note, "a>.", "a>");
                //note += "<div class='attachmentBorder'></div>"; 
            }
            return note;
        },
        //get file of the folllowing options: file, name
        getFileLink : function (file,name)
        {
            var img ="";
            if (FileUrlHelper.checkURL(file) || FileUrlHelper.checkURL(name))
                img = "<img class=\"attachment\" src=\"" + file + "\">";
            else
                img = "<ion-icon name=\"md-document\" role=img dark class=\"button_circle ion-md-document\" aria-label=\"md-document\"></ion-icon>&nbsp;" + (name ||  decodeURIComponent(file.split("/").slice(-1))) + "<p></p>";
            return "<p/><a class=\"comment_image_link\"" + 
                (!FileUrlHelper.isPhonegap ? (" href=# onclick='openURL(\"" +file + "\")'>"+img+"</a>") :
                 (" target=\"_blank\" href=\"" +file + "\">"+img + "</a>"));
                //TODO: revert !FileUrlHelper.isPhonegap to FileUrlHelper.isPhonegap
        }
    };

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
export function getFullName (firstname,lastname,email,name?) {
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
