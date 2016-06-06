import {Component, AfterViewInit, OnInit} from "@angular/core";
import {TravelSelectorComponent} from "./travel-selector.component";
import {Router} from "@angular/router-deprecated";
import {MapComponent, PoiFormComponent, MarkerListComponent} from "../../map/index";
import {NavbarComponent} from "../../shared/index";
import {Travel} from "../index";
import {ChatComponent} from "../../chat/index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {NotesComponent} from "../../notes/index";
import {TeamWidgetComponent} from "../../team/components/team-widget.component";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: "travel",
    templateUrl: 'app/travel/components/travel.component.html',
    styleUrls: ['app/travel/components/travel.component.css'],
    directives: [
        MapComponent, PoiFormComponent, MarkerListComponent, NavbarComponent,
        TravelSelectorComponent, ChatComponent, NotesComponent, TeamWidgetComponent
    ]
})
export class TravelComponent implements OnInit, AfterViewInit {

    isChatOpened = false;
    travel:Travel;
    TABS = {TAB_MARKER_FORM: 'panel-form', TAB_MARKER_LIST: 'panel-marker-list', TAB_SCHEDULE: 'panel-scheduler'}

    constructor(private kuzzleService:KuzzleService, private _router:Router) {}

    ngOnInit() {
        // Connection
        let hasSessionCookie = this.kuzzleService.userService.connectAndSendConnectionNotificationAndSubscribeToUserStream();

        if(!hasSessionCookie){
            // Force reconnect
            this._router.navigate(['Home'])
            return;
        }

        // We fetch the travel and on response we init all streams
        this.kuzzleService.travelStream.filter((x) => x.id !== undefined).subscribe((x) => {
            this.travel = x;
            this.initApplication();
        });

        // Bootstrap application
        this.kuzzleService.initCurrentTravel()
    }

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

        //set the map to fit the window height
        $(document).ready(function(){
            var dynamicHeight = window.innerHeight - $('#tp-top-bar').height();
            $('#tp-content').height(dynamicHeight);
            $('#tp-right-panel').height(dynamicHeight);
            $(window).resize(function(){
                var dynamicHeight = window.innerHeight - $('#tp-top-bar').height();
                $('#tp-content').height(dynamicHeight);
                $('#tp-right-panel').height(dynamicHeight);
            })
        });
    }

    /**
     * set the focus on one of the right panel tabs
     */
    requestFormFocus(tabName){
        $('ul.tabs').tabs('select_tab', tabName);
    }

    /**
     * Open / Close the chat panel
     */
    toggleChat() {
        this.isChatOpened = !this.isChatOpened;
    }

    /**
     * Init all streams of the application
     */
    private initApplication() {
        this.kuzzleService.noteService.initNoteSubscriptionStream(this.travel);
        this.kuzzleService.mapService.initTravelMarkersSubscriptionStream(this.travel);
    }
}
