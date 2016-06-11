import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    Output,
    EventEmitter
} from "@angular/core";

import {TravelMarker} from "../models/travel-marker.model";
import {CATEGORIES} from "../marker-categories";

declare var L: any;

@Component({
    selector: 'marker',
    template: ``
})
export class MarkerComponent implements OnInit, OnDestroy, OnChanges {

    leafletMarker: any;
    layerGroup: any;
    @Input('marker-model') markerModel: TravelMarker;
    @Input('map') map: any;
    @Output('marker-click') markerClick = new EventEmitter();

    /**
     * create the leaflet marker when the component is initialized
     */
    ngOnInit() {
        this.createMarker();
    }

    /**
     * remove the old marker and create the new one on the map when data is modified
     */
    ngOnChanges() {
        //
        if(!this.layerGroup)
            return;

        this.removeMarker();
        this.createMarker();
    }

    /**
     * remove the marker on the map when the component is destroyed
     */
    ngOnDestroy() {
        this.removeMarker();
    }

    /**
     * create the marker on the map
     */
    createMarker() {

        // get the marker category
        let tempCategory = CATEGORIES.find(category => { return category.name === this.markerModel.type });

        if(this.markerModel.type == null || tempCategory === undefined)
            this.markerModel.type = 'default';

        let markerCategory = CATEGORIES.find(category => { return category.name === this.markerModel.type });

        // set the marker layer depending on the marker category
        this.layerGroup = markerCategory.group.layerGroup;

        this.leafletMarker = L.marker([this.markerModel.latitude, this.markerModel.longitude], {icon: markerCategory.icon});

        // if it is a persisted marker, we emit an event with the marker id on click
        if(this.markerModel.id !== null)
            this.leafletMarker.on('click', () => this.markerClick.emit({id: this.markerModel.id}));

        this.layerGroup.addLayer(this.leafletMarker);
    }

    /**
     * remove the marker on the map
     */
    removeMarker() {
        this.layerGroup.removeLayer(this.leafletMarker);
    }


}
