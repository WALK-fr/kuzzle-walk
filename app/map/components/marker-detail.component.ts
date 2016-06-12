import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";
import {Travel} from "../../travel/models/travel.model";

@Component({
    selector: 'marker-detail',
    templateUrl: 'app/map/components/marker-detail.component.html',
    styleUrls: ['app/map/components/marker-detail.component.css']
})
export class MarkerDetailComponent implements OnInit{
    @Input() travel: Travel;
    @Input() marker: TravelMarker;
    @Output('back-to-list') backToListEvent = new EventEmitter();

    ngOnInit(){
        console.log("marker detail :", this.travel);
    }

    /**
     * Remove the information of a marker and display the default panel view
     */
    emitBackToListEvent(){
        this.backToListEvent.emit({});
    }

    /**
     * get's the user that posted the marker
     * @param userId
     */
    getMarkerUser(){
        return this.travel.members.find( (member) => { return member.id === this.marker.userId } );
    }
}
