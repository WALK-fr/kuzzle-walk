import {Component, AfterViewInit} from "angular2/core";
import {Router} from "angular2/router";
import {ControlGroup, FormBuilder, Validators} from "angular2/common";
import {BasicValidators} from "../../shared/validators/basicValidators";
import {Travel} from "../../travel/index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {User} from "../../users/index";
import {Location} from "../../map/index";


// this is used to accept jquery token at compilation time
declare var $:any;

@Component({
    selector: 'travel-form',
    templateUrl: 'app/home/components/travel-form.component.html',
    styleUrls: ['app/home/components/travel-form.component.css']
})
export class TravelFormComponent implements AfterViewInit {

    travel:Travel;
    destinationForm:ControlGroup;
    loginForm:ControlGroup;
    subscribeForm:ControlGroup;
    inviteFriendsForm:ControlGroup;
    step:number = 1;
    submitButton:string = "Let's go !";
    userName:string = "Michel";

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

    changeStep() {
        this.step++;
        switch (this.step) {
            case 2:
                this.submitButton = "Login and start now !";
                this.kuzzleService.createTravel(new Travel('Un voyage', {location: new Location(15, 20), zoom: 3}, [new User()]));
                break;
            case 3:
                this.submitButton = "Let's organize !";
                console.log(this.subscribeForm.value);
                break;
            default:
                this._router.navigate(['Travel']);
                break;
        }
    }
}
