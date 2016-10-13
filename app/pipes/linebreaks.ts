import {Pipe} from '@angular/core';

@Pipe({
    name: 'Linebreaks'
})
export class LinebreaksPipe {
    transform(value, args) {
        value = (value || "").trim();
        if (value.length)
        	value = value
				.replace(/&lt;br&gt;/gi, "\n")
				.replace(/<br\s*[\/]?>/gi, "\n")
				.replace(/\n/g, "&nbsp;<p></p>");
        //value = value.replace(/&lt;br&gt;/gi, "\n").replace(/\r/g, '').replace(/\n\s*\n/g, '\n').replace(/\n/g, "<br>");
        return value;
    }
}