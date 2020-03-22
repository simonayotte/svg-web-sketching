import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawPageComponent } from './draw-page.component';

import { AerosolComponent } from './../tools/aerosol/aerosol/aerosol.component';
import { BrushComponent } from '../tools/brush/brush.component';
import { ColorComponent } from '../tools/color/color.component';
import { GuideComponent } from '../guide/guide.component';
import { LineComponent } from '../tools/line/line.component';
import { PencilComponent } from '../tools/pencil/pencil.component';
import { RectangleComponent } from '../tools/rectangle/rectangle.component';
import { DrawModule } from 'src/app/modules/draw.module';
import { MatDialogModule } from '@angular/material';


describe('DrawPageComponent', () => {
    let component: DrawPageComponent;
    let fixture: ComponentFixture<DrawPageComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DrawModule, MatDialogModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
