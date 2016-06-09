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

    /**
     * load the details of a specific note
     */
    emitItem(note:Note, item:Item){
        this.itemDisplayEvent.emit({note: note, item: item});
    }
    
}
