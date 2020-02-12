import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    constructor() {}

    private firstColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000000ff');
    firstColorObs: Observable<string> = this.firstColor.asObservable();

    setFirstColor(firstColor: string): void {
        this.firstColor.next(firstColor);
    }

    private secondColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    secondColorObs: Observable<string> = this.secondColor.asObservable();

    setSecondColor(secondColor: string): void {
        this.secondColor.next(secondColor);
    }

    private canvasColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    canvasColorObs: Observable<string> = this.canvasColor.asObservable();

    setCanvasColor(canvasColor: string): void {
        this.canvasColor.next(canvasColor);
    }

    private usedColors: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(new Array(10));
    usedColorsObs: Observable<Array<string>> = this.usedColors.asObservable();

    private lastUsedColorIndex: number = 0;

    addUsedColor(color: string) {
        let temp = this.usedColors.value;
        temp[this.lastUsedColorIndex] = color;
        this.usedColors.next(temp);
        if (this.lastUsedColorIndex === this.usedColors.value.length - 1) this.lastUsedColorIndex = 0;
        else this.lastUsedColorIndex++;
    }

    private selectedColor: BehaviorSubject<string> = new BehaviorSubject<string>('');
    selectedColorObs: Observable<string> = this.selectedColor.asObservable();

    private isColorWindowOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isColorWindowOpenObs: Observable<boolean> = this.isColorWindowOpen.asObservable();

    openColorWindow(selectedColor: string): void {
        this.isColorWindowOpen.next(true);
        this.selectedColor.next(selectedColor);
    }

    closeColorWindow(): void {
        this.isColorWindowOpen.next(false);
        this.selectedColor.next('');
    }
}
