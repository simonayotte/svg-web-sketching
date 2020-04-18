import { Container } from 'inversify';
import { Application } from './app';
import { DateController } from './controllers/date.controller';
import { ExportDrawingController } from './controllers/exportdrawing.controller';
import { GalleryController } from './controllers/gallery.controller';
import { IndexController } from './controllers/index.controller';
import { SaveDrawingController } from './controllers/savedrawing.controller';
import { Server } from './server';
import { DateService } from './services/date.service';
import { DatabaseService } from './services/DB.service';
import { FileHandler } from './services/file-handler.service';
import { IndexService } from './services/index.service';
import Types from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();
    container.bind(Types.Server).to(Server);
    container.bind(Types.Application).to(Application);
    container.bind(Types.IndexController).to(IndexController);
    container.bind(Types.IndexService).to(IndexService);
    container.bind(Types.DateController).to(DateController);
    container.bind(Types.DateService).to(DateService);
    container.bind(Types.GalleryController).to(GalleryController);
    container.bind(Types.ExportDrawingController).to(ExportDrawingController);
    container.bind(Types.SaveDrawingController).to(SaveDrawingController);
    container.bind(Types.DatabaseService).to(DatabaseService);
    container.bind(Types.FileHandler).to(FileHandler);
    return container;
};
