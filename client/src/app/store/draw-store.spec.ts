import { TestBed } from '@angular/core/testing';

import { DrawStore } from './draw-store';
import { DrawState } from '../state/draw-state';
import { Color } from '../models/color';

// function isEqual(oldState: any, newState: any, changed: string[]): boolean {
//     const newKeys = Object.keys(newState);
//     console.log(oldState);
//     console.log(newState);
//     for (let key of newKeys) {
//         if (!changed.includes(key)) {
//             if (typeof newState[key] === 'object' && !Array.isArray(newState[key])) {
//                 if (!isEqual(oldState[key], newState[key], changed)) {
//                     return false;
//                 }
//             } else if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
//                 return false;
//             }
//         }
//     }
//     return true;
// }
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
            //expect(isEqual(state, value, ['drawSvg'])).toBeTruthy();
            done();
        });
    });

    it('#setDrawWidth() should only change #width', (done: DoneFn) => {
        store.setDrawWidth(700);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.width).toEqual(700);
            //expect(isEqual(state, value, ['width'])).toBeTruthy();
            done();
        });
    });

    it('#setDrawWidth() should only change #height', (done: DoneFn) => {
        store.setDrawHeight(700);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.height).toEqual(700);
            //expect(isEqual(state, value, ['height'])).toBeTruthy();
            done();
        });
    });

    it('#pushSvg() should add element to #svgs', (done: DoneFn) => {
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs.length).toEqual(2);
            //expect(isEqual(state, value, ['svgs'])).toBeTruthy();
            done();
        });
    });

    it('#popSvg() should remove last element from #svgs', (done: DoneFn) => {
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
        store.pushSvg(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));
        store.popShape();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs.length).toEqual(1);
            //expect(isEqual(state, value, ['svgs'])).toBeTruthy();
            done();
        });
    });
    it('#setThickness() should only change #thickness', (done: DoneFn) => {
        store.setThickness(10);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.thickness).toEqual(10);
            //expect(isEqual(state, value, ['thickness'])).toBeTruthy();
            done();
        });
    });

    it('#setTool() should only change #tool and #isPanelOpen', (done: DoneFn) => {
        store.setTool('Pinceau');
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.tool).toEqual('Pinceau');
            expect(value.globalState.isPanelOpen).toBeTruthy();

            //expect(isEqual(state, value, ['tool', 'isPanelOpen'])).toBeTruthy();
            done();
        });
    });

    it('#toggleGrid() should only change #isDisplayGrid', (done: DoneFn) => {
        store.toggleGrid();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.isDisplayGrid).toBeTruthy();
            // expect(isEqual(state, value, ['isDisplayGrid'])).toBeTruthy();
            done();
        });
    });

    it('#setGridSize() should only change #gridSize', (done: DoneFn) => {
        store.setGridSize(70);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.gridSize).toEqual(70);
            //expect(isEqual(state, value, ['gridSize'])).toBeTruthy();
            done();
        });
    });

    it('#setIsKeyHandlerActive() should only change #isKeyHandlerActive', (done: DoneFn) => {
        store.setIsKeyHandlerActive(false);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.isKeyHandlerActive).toBeFalsy();
            //expect(isEqual(state, value, ['isKeyHandlerActive'])).toBeTruthy();
            done();
        });
    });

    it('#setFirstColor() should only change #firstColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setFirstColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.firstColor).toEqual(color);
            //expect(isEqual(state, value, ['firstColor'])).toBeTruthy();
            done();
        });
    });

    it('#setSecondColor() should only change #secondColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setSecondColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.secondColor).toEqual(color);
            //expect(isEqual(state, value, ['secondColor'])).toBeTruthy();
            done();
        });
    });

    it('#setSecondColor() should only change #secondColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setSecondColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.secondColor).toEqual(color);
            //expect(isEqual(state, value, ['secondColor'])).toBeTruthy();
            done();
        });
    });

    it('#setIsSidebarColorOpen() should only change #isKeyHandlerActive and #isSidebarColorOpen with opposite value', (done: DoneFn) => {
        store.setIsSidebarColorOpen(true);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.isSidebarColorOpen).toBeTruthy();
            expect(value.globalState.isKeyHandlerActive).toBeFalsy();
            //expect(isEqual(state, value, ['isKeyHandlerActive', 'isSidebarColorOpen'])).toBeTruthy();
            done();
        });
    });

    it('#selectColor() should only change #selectedColor ', (done: DoneFn) => {
        store.selectColor('canvas');
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.selectedColor).toEqual('canvas');
            //expect(isEqual(state, value, ['selectedColor'])).toBeTruthy();
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
            //expect(isEqual(state, value, ['firstColor', 'secondColor'])).toBeTruthy();
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
            //expect(isEqual(state, value, ['lastColors', 'lastColorsIndex'])).toBeTruthy();
            done();
        });
    });
});
