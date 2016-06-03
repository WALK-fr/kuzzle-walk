import {TravelMarker} from "../../../map/index";
import {Subject} from "rxjs/Rx";
import {Travel} from "../../../travel/models/travel.model";
import {KuzzleDocument} from "../model/kuzzle-document.model";
/**
 * Handle each kuzzle calls related to the chat component.
 */
export class MapService {
    private kuzzle:Kuzzle;
    private travelMarkerStream:Subject<TravelMarker> = new Subject<TravelMarker>();

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


    public getTravelMarkerStream():Subject<TravelMarker> {
        return this.travelMarkerStream;
    }

    public initTravelMarkersSubscriptionStream(travel:Travel) {
        var collectionName = 'markers';
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
                var travelMarker = new TravelMarker(document.content);
                travelMarker.id = document.id;
                travelMarker.status = KuzzleDocument.STATUS_FETCHED;
                this.travelMarkerStream.next(travelMarker); // Notify
            });
        });

        // Subscribe to variation of notes collection (Create / update / delete)
        this.kuzzle.dataCollectionFactory(collectionName).subscribe({}, {}, (error:any, result:any) => {
            // and then you notify the observer
            var travelMarker = new TravelMarker(result.result._source);
            travelMarker.status = result.action;
            travelMarker.id = result.result._id;

            this.travelMarkerStream.next(travelMarker);
        });
    }
}