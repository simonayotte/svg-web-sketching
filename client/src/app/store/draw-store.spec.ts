import { TestBed } from '@angular/core/testing';
import { DrawStore } from './draw-store';
import { DrawState } from '../state/draw-state';
import { Color } from '../models/color';
import { BrushTextures, Tools, SelectedColors, Types } from '../models/enums';

describe('DrawStore', () => {
    let store: DrawStore;
    let state: DrawState;
    beforeEach(() => {
        TestBed.configureTestingModule({});

        store = new DrawStore();
        store.stateObs.subscribe((value: DrawState) => {
            if (!state) {
                state = value;
            }
        });
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('#setDrawSvg() should only change #drawSvg', (done: DoneFn) => {
        const drawSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        store.setDrawSvg(drawSvg);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.drawSvg).toEqual(drawSvg);
            done();
        });
    });

    it('#setDrawWidth() should only change #width', (done: DoneFn) => {
        store.setDrawWidth(700);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.width).toEqual(700);
            done();
        });
    });

    it('#setDrawWidth() should only change #height', (done: DoneFn) => {
        store.setDrawHeight(700);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.height).toEqual(700);
            done();
        });
    });

    it('#pushSvg() should add element to #svgs', (done: DoneFn) => {
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs.length).toEqual(2);
            done();
        });
    });

    it('#popSvg() should remove last element from #svgs', (done: DoneFn) => {
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
        store.popShape();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs.length).toEqual(1);
            done();
        });
    });
    it('#setThickness() should only change #thickness', (done: DoneFn) => {
        store.setThickness(10);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.thickness).toEqual(10);
            done();
        });
    });

    it('#setTool() should only change #tool and #isPanelOpen', (done: DoneFn) => {
        store.setTool(Tools.Brush);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.tool).toEqual(Tools.Brush);
            expect(value.globalState.isPanelOpen).toBeTruthy();

            done();
        });
    });

    it('#toggleGrid() should only change #isDisplayGrid', (done: DoneFn) => {
        store.toggleGrid();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.isDisplayGrid).toBeTruthy();
            done();
        });
    });

    it('#setGridSize() should only change #gridSize', (done: DoneFn) => {
        store.setGridSize(70);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.gridSize).toEqual(70);
            done();
        });
    });

    it('#setIsKeyHandlerActive() should only change #isKeyHandlerActive', (done: DoneFn) => {
        store.setIsKeyHandlerActive(false);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.isKeyHandlerActive).toBeFalsy();
            done();
        });
    });

    it('#setFirstColor() should only change #firstColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setFirstColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.firstColor).toEqual(color);
            done();
        });
    });

    it('#setSecondColor() should only change #secondColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setSecondColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.secondColor).toEqual(color);
            done();
        });
    });

    it('#setSecondColor() should only change #secondColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setSecondColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.secondColor).toEqual(color);
            done();
        });
    });

    it('#setIsSidebarColorOpen() should only change #isKeyHandlerActive and #isSidebarColorOpen with opposite value', (done: DoneFn) => {
        store.setIsSidebarColorOpen(true);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.isSidebarColorOpen).toBeTruthy();
            expect(value.globalState.isKeyHandlerActive).toBeFalsy();
            done();
        });
    });

    it('#selectColor() should only change #selectedColor ', (done: DoneFn) => {
        store.selectColor(SelectedColors.Canvas);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.selectedColor).toEqual(SelectedColors.Canvas);
            done();
        });
    });

    it('#swapColor() should only swap #firstColor and #secondColor ', (done: DoneFn) => {
        const firstColor = state.colorState.firstColor;
        const secondColor = state.colorState.secondColor;
        store.swapColor();

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.firstColor).toEqual(secondColor);
            expect(value.colorState.secondColor).toEqual(firstColor);
            done();
        });
    });

    it('#addLastColor() should add color to #lastColors and increment #lastColorsIndex ', (done: DoneFn) => {
        const color1 = new Color(1, 2, 3, 4);
        const color2 = new Color(5, 6, 7, 8);
        store.addLastColor(color1);
        store.addLastColor(color2);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.lastColorsIndex).toEqual(2);
            expect(value.colorState.lastColors[1]).toEqual(color2);
            done();
        });
    });

    it('#setGridOpacity() should set #gridColor ', (done: DoneFn) => {
        store.setGridOpacity(39);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.gridColor.a).toEqual(39);
            done();
        });
    });

    it('#setBrushTexture() should set #brushTexture ', (done: DoneFn) => {
        store.setBrushTexture(BrushTextures.Square);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.brushTexture).toEqual('square');
            done();
        });
    });

    it('#setRectangleType() should set #rectangleType ', (done: DoneFn) => {
        store.setRectangleType(Types.Fill);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.rectangleType).toEqual(Types.Fill);
            done();
        });
    });

    it('#setPolygonType() should set #polygonType ', (done: DoneFn) => {
        store.setPolygonType(Types.OutlineFill);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.polygonType).toEqual(Types.OutlineFill);
            done();
        });
    });

    it('#setEllipsisType() should set #ellipsisType ', (done: DoneFn) => {
        store.setEllipsisType(Types.Fill);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.ellipsisType).toEqual(Types.Fill);
            done();
        });
    });
});
