import {Component, OnInit} from "angular2/core";

import {Travel} from "../../travel/models/travel.model";
import {KuzzleService} from "../../shared/kuzzle/index";
import {User} from "../../users/index";
import {Subject, Observable} from "rxjs/Rx";
import {TravelMarker} from "../models/travel-marker.model";

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
        var stream:Subject<Travel> = kuzzleService.getTravel();
        
        stream.subscribe(x => {
            this.travel = x;
         // Get POI
            var poiStream = kuzzleService.mapService.getAllMarkersForTravel(this.travel.id);
            poiStream.subscribe((x:TravelMarker[]) => {
                x.forEach((x) => {
                    this.addMarker(x.latitude, x.longitude,x.name);
                });
            })
        });
    }

    ngOnInit() {
        // map initialization
        this.map = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);

      this.kuzzleService.mapService.getTravelMarkersListener().subscribe((x) => {
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
