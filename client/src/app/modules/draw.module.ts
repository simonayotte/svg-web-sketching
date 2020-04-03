import { AerosolComponent } from './../components/tools/aerosol/aerosol/aerosol.component';
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
import { PolygonComponent } from '../components/tools/polygon/polygon.component';
import { EllipsisComponent } from '../components/tools/ellipsis/ellipsis.component';
import { CanvasGridDirective } from '../directives/canvas-grid.directive';
import { GridPanelComponent } from '../components/draw-page/grid-panel/grid-panel.component';
import { SvgDirective } from '../directives/svg.directive';
import { DrawDirective } from '../directives/draw.directive';
import { SelectionComponent } from '../components/tools/selection/selection.component';
import { EraserComponent } from '../components/tools/eraser/eraser.component';

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
        GridPanelComponent,
        CanvasGridDirective,
        PolygonComponent,
        EllipsisComponent,
        SelectionComponent,
        AerosolComponent,
        EraserComponent,
        DrawDirective,
        SvgDirective,
    ],
    imports: [CommonModule, FormsModule],
    exports: [
        DrawPageComponent,
        SidebarComponent,
        ColorPanelComponent,
        GridPanelComponent,
        BrushComponent,
        ColorComponent,
        GuideComponent,
        LineComponent,
        PencilComponent,
        RectangleComponent,
        ColorComponent,
        CanvasGridDirective,
        PolygonComponent,
        EllipsisComponent,
        SelectionComponent,
        EraserComponent,
        AerosolComponent,
        DrawDirective,
        SvgDirective,
    ],
})
export class DrawModule {}
