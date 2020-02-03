import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService) {
        this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => {
            this.isPanelOpen = isPanelOpen;
        });

        this.drawStateService.canvasColorObs.subscribe((canvasColor: string) => {
            this.canvasColor = canvasColor;
        });

        this.drawStateService.canvasWidthObs.subscribe((canvasWidth: number) => {
            this.canvasWidth = canvasWidth;
        });

        this.drawStateService.canvasHeightObs.subscribe((canvasHeight: number) => {
            this.canvasHeight = canvasHeight;
        });

        if (this.canvasColor == this.workspaceColor) {
            //if workspace default color and canvas are the same
            this.workspaceColor = '#00000095';
        }

        this.keyDownListener = this.keyDown.bind(this);
        window.addEventListener('keydown', this.keyDownListener);
    }

    @ViewChild('canvas', { static: true }) canvasRef: ElementRef;

    private isShowDrawOptions: boolean = false;
    private isShowFormOptions: boolean = false;
    private isShowToolOptions: boolean = false;
    private isShowEditOptions: boolean = false;
    private isShowSettingOptions: boolean = false;
    private canvasWidth: number;
    private canvasHeight: number;
    private canvasColor: string;

    private workspaceColor: string = '#00000080';
    private selectedOption: string;

    private isPanelOpen: boolean;

    private keyDownListener: EventListener;

    ngOnInit() {
        this.drawStateService.setCanvasRef(this.canvasRef);

        this.drawStateService.setCanvasContext(this.canvasRef.nativeElement.getContext('2d'));

        this.canvasRef.nativeElement.width = this.canvasWidth;
        this.canvasRef.nativeElement.height = this.canvasHeight;
        this.canvasRef.nativeElement.style.backgroundColor = this.canvasColor;
    }

    ngOnDestroy() {
        window.removeEventListener('keydown', this.keyDownListener);
    }

    selectOption(option: string, isPanelOpen: boolean): void {
        if (this.selectedOption == option && isPanelOpen) {
            this.drawStateService.setIsPanelOpen(this.isPanelOpen ? false : true);
            this.selectedOption = option;
            return;
        }
        this.drawStateService.setIsPanelOpen(isPanelOpen);
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

    keyDown(event: KeyboardEvent) {
        let key: string = event.key;

        switch (key) {
            case 'w':
                this.selectOption('Pinceau', true);
                break;
            case '1':
                this.selectOption('Rectangle', true);
                break;
        }
    }
}
