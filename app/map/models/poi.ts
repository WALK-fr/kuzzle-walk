import {InterestInterface, Location} from "../index";

/**
 * Represent an imported POI from Kuzzle
 *
 * A POI (Point of Interest) is a point fetched from the backend that represent something associated to a location.
 * Per example : The Eiffel tower in Paris is a POI located at the Location 48.8583701, 2.2944813.
 */
export class Poi {
    private _name:string;
    private _price:number;
    private _location:Location;

    constructor(name:string, price:number, location:Location) {
        this._name = name;
        this._price = price;
        this._location = location;
    }

    get name():string {
        return this._name;
    }

    get price():number {
        return this._price;
    }

    getLatitude() {
        return this._location.latitude;
    }

    getLongitude() {
        return this._location.longitude;
    }
}
