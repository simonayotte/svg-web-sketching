import { Coordinate } from './coordinate';
import { Shape } from './shape';

export interface Brush extends Shape {
    texture: string;
    path: Coordinate[];
}
