import {Component, OnInit} from "angular2/core";
import {Travel} from "../../travel/models/travel.model";
import {KuzzleService} from "../../shared/kuzzle/index";
import {User} from "../../users/index";
import {TravelMarker} from "../models/travel-marker.model";

@Component({
    selector: 'map',
    template: `
        <div id="mapid"></div>
    `
})
export class MapComponent implements OnInit {

    map:L.Map;
    user:User;
    travel:Travel;

    constructor(private kuzzleService:KuzzleService) {

    }

    ngOnInit() {
        // Map initialization
        this.map = L.map('mapid').setView([51.505, -0.09], 13);
        this.map.addControl( new L.Control.Search({
            url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                markerLocation: true,
                autoCollapse: true,
                autoType: false,
                minLength: 2
        }) );
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);

        // Fetch the travel async + markers from database
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream().subscribe((x) => {
            this.addMarker(x.latitude, x.longitude, x.name)
        })
    }

    addMarker(lat: number, long: number, popup: string) {
        L.marker([lat, long]).addTo(this.map)
            .bindPopup(popup)
            .openPopup();

        this.map.setView([lat, long], 13);
    }
}
