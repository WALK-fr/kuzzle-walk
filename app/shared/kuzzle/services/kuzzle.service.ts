import {Injectable} from "angular2/core";
import {ChatService, MapService, UserService} from "../index";
import {Travel} from "../../../travel/index";
import {User} from "../../../users/models/user";

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

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512', {defaultIndex: 'walk'});
        this._chatService = new ChatService(this.kuzzle);
        this._mapService = new MapService(this.kuzzle);
        this._userService = new UserService(this.kuzzle);
    }

    /**
     * Persist the travel and override the travel ID
     *
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

    /**
     * Fetch a travel from it's ID
     */
    public getTravel(user:User) {
       
    }

    get chatService():ChatService {
        return this._chatService;
    }

    get mapService():MapService {
        return this._mapService;
    }

    /**
     * Return the user service that allows to manage login and user's specific methods.
     *
     * @returns {KuzzleUserService}
     */
    get userService():UserService {
        return this._userService;
    }
}