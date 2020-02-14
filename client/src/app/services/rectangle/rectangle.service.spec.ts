import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrushComponent } from 'src/app/components/brush/brush.component';
import { ColorComponent } from 'src/app/components/color/color.component';
import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { PencilComponent } from 'src/app/components/pencil/pencil.component';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';
import { DrawStateService } from '../draw-state/draw-state.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
  let drawStateService: DrawStateService;
  let fixture: ComponentFixture<RectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [BrushComponent, DrawPageComponent, GuideComponent, PencilComponent, RectangleComponent, ColorComponent],
        providers: [DrawStateService],
        imports: [FormsModule],
    }).compileComponents();
}));

  beforeEach(() => {
    drawStateService = TestBed.get(DrawStateService);
    const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
    const canvasRef = new ElementRef(drawPageFixture.debugElement.nativeElement.querySelector('.canvas'))
    drawStateService.setCanvasRef(canvasRef);
    drawStateService.setCanvasContext(canvasRef.nativeElement.getContext('2d'));
    fixture = TestBed.createComponent(RectangleComponent);
    fixture.detectChanges();
  });

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });

  it('setThickness should apply the thickness correctly to the observable', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    service.setThickness(20);
    expect(service.getThickness()).toBe(20);
  });

  it('startRect should bind the event listener accordingly', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const testMouseEvent = new MouseEvent('onclick');
    const testMouseMoveEvent = new MouseEvent('onmousemove');
    const testMouseUpEvent = new MouseEvent('onmouseup');
    service.startRect(testMouseEvent);
    const stopRectSpy = spyOn(service, 'stopRect');
    const drawRectSpy = spyOn(service, 'drawRect');
    const continueRectSpy = spyOn(service, 'continueRect');
    document.dispatchEvent(testMouseMoveEvent);
    document.dispatchEvent(testMouseUpEvent);
    expect(drawRectSpy).toHaveBeenCalled();
    expect(stopRectSpy).toHaveBeenCalled();
    expect(continueRectSpy).toHaveBeenCalled();
  });

  it('drawRect should correctly reset the canvas and begin drawing', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const canvasContextclearRectSpy = spyOn(service.getCanvasContext(), 'clearRect');
    const canvasContextputImageDataSpy = spyOn(service.getCanvasContext(), 'putImageData');
    const canvasContextbeginPath = spyOn(service.getCanvasContext(), 'beginPath');
    // startX=0; startY=0; width=0; height=0; thickness = 1
    service.drawRect(0, 0, 0, 0, 1);
    expect(canvasContextclearRectSpy).toHaveBeenCalled();
    expect(canvasContextputImageDataSpy).toHaveBeenCalled();
    expect(canvasContextbeginPath).toHaveBeenCalled();
  });

  it('drawRect should draw the right shape', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const canvasContextRectSpy = spyOn(service.getCanvasContext(), 'rect');
    // startX=10; startY=10; width=50; height=50; thickness = 1 => bottomright quadrant
    service.drawRect(10, 10, 50, 50, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, 49, 49);
    // startX=10; startY=10; width=-50; height=50; thickness = 5 => bottomleft quadrant
    service.drawRect(10, 10, -50, 50, 5);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, -45, 45);
    // startX=10; startY=10; width=50; height=-50; thickness = 1 => topright quadrant
    service.drawRect(10, 10, 50, -50, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, 49, -49);
    // startX=10; startY=10; width=-50; height=-50; thickness = 1 => topleft quadrant
    service.drawRect(10, 10, -50, -50, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, -49, -49);
  });

  it('drawRect should draw a square if shift is pressed', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    service.setshiftDown(true);
    const canvasContextRectSpy = spyOn(service.getCanvasContext(), 'rect');
    // startX=10; startY=10; width=20; height=15; thickness = 1 => bottomright quadrant
    service.drawRect(10, 10, 20, 15, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, 14, 14);
    // startX=10; startY=10; width=-30; height=15; thickness = 5 => bottomleft quadrant
    service.drawRect(10, 10, -30, 15, 5);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, -10, 10);
    // startX=10; startY=10; width=15; height=-40; thickness = 1 => topright quadrant
    service.drawRect(10, 10, 15, -40, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, 14, -14);
    // startX=10; startY=10; width=-20; height=-50; thickness = 1 => topleft quadrant
    service.drawRect(10, 10, -20, -50, 1);
    expect(canvasContextRectSpy).toHaveBeenCalledWith(10, 10, -19, -19);
  });

  it('drawRect should should draw a filled rectangle if the size is smaller than the thickness', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const canvasContextFillRectSpy = spyOn(service.getCanvasContext(), 'fillRect');
    // here width=5 < thickness = 10
    service.drawRect(1, 1, 5, 15, 10);
    expect(canvasContextFillRectSpy).toHaveBeenCalled();
  });

  it('continueRect should correctly call the right functions', () => {
    const service: RectangleService = TestBed.get(RectangleService);

    const drawRectSpy = spyOn(service, 'drawRect');
    const adjustStartPositionSpy = spyOn(service, 'adjustStartPosition');
    const testMouseMoveEvent = new MouseEvent('onmousemove');
    service.continueRect(testMouseMoveEvent);
    expect(drawRectSpy).toHaveBeenCalled();
    expect(adjustStartPositionSpy).toHaveBeenCalled();
  });

  it('stopRect should unbind the event listener', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const continueRectSpy = spyOn(service, 'continueRect');
    const testMouseMoveEvent = new MouseEvent('onmousemove');
    const testMouseUpEvent = new MouseEvent('onmouseup');
    const stopRectSpy = spyOn(service, 'stopRect');
    service.stopRect();
    document.dispatchEvent(testMouseMoveEvent);
    document.dispatchEvent(testMouseUpEvent);
    expect(stopRectSpy).toHaveBeenCalled();
    expect(continueRectSpy).toHaveBeenCalledTimes(0);
  });

  it('setRectangleType should change the type accordingly', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    let testType = 'fill only';
    service.setRectangleType(testType);
    expect(service.getRectangleType()).toBe(testType);
    testType = 'outline only';
    service.setRectangleType(testType);
    expect(service.getRectangleType()).toBe(testType);
    testType = 'other';
    service.setRectangleType(testType);
    expect(service.getRectangleType()).toBe('outline and fill');
  });

  it('setshiftDown should call drawRect', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    const drawRectSpy = spyOn(service, 'drawRect');
    service.setshiftDown(true);
    expect(drawRectSpy).toHaveBeenCalled();
  });
});
