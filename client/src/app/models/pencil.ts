import { Shape } from './shape';
import { Coordinate } from './coordinate';

export interface Pencil extends Shape {
    path: Coordinate[];
}