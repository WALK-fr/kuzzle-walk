import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'navbar',
    templateUrl: 'app/shared/components/navbar.component.html'
})
export class NavbarComponent {
    @Input() isChatActivated = false;
    @Input() isNotesActivated = false;
    @Output('toggle-chat') chatOuput = new EventEmitter();
    @Output('toggle-notes') notesOutput = new EventEmitter();

    toggleChat() {
        this.chatOuput.emit({});
    }

    toggleNotes(){
        this.notesOutput.emit({});
    }
}
