import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreateDrawingComponent } from '../../dialogs/create-drawing-dialog/create-drawing.component';
import { SaveDrawingComponent } from '../../dialogs/save-drawing/save-drawing.component';
import { MatDialog } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { DrawingStartedDialogComponent } from '../../dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from '../../dialogs/export-drawing/export-drawing.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    private isShowDrawOptions = false;
    private isShowFormOptions = false;
    private isShowToolOptions = false;
    private isShowEditOptions = false;
    private isShowSettingOptions = false;
    private state:DrawState;
    @Input('tool') tool: string;

    @Output() toolChange = new EventEmitter();
    constructor(private dialog: MatDialog, private store:DrawStore) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    changeTool(tool: String, isPanelOpen: boolean) {
        this.toolChange.emit(tool);
    }

    ngOnInit() {}

    toogleDrawOptions(): void {
        this.isShowDrawOptions = !this.isShowDrawOptions;
    }
    toggleFormOptions(): void {
        this.isShowFormOptions = !this.isShowFormOptions;
    }
    toggleToolOptions(): void {
        this.isShowToolOptions = !this.isShowToolOptions;
    }
    toggleEditOptions(): void {
        this.isShowEditOptions = !this.isShowEditOptions;
    }
    toggleSettingOptions(): void {
        this.isShowSettingOptions = !this.isShowSettingOptions;
    }
    openCreateDrawing(): void {
        this.state.canvasState.shapes.length > 0 ? this.dialog.open(DrawingStartedDialogComponent) : this.dialog.open(CreateDrawingComponent);
    }
    openSaveDrawing(): void {
        this.dialog.open(SaveDrawingComponent)
    }
    
    openExportDrawing(): void {
        this.dialog.open(ExportDrawingComponent)
    }
}
