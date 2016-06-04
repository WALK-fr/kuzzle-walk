
export class Item {
    /** The travel unique ID in kuzzle */
    title: string;
    content: string;
    done: boolean;

    constructor(obj?:any) {
        this.title = obj && obj.title || null;
        this.content = obj && obj.content || null;
        this.done = obj && obj.done || null;
    }
}