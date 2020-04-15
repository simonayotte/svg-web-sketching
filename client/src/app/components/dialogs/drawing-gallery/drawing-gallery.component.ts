import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpResponseDialogComponent } from 'src/app/components/dialogs/http-response-dialog/http-response-dialog.component';
import { FormValuesName, GalleryButtonColors } from 'src/app/models/enums';
import { HttpResponse } from 'src/app/models/http-response';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { HttpResponseService } from 'src/app/services/http-response/http-response.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { SavedDrawing } from '../../../models/saved-drawing';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';
import { GalleryState } from './gallery-state';

@Component({
    selector: 'app-drawing-gallery',
    templateUrl: './drawing-gallery.component.html',
    styleUrls: ['./drawing-gallery.component.scss'],
})
export class DrawingGalleryComponent implements OnInit {
    private state: DrawState;
    galleryState: GalleryState;
    filterDrawingForm: FormGroup;
    constructor(
        public dialog: MatDialog,
        private httpService: HttpService,
        private store: DrawStore,
        private fb: FormBuilder,
        private galleryService: GalleryService,
        public dialogRef: MatDialogRef<DrawingGalleryComponent>,
        private httpResponseService: HttpResponseService
        ) {
        this.galleryState = new GalleryState();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.galleryService.drawingsObs.subscribe((value: SavedDrawing[]) => {
            this.galleryState.drawingsToShow = value;
        });
        this.filterDrawingForm = this.fb.group({
            tags: this.fb.array([]),
        });
    }

    async ngOnInit(): Promise<void> {
        this.store.setIsKeyHandlerActive(false);
        this.updateGallery();
    }

    ngOnDestroy(): void {
        this.store.setIsKeyHandlerActive(true);
    }

    get tags(): FormArray {
      return this.filterDrawingForm.get(FormValuesName.Tags) as FormArray;
    }

    addTag(): void {
        this.tags.push(this.fb.control(''));
    }

    removeTag(index: number): void {
        this.tags.removeAt(index);
        this.filterDrawings();
    }

    getTagsValues(): void {
        this.galleryState.tagStringArray = [];
        for (let i = 0; i < this.tags.length; i++) {
            this.galleryState.tagStringArray.push(this.tags.at(i).value);
        }
    }

    async updateGallery(): Promise<void> {
      this.galleryState.loading = true;
      return this.httpService.getAllDrawings()
      .toPromise()
      .then((data: SavedDrawing[]) => {
          this.galleryService.setDrawings(data);
          this.galleryState.allDrawingsInDb = data;
          this.galleryState.loading = false;
        })
      .catch(() => {
          this.galleryState.loading = false;
        });
      }

    toggleTrashColor(): void {
        this.galleryState.trashColor === GalleryButtonColors.White ?
        (this.galleryState.trashColor = GalleryButtonColors.Orange) :
        (this.galleryState.trashColor = GalleryButtonColors.White);
        this.galleryState.loadColor = GalleryButtonColors.White;
    }

    toggleLoadColor(): void {
        this.galleryState.loadColor === GalleryButtonColors.White ?
        (this.galleryState.loadColor = GalleryButtonColors.Orange) :
        (this.galleryState.loadColor = GalleryButtonColors.White);
        this.galleryState.trashColor = GalleryButtonColors.White;
    }

    loadDrawing(drawing: SavedDrawing): void {
        if (this.galleryState.loadColor === GalleryButtonColors.Orange) {
            if (this.state.svgState.svgs.length > 0) {
                this.galleryService.setDrawingToLoad(drawing);
                this.galleryService.setDidGalleryOpen(true);
                this.dialogRef.close();
                this.dialog.open(DrawingStartedDialogComponent);
            } else {
                this.galleryService.loadDrawing(drawing);
                this.dialogRef.close();
            }
        }
        this.store.automaticSave();
    }

    async deleteDrawing(drawing: SavedDrawing): Promise<void> {
      if (this.galleryState.trashColor === GalleryButtonColors.Orange) {
        this.galleryState.loading = true;
        return this.httpService.deleteDrawing(drawing._id)
        .toPromise()
        .then((data: HttpResponse) => {
          this.updateGallery();
          this.httpResponseService.setMessage(data.message);
          this.dialog.open(HttpResponseDialogComponent);
        })
        .catch((err: HttpResponse) => {
          this.updateGallery();
          this.httpResponseService.setMessage(err.message);
          this.dialog.open(HttpResponseDialogComponent);
        });
      }
    }

    filterDrawings(): void {
        this.getTagsValues();
        if (this.galleryState.tagStringArray.length > 0 && !this.galleryState.tagStringArray.includes('')) {
            const filteredDrawings: SavedDrawing[] = this.galleryService.filterDrawings(this.galleryState.tagStringArray,
                                                     this.galleryState.allDrawingsInDb);
            filteredDrawings.length === 0 ?
            this.galleryState.noFilteredDrawingFound = true :
            this.galleryState.noFilteredDrawingFound = false;
        } else {
            this.galleryService.setDrawings(this.galleryState.allDrawingsInDb);
            this.galleryState.noFilteredDrawingFound = false;
        }
    }
}
