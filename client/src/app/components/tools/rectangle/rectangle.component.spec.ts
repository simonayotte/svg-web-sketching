import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Types } from 'src/app/models/enums';
import { RectangleComponent } from './rectangle.component';

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
        const spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });
        const testValue = 35;
        expect(spy).toHaveBeenCalledWith(testValue);
    });

    it('#setType() should emit #rectangleTypeChange if type is valid', () => {
        const spy = spyOn(component.rectangleTypeChange, 'emit');
        component.setRectangleType(Types.Fill);

        expect(spy).toHaveBeenCalledWith(Types.Fill);
    });
});
