import {Directive, Renderer, ElementRef, OnDestroy, OnInit, AfterViewInit} from "angular2/core";

@Directive({
    selector: '[fadeToggle]',
})
export class FadeToggleDirective implements OnInit, OnDestroy, AfterViewInit{

    constructor(private _el: ElementRef, private renderer: Renderer){}

    ngOnInit() {
        $(this._el.nativeElement).hide();
    }

    ngAfterViewInit() {
        $(this._el.nativeElement).fadeIn(1000);
    }

    ngOnDestroy(){
        $(this._el.nativeElement).fadeOut(1000);
    }

}