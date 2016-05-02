/**
 * Represent an instance of a chat message
 */
export class ChatMessage {
    private author:string;
    private content:string;
    private dateTime:Date;

    constructor(author:string, content:string) {
        this.author = author;
        this.content = content;
        this.dateTime = new Date();
    }
    
    
}