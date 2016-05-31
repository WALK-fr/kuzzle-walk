import {InterestInterface, Location} from "../index";

/**
 * Represent an imported POI from Kuzzle
 *
 * A POI (Point of Interest) is a point fetched from the backend that represent something associated to a location.
 * Per example : The Eiffel tower in Paris is a POI located at the Location 48.8583701, 2.2944813.
 */
export class Poi implements InterestInterface{
    name:string;
    price:number;
    location:Location;

    constructor(name:string, price:number, location:Location) {
        this.name = name;
        this.price = price;
        this.location = location;
    }

    public getLatitude(): number {
        return this.location.latitude;
    }

    public getLongitude(): number {
        return this.location.longitude;
    }
}
