import {Pipe} from 'angular2/core';

@Pipe({
    name: 'Daysold'
})
export class DaysoldPipe {
    transform(value) {
        value = value || 0;
        var daysOld: number = value / 60;
        var result : string = "";

                    // check to see if the ticket is less than a day old
                    if (!value || value < 15)
                        result = "a minute ago"; 
                    else if(daysOld > 24){
                        result = parseInt((daysOld / 24).toString()) + " days ago";
                    } else {
                        result = parseInt(daysOld.toString()) + " hours ago";
                    }
                    return result;
    }
}