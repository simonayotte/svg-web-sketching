import { Container } from 'inversify';
import { Application } from './app';
import { DateController } from './controllers/date.controller';
import { IndexController } from './controllers/index.controller';
import { Server } from './server';
import { DateService } from './services/date.service';
import { IndexService } from './services/index.service';
import Types from './types';
import { SaveDrawingController } from './controllers/savedrawing.controller';
import { SaveDrawingService } from './services/save-drawing.service';
<<<<<<< Updated upstream
import { DatabaseService } from './services/DB.service';
=======
import {DatabaseService} from './services/database.service'
>>>>>>> Stashed changes

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.IndexService).to(IndexService);
container.bind(Types.DateController).to(DateController);
container.bind(Types.DateService).to(DateService);
container.bind(Types.SaveDrawingController).to(SaveDrawingController);
container.bind(Types.SaveDrawingService).to(SaveDrawingService);
container.bind(Types.DatabaseService).to(DatabaseService);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes

export { container };
