import {Component, Input} from '@angular/core';

@Component({
    selector: 'travel-selector',
    templateUrl: 'app/travel/components/travel-selector.component.html',
    styleUrls: ['app/travel/components/travel-selector.component.css']
})
export class TravelSelectorComponent {
    @Input() mainLocationName: string;
    @Input() stepNames: string[];
    // TODO: define how we handle the current step and what type we use
    
    constructor() {
        this.mainLocationName = "France";
        this.stepNames = [
            "Paris",
            "Marseille",
            "Lyon",
            "Nice"
        ];
    }

}
