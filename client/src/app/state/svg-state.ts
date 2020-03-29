const WIDTH_DEFAULT = 500;
const HEIGHT_DEFAULT = 500;

export class SvgState {
    width = WIDTH_DEFAULT;
    height = HEIGHT_DEFAULT;

    drawSvg: SVGSVGElement;
    svgs: SVGGraphicsElement[] = [];
    constructor() {}
}
