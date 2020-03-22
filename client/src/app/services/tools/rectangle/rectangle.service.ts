// import { Injectable } from '@angular/core';
// import { Tool } from 'src/app/models/tool';
// import { DrawState } from 'src/app/state/draw-state';
// import { DrawStore } from 'src/app/store/draw-store';
// import { Rectangle } from 'src/app/models/rectangle';

// @Injectable({
//     providedIn: 'root',
// })
// export class RectangleService extends Tool<Rectangle> {
//     state: DrawState;

//     private mouseUpListener: EventListener;
//     private mouseMoveListener: EventListener;

//     isShiftDown: boolean = false;

//     private firstColor: string;
//     private secondColor: string;
//     private displayOutline: boolean;
//     private displayFill: boolean;
//     initialX: number;
//     initialY: number;
//     currentStartX: number;
//     currentStartY: number;
//     currentHeight: number;
//     currentWidth: number;

//     private canvasImage: ImageData;

//     constructor(private store: DrawStore) {
//         super();
//         // Bind this to event listeners
//         this.mouseMoveListener = this.continue.bind(this);
//         this.mouseUpListener = this.stop.bind(this);
//         this.store.stateObs.subscribe((value: DrawState) => {
//             this.state = value;

//             if (this.state.canvasState.canvas) {
//                 this.prepare();
//             }
//         });
//     }

//     continueSignal(): void {}

//     stopSignal(): void {}

//     start(event: MouseEvent) {
//         this.initialX = event.offsetX;
//         this.initialY = event.offsetY;
//         // Bind other mouse event
//         this.prepare();
//         this.setRectangleDisplay(this.state.rectangleType);
//         this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
//         this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
//         this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//     }

//     continue(event: MouseEvent): void {
//         this.adjustStartPosition(event.offsetX, event.offsetY);
//         this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight, this.state.canvasState.ctx.lineWidth);
//     }
//     prepare() {
//         this.firstColor = this.state.colorState.firstColor.hex();
//         this.secondColor = this.state.colorState.secondColor.hex();
//         this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
//         this.state.canvasState.ctx.lineJoin = 'miter';
//         this.state.canvasState.ctx.lineCap = 'square';
//         this.state.canvasState.ctx.strokeStyle = this.secondColor;
//         this.state.canvasState.ctx.fillStyle = this.firstColor;
//     }
//     stop() {
//         this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
//         this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);
//         this.store.pushShape(
//             this.createRectangleElement(
//                 this.currentStartX,
//                 this.currentStartY,
//                 this.currentWidth - this.initialX,
//                 this.currentHeight - this.initialY,
//                 this.state.globalState.thickness,
//                 this.firstColor,
//                 this.secondColor,
//                 this.state.rectangleType,
//                 this.isShiftDown,
//             ),
//         );
//     }
//     handleKeyDown(key: string) {
//         if (key === 'Shift') {
//             this.isShiftDown = true;
//             this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight, this.state.canvasState.ctx.lineWidth);
//         }
//     }
//     handleKeyUp(key: string) {
//         if (key === 'Shift') {
//             this.isShiftDown = false;
//         }
//     }

//     adjustStartPosition(mousePositionX: number, mousePositionY: number): void {
//         this.currentStartX =
//             mousePositionX > this.initialX
//                 ? this.initialX + this.state.canvasState.ctx.lineWidth / 2
//                 : this.initialX - this.state.canvasState.ctx.lineWidth / 2;
//         this.currentStartY =
//             mousePositionY > this.initialY
//                 ? this.initialY + this.state.canvasState.ctx.lineWidth / 2
//                 : this.initialY - this.state.canvasState.ctx.lineWidth / 2;
//         this.currentWidth = mousePositionX - this.initialX;
//         this.currentHeight = mousePositionY - this.initialY;
//     }

//     drawRect(startX: number, startY: number, width: number, height: number, thickness: number): void {
//         this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
//         this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);
//         this.state.canvasState.ctx.beginPath();

//         // Check if the rectangle is smaller than the thickness
//         if (thickness >= Math.abs(width) || thickness >= Math.abs(height)) {
//             this.state.canvasState.ctx.fillStyle = this.displayOutline ? this.secondColor : this.firstColor;
//             this.state.canvasState.ctx.fillRect(this.initialX, this.initialY, width, height);
//             this.state.canvasState.ctx.fillStyle = this.firstColor;
//         } else {
//             // If the rectangle is bigger, add offset depending on the thickness
//             width += thickness < width ? -thickness : thickness;
//             height += thickness < height ? -thickness : thickness;
//             if (this.isShiftDown) {
//                 if (Math.abs(width) < Math.abs(height)) {
//                     if ((width <= 0 && height >= 0) || (width >= 0 && height <= 0)) {
//                         // XOR for 1st and 3d quadrants
//                         height = -width;
//                     } else {
//                         height = width;
//                     }
//                 } else {
//                     if ((width <= 0 && height >= 0) || (width >= 0 && height <= 0)) {
//                         // XOR for 2nd and 4th quadrants
//                         width = -height;
//                     } else {
//                         width = height;
//                     }
//                 }
//             }

//             this.state.canvasState.ctx.rect(startX, startY, width, height);
//             if (this.displayFill) {
//                 this.state.canvasState.ctx.fill();
//             }
//             if (this.displayOutline) {
//                 this.state.canvasState.ctx.stroke();
//             }
//         }
//     }

//     setRectangleDisplay(rectangleType: string): void {
//         switch (rectangleType) {
//             case 'outline only':
//                 this.displayOutline = true;
//                 this.displayFill = false;
//                 this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
//                 break;
//             case 'fill only':
//                 this.displayOutline = false;
//                 this.displayFill = true;
//                 this.state.canvasState.ctx.lineWidth = 1;
//                 break;
//             default:
//                 this.displayOutline = true;
//                 this.displayFill = true;
//                 this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
//                 break;
//         }
//     }

//     createRectangleElement(
//         startX: number,
//         startY: number,
//         endX: number,
//         endY: number,
//         rectangleThickness: number,
//         firstColor: string,
//         secondColor: string,
//         rectangleType: string,
//         shift: boolean,
//     ): Rectangle {
//         const rectangleElement: Rectangle = {
//             startSelectX: startX,
//             startSelectY: startY,
//             endSelectX: endX,
//             endSelectY: endY,
//             primaryColor: firstColor,
//             secondaryColor: secondColor,
//             thickness: rectangleThickness,
//             type: rectangleType,
//             isSquare: shift,
//         };
//         return rectangleElement;
//     }

//     drawFromRectangleElement(rectangle: Rectangle): void {
//         this.setDrawingParameters(rectangle);
//         this.adjustStartPosition(rectangle.endSelectX, rectangle.endSelectY);
//         this.setRectangleDisplay(rectangle.type);
//         this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight, rectangle.thickness);
//     }

//     setDrawingParameters(rectangle: Rectangle): void {
//         this.initialX = rectangle.startSelectX;
//         this.initialY = rectangle.startSelectY;

//         // Stroke style
//         this.state.canvasState.ctx.lineWidth = rectangle.thickness;
//         this.state.canvasState.ctx.lineJoin = 'miter';
//         this.state.canvasState.ctx.lineCap = 'square';
//         this.state.canvasState.ctx.strokeStyle = rectangle.secondaryColor;
//         this.state.canvasState.ctx.fillStyle = rectangle.primaryColor;
//         this.isShiftDown = rectangle.isSquare;
//     }
// }
