import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
    constructor(private colorService: ColorService) {}

    @ViewChild('square', { static: true }) squareRef: ElementRef;
    @ViewChild('bar', { static: true }) barRef: ElementRef;

    private selectedColor: string;

    private squareContext: CanvasRenderingContext2D;
    private barContext: CanvasRenderingContext2D;

    public colorRGBA: number[];
    public colorHex: string;

    private rgbHexRegExp: RegExp = new RegExp('^[A-Fa-f0-9]{6}$');

    private rgbaHexRegExp: RegExp = new RegExp('^#[A-Fa-f0-9]{8}$');

    public isRGBError: boolean = false;
    public isHexError: boolean = false;

    public usedColors: string[] = [];
    ngOnInit() {
        this.squareContext = this.squareRef.nativeElement.getContext('2d');
        this.barContext = this.barRef.nativeElement.getContext('2d');
        this.fillBar();
        this.colorService.selectedColorObs.subscribe((selectedColor: string) => {
            //get the right color
            this.selectedColor = selectedColor;
            if (this.selectedColor == 'first') {
                this.colorService.firstColorObs.subscribe((color: string) => {
                    this.colorRGBA = this.toRGBA(color);
                    this.colorHex = color.substring(1, color.length - 2);
                    this.fillSquare();
                });
            } else if (this.selectedColor == 'second') {
                this.colorService.secondColorObs.subscribe((color: string) => {
                    this.colorRGBA = this.toRGBA(color);
                    this.colorHex = color.substring(1, color.length - 2);
                    this.fillSquare();
                });
            } else if (this.selectedColor == 'canvas') {
                this.colorService.canvasColorObs.subscribe((color: string) => {
                    this.colorRGBA = this.toRGBA(color);
                    this.colorHex = color.substring(1, color.length - 2);
                    this.fillSquare();
                });
            }
        });

        this.colorService.usedColorsObs.subscribe((usedColors: string[]) => {
            this.usedColors = usedColors;
        });
    }

    setRGBWithHex(): void {
        if (this.rgbHexRegExp.test(this.colorHex)) {
            this.colorRGBA = [...this.toRGB(this.colorHex), this.colorRGBA[3]];
            this.fillSquare();
            this.isHexError = false;
        } else {
            this.isHexError = true;
        }
    }

    setHexWithRGB(index: number): void {
        if (this.colorRGBA[index] >= 0 && this.colorRGBA[index] <= 255) {
            this.colorHex = this.toHex(this.colorRGBA, false);
            this.fillSquare();
            this.isRGBError = false;
        } else {
            this.isRGBError = true;
        }
    }

    //convert rgba to hex
    toHex(rgba: number[], isWithOpacity: boolean): string {
        let redHex: string = Number(rgba[0]).toString(16);
        if (redHex.length < 2) redHex = '0' + redHex;

        let greenHex: string = Number(rgba[1]).toString(16);
        if (greenHex.length < 2) greenHex = '0' + greenHex;

        let blueHex: string = Number(rgba[2]).toString(16);
        if (blueHex.length < 2) blueHex = '0' + blueHex;

        let opacityHex: string = '';
        if (isWithOpacity) {
            opacityHex = Number(rgba[3]).toString(16);
            if (opacityHex.length < 2) opacityHex = '0' + opacityHex;
        }

        return redHex + greenHex + blueHex + opacityHex;
    }

    toRGB(hex: string): number[] {
        if (this.rgbHexRegExp.test(hex)) {
            let r: number = parseInt(hex.slice(0, 2), 16);
            let g: number = parseInt(hex.slice(2, 4), 16);
            let b: number = parseInt(hex.slice(4, 6), 16);
            return [r, g, b];
        }
        return [0, 0, 0];
    }

    toRGBA(hex: string): number[] {
        if (this.rgbaHexRegExp.test(hex)) {
            let r: number = parseInt(hex.slice(1, 3), 16);
            let g: number = parseInt(hex.slice(3, 5), 16);
            let b: number = parseInt(hex.slice(5, 7), 16);
            let a: number = parseInt(hex.slice(7, 9), 16);

            return [r, g, b, a];
        }
        return [0, 0, 0, 1];
    }

    fillSquare(): void {
        const width: number = this.squareRef.nativeElement.width;
        const height: number = this.squareRef.nativeElement.height;
        this.squareContext.fillStyle = '#' + this.colorHex;
        this.squareContext.fillRect(0, 0, width, height);

        let whiteGradient: CanvasGradient = this.squareContext.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, 'rgba(255,255,255,1');
        whiteGradient.addColorStop(1, 'rgba(255,255,255,0');
        this.squareContext.fillStyle = whiteGradient;
        this.squareContext.fillRect(0, 0, width, height);

        let blackGradient: CanvasGradient = this.squareContext.createLinearGradient(0, 0, 0, height);
        blackGradient.addColorStop(0, 'rgba(0,0,0,0');
        blackGradient.addColorStop(1, 'rgba(0,0,0,1');
        this.squareContext.fillStyle = blackGradient;
        this.squareContext.fillRect(0, 0, width, height);
    }
    fillBar(): void {
        const width: number = this.barRef.nativeElement.width;
        const height: number = this.barRef.nativeElement.height;

        let colorGradient: CanvasGradient = this.barContext.createLinearGradient(0, 0, 0, height);
        colorGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        colorGradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        colorGradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        colorGradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        colorGradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        colorGradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        colorGradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.barContext.fillStyle = colorGradient;
        this.barContext.fillRect(0, 0, width, height);
    }

    setSquareColor($event: MouseEvent): void {
        let pixel: Uint8ClampedArray = this.barContext.getImageData($event.offsetX, $event.offsetY, 1, 1).data;
        this.colorRGBA = [...pixel];
        this.colorHex = this.toHex(this.colorRGBA, false);
        this.fillSquare();
    }

    setColor($event: MouseEvent): void {
        let pixel: Uint8ClampedArray = this.squareContext.getImageData($event.offsetX, $event.offsetY, 1, 1).data;
        this.colorRGBA = [...pixel];
        this.colorHex = this.toHex(this.colorRGBA, false);
    }

    confirmColor(): void {
        let hex: string = '#' + this.toHex(this.colorRGBA, true);
        if (this.selectedColor == 'first') {
            this.colorService.setFirstColor(hex);
        } else if (this.selectedColor == 'second') {
            this.colorService.setSecondColor(hex);
        } else if (this.selectedColor == 'canvas') {
            this.colorService.setCanvasColor(hex);
        }
        this.colorService.closeColorWindow();
        this.colorService.addUsedColor(hex);
    }

    //Set first or second color after clicking on recently used color
    useColor($event: MouseEvent, color: string): void {
        if ($event.button == 0) this.colorService.setFirstColor(color);
        //left click
        else if ($event.button == 2) this.colorService.setSecondColor(color); //right click
    }

    closeColorWindow(): void {
        this.colorService.closeColorWindow();
    }
}
