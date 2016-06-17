import { Component, AfterViewInit, OnInit } from "@angular/core";
import { TravelSelectorComponent } from "./travel-selector.component";
import { Router } from "@angular/router-deprecated";
import { MapComponent, MarkerFormComponent, MarkerListComponent } from "../../map/index";
import { NavbarComponent } from "../../shared/index";
import { Travel } from "../index";
import { ChatComponent } from "../../chat/index";
import { KuzzleService } from "../../shared/kuzzle/index";
import { NotesComponent } from "../../notes/index";
import { TeamWidgetComponent } from "../../team/components/team-widget.component";
import { TravelMarker } from "../../map/models/travel-marker.model";
import { MarkerDetailComponent } from "../../map/components/marker-detail.component";
import { MarkerComponent } from "../../map/components/marker.component";
import { User } from "../../users/models/user";
import LatLng = L.LatLng;
import { MapPosition } from "../../notes/models/map-position.model";

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

    //map sharing vars
    isMapSharingActive = false;
    userMapSharing = [];
    currentUser;

    //when clicking on a marker of the list, it triggers the display of it's information
    markerToDisplay: TravelMarker;
    chatUnreadMessages = 0;
    travel: Travel;
    TABS = {TAB_MARKER_FORM: 'panel-form', TAB_MARKER_LIST: 'panel-marker-list', TAB_SCHEDULE: 'panel-scheduler'};


    constructor(private kuzzleService: KuzzleService, private _router: Router) {
        this.travel = new Travel();
    }

    ngOnInit() {
        // Connect the user to kuzzle and then bootstrap
        this.kuzzleService.userService.connectUserOnKuzzleBackend()
            .then((user) => {
                this.currentUser = user;
                // Bootstrap application
                this.bootstrapApplication(user.travels[0], user); // TODO : Add possibility to choose travel
            })
            .catch((error) => {
                // Otherwise send error and direct to home login form
                console.error(error.message);
                this._router.navigate(['Home']);
                return;
            });

        // Initialize travel
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
            this.travel.members.forEach( (member:User) => {
                this.userMapSharing.push({member: member, isSharingActive: false});
            });
        });
    }

    /**
     * Initialize the application for a given user and TravelID selected.
     *
     * @param travelID
     * @param user
     */
    private bootstrapApplication(travelID: string, user: User) {
        // Initialize travel for given ID
        this.kuzzleService.initializeTravel(travelID)
            .then((travel: Travel) => {
                this.initApplicationKuzzleListeners(travel); // Initialize the application streams and listeners
                this.kuzzleService.userService.getCurrentApplicationUserStream().next(user); // Notify all component of the current application user
                this.kuzzleService.updateLocalCollection(travel.members, user); // Mark user as connected in current travel members list
                this.kuzzleService.travelStream.next(travel); // And then dispatch travel to each component
            })
            .catch((error: Error) => {
                console.error(error.message)
            })
    }

    /**
     * Triggered after the view initialization. This is used to apply materialize js on the select.
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

    public adjustMapAndPanelHeight(){
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
     * Init all kuzzle stream subscribers of the application. Those will dispatch incoming documents and data to
     * internal stream listeners that subscribe on them.
     */
    private initApplicationKuzzleListeners(travel: Travel) {
        this.kuzzleService.noteService.initNoteSubscriptionStream(travel);
        this.kuzzleService.mapService.initTravelMarkersSubscriptionStream(travel);
        this.kuzzleService.userService.subscribeToConnectUserVariation();
        this.kuzzleService.mapService.initMapPositionSubscriptionStream(this.userMapSharing, travel);
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
     * toggle enable / disable kuzzle publish current user map position
     * @param shareUserMap
     */
    shareMyMap(shareUserMap:any){
        //console.log("User wants to share his map", shareUserMap);
        this.isMapSharingActive = shareUserMap.shareUserMap;
    }

    /**
     * enable subscribing to another user map move events
     */
    seeOtherUserMap(userSharingInfo){
        //update members for the kuzzle filter
        this.userMapSharing.find( mapSharing =>  mapSharing.member.id === userSharingInfo.user.id).isSharingActive = userSharingInfo.allowSharing;
        // TODO - unsubscribe to current map sharing stream
        this.kuzzleService.mapService.mapPositionKuzzleRoom.unsubscribe();
        //TODO subscribe with the updated filter
        let usersToSubscribe = this.userMapSharing.filter( sharing => sharing.isSharingActive === true ).map( sharing => sharing.member );
        this.kuzzleService.mapService.initMapPositionSubscriptionStream(usersToSubscribe, this.travel);
    }
    
    /**
     * TODO - Share the cursor latlng on mousemove with team mates
     * an event is received from the map with the current latlng hovered by the mouse, need to share it with kuzzle
     * @param latlng
     */
    sharePositionWithTeam(position:LatLng){
        // console.log(this.isMapSharingActive);
        //console.log("current mouse position: ", position);
        if(this.isMapSharingActive){
            this.kuzzleService.mapService.publishMapPosition(new MapPosition(
                {
                    travelId: this.travel.id,
                    latlng: position,
                    userId: this.currentUser.id
                }
            ));
        }
    }

    /**
     * set the focus on one of the right panel tabs
     */
    requestFormFocus(tabName) {
        $('ul.tabs').tabs('select_tab', tabName);
    }

    /**
     * This method is called inside the template to open / close the chat component.
     */
    toggleChat() {
        this.isChatOpened = !this.isChatOpened;
        if (this.isChatOpened) {
            this.chatUnreadMessages = 0;
        }
    }

    /**
     * This method is called inside the template to increment unread chat upon receiving a new message without having
     * the chat message pop-in opened.
     */
    incrementChatUnreadMessages(){
        this.chatUnreadMessages++;
    }

    /**
     * Open / Close the map on mobile devices
     */
    toggleMap(){
        this.isMapDisplayed = !this.isMapDisplayed;
    }
}
