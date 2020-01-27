import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawStateService {
    constructor() {}

    private canvasRef: BehaviorSubject<ElementRef | null> = new BehaviorSubject<ElementRef | null>(null);
    canvasRefObs: Observable<ElementRef | null> = this.canvasRef.asObservable();

    setCanvasRef(canvasRef: ElementRef) {
        this.canvasRef.next(canvasRef);
    }

    private canvasContext: BehaviorSubject<CanvasRenderingContext2D | null> = new BehaviorSubject<CanvasRenderingContext2D | null>(null);
    canvasContextObs: Observable<CanvasRenderingContext2D | null> = this.canvasContext.asObservable();

    setCanvasContext(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext.next(canvasContext);
    }

    private isPanelOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isPanelOpenObs: Observable<boolean> = this.isPanelOpen.asObservable();

    setIsPanelOpen(isPanelOpen: boolean): void {
        this.isPanelOpen.next(isPanelOpen);
    }

    private canvasColor: BehaviorSubject<string> = new BehaviorSubject<string>('#ffffff');
    canvasColorObs: Observable<string> = this.canvasColor.asObservable();

    setCanvasColor(canvasColor: string): void {
        this.canvasColor.next(canvasColor);
    }

    private currentColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000000');
    currentColorObs: Observable<string> = this.currentColor.asObservable();

    setCurrentColor(currentColor: string): void {
        this.currentColor.next(currentColor);
    }

    private canvasWidth: BehaviorSubject<number> = new BehaviorSubject<number>(750);
    canvasWidthObs: Observable<number> = this.canvasWidth.asObservable();

    setCanvasWidth(canvasWidth: number): void {
        this.canvasWidth.next(canvasWidth);
    }

    private canvasHeight: BehaviorSubject<number> = new BehaviorSubject<number>(500);
    canvasHeightObs: Observable<number> = this.canvasHeight.asObservable();

    setCanvasHeight(canvasHeight: number): void {
        this.canvasHeight.next(canvasHeight);
    }
}
