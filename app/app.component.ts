import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {KuzzleService} from "./shared/services/kuzzle/KuzzleService.service";
import {HomeComponent} from "./home/home";


@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent}
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
