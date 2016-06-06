import {Component, AfterViewInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";

import {DestinationFormComponent} from "./destination-form.component";
import {LoginFormComponent} from "./login-form.component";
import {InviteFriendsFormComponent} from "./invite-friends-form.component";
import {Travel} from "../../travel/index";
import {FadeToggleDirective} from "../../shared/directives/fade-toggle.directive";


// this is used to accept jquery token at compilation time
declare var $:any;
declare var L:any;

@Component({
    selector: 'travel-form',
    templateUrl: 'app/home/components/travel-form.component.html',
    styleUrls: ['app/home/components/travel-form.component.css'],
    directives: [FadeToggleDirective, DestinationFormComponent, LoginFormComponent, InviteFriendsFormComponent]
})
export class TravelFormComponent implements AfterViewInit {

    signInOnly:boolean = false;
    travel: Travel;
    step: number = 1;

    constructor(private _router:Router) {}

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
     * create the travel when the destination form is submitted
     * @param destination
     */
    onDestination(destination) {
        this.travel = new Travel(destination);
        this.step++;
    }

    /**
     * triggered when the login form is submitted
     * @param result
     */
    onLogin(result) {
        this.step++;
    }

    /**
     * triggered when the invite friends form is submitted
     * @param result
     */
    onInviteFriends(result) {
        console.log("friends");

        // redirect to the travel
        this._router.navigate(['Travel']);
    }
}
