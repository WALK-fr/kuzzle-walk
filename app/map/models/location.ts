import {InterestInterface} from "../index";

/**
 * Represent a location on the map
 */
export class Location {
    private _address:string;
    private _latitude:number;
    private _longitude:number;


    constructor(latitude:number, longitude:number) {
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get address():string {
        return this._address;
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }

    set address(value:string) {
        this._address = value;
    }
}