import {Component, AfterViewInit} from "angular2/core";
import {ControlGroup, FormBuilder, Validators} from "angular2/common";
import {TravelMarker} from "../index";
import {KuzzleService} from "../../shared/kuzzle/index";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: 'poi-form',
    templateUrl: 'app/map/components/poi-form.component.html',
})
export class PoiFormComponent implements AfterViewInit {
    poiForm:ControlGroup;
    travelMarker:TravelMarker;

    constructor(fb:FormBuilder, private kuzzleService:KuzzleService) {
        this.poiForm = fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            type: ['', Validators.required]
        });

        // TODO : Better do it on ngOnInit()
        this.travelMarker = kuzzleService.mapService.retrieveAllMarkersForTravel(400)[0];
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
