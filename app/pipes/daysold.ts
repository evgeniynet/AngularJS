import {Pipe} from 'angular2/core';

@Pipe({
    name: 'Daysold'
})
export class DaysoldPipe {
    transform(value) {
        value = value || 0;
        var daysOld = value / 60;

                    // check to see if the ticket is less than a day old
                    if (!value || value < 15)
                        daysOld = "a minute ago"; 
                    else if(daysOld > 24){
                        daysOld = parseInt(daysOld/24) +" days ago";
                    } else {
                        daysOld = parseInt(daysOld) +" hours ago";
                    }
        return daysOld;
    }
}