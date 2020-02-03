import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './components/app/app.component';
import { DrawPageComponent } from './components/draw-page/draw-page.component';
import { RouterModule } from '@angular/router';
import { routes } from '../environments/routes';
import { BrushComponent } from './components/brush/brush.component';
import { GuideComponent } from './components/guide/guide.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { CreateDrawingComponent } from '../app/components/create-drawing/create-drawing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PencilComponent } from './components/pencil/pencil.component';
<<<<<<< HEAD


@NgModule({
    declarations: [AppComponent, DrawPageComponent, CreateDrawingComponent, GuideComponent, BrushComponent, HomePageComponent, PencilComponent],
=======
import { RectangleComponent } from './components/rectangle/rectangle.component';

import { ColorComponent } from './components/color/color.component';

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
        PencilComponent
    ],
>>>>>>> color
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, FormsModule, ColorPickerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
