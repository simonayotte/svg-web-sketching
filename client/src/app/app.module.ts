import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '../environments/routes';
import { AppComponent } from './components/app/app.component';
import { CreateDrawingComponent } from './components/dialogs/create-drawing-dialog/create-drawing.component';
import { DrawingGalleryComponent } from './components/dialogs/drawing-gallery/drawing-gallery.component';
import { DrawingStartedDialogComponent } from './components/dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { ExportDrawingComponent } from './components/dialogs/export-drawing/export-drawing.component';
import { HttpResponseDialogComponent } from './components/dialogs/http-response-dialog/http-response-dialog.component';
import { PreviewExportComponent } from './components/dialogs/preview-export/preview-export.component';
import { PreviewImageComponent } from './components/dialogs/preview-image/preview-image.component';
import { SaveDrawingComponent } from './components/dialogs/save-drawing/save-drawing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DrawModule } from './modules/draw.module';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
    declarations: [
        AppComponent,
        CreateDrawingComponent,
        HomePageComponent,
        DrawingStartedDialogComponent,
        SaveDrawingComponent,
        PreviewImageComponent,
        ExportDrawingComponent,
        PreviewExportComponent,
        DrawingGalleryComponent,
        SafeUrlPipe,
        HttpResponseDialogComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        OverlayModule,
        DrawModule,
    ],
    providers: [],
    entryComponents: [
        CreateDrawingComponent,
        DrawingStartedDialogComponent,
        SaveDrawingComponent,
        PreviewImageComponent,
        ExportDrawingComponent,
        PreviewExportComponent,
        DrawingGalleryComponent,
        HttpResponseDialogComponent
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
