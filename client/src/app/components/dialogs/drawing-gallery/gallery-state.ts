import { GalleryButtonColors } from 'src/app/models/enums';
import { SavedDrawing } from 'src/app/models/saved-drawing';

// tslint:disable:no-inferrable-types

export class GalleryState {
    drawingsToShow: SavedDrawing[] = [];
    allDrawingsInDb: SavedDrawing[] = [];
    tagStringArray: string[] = [];
    trashColor: string = GalleryButtonColors.White;
    loadColor: string = GalleryButtonColors.White;
    noFilteredDrawingFound: boolean = false;
    loading: boolean = false;
}
