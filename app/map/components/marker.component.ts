import { Component, OnInit, OnDestroy, Input, OnChanges } from "@angular/core";

import {TravelMarker} from "../models/travel-marker.model";
import {CATEGORIES} from "../marker-categories";

declare var L: any;

@Component({
    selector: 'marker',
    template: ``
})
export class MarkerComponent implements OnInit, OnDestroy, OnChanges {

    @Input('marker-model') markerModel: TravelMarker;
    leafletMarker: any;
    @Input('map') map: any;
    layerGroup: any;

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
        this.layerGroup.addLayer(this.leafletMarker);
    }

    /**
     * remove the marker on the map
     */
    removeMarker() {
        this.layerGroup.removeLayer(this.leafletMarker);
    }


}
