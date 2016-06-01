import {Injectable} from "angular2/core";
import {Travel} from "../../../travel/index";
import {Subject} from "rxjs/Rx";
import {ChatService, MapService, UserService, NoteService} from "../index";

declare let Kuzzle:any;

/**
 * Handle kuzzle methods
 */
@Injectable()
export class KuzzleService {

    private kuzzle:Kuzzle;
    private _chatService:ChatService;
    private _mapService:MapService;
    private _userService:UserService;
    private _noteService:NoteService;

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512', {defaultIndex: 'walk'});
        this._chatService = new ChatService(this.kuzzle);
        this._mapService = new MapService(this.kuzzle);
        this._userService = new UserService(this.kuzzle);
        this._noteService = new NoteService(this.kuzzle);
    }

    /**
     * Persist the travel and override the travel ID
     * @param travel
     */
    public createTravel(travel:Travel) {
        var hasBeenUpdated:boolean = false;

        this.kuzzle.dataCollectionFactory('travel').createDocument(travel, (err:any, document:any) => {
            console.log(document);
            hasBeenUpdated = true;

            travel.id = document.id;

            // Update each user to mark them as members of the travel
            for (let user of travel.members) {
                user.addTravel(travel)
                // TODO : add element
            }
        });

    }

    public getTravel() {
        var travelListener:Subject<Travel> = new Subject<Travel>(null);
        // TODO : Change this value
        var room = this.kuzzle.dataCollectionFactory('travel').fetchDocument('AVS5a8AIeivQYXVQtlJN', (err, result) => {
            // TODO : Handle errors
            var travel:Travel = result.content;

            // and then you notify the observer
            travelListener.next(travel);
        });

        if (travelListener.isUnsubscribed) {
            console.log('OK cest fait');
            room.unsubscribe()
        }

        return travelListener;
    }

    get chatService():ChatService {
        return this._chatService;
    }

    get mapService():MapService {
        return this._mapService;
    }

    get userService():UserService {
        return this._userService;
    }

    get noteService():NoteService {
        return this._noteService;
    }
}