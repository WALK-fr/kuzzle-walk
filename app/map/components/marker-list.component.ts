import {Component, OnInit} from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Travel} from "../../travel/index";

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html',
    styleUrls: ['app/map/components/marker-list.component.css']
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

    //Handles the event emitter that comes from the map (marker-click) event (when a persisted marker is clicked)
    highlightMarker($marker){
        //remove class from previously clicked marker
        $('#panel-marker-list li').removeClass('hightlight-marker');

        //add a class and scroll to the element on the list
        let listItemId = "#marker-" + $marker.id;
        $(listItemId).addClass('hightlight-marker');

        $('#tp-right-panel').animate({
            scrollTop: $(listItemId).offset().top - $('#tp-right-panel').offset().top + $('#tp-right-panel').scrollTop()
        });​
    }
}
