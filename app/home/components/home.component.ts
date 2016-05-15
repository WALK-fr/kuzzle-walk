import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TravelFormComponent} from "./travel-form.component";
import {NavbarComponent} from "../../travel/components/navbar.component";

@Component({
    selector: "home",
    templateUrl: 'app/home/components/home.component.html',
    styleUrls: ['app/home/components/home.component.css'],
    directives: [ROUTER_DIRECTIVES, TravelFormComponent, NavbarComponent]
})
export class HomeComponent {
}
