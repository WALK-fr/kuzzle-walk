import * as Rx from "rxjs/Rx";
import {Note} from "../../../notes/models/note.model";
import {Subject} from "rxjs/Subject";
import {KuzzleDocument} from "../model/kuzzle-document.model";

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

    public deleteNote(travelNote){
        return this.kuzzle.dataCollectionFactory('notes').deleteDocument(travelNote.id);
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
                        var note = new Note(document.content);
                        note.id = document.id;
                        notesList.push(note);
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
            var note = new Note(result.result._source);
            note.status = result.action;
            note.id = result.result._id;

            notesListener.next(note);
        });

        if (notesListener.isUnsubscribed) {
            console.log('OK cest fait');
            room.unsubscribe()
        }

        return notesListener;
    }
}