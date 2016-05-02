import {TravelMarker} from "../../../map/map";
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
     * @param travelMarker
     * @returns {any}
     */
    public publishTravelMarker(travelMarker:TravelMarker) {
        return this.kuzzle.dataCollectionFactory('travel', 'markers').publishMessage(message);
    }
}