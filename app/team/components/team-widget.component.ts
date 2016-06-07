import { Component, OnInit } from "@angular/core";
import { User } from "../../users/models/user";
import { KuzzleService } from "../../shared/kuzzle/services/kuzzle.service";
import { KuzzleDocument } from "../../shared/kuzzle/model/kuzzle-document.model";

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

    constructor(private kuzzleService: KuzzleService) {
    }

    toggleTeam(){
        this.isTeamOpened = !this.isTeamOpened;
    }


    ngOnInit() {
        this.kuzzleService.userService.getLoggedUsersStream().subscribe(user => {

            // Notify for joining / leaving users
            let documentIDCollection = this.connectedUserCollection.map((x) => {
                return x.id
            });
            switch (user.status) {
                case KuzzleDocument.STATUS_USER_JOINED:
                    var documentAlreadyInCollection = documentIDCollection.indexOf(user.id) >= 0;

                    if (documentAlreadyInCollection) {
                        return;
                    }
                    Materialize.toast(user.humanName() + ' s\'est connecté !', 3000); // 4000 is the duration of the toast
                    break;
                case KuzzleDocument.STATUS_USER_LEFT:
                    Materialize.toast(user.humanName() + ' s\'est deconnecté !', 3000); // 4000 is the duration of the toast
                    break;
            }

            this.kuzzleService.updateLocalCollection(this.connectedUserCollection, user);

        })
    }
}
