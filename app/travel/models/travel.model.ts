import {TravelMarker} from "../../map";
import {User} from "../../users";
import {ChatMessage} from "../../chat";

/**
 * This class represent the main object of a Travel.
 *
 * It includes chat messages, members of the travel, locations...
 */
export class Travel {
    /** The travel unique ID in kuzzle */
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    defaultZoom: number;
    members: User[];
    travelMarkers: TravelMarker[];
    chatMessages: ChatMessage[];

    /**
     * Instantiate a new Travel.
     *
     * @param name
     * @param latitude
     * @param longitude
     * @param zoom
     * @param members
     */
    constructor(name:string, latitude: number, longitude: number, zoom: number, members:User[]) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.defaultZoom = zoom;
        this.members = members;
    }
}