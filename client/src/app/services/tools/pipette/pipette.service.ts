// import { Injectable } from '@angular/core';
// import { DrawStore } from 'src/app/store/draw-store';
// import { DrawState } from 'src/app/state/draw-state';
// import { Tool } from 'src/app/models/tool';
// import { Color } from 'src/app/models/color';
// @Injectable({
//     providedIn: 'root',
// })
// export class PipetteService extends Tool<null> {
//     state: DrawState;
//     constructor(private store: DrawStore) {
//         super();
//         this.store.stateObs.subscribe((value: DrawState) => {
//             this.state = value;
//         });
//     }

//     start(event: MouseEvent) {
//         let destCtx = this.getCanvasWithBackground(this.state.canvasState.canvas, this.state.colorState.canvasColor.hex());

//         if (!destCtx) {
//             return;
//         }
//         const data: Uint8ClampedArray = destCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
//         if (event.button === 0) {
//             this.store.setFirstColor(new Color(data[0], data[1], data[2], data[3]));
//         } else if (event.button === 2) {
//             this.store.setSecondColor(new Color(data[0], data[1], data[2], data[3]));
//         }
//     }

//     getCanvasWithBackground(originalCanvas: HTMLCanvasElement, color: string): CanvasRenderingContext2D {
//         let canvas = document.createElement('canvas');
//         let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//         canvas.width = originalCanvas.width;
//         canvas.height = originalCanvas.height;

//         ctx.fillStyle = color;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(originalCanvas, 0, 0);

//         return ctx;
//     }
// }
