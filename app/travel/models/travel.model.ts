import {TravelMarker} from "../../map";
import {User} from "../../users";
import {ChatMessage} from "../../chat";
import {KuzzleDocument} from "../../shared/kuzzle/model/kuzzle-document.model";
import {Note} from "../../notes/models/note.model";

/**
 * This class represent the main object of a Travel.
 *
 * It includes chat messages, members of the travel, locations...
 */
export class Travel extends KuzzleDocument{
    /** The travel unique ID in kuzzle */
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    defaultZoom: number;
    members: User[];
    travelMarkerCollection: TravelMarker[]; // TODO : a faire
    noteCollection: Note[];
    /**
     * Instantiate a new Travel.
     */
    constructor(obj?: any) {

        super();
        this.name = obj && obj.name;
        this.latitude = obj && obj.latitude;
        this.longitude = obj && obj.longitude;
        this.defaultZoom = obj && obj.defaultZoom;
        this.members = obj && obj.members;
    }
}