import { UndoRedoState } from './undo-redo-state';
import { GlobalState } from './global-state';
import { ColorState } from './color-state';
import { SvgState } from './svg-state';

export class DrawState {
    //Brush
    brushTexture = 'normal';
    //Line
    lineHasJunction = false;
    lineJunctionThickness = 25;
    //rectangle
    rectangleType = 'outline';
    //polygon
    polygonSides = 3;
    polygonType = 'outline';
    //ellipsis
    ellipsisType = 'outline';

    colorState: ColorState;
    globalState: GlobalState;
    svgState: SvgState;
    undoRedoState: UndoRedoState;
    constructor() {
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.svgState = new SvgState();
        this.undoRedoState = new UndoRedoState();
    }
}
