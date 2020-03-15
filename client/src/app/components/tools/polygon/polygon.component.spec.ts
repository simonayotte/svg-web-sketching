import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonComponent } from './polygon.component';

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
        let spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });

        expect(spy).toHaveBeenCalledWith(35);
    });

    it('#setType() should emit #polygonTypeChange if type is valid', () => {
        let spy = spyOn(component.polygonTypeChange, 'emit');
        component.setType('outline');

        expect(spy).toHaveBeenCalledWith('outline');
    });

    it('#setType() should not emit #polygonTypeChange if type is not valid', () => {
        let spy = spyOn(component.polygonTypeChange, 'emit');
        component.setType('invalid');

        expect(spy).not.toHaveBeenCalled();
    });

    it('#setSides() should emit #polygonSidesChange ', () => {
        let spy = spyOn(component.polygonSidesChange, 'emit');
        component.setSides({ target: { value: 10 } });

        expect(spy).toHaveBeenCalledWith(10);
    });
});
