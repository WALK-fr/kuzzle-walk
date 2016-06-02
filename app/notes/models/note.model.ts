import {Item} from "./item.model";

export class Note {
    /** The travel unique ID in kuzzle */
    id: string;
    name: string;
    travelId: string;
    items: Item[];

    constructor(id: any, obj?: any) {
        this.id = id;
        this.name = obj && obj.name || null;
        this.travelId = obj && obj.travelId || null;
        this.items = obj && obj.items || null;
    }
}