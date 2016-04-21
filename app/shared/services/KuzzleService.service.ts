/// <reference path="../../../typings/kuzzle/kuzzle.d.ts"/>

import {Injectable} from "angular2/core";

/**
 * Handle kuzzle methods
 */
@Injectable()
export class KuzzleService {
    private kuzzle: any;

    public constructor() {
        this.kuzzle = new Kuzzle('http://walk.challenge.kuzzle.io:7512');
    }

    echo() {
        this.kuzzle
            .dataCollectionFactory('walk', 'test')
            .publishMessage({foo: 'bar', baz: 'qux'});

        return this.kuzzle;
    }
}