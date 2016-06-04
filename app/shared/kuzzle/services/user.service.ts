import {User} from "../../../users/models/user";
/**
 * Handle each kuzzle calls related to the user.
 */
export class UserService {
    private kuzzle:Kuzzle;
    user:User;

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
        this.user = new User();
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
                error === null ? resolve(success) : reject(error); // Return error or success for login
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
}