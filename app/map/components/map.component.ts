import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Travel} from "../../travel/models/travel.model";
import {KuzzleService} from "../../shared/kuzzle/index";
import {User} from "../../users/index";
import {TravelMarker} from "../models/travel-marker.model";

// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

@Component({
    selector: 'map',
    template: `<div id="mapid"></div>`,
})
export class MapComponent implements OnInit {

    map:L.Map;
    user:User;
    travel:Travel;

    //MARKERS - one marker per type of TravelMarkers
    private markers = {
        base : L.icon({
            iconUrl: 'assets/img/markers/base.png',
            shadowUrl: 'assets/img/markers/shadow.png',
            iconSize:     [40, 48], // size of the icon
            iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
            shadowSize:   [39, 45], // size of the shadow
            shadowAnchor: [0, 48],
            popupAnchor:  [0, -48] // point from which the popup should open relative to the iconAnchor
        }),
        people : L.icon({
            iconUrl: 'assets/img/markers/people.png',
            shadowUrl: 'assets/img/markers/shadow.png',
            iconSize:     [40, 48], // size of the icon
            iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
            shadowSize:   [39, 45], // size of the shadow
            shadowAnchor: [0, 48],
            popupAnchor:  [0, -48] // point from which the popup should open relative to the iconAnchor
        }),
        informations : L.icon({
            iconUrl: 'assets/img/markers/informations.png',
            shadowUrl: 'assets/img/markers/shadow.png',
            iconSize:     [40, 48], // size of the icon
            iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
            shadowSize:   [39, 45], // size of the shadow
            shadowAnchor: [0, 48],
            popupAnchor:  [0, -48] // point from which the popup should open relative to the iconAnchor
        }),
        landscape : L.icon({
            iconUrl: 'assets/img/markers/landscape.png',
            shadowUrl: 'assets/img/markers/shadow.png',
            iconSize:     [40, 48], // size of the icon
            iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
            shadowSize:   [39, 45], // size of the shadow
            shadowAnchor: [0, 48],
            popupAnchor:  [0, -48] // point from which the popup should open relative to the iconAnchor
        }),
        hotel : L.icon({
            iconUrl: 'assets/img/markers/hotel.png',
            shadowUrl: 'assets/img/markers/shadow.png',
            iconSize:     [40, 48], // size of the icon
            iconAnchor:   [20, 46], // point of the icon which will correspond to marker's location
            shadowSize:   [39, 45], // size of the shadow
            shadowAnchor: [0, 48],
            popupAnchor:  [0, -48] // point from which the popup should open relative to the iconAnchor
        }),

    };

    //Event Emitter when map is clicked, used to trigger the POI Form
    @Output('map-clicked') mapClick  = new EventEmitter();

    constructor(private kuzzleService:KuzzleService) {}

    ngOnInit() {
        // Map initialization
        this.map = L.map('mapid').setView([51.505, -0.09], 13);
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

        //we bind the clicks to the emitter so we can give it to the POI Form
        this.map.on('click', (e) => {
            //add a temporary marker on the map, while the user fill the POI FORM
            this.addMarker(e.latlng.lat, e.latlng.lng, '', null);

            //emit the new event to display the panel Form
            this.mapClick.emit({latlng: e.latlng});
        });



        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);

        // Fetch the travel async + markers from database
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel; // TODO - A QUOI CA SERT ça
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream().subscribe((x) => {
            this.addMarker(x.latitude, x.longitude, x.name, x.type);
        })
    }

    /**
     * Add a new Marker on the map
     * @param lat
     * @param long
     * @param popup
     */
    addMarker(lat: number, long: number, popup: string, icon: string) {
        if(icon != null){
            //get marker by type name
            var marker = L.marker([lat, long], {icon: this.markers[icon]});
        }
        else{
            //default
            var marker = L.marker([lat, long]);
        }
        marker.addTo(this.map)
            .bindPopup(popup)
            .openPopup();

        this.map.setView([lat, long], 13);
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
