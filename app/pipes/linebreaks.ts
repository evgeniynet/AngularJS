import {Pipe} from '@angular/core';

@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
        value = value || "";
        value = value.replace(/&lt;br&gt;/gi, "\n").replace(/\r/g, '').replace(/\n\s*\n/g, '\n').replace(/\n/g, "<br>");
        return value;
    }
}