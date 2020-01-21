import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit {
    constructor() {}

    isShowDrawOptions: boolean = false;
    isShowFormOptions: boolean = false;
    isShowToolOptions: boolean = false;
    isShowEditOptions: boolean = false;
    isShowSettingOptions: boolean = false;
    canvasWidth: number;
    canvasHeight: number;
    canvasColor: string;

    workspaceColor: string = '#00000080';
    selectedOption: string;

    displayPanel: boolean = false;

    ngOnInit() {
        //normally received from creation form
        this.canvasHeight = 500;
        this.canvasWidth = 500;
        this.canvasColor = '#cecece';

        if (this.canvasColor == this.workspaceColor) {
            //if workspace default color and canvas are the same
            this.workspaceColor = '#00000095';
        }
    }

    selectOption(option: string, displayPanel: boolean): void {
        if (this.selectedOption == option && displayPanel) {
            this.displayPanel = this.displayPanel ? false : true;
            this.selectedOption = option;
            return;
        }
        this.displayPanel = displayPanel;
        this.selectedOption = option;
    }

    toogleDrawOptions(): void {
        this.isShowDrawOptions = this.isShowDrawOptions ? false : true;
    }
    toggleFormOptions(): void {
        this.isShowFormOptions = this.isShowFormOptions ? false : true;
    }
    toggleToolOptions(): void {
        this.isShowToolOptions = this.isShowToolOptions ? false : true;
    }
    toggleEditOptions(): void {
        this.isShowEditOptions = this.isShowEditOptions ? false : true;
    }

    toogleSettingOptions(): void {
        this.isShowSettingOptions = this.isShowSettingOptions ? false : true;
    }
}
