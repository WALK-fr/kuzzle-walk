import { ChatMessage } from "../../../chat/index";
import { Subject } from "rxjs/Rx";
import { Travel } from "../../../travel/models/travel.model";

//test michel
//import 'rxjs/add/observable/fromArray';

/**
 * Handle each kuzzle calls related to the chat component.
 */
export class ChatService {
    private kuzzle: Kuzzle;
    messages: ChatMessage[] = [];

    public constructor(kuzzle: Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * The collection of message where the incoming message must be imported.
     * @return {Subject<ChatMessage>} the observable to which you need to subscribe
     */
    public subscribeToChat(travel: Travel) {
        var newMessages: Subject<ChatMessage> = new Subject<ChatMessage>();
        var filter = {
            term: {
                travelId: travel.id
            }
        };
        var options = {};

        // subscribe to kuzzle service in order to get the data
        this.kuzzle
            .dataCollectionFactory('message')
            .subscribe(filter, options, (error: any, result: any) => {

                // and then you notify the observer
                newMessages.next(new ChatMessage(result.result._source));
            });

        return newMessages;
    }

    /**
     * Dispatch a message to the subscribers of the room.
     * @param message The message to send
     *
     * @returns {any}
     */
    public sendMessage(message: ChatMessage) {
        if (message.travelId === undefined || message.travelId === null) {
            console.log('Please provide travelId for message');
            return
        }
        return this.kuzzle.dataCollectionFactory('message').publishMessage(message);
    }
}
