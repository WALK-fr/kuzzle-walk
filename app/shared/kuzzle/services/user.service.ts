import { User } from "../../../users/models/user";
import { Subject } from "rxjs/Rx";
import { KuzzleDocument } from "../model/kuzzle-document.model";
/**
 * Handle each kuzzle calls related to the user.
 */
export class UserService {
    private kuzzle: Kuzzle;
    private loggedUsersStream: Subject<User> = new Subject<User>();
    private currentUserStream: Subject<User> = new Subject<User>();
    private user: User;

    public constructor(kuzzle: Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * Connect an user to the backend, allowing him to interact with others users.
     *
     * @param login The user login
     * @param password The user password
     */
    public login(login:string, password:string): Promise{
        return new Promise((resolve, reject) => {

            var expiresIn = "1h";

            this.kuzzle.login("local", {username: login, password: password}, expiresIn, (error, success) => {
                console.log(success);
                window.sessionStorage.setItem('jwt', success.jwt);

                if (error) reject();

                resolve(success); // Return error or success for login
            });
        })
    }

    /**
     * Disconnect an user from the backend (based on the active connection).
     */
    public logout() {
        this.kuzzle.logout(function (err, res) {
            console.log(err);
            console.log(res);
        });
    }

    public getLoggedUsersStream() {
        return this.loggedUsersStream;
    }

    public getCurrentUserStream(): Subject<User> {
        return this.currentUserStream;
    }

    public connectAndSendConnectionNotificationAndSubscribeToUserStream() {

        // Connection from session
        var jwt = window.sessionStorage.getItem('jwt');

        if (jwt) {
            this.kuzzle.setJwtToken(jwt);
        }

        // Fetch user data and then notify connection
        new Promise((resolve, reject) => {
            this.kuzzle.whoAmI((error, success) => {
                // TODO : Handle error
                if (error) reject();

                // Set the current user
                var user = new User(success.content);
                user.id = success.id;
                user.status = KuzzleDocument.STATUS_USER_JOINED;

                this.user = user;
                this.loggedUsersStream.next(user); // Add current user to the list
                this.currentUserStream.next(user); // And notify all components of the user
                resolve();
            })
        }).then(() => {
            // Subscribe to users list to notify the user presence and listen to incoming / leaving users
            this.kuzzle.dataCollectionFactory('users').subscribe({}, {
                scope: 'none', // This scope must be none because we only are interested on subscription users
                users: 'all',
                metadata: this.user
            }, (error: any, result: any) => {
                var user = new User(result.metadata);
                user.status = result.action; // Can be on or off depending on if the user join or not
                user.id = result.action; // Can be on or off depending on if the user join or not

                this.loggedUsersStream.next(user);
            });
        })
    }
}