import { Coordinate } from 'src/app/models/coordinate';
import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';


@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    state: DrawState;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    //Alignement de la ligne
    isShiftDown: boolean = false;

    //Positions
    currentMouseX: number;
    currentMouseY: number;

    lastX: number;
    lastY: number;

    //Array de point dans la ligne
    coordinates: Coordinate[] = [];
    points = '';

    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);

    }

    start(event: MouseEvent) {
        //Only called for first point of the line
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.coordinates.push(new Coordinate(this.lastX, this.lastY));
        if (this.coordinates.length == 1){
            //Styling & creation of SVG element
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());
            this.svg.setAttribute('fill','none');
            this.svg.setAttribute('stroke-linecap', 'round');
            this.svg.setAttribute('stroke-linejoin', 'round');
            this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());

            //Points in polyline
            this.svg.setAttribute('points', `${this.lastX},${this.lastY} `);

            //Manage Event listeners
            this.state.svgState.drawSvg.appendChild(this.svg);
            this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
            
        } else {
            //Pour tout les points autres que le premier
            this.draw(this.lastX, this.lastY);
        }
       
    }

    draw(x: number, y: number) {
        let linePoints = this.svg.getAttribute('points');
        if (linePoints != null) {
            linePoints += `${this.lastX},${this.lastY} `;
            this.svg.setAttribute('points', linePoints);        
        }
    }

    

    continue(event: MouseEvent) {
        if(this.coordinates.length != 1) {
            this.currentMouseX = event.offsetX;
            this.currentMouseY = event.offsetY;

            //Remove last preview from array
            let linePoints = "";
            for (let i = 0; i < this.coordinates.length - 1; i++) {
                linePoints += `${this.coordinates[i].pointX},${this.coordinates[i].pointY} `;  
            }

            //Ajoute currentMouse comme point au SVG
            this.svg.setAttribute('points', linePoints);
            this.previewLine(this.currentMouseX, this.currentMouseY);
        }

       
    }

    stop() {

    }

    // addCoordinatesToPoints() {
    //     let linePoints = "";
    //     this.coordinates.forEach(element => {
    //         linePoints.concat(`${element.pointX},${element.pointY} `)
    //     });
    //     this.svg.setAttribute('points', linePoints)
    // }

    previewLine(x: number, y: number) {
        //Changement de style pour illustrer le preview de ligne
        this.svg.setAttribute('stroke-dasharray', "10 10");
        this.draw(x,y);
    }

    //Adds small line in the polyline
    drawLine() {

    }

    handleKeyDown(key: string) {
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

    handleKeyUp(key: string) {
        if (key === 'Shift') {
            this.isShiftDown = false;
        }
    }
    
    //Escape -> Deletes line in whole
    deleteLine() {

    }

    //Backspace -> Deletes last segment and junction of line
    deleteSegment() {

    }

  
}


// import { Injectable } from '@angular/core';
// import { Coordinate } from '../../../models/coordinate';
// import { Tool } from 'src/app/models/tool';
// import { DrawState } from 'src/app/state/draw-state';
// import { DrawStore } from 'src/app/store/draw-store';
// import { Line } from 'src/app/models/line';

// @Injectable({
//     providedIn: 'root',
// })
// export class LineService extends Tool<Line> {
//     state: DrawState;

//     constructor(private store: DrawStore) {
//         super();
//         this.coordinates = new Array<Coordinate>();

//         this.mouseMoveListener = this.continue.bind(this);
//         this.mouseDoubleClickListener = this.stop.bind(this);

//         this.store.stateObs.subscribe((value: DrawState) => {
//             this.state = value;
//             if (this.state.canvasState.canvas) {
//                 this.prepare();
//             }
//         });
//     }
//     continueSignal(): void {}

//     stopSignal(): void {}

//     prepare() {
//         this.color = this.state.colorState.firstColor.hex();
//         this.state.canvasState.ctx.lineJoin = 'round';
//         this.state.canvasState.ctx.lineCap = 'round';
//         this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
//         this.state.canvasState.ctx.fillStyle = this.color;
//         this.state.canvasState.ctx.strokeStyle = this.color;
//     }

//     // private mouseUpListener: EventListener;
//     private mouseMoveListener: EventListener;
//     private mouseDoubleClickListener: EventListener;

//     mousePositionX: number;
//     mousePositionY: number;

//     private color: string;

//     // Attributs pour les jonctions entre les points

//     lastX?: number;
//     lastY?: number;

//     private canvasImage: ImageData;
//     canvasImagePrevious: ImageData;

//     // Structure pour save les points pour annuler le dernier segment
//     coordinates: Coordinate[];

//     // Attributs pour l'alignement de segment
//     private isShiftKeyDown: boolean;

//     start(event: MouseEvent): void {
//         const positionX = (this.mousePositionX = event.offsetX);
//         const positionY = (this.mousePositionY = event.offsetY);
//         this.getPointPosition(positionX, positionY);
//     }

//     handleKeyDown(key: string): void {
//         switch (key) {
//             case 'Escape':
//                 this.cancelLine();
//                 break;
//             case 'Shift':
//                 this.isShiftKeyDown = true;
//                 break;
//             case 'Backspace':
//                 this.cancelSegment();
//                 break;
//         }
//     }

//     handleKeyUp(key: string): void {
//         if (key === 'Shift') {
//             this.isShiftKeyDown = false;
//         }
//     }

//     getPointPosition(positionX: number, positionY: number): void {
//         if (this.isShiftKeyDown) {
//             const point = this.calculateAlignedPoint(positionX, positionY);
//             this.connectLine(point.pointX, point.pointY);
//             this.previewAlignedLine(this.mousePositionX, this.mousePositionY);
//         } else {
//             this.connectLine(positionX, positionY);
//             this.previewLine(this.mousePositionX, this.mousePositionY);
//         }
//         this.coordinates.push(new Coordinate(positionX, positionY));
//     }

//     connectLine(positionX: number, positionY: number): void {
//         // Stroke style
//         this.prepare();

//         // Si ce n'est pas le premier point de la sequence de ligne
//         if (this.lastX && this.lastY) {
//             if (this.state.lineHasJunction) {
//                 this.drawPoint(positionX, positionY);
//             }
//             this.drawLine(positionX, positionY);
//             this.lastX = positionX;
//             this.lastY = positionY;
//         } else {
//             // Si c'est le premier point de la sequence
//             this.canvasImagePrevious = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//             this.drawPoint(positionX, positionY);
//             this.lastX = positionX;
//             this.lastY = positionY;
//             this.state.canvasState.canvas.addEventListener('dblclick', this.mouseDoubleClickListener);
//         }
//         // Ajouter la nouvelle ligne au saved Canvas Image
//         this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         // Ajout à l'array des saved states
//         this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
//     }

//     // MouseMoveEvent => PreviewLine
//     continue(event: MouseEvent) {
//         const positionX = (this.mousePositionX = event.offsetX);
//         const positionY = (this.mousePositionY = event.offsetY);
//         if (this.isShiftKeyDown) {
//             this.previewAlignedLine(positionX, positionY);
//         } else {
//             this.previewLine(positionX, positionY);
//         }
//     }

//     previewLine(positionX: number, positionY: number): void {
//         if (this.lastX && this.lastY) {
//             // save state of canvas
//             this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//             this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);
//             this.drawLine(positionX, positionY);
//         }
//     }

//     // Backspace => cancelSegment
//     cancelSegment(): void {
//         if (this.coordinates.length > 1) {
//             this.coordinates.pop();
//             this.lastX = undefined;
//             this.lastY = undefined;
//             this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//             this.state.canvasState.ctx.putImageData(this.canvasImagePrevious, 0, 0);
//             this.coordinates.forEach(element => {
//                 this.connectLine(element.pointX, element.pointY);
//             });

//             // Ajouter le segment temporaire de preview
//             if (this.isShiftKeyDown) {
//                 this.previewAlignedLine(this.mousePositionX, this.mousePositionY);
//             } else {
//                 this.previewLine(this.mousePositionX, this.mousePositionY);
//             }
//         }
//     }

//     // Escape => cancelLine
//     cancelLine(): void {
//         this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
//         this.state.canvasState.canvas.removeEventListener('dblclick', this.mouseDoubleClickListener);

//         while (this.coordinates.length !== 0) {
//             this.coordinates.pop();
//         }
//         this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         this.state.canvasState.ctx.putImageData(this.canvasImagePrevious, 0, 0);
//         this.canvasImagePrevious = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         this.lastX = undefined;
//         this.lastY = undefined;
//     }

//     drawLine(positionX: number, positionY: number): void {
//         if (this.lastX && this.lastY) {
//             this.state.canvasState.ctx.beginPath();
//             this.state.canvasState.ctx.moveTo(this.lastX, this.lastY);
//             this.state.canvasState.ctx.lineTo(positionX, positionY);
//             this.state.canvasState.ctx.stroke();
//         }
//     }

//     // Draws the connection point for the lines
//     drawPoint(positionX: number, positionY: number): void {
//         this.state.canvasState.ctx.beginPath();
//         if (this.state.lineHasJunction) {
//             this.state.canvasState.ctx.ellipse(
//                 positionX,
//                 positionY,
//                 this.state.lineJunctionThickness / 2,
//                 this.state.lineJunctionThickness / 2,
//                 0,
//                 0,
//                 2 * Math.PI,
//             );
//         }
//         this.state.canvasState.ctx.stroke();
//     }

//     stop(): void {
//         if (this.lastX && this.lastY) {
//             this.previewLine(this.lastX, this.lastY);
//         }
//         this.lastX = undefined;
//         this.lastY = undefined;
//         // Enlever tout les elements de l'array
//         while (this.coordinates.length !== 0) {
//             this.coordinates.pop();
//         }
//         this.canvasImagePrevious = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
//         this.state.canvasState.canvas.removeEventListener('dblclick', this.mouseDoubleClickListener);
//     }

//     previewAlignedLine(positionX: number, positionY: number): void {
//         if (this.lastX && this.lastY) {
//             const point = this.calculateAlignedPoint(positionX, positionY);
//             this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//             this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);
//             this.drawLine(point.pointX, point.pointY);
//         }
//     }

//     calculateAlignedPoint(positionX: number, positionY: number): Coordinate {
//         if (this.lastX && this.lastY) {
//             const adjacentLineLength = Math.abs(positionX - this.lastX);
//             const oppositeLineLength = Math.abs(positionY - this.lastY);
//             const hypothenuseLineLength = Math.sqrt(Math.pow(adjacentLineLength, 2) + Math.pow(oppositeLineLength, 2));
//             const angle = Math.atan(oppositeLineLength / adjacentLineLength);
//             return this.findCadrant(hypothenuseLineLength, angle, positionX, positionY, this.lastX, this.lastY);
//         }
//         return new Coordinate(0, 0);
//     }

//     findCadrant(hypothenuseLineLength: number, angle: number, positionX: number, positionY: number, lastX: number, lastY: number): Coordinate {
//         if (positionX - lastX >= 0 && positionY - lastY >= 0) {
//             if (angle >= 0 && angle < Math.PI / 6) {
//                 // Retourner point avec alignement 0deg
//                 return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
//             }
//             // Alignement 45deg
//             else if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 4, hypothenuseLineLength);
//             }
//             // Alignement 90deg
//             else if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
//             }
//         }
//         // Cadran 3
//         else if (positionX - lastX < 0 && positionY - lastY >= 0) {
//             if (angle >= 0 && angle < Math.PI / 6) {
//                 return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
//             }
//             // Alignement 45deg
//             else if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
//                 return this.calculateAngledLineEndPoint(-Math.PI / 4, -hypothenuseLineLength);
//             }
//             // Alignement 90deg
//             else if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 2, hypothenuseLineLength);
//             }
//         }
//         // Cadran 2
//         else if (positionX - lastX >= 0 && positionY - lastY < 0) {
//             if (angle >= 0 && angle < Math.PI / 6) {
//                 return this.calculateAngledLineEndPoint(0, hypothenuseLineLength);
//             }
//             // Alignement 45deg
//             else if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
//                 return this.calculateAngledLineEndPoint(-Math.PI / 4, hypothenuseLineLength);
//             }
//             // Alignement 90deg
//             else if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
//             }
//         }
//         // Cadran 1
//         else if (positionX - lastX < 0 && positionY - lastY < 0) {
//             if (angle >= 0 && angle < Math.PI / 6) {
//                 // Retourner point avec alignement 0deg
//                 return this.calculateAngledLineEndPoint(0, -hypothenuseLineLength);
//             }
//             // Alignement 45deg
//             else if (angle > Math.PI / 6 && angle <= Math.PI / 3) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 4, -hypothenuseLineLength);
//             }
//             // Alignement 90deg
//             else if (angle > Math.PI / 3 && angle <= Math.PI / 2) {
//                 return this.calculateAngledLineEndPoint(Math.PI / 2, -hypothenuseLineLength);
//             }
//         }
//         return new Coordinate(0, 0);
//     }

//     // Trouve le point d'apogée de l'hypothenuse d'un triangle
//     calculateAngledLineEndPoint(angle: number, hypothenuse: number): Coordinate {
//         if (this.lastX && this.lastY) {
//             const x = Math.cos(angle) * hypothenuse + this.lastX; // Retourne valeur entre -1 et 1
//             const y = Math.sin(angle) * hypothenuse + this.lastY; // Retourne valeur entre -1 et 1
//             return new Coordinate(x, y);
//         } else {
//             return new Coordinate(0, 0);
//         }
//     }
// }
