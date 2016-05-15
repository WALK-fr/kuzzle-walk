import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'navbar',
    templateUrl: 'app/shared/components/navbar.component.html'
})
export class NavbarComponent {
    @Input() isChatActivated = false;
    @Output('toggle-chat') toggle = new EventEmitter();

    toggleChat() {
        this.toggle.emit({});
    }
}
