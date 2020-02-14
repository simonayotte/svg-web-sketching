import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushComponent } from './brush.component';
import { DrawPageComponent } from '../draw-page/draw-page.component';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { GuideComponent } from '../guide/guide.component';
import { PencilComponent } from '../pencil/pencil.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { ColorComponent } from '../color/color.component';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';

describe('BrushComponent', () => {
    let drawStateService: DrawStateService;
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;
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

    /*it('#setTexture() should set #texture ', (done: DoneFn) => {
        drawStateService.canvasRefObs.subscribe(() => {
            component.setTexture('wave');
            expect(component.texture).toBe('wave');
            done();
        });
    });

    it('#setTexture() should not set #texture if the input string is not a valid texture ', (done: DoneFn) => {
        drawStateService.canvasRefObs.subscribe(() => {
            component.setTexture('text');
            expect(component.texture).toBe('normal');
            done();
        });
    });*/
});
