import { Component, OnInit } from "@angular/core";
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
    isTeamOpened = false;
    connectedUserCollection: User[] = [];
    private user: User;

    constructor(private kuzzleService: KuzzleService) {
    }

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
}
