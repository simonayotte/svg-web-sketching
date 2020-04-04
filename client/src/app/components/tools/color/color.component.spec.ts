import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { Color } from 'src/app/models/color';
import { ColorComponent } from './color.component';
/* tslint:disable:no-magic-numbers */
describe('ColorComponent', () => {
    let component: ColorComponent;
    let fixture: ComponentFixture<ColorComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorComponent],
            imports: [FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorComponent);
        component = fixture.componentInstance;
        component.colorInput = new Color(255, 255, 255, 255);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should call fillSquare() and fillBar() ', () => {
        const squareSpy = spyOn(component, 'fillSquare');
        const barSpy = spyOn(component, 'fillBar');
        component.ngOnInit();
        expect(squareSpy).toHaveBeenCalled();
        expect(barSpy).toHaveBeenCalled();
    });

    it('#setColorWithSquare should change color ', () => {
        component.fillSquare(new Color(240, 102, 75, 55));
        const event = new MouseEvent('mousedown', {
            clientX: 75,
            clientY: 75,
        });
        component.setColorWithSquare(event);
        expect(component.color.colorHex()).not.toEqual(component.colorInput.colorHex());
    });

    it('#setColorWithBar should change color ', () => {
        const event = new MouseEvent('mousedown', {
            clientX: 10,
            clientY: 125,
        });
        component.setColorWithBar(event);
        expect(component.color.colorHex()).not.toEqual(component.colorInput.colorHex());
    });

    it('#useColor() should emit #firstColor output if left clicked on used color ', () => {
        const spy = spyOn(component.setFirstColor, 'emit');

        const event: MouseEvent = new MouseEvent('mousedown', {
            button: 0,
        });
        const color = new Color(100, 11, 100, 255);
        component.useColor(event, color);

        expect(spy).toHaveBeenCalledWith(color);
    });

    it('#useColor() should emit #secondColor output if right clicked on used color ', () => {
        const spy = spyOn(component.setSecondColor, 'emit');

        const event: MouseEvent = new MouseEvent('mousedown', {
            button: 2,
        });
        const color = new Color(100, 11, 100, 255);

        component.useColor(event, color);

        expect(spy).toHaveBeenCalledWith(color);
    });

    it('#save() should emit #saveColor output ', () => {
        const spy = spyOn(component.saveColor, 'emit');
        const color = new Color(100, 11, 100, 255);
        component.color = color;
        component.save();
        expect(spy).toHaveBeenCalledWith(color);
    });

    it('#close() should emit #closeColor output ', () => {
        const spy = spyOn(component.closeColor, 'emit');
        component.close();
        expect(spy).toHaveBeenCalled();
    });
});
