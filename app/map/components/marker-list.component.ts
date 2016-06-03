import {Component, OnInit} from "angular2/core";
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

    constructor(private kuzzleService:KuzzleService) {
    }

    ngOnInit() {
        // Fetch the travel async + markers from database
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;

            // Therefore fetch all markers
            this.kuzzleService.mapService.getAllMarkersForTravel(this.travel.id).subscribe((x:TravelMarker[]) => {
                x.forEach((x) => {
                    this.markers.push(x);
                });
            });
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkersListener().subscribe((x) => {
            this.kuzzleService.updateLocalCollection(this.markers, x);
        })
    }
}
