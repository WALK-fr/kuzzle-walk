import { Component, OnInit } from "@angular/core";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Note} from "../models/note.model";
import {Travel} from "../../travel/models/travel.model";
import {NoteComponent} from "./note.component";
import {FadeToggleDirective} from "../../shared/directives/fade-toggle.directive";
import {NoteDetailComponent} from "./note-detail.component";
import {ControlGroup, Validators, FormBuilder} from "@angular/common";

/**
 * This components represent the Notes component of the travel.
 */

// this is used to accept jquery token at compilation time
declare var $:any;

@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css'],
    directives: [NoteComponent, NoteDetailComponent, FadeToggleDirective]
})
export class NotesComponent implements OnInit{

    allNotes:Note[] = [];
    travel:Travel;
    currentNoteAndItem;
    noteForm: ControlGroup;
    isNoteFormActive: boolean = false;

    constructor(private _kuzzle: KuzzleService, fb: FormBuilder) {
        this.noteForm = fb.group({
            name: ['', Validators.required]
        });
        this.travel = new Travel();
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

    /**
     * load the details of a specific note
     */
    loadItem(currentNoteAndItem){
        this.currentNoteAndItem = currentNoteAndItem;
    }

    /**
     * Add a new HTML form that handles the creation of a note
     */
    toggleNoteForm(){
        this.isNoteFormActive = !this.isNoteFormActive;
    }

    /**
     * Persist a new note in kuzzle
     */
    persistNewNote(form) {
        //add form logic here
        var note = new Note({name: form.name, travelId: this.travel.id});
        this._kuzzle.noteService.publishNote(note);
        this.toggleNoteForm();

        //TO-DO remove this ones notes will be added by Date of creation
        $('.bottom-sheet').animate({
            scrollTop: $('#tp-all-notes-panel').offset().top
        }, 'slow');
    }

    /**
     * Displays the notes modal window
     */
    displayModal() {
        $('#tp-notes').openModal();
    }
}
