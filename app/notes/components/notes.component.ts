import {Component, Input, OnInit} from "angular2/core";

// this is used to accept jquery token at compilation time
declare var $:any;

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css']
})
export class NotesComponent{

    displayModal() {
        $('#tp-notes').openModal();
    }
}
