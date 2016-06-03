/**
 * All classes must extends this one if they intent to be persisted in Kuzzle.
 */
export abstract class KuzzleDocument {
    static STATUS_FETCHED = 'fetched';
    id: string;
    status:string;
}