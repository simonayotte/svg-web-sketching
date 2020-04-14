import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Types } from 'src/app/models/enums';
import { EllipsisComponent } from './ellipsis.component';
/* tslint:disable:no-magic-numbers */
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
        const spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });

        expect(spy).toHaveBeenCalledWith(35);
    });

    it('#setType() should emit #ellipsisTypeChange if type is valid', () => {
        const spy = spyOn(component.ellipsisTypeChange, 'emit');
        component.setType(Types.Fill);

        expect(spy).toHaveBeenCalledWith(Types.Fill);
    });
});
