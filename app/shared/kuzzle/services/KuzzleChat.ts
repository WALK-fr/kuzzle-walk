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

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * The collection of message where the incoming message must be imported.
     * @param chatMessageCollection
     */
    public subscribeToChat(chatMessageCollection: ChatMessage[]) {
        var options = {};

        this.kuzzle.dataCollectionFactory('message').subscribe({}, options, (error:any, result:any) => {
            if (error) {
                console.error(error);
            }
            var firstName = result.result._source.author._firstName;
            var lastName = result.result._source.author._lastName;
            var content = result.result._source._content;

            chatMessageCollection.push(new ChatMessage(new User(firstName,lastName), content));
        });
    }

    /**
     TEST MICHEL

    public subscribeToChat() {
        var options = {};
        var listeMessageObservable: Observable<ChatMessage>;
        var listeMessage: ChatMessage[] = [new ChatMessage(new User('Jean', 'Bon'), 'Un message déjà présent')];
        listeMessageObservable = Observable.fromArray(listeMessage);

        this.kuzzle.dataCollectionFactory('message').subscribe({}, options, (error:any, result:any) => {
            if (error) {
                console.error(error);
            }
            var firstName = result.result._source.author._firstName;
            var lastName = result.result._source.author._lastName;
            var content = result.result._source._content;

            listeMessage.push(new ChatMessage(new User(firstName,lastName), content));
        });

        return listeMessageObservable;
    }
     */

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