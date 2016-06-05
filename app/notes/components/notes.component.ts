import {Component, OnInit} from "angular2/core";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Note} from "../models/note.model";
import {Item} from "../models/item.model";
import {Travel} from "../../travel/models/travel.model";
import {NoteComponent} from "./note.component";
import {NotePanelComponent} from "./notes-panel.component";

/**
 * This components represent the Notes component of the travel.
 */

// this is used to accept jquery token at compilation time
declare var $:any;

@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css'],
    directives: [NoteComponent, NotePanelComponent]
})
export class NotesComponent implements OnInit{

    allNotes:Note[] = [];
    travel:Travel;

    constructor(private _kuzzle:KuzzleService) {}

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

    /**
     * Add a new HTML form that handles the creation of a note
     */
    addNewNote(){

    }

    /**
     * Persist a new note in kuzzle
     */
    persistNewNote() {
        //add form logic here
        var items = [new Item({title:"item 1", content: "content of Item1"}), new Item({title:"item 2", content: "content of Item2"}), new Item({title:"item 3", content: "content of Item3"})];
        var note = new Note({name:"Paris", travelId:"AVS5a8AIeivQYXVQtlJN", items:items});
        this._kuzzle.noteService.publishNote(note);
    }

    /**
     *
     * @param $form - is use only to collapse again the form once used
     * @param $itemTitle - the title DOM object of the new item
     * @param $itemContent - the conent DOM object of the new item
     * @param note - the note which has to be updated
     */
    persistNewItem($form, $itemTitle, $itemContent, note: Note) {

        // TODO add some validation
        note.items.push(new Item({title: $itemTitle.value, content: $itemContent.value, done: false}));
        this._kuzzle.noteService.publishNote(note);
        $itemTitle.value = "";
        $itemContent.value = "";
        $($form).trigger('click');
    }

    /**
     * Mark a note item as done and persist the modification in kuzzle
     * @param $event
     * @param note
     * @param item
     */
    markAsDone($event:any, note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);
        this.allNotes[noteIndex].items[itemIndex].done = true;

        //update the document in Kuzzle
        this._kuzzle.noteService.publishNote(this.allNotes[noteIndex]);
    }

    /**
     * Delete a item from a note and persist into kuzzle
     * @param note
     * @param item
     */
    cancelItem(note:any, item:any) {
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);
        this.allNotes[noteIndex].items.splice(itemIndex, 1);

        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.allNotes[noteIndex]);
    }

    /**
     * Displays the notes modal window
     */
    displayModal() {
        $('#tp-notes').openModal();
    }
}
