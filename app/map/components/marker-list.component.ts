import {Component} from 'angular2/core';

import {TravelMarker} from '../models/travel-marker';
import {Location} from '../models/location';

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html'
})
export class MarkerListComponent {
    markers: TravelMarker[] = [
        new TravelMarker("Jacky", "Ye, so fun!", new Location(10, 10)),
        new TravelMarker("Michel", "It was great.", new Location(10, 10)),
        new TravelMarker("Francis", "Go to the pool.", new Location(10, 10))
    ];


}
