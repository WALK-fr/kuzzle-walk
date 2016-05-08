import { TravelMarker, Poi, Location } from "../../../map/index";
/**
 * Handle each kuzzle calls related to the chat component.
 */
export class KuzzleMap {
    private kuzzle:Kuzzle;

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * Persist and dipatch a marker to each people that subscribed to the given travel.
     *
     * @returns {any}
     */
    public publishTravelMarker(travelMarker:TravelMarker) {
        return this.kuzzle.dataCollectionFactory('travel', 'markers').createDocument(travelMarker);
    }

    /**
     * Retrieve all marker that must be displayed on the map.
     *
     * @param travelID
     * @returns {Array<TravelMarker>}
     */
    public retrieveAllMarkersForTravel(travelID:number) {
        var markers:Array<TravelMarker> = [];
        // TODO : Kuzzle call further to replace the mock.

        markers.push(new TravelMarker("Un marqueur", "son contenu", new Poi("Un POI", 45, new Location(51.5, -0.09))));
        markers.push(new TravelMarker("Un autre marqueur POI", "son contenu", new Poi("Un POI", 20, new Location(45.0, 25.0))));
        markers.push(new TravelMarker("Un troisième marqueur location", "son contenu", new Poi("Un POI", 31, new Location(44.0, 25.0))));

        return markers;
    }
}