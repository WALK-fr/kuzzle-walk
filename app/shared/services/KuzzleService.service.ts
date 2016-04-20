import {Injectable} from 'angular2/core';

declare var Kuzzle: any;

/**
 * Handle kuzzle methods
 */
@Injectable()
export class KuzzleService {
    private kuzzle: any;

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512');
    }
}