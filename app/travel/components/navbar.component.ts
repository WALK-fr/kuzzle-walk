import {Component} from 'angular2/core';
import {ChatComponent} from "../../chat/components/chat.component";

@Component({
    selector: 'navbar',
    templateUrl: 'app/travel/components/navbar.component.html',
    directives: [ChatComponent]
})
export class NavbarComponent {

}
