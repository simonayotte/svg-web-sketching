import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawStateService {
    constructor() {}

    private canvasRef: BehaviorSubject<ElementRef | null> = new BehaviorSubject<ElementRef | null>(null);
    canvasRefObs: Observable<ElementRef | null> = this.canvasRef.asObservable();

    private isDrawingStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isDrawingStartedObs: Observable<boolean> = this.isDrawingStarted.asObservable();

    setCanvasRef(canvasRef: ElementRef) {
        this.canvasRef.next(canvasRef);
    }

    setIsDrawingStarted(isDrawingStarted:boolean){
        this.isDrawingStarted.next(isDrawingStarted);
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
