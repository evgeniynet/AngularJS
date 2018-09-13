import {Pipe} from '@angular/core';

@Pipe({
    name: 'Daysago'
})
export class DaysagoPipe {
    transform(value) {
        console.log("startvalue", value);
        value = value || 0;
        if (isNaN(value))
            value = Math.round((new Date().getTime() - +new Date(value + "Z")) / 60000);
        var daysAgo: number = value / 60;
        console.log("daysago", daysAgo);
        var result : string = "";
                if (!value || value < 2)
                  result = "0 days ago"; 
                else
                  result = parseInt((daysAgo / 24).toString()) + " days ago";
                    console.log("result", result);
                    return result;
    } 
}