import { Coordinate } from './../../models/coordinate';
export class ElementToRotate {
    constructor(center: Coordinate, index: number, minDistance: number) {
        this.center = center;
        this.index = index;
        this.minDistance = minDistance;
    }
    center: Coordinate; //Contient centre du SVG que l'on veut rotate
    index: number; //index of SVGElement in the SVGGraphicsElement Array -- Contient index du SVG a rotate
    private minDistance: number; // Contient distance entre centre et pointeur de la souris

    // Calculates distnce between given parameters and center point. Updates minDistance if distance is < minDistance.
    findDistance(x: number, y: number): boolean {
        let distance = Math.sqrt(Math.pow((this.center.pointX - x),2) + Math.pow((this.center.pointY - y),2));
        if (distance < this.minDistance) {
            this.minDistance = distance;
            return true;
        } else return false;
    }

    updateElement(centerX: number, centerY: number, index: number): void {
        this.center = new Coordinate(centerX, centerY);
        this.index = index;
    }
}