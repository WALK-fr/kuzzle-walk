import { Subject } from "rxjs/Rx";
import { CookieService } from "angular2-cookie/core";
import { User } from "../../../users/models/user";

/**
 * Handle each kuzzle calls related to the user.
 */
export class UserService {
    private kuzzle: Kuzzle;
    private travelMembersStream: Subject<User> = new Subject<User>();
    private currentApplicationUserStream: Subject<User> = new Subject<User>();
    private user: User;

    public constructor(kuzzle: Kuzzle, private cookieService: CookieService) {
        this.kuzzle = kuzzle;
    }

    /**
     * Return a stream that will emit change on the current application user.
     *
     * @returns {Subject<User>}
     */
    public getApplicationUserStream(): Subject<User> {
        return this.currentApplicationUserStream;
    }

    /**
     * Return a stream that will emit changes on user connection / disconnection and updates.
     *
     * @returns {Subject<User>}
     */
    public getTravelMembersStream() {
        return this.travelMembersStream;
    }

    /**
     * Connect an user to the backend, allowing him to interact with others users.
     *
     * @param login The user login
     * @param password The user password
     */
    public login(login:string, password:string): Promise<any>{
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

    /**
     * Connect the user to the application and subscribe to userStream that will listen for user connection / disconnection.
     * Also emit to others a hello notification.
     *
     * If user has a jwt cookie, this will be used to connect the user.
     *
     * @returns {boolean}
     */
    public connectAndSendConnectionNotificationAndSubscribeToUserStream():boolean {

        // Connection from session if the user has one in memory
        let jwt = this.cookieService.get('jwt');
        if (jwt) {
            this.kuzzle.setJwtToken(jwt);
        } else {
            return false;
        }

        // Fetch current application user data and then notify connection to the stream.
        this.refreshCurrentUser().then((user: User) => {
            this.currentApplicationUserStream.next(user); // And send this object to all subscribing components
        }).catch((error: Error) => {
            console.log(error.message);
        });

        // Subscribe to variation
        this.subscribeToConnectUserVariation();

        return true;
    }

    private subscribeToConnectUserVariation() {
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

            var user = new User(result.metadata);

            switch (result.action) {
                case 'publish': // Volatile message send
                    // Already connected user announce themselves
                    if (result.result._source.notify === User.USER_ALREADY_HERE) {
                        user.status = User.USER_ALREADY_HERE;
                    }
                    break;
                case 'on': // An user started to subscribe (connecting to application)
                    user.status = User.USER_CONNECTED;
                    usersDataCollection.publishMessage({notify: User.USER_ALREADY_HERE}, {metadata: this.user});
                    break;
                case 'off': // An user has unsubscribed (left the application)
                    user.status = User.USER_DISCONNECTED;
                    break;

            }
            this.travelMembersStream.next(user);
        });
    }

    /**
     * Call Kuzzle WhoAmI method and refresh the current application user with those data.
     *
     * @returns {Promise<User>}
     */
    private refreshCurrentUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            this.kuzzle.whoAmI((error, success) => {
                // TODO : Handle error
                if (error) reject(new Error('Unable to fetch whoAmI user.'));

                // Set the current user
                var user = new User(success.content);
                user.id = success.id;
                user.status = User.USER_CONNECTED;

                this.user = user;
                resolve(user);
            })
        });
    }
}