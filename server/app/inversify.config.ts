import { Container } from 'inversify';
import { Application } from './app';
import { ExportDrawingController } from './controllers/exportdrawing.controller';
import { GalleryController } from './controllers/gallery.controller';
import { SaveDrawingController } from './controllers/savedrawing.controller';
import { Server } from './server';
import { DatabaseService } from './services/DB.service';
import { FileHandler } from './services/file-handler.service';
import Types from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();
    container.bind(Types.Server).to(Server);
    container.bind(Types.Application).to(Application);
    container.bind(Types.GalleryController).to(GalleryController);
    container.bind(Types.ExportDrawingController).to(ExportDrawingController);
    container.bind(Types.SaveDrawingController).to(SaveDrawingController);
    container.bind(Types.DatabaseService).to(DatabaseService);
    container.bind(Types.FileHandler).to(FileHandler);
    return container;
};
