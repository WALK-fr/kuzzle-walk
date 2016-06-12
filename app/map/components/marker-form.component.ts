import {Component, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";

import {TravelMarker} from "../index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {Travel} from "../../travel/index";
import {User} from "../../users/index";

// this is used to accept jquery token at compilation time
declare var $: any;
declare var Materialize: any;

@Component({
    selector: 'marker-form',
    templateUrl: 'app/map/components/marker-form.component.html',
    styleUrls: ['app/map/components/marker-form.component.css']
})
export class MarkerFormComponent implements OnInit, AfterViewInit {

    markerForm: ControlGroup;
    travelMarker: TravelMarker;
    user: User;

    //output property to notify map to destroy a temporary marker
    @Output('marker-delete') markerDelete = new EventEmitter();

    constructor(private _fb:FormBuilder, private kuzzleService:KuzzleService) {
        this.createForm();
    }
    
    createForm(){
        this.markerForm = this._fb.group({
            name: ['', Validators.required],
            description: [''],
            address: [''],
            type: [''],
            duration: [''],
            price: ['']
        });
    }

    /**
     * Set the Marker Lat Lng on each click on the Map component !
     * @param $event
     */
    setMarkerPosition($event){
        this.travelMarker.latitude = $event.marker.latitude;
        this.travelMarker.longitude = $event.marker.longitude;
    }
    
    ngOnInit() {

        this.travelMarker = new TravelMarker();

        this.kuzzleService.travelStream.subscribe(travel => {
            this.travelMarker.travelId = travel.id;
        });

        this.kuzzleService.userService.getCurrentApplicationUserStream().subscribe(user => {
            this.user = user;
            this.travelMarker.userId = user.id;
        });
    }

    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit () {
        $(document).ready(function() {
            $('select').material_select();
            $('ul.tabs').tabs();
        });
    }

    /**
     * save the point of interest and notify the back-end
     */
    persistNewMarker(form) {
        this.travelMarker.name = form.name;
        this.travelMarker.description = form.description;
        this.travelMarker.address = form.address;
        this.travelMarker.duration = form.duration;
        this.travelMarker.price = form.price;

        //this is because we want to use the materializecss selector which is hacked by ul and li..
        this.travelMarker.type = $('#type-selector').val();

        //emit to delete the temporary marker on the map
        this.markerDelete.emit(this.travelMarker);
        
        if(this.travelMarker.latitude && this.travelMarker.longitude){
            this.kuzzleService.mapService.publishTravelMarker(this.travelMarker);

            //recreates the form --> waiting for angular to have a proper reset function
            this.createForm();
            $(document).ready(function() {
                Materialize.updateTextFields();
            });
        }
    }
}
