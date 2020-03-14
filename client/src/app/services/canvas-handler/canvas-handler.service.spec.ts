import { TestBed } from '@angular/core/testing';

import { CanvasHandlerService } from './canvas-handler.service';
import { DrawStore } from '../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { PencilService } from '../tools/pencil/pencil.service';
import { BrushService } from '../tools/brush/brush.service';
import { MatDialogModule } from '@angular/material';

describe('CanvasHandlerService', () => {
    let service: CanvasHandlerService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CanvasHandlerService, DrawStore],
            imports: [MatDialogModule],
        });

        store = TestBed.get(DrawStore);
        store.setCanvasHTML(document.createElement('canvas'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(CanvasHandlerService);
            service.state = value;
        });
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#startTool calls function start of Pencil service if selected tool is Crayon', () => {
        service.state.globalState.tool = 'Crayon';
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        const pencilService = service.servicesMap.get('Crayon') as PencilService;

        const spy = spyOn(pencilService, 'start');

        service.startTool(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#stopTool calls function stop of Brush service if selected tool is Brush', () => {
        service.state.globalState.tool = 'Pinceau';

        const brushService = service.servicesMap.get('Pinceau') as BrushService;

        const spy = spyOn(brushService, 'stop');

        service.stopTool();
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown calls function handleKeyDown of Pencil Service if selected tool is Crayon', () => {
        service.state.globalState.tool = 'Crayon';

        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'any',
        });

        const spy = spyOn(service.servicesMap.get('Crayon') as PencilService, 'handleKeyDown');
        service.onKeyDown(event);

        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown sets selected tool to Crayon if key pressed is c', (done: DoneFn) => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });
        service.onKeyDown(event);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.tool).toEqual('Crayon');
            done();
        });
    });

    it('#onKeyDown does not set selected tool if key pressed is not a tool selection key', (done: DoneFn) => {
        service.state.globalState.tool = 'Pinceau';

        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'x',
        });
        service.onKeyDown(event);

        store.stateObs.subscribe((value: DrawState) => {
            expect(value.globalState.tool).toEqual('Pinceau');
            done();
        });
    });
});
