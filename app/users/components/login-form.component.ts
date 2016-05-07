import {Component} from 'angular2/core';
import {ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {User} from '../models/user'
import {KuzzleService} from "../../shared/services/kuzzle/KuzzleService.service";

@Component({
    templateUrl: 'app/users/components/login-form.component.html',
})
export class LoginFormComponent {
    userForm: ControlGroup;
    user = new User();

    constructor(fb: FormBuilder, private kuzzleService:KuzzleService) {
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
        this.kuzzleService.userService.login(this.user.name,this.user.password);
    }
}
