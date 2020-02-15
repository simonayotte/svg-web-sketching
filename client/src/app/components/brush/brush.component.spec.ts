import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { BrushComponent } from './brush.component';

import { ColorComponent } from '../color/color.component';
import { DrawPageComponent } from '../draw-page/draw-page.component';
import { GuideComponent } from '../guide/guide.component';
import { LineComponent } from '../line/line.component';
import { PencilComponent } from '../pencil/pencil.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
describe('BrushComponent', () => {
    let drawStateService: DrawStateService;
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushComponent, DrawPageComponent, GuideComponent, PencilComponent, RectangleComponent, ColorComponent, LineComponent],
            providers: [DrawStateService],
            imports: [FormsModule, MatDialogModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        drawStateService = TestBed.get(DrawStateService);
        const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
        drawStateService.setCanvasRef(new ElementRef(drawPageFixture.debugElement.nativeElement.querySelector('.canvas')));
        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (done: DoneFn) => {
        drawStateService.canvasRefObs.subscribe(() => {
            expect(component).toBeTruthy();
            done();
        });
    });

    it('#setTexture() should not set #texture if the input string is not a valid texture ', (done: DoneFn) => {
        drawStateService.canvasRefObs.subscribe(() => {
            component.setTexture('invalid');
            expect(component.texture).toEqual('normal');
            done();
        });
    });
});
