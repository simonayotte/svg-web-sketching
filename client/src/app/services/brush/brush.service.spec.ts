import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BrushService } from './brush.service';
import { DrawStateService } from '../draw-state/draw-state.service';
import { MatDialogModule } from '@angular/material';
import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { ColorComponent } from 'src/app/components/color/color.component';
import { PencilComponent } from 'src/app/components/pencil/pencil.component';
import { BrushComponent } from 'src/app/components/brush/brush.component';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';
import { ElementRef } from '@angular/core';

describe('BrushService', () => {
    let service: BrushService;
    let drawStateService: DrawStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule],
            declarations: [DrawPageComponent, BrushComponent, GuideComponent, ColorComponent, PencilComponent, RectangleComponent],
        });
        drawStateService = TestBed.get(DrawStateService);
        let drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
        let brushFixture: ComponentFixture<BrushComponent> = TestBed.createComponent(BrushComponent);
        service = TestBed.get(BrushService);
        drawPageFixture.detectChanges();
        brushFixture.detectChanges();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#setTexture() should set #pattern to null if the texture parameter is not valid', (done: DoneFn) => {
        drawStateService.canvasContextObs.subscribe(() => {
            service.setTexture('invalid');
            expect(service.pattern).toBeNull();
            done();
        });
    });

    it('#startDraw() should be called on mouse down', (done: DoneFn) => {
        service.lastX = 0;
        service.lastY = 0;
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            let mouseDown: MouseEvent = new MouseEvent('mousedown', {
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
            canvasRef.nativeElement.mouseDown;
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
