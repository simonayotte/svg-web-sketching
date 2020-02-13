import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
import { DrawStateService } from '../draw-state/draw-state.service';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { BrushComponent } from 'src/app/components/brush/brush.component';
import { PencilComponent } from 'src/app/components/pencil/pencil.component';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';
import { ColorComponent } from 'src/app/components/color/color.component';
import { FormsModule } from '@angular/forms';


describe('RectangleService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations : [DrawPageComponent, GuideComponent, BrushComponent, PencilComponent, RectangleComponent, ColorComponent],
    providers : [DrawStateService],
    imports : [FormsModule]
  }));

  beforeEach(() => {
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
    const continueRectSpy = spyOn(service, 'continueRect');
    const stopRectSpy = spyOn(service, 'stopRect');
    const testMouseEvent = new MouseEvent('onclick');
    const testMouseMoveEvent = new MouseEvent('onmousemove');
    const testMouseUpEvent = new MouseEvent('onmouseup');
    service.startRect(testMouseEvent);
    document.dispatchEvent(testMouseMoveEvent);
    document.dispatchEvent(testMouseUpEvent);
    expect(stopRectSpy).toHaveBeenCalled();
    expect(continueRectSpy).toHaveBeenCalled();
  });
});
