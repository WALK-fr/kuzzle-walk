import {Component, OnInit} from "angular2/core";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Note} from "../models/note.model";
import {Item} from "../models/item.model";
import {Travel} from "../../travel/models/travel.model";

/**
 * This components represent the Notes component of the travel.
 */
@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css']
})
export class NotesComponent implements OnInit{

    allNotes:Note[] = [];
    travel:Travel;

    constructor(private _kuzzle:KuzzleService) {

    }

    ngOnInit(){
        // TODO : remove if we don't need it
        this._kuzzle.travelStream.subscribe(x => {
            this.travel = x;
        });

        // Subscribe to note Fetch collection and subscribe to create / update / delete
        this._kuzzle.noteService.getNoteStream().subscribe((note) => {
            this._kuzzle.updateLocalCollection(this.allNotes, note);
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
