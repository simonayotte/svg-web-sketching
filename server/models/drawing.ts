// Structure pour sauvegarder un dessin
//import {Shape} from './shape'
import { ObjectId } from 'mongodb';
export class Drawing {
    _id: ObjectId;
    name: string;
    tags: Array<string>;
    dataURL: string;
    //shapes: Array<Shape>
    constructor(name: string, tags: Array<string>, dataURL:string, /*shapes: Array<Shape>*/){
        this.name = name;
        this.tags = tags;
        this.dataURL = dataURL;
        //this.shapes = shapes;
    }
}
