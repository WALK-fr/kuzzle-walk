import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../users/models/user";
import { KuzzleService } from "../../shared/kuzzle/services/kuzzle.service";

// this is used to accept jquery token at compilation time
declare var $:any;

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

    constructor(private kuzzleService: KuzzleService) {
    }

    toggleTeam(){
        this.isTeamOpened = !this.isTeamOpened;
    }


    ngOnInit() {
        this.kuzzleService.userService.getLoggedUsersStream().subscribe(document => {
            this.kuzzleService.updateLocalCollection(this.connectedUserCollection, document);
        })
    }
}
