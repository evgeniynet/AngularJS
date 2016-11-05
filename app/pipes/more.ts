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
        if (value >= max){
        value = (max-1) + "<sup>+</sup>";
        }
        else {
          let s_value = value.toString();
        if(~template.indexOf("$") || ~s_value.indexOf("."))
           value = value.toFixed(value > 99 && ~s_value.indexOf(".00") ? 0 : 2);
        }
        if (~template.indexOf("$"))
            template = template.replace("$", localStorage.getItem("currency"));
        value = template.replace("VV", value);
        return value;
    }
}