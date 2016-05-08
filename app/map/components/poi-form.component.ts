import {Component} from "angular2/core";
import {ControlGroup, FormBuilder, Validators} from "angular2/common";
import {TravelMarker} from "../index";
import {KuzzleService} from "../../shared/kuzzle/index";

@Component({
    selector: 'poi-form',
    templateUrl: 'app/map/components/poi-form.component.html',
})
export class PoiFormComponent {
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
     * save the point of interest and notify the back-end
     */
    save() {
        this.kuzzleService.mapService.publishTravelMarker(this.travelMarker);
    }
}
