import { Component, OnInit } from "@angular/core";
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
    directives: [NoteComponent]
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
     * Displays the notes modal window
     */
    displayModal() {
        $('#tp-notes').openModal();
    }
}
