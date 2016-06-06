import {Component, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {Router} from "@angular/router-deprecated";

import {KuzzleService} from "../../shared/kuzzle/index";

@Component({
    selector: 'login-form',
    templateUrl: 'app/home/components/login-form.component.html'
})
export class LoginFormComponent {

    loginForm: ControlGroup;
    signInOnly = false;
    @Output('login') loginEvent = new EventEmitter;

    constructor(fb: FormBuilder, private _kuzzleService: KuzzleService, private _router: Router) {
        this.loginForm = fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * triggered when the login form is submitted
     */
    login(form:any) {

        // handle incorrect form submission
        if (!this.loginForm.valid)
            return;

        // TODO : Async call, add marker on component to mark as loading


        // The callback must update steps or display error message
        // TODO : On success add user to travel and travel to user

        if(!this.signInOnly) {
            // emit a signal to notify that connection is done
            this.loginEvent.emit({});
        }
        else{
            this._kuzzleService.userService.login(form.username, form.password).then(res => {
                // redirect to the travel
                console.log('Connecté');
                this._router.navigate(['Travel']);
            }).catch((error) => {
                console.log('Error on connect');
                if (error.message === 'Bad Credentials') {
                    // DO something that display the error message
                }
            });
        }
    }
}