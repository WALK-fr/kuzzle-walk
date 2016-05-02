/**
 * Represent a chatroom where messages are exchanged.
 */
export class ChatRoom {
    /**
     * The chat room name;
     */
    private _name:string;


    constructor(name:string) {
        this._name = name;
    }


    /**
     * Retrieve the room name.
     *
     * @returns {string}
     */
    get name():string {
        return this._name;
    }
}