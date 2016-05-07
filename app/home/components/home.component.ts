import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    template: `
      <h1>Kuzzle Walk Initialization</h1>
      <p>Plug component next to me to realize the interface</p>
      <a [routerLink]="['Travel']">Travel</a>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {

}
