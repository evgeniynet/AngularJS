import {Pipe} from '@angular/core';

const md5Hex = require('md5-hex');

declare var require: any;

@Pipe({
    name: 'Gravatar'
})
export class GravatarPipe {
    transform(value, args) {
    	let hash = "";
        if (value) {
            hash = md5Hex(value);
        }
        else
        	return "img/def_ava.png";
        return `https://secure.gravatar.com/avatar/${hash}?s=80&d=mm`;
    }
}