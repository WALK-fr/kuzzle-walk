import {ChatMessage} from "../../../chat/index";

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
     *
     * @returns {any}
     */
    public sendMessage(message:ChatMessage) {
        // TODO add room
        return this.kuzzle.dataCollectionFactory('travel', 'chat').publishMessage(message);
    }
}