import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Travel } from "../../travel/models/travel.model";
import { KuzzleService } from "../../shared/kuzzle/index";
import { User } from "../../users/index";
import { TravelMarker } from "../models/travel-marker.model";
import { CATEGORIES } from "../marker-categories";
import { MarkerComponent } from "./marker.component";

// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

@Component({
    selector: 'map',
    template: `
        <div id="mapid">
            <marker *ngIf="temporaryMarker" [map]="map" [marker-model]="temporaryMarker"></marker>
            <marker *ngFor="let marker of markers"
                (marker-click)="markerClicked($event)"
                [map]="map" [marker-model]="marker"></marker>
        </div>
`,
    directives: [MarkerComponent]
})
export class MapComponent implements OnInit{

    /** Event Emitter when map is clicked, used to trigger the POI Form **/
    @Output('map-clicked') mapClick = new EventEmitter();
    @Output('map-mousemove') mapHover = new EventEmitter();
    @Output('marker-clicked') markerClick = new EventEmitter();

    map:L.Map;
    user:User;
    travel:Travel;
    temporaryMarker: TravelMarker;
    markers: TravelMarker[] = [];
    /**
     *  MARKERS - one marker per type of TravelMarkers
     */
    private markersCategories = CATEGORIES;

    constructor(private kuzzleService:KuzzleService) {
        this.travel = new Travel();
    }

    ngOnInit() {
        // Map initialization, default view of the map that will be overrided if some markers are presents
        this.mapInit();

        // Search box initialization
        this.searchInit();

        // We bind the clicks to the emitter so we can give it to the POI Form
        this.bindClickOnMap();

        // Pierre: on le garde ?
        // Bind the msouse over event for the shareMap feature
        this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
            this.mapHover.emit(e.latlng);
        });

        // Add layergroups for each category of marker
        this.markersCategories
            .forEach(category => this.map.addLayer((category.group.layerGroup)));

        // And allow control on them
        var allFilters = [];
        this.markersCategories
            .map(category => {return category.group})
            .forEach(group => allFilters[group.id] = group.layerGroup);

        this.map.addControl(L.control.layers({}, allFilters, { position: 'bottomright'}));

        // Fetch the travel
        this.kuzzleService.travelStream
            .subscribe(travel => {
                this.travel = travel;

                if(!this.travel.id)
                    return;

                var latLngCollection = [];

                // Fetch the markers
                this.travel.travelMarkerCollection
                    .forEach(marker => latLngCollection.push(L.latLng(marker.latitude, marker.longitude)));

                // Set the map view bounds
                this.map.fitBounds(L.latLngBounds(latLngCollection));
            });

        // subscribe to travel marker stream
        this.kuzzleService.mapService.getTravelMarkerStream()
            .subscribe(marker => this.kuzzleService.updateLocalCollection(this.markers, marker));
    }

    /**
     * map initialization
     */
    mapInit() {
        this.map = L.map('mapid', {minZoom: 3}).setView([38.82259, -2.8125], 3);
        this.map.setMaxBounds(L.latLngBounds([84.67351256610522, -174.0234375], [-58.995311187950925, 223.2421875]));

        // Add tiles to the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            noWrap: true,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);
    }

    /**
     * Initialization of the search bar and the callback function triggered when the bar is used
     */
    searchInit() {
        // save the context so we can use this "this" on the moveToLocation callback function
        var self = this;

        this.map.addControl(new L.Control.Search({
            url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat','lon'],
            collapsed: false,
            markerLocation: false,
            autoCollapse: false,
            autoType: false,
            autoResize: true,
            minLength: 2,
            position: 'bottomleft',
            moveToLocation: function(latlng, title, map) {
                if(this.options.zoom)
                    this._map.setView(latlng, this.options.zoom);
                else
                    this._map.panTo(latlng);

                // add marker
                self.temporaryMarker = new TravelMarker({latitude: latlng.lat, longitude: latlng.lng});

                // emit the new event to display the panel form
                self.mapClick.emit({marker: self.temporaryMarker});
            }
        }));
    }



    /**
     * Add an onClick listener on the map so we can trigger event from it
     */
    bindClickOnMap() {
        this.map.on('click', (e: L.LeafletMouseEvent) => {

            // create a new temporary marker
            this.temporaryMarker = new TravelMarker({latitude: e.latlng.lat, longitude: e.latlng.lng});

            //emit the new event to display the panel Form
            this.mapClick.emit({marker: this.temporaryMarker});
        });
    }

    /**
     * When a marker is clicked on the panel list, we make it bounce on the map
     * @param marker
     */
    highlightMarkerOnMap(marker:TravelMarker){
        //TODO- bounce the marker through the marker component
    }

    /**
     * triggered when a marker is clicked. This is used to forward the information to the travel component
     * @param markerInfo
     */
    markerClicked(markerInfo) {
        this.markerClick.emit(markerInfo);
    }

    /**
     * enable kuzzle publish current user map position
     * @param shareUserMap
     */
    shareMyMap(shareUserMap:boolean){

    }

    /**
     * enable subscribing to another user map move events
     * @param user
     * @param allowSharing
     */
    seeOtherUserMap(user:User, allowSharing:boolean){

    }
}
