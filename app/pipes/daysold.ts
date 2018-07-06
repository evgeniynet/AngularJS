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
                        result = parseInt((daysOld / 24).toString()) + " days ago";
                    } else {
                        result = parseInt(daysOld.toString()) + " hours ago";
                    }
                    return result;
    } 
}