import {Observable} from "rxjs/Observable";
import * as Rx from "rxjs/Rx";
import {Note} from "../../../notes/models/note.model";
import {Subject} from "rxjs/Subject";

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
        if(travelNote.id){
            return this.kuzzle.dataCollectionFactory('notes').updateDocument(travelNote.id, travelNote);
        }
        else return this.kuzzle.dataCollectionFactory('notes').createDocument(travelNote);
    }

    /**
     * Retrieve all marker that must be displayed on the map.
     *
     * @param travelID
     * @returns {Observable<TravelMarker[]>}
     */
    public getAllNotesForTravel(travelID:string) {
        return Rx.Observable.create((observer) => {

            var filter = {
                query: {
                    match: {
                        travelId: "AVS5a8AIeivQYXVQtlJN"
                    }
                }
            };
            this.kuzzle
                .dataCollectionFactory('notes')
                .advancedSearch(filter, {}, (err, res) => {
                    var notesList = [];
                    res.documents.forEach(document => {
                        notesList.push(new Note(document))
                    });
                    observer.next(notesList);
                });
        });
    }

    public subsribeToNotes(): Subject<Note> {
        var options = {};

        var notesListener:Subject<Note> = new Subject<Note>(null);
        // TODO : Change this value
        var room = this.kuzzle.dataCollectionFactory('notes').subscribe({}, options, (error:any, result:any) => {

            // and then you notify the observer
            console.log(result);
            notesListener.next(new Note(result.result._source));
        });

        if (notesListener.isUnsubscribed) {
            console.log('OK cest fait');
            room.unsubscribe()
        }

        return notesListener;
    }
}