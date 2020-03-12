import { Shape } from './shape';
import { Coordinate } from './coordinate';

export class Polygon extends Shape {
    sides: number;
    points: Coordinate[] = [];
    type: string;
}
