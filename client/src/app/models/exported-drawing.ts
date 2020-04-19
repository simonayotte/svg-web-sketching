export class ExportedDrawing {
    name: string;
    type: string;
    to: string; // COURRIEL
    option: string;  // 1: Export    2: Email    3: Export + Email
    dataURL: string;

    constructor(name: string, type: string, to: string, option: string, dataURL: string) {
        this.name = name;
        this.type = type;
        this.to = to;
        this.option = option;
        this.dataURL = dataURL;
    }
}
