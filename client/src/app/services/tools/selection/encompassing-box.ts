export class EncompassingBox {
    encompassingBox: SVGGraphicsElement;
    display: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    controlPoint1: SVGGraphicsElement;
    controlPoint2: SVGGraphicsElement;
    controlPoint3: SVGGraphicsElement;
    controlPoint4: SVGGraphicsElement;
    controlPointWidth: number;

    constructor() {
        this.display = true;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.controlPointWidth = 0;
    }
}
