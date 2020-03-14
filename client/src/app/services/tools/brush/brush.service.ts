import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';
import { Brush } from 'src/app/models/brush';
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool<Brush> {
    state: DrawState;
    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
            if (value.canvasState.canvas) {
                this.setup({
                    ...this.element,
                    primaryColor: value.colorState.firstColor.hex(),
                    thickness: value.globalState.thickness,
                    texture: value.brushTexture,
                });
            }
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    textureMap: Map<string, string> = new Map();

    isDrawing = false;
    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    prepareTexture(texture: string, color: string) {
        this.initMap(color);
        let image: HTMLImageElement = new Image(this.state.globalState.thickness, this.state.globalState.thickness);
        image.src = this.textureMap.get(texture) as string;
        return (image.onload = () => {
            const pattern: CanvasPattern = this.state.canvasState.ctx.createPattern(image, 'repeat') as CanvasPattern;
            this.state.canvasState.ctx.fillStyle = pattern;
            this.state.canvasState.ctx.strokeStyle = pattern;
        });
    }

    start(event: MouseEvent) {
        this.element = {
            ...this.element,
            startSelectX: event.offsetX - this.state.globalState.thickness,
            startSelectY: event.offsetY - this.state.globalState.thickness,
            endSelectX: event.offsetX + this.state.globalState.thickness,
            endSelectY: event.offsetY + this.state.globalState.thickness,
            primaryColor: this.state.colorState.firstColor.hex(),
            secondaryColor: this.state.colorState.secondColor.hex(),
            thickness: this.state.globalState.thickness,
            path: [new Coordinate(event.offsetX, event.offsetY)],
            texture: this.state.brushTexture,
        };

        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.arc(event.offsetX, event.offsetY, this.element.thickness / 2, 0, 2 * Math.PI);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.fill();

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);

        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        this.element = {
            ...this.element,
            path: this.element.path.concat(new Coordinate(event.offsetX, event.offsetY)),
            startSelectX: event.offsetX < this.element.startSelectX ? event.offsetX : this.element.startSelectX,
            startSelectY: event.offsetY < this.element.startSelectY ? event.offsetY : this.element.startSelectY,
            endSelectX: event.offsetX > this.element.endSelectX ? event.offsetX : this.element.endSelectX,
            endSelectY: event.offsetY > this.element.endSelectY ? event.offsetY : this.element.endSelectY,
        };
        this.draw(this.element);
    }

    setup(element: Brush) {
        if (!element) {
            return;
        }
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.canvasState.ctx.lineWidth = element.thickness;
        if (element.texture === 'normal') {
            this.state.canvasState.ctx.fillStyle = element.primaryColor;
            this.state.canvasState.ctx.strokeStyle = element.primaryColor;
        } else {
            this.prepareTexture(element.texture, element.primaryColor.substr(1));
        }
    }

    draw(element: Brush) {
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(element.path[element.path.length - 2].pointX, element.path[element.path.length - 2].pointY);
        this.state.canvasState.ctx.lineTo(element.path[element.path.length - 1].pointX, element.path[element.path.length - 1].pointY);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.stroke();
    }

    stop() {
        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);

        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);

        if (this.isDrawing) {
            this.store.pushShape(this.element);
            this.isDrawing = false;
        }

        this.stopSignal();
    }
    initMap(color: string) {
        this.textureMap.set(
            'circle',
            `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${color}' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle
        cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'brick',
            `data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1'
             fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23${color}' fill-opacity='1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0
            23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'zigzag',
            `data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cpath
            d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20
            3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23${color}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'square',
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'
            width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23${color}' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E`,
        );

        this.textureMap.set(
            'wave',
            `data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18'
            xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10
             4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57
              6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%23${color}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`,
        );
    }

    drawFromBrushElement(brush: Brush): void {
        // Stroke style
        this.setup(brush);
        for (let i = 0; i < brush.path.length - 1; i++) {
            this.state.canvasState.ctx.beginPath();
            this.state.canvasState.ctx.moveTo(brush.path[i].pointX, brush.path[i].pointY);
            this.state.canvasState.ctx.lineTo(brush.path[i + 1].pointX, brush.path[i + 1].pointY);
            this.state.canvasState.ctx.closePath();
            this.state.canvasState.ctx.stroke();
        }
    }
}
