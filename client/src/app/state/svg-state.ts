const WIDTH_DEFAULT = 500;
const HEIGHT_DEFAULT = 500;

export class SvgState {
    width: number = WIDTH_DEFAULT;
    height: number = HEIGHT_DEFAULT;
    drawSvg: SVGSVGElement;
    svgFilter: string;
    svgs: SVGGraphicsElement[] = [];
    constructor() {
        this.svgFilter = '';
    }
}
