import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

    @Output() toolChange = new EventEmitter();
    constructor() {}

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

    toogleSettingOptions(): void {
        this.isShowSettingOptions = !this.isShowSettingOptions;
    }
}
