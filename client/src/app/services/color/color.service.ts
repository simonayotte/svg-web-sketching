import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    constructor() {}

    private firstColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000000');
    firstColorObs: Observable<string> = this.firstColor.asObservable();

    setFirstColor(firstColor: string): void {
        this.firstColor.next(firstColor);
        this.firstColorWithOpacity.next(firstColor + this.firstColorOpacity.value);
    }

    private firstColorOpacity: BehaviorSubject<string> = new BehaviorSubject<string>('ff');
    firstColorOpacityObs: Observable<string> = this.firstColorOpacity.asObservable();

    setFirstColorOpacity(firstColorOpacity: string): void {
        this.firstColorOpacity.next(firstColorOpacity);
        this.firstColorWithOpacity.next(this.firstColor.value + firstColorOpacity);
    }

    private secondColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffff');
    secondColorObs: Observable<string> = this.secondColor.asObservable();

    setSecondColor(secondColor: string): void {
        this.secondColor.next(secondColor);
        this.secondColorWithOpacity.next(secondColor + this.secondColorOpacity.value);
    }

    private secondColorOpacity: BehaviorSubject<string> = new BehaviorSubject<string>('ff');
    secondColorOpacityObs: Observable<string> = this.secondColorOpacity.asObservable();

    setSecondColorOpacity(secondColorOpacity: string): void {
        this.secondColorOpacity.next(secondColorOpacity);
        this.secondColorWithOpacity.next(this.secondColor.value + secondColorOpacity);
    }

    private firstColorWithOpacity: BehaviorSubject<string> = new BehaviorSubject<string>('#000000ff');
    firstColorWithOpacityObs: Observable<string> = this.firstColorWithOpacity.asObservable();

    private secondColorWithOpacity: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    secondColorWithOpacityObs: Observable<string> = this.secondColorWithOpacity.asObservable();

    private canvasColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffff');
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
}
