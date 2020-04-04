
import { Application } from './app';
import { Container } from 'inversify';
import { DatabaseService} from '../app/services/DB.service'
import { DateController } from '../app/controllers/date.controller';
import { DateService } from './services/date.service';
import { ExportDrawingController } from '../app/controllers/exportdrawing.controller';
import { FileHandler} from '../app/services/file-handler.service'
import { GalleryController } from '../app/controllers/gallery.controller';
import { IndexController } from '../app/controllers/index.controller';
import { IndexService } from './services/index.service';
import { SaveDrawingController } from '../app/controllers/savedrawing.controller';
import { Server } from './server';
import Types from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(Types.Server).to(Server);
    container.bind(Types.Application).to(Application);
    container.bind(Types.IndexController).to(IndexController);
    container.bind(Types.IndexService).to(IndexService);
    container.bind(Types.DateController).to(DateController);
    container.bind(Types.DateService).to(DateService);
    container.bind(Types.ExportDrawingController).to(ExportDrawingController);
    container.bind(Types.SaveDrawingController).to(SaveDrawingController);
    container.bind(Types.FileHandler).to(FileHandler);
    container.bind(Types.GalleryController).to(GalleryController);
    container.bind(Types.DatabaseService).to(DatabaseService);

    return container;
};
