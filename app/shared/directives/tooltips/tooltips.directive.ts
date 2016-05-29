import {Directive, AfterViewInit, Renderer, ElementRef} from "angular2/core";

@Directive({
    selector: '[tooltip]',
    host: {
        '(onmouseover)': 'mouseOver()',
        '(onmouseout)': 'mouseOut()',
    }
})
export class ToolTipsDirective implements AfterViewInit{

    constructor(private _el: ElementRef, private renderer: Renderer){}

    /**
     *  for now, i use the tooltip feature from materialiaze CSS
     *  but we can override this and add custom behavior with the mouseOver and mouseOut function
     */
    ngAfterViewInit() {
        $(this._el.nativeElement).tooltip({delay: 50});
    }

    mouseOver(){
        //your custom code here
    }

    mouseOut(){
        //your custom code here
    }
}