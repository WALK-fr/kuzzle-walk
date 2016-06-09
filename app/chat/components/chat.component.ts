import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ChatMessage } from "../index";
import { User } from "../../users/index";
import { KuzzleService } from "../../shared/kuzzle/services/kuzzle.service";
import { AutoScrollDirective } from "../../shared/directives/auto-scroll.directive";
import { ToolTipsDirective } from "../../shared/directives/tooltips.directive";
import { Travel } from "../../travel/index";

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
    travel: Travel;

    @Input() isChatOpened = false;
    @Output('unread-message-received') unreadMessageReceived = new EventEmitter();
    constructor(private kuzzleService:KuzzleService) {
        this.travel = new Travel();
    }

    /**
     * triggered after constructor - handles business logic
     */
    ngOnInit() {
        this.messagesList = [];

        // Get user
        this.kuzzleService.userService.getCurrentUserStream().subscribe(x => this.user = x);

        // Get travel
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
            // Subscribe to chat messages
            this.kuzzleService.chatService.subscribeToChat(this.travel)
                .subscribe(x => {
                    this.messagesList.push(x)
                    if(!this.isChatOpened){
                        this.unreadMessageReceived.emit({});
                    }
                });
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
            var chatMessage = new ChatMessage({travelId: this.travel.id, author: this.user, content: this.message});
            this.kuzzleService.chatService.sendMessage(chatMessage);

            this.message = "";
        }
    }

    changeInputLabel(event:FocusEvent) {
        //TODO - replace with user Name
        event.type === "focus" ? this.inputLabel = this.user.humanName() : this.inputLabel = "Message";
    }
}
