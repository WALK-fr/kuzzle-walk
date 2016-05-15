import {Component, OnInit, OnChanges, AfterViewInit} from "angular2/core";

import {ChatMessage} from "../index";
import {User} from "../../users/index";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";

//test michel : import 'rxjs/add/operator/map';

// this is used to accept jquery token at compilation time
declare var $:any;

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'chat',
    templateUrl: "app/chat/components/chat.component.html",
    styleUrls: ['app/chat/components/chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit{
    user:User;
    messagesList:ChatMessage[];
    message:string;
    inputLabel = "Message";

    constructor(private kuzzleService:KuzzleService) {
        this.user = new User();
    }

    /**
     * triggered after constructor - handles business logic
     */
    ngOnInit() {
        this.messagesList = [];
        // subscribe to the observable and replace the messagesList by the new one
        // each time you get notified
        this.kuzzleService.chatService.subscribeToChat()
            .subscribe(x => {
                this.messagesList = x;
            });
    }


    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit() {
        $('.tooltipped:last').tooltip({delay: 50});
        $('#tp-chats-window-message-list').animate({scrollTop: $('#tp-chat-window-message-list').prop("scrollHeight")}, 500);
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
            var chatMessage = new ChatMessage(new User(), this.message);
            this.kuzzleService.chatService.sendMessage(chatMessage);

            this.message = "";
        }
    }

    changeInputLabel(event:FocusEvent) {
        //TODO - replace with user Name
        event.type === "focus" ? this.inputLabel = this.user.humanName() : this.inputLabel = "Message";
    }
}
