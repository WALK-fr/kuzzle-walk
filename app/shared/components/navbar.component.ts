import {Component, Input} from 'angular2/core';

import {ChatComponent} from "../../chat/components/chat.component";

@Component({
    selector: 'navbar',
    templateUrl: 'app/shared/components/navbar.component.html',
    directives: [ChatComponent]
})
export class NavbarComponent {
    @Input() isChatActivated = false;
    isChatOpened = false;

    toggleChat(){
        this.isChatOpened = !this.isChatOpened;
    }

}
