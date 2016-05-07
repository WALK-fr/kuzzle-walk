/**
 * Represent one user of the application.
 */
export class User {
    private _firstName:string;
    private _lastName:string;
    private _email:string;
    private _password:string;

    get login():string {
        return this._email;
    }

    get password():string {
        return this._password;
    }
}
