import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { User } from "../../users/models/user";
import { KuzzleService } from "../../shared/kuzzle/services/kuzzle.service";

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
    private user: User;

    isTeamOpened = false;
    shareMyOwnMap: boolean = false;
    connectedUserCollection: User[] = [];

    @Input() isMapSharerActive = false; //set this to true to enable map sharing events
    @Output('share-user-map') shareMyOwnMapEvent = new EventEmitter();
    @Output('see-other-user-map') seeOtherUserMapEvent = new EventEmitter();
    
    constructor(private kuzzleService: KuzzleService) {}

    toggleTeam(){
        this.isTeamOpened = !this.isTeamOpened;
    }


    ngOnInit() {
        this.kuzzleService.userService.getCurrentUserStream().subscribe(user => {
            // Init current user
            this.user = user;

            // Subscribe to incomming and present users notification
            this.kuzzleService.userService.getLoggedUsersStream().subscribe(user => {
                // Display notification Toast
                if (this.user.id !== user.id) {
                    switch (user.status) {
                        case User.USER_JOINED:
                            Materialize.toast(user.humanName() + ' s\'est connecté !', 3000, 'team-toast');
                            break;
                        case User.USER_LEFT:
                            Materialize.toast(user.humanName() + ' s\'est deconnecté !', 3000, 'team-toast');
                            break;
                        case User.USER_ALREADY_HERE:
                            user.status = User.USER_JOINED;
                            break;
                    }
                }
                // Update current users list
                this.kuzzleService.updateLocalCollection(this.connectedUserCollection, user);
            })
        });
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
