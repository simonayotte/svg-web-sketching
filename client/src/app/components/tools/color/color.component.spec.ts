// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatDialogModule } from '@angular/material';
// import { ColorService } from 'src/app/services/tools/color/color.service';
// import { ColorComponent } from './color.component';

// describe('ColorComponent', () => {
//     let component: ColorComponent;
//     let fixture: ComponentFixture<ColorComponent>;
//     let colorService: ColorService;
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ColorComponent],
//             imports: [FormsModule, MatDialogModule],
//             providers: [ColorService],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         colorService = TestBed.get(ColorService);
//         colorService.openPanelColorWindow('first');
//         fixture = TestBed.createComponent(ColorComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('#colorHex should be set to #firstColor from colorService on ngInit if #selectedColor is equal to first', (done: DoneFn) => {
//         colorService.openPanelColorWindow('first');
//         colorService.firstColorObs.subscribe((color: string) => {
//             expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
//             done();
//         });
//     });
//     it('#colorHex should be set to #secondColor from colorService on ngInit if #selectedColor is equal to second', (done: DoneFn) => {
//         colorService.openPanelColorWindow('second');
//         colorService.secondColorObs.subscribe((color: string) => {
//             expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
//             done();
//         });
//     });
//     it('#colorHex should be set to #canvasColor from colorService on ngInit if #selectedColor is equal to canvas', (done: DoneFn) => {
//         colorService.openPanelColorWindow('canvas');
//         colorService.canvasColorObs.subscribe((color: string) => {
//             expect(component.colorHex).toEqual(color.substring(1, color.length - 2));
//             done();
//         });
//     });

//     it('#setRGBWithHex() should call #fillSquare() if #colorHex is valid', () => {
//         const spy = spyOn(component, 'fillSquare');
//         component.colorHex = 'ff00ff';
//         component.setRGBWithHex();
//         expect(spy).toHaveBeenCalled();
//     });
//     it('#setRGBWithHex() should call not call #fillSquare() if #colorHex is not valid', () => {
//         const spy = spyOn(component, 'fillSquare');
//         component.colorHex = 'ff00';
//         component.setRGBWithHex();
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#setRGBWithHex() should set #colorRGBA correctly if #colorHex is valid', () => {
//         component.colorHex = 'ff00ff';
//         component.setRGBWithHex();
//         expect(component.colorRGBA).toEqual([255, 0, 255, component.colorRGBA[3]]);
//     });
//     it('#setRGBWithHex() should set #isHexError to false if #colorHex is not valid', () => {
//         component.colorHex = 'ff00';
//         component.setRGBWithHex();
//         expect(component.isHexError).toBeTruthy();
//     });

//     it('#setHexWithRGB() should call #fillSquare() if #colorRGBA[i] is valid', () => {
//         const spy = spyOn(component, 'fillSquare');
//         component.colorRGBA = [20, 30, 40, 255];
//         component.setHexWithRGB(1);

//         expect(spy).toHaveBeenCalled();
//     });
//     it('#setHexWithRGB() should not call #fillSquare() if #colorRGBA[i] is not valid', () => {
//         const spy = spyOn(component, 'fillSquare');
//         component.colorRGBA = [35000, 30, 40, 255];
//         component.setHexWithRGB(0);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#setHexWithRGB() should set #colorHex correctly if #colorRGBA[i] is valid', () => {
//         component.colorHex = '000000';
//         component.colorRGBA = [20, 30, 40, 255];
//         component.setHexWithRGB(2);
//         expect(component.colorHex).toEqual('141e28');
//     });
//     it('#setHexWithRGB() should set #isRGBError to false if #colorRGBA[i] is not valid', () => {
//         component.colorRGBA = [20, -1, 40, 255];
//         component.setHexWithRGB(1);
//         expect(component.isRGBError).toBeTruthy();
//     });

//     it('#toHex() should return hexadecimal color correctly with #isWithOpacity set to true', () => {
//         expect(component.toHex([10, 0, 240, 40], true)).toEqual('0a00f028');
//     });

//     it('#toHex() should return hexadecimal color correctly with #isWithOpacity set to false', () => {
//         expect(component.toHex([10, 0, 240, 40], false)).toEqual('0a00f0');
//     });

//     it('#toRGB() should return correct RGB color with valid #hex parameter ', () => {
//         expect(component.toRGB('f11f05')).toEqual([241, 31, 5]);
//     });

//     it('#toRGB() should return RGBA [0,0,0] color with not valid #hex parameter', () => {
//         expect(component.toRGB('f11f050af')).toEqual([0, 0, 0]);
//     });

//     it('#toRGBA() should return correct RGBA color with valid #hex parameter ', () => {
//         expect(component.toRGBA('#f11f050a')).toEqual([241, 31, 5, 10]);
//     });

//     it('#toRGBA() should return RGBA [0,0,0,1] color with not valid valid #hex parameter', () => {
//         expect(component.toRGBA('#f11f050aff00')).toEqual([0, 0, 0, 1]);
//     });

//     it('#confirmColor() should call #setFirstColor() from ColorService if #selectedColor is equal to first ', () => {
//         const spy = spyOn(colorService, 'setFirstColor');

//         component.confirmColor();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('#confirmColor() should correctly set ColorService #canvasColor if #selectedColor is equal to canvas', (done: DoneFn) => {
//         colorService.openPanelColorWindow('canvas');
//         component.colorRGBA = [255, 0, 100, 255];
//         component.confirmColor();
//         colorService.canvasColorObs.subscribe((color: string) => {
//             expect(color).toEqual('#ff0064ff');
//             done();
//         });
//     });

//     it('#confirmColor() should add confirmed color to ColorService #usedColors array', (done: DoneFn) => {
//         colorService.openPanelColorWindow('canvas');
//         component.colorRGBA = [255, 0, 100, 255];
//         component.confirmColor();
//         colorService.usedColorsObs.subscribe((usedColors: string[]) => {
//             expect(usedColors[colorService.lastUsedColorIndex - 1]).toEqual('#ff0064ff');
//             done();
//         });
//     });

//     it('#useColor() should set ColorService #firstColor if left clicked on used color ', () => {
//         const spy = spyOn(colorService, 'setFirstColor');

//         const event: MouseEvent = new MouseEvent('mousedown', {
//             button: 0,
//         });
//         component.useColor(event, '#450069ff');

//         expect(spy).toHaveBeenCalled();
//     });

//     it('#useColor() should set ColorService #secondColor if right clicked on used color ', () => {
//         colorService.openPanelColorWindow('second');

//         const spy = spyOn(colorService, 'setSecondColor');

//         const event: MouseEvent = new MouseEvent('mousedown', {
//             button: 2,
//         });
//         component.useColor(event, '#450069ff');

//         expect(spy).toHaveBeenCalled();
//     });
// });
