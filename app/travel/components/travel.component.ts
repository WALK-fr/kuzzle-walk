import {Component, AfterViewInit, OnInit} from "@angular/core";
import {TravelSelectorComponent} from "./travel-selector.component";
import {Router} from "@angular/router-deprecated";
import {MapComponent, MarkerFormComponent, MarkerListComponent} from "../../map/index";
import {NavbarComponent} from "../../shared/index";
import {Travel} from "../index";
import {ChatComponent} from "../../chat/index";
import {KuzzleService} from "../../shared/kuzzle/index";
import {NotesComponent} from "../../notes/index";
import {TeamWidgetComponent} from "../../team/components/team-widget.component";
import LatLng = L.LatLng;
import { TravelMarker } from "../../map/models/travel-marker.model";
import {MarkerDetailComponent} from "../../map/components/marker-detail.component";
import {MarkerComponent} from "../../map/components/marker.component";

// this is used to accept jquery token at compilation time
declare var $: any;

@Component({
    selector: "travel",
    templateUrl: 'app/travel/components/travel.component.html',
    styleUrls: ['app/travel/components/travel.component.css'],
    directives: [
        MapComponent, MarkerFormComponent, MarkerListComponent, NavbarComponent,
        TravelSelectorComponent, ChatComponent, NotesComponent, TeamWidgetComponent,
        MarkerDetailComponent, MarkerComponent
    ]
})
export class TravelComponent implements OnInit, AfterViewInit {

    isChatOpened = false;
    isMapDisplayed = true;
    testmarker = true;
    //when clicking on a marker of the list, it triggers the display of it's informations
    markerToDisplay;
    chatUnreadMessages = 0;
    travel: Travel;
    TABS = {TAB_MARKER_FORM: 'panel-form', TAB_MARKER_LIST: 'panel-marker-list', TAB_SCHEDULE: 'panel-scheduler'};


    constructor(private kuzzleService: KuzzleService, private _router: Router) {
        this.travel = new Travel();
    }

    ngOnInit() {
        // Connection
        let hasSessionCookie = this.kuzzleService.userService.connectAndSendConnectionNotificationAndSubscribeToUserStream();

        if (!hasSessionCookie) {
            // Force reconnect
            this._router.navigate(['Home']);
            return;
        }

        // We fetch the travel and on response we init all streams
        this.kuzzleService.travelStream.subscribe((x) => {
            this.travel = x;
            this.initApplication();
        });

        // Bootstrap application
        this.kuzzleService.initializeTravel('AVS5a8AIeivQYXVQtlJN')
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

        this.adjustMapAndPanelHeight();
    }

    adjustMapAndPanelHeight(){
        console.log(window.innerWidth);
        if(window.innerWidth > 600) {
            //set the map to fit the window height
            $(document).ready(function () {
                var dynamicHeight = window.innerHeight - $('#tp-top-bar').height();
                $('#tp-content').height(dynamicHeight);
                $('#tp-right-panel').height(dynamicHeight);
                $(window).resize(function () {
                    var dynamicHeight = window.innerHeight - $('#tp-top-bar').height();
                    $('#tp-content').height(dynamicHeight);
                    $('#tp-right-panel').height(dynamicHeight);
                })
            });
        }
    }

    /**
     * Triggers the isMarkerviewModeActive, hide the panel and display marker information
     * @param marker
     */
    displayMarkerInformation(marker:TravelMarker){
        this.markerToDisplay = marker;
    }

    /**
     * Remove the information of a marker and display the default panel view
     */
    backToDefaultPanel(){
        this.markerToDisplay = null;
    }

    /**
     * TODO - Share the cursor latlng on mousemove with team mates
     * an event is received from the map with the current latlng hovered by the mouse, need to share it with kuzzle
     * @param latlng
     */
    sharePositionWithTeam(latlng:LatLng){

    }

    /**
     * set the focus on one of the right panel tabs
     */
    requestFormFocus(tabName) {
        $('ul.tabs').tabs('select_tab', tabName);
    }

    /**
     * Open / Close the chat panel
     */
    toggleChat() {
        this.isChatOpened = !this.isChatOpened;
        if (this.isChatOpened) {
            this.chatUnreadMessages = 0;
        }
    }

    /**
     * Open / Close the map on mobile devices
     */
    toggleMap(){
        this.isMapDisplayed = !this.isMapDisplayed;
    }

    incrementChatUnreadMessages(){
        this.chatUnreadMessages++;
    }

    /**
     * Init all streams of the application
     */
    private initApplication() {
        this.kuzzleService.noteService.initNoteSubscriptionStream(this.travel);
        this.kuzzleService.mapService.initTravelMarkersSubscriptionStream(this.travel);
    }
}
