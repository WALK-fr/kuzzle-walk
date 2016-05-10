/**
 * Represent one user of the application.
 */
export class User {
    private _firstName:string;
    private _lastName:string;
    private _email:string;
    private _password:string;


    constructor() {
        this._firstName = "John";
        this._lastName = "Snow";
        this._email = "johnsnow@gmail.com";
        this._password = "nightwatch";
    }

    humanName():string {
        return this._firstName + " " + this._lastName;
    }

    get login():string {
        return this._email;
    }

    get password():string {
        return this._password;
    }
}
