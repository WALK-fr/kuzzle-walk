// Type definitions for Kuzzle SDK JS
// Project: http://kuzzle.io/
// Definitions by: Andréas 'ScreamZ' Hanss <https://github.com/ScreamZ>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Initiate a Kuzzle object (main object)
 */
interface Kuzzle {
    constructor(url:string, options?:kuzzleConnectOptions):any;

    /**
     * Log a user according to a strategy and credentials.
     *
     * If the Kuzzle response contains a JWT Token, the SDK token is set and the loginAttempt event is fired immediately with the following object:
     * { success: true }
     * This is the case, for instance, with the local authentication strategy.
     *
     * If the request succeeds but there is no token, then it means that the chosen strategy is a two-steps authentication method, like OAUTH. In that case, the loginAttempt event is not fired. To complete the login attempt, the setJwtToken method must be called either with a token or with an appropriate Kuzzle response.
     *
     * If the login attempt fails, the loginAttempt event is fired with the following response:
     * { success: false, error: 'error message' }
     *
     * @param strategy
     * @param credential
     * @param expiresIn
     * @param callback
     */
    login(strategy:string, credential:{username:string; password:string}, expiresIn:string, callback:(err:any, res:any) => any):Kuzzle;
    /**
     * Logs the user out.
     *
     * Resolves to the Kuzzle object itself once the logout process is complete, either successfully or not.
     * The Kuzzle object will unset the property jwtToken if the user is successfully logged out.
     *
     * @param callback
     */
    logout(callback:(err:any, res:any)=>any):Kuzzle;
    /**
     * Return informations about the currently logged user.
     * 
     * @param callback
     */
    whoAmI(callback:(err:any, result:any)=>any):void;
    setJwtToken(jwt:string):Kuzzle;
}


interface kuzzleConnectOptions {
    autoQueue:boolean,
    autoReconnect:boolean,
    autoReplay:boolean,
    autoResubscribe:boolean,
    connect:string,
    defaultIndex:string,
    headers:any,
    metadata:any,
    offlineMode:string
}