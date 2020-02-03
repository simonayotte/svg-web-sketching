import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPageComponent } from './draw-page.component';

describe('DrawPageComponent', () => {
    let component: DrawPageComponent;
    let fixture: ComponentFixture<DrawPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawPageComponent],
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

    it('#selectOption should return true when parameter panelOpen is true', () => {
        component.selectOption('', true);
        expect(component.getIsPanelOpen()).toBe(true);
    });
    it('#selectOption should return false when parameter panelOpen is false', () => {
        component.selectOption('', false);
        expect(component.getIsPanelOpen()).toBe(false);
    });
    it('#selectOption should return false when same option is selected and parameter panelOpen is true', () => {
        component.selectOption('test', true);
        component.selectOption('test', true);
        expect(component.getIsPanelOpen()).toBe(false);
    });
});
