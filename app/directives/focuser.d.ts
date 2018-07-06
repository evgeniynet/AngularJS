import { Renderer, ElementRef } from "@angular/core";
export declare class Focuser {
    renderer: Renderer;
    elementRef: ElementRef;
    constructor(renderer: Renderer, elementRef: ElementRef);
    ngOnInit(): void;
}
