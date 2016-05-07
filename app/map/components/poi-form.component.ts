import {Component} from 'angular2/core';
import {ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Poi} from '../index'

@Component({
    selector: 'poi-form',
    templateUrl: 'app/map/components/poi-form.component.html',
})
export class PoiFormComponent {
    poiForm: ControlGroup;
    poi = new Poi();

    constructor(fb: FormBuilder) {
        this.poiForm = fb.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            type: ['', Validators.required]
        });
    }

    /**
     * save the point of interest and notify the back-end
     */
    save() {
        // add the point
        // notify the back-end
    }
}
