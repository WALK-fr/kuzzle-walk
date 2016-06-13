
import LatLng = L.LatLng;
export class MapPosition {
    /** The travel unique ID in kuzzle */
    travelId: string;
    latlng: LatLng;
    userId: string;

    constructor(obj?:any) {
        this.travelId = obj && obj.travelId || null;
        this.latlng = obj && obj.latlng || null;
        this.userId = obj && obj.userId || null;
    }
}