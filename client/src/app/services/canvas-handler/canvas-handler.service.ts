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
import { PolygonService } from '../tools/polygon/polygon.service';
import { EllipsisService } from 'src/app/services/tools/ellipsis/ellipsis.service';
import { PipetteService } from 'src/app/services/tools/pipette/pipette.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasHandlerService {
    state: DrawState;
    keyMap: Map<string, string> = new Map();
    servicesMap: Map<string, Tool<any>> = new Map();

    constructor(public injector: Injector, public store: DrawStore, private matDialog: MatDialog) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.servicesMap.set('Crayon', injector.get(PencilService));
        this.servicesMap.set('Pinceau', injector.get(BrushService));
        this.servicesMap.set('Rectangle', injector.get(RectangleService));
        this.servicesMap.set('Ligne', injector.get(LineService));
        this.servicesMap.set('Polygone', injector.get(PolygonService));
        this.servicesMap.set('Ellipse', injector.get(EllipsisService));
        this.servicesMap.set('Pipette', injector.get(PipetteService));

        this.keyMap.set('1', 'Rectangle');
        this.keyMap.set('c', 'Crayon');
        this.keyMap.set('w', 'Pinceau');
        this.keyMap.set('l', 'Ligne');
        this.keyMap.set('3', 'Polygone');
        this.keyMap.set('2', 'Ellipse');
        this.keyMap.set('t', 'Pipette');
    }

    startTool(event: MouseEvent) {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool<any> = this.servicesMap.get(this.state.globalState.tool) as Tool<any>;
            service.start(event);
        }
    }

    stopTool() {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool<any> = this.servicesMap.get(this.state.globalState.tool) as Tool<any>;
            service.stop();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.state.globalState.isKeyHandlerActive) {
            const key = event.key;

            const service: Tool<any> = this.servicesMap.get(this.state.globalState.tool) as Tool<any>;
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
                            this.state.canvasState.shapes.length > 0
                                ? this.matDialog.open(DrawingStartedDialogComponent)
                                : this.matDialog.open(CreateDrawingComponent);
                        }
                        break;
                    case 's':
                        if (event.ctrlKey) {
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
        const service: Tool<any> = this.servicesMap.get(this.state.globalState.tool) as Tool<any>;
        if (service) {
            service.handleKeyUp(key);
        }
    }
}
