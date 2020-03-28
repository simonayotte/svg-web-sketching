import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material'
import { PreviewImageComponent } from 'src/app/components/dialogs/preview-image/preview-image.component'
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service'
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';

const NAME_STRING = 'name';
const TAGS_STRING = 'tags';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
  tagStringArray: Array<string> = [];
  isPreviewWindowOpened: boolean = false;
  state:DrawState;
   
  constructor(private fb:FormBuilder, private saveDrawingService:SaveDrawingService, public dialog: MatDialog, private store:DrawStore, private drawingHandler:DrawingHandler) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  };

    saveDrawingForm = this.fb.group({
        name: ['', Validators.required],
        tags: this.fb.array([]),
    });
    get name() {
        return this.saveDrawingForm.get(NAME_STRING);
    }
    get tags() {
        return this.saveDrawingForm.get(TAGS_STRING) as FormArray;
    }
    ngOnInit() {
        this.state.globalState.isKeyHandlerActive = false;
    }

    addTag(): void {
        if (this.tags.valid) {
            this.tags.push(this.fb.control('', [Validators.required, Validators.pattern('[A-Za-z0-9-^S*$]+')]));
        }
    }

    removeTag(index: number): void {
        this.tags.removeAt(index);
    }
    
    getTagsValues(): void {
      for (let i = 0; i < this.tags.length; i++) {
          this.tagStringArray.push(this.tags.at(i).value);
      }
    } 
  
    submit(): void {
    this.drawingHandler.prepareDrawingExportation('png');
    this.saveDrawingService.setImgName(this.saveDrawingForm.controls[NAME_STRING].value);
    this.getTagsValues();
    this.saveDrawingService.setTags(this.tagStringArray);
    this.dialog.open(PreviewImageComponent);
    }
}
