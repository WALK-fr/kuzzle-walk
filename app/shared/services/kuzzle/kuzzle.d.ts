// Type definitions for Kuzzle SDK JS
// Project: http://kuzzle.io/
// Definitions by: Andréas 'ScreamZ' Hanss <https://github.com/ScreamZ>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
declare module KuzzleSdk{

    export interface Kuzzle {
        constructor(url: string, options? : kuzzleConnectOptions): any;
    }


    interface kuzzleConnectOptions {
        autoQueue: boolean,
        autoReconnect: boolean,
        autoReplay: boolean,
        autoResubscribe: boolean,
        connect: string,
        defaultIndex: string,
        headers: any,
        metadata: any,
        offlineMode: string
    }
}

export = KuzzleSdk;