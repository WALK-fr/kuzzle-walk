import {Component, Input} from "@angular/core";
import {Item} from "../models/item.model";
import {CollapsibleDirective} from "../../shared/directives/collapsible.directive";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";

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

    constructor(private _kuzzle: KuzzleService) {}
    
    /**
     *
     * @param $form - is use only to collapse again the form once used
     * @param $itemTitle - the title DOM object of the new item
     * @param $itemContent - the conent DOM object of the new item
     * @param note - the note which has to be updated
     */
    persistNewItem($form, $itemTitle, $itemContent) {

        // TODO add some validation
        this.note.items.push(new Item({title: $itemTitle.value, content: $itemContent.value, done: false}));
        this._kuzzle.noteService.publishNote(this.note);
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
    markAsDone($event:any, item:any) {
        var itemIndex = this.note.items.indexOf(item);
        this.note.items[itemIndex].done = true;

        //update the document in Kuzzle
        this._kuzzle.noteService.publishNote(this.note);
    }

    /**
     * Delete a item from a note and persist into kuzzle
     * @param note
     * @param item
     */
    cancelItem(item:any) {
        var itemIndex = this.note.items.indexOf(item);
        this.note.items.splice(itemIndex, 1);

        //delete the item and push the note to kuzzle
        this._kuzzle.noteService.publishNote(this.note);
    }
    
}
