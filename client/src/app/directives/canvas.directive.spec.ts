import { CanvasDirective } from './canvas.directive';
import { TestBed } from '@angular/core/testing';
import { CanvasHandlerService } from '../services/canvas-handler/canvas-handler.service';
//import { ElementRef } from '@angular/core';
import { MatDialogModule } from '@angular/material';

describe('CanvasDirective', () => {
    // let directive: CanvasDirective;
    // let canvasHandler: CanvasHandlerService;
    // let canvas: HTMLCanvasElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CanvasDirective],
            providers: [CanvasHandlerService],
            imports: [MatDialogModule],
        });
        /*canvasHandler = TestBed.get(CanvasHandlerService);
        canvas = document.createElement('canvas');
        directive = new CanvasDirective(new ElementRef(canvas), canvasHandler);*/
    });
    /*it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('keydown event should call #onKeyDown CanvasHandlerService function ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });

        let spy = spyOn(canvasHandler, 'onKeyDown');
        canvas.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });
    it('keyup event should call #onKeyUp CanvasHandlerService function ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'c',
        });
        let spy = spyOn(canvasHandler, 'onKeyUp');
        canvas.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });
    it('mousedown event should call #startTool CanvasHandlerService function ', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 10,
            clientY: 15,
        });
        let spy = spyOn(canvasHandler, 'startTool');
        canvas.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });
    it('mouseout event should call #stopTool CanvasHandlerService function ', () => {
        const event: MouseEvent = new MouseEvent('mouseout', {
            clientX: 10,
            clientY: 15,
        });
        let spy = spyOn(canvasHandler, 'stopTool');
        canvas.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });*/
});
