import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/models/color';

describe('Color', () => {
    let color: Color = new Color(255, 255, 255, 255);
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should create', () => {
        expect(color).toBeTruthy();
    });

    it('#hex() should return hexadecimal color correctly including opacity ', () => {
        color = new Color(255, 0, 255, 255);

        expect(color.hex()).toEqual('#ff00ffff');
    });

    it('#colorHex() should return hexadecimal color correctly excluding opacity ', () => {
        color = new Color(255, 0, 255, 255);

        expect(color.colorHex()).toEqual('ff00ff');
    });

    it('#rgba() should return array of color RGBA correctly', () => {
        color = new Color(1, 0, 49, 2);

        expect(color.rgba()).toEqual([1, 0, 49, 2]);
    });

    it('#rgba() should return array of color RGB correctly', () => {
        color = new Color(1, 0, 49, 2);

        expect(color.rgb()).toEqual([1, 0, 49]);
    });

    it('#fixColorRGB() should correct color if color components are invalid ', () => {
        color = new Color(-255, 500, 256, 2);
        color.fixColorRGB('r');
        color.fixColorRGB('g');
        color.fixColorRGB('b');

        expect(color.rgba()).toEqual([0, 255, 255, 2]);
    });

    it('#synchronizeHex() should call #fixColorRGB if type parameter is defined ', () => {
        color = new Color(-255, 0, 49, 2);
        const spy = spyOn(color, 'fixColorRGB');
        color.synchronizeHex('r');
        expect(spy).toHaveBeenCalled();
    });

    it('#synchronizeHex() should not call #fixColorRGB if type parameter is not defined ', () => {
        color = new Color(-255, 0, 49, 2);
        const spy = spyOn(color, 'fixColorRGB');
        color.synchronizeHex();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#synchronizeHex() should set #RGBHex correctly ', () => {
        color = new Color(255, 0, 0, 255);
        color.g = 255;
        color.synchronizeHex();
        expect(color.RGBHex).toEqual('ffff00');
    });

    it('#synchronizeRGB() should set #isHexValid to false if #RGBHex is not valid', () => {
        color = new Color(255, 0, 0, 255);
        color.RGBHex = 'qqwwff';
        color.synchronizeRGB();
        expect(color.isHexValid).toBeFalsy();
    });

    it('#synchronizeRGB() should set #r,g,b correctly if #RGBHex is valid', () => {
        color = new Color(255, 0, 0, 255);
        color.RGBHex = 'ff01fe';

        color.synchronizeRGB();
        expect(color.rgba()).toEqual([255, 1, 254, 255]);
    });
});
