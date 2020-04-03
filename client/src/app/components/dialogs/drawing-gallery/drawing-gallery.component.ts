import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { SavedDrawing } from '../../../models/saved-drawing';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';

const TAGS_STRING = 'tags';

@Component({
  selector: 'app-drawing-gallery',
  templateUrl: './drawing-gallery.component.html',
  styleUrls: ['./drawing-gallery.component.scss']
})
export class DrawingGalleryComponent implements OnInit {
  private state: DrawState;
  drawingsToShow: SavedDrawing[] = [];
  allDrawingsInDb: SavedDrawing[] = [];
  tagStringArray: string[] = [];
  trashColor = 'black';
  loadColor = 'black';
  noFilteredDrawingFound = false;
  loading = false;
  constructor(public dialog: MatDialog, private httpService: HttpService, private store: DrawStore, private fb: FormBuilder, private galleryService: GalleryService, public dialogRef: MatDialogRef<DrawingGalleryComponent>) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
    });
    this.galleryService.drawingsObs.subscribe((value: SavedDrawing[]) => {
      this.drawingsToShow = value;
    });
  }

   get tags() { return this.filterDrawingForm.get(TAGS_STRING) as FormArray; }
  

  filterDrawingForm = this.fb.group({
    tags : this.fb.array([])
   });

  async ngOnInit() {
    this.store.setIsKeyHandlerActive(false);
    this.updateGallery();
  }

  ngOnDestroy() {
    this.store.setIsKeyHandlerActive(true);
  }

  addTag(): void {
      this.tags.push(this.fb.control(''));
  }

  removeTag(index: number): void {
      this.tags.removeAt(index);
      this.filterDrawings();
  }

  getTagsValues(): void {
    this.tagStringArray = [];
    for (let i = 0; i < this.tags.length; i++) {
      this.tagStringArray.push(this.tags.at(i).value);
    }
  }

  async updateGallery() {
    this.loading = true;
    this.httpService.getAllDrawings().toPromise().then((data) => {
      this.galleryService.setDrawings(data);
      this.allDrawingsInDb = data;
      this.loading = false;
    })
    .catch((err) => {
    alert(err.message),
    this.loading = false;
    });
  }

  toggleTrashColor() {
    this.trashColor == 'black' ? (this.trashColor = '#ff8c00')
                        : (this.trashColor = 'black');
    this.loadColor = 'black';
  }

  toggleLoadColor() {
    this.loadColor == 'black' ? (this.loadColor = '#ff8c00')
                        : (this.loadColor = 'black');
    this.trashColor = 'black';
  }

  loadDrawing(drawing: SavedDrawing) {
    if (this.loadColor == '#ff8c00') {
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
  }

  async deleteDrawing(drawing: SavedDrawing) {
    if (this.trashColor == '#ff8c00') {
      this.loading = true;
      this.httpService.deleteDrawing(drawing._id).toPromise().then((data) => {
        this.updateGallery();
        alert(data.message);
      })
      .catch((err) => {
      this.updateGallery();
      alert(err.message);
      });
    }
  }

  filterDrawings() {
    this.getTagsValues();
    if (this.tagStringArray.length > 0 && !this.tagStringArray.includes('')) {
      const filteredDrawings: SavedDrawing[] = this.galleryService.filterDrawings(this.tagStringArray, this.allDrawingsInDb);
      filteredDrawings.length == 0 ? this.noFilteredDrawingFound = true : this.noFilteredDrawingFound = false;
    } else {
      this.galleryService.setDrawings(this.allDrawingsInDb);
      this.noFilteredDrawingFound = false;
    }
  }
}
