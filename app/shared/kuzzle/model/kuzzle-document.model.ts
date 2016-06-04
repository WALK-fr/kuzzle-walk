/**
 * All classes must extends this one if they intent to be persisted in Kuzzle.
 */
export abstract class KuzzleDocument {
    static STATUS_FETCHED = 'fetched';
    static STATUS_USER_JOINED = 'on';
    static STATUS_USER_LEFT = 'off';
    id: string;
    status:string;
}