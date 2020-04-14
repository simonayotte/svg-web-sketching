// Structure pour sauvegarder un dessin
export class SavedDrawing {
    id: string;
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
