import {Pipe} from '@angular/core';
import {linebreaks} from '../directives/helpers';


@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
        return linebreaks(value, args);
    }
}