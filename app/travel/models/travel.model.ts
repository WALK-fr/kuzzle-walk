import { TravelMarker } from "../../map";
import { User } from "../../users";
import { KuzzleDocument } from "../../shared/kuzzle/model/kuzzle-document.model";

/**
 * This class represent the main object of a Travel.
 *
 * It includes chat messages, members of the travel, locations...
 */
export class Travel extends KuzzleDocument{
    /** The travel unique ID in kuzzle */
    id: string;
    name: string;
    members: User[];
    travelMarkerCollection: TravelMarker[];
    /**
     * Instantiate a new Travel.
     */
    constructor(obj?: any) {

        super();
        this.name = obj && obj.name;
        this.travelMarkerCollection = [] || [];
        this.members = obj && obj.members || [];
    }
}