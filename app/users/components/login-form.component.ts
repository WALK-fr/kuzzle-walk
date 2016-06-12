import {Component} from '@angular/core';
import {ControlGroup, FormBuilder, Validators} from '@angular/common';

import {User} from '../index'
import {KuzzleService} from "../../shared/kuzzle/index";

@Component({
    templateUrl: 'app/users/components/login-form.component.html',
})
export class LoginFormComponent {
    userForm: ControlGroup;
    private _user = new User();

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
        //console.log(this.userForm);
        // this.kuzzleService.userService.login(this);
    }


    get user():User {
        return this._user;
    }
}
