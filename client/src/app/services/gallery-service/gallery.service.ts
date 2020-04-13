import { Injectable, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from 'src/app/models/color';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GalleryService {
    state: DrawState;

    constructor(private store: DrawStore, private drawingHandler: DrawingHandler, public rendererFactory: RendererFactory2, private continueDrawingService: ContinueDrawingService) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    private drawings: BehaviorSubject<SavedDrawing[]> = new BehaviorSubject<SavedDrawing[]>([]);
    drawingsObs: Observable<SavedDrawing[]> = this.drawings.asObservable();

    private drawingToLoad: BehaviorSubject<SavedDrawing> = new BehaviorSubject<SavedDrawing>(new SavedDrawing('', [], '', [], 0, 0, []));
    drawingToLoadObs: Observable<SavedDrawing> = this.drawingToLoad.asObservable();

    private didGalleryOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    didGalleryOpenObs: Observable<boolean> = this.didGalleryOpen.asObservable();

    setDrawings(value: SavedDrawing[]) {
        this.drawings.next(value);
    }

    setDrawingToLoad(value: SavedDrawing) {
        this.drawingToLoad.next(value);
    }

    setDidGalleryOpen(value: boolean) {
        this.didGalleryOpen.next(value);
    }

    loadDrawing(drawing: SavedDrawing) {
        this.continueDrawingService.setIsContinueDrawing(false);
        this.store.setDrawHeight(drawing.height);
        this.store.setDrawWidth(drawing.width);
        const canvasColor = new Color(drawing.RGBA[0], drawing.RGBA[1], drawing.RGBA[2], drawing.RGBA[3]);
        this.store.setCanvasColor(canvasColor);
        this.drawingHandler.clearCanvas();
        let svgArray:SVGGraphicsElement[] = this.drawingHandler.convertHtmlToSvgElement(drawing.svgsHTML);
        setTimeout(()=> this.store.setSvgArray(svgArray));
    }

    filterDrawings(tagStringArray: string[], allDrawingsInDb: SavedDrawing[]): SavedDrawing[] {
        const filteredDrawings: SavedDrawing[] = [];
        for (const drawing of allDrawingsInDb) {
            for (const tag of tagStringArray) {
                if (drawing.tags.includes(tag) && !filteredDrawings.includes(drawing)) {
                    filteredDrawings.push(drawing);
                }
            }
        }
        this.setDrawings(filteredDrawings);
        return filteredDrawings;
    }
}
