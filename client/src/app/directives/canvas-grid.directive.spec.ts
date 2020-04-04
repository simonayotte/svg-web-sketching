import { Component, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Color } from '../models/color';
import { CanvasGridDirective } from './canvas-grid.directive';

@Component({
    template: '<canvas canvas-grid> </canvas>',
})
class TestComponent {}
describe('CanvasGridDirective', () => {
    // let directive: CanvasDirective;
    let fixture: ComponentFixture<TestComponent>;
    let directive: CanvasGridDirective;
    let directiveEl: DebugElement;
    // let canvasEl: DebugElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CanvasGridDirective, TestComponent],
        });
        fixture = TestBed.createComponent(TestComponent);
        directiveEl = fixture.debugElement.query(By.directive(CanvasGridDirective));
        // canvasEl = fixture.debugElement.query(By.css('canvas'));

        directive = directiveEl.injector.get(CanvasGridDirective);
        directive.ngOnInit();
        directive.size = 50;
        directive.color = new Color(70, 70, 70, 255);
        directive.isDisplay = true;
        directive.isKeyHandlerActive = true;
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('#ngOnChanges should call #draw() if #size changes and if #isDisplay is equal to true  ', () => {
        const spy = spyOn(directive, 'draw');
        directive.ngOnChanges({
            size: new SimpleChange(null, null, false),
        });
        expect(spy).toHaveBeenCalled();
    });

    it('#ngOnChanges should call #draw() if #color changes and if #isDisplay is equal to true  ', () => {
        const spy = spyOn(directive, 'draw');

        directive.ngOnChanges({
            color: new SimpleChange(null, null, false),
        });
        expect(spy).toHaveBeenCalled();
    });

    it('#ngOnChanges() should call #draw() if #isDisplay changes and if #isDisplay is equal to true  ', () => {
        const spy = spyOn(directive, 'draw');
        directive.ngOnChanges({
            isDisplay: new SimpleChange(null, null, false),
        });
        expect(spy).toHaveBeenCalled();
    });

    it('#ngOnChanges() should call #clearRect() if there is a change and if #isDisplay is equal to false  ', () => {
        directive.isDisplay = false;
        const spy = spyOn(directive.ctx, 'clearRect');
        directive.ngOnChanges({
            size: new SimpleChange(null, null, false),
        });
        expect(spy).toHaveBeenCalled();
    });

    it('#ngOnChanges() should not call #draw() if there is a change and if #isDisplay is equal to false  ', () => {
        directive.isDisplay = false;
        const spy = spyOn(directive, 'draw');
        directive.ngOnChanges({
            size: new SimpleChange(null, null, false),
        });
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onKeyDown() should be called on keyboard event', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'any',
        });

        const spy = spyOn(directive, 'onKeyDown');
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should emit #toggleGrid output if key is g', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'g',
        });

        const spy = spyOn(directive.toggleGrid, 'emit');
        directive.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should emit #toggleGrid output if key is g and #isKeyHandlerActive is false', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'g',
        });

        directive.isKeyHandlerActive = false;
        const spy = spyOn(directive.toggleGrid, 'emit');
        directive.onKeyDown(event);
        expect(spy).not.toHaveBeenCalled();
    });
    it('#onKeyDown() should emit #gridSizeChange output if key is +', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: '+',
        });

        const spy = spyOn(directive.gridSizeChange, 'emit');
        directive.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });
    it('#onKeyDown() should emit #gridSizeChange output if key is -', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: '-',
        });

        const spy = spyOn(directive.gridSizeChange, 'emit');
        directive.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#draw() should call #beginPath 100 times if #size = 50 & #width = 500 & #height = 500', () => {
        const spy = spyOn(directive.ctx, 'beginPath');
        directive.draw(50, 500, 500);
        expect(spy).toHaveBeenCalledTimes(100); // (500/50) * (500/50) = 10 * 10 = 100
    });

    it('#setSize() should return MIN_SQUARE_SIZE if new size if smaller than 30', () => {
        expect(directive.setSize(10, 5)).toEqual(directive.MIN_SQUARE_SIZE);
    });

    it('#setSize() should return MAX_SQUARE_SIZE if new size if bigger than 500', () => {
        expect(directive.setSize(500, 5)).toEqual(directive.MAX_SQUARE_SIZE);
    });

    it('#setSize() should new size if new size is valid', () => {
        expect(directive.setSize(55, 5)).toEqual(60);
    });
});
