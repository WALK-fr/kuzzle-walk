import {Component} from "@angular/core";
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {HomeComponent} from "./home/index";
import {LoginFormComponent} from "./users/index";
import {TravelComponent} from "./travel/index";


@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent},
    { path: '/login', name: 'Login', component: LoginFormComponent},
    { path: '/travel', name: 'Travel', component: TravelComponent}
])
@Component({
    selector: 'body',
    template: `<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
}
