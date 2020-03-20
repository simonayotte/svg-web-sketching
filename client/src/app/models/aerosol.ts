import { Shape } from './shape';
import { Coordinate } from './coordinate';

export interface Aerosol extends Shape {
    path: Coordinate[];
    emissionRate: number;
}