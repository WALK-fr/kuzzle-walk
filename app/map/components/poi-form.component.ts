import {Component, AfterViewInit, OnInit} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";

import {TravelMarker} from "../index";
import {KuzzleService} from "../../shared/kuzzle/index";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: 'poi-form',
    templateUrl: 'app/map/components/poi-form.component.html',
})
export class PoiFormComponent implements OnInit, AfterViewInit {

    poiForm:ControlGroup;
    travelMarker:TravelMarker;

    constructor(private fb:FormBuilder, private kuzzleService:KuzzleService) {
      
    }

    /**
     * Set the Marker Lat Lng on each click on the Map component !
     * @param $event
     */
    setAddress($event){
        this.travelMarker.latitude = $event.latlng.lat;
        this.travelMarker.longitude = $event.latlng.lng;
        console.log(this.travelMarker);
    }
    
    ngOnInit() {
        this.poiForm = this.fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            type: ['', Validators.required]
        });

        this.travelMarker = new TravelMarker({});
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
        this.kuzzleService.mapService.publishTravelMarker(this.travelMarker);
    }
}
