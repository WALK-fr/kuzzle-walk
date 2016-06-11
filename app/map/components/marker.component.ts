import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import {TravelMarker} from "../models/travel-marker.model";
import {CATEGORIES} from "../marker-categories";

declare var L: any;

@Component({
    selector: 'marker',
    template: ``
})
export class MarkerComponent implements OnInit, OnDestroy {
    // @Input('marker-model') markerModel: TravelMarker;
    markerModel: TravelMarker = new TravelMarker({
        name: "test marker from marker component",
        latitude: 48.88354861533135,
        longitude: 2.2360610961914062,
        type: "informations"
    });

    leafletMarker: any;
    @Input('map') map: any;
    layerGroup: any;

    constructor() {}

    ngOnInit() {
        console.log(CATEGORIES);
        var cate = CATEGORIES.find(category => { return category.name === this.markerModel.type });
        console.log("category");
        console.log(cate);
        this.layerGroup = cate.group.layerGroup;
        this.leafletMarker = L.marker([this.markerModel.latitude, this.markerModel.longitude], {icon: cate.icon});
        this.layerGroup.addLayer(this.leafletMarker);
    }

    ngOnDestroy() {
        this.layerGroup.removeLayer(this.leafletMarker);
    }
}
