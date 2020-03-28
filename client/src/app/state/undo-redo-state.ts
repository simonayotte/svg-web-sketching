export class UndoRedoState {
    undoState:SVGElement[][] = [];
    redoState: Array<SVGElement[]> = [];
    //pt pas necessaire pour le moment, voir svg-state
    presentState: Array<SVGElement[]> = [];
    constructor() {}
}