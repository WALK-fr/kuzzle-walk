import {Component, OnInit} from "angular2/core";

/**
 * This components represent the map of the travel.
 */
declare var L: any;

@Component({
    selector: 'map',
    template: `
        <div id="mapid" style="height: 200px;"></div>
    `
})
export class MapComponent implements OnInit{

    map: any;


    ngOnInit() {
        var that = this;
        this.map = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        L.marker([51.5, -0.09]).addTo(this.map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();

        setTimeout(function() {
            that.map.setView([53.505, -0.09], 13);
        }, 5000);
    }
}
