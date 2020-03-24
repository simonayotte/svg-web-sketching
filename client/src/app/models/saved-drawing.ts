// Structure pour sauvegarder un dessin
export class SavedDrawing {
    _id: string;
    name: string;
    tags: Array<string>;
    dataURL: string;
    svgsHTML: Array<string>;
    width:number;
    height:number;
    RGBA: Array<number>;
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
