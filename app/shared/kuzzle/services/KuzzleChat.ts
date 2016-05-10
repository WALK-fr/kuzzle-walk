import {Observable} from "rxjs/Observable";

//test michel
//import 'rxjs/add/observable/fromArray';
import {ChatMessage} from "../../../chat/index";
import {User} from "../../../users/models/user";

/**
 * Handle each kuzzle calls related to the chat component.
 */
export class KuzzleChat {
    private kuzzle:Kuzzle;
    messages: ChatMessage[] = [];
    messagesObs: Observable<ChatMessage[]>;

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * The collection of message where the incoming message must be imported.
     * @return {Observable} the observable to which you need to subscribe
     */
    public subscribeToChat() {
        var options = {};

        // create the observable to return
        this.messagesObs = Observable.create( (observer:any) => {
            // subscribe to kuzzle service in order to get the data
            this.kuzzle
                    .dataCollectionFactory('message')
                    .subscribe({}, options, (error:any , result:any) => {
                        // each time you get a message, you push it
                        var firstName = result.result._source.author._firstName;
                        var lastName = result.result._source.author._lastName;
                        var content = result.result._source._content;
                        this.messages.push(new ChatMessage(new User(firstName,lastName), content));

                        // and then you notify the observer
                        observer.next(this.messages);
                    });
        });

        return this.messagesObs;
    }

    /**
     * Dispatch a message to the subscribers of the room.
     * @param message The message to send
     *
     * @returns {any}
     */
    public sendMessage(message:ChatMessage) {
        return this.kuzzle.dataCollectionFactory('message').publishMessage(message);
    }
}
