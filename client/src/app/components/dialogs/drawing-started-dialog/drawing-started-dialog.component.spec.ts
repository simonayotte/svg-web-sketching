import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { DrawStore } from 'src/app/store/draw-store';
import { ColorComponent } from '../../tools/color/color.component';
import { CreateDrawingComponent } from '../create-drawing-dialog/create-drawing.component';
import { DrawingStartedDialogComponent } from './drawing-started-dialog.component';

describe('DrawingStartedDialogComponent', () => {
    let component: DrawingStartedDialogComponent;
    let fixture: ComponentFixture<DrawingStartedDialogComponent>;
    let store: DrawStore;
    let galleryService: GalleryService;
    const dialogMock = {
        open: () => {

        },
        close: () => {
            /*empty function*/
        },
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingStartedDialogComponent, ColorComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                OverlayModule,
                MatDialogModule,
                BrowserModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: MatDialogTitle, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
                {provide: MatDialog, useValue: dialogMock},
                { provide: MAT_DIALOG_DATA, useValue: [] },
                DrawStore,
                GalleryService,
            ],
        }).compileComponents();
        store = TestBed.get(DrawStore);
        store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingStartedDialogComponent);
        component = fixture.componentInstance;
        galleryService = TestBed.get(GalleryService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#continue should open the create drawing dialog if didGalleryOpen is false', () => {
        spyOn(component.dialog, 'open').and.callThrough();
        galleryService.setDidGalleryOpen(false);
        component.continue();
        expect(component.dialog.open).toHaveBeenCalledWith(CreateDrawingComponent);
    });

    it('continue should close the dialog', () => {
        spyOn(component.dialogRef, 'close').and.callThrough();
        component.continue();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('continue should call #setDidGalleryOpen of galleryService', () => {
        spyOn(galleryService, 'setDidGalleryOpen').and.callThrough();
        component.continue();
        expect(galleryService.setDidGalleryOpen).toHaveBeenCalledWith(false);
    });

    it('#continue should call #loadDrawing of galleryService if didGalleryOpen is true', () => {
        spyOn(galleryService, 'loadDrawing').and.callThrough();
        galleryService.setDidGalleryOpen(true);
        component.continue();
        expect(galleryService.loadDrawing).toHaveBeenCalledWith(component.drawingToLoad);
    });
});
