import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushComponent } from './brush.component';
describe('BrushComponent', () => {
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setTexture() should emit set #textureChange if the texture is valid ', () => {
        let spy = spyOn(component.textureChange, 'emit');
        component.setTexture('wave');

        expect(spy).toHaveBeenCalledWith('wave');
    });

    it('#setTexture() should not emit set #textureChange if the texture is not valid ', () => {
        let spy = spyOn(component.textureChange, 'emit');
        component.setTexture('invalid');

        expect(spy).not.toHaveBeenCalled();
    });

    it('#setThickness() should emit #thicknessChange', () => {
        let spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });

        expect(spy).toHaveBeenCalledWith(35);
    });
});
