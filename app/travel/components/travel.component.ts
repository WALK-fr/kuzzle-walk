import {Component, AfterViewInit} from 'angular2/core';

import {TravelSelectorComponent} from './travel-selector.component';
import {MapComponent, PoiFormComponent, MarkerListComponent} from '../../map/index';
import {NavbarComponent} from '../../shared/index';
import {ChatComponent} from "../../chat/index";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: "travel",
    templateUrl: 'app/travel/components/travel.component.html',
    directives: [
        MapComponent, PoiFormComponent, MarkerListComponent, NavbarComponent,
        TravelSelectorComponent, ChatComponent
    ]
})
export class TravelComponent implements AfterViewInit {

    isChatOpened = false;

    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit() {
        $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    constrain_width: false, // Does not change width of dropdown to that of the activator
                    hover: true, // Activate on hover
                    gutter: 0, // Spacing from edge
                    belowOrigin: false, // Displays dropdown below the button
                    alignment: 'left' // Displays dropdown with edge aligned to the left of button
                }
        );
    }

    toggleChat() {
        this.isChatOpened = !this.isChatOpened;
    }
}
