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

@NgModule({
    declarations: [AppComponent, DrawPageComponent, CreateDrawingComponent, GuideComponent, BrushComponent],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, FormsModule, ColorPickerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
