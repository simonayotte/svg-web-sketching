import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleComponent } from './rectangle.component';
import { Types } from 'src/app/models/enums';

describe('EllipsisComponent', () => {
    let component: RectangleComponent;
    let fixture: ComponentFixture<RectangleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleComponent);
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

    it('#setType() should emit #rectangleTypeChange if type is valid', () => {
        let spy = spyOn(component.rectangleTypeChange, 'emit');
        component.setRectangleType(Types.Fill);

        expect(spy).toHaveBeenCalledWith(Types.Fill);
    });
});
