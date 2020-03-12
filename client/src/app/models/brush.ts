import { Coordinate } from './coordinate';
import { Shape } from './shape';

export class Brush extends Shape {
    texture: string;
    path: Coordinate[] = [];
}
