import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CreateDrawingComponent } from './components/dialogs/create-drawing-dialog/create-drawing.component';
import { routes } from '../environments/routes';
import { AppComponent } from './components/app/app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DrawModule } from './services/canvas-handler/modules/draw.module';
import { DrawingStartedDialogComponent } from './components/dialogs/drawing-started-dialog/drawing-started-dialog.component';
import { PreviewImageComponent } from './components/dialogs/preview-image/preview-image.component';
import { SaveDrawingComponent } from './components/dialogs/save-drawing/save-drawing.component';

@NgModule({
    declarations: [
        AppComponent,
        CreateDrawingComponent,
        HomePageComponent,
        DrawingStartedDialogComponent,
        SaveDrawingComponent,
        PreviewImageComponent,
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
    entryComponents: [CreateDrawingComponent, DrawingStartedDialogComponent, SaveDrawingComponent, PreviewImageComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
