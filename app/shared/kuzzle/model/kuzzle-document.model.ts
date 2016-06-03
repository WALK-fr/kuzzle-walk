/**
 * All classes must extends this one if they intent to be persisted in Kuzzle.
 */
export abstract class KuzzleDocument {
    id: string;
    status:string;
}