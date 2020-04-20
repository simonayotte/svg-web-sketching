import { Injectable, RendererFactory2 } from '@angular/core';
import { Coordinate } from 'src/app/models/coordinate';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    // MouseEventListener

    private mouseDoubleClickListener: EventListener;

    // Alignement de la ligne
    isShiftDown: boolean;

    // Positions
    currentMouseX: number;
    currentMouseY: number;

    lastX: number;
    lastY: number;

    // Array de point dans la ligne
    coordinates: Coordinate[] = [];
    points: string;

    // PreviewLine
    tempLine: SVGElement;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.isShiftDown = false;
        this.points = '';

        this.mouseMoveListener = this.continue.bind(this);
        this.mouseDoubleClickListener = this.stop.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
        this.coordinates = [];
        this.points = '';
        this.isShiftDown = false;
    }

    start(event: MouseEvent): void {
        // Only called for first point of the line
        if (this.coordinates.length === 0) {
            // Styling & creation of SVG element
            this.svg = this.renderer.createElement('polyline', 'svg');
            this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());
            this.renderer.setAttribute(this.svg, 'fill', 'none');
            this.renderer.setAttribute(this.svg, 'stroke-linecap', 'round');
            this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'round');
            this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());

            // Points in polyline
            this.renderer.setAttribute(this.svg, 'points', `${event.offsetX},${event.offsetY} `);

            if (this.state.lineHasJunction) {
                const COEFFICIENT = 25; // Coefficient pour augmenter precision de la selection de la largeur de la ligne
                const marker = this.renderer.createElement('marker', 'svg');
                this.renderer.setAttribute(marker, 'markerWidth', ((this.state.lineJunctionThickness * 2) / COEFFICIENT).toString());
                this.renderer.setAttribute(marker, 'markerHeight', ((this.state.lineJunctionThickness * 2) / COEFFICIENT).toString());
                this.renderer.setAttribute(marker, 'refX', (this.state.lineJunctionThickness / COEFFICIENT).toString());
                this.renderer.setAttribute(marker, 'refY', (this.state.lineJunctionThickness / COEFFICIENT).toString());
                this.renderer.setAttribute(marker, 'id', (this.state.lineJunctionThickness / COEFFICIENT).toString());

                const circle = this.renderer.createElement('circle', 'svg');
                this.renderer.setAttribute(circle, 'cx', (this.state.lineJunctionThickness / COEFFICIENT).toString());
                this.renderer.setAttribute(circle, 'cy', (this.state.lineJunctionThickness / COEFFICIENT).toString());
                this.renderer.setAttribute(circle, 'r', (this.state.lineJunctionThickness / COEFFICIENT).toString());
                marker.appendChild(circle);
                this.renderer.appendChild(this.state.svgState.drawSvg, marker);
                this.renderer.setAttribute(this.svg, 'marker-start', 'url(#'
                                           + (this.state.lineJunctionThickness / COEFFICIENT).toString() + ')');
                this.renderer.setAttribute(this.svg, 'marker-mid', 'url(#'
                                           + (this.state.lineJunctionThickness / COEFFICIENT).toString() + ')');
                this.renderer.setAttribute(this.svg, 'marker-end', 'url(#'
                                           + (this.state.lineJunctionThickness / COEFFICIENT).toString() + ')');
            }
            // Manage Event listeners
            this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
            this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
            this.state.svgState.drawSvg.addEventListener('dblclick', this.mouseDoubleClickListener);

            this.lastX = event.offsetX;
            this.lastY = event.offsetY;
        } else {
            // Pour tout les points autres que le premier
            if (this.isShiftDown) {
                // Aligned line
                const point = this.calculateAlignedPoint(event.offsetX, event.offsetY);
                this.drawLine(point.pointX, point.pointY);

                // Add points to structures
                this.lastX = point.pointX;
                this.lastY = point.pointY;
            } else {
                this.drawLine(event.offsetX, event.offsetY);
                this.lastX = event.offsetX;
                this.lastY = event.offsetY;
            }
        }
        this.coordinates.push(new Coordinate(this.lastX, this.lastY));
    }

    // Add position to SVG element to DrawLine
    drawLine(x: number, y: number): void {
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());
        let linePoints = this.svg.getAttribute('points');
        if (linePoints != null) {
            linePoints += `${x},${y} `;
            this.renderer.setAttribute(this.svg, 'points', linePoints);
        }
    }

    // Updates the currentMouse position and shows preview of the line
    continue(event: MouseEvent): void {
        this.currentMouseX = event.offsetX;
        this.currentMouseY = event.offsetY;

        if (this.isShiftDown) {
            const point = this.calculateAlignedPoint(this.currentMouseX, this.currentMouseY);
            this.previewLine(point.pointX, point.pointY);
        } else {
            this.previewLine(this.currentMouseX, this.currentMouseY);
        }
    }

    stop(): void {
        this.lastX = 0;
        this.lastY = 0;
        // Enlever tout les elements de l'array
        this.coordinates = [];
        if (this.svg) {
            this.store.pushSvg(this.svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
        }
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('dblclick', this.mouseDoubleClickListener);
        if (this.tempLine) {
            this.renderer.removeChild(this.state.svgState.drawSvg, this.tempLine);
        }
    }

    previewLine(x: number, y: number): void {
        // Remove last tempLine
        if (this.tempLine != undefined) {
            this.renderer.removeChild(this.state.svgState.drawSvg, this.tempLine);
        }

        // Changement de style pour illustrer le preview de ligne
        this.tempLine = this.renderer.createElement('line', 'svg');

        this.renderer.setAttribute(this.tempLine, 'stroke', this.state.colorState.secondColor.hex());
        this.renderer.setAttribute(this.tempLine, 'fill', 'none');
        this.renderer.setAttribute(this.tempLine, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.tempLine, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(this.tempLine, 'stroke-width', this.state.globalState.thickness.toString());
        const dashWidth = (this.state.globalState.thickness / 2).toString().concat(' 50');
        this.renderer.setAttribute(this.tempLine, 'stroke-dasharray', dashWidth);

        // Add coordinates to line, add tempLine in SVG
        this.renderer.setAttribute(this.tempLine, 'x1', this.lastX.toString());
        this.renderer.setAttribute(this.tempLine, 'y1', this.lastY.toString());
        this.renderer.setAttribute(this.tempLine, 'x2', x.toString());
        this.renderer.setAttribute(this.tempLine, 'y2', y.toString());
        this.renderer.appendChild(this.state.svgState.drawSvg, this.tempLine);
    }

    handleKeyDown(key: string): void {
        switch (key) {
            case 'Escape':
                this.deleteLine();
                break;
            case 'Shift':
                this.isShiftDown = true;
                break;
            case 'Backspace':
                this.deleteSegment();
                break;
        }
    }

    handleKeyUp(key: string): void {
        if (key === 'Shift') {
            this.isShiftDown = false;
        }
    }

    // Escape -> Deletes line in whole
    deleteLine(): void {
        if (this.coordinates[0]) {
            this.renderer.setAttribute(this.svg, 'points', '');
            this.stop();
        }
    }

    // Backspace -> Deletes last segment and junction of line
    deleteSegment(): void {
        if (this.coordinates.length > 1) {
            this.coordinates.pop();
            this.setPoints(this.coordinates);
            if (this.tempLine) {
                this.lastX = this.coordinates[this.coordinates.length - 1].pointX;
                this.lastY = this.coordinates[this.coordinates.length - 1].pointY;
                this.renderer.setAttribute(this.tempLine, 'x1', this.lastX.toString());
                this.renderer.setAttribute(this.tempLine, 'y1', this.lastY.toString());
            }
        }
    }

    setPoints(points: Coordinate[]): void {
        let tempString = '';
        for (const point of points) {
            tempString += `${point.pointX},${point.pointY} `;
        }
        // for (let i = 0; i < points.length; i++) {
        //     tempString += `${points[i].pointX},${points[i].pointY} `;
        // }
        this.renderer.setAttribute(this.svg, 'points', tempString);
    }

    // Methode pour alignement du point
    calculateAlignedPoint(positionX: number, positionY: number): Coordinate {
        if (this.lastX && this.lastY) {
            const adjacentLineLength = Math.abs(positionX - this.lastX);
            const oppositeLineLength = Math.abs(positionY - this.lastY);
            const hypothenuseLineLength = Math.sqrt(Math.pow(adjacentLineLength, 2) + Math.pow(oppositeLineLength, 2));
            const angle = Math.atan(oppositeLineLength / adjacentLineLength);
            return this.findCadrant(hypothenuseLineLength, angle, positionX, positionY, this.lastX, this.lastY);
        }
        return new Coordinate(0, 0);
    }

    calculateAngledLineEndPoint(angle: number, hypothenuse: number): Coordinate {
        if (this.lastX && this.lastY) {
            const x = Math.cos(angle) * hypothenuse + this.lastX; // Retourne valeur entre -1 et 1
            const y = Math.sin(angle) * hypothenuse + this.lastY; // Retourne valeur entre -1 et 1
            return new Coordinate(x, y);
        } else {
            return new Coordinate(0, 0);
        }
    }
    /*
    Disable les magic numbers pour les nombres du cercle trigonometique et
    le cyclomatic complexity pour eviter d'avoir 4 fonctions pour chaque cadrant
    */
    /* tslint:disable:cyclomatic-complexity no-magic-numbers */
    findCadrant(hypothenuseLineLength: number, angle: number, positionX: number,
                positionY: number, lastX: number, lastY: number): Coordinate {
        if (positionX - lastX >= 0 && positionY - lastY >= 0) {
            if (angle >= 0 && angle < Math.PI / 6) {
                // Retourner point avec alignement 0deg
                return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
            } else if (angle <= Math.PI / 3) {
                return this.calculateAngledLineEndPoint(Math.PI / 4, hypothenuseLineLength);
            } else if (angle <= Math.PI / 2) {
                return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
            }
        } else if (positionX - lastX < 0 && positionY - lastY >= 0) {
            if (angle >= 0 && angle < Math.PI / 6) {
                return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
            } else if (angle <= Math.PI / 3) {
                return this.calculateAngledLineEndPoint(-Math.PI / 4, -hypothenuseLineLength);
            } else if (angle <= Math.PI / 2) {
                return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
            }
        } else if (positionX - lastX >= 0 && positionY - lastY < 0) {
            if (angle >= 0 && angle < Math.PI / 6) {
                return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
            } else if (angle <= Math.PI / 3) {
                return this.calculateAngledLineEndPoint(-Math.PI / 4, hypothenuseLineLength);
            } else if (angle <= Math.PI / 2) {
                return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
            }
        } else if (positionX - lastX < 0 && positionY - lastY < 0) {
            if (angle >= 0 && angle < Math.PI / 6) {
                // Retourner point avec alignement 0deg
                return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
            } else if (angle <= Math.PI / 3) {
                return this.calculateAngledLineEndPoint(Math.PI / 4, -hypothenuseLineLength);
            } else if (angle <= Math.PI / 2) {
                return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
            }
        }
        return new Coordinate(0, 0);
    }
}
