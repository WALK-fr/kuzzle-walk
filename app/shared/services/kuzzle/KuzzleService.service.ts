/// <reference path="./kuzzle.d.ts"/>

import {Injectable} from "angular2/core";
import {KuzzleChat} from "./KuzzleChat";
import {KuzzleMap} from "./KuzzleMap";

/**
 * Handle kuzzle methods
 */
@Injectable()
export class KuzzleService {
    private kuzzle: any;
    private _chatService: KuzzleChat;
    private _mapService: KuzzleMap;

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512');
        this._chatService = new KuzzleChat(this.kuzzle);
        this._mapService = new KuzzleMap(this.kuzzle);
    }

    get chatService():KuzzleChat {
        return this._chatService;
    }

    get mapService():KuzzleMap {
        return this._mapService;
    }
}