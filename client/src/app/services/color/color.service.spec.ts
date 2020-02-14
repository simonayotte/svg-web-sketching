import { TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addUsedColor() should not have more than 10 colors', () => {
        for (let i: number = 0; i < 20; i++) service.addUsedColor('#ffffffff');

        service.usedColorsObs.subscribe((usedColors: string[]) => {
            expect(usedColors.length).toBe(10);
        });
    });

    it('#addUsedColor() should add color to third index of #usedColors after 2 added colors', () => {
        service.addUsedColor('#ff45ff33');
        service.addUsedColor('#05453ff');
        service.addUsedColor('#f0f50eef');

        service.usedColorsObs.subscribe((usedColors: string[]) => {
            expect(usedColors[2]).toBe('#f0f50eef');
        });
    });

    it('#addUsedColor() should increment #lastUsedColorIndex by 1', () => {
        service.addUsedColor('#ff45ff33');
        expect(service.lastUsedColorIndex).toBe(1);
    });

    it('#addUsedColor() should replace first index in #usedColors after 10 added colors', () => {
        for (let i: number = 0; i < 10; i++) service.addUsedColor('#ffffffff');

        service.addUsedColor('#00000000');

        service.usedColorsObs.subscribe((usedColors: string[]) => {
            expect(usedColors[0]).toBe('#00000000');
        });
    });

    it('#addUsedColor() should reset #lastUsedColorIndex to 0 after 10 added colors', () => {
        for (let i: number = 0; i < 10; i++) service.addUsedColor('#ffffffff');

        expect(service.lastUsedColorIndex).toBe(0);
    });
});
