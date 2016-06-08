import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteData} from '@angular/router-deprecated';

import {TravelFormComponent} from "./travel-form.component";
import {NavbarComponent} from '../../shared/index';

@Component({
    selector: "home",
    templateUrl: 'app/home/components/home.component.html',
    styleUrls: ['app/home/components/home.component.css'],
    directives: [ROUTER_DIRECTIVES, TravelFormComponent, NavbarComponent]
})
export class HomeComponent{
    signInOnly: boolean;

    constructor(private _data: RouteData) {
        //when arriving directly from /login URL
        this.signInOnly = this._data.get('signInOnly') || true; // set default to false to re-activate the destination form
    }
}
