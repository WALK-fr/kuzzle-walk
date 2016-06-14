import {TravelMarker} from "../../../map/index";
import {Subject} from "rxjs/Rx";
import {Travel} from "../../../travel/models/travel.model";
import {KuzzleDocument} from "../model/kuzzle-document.model";
import LatLng = L.LatLng;
import { MapPosition } from "../../../notes/models/map-position.model";
import { User } from "../../../users/models/user";
/**
 * Handle each kuzzle calls related to the chat component.
 */
export class MapService {
    private kuzzle:Kuzzle;
    private travelMarkerStream:Subject<TravelMarker> = new Subject<TravelMarker>();

    //map sharing
    private travelMapPositionStream:Subject<MapPosition> = new Subject<MapPosition>();
    mapPositionKuzzleRoom;

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
     * Delete a marker in Kuzzle by it's Kuzzledocument ID
     * @param travelMarker
     * @returns {any}
     */
    public deleteTravelMarker(travelMarker: TravelMarker) {
        return this.kuzzle.dataCollectionFactory('markers').deleteDocument(travelMarker.id);
    }


    public getTravelMarkerStream():Subject<TravelMarker> {
        return this.travelMarkerStream;
    }

    public initTravelMarkersSubscriptionStream(travel:Travel) {
        var collectionName = 'markers';
        var filter = {
            size: 200,
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

    /**
     * Dispatch the current user mouse lat and long from the map to the subscribers.
     * @param message The message to send
     *
     * @returns {any}
     */
    public publishMapPosition(mapPosition: MapPosition) {
        if (mapPosition.travelId === undefined || mapPosition.travelId === null) {
            //console.log('Please provide travelId for message');
            return
        }
        return this.kuzzle.dataCollectionFactory('mapSharing').publishMessage(mapPosition);
    }

    public getMapPositionStream():Subject<MapPosition> {
        return this.travelMapPositionStream;
    }

    public initMapPositionSubscriptionStream(usersToSuscribe: User[], travel:Travel) {
        var collectionName = 'mapSharing';
        var filter = {
            and: [
                {
                    term: { travelId: travel.id }
                },
                {
                    terms: { userId: usersToSuscribe.map(user => user.id) }
                }
            ]
        };

        // Subscribe to variation of map moves
        this.mapPositionKuzzleRoom = this.kuzzle.dataCollectionFactory(collectionName).subscribe(filter, {}, (error:any, result:any) => {
            // and then you notify the observer
            var mapPosition = new MapPosition(result.result._source);
            this.travelMapPositionStream.next(mapPosition);
        });
    }
}