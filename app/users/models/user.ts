import { Travel } from "../../travel/models/travel.model";
import { KuzzleDocument } from "../../shared/kuzzle/model/kuzzle-document.model";
/**
 * Represent one user of the application.
 */
export class User extends KuzzleDocument{
    firstName: string;
    lastName: string;
    photoUrl: string;
    travels: Travel[];

    constructor(obj?: any) {
        this.firstName = obj && obj.firstName || null;
        this.lastName = obj && obj.lastName || null;
        this.photoUrl = obj && obj.photoUrl || null;
        this.travels = obj && obj.travels || [];
    }

    humanName():string {
        return this.firstName + " " + this.lastName;
    }
}
