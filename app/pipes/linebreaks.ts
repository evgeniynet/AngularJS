import {Pipe} from '@angular/core';
import {linebreaks} from '../directives/helpers';


@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
    	value = value.replace(/^<p>(<\/p>)?(\r)?/, '').replace(/^<p>(<\/p>)?(\n)?/,"");
        return linebreaks(value, args);
    }
}