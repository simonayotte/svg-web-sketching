import { Coordinate } from './coordinate';
import { Shape } from './shape';

export class Line extends Shape {
    junctionThickness: number;
    hasJunction: boolean;
    path: Coordinate[];
}
