import { UndoRedoState } from './undo-redo-state';
import { GlobalState } from './global-state';
import { ColorState } from './color-state';
import { SvgState } from './svg-state';
import { Types, BrushTextures } from '../models/enums';

const LINE_JUNCTION_THICKNESS_DEFAULT = 25;
const POLYGON_SIDES_DEFAULT = 3;
const THICKNESS_DEFAULT = 25;

export class DrawState {
    //Brush
    brushTexture = BrushTextures.Normal;
    //Line
    lineHasJunction = false;
    lineJunctionThickness = LINE_JUNCTION_THICKNESS_DEFAULT;
    //rectangle
    rectangleType = Types.Outline;
    //polygon
    polygonSides = POLYGON_SIDES_DEFAULT;
    polygonType = Types.Outline;
    //ellipsis
    ellipsisType = Types.Outline;
    //eraser
    eraserThickness = THICKNESS_DEFAULT;

    //aerosol
    emissionRate = 30;

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

