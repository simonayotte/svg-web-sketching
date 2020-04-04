import { GalleryButtonColors } from 'src/app/models/enums';
import { SavedDrawing } from 'src/app/models/saved-drawing';

export class GalleryState {
    drawingsToShow: SavedDrawing[] = [];
    allDrawingsInDb: SavedDrawing[] = [];
    tagStringArray: string[] = [];
    trashColor = GalleryButtonColors.Black;
    loadColor = GalleryButtonColors.Black;
    noFilteredDrawingFound = false;
    loading = false;

}
