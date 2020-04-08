import { Coordinate } from '../models/coordinate';

export class ClipboardState {
    copiedSvgs: SVGGraphicsElement[] = [];
    copiedSvgsCoord: Coordinate = new Coordinate(0, 0);
    offset: number;
    constructor() {
        this.offset = 0;
    }
}
