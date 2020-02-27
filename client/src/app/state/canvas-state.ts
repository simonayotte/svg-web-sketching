import { Shape } from '../models/shape';

export class CanvasState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    width = 500;
    height = 500;

    shapes: Shape[] = [];
    constructor() {}
}
