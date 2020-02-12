import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleComponent } from './rectangle.component';
import { By } from '@angular/platform-browser';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers: [DrawStateService, RectangleService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should correctly call setRectangleType when cliking on a type button', () => {
    const setRectangleTypeSpy = spyOn(component,'setRectangleType');
    const button = fixture.debugElement.query(By.css('.rectangle-style-box'));
    button.triggerEventHandler('click',{});
    fixture.detectChanges();
    expect(setRectangleTypeSpy).toHaveBeenCalledTimes(1);
  });

  it('should correctly call setThickness when using the slider', () => {
    const setThicknessSpy = spyOn(component,'setThickness');
    const slider = fixture.debugElement.query(By.css('.slider'));
    slider.triggerEventHandler('input',{});
    fixture.detectChanges();
    expect(setThicknessSpy).toHaveBeenCalledTimes(1);
  });

  it('should correctly call changeSquareToRectangle when pressing shift', () => {
    const setThicknessSpy = spyOn(component,'changeSquareToRectangle');
    const testEventDown = new KeyboardEvent("keydown",{
      "key": "Shift"
    });
    document.dispatchEvent(testEventDown);
    fixture.detectChanges();
    expect(setThicknessSpy).toHaveBeenCalledTimes(1);
    const testEventUp = new KeyboardEvent("keyup",{
      "key": "Shift"
    });
    document.dispatchEvent(testEventUp);
    fixture.detectChanges();
    expect(setThicknessSpy).toHaveBeenCalledTimes(2);
  });

});
