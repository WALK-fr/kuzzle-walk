import {Component} from 'angular2/core';

import {MapComponent, PoiFormComponent} from '../../map/map';

@Component({
    templateUrl: 'app/travel/components/travel.component.html',
    directives: [MapComponent, PoiFormComponent]
})
export class TravelComponent {

}
