import {Component} from "angular2/core";
import {ChatMessage} from "../index";
import {User} from "../../users/index";

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'chat',
    styles: [``],
    templateUrl: "app/chat/components/chat.component.html"
})
export class ChatComponent {
    messagesList:ChatMessage[] = [new ChatMessage(new User('Jean', 'Bon'), 'Un message déjà présent')];
    message:string;

    /**
     * When an user hit ENTER, the message is propagated.
     *
     * @param event
     */
    publishMessage(event:KeyboardEvent) {
        event.stopPropagation();
        const KEY_ENTER = 13;
        var key = event.which || event.keyCode;

        if (key === KEY_ENTER) {
            // TODO : Do kuzzle call to dispatch message

            // TODO add message to the panel upon kuzzle success response (not immediatly)
            this.messagesList.push(new ChatMessage(new User('Jean', 'Bon'), this.message));
            this.message = "";
        }
    }
}