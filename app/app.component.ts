import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {KuzzleService} from "./shared/services/kuzzle/KuzzleService.service";
import {HomeComponent} from "./home/home";
import {LoginFormComponent} from "./users/users";
import {TravelComponent} from "./travel/travel";


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
