import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[more100]'
})
export class More100Directive {

    constructor(element: ElementRef){
    	//var me = this;
        let max = 100; console.log(element.nativeElement.textContent);
        var value = parseInt(element.nativeElement.textContent, 10);
        console.log(value);
        if (value >= max)
            element.nativeElement.innerHTML = "99<sup>+</sup>";
    }
}  