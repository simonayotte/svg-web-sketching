import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { SavedDrawing } from '../../../models/saved-drawing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { FormArray, FormBuilder } from '@angular/forms';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';

const TAGS_STRING = 'tags'

@Component({
  selector: 'app-drawing-gallery',
  templateUrl: './drawing-gallery.component.html',
  styleUrls: ['./drawing-gallery.component.scss']
})
export class DrawingGalleryComponent implements OnInit {
  private state:DrawState
  public drawingsToShow: Array<SavedDrawing> = [];
  public allDrawingsInDb: Array<SavedDrawing> = [];
  public trashColor:string = 'black';
  public loadColor:string = 'black';
  public deleteActivated:boolean = false;
  public loadActivated:boolean = false;
  public noFilteredDrawingFound:boolean = false;
  public loading:boolean = false;
  public tagStringArray: Array<string> = [];
  constructor(public dialog: MatDialog, private httpService: HttpService, private store:DrawStore, private fb: FormBuilder, private galleryService: GalleryService, public dialogRef: MatDialogRef<DrawingGalleryComponent>) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
    })
    this.galleryService.drawingsObs.subscribe((value: Array<SavedDrawing>) => {
      this.drawingsToShow = value;
    })
  };

  async ngOnInit() {
    this.state.globalState.isKeyHandlerActive = false;
    this.updateGallery();
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }
  filterDrawingForm = this.fb.group({
    tags : this.fb.array([])
   })
  get tags() { return this.filterDrawingForm.get(TAGS_STRING) as FormArray;}
  
  addTag(): void {
      this.tags.push(this.fb.control(''));
  }

  removeTag(index:number): void {
      this.tags.removeAt(index);
      this.filterDrawings();
  }

  getTagsValues(): void{
    this.tagStringArray = [];
    for(let i = 0; i < this.tags.length; i++){
      this.tagStringArray.push(this.tags.at(i).value)
    }
  }

  async updateGallery(){
    this.loading=true;
    this.httpService.getAllDrawings().toPromise().then(data => {
      this.galleryService.setDrawings(data);
      this.allDrawingsInDb = data;
      this.loading=false;
    },
    err => {
    alert(err.message),
    this.loading=false;
    });
  }

  toggleTrashColor(){
    this.trashColor == 'black' ? (this.trashColor = 'red', this.deleteActivated=true)
                        : (this.trashColor = 'black', this.deleteActivated=false);
    this.loadActivated = false;
    this.loadColor ='black';
  }

  toggleLoadColor(){
    this.loadColor == 'black' ? (this.loadColor = 'red', this.loadActivated=true)
                        : (this.loadColor = 'black', this.loadActivated=false);                 
    this.deleteActivated = false;
    this.trashColor = 'black';
  }

  loadDrawing(drawing: SavedDrawing){
    if(this.loadActivated){
      if (this.state.svgState.svgs.length > 0){
        this.galleryService.setDrawingToLoad(drawing);
        this.galleryService.setDidGalleryOpen(true);
        this.dialogRef.close();
        this.dialog.open(DrawingStartedDialogComponent);
      }
      else{
      this.galleryService.loadDrawing(drawing);
      this.dialogRef.close();
      }
    }
  }

  async deleteDrawing(drawing:SavedDrawing){
    if(this.deleteActivated){
      this.loading=true;
      this.httpService.deleteDrawing(drawing._id).toPromise().then(data => {
        this.updateGallery();
        alert(data.message);
      },
      err => {
      this.updateGallery();
      alert(err.message)
      });
    }
  }

  filterDrawings(){
    this.getTagsValues();
    if(this.tagStringArray.length>0 && !this.tagStringArray.includes('')){
      let filteredDrawings:Array<SavedDrawing> = this.galleryService.filterDrawings(this.tagStringArray, this.allDrawingsInDb);
      filteredDrawings.length == 0? this.noFilteredDrawingFound = true : this.noFilteredDrawingFound = false;
    }
    else{
      this.galleryService.setDrawings(this.allDrawingsInDb);
      this.noFilteredDrawingFound = false;
    }
  }
}
