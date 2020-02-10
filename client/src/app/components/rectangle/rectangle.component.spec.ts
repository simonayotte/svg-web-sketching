import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleComponent } from './rectangle.component';
import { By } from '@angular/platform-browser';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should correctly call setRectangleType when cliking on a type button', () => {
      const setRectangleTypeSpy = spyOn(component,'setRectangleType');
      const button = fixture.debugElement.query(By.css('.far fa-square .rectangle-style-box'));
      button.triggerEventHandler('click',{});
      fixture.detectChanges();
      expect(setRectangleTypeSpy).toHaveBeenCalled();
  });
});
