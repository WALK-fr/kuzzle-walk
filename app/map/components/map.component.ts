import {Component, OnInit} from "angular2/core";
import {Travel} from "../../travel/models/travel.model";
import {KuzzleService} from "../../shared/kuzzle/index";
import {User} from "../../users/index";
import {Subject} from "rxjs/Rx";
import {TravelMarker} from "../models/travel-marker";

@Component({
    selector: 'map',
    template: `
        <div id="mapid"></div>
    `
})
export class MapComponent implements OnInit {

    map:L.Map;
    travel:Travel;
    user:User;

    constructor(private kuzzleService:KuzzleService) {
        var stream:Subject<Travel> = kuzzleService.mapService.getTravel();
        // TODO : Stop stream
        stream.subscribe(x => {
            this.travel = x;
         // Get POI
            var poiStream = kuzzleService.mapService.getAllMarkersForTravel(this.travel.id);
            poiStream.subscribe((x:TravelMarker[]) => {
                x.forEach((x) => {
                    this.addMarker(x.getLatitude(), x.getLongitude(),x.name);
                });
            })
        });


    }

    ngOnInit() {
        // map initialization
        this.map = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        L.marker([51.5, -0.09]).addTo(this.map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();



        this.addMarker(48.85401, 2.35279, "<p>test</p>");
    }

    addMarker(lat: number, long: number, popup: string) {
        L.marker([lat, long]).addTo(this.map)
            .bindPopup(popup)
            .openPopup();

        this.map.setView([lat, long], 13);
    }
}
