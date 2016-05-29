import {Directive, ElementRef, Renderer, AfterContentInit} from "angular2/core";

@Directive({
    selector: '[autoScroll]'
})
export class AutoScrollDirective{

    private _isLocked = true;
    private _oldScrollHeight = 0;

    private mutationObserver:MutationObserver;


    constructor(private _el: ElementRef, private renderer: Renderer){
        this._isLocked = false;

        //create a DOM Observer and declaring it's callback function
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {

                //we set the ul scroll to it's height at each li element appended on the DOM
                this._el.nativeElement.scrollTop = this._el.nativeElement.scrollHeight;
            });
        });
        var config = { attributes: true, childList: true, characterData: true };

        //suscribe to the observer
        this.mutationObserver.observe(this._el.nativeElement, config);
    }
}