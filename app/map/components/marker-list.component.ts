import {Component, OnInit} from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {KuzzleService} from "../../shared/kuzzle/services/kuzzle.service";
import {Travel} from "../../travel/index";
import { User } from "../../users/index";

@Component({
    selector: 'marker-list',
    templateUrl: 'app/map/components/marker-list.component.html'
})
export class MarkerListComponent implements OnInit {
    markers: TravelMarker[] = [];
    travel:Travel;

    //TODO - replace this when we wil lhave all the travel users in the travel object
    allUsers = {
            pcavalet: {
                "travels": [
                    "AVUBlAwrUcbOJQOclyhl"
                ],
                "firstName": "Pierre",
                "lastName": "Cavalet",
                "photoUrl": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12219322_10207849395463671_7581599865753333441_n.jpg?oh=0275893d2661c07097c3e00bd16e1e77&oe=57D516BB",
                "profile": "default"
            },
            mparreno: {
                "travels": [
                    "AVUBlAwrUcbOJQOclyhl"
                ],
                "firstName": "Michel",
                "lastName": "Parreno",
                "photoUrl": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12524038_10208722938375131_912919683242799511_n.jpg?oh=1ececfa600302138d8517f9517d9a466&oe=580F9475",
                "profile": "default"
            },
            ahans: {
                "travels": [
                    "AVUBlAwrUcbOJQOclyhl"
                ],
                "firstName": "Andréas",
                "lastName": "Hanss",
                "photoUrl": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.7.50.50/p50x50/13178567_10209240637637970_4443718325874478187_n.jpg?oh=22945150c0990788b181752674bc0379&oe=57D2FDAA",
                "profile": "default"
            }
        };

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
}
