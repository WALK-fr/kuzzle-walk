import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Travel} from "../../travel/index";

declare var $: any;

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html',
    styleUrls: ['app/map/components/marker-list.component.css']
})
export class MarkerListComponent implements OnInit {
    markers: TravelMarker[] = [];
    travel:Travel;

    @Output('display-marker-information') markerInformationsEvent = new EventEmitter();

    constructor(private kuzzleService:KuzzleService) {
        this.travel = new Travel();
    }

    ngOnInit() {

        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream()
            .subscribe(marker => this.kuzzleService.updateLocalCollection(this.markers, marker));
    }

    /**
     * send an event to display the detail of a marker in the right panel
     * @param $marker
     */
    emitMarkerInformationsEvent(marker:TravelMarker){
        this.markerInformationsEvent.emit(marker);
    }

    //Handles the event emitter that comes from the map (marker-click) event (when a persisted marker is clicked)
    highlightMarker($marker){
        //remove class from previously clicked marker
        $('#panel-marker-list').find('li').removeClass('hightlight-marker');

        //add a class and scroll to the element on the list
        let listItemId = "#marker-" + $marker.id;
        $(listItemId).addClass('hightlight-marker');

        var $tpRightPanel = $('#tp-right-panel');

        $tpRightPanel.animate({
            scrollTop: $(listItemId).offset().top - $tpRightPanel.offset().top + $tpRightPanel.scrollTop()
        });​
    }
}
