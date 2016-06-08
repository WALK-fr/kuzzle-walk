import {Component, OnInit} from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Travel} from "../../travel/index";

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html'
})
export class MarkerListComponent implements OnInit {
    markers: TravelMarker[] = [];
    travel:Travel;

    constructor(private kuzzleService:KuzzleService) {}

    ngOnInit() {

        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream().subscribe((x) => {
            this.kuzzleService.updateLocalCollection(this.markers, x);
        })
    }
}
