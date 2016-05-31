import {TravelMarker, Poi, Location} from "../../../map/index";
import {Observable} from "rxjs/Observable";
import * as Rx from "rxjs/Rx";
import {Subject} from "rxjs/Rx";
import {Travel} from "../../../travel/models/travel.model";
/**
 * Handle each kuzzle calls related to the chat component.
 */
export class MapService {
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
     * @returns {Observable<TravelMarker[]>}
     */
    public getAllMarkersForTravel(travelID:string) {
        return Rx.Observable.create(function (observer) {
            var travelMarkers = [
                new TravelMarker("Un marqueur", "son contenu", new Poi("Un POI", 45, new Location(51.5, -0.09))),
                new TravelMarker("Un autre marqueur POI", "son contenu", new Poi("Un POI", 20, new Location(45.0, 25.0))),
                new TravelMarker("Un troisième marqueur location", "son contenu", new Poi("Un POI", 31, new Location(44.0, 25.0)))
            ];
            observer.next(travelMarkers);
        });
        // TODO : Kuzzle call further to replace the mock.

    }

    public subsribeToTravelMarkers() {
        var options = {};

        var travelMarkers:TravelMarker[] = [];

        //
        // create the observable to return
        return Observable.create((observer:any) => {
            // subscribe to kuzzle service in order to get the data
            this.kuzzle
                .dataCollectionFactory('travelMarkers')
                .subscribe({}, options, (error:any, result:any) => {
                    // each time you get a message, you push it
                    var content = result.result._source._content;
                    travelMarkers.push(new TravelMarker('aa', content, new Poi('dqdqd',15, new Location(15,20))));

                    // and then you notify the observer
                    observer.next(travelMarkers);
                });
        });
    }

    /**
     * Get the current listener for Travel Object
     *
     * @returns {Subject<Travel>}
     */
    getTravel() {
        var travelListener:Subject<Travel> = new Subject<Travel>(null);
        // TODO : Change this value
        var room = this.kuzzle.dataCollectionFactory('travel').fetchDocument('AVS5a8AIeivQYXVQtlJN', (err, result) => {
            // TODO : Handle errors
            var travel:Travel = result.content;

            // and then you notify the observer
            travelListener.next(travel);
        });

        if (travelListener.isUnsubscribed) {
            console.log('OK cest fait');
            room.unsubscribe()
        }

        return travelListener;
    }
}