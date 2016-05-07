import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from "./home/index";
import {LoginFormComponent} from "./users/index";
import {TravelComponent} from "./travel/index";


@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent},
    { path: '/login', name: 'Login', component: LoginFormComponent},
    { path: '/travel', name: 'Travel', component: TravelComponent}
])
@Component({
    selector: 'tp-app',
    template: `
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {

}
