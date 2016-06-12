import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Observable} from "rxjs/Observable";

declare var $: any;

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html',
    styleUrls: ['app/map/components/marker-list.component.css']
})
export class MarkerListComponent implements OnInit {
    markers: TravelMarker[] = [];
    searchMarkers: TravelMarker[] = [];

    @Output('display-marker-information') markerInformationsEvent = new EventEmitter();

    constructor(private kuzzleService:KuzzleService) {}

    ngOnInit() {
        // subscribe to the marker stream
        this.kuzzleService.mapService.getTravelMarkerStream()
            .subscribe(marker => {
                this.kuzzleService.updateLocalCollection(this.markers, marker);
                //we use the markers collection just to keep all markers somewhere, we will use the searchMarkers var in HTML
                this.kuzzleService.updateLocalCollection(this.searchMarkers, marker);
            });

        //binding the search input and search in all markers name
        var keyUpObservable = Observable.fromEvent($("#searchMarkers"), "keyup")
            .map(e => {
                return e.target.value
            })
            .filter(text => {
                return (text.length >= 3)
            })
            .debounceTime(400)
            .distinctUntilChanged()
            .map(searchTerm => {
                return this.markers.filter( marker => {
                    return marker.name.indexOf(searchTerm) != -1;
                })
            });

        //fill a second array with all matching markers
        keyUpObservable.subscribe(markersResults => {
            this.searchMarkers = markersResults
        });
    }

    /**
     * return searchMarkers only if there is more than 3 characters in the input
     */
    getContextMarkers(){
        if($("#searchMarkers").val().length > 3){
            return this.searchMarkers;
        }
        return this.markers;
    }

    /**
     * Triggered when the user clicks on the delete button on the marker list
     *
     * @param $event
     * @param marker
     */
    deleteMarker($event, marker: TravelMarker) {
        $event.stopPropagation();
        this.kuzzleService.mapService.deleteTravelMarker(marker);
    }

    /**
     * Send an event to display the detail of a marker in the right panel.
     *
     * @param marker
     */
    emitMarkerInformationsEvent(marker:TravelMarker){
        this.markerInformationsEvent.emit(marker);
    }

    /**
     * Handles the event emitter that comes from the map (marker-click) event (when a persisted marker is clicked)
     *
     * @param $marker
     */
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
