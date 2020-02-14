import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPageComponent } from './draw-page.component';
import { GuideComponent } from '../guide/guide.component';
import { PencilComponent } from '../pencil/pencil.component';
import { BrushComponent } from '../brush/brush.component';
import { RectangleComponent } from '../rectangle/rectangle.component';
import { ColorComponent } from '../color/color.component';
import { FormsModule } from '@angular/forms';
describe('DrawPageComponent', () => {
    let component: DrawPageComponent;
    let fixture: ComponentFixture<DrawPageComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawPageComponent, GuideComponent, PencilComponent, BrushComponent, RectangleComponent, ColorComponent],
            imports: [FormsModule],
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

    it('#selectOption() should set #isPanelOpen to true when parameter panelOpen is true', () => {
        component.selectOption('', true);
        expect(component.isPanelOpen).toEqual(true);
    });
    it('#selectOption() should set #isPanelOpen to false when parameter panelOpen is false', () => {
        component.selectOption('', false);
        expect(component.isPanelOpen).toEqual(false);
    });
    it('#selectOption() should set #isPanelOpen to false when same option is selected and parameter panelOpen is true', () => {
        component.selectOption('test', true);
        component.selectOption('test', true);
        expect(component.isPanelOpen).toEqual(false);
    });

    it('#keyDown() should set #selectedOption to crayon if user presses on c ', () => {
        let event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });
        component.keyDown(event);
        expect(component.selectedOption).toEqual('Crayon');
    });

    it('#keyDown() should not set #selectedOption if user presses on invalid button ', () => {
        let event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
        });
        let oldSelectedOption = component.selectedOption;
        component.keyDown(event);
        expect(component.selectedOption).toEqual(oldSelectedOption);
    });
    it('#openColorWindow() should set #isColorWindowOpen to true if the parameter value is valid', () => {
        component.openColorWindow('first');
        expect(component.isColorWindowOpen).toEqual(true);
    });

    it('#openColorWindow() should set #isColorWindowOpen to false if the parameter value is not valid', () => {
        component.openColorWindow('invalidValue');
        expect(component.isColorWindowOpen).toEqual(false);
    });
    it('#swapColors should() swap #firstColor and #secondColor if the function has been called once', () => {
        let oldFirstColor: string = component.firstColor;
        let oldSecondColor: string = component.secondColor;
        component.swapColors();
        expect(component.firstColor).toEqual(oldSecondColor);
        expect(component.secondColor).toEqual(oldFirstColor);
    });
    it('#swapColors() should not swap #firstColor and #secondColor if the function has been called twice', () => {
        let oldFirstColor: string = component.firstColor;
        let oldSecondColor: string = component.secondColor;
        component.swapColors();
        component.swapColors();
        expect(component.firstColor).toEqual(oldFirstColor);
        expect(component.secondColor).toEqual(oldSecondColor);
    });
});
