import {Component} from 'angular2/core';
import {ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {User} from '../models/user'

@Component({
    templateUrl: 'app/users/components/login-form.component.html'
})
export class LoginFormComponent {
    userForm: ControlGroup;
    user = new User();

    constructor(fb: FormBuilder) {
        this.userForm = fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * handle login when the form is submitted
     */
    login() {
        // TODO implement login
        // every informations needed are in the user property
        // example below:
        console.log("the user name is " + this.user.name);
    }
}
