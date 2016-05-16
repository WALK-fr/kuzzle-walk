import {Location, TravelMarker} from "../../map";
import {User} from "../../users";
import {ChatMessage} from "../../chat";

/**
 * This class represent the main object of a Travel.
 *
 * It includes chat messages, members of the travel, locations...
 */
export class Travel {
    /** The travel unique ID in kuzzle */
    id:string;
    name:string;
    defaultLocation:Location;
    defaultZoom:number;
    members:User[];
    travelMarkers:TravelMarker[];
    chatMessages:ChatMessage[];

    /**
     * Instantiate a new Travel.
     *
     * @param name
     * @param defaultLocation The location where the map will pin to and the zoom related to it.
     * @param members people
     */
    constructor(name:string, defaultLocation:{location:Location, zoom:number}, members:User[]) {
        this.name = name;
        this.defaultLocation = defaultLocation.location;
        this.defaultZoom = defaultLocation.zoom;
        this.members = members;
    }
}