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
import { Coordinate } from './coordinate';
import { LineService } from './line.service';

describe('LineService', () => {
    let service: LineService;
    let drawStateService: DrawStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule],
            declarations: [DrawPageComponent, BrushComponent, GuideComponent, ColorComponent, PencilComponent,
                           RectangleComponent, LineComponent],
        });
        drawStateService = TestBed.get(DrawStateService);
        const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
        const lineFixture: ComponentFixture<LineComponent> = TestBed.createComponent(LineComponent);
        service = TestBed.get(LineService);
        drawPageFixture.detectChanges();
        lineFixture.detectChanges();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Tester setThickness()
    it('#setThickness should apply the thickness correctly to the observable', () => {
        service.setThickness(20);
        expect(service.getThickness()).toBe(20);
    });

    // Tester MouseDown Click
    it('#connectLineEventHandler should call connectLine', () => {
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


    it('#previewLineEventHandler() should call prievewLine with the right arguments', () => {
        service.lastX = 0;
        service.lastY = 0;
        const previewLineSpy = spyOn(service, 'previewLine');
        const testMouseMouve: MouseEvent = new MouseEvent('mousemove', {
            clientX: 300,
            clientY: 400,
        });
        service.previewLineEventHandler(testMouseMouve);
        expect(service.mousePositionX).toEqual(300);
        expect(service.mousePositionY).toEqual(400);
        expect(previewLineSpy).toHaveBeenCalledWith(300, 400);
      });

    it('#previewLineEventHandler() should call prievewAlignesLine when shift is pressed', () => {
        service.lastX = 0;
        service.lastY = 0;
        service.setShiftKeyDown(true);
        const previewAlignedLineSpy = spyOn(service, 'previewAlignedLine');
        const testMouseMouve: MouseEvent = new MouseEvent('mousemove', {
            clientX: 300,
            clientY: 400,
        });
        service.previewLineEventHandler(testMouseMouve);
        expect(service.mousePositionX).toEqual(300);
        expect(service.mousePositionY).toEqual(400);
        expect(previewAlignedLineSpy).toHaveBeenCalledWith(300, 400);
    });

    it('#stopLine() should empty the coordinate array', () => {
        service.lastX = 0;
        service.lastY = 0;
        service.coordinates.push(new Coordinate(1, 1));
        service.coordinates.push(new Coordinate(1, 2));
        service.coordinates.push(new Coordinate(1, 3));
        service.coordinates.push(new Coordinate(1, 4));
        const testMouseStop: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        service.stopLine(testMouseStop);
        expect(service.coordinates).toEqual([]);
    });

    it('#calculateAngleLineEndPoint should calculate the right coordinates', () => {
        service.lastX = 10;
        service.lastY = 10;
        const testCoordinates = new Coordinate(-30, 10);
        expect(service.calculateAngledLineEndPoint(Math.PI, 40).pointX).toBeCloseTo(testCoordinates.pointX);
        expect(service.calculateAngledLineEndPoint(Math.PI, 40).pointY).toBeCloseTo(testCoordinates.pointY);
    });

    it('#calculateAngleLineEndPoint should return a default point when there is no last position', () => {
        const testCoordinates = new Coordinate(0, 0);
        expect(service.calculateAngledLineEndPoint(Math.PI, 40).pointX).toBeCloseTo(testCoordinates.pointX);
        expect(service.calculateAngledLineEndPoint(Math.PI, 40).pointY).toBeCloseTo(testCoordinates.pointY);
    });

    it('#getPointPosition should add the right coordinates to the list of coordinates', () => {
        const testCoordinates = new Coordinate(1, 1);
        service.getPointPosition(1, 1);
        expect(service.coordinates.pop()).toEqual(testCoordinates);
    });

    it('#getPointPosition should call connectLine with the right arguments', () => {
        const connectLineSpy = spyOn(service, 'connectLine');
        service.getPointPosition(1, 1);
        expect(connectLineSpy).toHaveBeenCalledWith(1, 1);
    });

    it('#getPointPosition should call connectLine with the right arguments when shiftIsPressed', () => {
        const connectLineSpy = spyOn(service, 'connectLine');
        service.setShiftKeyDown(true);
        service.getPointPosition(1, 1);
        expect(connectLineSpy).toHaveBeenCalledWith(0, 0);
    });

    it('#calculateAlignedPoint should call findCadrant with the right arguments', () => {
        const findCadrantSpy = spyOn(service, 'findCadrant');
        service.lastX = 1;
        service.lastY = 1;
        const adjacentLineLengthTest = Math.abs(2 - service.lastX);
        const oppositeLineLengthTest = Math.abs(2 - service.lastY);
        const hypothenuseLineLengthTest = Math.sqrt(Math.pow(adjacentLineLengthTest, 2) + Math.pow(oppositeLineLengthTest, 2));
        const angleTest = Math.atan(oppositeLineLengthTest / adjacentLineLengthTest);
        service.calculateAlignedPoint(2,2);
        expect(findCadrantSpy).toHaveBeenCalledWith(hypothenuseLineLengthTest, angleTest, 2, 2, 1, 1);
    });

    it('#findCadrant should call calculateAngledLineEndPoint with the right arguments', () => {
        const endPointSpy = spyOn(service, 'calculateAngledLineEndPoint');
        service.lastX = 1;
        service.lastY = 1;
        service.findCadrant(1, 0, 2, 2, 1, 1);
        expect(endPointSpy).toHaveBeenCalledWith(0, 1);
    });
});
