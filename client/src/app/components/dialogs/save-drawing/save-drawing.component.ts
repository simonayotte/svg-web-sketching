import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { PreviewImageComponent } from 'src/app/components/dialogs/preview-image/preview-image.component';
import { FileTypes, FormValuesName, Tools } from 'src/app/models/enums';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
    tagStringArray: string[] = [];
    isPreviewWindowOpened = false;
    state: DrawState;

    constructor(
        private fb: FormBuilder,
        private saveDrawingService: SaveDrawingService,
        public dialog: MatDialog,
        private store: DrawStore,
        private drawingHandler: DrawingHandler,
    ) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    saveDrawingForm = this.fb.group({
        name: ['', Validators.required],
        tags: this.fb.array([]),
    });
    get name() {
        return this.saveDrawingForm.get(FormValuesName.Name);
    }
    get tags() {
        return this.saveDrawingForm.get(FormValuesName.Tags) as FormArray;
    }

    ngOnInit() {
        this.store.setIsKeyHandlerActive(false);
        setTimeout(() => this.store.setTool(Tools.None));
    }

    ngOnDestroy() {
        this.store.setIsKeyHandlerActive(true);
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
        this.drawingHandler.prepareDrawingExportation(FileTypes.Png);
        this.saveDrawingService.setImgName(this.saveDrawingForm.controls[FormValuesName.Name].value);
        this.getTagsValues();
        this.saveDrawingService.setTags(this.tagStringArray);
        this.dialog.open(PreviewImageComponent);
    }
}
