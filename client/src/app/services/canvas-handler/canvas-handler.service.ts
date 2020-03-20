import { AerosolService } from './../tools/aerosol/aerosol.service';
import { Injectable, Injector } from '@angular/core';
import { BrushService } from '../tools/brush/brush.service';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { LineService } from '../tools/line/line.service';
import { RectangleService } from '../tools/rectangle/rectangle.service';
import { PencilService } from '../tools/pencil/pencil.service';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component';
import { SaveDrawingComponent } from 'src/app/components/dialogs/save-drawing/save-drawing.component';
import { DrawingStartedDialogComponent } from 'src/app/components/dialogs/drawing-started-dialog/drawing-started-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class CanvasHandlerService {
    state: DrawState;
    private keyMap: Map<string, string> = new Map();

    constructor(public injector: Injector, public store: DrawStore, private matDialog: MatDialog) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.servicesMap.set('Crayon', injector.get(PencilService));
        this.servicesMap.set('Pinceau', injector.get(BrushService));
        this.servicesMap.set('Rectangle', injector.get(RectangleService));
        this.servicesMap.set('Ligne', injector.get(LineService));
        this.servicesMap.set('Aérosol', injector.get(AerosolService));
        this.keyMap.set('1', 'Rectangle');
        this.keyMap.set('c', 'Crayon');
        this.keyMap.set('w', 'Pinceau');
        this.keyMap.set('l', 'Ligne');
        this.keyMap.set('a', 'Aérosol');
    }

    private servicesMap: Map<string, Tool> = new Map();

    startTool(event: MouseEvent) {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            service.start(event);
        }
    }

    stopTool() {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            service.stop();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.state.globalState.isKeyHandlerActive){
            const key = event.key;

            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            if (service) {
                service.handleKeyDown(key);
            }

            if (this.keyMap.has(key)) {
                const tool = this.keyMap.get(key) as string;
                this.store.setTool(tool);
            } else {
                switch (key) {
                    case 'o':
                        if (event.ctrlKey) {
                            //mat dialog display
                            event.preventDefault();
                            event.stopPropagation();
                            this.state.canvasState.shapes.length > 0 ? this.matDialog.open(DrawingStartedDialogComponent) : this.matDialog.open(CreateDrawingComponent);
                        }
                        break;
                    case 's':
                        if (event.ctrlKey){
                            this.matDialog.open(SaveDrawingComponent);
                            event.preventDefault();
                            event.stopPropagation();
                        }
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        const key = event.key;
        const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
        if (service) {
            service.handleKeyUp(key);
        }
    }
}
