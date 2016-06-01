import {Observable} from "rxjs/Observable";
import * as Rx from "rxjs/Rx";

/**
 * Handle each kuzzle calls related to the notes component.
 */
export class NoteService {
    private kuzzle:Kuzzle;

    public constructor(kuzzle:Kuzzle) {
        this.kuzzle = kuzzle;
    }

    /**
     * Persist and dipatch a marker to each people that subscribed to the given travel.
     *
     * @returns {any}
     */
    public publishNote(travelNote) {
        return this.kuzzle.dataCollectionFactory('travel', 'markers').createDocument(travelNote);
    }

    /**
     * Retrieve all marker that must be displayed on the map.
     *
     * @param travelID
     * @returns {Observable<TravelMarker[]>}
     */
    public getAllNotesForTravel(travelID:string) {
        return Rx.Observable.create(function (observer) {
            var allNotes = [
                {"name":"Paris", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
                {"name":"Deauville", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
                {"name":"Bibi", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
                {"name":"DeBi", "items":[{"name":"note1", "done":false} , {"name":"note2", "done":false}, {"name":"note3", "done":false}]},
            ];
            observer.next(allNotes);
        });
        // TODO : Kuzzle call further to replace the mock.
    }

    public subsribeToTravelNotes() {
        var options = {};

        var travelNotes:any[] = [];

        //
        // create the observable to return
        return Observable.create((observer:any) => {
            // subscribe to kuzzle service in order to get the data
            this.kuzzle
                .dataCollectionFactory('travelNotes')
                .subscribe({}, options, (error:any, result:any) => {
                    // each time you get a message, you push it
                    var content = result.result._source._content;
                    //travelNotes.push(new TravelMarker('aa', content, new Poi('dqdqd',15, new Location(15,20))));

                    // and then you notify the observer
                    observer.next(travelNotes);
                });
        });
    }
}