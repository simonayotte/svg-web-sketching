
import { expect } from 'chai';
import { ObjectID } from 'mongodb';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../../server/test/test-utils';
import { Application } from '../app';
import { DatabaseService } from '../services/DB.service';
import { FileHandler } from '../services/file-handler.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
const num = 12345;
const array = [new ObjectID(num)];

describe('saveDrawingController', () => {
    let filehandlerService: Stubbed<FileHandler>;
    let dbService: Stubbed <DatabaseService>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();

        container.unbind(Types.DatabaseService);
        container.bind(Types.DatabaseService).toConstantValue({
            addDrawingDb: sandbox.stub().resolves(undefined),
            getIdsOfDrawing: sandbox.stub().resolves(array),
        });

        container.unbind(Types.FileHandler);
        container.bind(Types.FileHandler).toConstantValue({
            saveDrawing: sandbox.stub().resolves(undefined),
        });

        filehandlerService = container.get(Types.FileHandler);
        dbService = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;

    });

    it('should return message from saveDrawing service on valid post request ', async () => {
        expect(dbService.addDrawingDb().called);
        expect(filehandlerService.saveDrawing().called);
        return supertest(app)
            .post('/savedrawing')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                console.log(response.body);
                expect(response.body.status).to.equal('200');
            });
    });
});
