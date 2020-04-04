import { BrushTextures, Types } from '../models/enums';
import { ColorState } from './color-state';
import { GlobalState } from './global-state';
import { SvgState } from './svg-state';
import { UndoRedoState } from './undo-redo-state';

const LINE_JUNCTION_THICKNESS_DEFAULT = 25;
const POLYGON_SIDES_DEFAULT = 3;
const THICKNESS_DEFAULT = 25;

export class DrawState {
    // Brush
    brushTexture: BrushTextures = BrushTextures.Normal;
    // Line
    lineHasJunction: boolean;
    lineJunctionThickness: number = LINE_JUNCTION_THICKNESS_DEFAULT;
    // rectangle
    rectangleType: Types = Types.Outline;
    // polygon
    polygonSides: number = POLYGON_SIDES_DEFAULT;
    polygonType: Types = Types.Outline;
    // ellipsis
    ellipsisType: Types = Types.Outline;
    // eraser
    eraserThickness: number = THICKNESS_DEFAULT;

    // aerosol
    emissionRate: number;

    colorState: ColorState;
    globalState: GlobalState;
    svgState: SvgState;
    undoRedoState: UndoRedoState;
    constructor() {
        this.lineHasJunction = false;
        this.emissionRate = 30;
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.svgState = new SvgState();
        this.undoRedoState = new UndoRedoState();
    }
}
