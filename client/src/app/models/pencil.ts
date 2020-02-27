import { Coordinate } from './coordinate';
import { Shape } from './shape';

export interface Pencil extends Shape {
    path: Coordinate[];
}
