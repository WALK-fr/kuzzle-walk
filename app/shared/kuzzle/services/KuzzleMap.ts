import {Location} from "../../../map/index";
/**
 * Handle each kuzzle calls related to the chat component.
 */
export class KuzzleMap {
    private kuzzle:any;

    public constructor(kuzzle:any) {
        this.kuzzle = kuzzle;
    }

    /**
     * Dispatch a marker to each people that subscribed to the given travel
     * @returns {any}
     */
    public publishTravelMarker(travelMarker:Location) {
        return this.kuzzle.dataCollectionFactory('travel', 'markers').createDocument(travelMarker);
    }

    /**
     * Retrieve all marker that must be displayed on the map.
     *
     * @param travelID
     * @returns {Array<TravelMarker>}
     */
    public retrieveAllMarkersForTravel(travelID:number) {
        var markers:Array<Location> = [];
        // TODO : Kuzzle call further to replace the mock.

        markers.push(new Location(51.5, -0.09));
        markers.push(new Location(51, -0.10));
        markers.push(new Location(50.5, -0.09));
        markers.push(new Location(51.3, -0.09));

        return markers;
    }
}