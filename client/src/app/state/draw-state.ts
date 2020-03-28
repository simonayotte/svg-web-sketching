import { GlobalState } from './global-state';
import { ColorState } from './color-state';
import { SvgState } from './svg-state';
import { Types, BrushTextures } from '../models/enums';

export class DrawState {
    //Brush
    brushTexture = BrushTextures.Normal;
    //Line
    lineHasJunction = false;
    lineJunctionThickness = 25;
    //rectangle
    rectangleType = Types.Outline;
    //polygon
    polygonSides = 3;
    polygonType = Types.Outline;
    //ellipsis
    ellipsisType = Types.Outline;

    colorState: ColorState;
    globalState: GlobalState;
    svgState: SvgState;
    constructor() {
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.svgState = new SvgState();
    }
}
