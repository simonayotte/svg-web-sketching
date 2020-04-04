import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component';
import { DrawingGalleryComponent } from 'src/app/components/dialogs/drawing-gallery/drawing-gallery.component';
import { DrawingStartedDialogComponent } from 'src/app/components/dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from 'src/app/components/dialogs/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from 'src/app/components/dialogs/save-drawing/save-drawing.component';
import { OtherButtons, ToolButtons, Tools } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { EllipsisService } from 'src/app/services/tools/ellipsis/ellipsis.service';
import { PipetteService } from 'src/app/services/tools/pipette/pipette.service';
import { PolygonService } from 'src/app/services/tools/polygon/polygon.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { ApplicatorService } from '../tools/applicator/applicator.service';
import { BrushService } from '../tools/brush/brush.service';
import { EraserService } from '../tools/eraser/eraser.service';
import { LineService } from '../tools/line/line.service';
import { PencilService } from '../tools/pencil/pencil.service';
import { RectangleService } from '../tools/rectangle/rectangle.service';
import { SelectionService } from '../tools/selection/selection.service';
import { AerosolService } from './../tools/aerosol/aerosol.service';

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
            const keyEnum = key as ToolButtons;
            const service: Tool = this.servicesMap.get(this.state.globalState.tool) as Tool;
            // handle tool keyboard events
            if (service) {
                service.handleKeyDown(key);
            }
            // handle tool selection keyboard events
            if (this.keyMap.has(keyEnum) && !event.ctrlKey) {
                const tool = this.keyMap.get(keyEnum) as Tools;
                this.store.setTool(tool);
            } else if (event.ctrlKey) {
                switch (key) {
                    case OtherButtons.O:
                        // mat dialog display
                        event.preventDefault();
                        this.state.svgState.svgs.length > 0
                            ? this.matDialog.open(DrawingStartedDialogComponent)
                            : this.matDialog.open(CreateDrawingComponent);
                        break;
                    case OtherButtons.S:
                        event.preventDefault();
                        event.stopPropagation();
                        this.matDialog.open(SaveDrawingComponent);
                        break;

                    case OtherButtons.E:
                        event.preventDefault();
                        this.matDialog.open(ExportDrawingComponent);
                        break;

                    case OtherButtons.G:
                        event.preventDefault();
                        this.matDialog.open(DrawingGalleryComponent);
                        break;

                    case OtherButtons.Z:
                        this.store.undo();
                        break;
                    case OtherButtons.ShiftZ:
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
