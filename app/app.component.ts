import {Component} from "angular2/core";
import {KuzzleService} from "./shared/services/KuzzleService.service";

import {MapComponent} from "./map/map";

@Component({
    selector: 'tp-app',
    directives: [MapComponent],
    template: `
    <h1>Kuzzle Walk Initialization</h1>
    <p>Plug component next to me to realize the interface</p>
    <map></map>
`
})
export class AppComponent {
    constructor (private kuzzle: KuzzleService) {
        console.log(kuzzle.echo());
    }
}
