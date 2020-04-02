import { Injectable, Injector } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
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
import { PencilService } from '../tools/pencil/pencil.service';
import { LineService } from '../tools/line/line.service';
import { SelectionService } from '../tools/selection/selection.service';
import { Tools, ToolButtons } from 'src/app/models/enums';
import { EraserService } from '../tools/eraser/eraser.service';
import { AerosolService } from './../tools/aerosol/aerosol.service';
import { ApplicatorService } from '../tools/applicator/applicator.service';

@Injectable({
    providedIn: 'root',
})
export class DrawHandlerService {
    state: DrawState;
    keyMap: Map<ToolButtons, Tools> = new Map();
    servicesMap: Map<Tools, Tool> = new Map();

    constructor(public injector: Injector, public store: DrawStore, public matDialog: MatDialog) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.servicesMap.set(Tools.Pencil, injector.get(PencilService));
        this.servicesMap.set(Tools.Brush, injector.get(BrushService));
        this.servicesMap.set(Tools.Rectangle, injector.get(RectangleService));
        this.servicesMap.set(Tools.Line, injector.get(LineService));
        this.servicesMap.set(Tools.Polygon, injector.get(PolygonService));
        this.servicesMap.set(Tools.Ellipsis, injector.get(EllipsisService));
        this.servicesMap.set(Tools.Pipette, injector.get(PipetteService));
        this.servicesMap.set(Tools.Selection, injector.get(SelectionService));
        this.servicesMap.set(Tools.Eraser, injector.get(EraserService));
        this.servicesMap.set(Tools.Aerosol, injector.get(AerosolService));
        this.servicesMap.set(Tools.Applicator, injector.get(ApplicatorService));

        this.keyMap.set(ToolButtons.One, Tools.Rectangle);
        this.keyMap.set(ToolButtons.C, Tools.Pencil);
        this.keyMap.set(ToolButtons.W, Tools.Brush);
        this.keyMap.set(ToolButtons.L, Tools.Line);
        this.keyMap.set(ToolButtons.Three, Tools.Polygon);
        this.keyMap.set(ToolButtons.Two, Tools.Ellipsis);
        this.keyMap.set(ToolButtons.T, Tools.Pipette);
        this.keyMap.set(ToolButtons.S, Tools.Selection);
        this.keyMap.set(ToolButtons.E, Tools.Eraser);
        this.keyMap.set(ToolButtons.A, Tools.Aerosol);
        this.keyMap.set(ToolButtons.R, Tools.Applicator);
    }

    startTool(event: MouseEvent) {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            service.start(event);
        }
        //TODO: Call fonction pour reset undo
    }

    stopTool() {
        if (this.servicesMap.has(this.state.globalState.tool)) {
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            service.stop();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        const key = event.key;
        if (this.state.globalState.isKeyHandlerActive) {
            const keyEnum = <ToolButtons>key;
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            //handle tool keyboard events
            if (service) {
                service.handleKeyDown(key);
            }
            //handle tool selection keyboard events
            if (this.keyMap.has(keyEnum) && !event.ctrlKey) {
                const tool = <Tools>this.keyMap.get(keyEnum);
                this.store.setTool(tool);
            } else if (event.ctrlKey) {
                switch (key) {
                    case 'o':
                        //mat dialog display
                        event.preventDefault();
                        this.state.svgState.svgs.length > 0
                            ? this.matDialog.open(DrawingStartedDialogComponent)
                            : this.matDialog.open(CreateDrawingComponent);
                        break;

                    case 's':
                        event.preventDefault();
                        event.stopPropagation();
                        this.matDialog.open(SaveDrawingComponent);
                        break;

                    case 'e':
                        event.preventDefault();
                        this.matDialog.open(ExportDrawingComponent);
                        break;

                    case 'g':
                        event.preventDefault();
                        this.matDialog.open(DrawingGalleryComponent);
                        break;

                    case 'z':
                        this.store.undo();
                        break;
                    case 'Z':
                        this.store.redo();
                        break;
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

    onMouseMove(event: MouseEvent) {
        this.store.setMousePosition(event.offsetX - this.state.eraserThickness / 2, event.offsetY - this.state.eraserThickness / 2);
        if (this.state.globalState.tool === Tools.Eraser) {
            const service = this.servicesMap.get(this.state.globalState.tool) as EraserService;
            service.move(event.offsetX, event.offsetY);
        }
    }
}
