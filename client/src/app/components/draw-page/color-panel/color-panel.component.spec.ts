import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Color } from 'src/app/models/color';
import { SelectedColors } from 'src/app/models/enums';
import { ColorPanelComponent } from './color-panel.component';

/* tslint:disable:no-magic-numbers */
describe('ColorPanelComponent', () => {
    let component: ColorPanelComponent;
    let fixture: ComponentFixture<ColorPanelComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPanelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPanelComponent);
        component = fixture.componentInstance;

        component.firstColor = new Color(255, 0, 255, 255);
        component.secondColor = new Color(0, 0, 255, 255);
        component.canvasColor = new Color(255, 255, 255, 255);
        fixture.detectChanges();
    });

    afterAll(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('color boxes should have correct background color', () => {
        const boxes = fixture.debugElement.queryAll(By.css('.panel-color-button-color'));

        expect(boxes[0].nativeElement.style.backgroundColor).toEqual('rgb(255, 0, 255)');
        expect(boxes[1].nativeElement.style.backgroundColor).toEqual('rgb(0, 0, 255)');
        expect(boxes[2].nativeElement.style.backgroundColor).toEqual('rgb(255, 255, 255)');
    });

    it('#swap should emit #swapColors ', () => {
        const spy = spyOn(component.swapColor, 'emit');

        component.swap();
        expect(spy).toHaveBeenCalled();
    });

    it('#openColorWindow should emit #selectedColorChange and #openColor', () => {
        const selectedColorChangeSpy = spyOn(component.selectedColorChange, 'emit');
        const openColorSpy = spyOn(component.openColor, 'emit');

        component.openColorWindow(SelectedColors.Canvas);
        expect(selectedColorChangeSpy).toHaveBeenCalledWith(SelectedColors.Canvas);
        expect(openColorSpy).toHaveBeenCalled();
    });
});
