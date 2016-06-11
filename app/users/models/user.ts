import { Travel } from "../../travel/models/travel.model";
import { KuzzleDocument } from "../../shared/kuzzle/model/kuzzle-document.model";
/**
 * Represent one user of the application.
 */
export class User extends KuzzleDocument{

    static USER_ALREADY_HERE = 'already_here';
    static USER_CONNECTED = 'connected';
    static USER_DISCONNECTED = 'disconnected';
    firstName: string;
    lastName: string;
    photoUrl: string;
    travels: Travel[];

    constructor(obj?: any) {
        super();
        this.id = obj && obj.id || null;
        this.firstName = obj && obj.firstName || null;
        this.lastName = obj && obj.lastName || null;
        this.photoUrl = obj && obj.photoUrl || null;
        this.travels = obj && obj.travels || [];
    }

    humanName():string {
        return this.firstName + " " + this.lastName;
    }

    /**
     * Return if the user is online : 2 case,
     * User has been fetched from back-office or user has join the session.
     *
     * @returns {boolean}
     */
    isOnline(): boolean {
        return this.status === User.USER_CONNECTED || this.status === User.USER_ALREADY_HERE;
    }
}
