import { Component, Input, Output, EventEmitter } from "@angular/core";
import {TravelMarker} from "../models/travel-marker.model";

@Component({
    selector: 'marker-detail',
    templateUrl: 'app/map/components/marker-detail.component.html',
    styleUrls: ['app/map/components/marker-detail.component.css']
})
export class MarkerDetailComponent {

    @Input() marker: TravelMarker;
    @Output('back-to-list') backToListEvent = new EventEmitter();

    /**
     * Remove the information of a marker and display the default panel view
     */
    emitBackToListEvent(){
        this.backToListEvent.emit({});
    }
}
