import {Component, Output, EventEmitter} from "@angular/core";
import {ControlGroup, FormBuilder} from "@angular/common";

@Component({
    selector: 'invite-friends-form',
    templateUrl: 'app/home/components/invite-friends-form.component.html'
})
export class InviteFriendsFormComponent {

    inviteFriendsForm: ControlGroup;
    @Output('invite-friends') inviteFriendsEvent = new EventEmitter;
    
    constructor(fb: FormBuilder) {
        this.inviteFriendsForm = fb.group({
            friends: [],
            message: []
        });
    }

    /**
     * Handle the friends invitation on the form submission
     * @param form
     */
    inviteFriends(form) {
        // TODO: Handle invite friends here
        console.log("friends: " + form.friends);
        console.log("message: " + form.message);

        this.inviteFriendsEvent.emit({});
    }
}