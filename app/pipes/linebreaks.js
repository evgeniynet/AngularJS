import {Pipe} from 'angular2/core';

@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
        value = value || "";
        value = value.replace(/&lt;br&gt;/gi, "\n").replace(/\n\s*\n/g, '\n').replace(/\n/g, "<br>");
        return value;
    }
}