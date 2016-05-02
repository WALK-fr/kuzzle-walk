/**
 * Represent a point on the map
 */
export class TravelMarker {
    private _latitude: number;
    private _longitude: number;


    constructor(latitude:number, longitude:number) {
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }
}