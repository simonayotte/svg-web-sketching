import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Color } from 'src/app/models/color';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
    private squareContext: CanvasRenderingContext2D;
    private barContext: CanvasRenderingContext2D;

    constructor() {}
    color: Color;

    @Input('color') colorInput: Color;
    @Input('lastColors') lastColors: (Color | null)[];

    @Output() closeColor = new EventEmitter();
    @Output() saveColor = new EventEmitter();
    @Output() setFirstColor = new EventEmitter();
    @Output() setSecondColor = new EventEmitter();

    @ViewChild('square', { static: true }) squareRef: ElementRef;
    @ViewChild('bar', { static: true }) barRef: ElementRef;

    ngOnInit() {
        this.squareContext = this.squareRef.nativeElement.getContext('2d');
        this.barContext = this.barRef.nativeElement.getContext('2d');
        this.color = new Color(this.colorInput.r, this.colorInput.g, this.colorInput.b, this.colorInput.a);

        this.fillSquare();
        this.fillBar();
    }

    onRGBChange(event: any, type: string) {
        const value: number = event.target.value;
        if (value < 0 || value == null) {
            event.target.value = 0;
        } else if (value > 255) {
            event.target.value = 255;
        }
        this.color.synchronizeHex(type);
        this.fillSquare();
    }

    onHexChange() {
        this.color.synchronizeRGB();
        this.fillSquare();
    }

    setColorWithSquare(event: MouseEvent) {
        const data: Uint8ClampedArray = this.squareContext.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        this.color.r = data[0];
        this.color.g = data[1];
        this.color.b = data[2];
        this.color.a = data[3];
        this.color.synchronizeHex();

        //this.colorChange.emit(); //and add last color
    }
    setColorWithBar(event: MouseEvent) {
        const data: Uint8ClampedArray = this.barContext.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        this.color.r = data[0];
        this.color.g = data[1];
        this.color.b = data[2];
        this.color.a = data[3];
        this.color.synchronizeHex();

        this.fillSquare();

        //this.colorChange.emit(); //and add last color
    }

    save() {
        this.saveColor.emit(this.color);
        this.close();
    }
    close() {
        this.closeColor.emit();
    }

    useColor(event: MouseEvent, color: Color) {
        if (event.button == 0) {
            this.setFirstColor.emit(color);
        } else if (event.button == 2) {
            this.setSecondColor.emit(color);
        }
    }
    fillSquare(): void {
        const width: number = this.squareRef.nativeElement.width;
        const height: number = this.squareRef.nativeElement.height;
        this.squareContext.fillStyle = '#' + this.color.colorHex();
        this.squareContext.fillRect(0, 0, width, height);

        const whiteGradient: CanvasGradient = this.squareContext.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, 'rgba(255,255,255,1');
        whiteGradient.addColorStop(1, 'rgba(255,255,255,0');
        this.squareContext.fillStyle = whiteGradient;
        this.squareContext.fillRect(0, 0, width, height);

        const blackGradient: CanvasGradient = this.squareContext.createLinearGradient(0, 0, 0, height);
        blackGradient.addColorStop(0, 'rgba(0,0,0,0');
        blackGradient.addColorStop(1, 'rgba(0,0,0,1');
        this.squareContext.fillStyle = blackGradient;
        this.squareContext.fillRect(0, 0, width, height);
    }
    fillBar(): void {
        const width: number = this.barRef.nativeElement.width;
        const height: number = this.barRef.nativeElement.height;

        const colorGradient: CanvasGradient = this.barContext.createLinearGradient(0, 0, 0, height);
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
}
