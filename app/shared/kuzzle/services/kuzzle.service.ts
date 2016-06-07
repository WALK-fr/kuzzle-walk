import { Injectable } from "@angular/core";
import { Travel } from "../../../travel/index";
import { ChatService, MapService, UserService, NoteService } from "../index";
import { KuzzleDocument } from "../model/kuzzle-document.model";
import { Subject, BehaviorSubject } from "rxjs/Rx";
import { CookieService } from "angular2-cookie/core";

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

    private _travelStream:Subject<Travel>;

    public constructor(private cookieService: CookieService) {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512', {defaultIndex: 'walk'});
        this._chatService = new ChatService(this.kuzzle);
        this._mapService = new MapService(this.kuzzle);
        this._userService = new UserService(this.kuzzle, this.cookieService);
        this._noteService = new NoteService(this.kuzzle);

        this._travelStream = new BehaviorSubject<Travel>(new Travel());
    }

    /**
     * Update local collection by reference depending on the kuzzle action
     * @param document The document that must be created / updated / deleted.
     * @param documentCollection The collection on which action must be made.
     */
    public updateLocalCollection(documentCollection: KuzzleDocument[], document:KuzzleDocument){
        if (document.id === undefined || document.id === null) {
            console.error('You must provide an ID before updating the collection', document);
        }

        if (document.status === undefined || document.status === null) {
            console.error('You must provide a Status before updating the collection', document);
        }

        let documentIDCollection = documentCollection.map((x) => {
            if (x.id === undefined || x.id === null) {
                console.error('One or more items in your collection don\'t have an ID !', x);
            }
            return x.id
        });

        switch(document.status){
            case 'create':
            case 'created':
            case KuzzleDocument.STATUS_FETCHED:
            case KuzzleDocument.STATUS_USER_JOINED:
                var documentAlreadyInCollection = documentIDCollection.indexOf(document.id) >= 0;

                if (documentAlreadyInCollection) {
                    return;
                }
                document.status = null;
                documentCollection.push(document);
                break;
            case 'update':
                var indexToReplace = documentIDCollection.indexOf(document.id);

                document.status = null;
                documentCollection[indexToReplace] = document;
                break;
            case 'delete':
            case KuzzleDocument.STATUS_USER_LEFT:
                var indexToDelete = documentCollection.map((x) =>{return x.id}).indexOf(document.id);
                documentCollection.splice(indexToDelete, 1);
                break;
        }
    }

    /**
     * Persist the travel and override the travel ID
     * @param travel
     */
    public createTravel(travel:Travel) {
        var hasBeenUpdated:boolean = false;

        this.kuzzle.dataCollectionFactory('travel').createDocument(travel, (err:any, document:any) => {
            hasBeenUpdated = true;

            travel.id = document.id;

            // Update each user to mark them as members of the travel
            for (let user of travel.members) {
                // user.addTravel(travel)
                // TODO : add element
            }
        });

    }

    public initCurrentTravel() {
        this.kuzzle.dataCollectionFactory('travel').fetchDocument('AVS5a8AIeivQYXVQtlJN', (err, result) => {
            // TODO : Handle errors
            var travel = new Travel(result.content);
            travel.id = result.id;

            this._travelStream.next(travel);
        });

    }

    get travelStream():Subject<Travel> {
        return this._travelStream;
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