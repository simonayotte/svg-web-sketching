import { Coordinate } from './coordinate';
import { Shape } from './shape';

export interface Line extends Shape {
    junctionThickness: number;
    hasJunction: boolean;
    path: Coordinate[];
}
