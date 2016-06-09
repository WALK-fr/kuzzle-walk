import { Subject, BehaviorSubject } from "rxjs/Rx";
import { CookieService } from "angular2-cookie/core";

import { User } from "../../../users/models/user";

/**
 * Handle each kuzzle calls related to the user.
 */
export class UserService {
    private kuzzle: Kuzzle;
    private loggedUsersStream: Subject<User> = new BehaviorSubject<User>(null);
    private currentUserStream: Subject<User> = new Subject<User>();
    private user: User;

    public constructor(kuzzle: Kuzzle, private cookieService: CookieService) {
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

            var expiresIn = "1d";

            this.kuzzle.login("local", {username: login, password: password}, expiresIn, (error, success) => {

                if (error) {
                    reject(error);
                    return;
                }

                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                this.cookieService.put('jwt', success.jwt, {expires: tomorrow});

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

    public connectAndSendConnectionNotificationAndSubscribeToUserStream():boolean {

        // Connection from session

        let jwt = this.cookieService.get('jwt');
        if (jwt) {
            this.kuzzle.setJwtToken(jwt);
        } else {
            return false;
        }

        // Fetch user data and then notify connection
        new Promise((resolve, reject) => {
            this.kuzzle.whoAmI((error, success) => {
                // TODO : Handle error
                if (error) reject();

                // Set the current user
                var user = new User(success.content);
                user.id = success.id;
                user.status = User.USER_JOINED;

                this.user = user;
                this.loggedUsersStream.next(user); // Add current user to the list
                this.currentUserStream.next(user); // And notify all components of the user
                resolve();
            })
        }).then(() => {
            var usersDataCollection = this.kuzzle.dataCollectionFactory('users');

            // Subscribe to users list to notify the user presence and listen to incoming / leaving users
            usersDataCollection.subscribe({}, {
                // scope: 'none', // This scope must be none because we only are interested on subscription users
                scope: 'in', // This scope must be in because we only are interested on subscription users
                users: 'all',
                metadata: this.user,
                subscribeToSelf: false // We don't want to receive i'm here notification if we send it
            }, (error: any, result: any) => {
                // Notify each users of our presence when someone join the room in the which we are.
                if (result.action === User.USER_JOINED) {
                    usersDataCollection.publishMessage({notify: User.USER_ALREADY_HERE}, {metadata: this.user});
                }

                // When someone enter / leave the room we created an user with specific action.
                // Depending on that one we will add or remove from the logged users collection.
                var user = new User(result.metadata);
                user.status = result.action;

                // In case of I'm here notification we add curently logged user to the collection
                if (result.notify === User.USER_ALREADY_HERE) user.status = User.USER_ALREADY_HERE;
                this.loggedUsersStream.next(user);
            });
        });

        return true;
    }
}