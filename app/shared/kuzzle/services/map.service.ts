import {TravelMarker} from "../../../map/index";
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
        return this.kuzzle.dataCollectionFactory('markers').createDocument(travelMarker);
    }

    /**
     * Retrieve all marker that must be displayed on the map.
     *
     * @param travelID
     * @returns {Observable<TravelMarker[]>}
     */
    public getAllMarkersForTravel(travelID:string) {
        return Rx.Observable.create((observer) => {

            var filter = {
                query: {
                    match: {
                        travelId: "AVS5a8AIeivQYXVQtlJN"
                    }
                }
            };

            this.kuzzle
                .dataCollectionFactory('markers')
                .advancedSearch(filter, {}, (err, res) => {

                    var markersList = [];
                    res.documents.forEach(document => {
                        markersList.push(new TravelMarker(document.content))
                    });

                    observer.next(markersList);
                });

        });
        // TODO : Kuzzle call further to replace the mock.

    }

    public subsribeToTravelMarkers(): Subject<TravelMarker> {
        var options = {};


        var markersListener:Subject<TravelMarker> = new Subject<TravelMarker>(null);
        // TODO : Change this value
        var room = this.kuzzle.dataCollectionFactory('markers').subscribe({}, options, (error:any, result:any) => {

            // and then you notify the observer
            markersListener.next(new TravelMarker(result.result._source._content));
        });

        if (markersListener.isUnsubscribed) {
            console.log('OK cest fait');
            room.unsubscribe()
        }

        return markersListener;
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