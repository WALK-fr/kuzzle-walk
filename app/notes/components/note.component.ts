import { Component, Input, ElementRef, Output, EventEmitter } from "@angular/core";
import { FormBuilder, ControlGroup, Validators } from "@angular/common";

import {Item} from "../models/item.model";
import {CollapsibleDirective} from "../../shared/directives/collapsible.directive";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Note} from "../models/note.model";

/**
 * This components represent a single note component from the travel notes.
 */

// this is used to accept jquery token at compilation time
declare var $:any;

@Component({
    selector: 'note',
    templateUrl: "app/notes/components/note.component.html",
    styleUrls: ['app/notes/components/note.component.css'],
    directives: [CollapsibleDirective]
})
export class NoteComponent{

    @Input() note;
    itemForm: ControlGroup;
    @Output('display-item') itemDisplayEvent = new EventEmitter();
    @Output('item-deleted') itemDeletedEvent = new EventEmitter();

    constructor(private _element: ElementRef, private _kuzzle: KuzzleService, private fb: FormBuilder) {
        this.createForm();
    }

    createForm(){
        this.itemForm = this.fb.group({
            title: ['', Validators.required],
            content: ['']
        });
    }

    /**
     * Triggered when a new item is added in a note
     *
     * @param form - is use only to collapse again the form once used
     */
    persistNewItem(form){
        this.note.items.push(new Item({title: form.title, content: form.content.replace("\r\n", "\\n"), done: false}));
        this._kuzzle.noteService.publishNote(this.note);
        this.createForm();
    }

    /**
     * Triggered when the user clicks on the delete button on a note
     *
     * @param $event
     */
    deleteNote($event){
        this._kuzzle.noteService.deleteNote(this.note);
        $event.stopPropagation(); //prevent item form from opening
    }

    /**
     * load the details of a specific note item
     */
    emitItem(item:Item){
        this.itemDisplayEvent.emit({note: this.note, item: item});
    }

    /**
     * Delete a item from a note and persist into kuzzle
     * 
     * @param item
     */
    cancelItem(item:Item) {
        var itemIndex = this.note.items.indexOf(item);
        this.note.items.splice(itemIndex, 1);

        this.itemDeletedEvent.emit({});
        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.note);
    }
    
}
