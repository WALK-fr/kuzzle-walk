import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {Router} from "@angular/router-deprecated";

import {KuzzleService} from "../../shared/kuzzle/index";

@Component({
    selector: 'login-form',
    templateUrl: 'app/home/components/login-form.component.html'
})
export class LoginFormComponent {

    loginForm: ControlGroup;
    @Input('sign-in-only') signInOnly = false;
    @Output('login') loginEvent = new EventEmitter;
    formError: string;

    constructor(fb: FormBuilder, private _kuzzleService: KuzzleService, private _router: Router) {
        this.loginForm = fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * triggered when the login form is submitted
     * @param form
     */
    login(form:any) {

        // handle incorrect form submission
        if (!this.loginForm.valid)
            return;

        // log the user using the user service
        this._kuzzleService.userService
            .login(form.username, form.password)
            .then(res => this.loginEvent.emit({}))
            .catch(error => {
                if (error.message === 'Bad Credentials') {
                    this.formError = "Bad credentials";
                }
            });
    }
}