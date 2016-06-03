import {Note} from "../../../notes/models/note.model";
import {Subject} from "rxjs/Subject";
import {Travel} from "../../../travel/models/travel.model";
import {KuzzleDocument} from "../model/kuzzle-document.model";

/**
 * Handle each kuzzle calls related to the notes component.
 */
export class NoteService {
    private kuzzle:Kuzzle;
    private noteStream:Subject<Note> = new Subject<Note>();

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

    public getNoteStream():Subject<Note> {
        return this.noteStream;
    }

    public initNoteSubscriptionStream(travel:Travel) {
        var collectionName = 'notes';
        var filter = {
            query: {
                match: {
                    travelId: travel.id
                }
            }
        };

        // Get all notes from database
        this.kuzzle.dataCollectionFactory(collectionName).advancedSearch(filter, {}, (err, res) => {
            // When we get results, we notify the stream of fetched documents
            res.documents.forEach(document => {
                var note = new Note(document.content);
                note.id = document.id;
                note.status = KuzzleDocument.STATUS_FETCHED;
                this.noteStream.next(note); // Notify
            });
        });


        // Subscribe to variation of notes collection (Create / update / delete)
        this.kuzzle.dataCollectionFactory(collectionName).subscribe({}, {}, (error:any, result:any) => {
            // and then you notify the observer
            var note = new Note(result.result._source);
            note.status = result.action;
            note.id = result.result._id;

            this.noteStream.next(note);
        });
    }
}