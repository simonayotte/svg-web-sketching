import { TestBed } from '@angular/core/testing';
import { Color } from '../models/color';
import { Coordinate } from '../models/coordinate';
import { DrawingJson } from '../models/drawing-json';
import { BrushTextures, SelectedColors, Tools, Types } from '../models/enums';
import { Tool } from '../models/tool';
import { DrawState } from '../state/draw-state';
import { DrawStore } from './draw-store';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:max-file-line-count */

describe('DrawStore', () => {
    let store: DrawStore;
    let state: DrawState;
    const rect: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const circle: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    let drawingJSONString: string | null;
    let drawingJSON: DrawingJson;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        store = new DrawStore();
        store.stateObs.subscribe((value: DrawState) => {
            state = value;
        });
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    // clipboard
    it('#copy() should set #copiedSvg to selectionBox cloned #svgs and reset #offset', () => {
        state.selectionBox.svgs = [rect, circle];
        state.clipboardState.offset = 30;
        store.copy();
        expect(state.clipboardState.copiedSvgs).toEqual(Tool.cloneSvgs([rect, circle]));
        expect(state.clipboardState.offset).toEqual(10);
    });

    it('#paste() should call Tool #cloneSvgs() with #offset and increment #offset by 10 ', () => {
        state.clipboardState.copiedSvgs = [rect, circle];
        state.clipboardState.offset = 30;

        const spy = spyOn(Tool, 'cloneSvgs');
        store.paste();
        expect(spy).toHaveBeenCalledWith([rect, circle], 30);
        expect(state.clipboardState.offset).toEqual(40);
    });

    it('#paste() should set set selectionBox #svgs after timeout ', (done: DoneFn) => {
        state.clipboardState.copiedSvgs = [rect, circle];
        store.paste();
        setTimeout(() => {
            expect(state.selectionBox.svgs).toEqual(Tool.cloneSvgs([rect, circle]));
            done();
        });
    });

    it('#paste() should reset #offset to 10 if paste is out of bounds ', () => {
        state.clipboardState.copiedSvgs = [rect, circle];
        state.clipboardState.copiedSvgsCoord = new Coordinate(495, 495); // width and height is 500 , offset is
        state.clipboardState.offset = 30;
        store.paste();
        expect(state.clipboardState.offset).toEqual(10);
    });

    it('#cut() should call #copy() and #deleteSvgs()', () => {
        const spyCopy = spyOn(store, 'copy');
        const spyDelete = spyOn(store, 'deleteSvgs');

        store.cut();
        expect(spyCopy).toHaveBeenCalled();
        expect(spyDelete).toHaveBeenCalled();
    });

    it('#duplicate() should call #pushSvgs() with selectionBox cloned #svgs', () => {
        state.selectionBox.svgs = [circle, rect];
        const spy = spyOn(store, 'pushSvgs');
        store.duplicate();
        expect(spy).toHaveBeenCalledWith(Tool.cloneSvgs([circle, rect], 10));
    });

    it('#duplicate() should set set selectionBox #svgs after timeout ', (done: DoneFn) => {
        state.selectionBox.svgs = [circle, rect];
        store.duplicate();
        setTimeout(() => {
            expect(state.selectionBox.svgs).toEqual(Tool.cloneSvgs([circle, rect], 10));
            done();
        });
    });

    it('#delete() should call #deleteSvgs() with selectionBox #svgs and empty it', () => {
        state.selectionBox.svgs = [circle, rect];
        const spy = spyOn(store, 'deleteSvgs');
        store.delete();
        expect(spy).toHaveBeenCalledWith([circle, rect]);
        expect(state.selectionBox.svgs).toEqual([]);
    });
    // undoRedo
    it('#undo() should set #svgs with last index of #undoState ', (done: DoneFn) => {
        state.undoRedoState.undoState = [[], [rect], [rect, circle]];

        store.undo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs).toEqual([rect, circle]);
            done();
        });
    });

    it('#undo() should remove last index of #undoState', (done: DoneFn) => {
        state.undoRedoState.undoState = [[], [rect], [rect, circle]];
        store.undo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.undoState).toEqual([[], [rect]]);
            done();
        });
    });

    it('#undo() should set #redoState with current state of #svgs ', (done: DoneFn) => {
        state.undoRedoState.undoState = [[], [rect], [rect, circle]];

        state.svgState.svgs = [rect, circle, rect, circle];

        store.undo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.redoState).toEqual([[rect, circle, rect, circle]]);
            done();
        });
    });

    it('#undo() should call #automaticSave ', () => {
        spyOn(store, 'automaticSave');
        state.undoRedoState.undoState = [[rect]];
        store.undo();
        expect(store.automaticSave).toHaveBeenCalled();
    });

    it('#redo() should set #svgs with last index of #redoState ', (done: DoneFn) => {
        state.undoRedoState.redoState = [[], [rect], [rect, circle]];

        store.redo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs).toEqual([rect, circle]);
            done();
        });
    });

    it('#redo() should remove last index of #redoState', (done: DoneFn) => {
        state.undoRedoState.redoState = [[], [rect], [rect, circle]];

        store.redo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.redoState).toEqual([[], [rect]]);
            done();
        });
    });

    it('#redo() should set #undoState with current state of #svgs ', (done: DoneFn) => {
        const path: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        state.undoRedoState.redoState = [[], [rect], [rect, path]];

        state.svgState.svgs = [rect, path, rect, path];

        store.redo();
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.undoState).toEqual([[rect, path, rect, path]]);
            done();
        });
    });

    it('#redo() should call #automaticSave ', () => {
        spyOn(store, 'automaticSave');
        state.undoRedoState.redoState = [[rect]];
        store.redo();
        expect(store.automaticSave).toHaveBeenCalled();
    });

    // svg
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
    it('#pushSvg() should set #undoState to old state of #svgs', (done: DoneFn) => {
        state.svgState.svgs = [circle];
        store.pushSvg(rect);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.undoState).toEqual([[circle]]);
            done();
        });
    });

    it('#pushSvg() should set #redoState to []', (done: DoneFn) => {
        state.undoRedoState.redoState = [[], [rect, circle]];

        store.pushSvg(rect);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.redoState).toEqual([]);
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

    it('#pushSvg() should call #automaticSave ', () => {
        spyOn(store, 'automaticSave');
        store.pushSvg(rect);
        expect(store.automaticSave).toHaveBeenCalled();
    });

    it('#saveSvgsState() should add state to #undoState and set #redoState to []', (done: DoneFn) => {
        store.saveSvgsState([rect, circle]);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.undoRedoState.undoState).toEqual([[rect, circle]]);
            expect(value.undoRedoState.redoState).toEqual([]);
            done();
        });
    });

    it('#setSvgArray() should only change #svgs', (done: DoneFn) => {
        const svgArray: SVGGraphicsElement[] = [rect, circle];
        store.setSvgArray(svgArray);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs).toEqual(svgArray);
            done();
        });
    });

    it('#setSvgArray() should call #automaticSave ', () => {
        spyOn(store, 'automaticSave');
        const svgArray: SVGGraphicsElement[] = [rect, circle];
        store.setSvgArray(svgArray);
        expect(store.automaticSave).toHaveBeenCalled();
    });

    it('#emptySvg() should only change #svgs to []', (done: DoneFn) => {
        store.emptySvg(true);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.svgState.svgs).toEqual([]);
            done();
        });
    });

    it('#emptySvg(true) should call #automaticSave', () => {
        spyOn(store, 'automaticSave');
        store.emptySvg(true);
        expect(store.automaticSave).toHaveBeenCalled();
    });

    it('#emptySvg(false) should not call #automaticSave', () => {
        spyOn(store, 'automaticSave');
        store.emptySvg(false);
        expect(store.automaticSave).not.toHaveBeenCalled();
    });

    it('#setThickness() should only change #thickness', (done: DoneFn) => {
        store.setThickness(10);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.thickness).toEqual(10);
            done();
        });
    });

    it('#setTool() should only change #tool and #isPanelOpen', (done: DoneFn) => {
        state.globalState.isPanelOpen = false;
        state.globalState.tool = Tools.Ellipsis;

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

    it('#setCanvasColor() should only change #canvasColor', (done: DoneFn) => {
        const color = new Color(1, 2, 3, 4);
        store.setCanvasColor(color);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.colorState.canvasColor).toEqual(color);
            done();
        });
    });

    it('#setCanvasColor() call #automaticSave()', () => {
        spyOn(store, 'automaticSave');
        const color = new Color(1, 2, 3, 4);
        store.setCanvasColor(color);
        expect(store.automaticSave).toHaveBeenCalled();
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

    it('#setTolerance() should only change #tolerance ', (done: DoneFn) => {
        store.setTolerance(69);
        store.stateObs.subscribe((value: DrawState) => {
            expect(value.tolerance).toEqual(69);
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

    it('#automaticSave() should save an item with the width equal to svgState.width', () => {
        store.setDrawWidth(200);
        store.automaticSave();
        drawingJSONString = localStorage.getItem('Drawing');
        if (drawingJSONString) {
            drawingJSON = JSON.parse(drawingJSONString);
        }
        expect(drawingJSON.width).toEqual(200);
    });

    it('#automaticSave() should save an item with the height equal to svgState.height', () => {
        store.setDrawHeight(300);
        store.automaticSave();
        drawingJSONString = localStorage.getItem('Drawing');
        if (drawingJSONString) {
            drawingJSON = JSON.parse(drawingJSONString);
        }
        expect(drawingJSON.height).toEqual(300);
    });

    it('#automaticSave() should save an item with the canvasColor equal to colorState.canvasColor.rbga()', () => {
        const color = new Color(1, 2, 3, 4);
        store.setCanvasColor(color);
        store.automaticSave();
        drawingJSONString = localStorage.getItem('Drawing');
        if (drawingJSONString) {
            drawingJSON = JSON.parse(drawingJSONString);
        }
        expect(drawingJSON.canvasColor).toEqual(color.rgba());
    });

    it('#automaticSave() should save an item with the svgsHTML equal to the outerHTML of the values in svgState.svgs', () => {
        const svgsHTML = [rect.outerHTML, circle.outerHTML];
        store.setSvgArray([rect, circle]);
        store.automaticSave();
        drawingJSONString = localStorage.getItem('Drawing');
        if (drawingJSONString) {
            drawingJSON = JSON.parse(drawingJSONString);
        }
        expect(drawingJSON.svgsHTML).toEqual(svgsHTML);
    });
});
