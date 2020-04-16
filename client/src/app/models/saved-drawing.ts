// Structure pour sauvegarder un dessin
// _id doit avoir le _ car il correspond au _id d'un objet sauvegarder dans la db
// tslint:disable:variable-name
export class SavedDrawing {
    _id: string;
    name: string;
    tags: string[];
    dataURL: string;
    svgsHTML: string[];
    width: number;
    height: number;
    RGBA: number[];
    constructor(name: string, tags: string[], dataURL: string, svgsHTML: string[], width: number, height: number, RGBA: number[]) {
        this.name = name;
        this.tags = tags;
        this.dataURL = dataURL;
        this.svgsHTML = svgsHTML;
        this.width = width;
        this.height = height;
        this.RGBA = RGBA;
    }
}
