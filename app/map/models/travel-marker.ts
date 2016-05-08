import {Poi} from "./poi";

/**
 * Represent an interest pinned to the map by a user.
 * It is also represented in the right panel menu (map and panel are linked).
 *
 * It can be one of Poi (if it's a value fetched from the Backoffice database and accessible to all application user) or
 * it can be a Location if it's a point on map that represent nothing but a location (per example a point in woods).
 */
export class TravelMarker {
    private _name:string;
    private _content:string;
    private _interest:Poi | Location;

    constructor(name:string, content:string, interest:Poi | Location) {
        this._name = name;
        this._content = content;
        this._interest = interest;
    }

    public isPoi():boolean {
        return this._interest instanceof Poi;
    }

    public isLocation():boolean {
        return this._interest instanceof Location;
    }
}