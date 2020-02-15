import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawStateService } from '../draw-state/draw-state.service';
import { Coordinate } from './coordinate';

@Injectable({
    providedIn: 'root',
})
export class LineService {
    private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
    thicknessObs: Observable<number> = this.thickness.asObservable();

    private canvasRef: ElementRef;
    public canvasContext: CanvasRenderingContext2D;

    // private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;
    private mouseOutListener: EventListener;
    private mouseDoubleDownListener: EventListener;

    public mousePositionX: number;
    public mousePositionY: number;

    private color: string;

    // Attributs pour les jonctions entre les points
    private lineHasJunction: boolean;
    private junctionPointThickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
    junctionPointThicknessObs: Observable<number> = this.thickness.asObservable();

    public lastX?: number;
    public lastY?: number;

    private canvasWidth: number;
    private canvasHeight: number;
    private canvasImage: ImageData;

    // Structure pour save les points pour annuler le dernier segment
    private coordinates: Coordinate[];

    // Attributs pour l'alignement de segment
    private isShiftKeyDown: boolean;

    constructor(private drawStateService: DrawStateService, private colorService: ColorService) {
        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            if (canvasRef != null) {
                this.canvasRef = canvasRef;
            }
        });
        this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
            if (canvasContext != null) {
                this.canvasContext = canvasContext;
            }
        });
        // Get draw page state

        this.colorService.firstColorObs.subscribe((color: string) => (this.color = color));

        // Bind this to event listeners
        this.lineHasJunction = false;
        this.mouseMoveListener = this.previewLineEventHandler.bind(this);
        this.mouseOutListener = this.stopLine.bind(this);
        this.mouseDoubleDownListener = this.stopLine.bind(this);

        // Deplacement de ce qu'il y avait dans le ngOnInit()
        this.canvasHeight = 2000;
        this.canvasWidth = 2000;
        // this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.coordinates = new Array<Coordinate>();
        this.setJunctionType(true);
    }

    setThickness(thickness: number) {
        this.thickness.next(thickness);
    }

    getThickness(): number {
        return this.thickness.value;
    }

    connectLineEventHandler(event: MouseEvent): void {
        const positionX = (this.mousePositionX = event.offsetX);
        const positionY = (this.mousePositionY = event.offsetY);
        if (this.isShiftKeyDown) {
            const point = this.calculateAlignedPoint(positionX, positionY);
            this.connectLine(point.pointX, point.pointY);
            this.previewAlignedLine(this.mousePositionX, this.mousePositionY);
        } else {
            this.connectLine(positionX, positionY);
            this.previewLine(this.mousePositionX, this.mousePositionY);
        }
        this.coordinates.push(new Coordinate(positionX, positionY));
    }

    connectLine(positionX: number, positionY: number): void {
        // Stroke style
        this.canvasContext.lineJoin = 'round';
        this.canvasContext.lineCap = 'round';
        this.canvasContext.lineWidth = this.thickness.value;
        this.canvasContext.strokeStyle = this.color;
        this.canvasContext.fillStyle = this.color;

        // Si ce n'est pas le premier point de la sequence de ligne
        if (this.lastX && this.lastY) {
            if (this.lineHasJunction) {
                this.drawPoint(positionX, positionY);
            }
            this.drawLine(positionX, positionY);
            this.lastX = positionX;
            this.lastY = positionY;
        } else {
            // Si c'est le premier point de la sequence
            this.drawPoint(positionX, positionY);
            this.lastX = positionX;
            this.lastY = positionY;
            this.canvasRef.nativeElement.addEventListener('dblclick', this.mouseDoubleDownListener);
        }
        // Ajouter la nouvelle ligne au saved Canvas Image
        this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        // Ajout à l'array des saved states
        this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
    }

    // MouseMoveEvent => PreviewLine
    previewLineEventHandler(event: MouseEvent) {
        const positionX = (this.mousePositionX = event.offsetX);
        const positionY = (this.mousePositionY = event.offsetY);
        if (this.getShiftKeyDown()) {
            this.previewAlignedLine(positionX, positionY);
        } else {
            this.previewLine(positionX, positionY);
        }
    }

    previewLine(positionX: number, positionY: number): void {
        if (this.lastX && this.lastY) {
            // save state of canvas
            this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.canvasContext.putImageData(this.canvasImage, 0, 0);
            this.drawLine(positionX, positionY);
        }
    }

    // Backspace => cancelSegment
    cancelSegment(): void {
        if (this.coordinates.length > 1) {
            this.coordinates.pop();
            this.lastX = undefined;
            this.lastY = undefined;
            this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.coordinates.forEach( (element) => {
                this.connectLine(element.pointX, element.pointY);
            });

            // Ajouter le segment temporaire de preview
            if (this.isShiftKeyDown) {
                this.previewAlignedLine(this.mousePositionX, this.mousePositionY);
            } else {
                this.previewLine(this.mousePositionX, this.mousePositionY);
            }
        }
    }

    // Escape => cancelLine
    cancelLine(): void {
        this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
        while (this.coordinates.length !== 0) {
            this.coordinates.pop();
        }
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.lastX = undefined;
        this.lastY = undefined;
    }

    drawLine(positionX: number, positionY: number): void {
        if (this.lastX && this.lastY) {
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(this.lastX, this.lastY);
            this.canvasContext.lineTo(positionX, positionY);
            this.canvasContext.stroke();
        }
    }

    // Draws the connection point for the lines
    drawPoint(positionX: number, positionY: number): void {
        this.canvasContext.beginPath();
        if (this.lineHasJunction) {
            this.canvasContext.ellipse(
                positionX,
                positionY,
                this.junctionPointThickness.value / 2,
                this.junctionPointThickness.value / 2,
                0,
                0,
                2 * Math.PI,
            );
        }
        this.canvasContext.stroke();
    }

    stopLine(event: MouseEvent): void {
        if (this.lastX && this.lastY) {
            this.previewLine(this.lastX, this.lastY);
        }
        this.lastX = undefined;
        this.lastY = undefined;
        // Enlever tout les elements de l'array
        while (this.coordinates.length !== 0) {
            this.coordinates.pop();
        }
        this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
    }

    setJunctionType(lineHasJunction: boolean) {
        this.lineHasJunction = lineHasJunction;
    }

    setJunctionPointThickness(junctionPointThickness: number) {
        this.junctionPointThickness.next(junctionPointThickness);
    }

    // Methodes pour l'alignement de la ligne
    setShiftKeyDown(bool: boolean): void {
        this.isShiftKeyDown = bool;
    }

    getShiftKeyDown(): boolean {
        return this.isShiftKeyDown;
    }

    previewAlignedLine(positionX: number, positionY: number): void {
        if (this.lastX && this.lastY) {
            const point = this.calculateAlignedPoint(positionX, positionY);
            this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.canvasContext.putImageData(this.canvasImage, 0, 0);
            this.drawLine(point.pointX, point.pointY);
        }
    }

    calculateAlignedPoint(positionX: number, positionY: number): Coordinate {
        if (this.lastX && this.lastY) {
            const adjacentLineLength = Math.abs(positionX - this.lastX);
            const oppositeLineLength = Math.abs(positionY - this.lastY);
            const hypothenuseLineLength = Math.sqrt(Math.pow(adjacentLineLength, 2) + Math.pow(oppositeLineLength, 2));

            const angle = Math.atan(oppositeLineLength / adjacentLineLength);
            if (positionX - this.lastX >= 0 && positionY - this.lastY >= 0) {
                if (angle >= 0 && angle < Math.PI / 6) {
                    // Retourner point avec alignement 0deg
                    return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
                } else
                // Alignement 45deg
                if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
                    return this.calculateAngledLineEndPoint(Math.PI / 4, hypothenuseLineLength);
                } else
                // Alignement 90deg
                if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
                    return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
                }
            } else
            // Cadran 3
            if (positionX - this.lastX < 0 && positionY - this.lastY >= 0) {
                if (angle >= 0 && angle < Math.PI / 6) {
                    return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
                } else
                // Alignement 45deg
                if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
                    return this.calculateAngledLineEndPoint(-Math.PI / 4, -hypothenuseLineLength);
                } else
                // Alignement 90deg
                if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
                    return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
                }
            } else
            // Cadran 2
            if (positionX - this.lastX >= 0 && positionY - this.lastY < 0) {
                if (angle >= 0 && angle < Math.PI / 6) {
                    return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
                } else
                // Alignement 45deg
                if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
                    return this.calculateAngledLineEndPoint(-Math.PI / 4, hypothenuseLineLength);
                } else
                // Alignement 90deg
                if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
                    return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
                }
            } else
            // Cadran 1
            if (positionX - this.lastX < 0 && positionY - this.lastY < 0) {
                if (angle >= 0 && angle < Math.PI / 6) {
                    // Retourner point avec alignement 0deg
                    return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
                } else
                // Alignement 45deg
                if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
                    return this.calculateAngledLineEndPoint(Math.PI / 4, -hypothenuseLineLength);
                } else
                // Alignement 90deg
                if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
                    return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
                }
            }
        }
        return new Coordinate(0, 0);
    }

    // Trouve le point d'apogée de l'hypothenuse d'un triangle
    calculateAngledLineEndPoint(angle: number, hypothenuse: number): Coordinate {
        if (this.lastX && this.lastY) {
            const x = Math.cos(angle) * hypothenuse + this.lastX; // Retourne valeur entre -1 et 1
            const y = Math.sin(angle) * hypothenuse + this.lastY; // Retourne valeur entre -1 et 1
            return new Coordinate(x, y);
        } else {
            return new Coordinate(0, 0);
        }
    }
}
