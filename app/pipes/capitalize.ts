import {Pipe} from '@angular/core';

@Pipe({
    name: 'Capitalize'
})
export class CapitalizePipe {
    transform(value, args) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }
}