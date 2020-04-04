import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GridPanelComponent } from './grid-panel.component';
/* tslint:disable:no-magic-numbers */
describe('GridPanelComponent', () => {
    let component: GridPanelComponent;
    let fixture: ComponentFixture<GridPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GridPanelComponent],
            imports: [FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setGridOpacity() should emit #gridOpacityChange output', () => {
        const spy = spyOn(component.gridOpacityChange, 'emit');
        component.setGridOpacity({ target: { value: 20 } });
        expect(spy).toHaveBeenCalledWith(20);
    });

    it('#setKeyHandler() should be called with false on input focus', () => {
        const inputEl = fixture.debugElement.query(By.css('.input-number'));
        const spy = spyOn(component, 'setKeyHandler');
        inputEl.triggerEventHandler('focus', null);
        expect(spy).toHaveBeenCalledWith(false);
    });
    it('#setKeyHandler() should be called with true on input focusout', () => {
        const inputEl = fixture.debugElement.query(By.css('.input-number'));
        const spy = spyOn(component, 'setKeyHandler');
        inputEl.triggerEventHandler('focusout', null);
        expect(spy).toHaveBeenCalledWith(true);
    });

    it('#setKeyHandler() should emit #keyHandlerChange output', () => {
        const spy = spyOn(component.keyHandlerChange, 'emit');
        component.setKeyHandler(true);
        expect(spy).toHaveBeenCalledWith(true);
    });

    it('#confirmGridSize() should set #isSizeError to true if #size is smaller than 30 ', () => {
        component.size = 29;
        component.confirmGridSize();
        expect(component.isSizeError).toBeTruthy();
    });
    it('#confirmGridSize() should set #isSizeError to true if #size is bigger than 500 ', () => {
        component.size = 501;
        component.confirmGridSize();
        expect(component.isSizeError).toBeTruthy();
    });

    it('#confirmGridSize() should set #isSizeError to false and emit #gridSizeChange output if #size is valid ', () => {
        component.isSizeError = true;
        component.size = 70;
        const spy = spyOn(component.gridSizeChange, 'emit');
        component.confirmGridSize();
        expect(component.isSizeError).toBeFalsy();
        expect(spy).toHaveBeenCalled();
    });
});
