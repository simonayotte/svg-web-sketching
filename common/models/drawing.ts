// Structure pour sauvegarder un dessin
//import {Shape} from './shape'
export class Drawing {
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
