import {Component} from "angular2/core";
import {ChatMessage} from "../index";
import {User} from "../../users/index";
import {KuzzleService} from "../../shared/kuzzle/services/KuzzleService.service";

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


    constructor(private kuzzleService:KuzzleService) {
        this.messagesList = [new ChatMessage(new User('Jean', 'Bon'), 'Un message déjà présent')];
        this.kuzzleService.chatService.subscribeToChat(this.messagesList);
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
            // TODO : Do kuzzle call to dispatch message
            this.kuzzleService.chatService.sendMessage(chatMessage);

            // TODO add message to the panel upon kuzzle success response (not immediatly)
            this.message = "";
        }
    }
}