import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
    @ViewChild('firstColor', { static: true }) firstColorRef: ElementRef;
    @ViewChild('secondColor', { static: true }) secondColorRef: ElementRef;

    constructor(private colorService: ColorService) {
        this.colorService.usedColorsObs.subscribe(usedColors => (this.usedColors = usedColors));
    }

    ngOnInit() {
        let firstColorInput: HTMLInputElement | null = <HTMLInputElement>this.firstColorRef.nativeElement;
        let secondColorInput: HTMLInputElement | null = <HTMLInputElement>this.secondColorRef.nativeElement;

        this.colorService.firstColorObs.subscribe(firstColor => {
            if (firstColorInput) {
                this.firstColor = firstColor;
                firstColorInput.value = firstColor;
            }
        });
        this.colorService.secondColorObs.subscribe(secondColor => {
            if (secondColorInput) {
                this.secondColor = secondColor;
                secondColorInput.value = secondColor;
            }
        });
    }

    firstColor: string;
    firstColorOpacity: string;

    secondColor: string;
    secondColorOpacity: string;

    usedColors: Array<string>;

    toHex(alpha: number): string {
        let hex = Number(alpha).toString(16);
        if (hex.length < 2) hex = '0' + hex;

        return hex;
    }

    swapColors(): void {
        let tempColor = this.secondColor;

        this.colorService.setSecondColor(this.firstColor);
        this.colorService.setFirstColor(tempColor);
    }

    setFirstColor($event: Event): void {
        if ($event.target) {
            let color: string = (<HTMLInputElement>$event.target).value;
            this.colorService.setFirstColor(color);
            this.colorService.addUsedColor(color);
        }
    }

    setFirstColorOpacity($event: Event): void {
        if ($event.target) {
            let alpha: number = parseInt((<HTMLInputElement>$event.target).value);

            this.colorService.setFirstColorOpacity(this.toHex(alpha));
        }
    }

    setSecondColor($event: Event): void {
        if ($event.target) {
            let color: string = (<HTMLInputElement>$event.target).value;
            this.colorService.setSecondColor(color);
            this.colorService.addUsedColor(color);
        }
    }
    setSecondColorOpacity($event: Event): void {
        if ($event.target) {
            let alpha: number = parseInt((<HTMLInputElement>$event.target).value);

            this.colorService.setSecondColorOpacity(this.toHex(alpha));
        }
    }

    useColor($event: MouseEvent, color: string): void {
        if ($event.button === 0) {
            this.colorService.setFirstColor(color);
        } else if ($event.button === 2) {
            this.colorService.setSecondColor(color);
        }
    }
}
