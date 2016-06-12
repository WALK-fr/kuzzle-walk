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
    public getCurrentApplicationUserStream(): Subject<User> {
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
     * Connect the user from a jwt token in cookie.
     *
     * @returns {Promise<User>}
     */
    public connectUserOnKuzzleBackend(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            // Connection from session if the user has one in memory

            let jwt = this.cookieService.get('jwt');
            if (jwt) {
                this.kuzzle.setJwtToken(jwt);
            } else {
                reject(new Error("User doesn't have cookie jwt, can't automatically connect him !"));
                return;
            }

            // Fetch current application user data and then notify connection to the stream.
            this.refreshCurrentUser().then((user: User) => {
                resolve(user);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    /**
     * Enable listener on joining / leaving users.
     * Also respond to incoming user to say "hello i'm here"
     */
    public subscribeToConnectUserVariation() {
        var usersDataCollection = this.kuzzle.dataCollectionFactory('users');
        // Subscribe to users list to notify the user presence and listen to incoming / leaving users
        usersDataCollection.subscribe({}, {
            scope: 'in', // Listen for notify "I'm already here"
            users: 'all', // Listen for incoming users and leaving users
            metadata: this.user, // We send user data each time, useful because on network error, metadata are sent back
            subscribeToSelf: false // We don't want to receive "I'm already here" notifications if we send them.
        }, (error: any, result: any) => {
            var user = new User(result.metadata);

            if(user.id === null){
                return; // TODO : Filter on subscription to avoid kuzzle BO no ID.
            }

            // Update user status depending on action
            switch (result.action) {
                case 'publish': // Volatile message - "Already here" notification
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