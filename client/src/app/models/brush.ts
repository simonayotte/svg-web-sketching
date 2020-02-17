import { Shape } from './shape';
import { Coordinate } from './coordinate';

export interface Brush extends Shape {
    texture: string;
    path: Array<Coordinate>;
}