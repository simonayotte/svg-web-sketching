import { BrushTextures, Types } from '../models/enums';
import { ColorState } from './color-state';
import { GlobalState } from './global-state';
import { SvgState } from './svg-state';
import { UndoRedoState } from './undo-redo-state';
import { SelectionBox } from '../models/selection-box';

const LINE_JUNCTION_THICKNESS_DEFAULT = 25;
const POLYGON_SIDES_DEFAULT = 3;
const THICKNESS_DEFAULT = 25;
const EMISSION_RATE_DEFAULT = 30;
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

    //selection
    isSelectionMoving: boolean;
    selectionBox: SelectionBox;

    colorState: ColorState;
    globalState: GlobalState;
    svgState: SvgState;
    undoRedoState: UndoRedoState;

    constructor() {
        this.lineHasJunction = false;
        this.isSelectionMoving = false;
        this.emissionRate = EMISSION_RATE_DEFAULT;
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.svgState = new SvgState();
        this.undoRedoState = new UndoRedoState();
        //this.selectionState = new SelectionState();
        this.selectionBox = new SelectionBox();
    }
}
