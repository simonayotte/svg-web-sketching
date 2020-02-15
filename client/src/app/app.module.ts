import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CreateDrawingComponent } from '../app/components/create-drawing/create-drawing.component';
import { routes } from '../environments/routes';
import { AppComponent } from './components/app/app.component';
import { BrushComponent } from './components/brush/brush.component';
import { ColorComponent } from './components/color/color.component';
import { DrawPageComponent } from './components/draw-page/draw-page.component';
import { DrawingStartedDialogComponent } from './components/drawing-started-dialog/drawing-started-dialog.component';
import { GuideComponent } from './components/guide/guide.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LineComponent } from './components/line/line.component';
import { PencilComponent } from './components/pencil/pencil.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawPageComponent,
        CreateDrawingComponent,
        GuideComponent,
        BrushComponent,
        HomePageComponent,
        ColorComponent,
        RectangleComponent,
        PencilComponent,
        DrawingStartedDialogComponent,
        LineComponent,
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
    ],
    providers: [],
    entryComponents: [CreateDrawingComponent, DrawingStartedDialogComponent, ColorComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
