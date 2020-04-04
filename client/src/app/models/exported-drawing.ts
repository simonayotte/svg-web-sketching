export class ExportedDrawing {
    name: string;
    type: string;
    dataURL: string;
    constructor(name: string, type: string, dataURL: string) {
        this.name = name;
        this.type = type;
        this.dataURL = dataURL;
    }
}
