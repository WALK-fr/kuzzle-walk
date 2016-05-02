import {ChatMessage, ChatRoom} from "../../../chat/chat";

/**
 * Handle each kuzzle calls related to the chat component.
 */
export class KuzzleChat {
    private kuzzle:any;

    public constructor(kuzzle:any) {
        this.kuzzle = kuzzle;
    }

    /**
     * Dispatch a message to the subscribers of the room.
     * @param message The message to send
     * @param room The room where the message will be dispatched
     *
     * @returns {any}
     */
    public sendMessage(message:ChatMessage, room:ChatRoom) {
        // TODO add room
        return this.kuzzle.dataCollectionFactory('travel', 'chat').publishMessage(message);
    }
}