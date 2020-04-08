import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Tools } from 'src/app/models/enums';
//import { CreateDrawingComponent } from '../../dialogs/create-drawing-dialog/create-drawing.component';
import { DrawingGalleryComponent } from '../../dialogs/drawing-gallery/drawing-gallery.component';
//import { DrawingStartedDialogComponent } from '../../dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from '../../dialogs/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '../../dialogs/save-drawing/save-drawing.component';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    private isShowDrawOptions: boolean;
    private isShowFormOptions: boolean;
    private isShowToolOptions: boolean;
    private isShowEditOptions: boolean;
    private isShowSettingOptions: boolean;
    @Input('tool') tool: Tools;
    @Input('isStartedDrawing') isStartedDrawing: boolean;

    @Input('isDisplayGrid') isDisplayGrid: boolean;
    @Output() toolChange: EventEmitter<unknown>;
    @Output() toggleGrid: EventEmitter<unknown>;

    // Undo-Redo
    @Output() undo: EventEmitter<unknown>;
    @Output() redo: EventEmitter<unknown>;
    @Input('canUndo') canUndo: boolean;
    @Input('canRedo') canRedo: boolean;

    //clipboard
    @Input('isSelection') isSelection: boolean;
    @Input('clipboard') clipboard: SVGGraphicsElement[];
    @Output() copy: EventEmitter<void>;
    @Output() cut: EventEmitter<void>;
    @Output() paste: EventEmitter<void>;
    @Output() duplicate: EventEmitter<void>;
    @Output() delete: EventEmitter<void>;

    constructor(private dialog: MatDialog) {
        this.isShowDrawOptions = false;
        this.isShowFormOptions = false;
        this.isShowToolOptions = false;
        this.isShowEditOptions = false;
        this.isShowSettingOptions = false;

        this.toolChange = new EventEmitter();
        this.toggleGrid = new EventEmitter();
        this.undo = new EventEmitter();
        this.redo = new EventEmitter();
        this.copy = new EventEmitter();
        this.cut = new EventEmitter();
        this.paste = new EventEmitter();
        this.duplicate = new EventEmitter();
        this.delete = new EventEmitter();
    }

    changeTool(tool: Tools): void {
        this.toolChange.emit(tool);
    }

    displayGridChange(): void {
        this.toggleGrid.emit();
    }

    triggerUndo(): void {
        this.undo.emit();
    }

    triggerRedo(): void {
        this.redo.emit();
    }
    triggerCut(): void {
        this.cut.emit();
    }
    triggerCopy(): void {
        this.copy.emit();
    }
    triggerPaste(): void {
        this.paste.emit();
    }
    triggerDuplicate(): void {
        this.duplicate.emit();
    }
    triggerDelete(): void {
        this.delete.emit();
    }

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
        this.continueDrawingService.loadSavedDrawing();
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
