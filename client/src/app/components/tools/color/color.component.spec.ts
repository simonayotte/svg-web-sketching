import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorComponent } from './color.component';
import { Color } from 'src/app/models/color';
import { FormsModule } from '@angular/forms';

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
        let squareSpy = spyOn(component, 'fillSquare');
        let barSpy = spyOn(component, 'fillBar');
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

    /*
    it('#colorHex should be set to #firstColor from colorService on ngInit if #selectedColor is equal to first', (done: DoneFn) => {
        colorService.openPanelColorWindow('first');
        colorService.firstColorObs.subscribe((color: string) => {
            expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
            done();
        });
    });
    it('#colorHex should be set to #secondColor from colorService on ngInit if #selectedColor is equal to second', (done: DoneFn) => {
        colorService.openPanelColorWindow('second');
        colorService.secondColorObs.subscribe((color: string) => {
            expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
            done();
        });
    });
    it('#colorHex should be set to #canvasColor from colorService on ngInit if #selectedColor is equal to canvas', (done: DoneFn) => {
        colorService.openPanelColorWindow('canvas');
        colorService.canvasColorObs.subscribe((color: string) => {
            expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
            done();
        });
    });

    it('#setRGBWithHex() should call #fillSquare() if #colorHex is valid', () => {
        const spy = spyOn(component, 'fillSquare');
        component.colorHex = 'ff00ff';
        component.setRGBWithHex();
        expect(spy).toHaveBeenCalled();
    });
    it('#setRGBWithHex() should call not call #fillSquare() if #colorHex is not valid', () => {
        const spy = spyOn(component, 'fillSquare');
        component.colorHex = 'ff00';
        component.setRGBWithHex();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#setRGBWithHex() should set #colorRGBA correctly if #colorHex is valid', () => {
        component.colorHex = 'ff00ff';
        component.setRGBWithHex();
        expect(component.colorRGBA).toEqual([255, 0, 255, component.colorRGBA[3]]);
    });
    it('#setRGBWithHex() should set #isHexError to false if #colorHex is not valid', () => {
        component.colorHex = 'ff00';
        component.setRGBWithHex();
        expect(component.isHexError).toBeTruthy();
    });

    it('#setHexWithRGB() should call #fillSquare() if #colorRGBA[i] is valid', () => {
        const spy = spyOn(component, 'fillSquare');
        component.colorRGBA = [20, 30, 40, 255];
        component.setHexWithRGB(1);

        expect(spy).toHaveBeenCalled();
    });
    it('#setHexWithRGB() should not call #fillSquare() if #colorRGBA[i] is not valid', () => {
        const spy = spyOn(component, 'fillSquare');
        component.colorRGBA = [35000, 30, 40, 255];
        component.setHexWithRGB(0);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#setHexWithRGB() should set #colorHex correctly if #colorRGBA[i] is valid', () => {
        component.colorHex = '000000';
        component.colorRGBA = [20, 30, 40, 255];
        component.setHexWithRGB(2);
        expect(component.colorHex).toEqual('141e28');
    });
    it('#setHexWithRGB() should set #isRGBError to false if #colorRGBA[i] is not valid', () => {
        component.colorRGBA = [20, -1, 40, 255];
        component.setHexWithRGB(1);
        expect(component.isRGBError).toBeTruthy();
    });

    it('#toHex() should return hexadecimal color correctly with #isWithOpacity set to true', () => {
        expect(component.toHex([10, 0, 240, 40], true)).toEqual('0a00f028');
    });

    it('#toHex() should return hexadecimal color correctly with #isWithOpacity set to false', () => {
        expect(component.toHex([10, 0, 240, 40], false)).toEqual('0a00f0');
    });

    it('#toRGB() should return correct RGB color with valid #hex parameter ', () => {
        expect(component.toRGB('f11f05')).toEqual([241, 31, 5]);
    });

    it('#toRGB() should return RGBA [0,0,0] color with not valid #hex parameter', () => {
        expect(component.toRGB('f11f050af')).toEqual([0, 0, 0]);
    });

    it('#toRGBA() should return correct RGBA color with valid #hex parameter ', () => {
        expect(component.toRGBA('#f11f050a')).toEqual([241, 31, 5, 10]);
    });

    it('#toRGBA() should return RGBA [0,0,0,1] color with not valid valid #hex parameter', () => {
        expect(component.toRGBA('#f11f050aff00')).toEqual([0, 0, 0, 1]);
    });

    it('#confirmColor() should call #setFirstColor() from ColorService if #selectedColor is equal to first ', () => {
        const spy = spyOn(colorService, 'setFirstColor');

        component.confirmColor();
        expect(spy).toHaveBeenCalled();
    });

    it('#confirmColor() should correctly set ColorService #canvasColor if #selectedColor is equal to canvas', (done: DoneFn) => {
        colorService.openPanelColorWindow('canvas');
        component.colorRGBA = [255, 0, 100, 255];
        component.confirmColor();
        colorService.canvasColorObs.subscribe((color: string) => {
            expect(color).toEqual('#ff0064ff');
            done();
        });
    });

    it('#confirmColor() should add confirmed color to ColorService #usedColors array', (done: DoneFn) => {
        colorService.openPanelColorWindow('canvas');
        component.colorRGBA = [255, 0, 100, 255];
        component.confirmColor();
        colorService.usedColorsObs.subscribe((usedColors: string[]) => {
            expect(usedColors[colorService.lastUsedColorIndex - 1]).toEqual('#ff0064ff');
            done();
        });
    });

    it('#useColor() should set ColorService #firstColor if left clicked on used color ', () => {
        const spy = spyOn(colorService, 'setFirstColor');

        const event: MouseEvent = new MouseEvent('mousedown', {
            button: 0,
        });
        component.useColor(event, '#450069ff');

        expect(spy).toHaveBeenCalled();
    });

    it('#useColor() should set ColorService #secondColor if right clicked on used color ', () => {
        colorService.openPanelColorWindow('second');

        const spy = spyOn(colorService, 'setSecondColor');

        const event: MouseEvent = new MouseEvent('mousedown', {
            button: 2,
        });
        component.useColor(event, '#450069ff');

        expect(spy).toHaveBeenCalled();
    });*/
});
