/*import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrushComponent } from 'src/app/components/tools/brush/brush.component';
import { ColorComponent } from 'src/app/components/tools/color/color.component';
import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { LineComponent } from 'src/app/components/tools/line/line.component';
import { PencilComponent } from 'src/app/components/tools/pencil/pencil.component';
import { RectangleComponent } from 'src/app/components/tools/rectangle/rectangle.component';
import { PencilService } from './pencil.service';

describe('PencilService', () => {
    let service: PencilService;
    let drawStateService: DrawStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule],
            declarations: [DrawPageComponent, BrushComponent, GuideComponent, ColorComponent, PencilComponent, RectangleComponent, LineComponent],
        });

        drawStateService = TestBed.get(DrawStateService);
        const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
        const pencilFixture: ComponentFixture<PencilComponent> = TestBed.createComponent(PencilComponent);
        service = TestBed.get(PencilService);
        drawPageFixture.detectChanges();
        pencilFixture.detectChanges();
    });

    it('should be created', () => {
        const testService: PencilService = TestBed.get(PencilService);
        expect(testService).toBeTruthy();
    });

    it('#startDraw() should be called on mouse down', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown', {
                clientX: 300,
                clientY: 400,
            });

            canvasRef.nativeElement.dispatchEvent(mouseDown);
            expect(service.lastX).toEqual(300);
            expect(service.lastY).toEqual(400);
            done();
        });
    });

    it('#continueDraw() should be called on mouse move after mouse down ', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown', {
                clientX: 0,
                clientY: 0,
            });
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseMove: MouseEvent = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 50,
            });
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            expect(service.lastX).toEqual(100);
            expect(service.lastY).toEqual(50);
            done();
        });
    });

    it('#continueDraw() should not be called on mouse move before mouse down ', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseMove: MouseEvent = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 50,
            });
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            expect(service.lastX).toEqual(0);
            expect(service.lastY).toEqual(0);
            done();
        });
    });

    it('#continueDraw() should not be called on mouse move after mouse up ', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown', {
                clientX: 100,
                clientY: 10,
            });
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            const mouseMove: MouseEvent = new MouseEvent('mousemove', {
                clientX: 75,
                clientY: 400,
            });
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            expect(service.lastX).toEqual(0);
            expect(service.lastY).toEqual(0);
            done();
        });
    });

    it('#stopDraw() should be called on mouse up', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown', {
                clientX: 100,
                clientY: 10,
            });
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            expect(service.lastX).toEqual(0);
            expect(service.lastY).toEqual(0);
            done();
        });
    });
    it('#stopDraw() should not be called on mouse up before mouse down', (done: DoneFn) => {
        service.lastX = 200;
        service.lastY = 100;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            expect(service.lastX).toEqual(200);
            expect(service.lastY).toEqual(100);
            done();
        });
    });
});
*/
