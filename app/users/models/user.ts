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


    set firstName(value:string) {
        this._firstName = value;
    }

    set lastName(value:string) {
        this._lastName = value;
    }

    set email(value:string) {
        this._email = value;
    }

    set password(value:string) {
        this._password = value;
    }
}
