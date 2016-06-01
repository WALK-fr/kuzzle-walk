import {Item} from "./item.model";

export class Note {
    /** The travel unique ID in kuzzle */
    id: string;
    name: string;
    travelId: string;
    items:[Item];

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.content.name || null;
        this.travelId = obj && obj.content.travelId || null;
        this.items = obj && obj.content.items || null;
    }
}