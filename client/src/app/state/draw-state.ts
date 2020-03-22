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
    rectangleType = 'outline only';
    //polygon
    polygonSides = 3;
    polygonType = 'outline';
    //ellipsis
    ellipsisType = 'outline';

    //aerosol
    emissionRate = 30;

    colorState: ColorState;
    globalState: GlobalState;
    svgState: SvgState;
    constructor() {
        this.globalState = new GlobalState();
        this.colorState = new ColorState();
        this.svgState = new SvgState();
    }
}

