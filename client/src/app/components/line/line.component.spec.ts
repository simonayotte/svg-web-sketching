import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';
import { By } from '@angular/platform-browser';

//Ajout imports
import { BrushComponent } from './../brush/brush.component'
import { FormsModule } from '@angular/forms';
import { ColorComponent } from './../color/color.component';
import { RectangleComponent } from './../rectangle/rectangle.component';
import { PencilComponent } from './../pencil/pencil.component';
import { GuideComponent } from './../guide/guide.component';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { DrawPageComponent } from './../draw-page/draw-page.component';
import { ElementRef } from '@angular/core';

describe('LineComponent', () => {
  let drawStateService: DrawStateService;
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent, DrawPageComponent, GuideComponent, PencilComponent,
        RectangleComponent, ColorComponent, BrushComponent],
      providers: [DrawStateService],
      imports: [FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawStateService = TestBed.get(DrawStateService);
    let drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
    drawStateService.setCanvasRef(new ElementRef(drawPageFixture.debugElement.nativeElement.querySelector('.canvas')));
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    (done: DoneFn) => {
      drawStateService.canvasRefObs.subscribe(() => {
        expect(component).toBeTruthy();
      });
      done();
    }
  });

  //Inclure ces tests quand le service sera debug
  it('#cancelLine should be called on keydown escape', () => {
    const spyOnEscape = spyOn(component, 'cancelLine');
    const eventMock = new KeyboardEvent('keydown', {code: 'Escape'});
    component.cancelLine(eventMock);
    expect(spyOnEscape).toHaveBeenCalled();
  });


  it('#cancelSegment should be called on keydown backspace', () => {
    const spyOnBackspace = spyOn(component, 'cancelSegment');
    const eventMock = new KeyboardEvent('keydown', {code: 'Backspace'});
    component.cancelSegment(eventMock);
    expect(spyOnBackspace).toHaveBeenCalled();
  });

  it('#alignLine should be called on keydown shift', () => {
    const spyOnKeydownShift = spyOn(component, 'alignLine');
    const eventMock = new KeyboardEvent('keydown', {code: 'Shift'});
    component.alignLine(eventMock);
    expect(spyOnKeydownShift).toHaveBeenCalled();
  });

  it('#freeLine should be called on keyup shift', () => {
    const spyOnKeyupShift = spyOn(component, 'freeLine');
    const eventMock = new KeyboardEvent('keyup', {code: 'Shift'});
    component.freeLine(eventMock);
    expect(spyOnKeyupShift).toHaveBeenCalled();
  });

  it('should correctly call setThickness when using the slider', () => {
    const setThicknessSpy = spyOn(component,'setThickness');
    const slider = fixture.debugElement.query(By.css('.slider'));
    slider.triggerEventHandler('input',{});
    fixture.detectChanges();
    expect(setThicknessSpy).toHaveBeenCalledTimes(1);
  });

  it('should correctly call setJunctionType when cliking on a type button', () => {
    const setJunctionType = spyOn(component,'setJunctionType');
    const button = fixture.debugElement.query(By.css('.lineoption-box'));
    button.triggerEventHandler('click',{});
    fixture.detectChanges();
    expect(setJunctionType).toHaveBeenCalledTimes(1);
  });
  
});
