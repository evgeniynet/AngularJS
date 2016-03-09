import {Pipe} from 'angular2/core';

var isPhonegap = false;

var FileUrlHelper = {
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
            img = "<i class='ion-android-document ion-3x ionColor'></i> &nbsp;" + (name ||  decodeURIComponent(file.split("/").slice(-1))) + "<p></p>";
        return "<p/><a class=\"comment_image_link\"" + 
            (isPhonegap ? (" href=# onclick='openURL(\"" +file + "\")'>"+img+"</a>") :
             (" target=\"_blank\" href=\"" +file + "\">"+img + "</a>"));
    }
};

@Pipe({
    name: 'Files'
})
export class FilesPipe {
    transform(value, args) {
       
        value = value || "";
        
        var files = args[0] || [];   
        
        if (!value || !files || files.length == 0 || ! (~value.indexOf("cid:") || ~value.indexOf("ollowing file")) return value;
        
        files.sort(function(a, b){
            return b.name.length - a.name.length;
        });
        
        value = FileUrlHelper.addUrls(value, files);
        
        return value;
    }
}