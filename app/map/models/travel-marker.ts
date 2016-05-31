import {Poi} from "./poi";
import {Location} from "./location";
import {InterestInterface} from "./interest.interface";

/**
 * Represent an interest pinned to the map by a user.
 * It is also represented in the right panel menu (map and panel are linked).
 *
 * It can be one of Poi (if it's a value fetched from the Backoffice database and accessible to all application user) or
 * it can be a Location if it's a point on map that represent nothing but a location (per example a point in woods).
 */
export class TravelMarker {
    name:string;
    content:string;
    interest:InterestInterface;

    constructor(name:string, content:string, interest:InterestInterface) {
        this.name = name;
        this.content = content;
        this.interest = interest;
    }

    public isPoi():boolean {
        return this.interest instanceof Poi;
    }

    public isLocation():boolean {
        return this.interest instanceof Location;
    }

    public getLatitude(){
        return this.interest.getLatitude();
    }

    public getLongitude(){
        return this.interest.getLongitude();
    }
}
