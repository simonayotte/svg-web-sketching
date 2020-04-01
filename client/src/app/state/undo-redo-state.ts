export class UndoRedoState {
    undoState: SVGGraphicsElement[][] = [];
    redoState: SVGGraphicsElement[][] = [];
    nextUndoState: SVGGraphicsElement[] = [];
    canRedo = false;
    constructor() {}
}
