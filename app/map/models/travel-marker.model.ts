import {KuzzleDocument} from "../../shared/kuzzle/model/kuzzle-document.model";

export class TravelMarker extends KuzzleDocument{
    name: string;
    content: string;
    travelId: string;
    userId: string;
    latitude: number;
    longitude: number;
    type: string;
    address: string;
    duration: number;
    price: number;

    constructor(obj?: any) {
        super();
        this.name = obj && obj.name || null;
        this.content = obj && obj.content || null;
        this.latitude = obj && obj.latitude || null;
        this.longitude = obj && obj.longitude || null;
        this.travelId = obj && obj.travelId || null;
        this.userId = obj && obj.userId || null;
        this.userId = obj && obj.userId || null;
        this.address = obj && obj.address || null;
        this.type = obj && obj.type || null;
        this.duration = obj && obj.duration || null;
        this.price = obj && obj.price || null;
    }
}
