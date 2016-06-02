import {Component, AfterViewInit} from "angular2/core";
import {Router} from "angular2/router";
import {ControlGroup, FormBuilder, Validators} from "angular2/common";

import {BasicValidators} from "../../shared/validators/basic-validator";
import {Travel} from "../../travel/index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {FadeToggleDirective} from "../../shared/directives/fade-toggle.directive";


// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

@Component({
    selector: 'travel-form',
    templateUrl: 'app/home/components/travel-form.component.html',
    styleUrls: ['app/home/components/travel-form.component.css'],
    directives: [FadeToggleDirective]
})
export class TravelFormComponent implements AfterViewInit {

    signInOnly:boolean = false;
    travel: Travel;
    destinationForm: ControlGroup;
    loginForm: ControlGroup;
    subscribeForm: ControlGroup;
    inviteFriendsForm: ControlGroup;
    step: number = 1;
    userName: string = "Michel";

    constructor(formBuilder:FormBuilder, private _router:Router, private kuzzleService:KuzzleService) {
        this.destinationForm = formBuilder.group({
            destination: ['', Validators.required]
        });

        this.subscribeForm = formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', BasicValidators.email]
        });

        this.loginForm = formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.inviteFriendsForm = formBuilder.group({
            friends: [],
            message: []
        });
    }

    /**
     * triggered after the view initialization. this is used to apply
     * materialize js on the select
     */
    ngAfterViewInit() {
        $(document).ready(function () {
            // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
            $('.modal-trigger').leanModal();
        });
    }

    /**
     * triggered when the destination from is submitted
     */
    saveDestination(form:any) {

        if (!this.destinationForm.valid)
            return;
        // TODO: keep the destination for the next step
        //console.log("destination: " + form.destination);

        //var googleGeocodeProvider = new L.GeoSearch.Provider.OpenStreetMap();
        //console.log(googleGeocodeProvider);
        //googleGeocodeProvider.GetLocations(form.destination, (data:any) => {
        //    console.log(data);
        //});

        this.travel = new Travel(form.destination, 45.0, 1.5, 13, []);
        //this.kuzzleService.createTravel(this.travel);

        // navigate to the next step
        this.step++;
    }

    /**
     * triggered when the login form is submitted
     */
    login(form:any) {

        if (!this.loginForm.valid)
            return;

        // TODO : Async call, add marker on component to mark as loading
        this.kuzzleService.userService.login(form.username, form.password);

        // The callback must update steps or display error message
        // TODO : On success add user to travel and travel to user

        if(!this.signInOnly) {
            // navigate to the next step
            this.step++;
        }
        else{
            //login directly the user
        }
    }

    inviteFriends(form:any) {
        // TODO: Handle invite friends here
        console.log("friends: " + form.friends);
        console.log("message: " + form.message);

        this.travel.members.push();

        // TODO : Call webAPI to send mail (Kuzzle module per example)

        // Generate a kuzzle invitation, on validation add the user to the travel object

        // redirect to the travel
        this._router.navigate(['Travel']);
    }

    /**
     * force the login form display
     */
    displayForm(){
        this.step = 2;
        this.signInOnly = true;
    }
}
