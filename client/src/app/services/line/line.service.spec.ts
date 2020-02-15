import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { BrushComponent } from './../../components/brush/brush.component';
import { ColorComponent } from './../../components/color/color.component';
import { DrawPageComponent } from './../../components/draw-page/draw-page.component';
import { GuideComponent } from './../../components/guide/guide.component';
import { LineComponent } from './../../components/line/line.component';
import { PencilComponent } from './../../components/pencil/pencil.component';
import { RectangleComponent } from './../../components/rectangle/rectangle.component';
import { LineService } from './line.service';

describe('LineService', () => {
  let service: LineService;
  let drawStateService: DrawStateService;

  beforeEach(() => {
        
        TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule],
            declarations: [DrawPageComponent, BrushComponent, GuideComponent, ColorComponent, PencilComponent, RectangleComponent, LineComponent],
        });
        drawStateService = TestBed.get(DrawStateService);
        const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
        const lineFixture: ComponentFixture<LineComponent> = TestBed.createComponent(LineComponent);
        service = TestBed.get(LineService);
        drawPageFixture.detectChanges();
        lineFixture.detectChanges();
    });

    it('should be created', () => {
        const service: LineService = TestBed.get(LineService);
        expect(service).toBeTruthy();
    });

    //Tester setThickness()
    it('#setThickness should apply the thickness correctly to the observable', () => {
        const service: LineService = TestBed.get(LineService);
        service.setThickness(20);
        expect(service.getThickness()).toBe(20);
    });

    //Tester MouseDown Click
    it('#connectLineEventHandler should call connectLine', () => {
        const service: LineService = TestBed.get(LineService);
        const testMouseEvent = new MouseEvent('onclick');
        const connectLineSpy = spyOn(service, 'connectLine');
        service.connectLineEventHandler(testMouseEvent);
        expect(connectLineSpy).toHaveBeenCalled();
    });

    it('#connectLineEventHandler() should be called on mouse down', (done: DoneFn) => {
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
    
    it('#calculatedAlignedPoint() should be called on shift keydown & mousedown', () => {
      const service: LineService = TestBed.get(LineService);
      service.setShiftKeyDown(true);
      const calculateAlignedPointSpy = spyOn(service, 'calculateAlignedPoint');
      service.lastX = 0;
      service.lastY = 0;
      drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
          const mouseDown: MouseEvent = new MouseEvent('mousedown', {
              clientX: 300,
              clientY: 400,
          });

          canvasRef.nativeElement.dispatchEvent(mouseDown);
          expect(calculateAlignedPointSpy).toHaveBeenCalled();
      });
    });

    it('#drawLine should call lineTo with correct arguments', () => {
      const service: LineService = TestBed.get(LineService);
      service.lastX = 100;
      service.lastY = 150;
      const posX: number = 200;
      const posY: number = 200;
      const lineToSpy = spyOn(service.canvasContext, 'lineTo');
      service.drawLine(posX, posY);
      expect(lineToSpy).toHaveBeenCalledWith(posX, posY);
    });

    
    // it('#cancelSegment should delete a line', () => {
    //   const service: LineService = TestBed.get(LineService);
      
    // });



});
