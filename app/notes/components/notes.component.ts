import {Component, Input, OnInit} from "angular2/core";

// this is used to accept jquery token at compilation time
declare var $:any;

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'notes',
    templateUrl: "app/notes/components/notes.component.html",
    styleUrls: ['app/notes/components/notes.component.css']
})
export class NotesComponent{
    
    @Input() allNotes:[any];

    constructor(){
        //simulate kuzzle call
        this.allNotes = [
            {"name":"Paris", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
            {"name":"Deauville", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
            {"name":"Bibi", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
            {"name":"DeBi", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
        ];
    }

    addNewNote(){
        
    }
    
    addNewItem(){
        
    }
    
    markAsDone($event:any, note:any, item:any){
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);

        this.allNotes[noteIndex].items[itemIndex].done = true;
        $($event.target).parents('li').addClass("green","lighten-1");
    }
    
    cancelItem(note:any, item:any){
        var noteIndex = this.allNotes.indexOf(note);
        var itemIndex = this.allNotes[noteIndex].items.indexOf(item);

        this.allNotes[noteIndex].items.splice(itemIndex, 1);
    }
    
    displayModal() {
        $('#tp-notes').openModal();
    }
}
