import {Component} from 'angular2/core';

import {MapComponent} from "../../map/map";

@Component({
    template: `
      <h1>Kuzzle Walk Initialization</h1>
      <p>Plug component next to me to realize the interface</p>
      <map></map>
    `,
    directives: [MapComponent]
})
export class HomeComponent {

}
