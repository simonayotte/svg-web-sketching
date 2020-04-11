export class ExportedDrawing {
    name: string;
    type: string;
    dataURL: string;
    to: string; // COURRIEL
    constructor(name: string, type: string, to: string, dataURL: string) {
        this.to = to;
        this.name = name;
        this.type = type;
        this.dataURL = dataURL;
    }
}
