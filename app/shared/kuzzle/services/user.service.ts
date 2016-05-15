/**
 * Handle each kuzzle calls related to the user.
 */
export class UserService {
    private kuzzle:Kuzzle;

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * Connect an user to the backend, allowing him to interact with others users.
     *
     * @param login The user login
     * @param password The user password
     */
    public login(login:string, password:string) {

        var expiresIn = "1h";

        this.kuzzle.login("local", {username: login, password: password}, expiresIn, (err, res) => {
            console.log(err);
            console.log(res);
            if (null !== res) {
                this.kuzzle.setJwtToken(res.jwt);
                console.log(res.jwt);
            }
        });

        this.kuzzle.whoAmI(function (err, result) {
            console.log(err, result);
        });
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