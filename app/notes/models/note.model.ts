import {Item} from "./item.model";
import {KuzzleDocument} from "../../shared/kuzzle/model/kuzzle-document.model";

export class Note extends KuzzleDocument{
    /** The travel unique ID in kuzzle */
    name: string;
    travelId: string;
    items: Item[];

    constructor(obj?: any) {
        super();
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.travelId = obj && obj.travelId || null;
        this.items = obj && obj.items || [];
    }
}