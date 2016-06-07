import { User } from "../../users/models/user";
/**
 * Represent an instance of a chat message
 */
export class ChatMessage {
    author: User;
    travelId: string;
    content: string;
    dateTime: Date;

    constructor(obj?: any) {
        this.author = obj && obj.author && new User(obj.author) || null;
        this.travelId = obj && obj.travelId || null;
        this.content = obj && obj.content || null;
        this.dateTime = obj && obj.dateTime && new Date(obj.dateTime) || new Date();
    }
}