export class TravelMarker {
    name: string;
    content: string;
    travelId: string;
    latitude: number;
    longitude: number;
    type: string;
    address: string;
    duration: number;
    price: number;

    constructor(obj?: any) {
        this.name = obj && obj.name || null;
        this.content = obj && obj.content || null;
        this.latitude = obj && obj.latitude || null;
        this.longitude = obj && obj.longitude || null;
        this.travelId = obj && obj.travelId || null;
        this.address = obj && obj.address || null;
        this.type = obj && obj.type || null;
        this.duration = obj && obj.duration || null;
        this.price = obj && obj.price || null;
    }
}
