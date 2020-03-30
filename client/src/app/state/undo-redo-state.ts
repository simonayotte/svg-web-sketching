export class UndoRedoState {
    undoState: Array<SVGGraphicsElement[]> = [];
    redoState: Array<SVGGraphicsElement[]> = [];
    nextUndoState: SVGGraphicsElement[] = [];
    canRedo: boolean = false;
    constructor() {}
}