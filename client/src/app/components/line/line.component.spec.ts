import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';

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
});
