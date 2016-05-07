import {User} from "../../users";
/**
 * Represent an instance of a chat message
 */
export class ChatMessage {
    private author:User;
    private content:string;
    private dateTime:Date;

    constructor(author: User, content:string) {
        this.author = author;
        this.content = content;
        this.dateTime = new Date();
    }
}