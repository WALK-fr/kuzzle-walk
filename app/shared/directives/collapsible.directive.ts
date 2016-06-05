import {Directive, ElementRef, Renderer, AfterViewInit} from "@angular/core";

// this is used to accept jquery token at compilation time
declare var $:any;

@Directive({
    selector: '[collapsible]'
})
export class CollapsibleDirective implements AfterViewInit{

    constructor(private _el: ElementRef, private _renderer: Renderer){}

    ngAfterViewInit() {
        $(this._el.nativeElement).collapsible({});
    }
}