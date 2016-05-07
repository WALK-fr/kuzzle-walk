import {Poi} from "./poi";
/**
 *
 */
export class TravelMarker {
    private _name:string;
    private _content:string;
    private _location:Location;
    private _poi:Poi;
    
    constructor(name:string, content:string, interest:Poi | Location) {
        this._name = name;
        this._content = content;
    }
}