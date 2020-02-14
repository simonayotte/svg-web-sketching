import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BrushService } from './brush.service';
import { DrawStateService } from '../draw-state/draw-state.service';
//import { ElementRef } from '@angular/core';

import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { ColorComponent } from 'src/app/components/color/color.component';
import { PencilComponent } from 'src/app/components/pencil/pencil.component';
import { BrushComponent } from 'src/app/components/brush/brush.component';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';

describe('BrushService', () => {
    let service: BrushService;
    let drawStateService: DrawStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
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

    /*it('#setTexture() should set #pattern correctly if the texture parameter is valid', (done: DoneFn) => {
        drawStateService.canvasContextObs.subscribe(() => {
            service.setTexture('wave');
            expect(service.pattern).not.toBeNull();
            done();
        });
    });*/

    it('#setTexture() should set #pattern to null if the texture parameter is not valid', (done: DoneFn) => {
        drawStateService.canvasContextObs.subscribe(() => {
            service.setTexture('invalid');
            expect(service.pattern).toBeNull();
            done();
        });
    });

    /*it('#startDraw() should be called on mouse down', (done: DoneFn) => {
        let spy = spyOn(service, 'startDraw');
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown');
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            expect(spy).toHaveBeenCalled();
            done();
        });
    });

    it('#continueDraw() should be called on mouse move ', (done: DoneFn) => {
        let spy = spyOn(service, 'continueDraw');
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown');
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseMove: MouseEvent = new MouseEvent('mousemove');
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            expect(spy).toHaveBeenCalled();
            done();
        });
    });

    it('#continueDraw() should not be called on mouse move before mouse down ', (done: DoneFn) => {
        let spy = spyOn(service, 'continueDraw');

        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseMove: MouseEvent = new MouseEvent('mousemove');
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            expect(spy).not.toHaveBeenCalled();
            done();
        });
    });

    it('#continueDraw() should not be called on mouse move after mouse up ', (done: DoneFn) => {
        let spy = spyOn(service, 'continueDraw');
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown');
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseMove: MouseEvent = new MouseEvent('mousemove');
            canvasRef.nativeElement.dispatchEvent(mouseMove);
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            expect(spy).not.toHaveBeenCalled();
            done();
        });
    });

    it('#stopDraw() should be called on mouse up', (done: DoneFn) => {
        let spy = spyOn(service, 'stopDraw');
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseDown: MouseEvent = new MouseEvent('mousedown');
            canvasRef.nativeElement.dispatchEvent(mouseDown);
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            expect(spy).toHaveBeenCalled();
            done();
        });
    });
    it('#stopDraw() should not be called on mouse up before mouse down', (done: DoneFn) => {
        let spy = spyOn(service, 'stopDraw');
        drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            const mouseUp: MouseEvent = new MouseEvent('mouseup');
            canvasRef.nativeElement.dispatchEvent(mouseUp);
            expect(spy).not.toHaveBeenCalled();
            done();
        });
    });*/
});
