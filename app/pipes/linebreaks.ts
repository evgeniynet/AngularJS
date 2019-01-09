import {Pipe} from '@angular/core';
import {linebreaks} from '../directives/helpers';


@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
    	value = value.replace(/^<p>(<br>)?(\r)?/, '').replace(/^<p>(<br>)?(\n)?/,"");
        return linebreaks(value, args);
    }
}