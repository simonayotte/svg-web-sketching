export class UndoRedoState {
    undoState: Array<SVGElement[]> = [];
    redoState: Array<SVGElement[]> = [];
    //pt pas necessaire pour le moment, voir svg-state
    presentState: Array<SVGElement[]> = [];
    constructor() {}
}