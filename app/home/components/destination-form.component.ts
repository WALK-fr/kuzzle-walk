import {Component, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";

@Component({
    selector: 'destination-form',
    templateUrl: 'app/home/components/destination-form.component.html',
    styleUrls: ['app/home/components/travel-form.component.css']
})
export class DestinationFormComponent {
    destinationForm: ControlGroup;
    @Output('destination') destinationEvent = new EventEmitter;


    constructor(fb: FormBuilder) {
        this.destinationForm = fb.group({
            destination: ['', Validators.required]
        });
    }

    /**
     * triggered when the destination from is submitted
     */
    saveDestination(form:any) {

        if (!this.destinationForm.valid)
            return;

        // emit a signal to notify that the destination has been picked
        this.destinationEvent.emit({name: form.destination, latitude: 45.0, longitude: 1.5, defaultZoom: 13});
    }

}