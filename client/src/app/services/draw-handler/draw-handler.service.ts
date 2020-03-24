import { Injectable, Injector } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
// import { LineService } from '../tools/line/line.service';
import { RectangleService } from '../tools/rectangle/rectangle.service';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component';
import { SaveDrawingComponent } from 'src/app/components/dialogs/save-drawing/save-drawing.component';
import { DrawingStartedDialogComponent } from 'src/app/components/dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from 'src/app/components/dialogs/export-drawing/export-drawing.component';
import { DrawingGalleryComponent } from 'src/app/components/dialogs/drawing-gallery/drawing-gallery.component';
import { EllipsisService } from 'src/app/services/tools/ellipsis/ellipsis.service';
import { PolygonService } from 'src/app/services/tools/polygon/polygon.service';
import { PipetteService } from 'src/app/services/tools/pipette/pipette.service';
import { BrushService } from '../tools/brush/brush.service';
//import { PencilService } from '../tools/pencil/pencil.service';

@Injectable({
    providedIn: 'root',
})
export class DrawHandlerService {
    state: DrawState;
    keyMap: Map<string, string> = new Map();
    servicesMap: Map<string, Tool> = new Map();

    constructor(public injector: Injector, public store: DrawStore, public matDialog: MatDialog) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        //this.servicesMap.set('Crayon', injector.get(PencilService));
        this.servicesMap.set('Pinceau', injector.get(BrushService));
        this.servicesMap.set('Rectangle', injector.get(RectangleService));
        //this.servicesMap.set('Ligne', injector.get(LineService));
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
        if (this.state.globalState.isKeyHandlerActive) {
            const key = event.key;

            //handle tool selection keyboard events
            if (this.keyMap.has(key)) {
                const tool = this.keyMap.get(key) as string;
                this.store.setTool(tool);
                return;
            }
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            //handle tool keyboard events
            if (service) {
                service.handleKeyDown(key);
            }

            if (this.keyMap.has(key) && !event.ctrlKey) {
                const tool = this.keyMap.get(key) as string;
                this.store.setTool(tool);
            } else {
                switch (key) {
                    case 'o':
                        if (event.ctrlKey) {
                            //mat dialog display
                            event.preventDefault();
                            event.stopPropagation();
                            this.state.svgState.svgs.length > 0
                                ? this.matDialog.open(DrawingStartedDialogComponent)
                                : this.matDialog.open(CreateDrawingComponent);
                            break;
                        }
                    case 's':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            event.stopPropagation();
                            this.matDialog.open(SaveDrawingComponent);
                            break;
                        }
                    case 'e':
                        if (event.ctrlKey){
                            event.preventDefault();
                            event.stopPropagation();
                            this.matDialog.open(ExportDrawingComponent);
                            break;
                        }
                    case 'g':
                        if (event.ctrlKey){
                            event.preventDefault();
                            event.stopPropagation();
                            this.matDialog.open(DrawingGalleryComponent);
                            break;
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
