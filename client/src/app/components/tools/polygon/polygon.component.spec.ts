import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Types } from 'src/app/models/enums';
import { PolygonComponent } from './polygon.component';
/* tslint:disable:no-magic-numbers */
describe('PolygonComponent', () => {
    let component: PolygonComponent;
    let fixture: ComponentFixture<PolygonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygonComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setThickness() should emit #thicknessChange', () => {
        const spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });

        expect(spy).toHaveBeenCalledWith(35);
    });

    it('#setType() should emit #polygonTypeChange if type is valid', () => {
        const spy = spyOn(component.polygonTypeChange, 'emit');
        component.setType(Types.Outline);

        expect(spy).toHaveBeenCalledWith(Types.Outline);
    });

    it('#setSides() should emit #polygonSidesChange ', () => {
        const spy = spyOn(component.polygonSidesChange, 'emit');
        component.setSides({ target: { value: 10 } });

        expect(spy).toHaveBeenCalledWith(10);
    });
});
