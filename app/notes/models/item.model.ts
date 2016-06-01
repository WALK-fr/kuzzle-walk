
export class Item {
    /** The travel unique ID in kuzzle */
    content: string;
    done:boolean;

    constructor(obj?:any) {
        this.content = obj && obj.content || null;
        this.done = obj && obj.done || null;
    }
}