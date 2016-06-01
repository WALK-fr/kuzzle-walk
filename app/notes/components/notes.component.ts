import {Component, Input} from "angular2/core";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";

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
export class NotesComponent {

    allNotes:[any] = [];

    constructor(private _kuzzle:KuzzleService) {
        this._kuzzle.noteService.getAllNotesForTravel('travelString')
            .subscribe(notes => this.allNotes = notes);
    }

    addNewNote() {

    }

    addNewItem() {

    }

    markAsDone($event:any, note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);

        this.allNotes[noteIndex].items[itemIndex].done = true;
        $($event.target).parents('li').addClass("green", "lighten-1");
    }

    cancelItem(note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);

        this.allNotes[noteIndex].items.splice(itemIndex, 1);
    }

    displayModal() {
        $('#tp-notes').openModal();
    }
}
