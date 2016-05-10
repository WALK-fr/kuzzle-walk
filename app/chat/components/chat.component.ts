import {Component, AfterViewInit} from "angular2/core";

//test michel : import 'rxjs/add/operator/map';

import {ChatMessage} from "../index";
import {User} from "../../users/index";
import {KuzzleService} from "../../shared/kuzzle/services/KuzzleService.service";

// this is used to accept jquery token at compilation time
declare var $: any;

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'chat',
    styles: [``],
    templateUrl: "app/chat/components/chat.component.html"
})
export class ChatComponent {
    messagesList:ChatMessage[];
    message:string;
    inputLabel = "Message";

    /*
    TEST MICHEL
     messagesList:Observable<ChatMessage>;

     constructor(private kuzzleService:KuzzleService) {
     // this.messagesList = Observable.fromArray([new ChatMessage(new User('Jean', 'Bon'), 'Un message déjà présent')]);
     this.messagesList = this.kuzzleService.chatService.subscribeToChat();
     this.messagesList.map( obs => obs.content).subscribe(obs => console.log(obs));
     // .subscribe( message => {
     //         console.log(message);
     //         $('.tooltipped').tooltip({delay: 50});
     //         $('#tp-chats-window-message-list').animate({scrollTop: $('#tp-chat-window-message-list').prop("scrollHeight")}, 500);
     //     })
     }
     */

    constructor(private kuzzleService:KuzzleService) {
        this.messagesList = [new ChatMessage(new User('Jean', 'Bon'), 'Un message déjà présent')];
        this.kuzzleService.chatService.subscribeToChat(this.messagesList);

    }

    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit() {
        $(document).ready(function(){
            $('.tooltipped').tooltip({delay: 50});
        });
    }

    /**
     * When an user hit ENTER, the message is propagated.
     *
     * @param event
     */
    publishMessage(event:KeyboardEvent) {
        event.stopPropagation();
        const KEY_ENTER = 13;
        var key = event.which || event.keyCode;

        if (this.message && key === KEY_ENTER) {
            var chatMessage = new ChatMessage(new User('Jean', 'Bon'), this.message);
            this.kuzzleService.chatService.sendMessage(chatMessage);

            this.message = "";
        }
    }

    changeInputLabel(event:FocusEvent){
        //TODO - replace with user Name
        event.type === "focus" ? this.inputLabel = "Jean Bon" : this.inputLabel = "Message";
    }
}