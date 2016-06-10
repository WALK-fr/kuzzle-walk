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

    constructor(private _element: ElementRef, private _kuzzle: KuzzleService, fb: FormBuilder) {
        this.itemForm = fb.group({
            title: ['', Validators.required],
            content: ['']
        });
    }

    /**
     *
     * @param $form - is use only to collapse again the form once used
     * @param $itemTitle - the title DOM object of the new item
     * @param $itemContent - the conent DOM object of the new item
     * @param note - the note which has to be updated
     */
    persistNewItem(form){
        this.note.items.push(new Item({title: form.title, content: form.content.replace("\r\n", "\\n"), done: false}));
        this._kuzzle.noteService.publishNote(this.note);
    }

    deleteNote($event){

        this._kuzzle.noteService.deleteNote(this.note);
        $event.stopPropagation(); //prevent item form from opening
    }

    /**
     * load the details of a specific note
     */
    emitItem(item:Item){
        this.itemDisplayEvent.emit({note: this.note, item: item});
    }

    /**
     * Delete a item from a note and persist into kuzzle
     * @param note
     * @param item
     */
    cancelItem(item:Item) {
        var itemIndex = this.note.items.indexOf(item);
        this.note.items.splice(itemIndex, 1);

        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.note);
    }
    
}
