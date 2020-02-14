import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { ColorService } from 'src/app/services/color/color.service';
import { MatDialog } from '@angular/material'
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component'
import { DrawingStartedDialogComponent} from '../drawing-started-dialog/drawing-started-dialog.component'
//import { ConsoleReporter } from 'jasmine';


@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private colorService: ColorService, private dialog:MatDialog
        ) {
        this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => {
            this.isPanelOpen = isPanelOpen;
        });
        
        this.drawStateService.isDrawingStartedObs.subscribe((isDrawingStarted: boolean) => {
            this.isDrawingStarted = isDrawingStarted;
        });
        this.colorService.isPanelColorWindowOpenObs.subscribe((isPanelColorWindowOpen: boolean) => {
            this.isPanelColorWindowOpen = isPanelColorWindowOpen;
        });

        this.colorService.canvasColorObs.subscribe((canvasColor: string) => {
            this.canvasColor = canvasColor;
        });

        this.drawStateService.canvasWidthObs.subscribe((canvasWidth: number) => {
            this.canvasWidth = canvasWidth;
        });

        this.drawStateService.canvasHeightObs.subscribe((canvasHeight: number) => {
            this.canvasHeight = canvasHeight;
        });

        this.colorService.firstColorObs.subscribe((color: string) => {
            this.firstColor = color;
        });
        this.colorService.secondColorObs.subscribe((color: string) => {
            this.secondColor = color;
        });
        this.keyDownListener = this.keyDown.bind(this);
        window.addEventListener('keydown', this.keyDownListener);
    }

    @ViewChild('canvas', { static: true }) canvasRef: ElementRef;

    private isShowDrawOptions: boolean = false;
    private isShowFormOptions: boolean = false;
    private isShowToolOptions: boolean = false;
    private isShowEditOptions: boolean = false;
    private isShowSettingOptions: boolean = false;
    private isDrawingStarted: boolean = false;
    private canvasWidth: number;
    private canvasHeight: number;

    public workspaceColor: string = '#00000080';
    public selectedOption: string;

    public firstColor: string;
    public secondColor: string;
    public canvasColor: string;

    public isPanelOpen: boolean;
    public isPanelColorWindowOpen: boolean;

    private keyDownListener: EventListener;

    ngOnInit() {
        this.drawStateService.setCanvasRef(this.canvasRef);
        this.drawStateService.setCanvasContext(this.canvasRef.nativeElement.getContext('2d'));

        this.canvasRef.nativeElement.width = this.canvasWidth;
        this.canvasRef.nativeElement.height = this.canvasHeight;
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

    keyDown(event: KeyboardEvent) {
        let key: string = event.key;
        if (!this.isPanelColorWindowOpen) {
            switch (key) {
                case '1':
                    this.selectOption('Rectangle', true);
                    break;
                case 'c':
                    this.selectOption('Crayon', true);
                    break;
                case 'w':
                    this.selectOption('Pinceau', true);
                    break;
                case 'o':
                    if (event.ctrlKey){
                        event.preventDefault();
                        event.stopPropagation();
                        this.openDialog();
                    }
            }
        }
    }

    openColorWindow(selectedColor: string): void {
        if (selectedColor == 'first' || selectedColor == 'second' || selectedColor == 'canvas') this.colorService.openPanelColorWindow(selectedColor);
    }

    swapColors(): void {
        let oldFirstColor: string = this.firstColor;
        this.colorService.setFirstColor(this.secondColor);
        this.colorService.setSecondColor(oldFirstColor);
    }
    openDialog(): void {
        let dialogRef = this.isDrawingStarted ? this.dialog.open(DrawingStartedDialogComponent) : this.dialog.open(CreateDrawingComponent);
        window.removeEventListener('keydown', this.keyDownListener);
        dialogRef.afterClosed().subscribe(result => {
            window.addEventListener('keydown',this.keyDownListener);
            })
    }  
}
