import {Component, Input, OnInit} from "angular2/core";

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
export class TeamWidgetComponent{
    isTeamOpened = false;
    team = ['user1','user1','user1','user1','user1' ];

    toggleTeam(){
        this.isTeamOpened = !this.isTeamOpened;
    }
}
