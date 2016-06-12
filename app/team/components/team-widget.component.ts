import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { User } from "../../users/models/user";
import { KuzzleService } from "../../shared/kuzzle/services/kuzzle.service";
import { Travel } from "../../travel/models/travel.model";

// this is used to accept jquery token at compilation time
declare var $:any;
declare var Materialize:any;

/**
 * This components represent the chatroom of the travel.
 */
@Component({
    selector: 'team',
    templateUrl: "app/team/components/team-widget.component.html",
    styleUrls: ['app/team/components/team-widget.component.css']
    
})
export class TeamWidgetComponent implements OnInit {
    private travel: Travel;
    private user: User;

    isTeamOpened = false;
    shareMyOwnMap: boolean = false;

    @Input() isMapSharerActive = false; // Set this to true to enable map sharing events
    @Output('share-user-map') shareMyOwnMapEvent = new EventEmitter();
    @Output('see-other-user-map') seeOtherUserMapEvent = new EventEmitter();

    constructor(private kuzzleService: KuzzleService) {
        this.travel = new Travel();
    }

    toggleTeam(){
        this.isTeamOpened = !this.isTeamOpened;
    }


    ngOnInit() {
        // Initialize travel
        this.kuzzleService.travelStream.subscribe(travel => {
            this.travel = travel;
        });

        // Listen for change on current application user
        this.kuzzleService.userService.getCurrentApplicationUserStream().subscribe(user => {
            // Init current user
            this.user = user;
        });

        // Subscribe to incoming and leaving users notifications
        this.kuzzleService.userService.getTravelMembersStream().subscribe(user => {

            if(!this.user){
                console.warn('Suspicious behavior : No current user detected but this method is called !');
            }

            // Display notification Toast
            if (this.user.id !== user.id) {
                switch (user.status) {
                    case User.USER_CONNECTED:
                        Materialize.toast(user.humanName() + ' s\'est connecté !', 3000, 'team-toast');
                        break;
                    case User.USER_DISCONNECTED:
                        Materialize.toast(user.humanName() + ' s\'est deconnecté !', 3000, 'team-toast');
                        break;
                    case User.USER_ALREADY_HERE:
                        user.status = User.USER_CONNECTED;
                        break;
                }
            }

            // Update current users list
            this.kuzzleService.updateLocalCollection(this.travel.members, user);
        })
    }

    /**
     * Share current user map with other (publish mousemove on kuzzle)
     */
    shareMyMap(){
        this.shareMyOwnMap =! this.shareMyOwnMap;
        this.shareMyOwnMapEvent.emit({shareUserMap: this.shareMyOwnMap});
    }

    /**
     * See another user mouse move on map (suscribe to mousemove for that user on kuzzle)
     */
    seeOtherUserMap($event, user: User){
        this.seeOtherUserMapEvent.emit({user: user, allowSharing: $event.target.checked});
    }
}
