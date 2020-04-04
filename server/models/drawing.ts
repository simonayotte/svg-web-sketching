// Structure pour sauvegarder un dessin
import { ObjectId } from 'mongodb';
export class Drawing {
    _id: ObjectId;
    name: string;
    tags: Array<string>;
    dataURL: string;
    svgsHTML: Array<string>;
    width:number;
    height:number;
    RGBA:Array<number>
    constructor(name: string, tags: Array<string>, dataURL:string, svgsHTML: Array<string>,width: number, height:number,RGBA: Array<number>){
        this.name = name;
        this.tags = tags;
        this.dataURL = dataURL;
        this.svgsHTML = svgsHTML;
        this.width = width;
        this.height = height;
        this.RGBA = RGBA;
    }
}
