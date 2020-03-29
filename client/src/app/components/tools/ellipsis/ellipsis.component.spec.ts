import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsisComponent } from './ellipsis.component';
import { Types } from 'src/app/models/enums';

describe('EllipsisComponent', () => {
    let component: EllipsisComponent;
    let fixture: ComponentFixture<EllipsisComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipsisComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipsisComponent);
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

    it('#setType() should emit #ellipsisTypeChange if type is valid', () => {
        let spy = spyOn(component.ellipsisTypeChange, 'emit');
        component.setType(Types.Fill);

        expect(spy).toHaveBeenCalledWith(Types.Fill);
    });
});
