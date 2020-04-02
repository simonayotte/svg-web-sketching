import { TestBed } from '@angular/core/testing';
import { DrawHandlerService } from './draw-handler.service';
import { DrawStore } from '../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { PencilService } from '../tools/pencil/pencil.service';
import { BrushService } from '../tools/brush/brush.service';
import { MatDialogModule } from '@angular/material';
import { Tools } from 'src/app/models/enums';
import { RectangleService } from '../tools/rectangle/rectangle.service';
import { EraserService } from '../tools/eraser/eraser.service';

describe('DrawHandlerService', () => {
    let service: DrawHandlerService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DrawHandlerService, DrawStore],
            imports: [MatDialogModule],
        });

        store = TestBed.get(DrawStore);
        store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(DrawHandlerService);
            service.state = value;
        });
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#startTool() should call function #start() of Pencil service if selected tool is Pencil', () => {
        service.state.globalState.tool = Tools.Pencil;
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        const pencilService = service.servicesMap.get(Tools.Pencil) as PencilService;

        const spy = spyOn(pencilService, 'start');

        service.startTool(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#stopTool() should call function #stop() of Brush service if selected tool is Brush', () => {
        service.state.globalState.tool = Tools.Brush;
        const brushService = service.servicesMap.get(Tools.Brush) as BrushService;

        const spy = spyOn(brushService, 'stop');

        service.stopTool();
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should call store #setTool if key pressed is valid', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });
        const spy = spyOn(store, 'setTool');
        service.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should not call store #setTool if key pressed is not valid', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'p',
        });
        const spy = spyOn(store, 'setTool');
        service.onKeyDown(event);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onKeyDown() should call function #handleKeyDown() of Pencil Service if selected tool is Pencil', () => {
        service.state.globalState.tool = Tools.Pencil;

        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });

        const spy = spyOn(service.servicesMap.get(Tools.Pencil) as PencilService, 'handleKeyDown');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });
    it('#onKeyDown() should not call store  #setTool() if key pressed is valid and #isKeyHandlerActive is false', () => {
        service.state.globalState.tool = Tools.Pencil;
        service.state.globalState.isKeyHandlerActive = false;
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'any',
        });

        const spy = spyOn(store, 'setTool');
        service.onKeyDown(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onKeyDown() should not call function #handleKeyDown() of Pencil Service if selected tool is Crayon and #isKeyHandlerActive is false', () => {
        service.state.globalState.tool = Tools.Pencil;
        service.state.globalState.isKeyHandlerActive = false;
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'any',
        });

        const spy = spyOn(service.servicesMap.get(Tools.Pencil) as PencilService, 'handleKeyDown');
        service.onKeyDown(event);

        expect(spy).not.toHaveBeenCalled();
    });

    it('#onKeyDown() should call MatDialog #open() if key pressed is CTRL + o ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'o',
            ctrlKey: true,
        });

        const spy = spyOn(service.matDialog, 'open');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should call MatDialog #open() if key pressed is CTRL + o ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'o',
            ctrlKey: true,
        });

        const spy = spyOn(service.matDialog, 'open');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should call MatDialog #open() if key pressed is CTRL + s ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 's',
            ctrlKey: true,
        });

        const spy = spyOn(service.matDialog, 'open');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should call MatDialog #open() if key pressed is CTRL + e ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'e',
            ctrlKey: true,
        });

        const spy = spyOn(service.matDialog, 'open');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown() should call MatDialog #open() if key pressed is CTRL + g ', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'g',
            ctrlKey: true,
        });

        const spy = spyOn(service.matDialog, 'open');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyUp() should call function #handleKeyUp() of Rectangle Service if selected tool is Rectangle', () => {
        service.state.globalState.tool = Tools.Rectangle;

        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
        });

        const spy = spyOn(service.servicesMap.get(Tools.Rectangle) as RectangleService, 'handleKeyUp');
        service.onKeyUp(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onMouseMove() should call function #move() of Eraser Service if selected tool is Eraser', () => {
        service.state.globalState.tool = Tools.Eraser;

        const event: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 100,
        });

        const spy = spyOn(service.servicesMap.get(Tools.Eraser) as EraserService, 'move');
        service.onMouseMove(event);

        expect(spy).toHaveBeenCalled();
    });
});
