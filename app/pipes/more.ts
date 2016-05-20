import {Pipe} from '@angular/core';

@Pipe({
    name: 'More'
})
export class MorePipe {
    transform(value, args) {
        args = args || [100, "VV"]; 
        value = value || 0;
        let max = args[0]; 
        let template = args[1] || "VV"; 
        if (value >= max)
        value = (max-1) + "<sup>+</sup>";
        value = template.replace("VV", value.toString());
        return value;
    }
}