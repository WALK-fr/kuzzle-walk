import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Travel } from "../../travel/models/travel.model";
import { KuzzleService } from "../../shared/kuzzle/index";
import { User } from "../../users/index";
import { TravelMarker } from "../models/travel-marker.model";
import { CATEGORIES } from "../marker-categories";
import { MarkerComponent } from "./marker.component";
import LeafletMouseEvent = L.LeafletMouseEvent;
import Point = L.Point;
import Circle = L.Circle;
import {Observable} from "rxjs/Observable";

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
                [map]="map" [marker-model]="marker"
                [selected-marker]="selectedMarkerId"></marker>
        </div>
`,
    directives: [MarkerComponent]
})
export class MapComponent implements OnInit{

    /** Event Emitter when map is clicked, used to trigger the POI Form **/
    @Output('map-clicked') mapClick = new EventEmitter();
    @Output('map-mousemove') mapHover = new EventEmitter();
    @Output('marker-clicked') markerClick = new EventEmitter();
    @Input() isMapSharingActive = false;

    map:L.Map;
    user:User;
    travel:Travel;
    travelMembersCursors: any = [];

    selectedMarkerId: string;
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

        this.bindMouseMoveOnMap();

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

                //create a mapMove circle for each travel member
                this.travel.members.forEach( (member, index) => {
                    let cursor = new L.Marker(
                        new L.LatLng(43.0,2.2),
                        {
                            icon: new L.icon({iconUrl: member.photoUrl, iconSize: [28, 28], iconAnchor: [0,0]}),
                            opacity: 0.9,
                            clickable: false,
                            draggable: false,
                            keyboard: false,
                            zIndexOffset: 999,
                            riseOnHover: false,
                        }
                    );

                    this.travelMembersCursors.push({
                        member : member,
                        cursor: cursor
                    });
                });

                // Set the map view bounds
                if (latLngCollection.length > 0) {
                    this.map.fitBounds(L.latLngBounds(latLngCollection));
                }
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
     * emits latlng of cursor on the map when user hover it
     * debounce reduce the number of emittions
     */
    bindMouseMoveOnMap(){

        // Bind the mouse over event for the shareMap feature with an Observable so we can debounce and reduce by 10 the number of transmitted points
        var mouseMoveObservable = Observable.fromEvent(this.map, "mousemove")
            .debounceTime(5);

        mouseMoveObservable.subscribe((e: L.LeafletMouseEvent) => this.emitMouseMouvements(e));

        //map sharing subscription to receive other people's positions
        this.kuzzleService.mapService.getMapPositionStream().subscribe( mapPosition =>{
            //console.log("received from user "+mapPosition.userId+ " position : lat"+mapPosition.latlng.lat+" lng:"+mapPosition.latlng.lng);

            //let's find each members cursor and move them on the map
            let userCursor = this.travelMembersCursors.find(cursors => cursors.member.id === mapPosition.userId).cursor;
            if(userCursor && mapPosition.latlng.lat && mapPosition.latlng.lng){
                this.map.removeLayer(userCursor);

                //adding a circle class to the icon when added on map
                userCursor.on('add', function(e){
                    $(e.target._icon).addClass('circle member-marker');
                });

                userCursor.setLatLng(mapPosition.latlng).addTo(this.map);
            }
        });

    }

    /**
     * When a marker is clicked on the panel list, we make it bounce on the map
     * @param marker
     */
    highlightMarkerOnMap(marker:TravelMarker){
        // change the selected marker id
        this.selectedMarkerId = marker.id;
    }

    /**
     * triggered when a marker is clicked. This is used to forward the information to the travel component
     * @param markerInfo
     */
    markerClicked(markerInfo) {
        this.markerClick.emit(markerInfo);
    }

    /**
     * triggered when a marker is persisted in order to delete the temporary and display the persistant
     */
    deleteTemporaryMarker() {
        this.temporaryMarker = null;
    }

    /**
     * emit current latlng of the user mouse on the map
     * @param e
     */
    emitMouseMouvements(e:LeafletMouseEvent){
        if(this.isMapSharingActive) {
            this.mapHover.emit(e.latlng);
        }
    }
}
