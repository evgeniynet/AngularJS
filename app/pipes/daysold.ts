import {Pipe} from '@angular/core';

@Pipe({
    name: 'Daysold'
})
export class DaysoldPipe {
    transform(value) {
        value = value || 0;
        if (isNaN(value))
            value = Math.round((new Date().getTime() - +new Date(value + "Z")) / 60000);
        var daysOld: number = value / 60;
        var result : string = "";

                    // check to see if the ticket is less than a day old
                    if (!value || value < 2)
                        result = "a minute ago"; 
                    else if (value < 60)
                        result = "a " + value + " minutes ago"; 
                    else if (value < 120)
                        result = "one hour ago"; 
                    else if(daysOld > 24){
                        var days = parseInt((daysOld / 24).toString());
                        result = days + " day(s)";
                        var hours = parseInt((daysOld - days * 24).toString());
                        if (hours > 0)
                           result += " " + hours + " hour(s)";
                        result += " ago";
                    } else {
                        result = parseInt(daysOld.toString()) + " hour(s) ago";
                    }
                    return result;
    } 
}