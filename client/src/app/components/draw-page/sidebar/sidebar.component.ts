import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreateDrawingComponent } from '../../dialogs/create-drawing-dialog/create-drawing.component';
import { SaveDrawingComponent } from '../../dialogs/save-drawing/save-drawing.component';
import { MatDialog } from '@angular/material';
import { DrawingStartedDialogComponent } from '../../dialogs/drawing-started-dialog/drawing-started-dialog.component';

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
    @Input('tool') tool: string;
    @Input('isStartedDrawing') isStartedDrawing: boolean;

    @Input('isDisplayGrid') isDisplayGrid: boolean;
    @Output() toolChange = new EventEmitter();
    @Output() toggleGrid = new EventEmitter();

    constructor(private dialog: MatDialog) {}

    changeTool(tool: String) {
        this.toolChange.emit(tool);
    }

    displayGridChange() {
        this.toggleGrid.emit();
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
}
