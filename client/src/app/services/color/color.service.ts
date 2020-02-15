import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private firstColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000000ff');
    firstColorObs: Observable<string> = this.firstColor.asObservable();

    private secondColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    secondColorObs: Observable<string> = this.secondColor.asObservable();

    private canvasColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    canvasColorObs: Observable<string> = this.canvasColor.asObservable();

    private selectedCanvasColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffffff');
    selectedCanvasColorObs: Observable<string> = this.selectedCanvasColor.asObservable();

    private usedColors: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(new Array(10));
    usedColorsObs: Observable<string[]> = this.usedColors.asObservable();

    private selectedColor: BehaviorSubject<string> = new BehaviorSubject<string>('');
    selectedColorObs: Observable<string> = this.selectedColor.asObservable();

    private isFormColorWindowOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isFormColorWindowOpenObs: Observable<boolean> = this.isFormColorWindowOpen.asObservable();

    private isPanelColorWindowOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isPanelColorWindowOpenObs: Observable<boolean> = this.isPanelColorWindowOpen.asObservable();

    private isFormSubmitted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isFormSubmittedObs: Observable<boolean> = this.isFormSubmitted.asObservable();

    lastUsedColorIndex = 0;

    setFirstColor(firstColor: string): void {
        this.firstColor.next(firstColor);
    }

    setSecondColor(secondColor: string): void {
        this.secondColor.next(secondColor);
    }

    setCanvasColor(canvasColor: string): void {
        this.canvasColor.next(canvasColor);
    }

    setSelectedCanvasColor(selectedCanvasColor: string): void {
        this.selectedCanvasColor.next(selectedCanvasColor);
    }

    addUsedColor(color: string) {
        const temp = this.usedColors.value;
        temp[this.lastUsedColorIndex] = color;
        this.usedColors.next(temp);

        this.lastUsedColorIndex = (this.lastUsedColorIndex + 1) % 10;
    }

    setIsFormSubmitted(isFormSubmitted: boolean) {
        this.isFormSubmitted.next(isFormSubmitted);
    }

    openFormColorWindow(selectedColor: string): void {
        this.isFormColorWindowOpen.next(true);
        this.selectedColor.next(selectedColor);
    }

    openPanelColorWindow(selectedColor: string): void {
        this.isPanelColorWindowOpen.next(true);
        this.selectedColor.next(selectedColor);
    }

    closeColorWindow(): void {
        this.isFormColorWindowOpen.next(!this.isFormColorWindowOpen);
        this.isPanelColorWindowOpen.next(!this.isPanelColorWindowOpen);
        this.selectedColor.next('');
    }
}
