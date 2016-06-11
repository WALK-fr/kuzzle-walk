import { Component, Input, ElementRef } from "@angular/core";
import { FormBuilder, ControlGroup, Validators } from "@angular/common";

import {Item} from "../models/item.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";

/**
 * This components represent a single note component from the travel notes.
 */

// this is used to accept jquery token at compilation time
declare var $:any;
declare var Materialize:any;

@Component({
    selector: 'note-detail',
    templateUrl: "app/notes/components/note-detail.component.html",
    styleUrls: ['app/notes/components/note-detail.component.css'],
})
export class NoteDetailComponent{

    @Input() currentNoteAndItem;
    itemForm: ControlGroup;
    editMode: boolean = false;

    constructor(private _element: ElementRef, private _kuzzle: KuzzleService, fb: FormBuilder) {
        this.itemForm = fb.group({
            title: ['', Validators.required],
            content: ['']
        });
    }

    /**
     * Switch on/off the edit mode
     */
    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    /**
     * Triggered when the form is submitted and the edit mode is activated
     *
     * @param form
     */
    editItem(form) {
        var itemIndex = this.currentNoteAndItem.note.items.indexOf(this.currentNoteAndItem.item);
        this.currentNoteAndItem.note.items[itemIndex].title = form.title;
        this.currentNoteAndItem.note.items[itemIndex].content = form.content;
        this._kuzzle.noteService.publishNote(this.currentNoteAndItem.note);
        this.toggleEditMode();
    }

    /**
     * Mark a note item as done and persist the modification in kuzzle
     *
     * @param $event
     * @param note
     * @param item
     */
    markAsDone($event:any, item:Item) {
        var itemIndex = this.currentNoteAndItem.note.items.indexOf(item);
        this.currentNoteAndItem.note.items[itemIndex].done = !this.currentNoteAndItem.note.items[itemIndex].done;

        //update the document in Kuzzle
        this._kuzzle.noteService.publishNote(this.currentNoteAndItem.note);
    }

    /**
     * Delete a item from a note and persist into kuzzle
     *
     * @param note
     * @param item
     */
    cancelItem(item:Item) {
        var itemIndex = this.currentNoteAndItem.note.items.indexOf(item);
        this.currentNoteAndItem.note.items.splice(itemIndex, 1);

        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.currentNoteAndItem.note);
        this.currentNoteAndItem = null;
    }
    
}
