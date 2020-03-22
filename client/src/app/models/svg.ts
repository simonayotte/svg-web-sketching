import { Color } from './color';

export enum SvgTypes {
    rectangle = 'Rectangle',
    circle = 'Cercle',
    ellipse = 'Ellipse',
    polygon = 'Polygone',
    line = 'Ligne',
    path = 'Path',
    text = 'Texte',
}

//Je ne pense pas que l'on ai a l'utiliser. Mais je le laisse au cas ou!
export class Svg {
    fill: Color;
    stroke: Color;
    thickness: number;
    type: SvgTypes;
    x: number;
    y: number;
    width: number;
    height: number;
    element: SVGElement;
    constructor(
        fill: Color,
        stroke: Color,
        thickness: number,
        type: SvgTypes,
        x: number,
        y: number,
        width: number,
        height: number,
        element: SVGElement,
    ) {
        this.fill = fill;
        this.stroke = stroke;
        this.thickness = thickness;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = element;
    }
}
