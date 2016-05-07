import {Injectable} from "angular2/core";
import {KuzzleChat} from "./KuzzleChat";
import {KuzzleMap} from "./KuzzleMap";
import {KuzzleUserService} from "./KuzzleUserService";

declare let Kuzzle:any;

/**
 * Handle kuzzle methods
 */
@Injectable()
export class KuzzleService {
    private kuzzle:Kuzzle;
    private _chatService:KuzzleChat;
    private _mapService:KuzzleMap;
    private _userService:KuzzleUserService;

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512');
        this._chatService = new KuzzleChat(this.kuzzle);
        this._mapService = new KuzzleMap(this.kuzzle);
        this._userService = new KuzzleUserService(this.kuzzle);
    }

    get chatService():KuzzleChat {
        return this._chatService;
    }

    get mapService():KuzzleMap {
        return this._mapService;
    }

    /**
     * Return the user service that allows to manage login and user's specific methods.
     *
     * @returns {KuzzleUserService}
     */
    get userService():KuzzleUserService {
        return this._userService;
    }
}