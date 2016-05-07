import {Location, TravelMarker} from "../../map";
import {User} from "../../users";
import {ChatMessage} from "../../chat";

/**
 * This class represent the main object of a Travel.
 *
 * It includes chat messages, members of the travel, locations...
 */
export class Travel {
    private _name:string;
    private _defaultLocation:Location;
    private _defaultZoom:number;
    private _members:User[];
    private _travelMarkers:TravelMarker[];
    private _chatMessages:ChatMessage[];

    /**
     * Instantiate a new Travel.
     *
     * @param name
     * @param defaultLocation The location where the map will pin to and the zoom related to it.
     * @param members people
     */
    constructor(name:string, defaultLocation:{location:Location, zoom:number}, members:User[]) {
        this._name = name;
        this._defaultLocation = defaultLocation.location;
        this._defaultZoom = defaultLocation.zoom;
        this._members = members;
    }

    /**
     * The travel name.
     * 
     * @returns {string}
     */
    get name():string {
        return this._name;
    }
}