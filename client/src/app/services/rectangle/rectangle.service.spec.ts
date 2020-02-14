import { async, TestBed, ComponentFixture } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { DrawStateService } from '../draw-state/draw-state.service';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { BrushComponent } from 'src/app/components/brush/brush.component';
import { PencilComponent } from 'src/app/components/pencil/pencil.component';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';
import { ColorComponent } from 'src/app/components/color/color.component';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';


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
    let drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
    let canvasRef = new ElementRef(drawPageFixture.debugElement.nativeElement.querySelector('.canvas'))
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
