import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, RouteData} from '@angular/router-deprecated';

import {TravelFormComponent} from "./travel-form.component";
import {NavbarComponent} from '../../shared/index';

@Component({
    selector: "home",
    templateUrl: 'app/home/components/home.component.html',
    styleUrls: ['app/home/components/home.component.css'],
    directives: [ROUTER_DIRECTIVES, TravelFormComponent, NavbarComponent]
})
export class HomeComponent {

    signInOnly: boolean;

    constructor(data: RouteData) {
        this.signInOnly = data.get('signInOnly') || false;
    }

}
