import {Component} from "angular2/core";

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'chat',
    styles: [``],
    templateUrl: "app/chat/components/chat.component.html"
})
export class ChatComponent {
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
            console.log(this.message);
            this.message = "";

            // TODO add message to the panel upon kuzzle success response
        }
    }
}