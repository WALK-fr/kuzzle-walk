import {Component, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";

import {TravelMarker} from "../index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {Travel} from "../../travel/models/travel.model";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: 'poi-form',
    templateUrl: 'app/map/components/poi-form.component.html',
})
export class PoiFormComponent implements OnInit, AfterViewInit {

    poiForm:ControlGroup;
    travelMarker:TravelMarker;

    //output property to notify map to destroy a temporary marker
    @Output('marker-delete') markerDelete = new EventEmitter();

    constructor(private fb:FormBuilder, private kuzzleService:KuzzleService) {}

    /**
     * Set the Marker Lat Lng on each click on the Map component !
     * @param $event
     */
    setMarkerPosition($event){
        this.travelMarker.latitude = $event.latlng.lat;
        this.travelMarker.longitude = $event.latlng.lng;
    }
    
    ngOnInit() {

        this.poiForm = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            type: ['', Validators.required]
        });

        //TODO- change for real value
        this.travelMarker = new TravelMarker({travelId: "AVS5a8AIeivQYXVQtlJN"});
        // this.save();
    }

    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit () {
        $('select').material_select();
        $('ul.tabs').tabs();
    }

    /**
     * save the point of interest and notify the back-end
     */
    save() {
        //TODO - replace this with true form handling
        this.travelMarker.type = $('#type-selector').val();

        this.markerDelete.emit(this.travelMarker);
        this.kuzzleService.mapService.publishTravelMarker(this.travelMarker);
    }
}
