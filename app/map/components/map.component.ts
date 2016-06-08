import { Component, OnInit, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { Travel } from "../../travel/models/travel.model";
import { KuzzleService } from "../../shared/kuzzle/index";
import { User } from "../../users/index";
import { TravelMarker } from "../models/travel-marker.model";
import FeatureGroup = L.FeatureGroup;
import LatLngBounds = L.LatLngBounds;
import LatLng = L.LatLng;

// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

@Component({
    selector: 'map',
    template: `<div id="mapid"></div>`,
})
export class MapComponent implements OnInit, AfterViewInit{

    map:L.Map;
    user:User;
    travel:Travel;

    /** Event Emitter when map is clicked, used to trigger the POI Form **/
    @Output('map-clicked') mapClick = new EventEmitter();

    /**
     *  MARKERS - one marker per type of TravelMarkers
     */
    private markersIcons = {
        default : L.AwesomeMarkers.icon({
            icon: 'map-marker',
            markerColor: 'orange',
            prefix: 'fa'
        }),
        art : L.AwesomeMarkers.icon({
            icon: 'paint-brush',
            markerColor: 'darkred',
            prefix: 'fa'
        }),
        museum : L.AwesomeMarkers.icon({
            icon: 'museum',
            markerColor: 'darkred',
            prefix: 'fa'
        }),
        temple : L.AwesomeMarkers.icon({
            icon: 'museum',
            markerColor: 'darkred',
            prefix: 'fa'
        }),
        entertainment : L.AwesomeMarkers.icon({
            icon: 'thumbs-up',
            markerColor: 'cadetblue',
            prefix: 'fa'
        }),
        bar : L.AwesomeMarkers.icon({
            icon: 'beer',
            markerColor: 'cadetblue',
            prefix: 'fa'
        }),
        mall : L.AwesomeMarkers.icon({
            icon: 'shopping-bag',
            markerColor: 'cadetblue',
            prefix: 'fa'
        }),
        restaurant : L.AwesomeMarkers.icon({
            icon: 'coffee',
            markerColor: 'cadetblue',
            prefix: 'fa'
        }),
        informations : L.AwesomeMarkers.icon({
            icon: 'coffee',
            markerColor: 'blue',
            prefix: 'fa'
        }),
        hotel : L.AwesomeMarkers.icon({
            icon: 'cutlery',
            markerColor: 'blue',
            prefix: 'fa'
        }),
        station : L.AwesomeMarkers.icon({
            icon: 'subway',
            markerColor: 'black',
            prefix: 'fa'
        }),
        harbor : L.AwesomeMarkers.icon({
            icon: 'anchor',
            markerColor: 'black',
            prefix: 'fa'
        }),
        airport : L.AwesomeMarkers.icon({
            icon: 'plane',
            markerColor: 'black',
            prefix: 'fa'
        }),
        landscape : L.AwesomeMarkers.icon({
            icon: 'leaf',
            markerColor: 'green',
            prefix: 'fa'
        }),
        friends : L.AwesomeMarkers.icon({
            icon: 'user',
            markerColor: 'purple',
            prefix: 'fa'
        }),
        family : L.AwesomeMarkers.icon({
            icon: 'users',
            markerColor: 'purple',
            prefix: 'fa'
        })
    };
    private listeCategLayerGroup = ['default','art','museum','temple','entertainment','bar','mall','restaurant','informations','hotel','station','harbor','airport','landscape','friends','family','other'];
    private layerGroups: any = [];

    constructor(private kuzzleService:KuzzleService) {}

    ngOnInit() {
        // Map initialization
        this.map = L.map('mapid').setView([48.8587741, 2.2], 13);
        // this.map = L.map('mapid');

        // Search box
        this.map.addControl( new L.Control.Search({
            url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                collapsed: false,
                markerLocation: true,
                autoCollapse: false,
                autoType: false,
                autoResize: true,
                minLength: 2,
                position: 'bottomleft'
        }) );

        // We bind the clicks to the emitter so we can give it to the POI Form
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            //add a temporary marker on the map, while the user fill the POI FORM
            this.addMarker(e.latlng.lat, e.latlng.lng, '', null);

            //emit the new event to display the panel Form
            this.mapClick.emit({latlng: e.latlng});
        });

        // We add tiles to the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);

        // Add layergroups for each category of POI
        this.listeCategLayerGroup.forEach(value => {
            this.layerGroups[value] = L.layerGroup();
            this.map.addLayer(this.layerGroups[value]);
        });
        // And allow control on them
        this.map.addControl(L.control.layers(null, this.layerGroups));

        // Fetch the travel async + markers from database
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel; // TODO - A QUOI CA SERT ça
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream().subscribe((x) => {
            this.addMarker(x.latitude, x.longitude, x.name, x.type);
        });
    }

    ngAfterViewInit(){
        //TODO - uncomment when allMarkers on map will be available as a class variable
    }

    /**
     * Add a new Marker on the map
     */
    addMarker(lat: number, long: number, popup: string, markerType: string) {
        (markerType == null || !this.markersIcons[markerType]) ? markerType = 'default' : '';

        //get marker by type name
        var marker = L.marker([lat, long], {icon: this.markersIcons[markerType]});

        // TODO Securiser la méthode pour alerter en cas de non correspondance

        // Add marker to his specific group
        this.layerGroups[markerType].addLayer(marker);
    }

    /**
     * delete a previously created temporary marker to use with the panel form
     * @param markerToDelete
     */
    deleteTemporaryMarker(markerToDelete:TravelMarker){
        var markerToRemove = L.marker([markerToDelete.latitude, markerToDelete.longitude]);
        this.map.removeLayer(markerToRemove);
    }
}
