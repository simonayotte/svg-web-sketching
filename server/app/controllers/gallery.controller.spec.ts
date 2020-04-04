import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';
//import { DatabaseService } from '../services/DB.service';
import { Drawing} from '../../models/drawing';
import { DatabaseService } from '../services/DB.service';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
let array = [new Drawing('name',['1','2'],'allo',['','',],1,1,[1,1,1])];
describe('galleryController', () => {
    let filehandler: Stubbed<FileHandler>;
    let database: Stubbed<DatabaseService>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();

        container.unbind(Types.FileHandler);
        container.bind(Types.FileHandler).toConstantValue({
            checkAllDrawingsAreInServer: sandbox.stub().resolves(undefined),
            //exportDrawing:sandbox.stub(undefined),
            deleteDrawing: sandbox.stub(undefined),
        });
        filehandler = container.get(Types.FileHandler);

        container.unbind(Types.DatabaseService);
        container.bind(Types.DatabaseService).toConstantValue({
            getAllDrawingsDb: sandbox.stub().resolves(array),
            deleteDrawingDb: sandbox.stub().resolves(undefined),
        });
        database = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;

    });

    it('should return message from galleryController on valid get request ', async () => {
        expect(database.getAllDrawingsDb.called);
        expect(filehandler.checkAllDrawingsAreInServer().called);
        return supertest(app)
            .get('/gallery')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect('Content-Type', 'Array <Drawing>');
            });
    });

    

    
});
