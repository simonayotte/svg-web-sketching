import { GlobalState } from './global-state';
import { ColorState } from './color-state';
import { CanvasState } from './canvas-state';

export class DrawState {
    //Brush
    brushTexture = 'normal';
    //Line
    lineHasJunction = false;
    lineJunctionThickness = 25;
    //rectangle
    rectangleType = 'outline only';
    //aerosol
    emissionRate = 30;
    //
    colorState: ColorState;
    globalState: GlobalState;
    canvasState: CanvasState;
    constructor() {
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.canvasState = new CanvasState();
    }
}

/*readonly globalState: GlobalState;
    readonly pencilState: PencilState;
    readonly brushState: BrushState;
    readonly colorState: ColorState;

    constructor() {
        this.globalState = new GlobalState();
        this.pencilState = new PencilState();
        this.brushState = new BrushState();
        this.colorState = new ColorState();
    }*/
