import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';
import { Brush } from 'src/app/models/brush';
@Injectable({
    providedIn: 'root',
})
export class BrushService implements Tool {
    state: DrawState;
    constructor(private store: DrawStore) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
            if (this.state.canvasState.canvas) {
                this.prepare();
            }
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    color: string;
    textureMap: Map<string, string> = new Map();
    lastX: number;
    lastY: number;

    private path: Coordinate[] = [];

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    prepare() {
        this.color = this.state.colorState.firstColor.hex();
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
        if (this.state.brushTexture === 'normal') {
            this.state.canvasState.ctx.fillStyle = this.color;
            this.state.canvasState.ctx.strokeStyle = this.color;
        } else {
            this.prepareTexture(this.state.brushTexture);
        }
    }

    handleKeyDown(key: string): void {}

    handleKeyUp(key: string): void {}

    continueSignal(): void {}

    stopSignal(): void {}

    prepareTexture(texture: string) {
        this.initMap();
        let image: HTMLImageElement = new Image(this.state.globalState.thickness, this.state.globalState.thickness);
        image.src = this.textureMap.get(texture) as string;
        return (image.onload = () => {
            const pattern: CanvasPattern = this.state.canvasState.ctx.createPattern(image, 'repeat') as CanvasPattern;
            this.state.canvasState.ctx.fillStyle = pattern;
            this.state.canvasState.ctx.strokeStyle = pattern;
        });
    }

    start(event: MouseEvent) {
        this.prepare();
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.arc(event.offsetX, event.offsetY, this.state.globalState.thickness / 2, 0, 2 * Math.PI);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.fill();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.path.push(new Coordinate(this.lastX, this.lastY));

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(this.lastX, this.lastY);
        this.state.canvasState.ctx.lineTo(event.offsetX, event.offsetY);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.stroke();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.path.push(new Coordinate(this.lastX, this.lastY));
        this.continueSignal();
    }

    stop() {
        let canvas: HTMLCanvasElement = this.state.canvasState.canvas;

        canvas.removeEventListener('mousemove', this.mouseMoveListener);

        canvas.removeEventListener('mouseup', this.mouseUpListener);

        if (this.path.length > 0) {
            this.store.pushShape(this.createBrush(this.state.globalState.thickness, this.color, this.color, this.path, this.state.brushTexture));
        }

        this.stopSignal();
    }
    initMap() {
        this.textureMap.set(
            'circle',
            `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${this.color.substr(1)}' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle
        cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'brick',
            `data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1'
             fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23${this.color.substr(
                 1,
             )}' fill-opacity='1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0
            23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'zigzag',
            `data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cpath
            d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20
            3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23${this.color.substr(
                1,
            )}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'square',
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'
            width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23${this.color.substr(
                1,
            )}' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'wave',
            `data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10
             4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57
              6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%23${this.color.substr(
                  1,
              )}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`,
        );
    }

    createBrush(lineThickness: number, firstColor: string, secondColor: string, brushPath: Coordinate[], brushTexture: string): Brush {
        let leftMostPoint = brushPath[0].pointX;
        let rightMostPoint = brushPath[0].pointX;
        let topMostPoint = brushPath[0].pointY;
        let bottomMostPoint = brushPath[0].pointY;

        for (const coordinate of brushPath) {
            if (coordinate.pointX < leftMostPoint) {
                leftMostPoint = coordinate.pointX;
            }
            if (coordinate.pointX > rightMostPoint) {
                rightMostPoint = coordinate.pointX;
            }
            if (coordinate.pointY < topMostPoint) {
                topMostPoint = coordinate.pointY;
            }
            if (coordinate.pointY > bottomMostPoint) {
                bottomMostPoint = coordinate.pointY;
            }
        }

        const brushElement: Brush = {
            startSelectX: leftMostPoint,
            startSelectY: topMostPoint,
            endSelectX: rightMostPoint,
            endSelectY: bottomMostPoint,
            primaryColor: firstColor,
            secondaryColor: secondColor,
            thickness: lineThickness,
            path: brushPath,
            texture: brushTexture,
        };

        return brushElement;
    }

    drawFromPencilElement(brush: Brush): void {
        // Stroke style
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.globalState.thickness = brush.thickness;
        this.state.brushTexture = brush.texture;
        this.state.canvasState.ctx.strokeStyle = brush.primaryColor;
        this.state.canvasState.ctx.fillStyle = brush.primaryColor;
        this.lastX = brush.path[0].pointX;
        this.lastY = brush.path[0].pointY;

        for (const coordinate of brush.path) {
            this.state.canvasState.ctx.beginPath();
            this.state.canvasState.ctx.moveTo(this.lastX, this.lastY);
            this.state.canvasState.ctx.lineTo(coordinate.pointX, coordinate.pointY);
            this.state.canvasState.ctx.closePath();
            this.state.canvasState.ctx.stroke();
            this.lastX = coordinate.pointX;
            this.lastY = coordinate.pointY;
        }
    }
}
