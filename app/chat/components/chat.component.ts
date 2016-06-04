import {Component, OnInit} from "angular2/core";

import {ChatMessage} from "../index";
import {User} from "../../users/index";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {AutoScrollDirective} from "../../shared/directives/auto-scroll.directive";
import {ToolTipsDirective} from "../../shared/directives/tooltips.directive";

/**
 * This component represent the travel chat room
 */
@Component({
    selector: 'chat',
    templateUrl: "app/chat/components/chat.component.html",
    styleUrls: ['app/chat/components/chat.component.css'],
    directives: [AutoScrollDirective, ToolTipsDirective]
})
export class ChatComponent implements OnInit{
    user:User;
    messagesList:ChatMessage[];
    message:string;
    inputLabel = "Message";

    constructor(private kuzzleService:KuzzleService) {
    }

    /**
     * triggered after constructor - handles business logic
     */
    ngOnInit() {
        this.messagesList = [];

        // Get user
        this.kuzzleService.userService.getCurrentUserStream().subscribe(x => this.user = x);

        // subscribe to the observable and replace the messagesList by the new one
        // each time you get notified
        this.kuzzleService.chatService.subscribeToChat()
            .subscribe(x => {
                console.log(x);
                this.messagesList.push(x);
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
            var chatMessage = new ChatMessage({author: this.user, content: this.message});
            this.kuzzleService.chatService.sendMessage(chatMessage);

            this.message = "";
        }
    }

    changeInputLabel(event:FocusEvent) {
        //TODO - replace with user Name
        event.type === "focus" ? this.inputLabel = this.user.humanName() : this.inputLabel = "Message";
    }
}
