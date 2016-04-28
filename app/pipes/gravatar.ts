import {Pipe} from 'angular2/core';

const md5Hex = require('md5-hex');

declare var require: any;

@Pipe({
    name: 'Gravatar'
})
export class GravatarPipe {
    transform(value, args) {
        if (value) {
            const hash = md5Hex(value);
            value = `https://secure.gravatar.com/avatar/${hash}?s=80&d=mm`;
        }
        return value;
    }
}