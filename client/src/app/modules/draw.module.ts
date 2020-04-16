import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPanelComponent } from '../components/draw-page/color-panel/color-panel.component';
import { DrawPageComponent } from '../components/draw-page/draw-page.component';
import { GridPanelComponent } from '../components/draw-page/grid-panel/grid-panel.component';
import { SidebarComponent } from '../components/draw-page/sidebar/sidebar.component';
import { GuideComponent } from '../components/guide/guide.component';
import { BrushComponent } from '../components/tools/brush/brush.component';
import { BucketComponent } from '../components/tools/bucket/bucket.component';
import { ColorComponent } from '../components/tools/color/color.component';
import { EllipsisComponent } from '../components/tools/ellipsis/ellipsis.component';
import { EraserComponent } from '../components/tools/eraser/eraser.component';
import { LineComponent } from '../components/tools/line/line.component';
import { PencilComponent } from '../components/tools/pencil/pencil.component';
import { PolygonComponent } from '../components/tools/polygon/polygon.component';
import { RectangleComponent } from '../components/tools/rectangle/rectangle.component';
import { CanvasGridDirective } from '../directives/canvas-grid.directive';
import { DrawDirective } from '../directives/draw.directive';
import { SelectionDirective } from '../directives/selection.directive';
import { SvgDirective } from '../directives/svg.directive';
import { AerosolComponent } from './../components/tools/aerosol/aerosol/aerosol.component';

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
        AerosolComponent,
        EraserComponent,
        BucketComponent,
        DrawDirective,
        SvgDirective,
        SelectionDirective,
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
        EraserComponent,
        BucketComponent,
        AerosolComponent,
        DrawDirective,
        SvgDirective,
        SelectionDirective,
    ],
})
export class DrawModule {}
