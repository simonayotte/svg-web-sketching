import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushTextures } from 'src/app/models/enums';
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
        const spy = spyOn(component.textureChange, 'emit');
        component.setTexture(BrushTextures.Square);

        expect(spy).toHaveBeenCalledWith(BrushTextures.Square);
    });

    it('#setThickness() should emit #thicknessChange', () => {
        const spy = spyOn(component.thicknessChange, 'emit');
        component.setThickness({ target: { value: 35 } });

        expect(spy).toHaveBeenCalledWith(35);
    });
});
