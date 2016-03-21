import {Pipe} from 'angular2/core';
import {FileUrlHelper} from '../directives/helpers';

var isPhonegap = false;

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