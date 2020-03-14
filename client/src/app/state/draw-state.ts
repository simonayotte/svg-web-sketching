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
    //polygon
    polygonSides = 3;
    polygonType = 'outline';
    //ellipsis
    ellipsisType = 'outline';

    colorState: ColorState;
    globalState: GlobalState;
    canvasState: CanvasState;
    constructor() {
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.canvasState = new CanvasState();
    }
}
