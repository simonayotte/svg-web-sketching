import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Tools } from 'src/app/models/enums';
import { CreateDrawingComponent } from '../../dialogs/create-drawing-dialog/create-drawing.component';
import { DrawingGalleryComponent } from '../../dialogs/drawing-gallery/drawing-gallery.component';
import { DrawingStartedDialogComponent } from '../../dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from '../../dialogs/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '../../dialogs/save-drawing/save-drawing.component';

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
    @Input('tool') tool: Tools;
    @Input('isStartedDrawing') isStartedDrawing: boolean;

    @Input('isDisplayGrid') isDisplayGrid: boolean;
    @Output() toolChange = new EventEmitter();
    @Output() toggleGrid = new EventEmitter();

    // Undo-Redo
    @Output() undo = new EventEmitter();
    @Output() redo = new EventEmitter();
    @Input('canUndo') canUndo: boolean;
    @Input('canRedo') canRedo: boolean;

    constructor(private dialog: MatDialog) {}

    changeTool(tool: Tools) {
        this.toolChange.emit(tool);
    }

    displayGridChange() {
        this.toggleGrid.emit();
    }

    triggerUndo() {
        this.undo.emit();
    }

    triggerRedo() {
        this.redo.emit();
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
        this.isStartedDrawing ? this.dialog.open(DrawingStartedDialogComponent) : this.dialog.open(CreateDrawingComponent);
    }
    openSaveDrawing(): void {
        this.dialog.open(SaveDrawingComponent);
    }

    openExportDrawing(): void {
        this.dialog.open(ExportDrawingComponent);
    }

    openGallery(): void {
        this.dialog.open(DrawingGalleryComponent);
    }
}
