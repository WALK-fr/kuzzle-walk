/**
 * Represent a point on the map
 */
export class TravelMarker {
    private _latitude: number;
    private _longitude: number;
    private _content: string;


    constructor(content: string,latitude:number, longitude:number) {
        this._content = content;
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get content():string {
        return this._content;
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }
}