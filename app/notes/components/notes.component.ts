import {Component, OnInit} from "angular2/core";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Note} from "../models/note.model";
import {Item} from "../models/item.model";

// this is used to accept jquery token at compilation time
declare var $:any;

/**
 * This components represent the Notes component of the travel.
 */
@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css']
})
export class NotesComponent implements OnInit{

    allNotes:[Note];

    constructor(private _kuzzle:KuzzleService) {
        this._kuzzle.noteService.getAllNotesForTravel('travelString')
            .subscribe( notes => {
                    this.allNotes = notes;
            });
    }

    ngOnInit(){
        this._kuzzle.noteService.subsribeToNotes().subscribe((note) => {
            this.allNotes.push(new Note(note));
        });
    }
    
    persistNewNote() {
        //add form logic here
        var items = [new Item({content: "Item1"}), new Item({content: "Item2"}), new Item({content: "Item3"})];
        var note = new Note({name:"Paris", travelId:"AVS5a8AIeivQYXVQtlJN", items:items});
        this._kuzzle.noteService.publishNote(note);
    }

    persistNewItem($event: KeyboardEvent, note: Note) {
        $event.stopPropagation();
        const KEY_ENTER = 13;
        var key = $event.which || $event.keyCode;

        if ($event.target.value && key === KEY_ENTER) {
            note.items.push(new Item({content: $event.target.value, done: false}));
            this._kuzzle.noteService.publishNote(note);
            $event.target.value = "";
        }
        
    }

    markAsDone($event:any, note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);
        this.allNotes[noteIndex].items[itemIndex].done = true;

        //update the document in Kuzzle
        this._kuzzle.noteService.publishNote(this.allNotes[noteIndex]);

        //add a style
        $($event.target).parents('li').addClass("green", "lighten-1");
    }

    cancelItem(note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);
        this.allNotes[noteIndex].items.splice(itemIndex, 1);

        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.allNotes[noteIndex]);
    }

    displayModal() {
        $('#tp-notes').openModal();
    }
}
