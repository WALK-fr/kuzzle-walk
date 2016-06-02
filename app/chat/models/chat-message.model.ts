import {User} from "../../users";
/**
 * Represent an instance of a chat message
 */
export class ChatMessage {
    author: User;
    content: string;
    dateTime: Date;

    constructor(author: User, content:string) {
        this.author = author;
        this.content = content;
        this.dateTime = new Date();
    }
}