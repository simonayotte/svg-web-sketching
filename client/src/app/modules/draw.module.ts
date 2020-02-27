import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrushComponent } from '../components/tools/brush/brush.component';
import { ColorComponent } from '../components/tools/color/color.component';
import { DrawPageComponent } from '../components/draw-page/draw-page.component';
import { GuideComponent } from '../components/guide/guide.component';
import { LineComponent } from '../components/tools/line/line.component';
import { PencilComponent } from '../components/tools/pencil/pencil.component';
import { RectangleComponent } from '../components/tools/rectangle/rectangle.component';
import { SidebarComponent } from '../components/draw-page/sidebar/sidebar.component';
import { ColorPanelComponent } from '../components/draw-page/color-panel/color-panel.component';
import { CanvasDirective } from '../directives/canvas.directive';

@NgModule({
    declarations: [
        DrawPageComponent,
        SidebarComponent,
        BrushComponent,
        ColorComponent,
        GuideComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
        ColorComponent,
        ColorPanelComponent,
        CanvasDirective,
    ],
    imports: [CommonModule, FormsModule],
    exports: [
        DrawPageComponent,
        SidebarComponent,
        ColorPanelComponent,
        BrushComponent,
        ColorComponent,
        GuideComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
        ColorComponent,
        CanvasDirective,
    ],
})
export class DrawModule {}
