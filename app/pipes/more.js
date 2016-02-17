import {Pipe} from 'angular2/core';

@Pipe({
    name: 'More'
})
export class MorePipe {
    transform(value, args) {
        if (!value)
            return "";
        args = args.length ? args :  [100]; 
        value = value || 0;
        let max = args[0]; 
        if (value >= max)
        value = (max-1) + "<sup>+</sup>";
        
        return '<div class="item-inner"><ion-label>'+value+'</ion-label></div>';
    }
}