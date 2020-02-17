import { Shape } from './shape';
import { Coordinate } from './coordinate';

export interface Line extends Shape {
    junctionThickness: number;
    hasJunction: boolean;
    path: Array<Coordinate>;
}