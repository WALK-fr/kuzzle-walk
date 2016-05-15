import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {TeamWidgetComponent} from "../../team/components/team-widget.component";

@Component({
    selector: 'navbar',
    templateUrl: 'app/shared/components/navbar.component.html',
    directives: [TeamWidgetComponent]
})
export class NavbarComponent {
    @Input() isChatActivated = false;
    @Input() isNotesActivated = false;
    @Input() isTeamActivated = false;
    @Output('toggle-chat') chatOuput = new EventEmitter();
    @Output('toggle-notes') notesOutput = new EventEmitter();

    toggleChat() {
        this.chatOuput.emit({});
    }

    toggleNotes(){
        this.notesOutput.emit({});
    }
}
