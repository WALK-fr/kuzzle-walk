import {Component} from 'angular2/core';

import {TravelMarker} from '../models/travel-marker';
import {Location} from '../models/location';

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html'
})
export class MarkerListComponent {
    markers: TravelMarker[] = [
        new TravelMarker({name : "Jacky",content: "Ye, so fun!",interest: new Location(10, 10)}),
    ];


}
