import { SavedDrawing } from 'src/app/models/saved-drawing';
import { GalleryButtonColors } from 'src/app/models/enums';

export class GalleryState{
    public drawingsToShow: SavedDrawing[] = [];
    public allDrawingsInDb: SavedDrawing[] = [];
    public tagStringArray: string[] = [];
    public trashColor = GalleryButtonColors.Black;
    public loadColor = GalleryButtonColors.Black;
    public noFilteredDrawingFound = false;
    public loading = false;

}