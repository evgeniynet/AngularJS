import {Pipe} from '@angular/core';
import {FileUrlHelper} from '../directives/helpers';

@Pipe({
    name: 'Files'
})
export class FilesPipe {
    transform(value, args) {

        var isPhonegap = localStorage.getItem("isPhonegap") === "true";
       
        value = value || "";
        
        var files = args || [];   
        
        if (!value || !files || files.length == 0 || 
            ! (~value.indexOf("cid:") || ~value.indexOf("ollowing file"))) return value;
        
        files.sort(function(a, b){
            return b.name.length - a.name.length;
        });
        
        value = FileUrlHelper.addUrls(value, files);
        
        return value;
    }
}