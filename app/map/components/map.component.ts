import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Travel } from "../../travel/models/travel.model";
import { KuzzleService } from "../../shared/kuzzle/index";
import { User } from "../../users/index";
import { TravelMarker } from "../models/travel-marker.model";

// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

import FeatureGroup = L.FeatureGroup;
import LatLngBounds = L.LatLngBounds;
import LatLng = L.LatLng;

@Component({
    selector: 'map',
    template: `<div id="mapid"></div>`,
})
export class MapComponent implements OnInit{

    map:L.Map;
    user:User;
    travel:Travel;

    /** Event Emitter when map is clicked, used to trigger the POI Form **/
    @Output('map-clicked') mapClick = new EventEmitter();

    /**
     *  MARKERS - one marker per type of TravelMarkers
     */
    private markersCategories = [
        {
            name: "default",
            group: {
                id: '<strong> Other </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'map-marker',
                markerColor: 'orange',
                prefix: 'fa'
            })
        },
        {
            name: "art",
            group: {
                id: '<strong> Art </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'paint-brush',
                markerColor: 'darkred',
                prefix: 'fa'
            })
        },
        {
            name: "museum",
            group: {
                id: '<strong> Museum </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'university',
                markerColor: 'red',
                prefix: 'fa'
            })
        },
        {
            name: "temple",
            group: {
                id: '<strong> Temple </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'university',
                markerColor: 'red',
                prefix: 'fa'
            })
        },
        {
            name: "entertainment",
            group: {
                id: '<strong> Entertainment </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'thumbs-up',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "bar",
            group: {
                id: '<strong> Bar </strong>',
                layerGroup: L.layerGroup()}
            ,
            icon: L.AwesomeMarkers.icon({
                icon: 'beer',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "mall",
            group: {
                id: '<strong> Shopping </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'shopping-bag',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "restaurant",
            group: {
                id: '<strong> Restaurant </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'cutlery',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "informations",
            group: {
                id: '<strong> Informations </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'info',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "hotel",
            group: {
                id: '<strong> Hotel </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'hotel',
                markerColor: 'cadetblue',
                prefix: 'fa'
            })
        },
        {
            name: "station",
            group: {
                id: '<strong> Station </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'subway',
                markerColor: 'black',
                prefix: 'fa'
            })
        },
        {
            name: "harbor",
            group: {
                id: '<strong> Harbor / Peer </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'anchor',
                markerColor: 'black',
                prefix: 'fa'
            })
        },
        {
            name: "airport",
            group: {
                id: '<strong> Airport </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'plane',
                markerColor: 'black',
                prefix: 'fa'
            })
        },
        {
            name: "landscape",
            group: {
                id: 'Landscape',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'image',
                markerColor: 'green',
                prefix: 'fa'
            })
        },
        {
            name: "friends",
            group: {
                id: '<strong> Friends </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'user',
                markerColor: 'purple',
                prefix: 'fa'
            })
        },
        {
            name: "family",
            group: {
                id: '<strong> Family </strong>',
                layerGroup: L.layerGroup()
            },
            icon: L.AwesomeMarkers.icon({
                icon: 'users',
                markerColor: 'purple',
                prefix: 'fa'
            })
        }
    ];

    constructor(private kuzzleService:KuzzleService) {}

    ngOnInit() {
        // Map initialization
        this.map = L.map('mapid').setView([48.8587741, 2.2], 13);
        // this.map = L.map('mapid');

        // Search box
        this.map.addControl( new L.Control.Search({
            url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                collapsed: false,
                markerLocation: true,
                autoCollapse: false,
                autoType: false,
                autoResize: true,
                minLength: 2,
                position: 'bottomleft'
        }) );

        // We bind the clicks to the emitter so we can give it to the POI Form
        this.map.on('click', (e: L.LeafletMouseEvent) => {
            //add a temporary marker on the map, while the user fill the POI FORM
            this.addMarker(e.latlng.lat, e.latlng.lng, '', null);

            //emit the new event to display the panel Form
            this.mapClick.emit({latlng: e.latlng});
        });

        // We add tiles to the map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors with TravelPlanner team'
        }).addTo(this.map);

        // Add layergroups for each category of POI
        this.markersCategories.forEach( category => {
           this.map.addLayer((category.group.layerGroup));
        });

        // And allow control on them
        var allFilters = [];
        this.markersCategories.map( (category) => { return  category.group } ).forEach( (group) => allFilters[group.id] = group.layerGroup);

        this.map.addControl(L.control.layers({}, allFilters, { position: 'bottomright' }));

        // Fetch the travel async + markers from database
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel; // TODO - A QUOI CA SERT ça
        });

        // ...therefore subscribe the new / update / delete of TravelMarkers
        this.kuzzleService.mapService.getTravelMarkerStream().subscribe((x) => {
            this.addMarker(x.latitude, x.longitude, x.name, x.type);
        });
    }

    /**
     * Add a new Marker on the map
     */
    addMarker(lat: number, long: number, popup: string, markerType: string) {
        (markerType == null || this.markersCategories.find( category => { return category.name === markerType }) === undefined) ? markerType = 'default' : '';

        var markerCategory = this.markersCategories.find( category => { return category.name === markerType });

        //get marker by type name
        var marker = L.marker([lat, long], {icon: markerCategory.icon});

        // TODO Securiser la méthode pour alerter en cas de non correspondance

        // Add marker to his specific group
        markerCategory.group.layerGroup.addLayer(marker);
    }

    /**
     * delete a previously created temporary marker to use with the panel form
     * @param markerToDelete
     */
    deleteTemporaryMarker(markerToDelete:TravelMarker){
        var markerToRemove = L.marker([markerToDelete.latitude, markerToDelete.longitude]);
        this.map.removeLayer(markerToRemove);
    }
}
